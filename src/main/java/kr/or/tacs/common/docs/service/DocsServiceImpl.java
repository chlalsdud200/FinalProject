package kr.or.tacs.common.docs.service;

import kr.or.tacs.common.docs.mapper.DocsMapper;
import kr.or.tacs.common.file.service.DriveUploadAsyncService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.dto.common.docs.DocsItemDTO;
import kr.or.tacs.dto.common.docs.DocsListResponseDTO;
import kr.or.tacs.dto.common.docs.DocsStorageDTO;
import kr.or.tacs.dto.common.docs.DocsTrashItemDTO;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.PaginationInfoVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.text.DecimalFormat;
import java.util.*;

/*
 * 문서함 서비스 구현체
 *
 * 이 클래스의 역할:
 * 1. 문서함 목록 조회
 * 2. 폴더 생성
 * 3. 파일 업로드
 * 4. 파일/폴더 이름 변경
 * 5. 파일/폴더 휴지통 이동
 *
 * 사용하는 주요 테이블:
 * - DOCS_FOLDER     : 폴더 구조 관리
 * - DOCS_FILE_DATA  : 실제 파일 원장 관리
 * - DOCS_BOX_FILE   : 문서함 화면에 보이는 파일 항목 관리
 * - DOCS_STORAGE    : 사용자별 저장용량 관리
 */
@Service
@RequiredArgsConstructor
public class DocsServiceImpl implements DocsService {

    /*
     * MyBatis Mapper
     * DB 조회/등록/수정은 전부 DocsMapper를 통해 실행한다.
     */
    private final DocsMapper docsMapper;

    private final DriveUploadAsyncService driveUploadAsyncService;

    /*
     * 개별 파일 최대 크기 제한
     *
     * 20L * 1024 * 1024
     * = 20MB
     *
     * application.properties의 multipart 설정과 맞추기 위한 값이다.
     */
    private static final long MAX_FILE_SIZE = 20L * 1024 * 1024;

    /*
     * 문서함 목록 조회
     *
     * folderId가 없으면 사용자의 ROOT 폴더 기준으로 조회한다.
     * folderId가 있으면 해당 폴더의 하위 폴더와 파일 목록을 조회한다.
     *
     * 반환값 DocsListResponseDTO에는 다음이 들어간다.
     * - items      : 현재 폴더의 파일/폴더 목록
     * - breadcrumb : 현재 폴더까지의 경로
     * - storage    : 사용자 저장공간 정보
     */
    @Override
    @Transactional
    public DocsListResponseDTO retriveDocsList(String folderId, CustomUser user) {

        /*
         * 화면에서 넘어온 folderId를 실제 DB 폴더번호로 변환한다.
         *
         * folderId가 null이면 ROOT 폴더를 조회하거나 생성한다.
         * folderId가 있으면 해당 폴더가 로그인 사용자의 폴더인지 검사한다.
         */
        Long folderNo = resolveFolderNo(folderId, user);

        /*
         * 현재 폴더 안에 있는 하위 폴더와 파일을 합쳐서 화면에 내려준다.
         */
        List<DocsItemDTO> items = new ArrayList<>();

        /*
         * 현재 폴더의 하위 폴더 목록 조회
         * DOCS_FOLDER 조회
         */
        items.addAll(docsMapper.selectFolderItems(
                folderNo,
                user.getLoginId(),
                user.getRoleCd()
        ));

        /*
         * 현재 폴더의 파일 목록 조회
         * DOCS_BOX_FILE + DOCS_FILE_DATA 조회
         */
        items.addAll(docsMapper.selectFileItems(
                folderNo,
                user.getLoginId(),
                user.getRoleCd()
        ));

        /*
         * 화면에 반환할 응답 DTO 생성
         */
        DocsListResponseDTO response = new DocsListResponseDTO();

        /*
         * 현재 폴더의 파일/폴더 목록 세팅
         */
        response.setItems(items);

        /*
         * breadcrumb 세팅
         * 예: 전체 문서 > 업무자료 > 수입통관
         */
        response.setBreadcrumb(docsMapper.selectBreadcrumb(
                folderNo,
                user.getLoginId(),
                user.getRoleCd()
        ));

        /*
         * 사용자 저장공간 정보 세팅
         * 저장공간 행이 없으면 생성 후 다시 조회한다.
         */
        response.setStorage(ensureStorage(user));

        return response;
    }

    /*
     * 폴더 생성
     *
     * name     : 새 폴더명
     * parentId : 부모 폴더 ID
     * user     : 로그인 사용자
     */
    @Override
    @Transactional
    public void registFolder(String name, String parentId, CustomUser user) {

        /*
         * 폴더명이 비어 있으면 생성할 수 없다.
         */
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("폴더명을 입력해야 합니다.");
        }

        /*
         * 부모 폴더 번호를 구한다.
         * parentId가 없으면 ROOT 폴더가 부모가 된다.
         */
        Long parentNo = resolveFolderNo(parentId, user);

        /*
         * 새 폴더번호 생성
         * SEQ_DOCS_FOLDER.NEXTVAL 조회
         */
        Long folderNo = docsMapper.selectDocsFolderNo();

        /*
         * DOCS_FOLDER에 새 폴더 INSERT
         */
        docsMapper.insertFolder(
                folderNo,
                parentNo,
                user.getLoginId(),
                user.getRoleCd(),
                name.trim()
        );
    }

    /*
     * 파일 업로드
     *
     * files    : 업로드 파일 목록
     * folderId : 업로드 대상 폴더 ID
     * user     : 로그인 사용자
     *
     * 처리 순서:
     * 1. 업로드 대상 폴더 확인
     * 2. 저장공간 확인
     * 3. 파일 크기 검증
     * 4. 기존 파일 목록 확인 (중복 방지)
     * 5. 실제 파일 저장
     * 6. DOCS_FILE_DATA INSERT
     * 7. DOCS_BOX_FILE INSERT
     * 8. DOCS_STORAGE 사용량 UPDATE
     */
    @Override
    @Transactional
    public void registFiles(List<MultipartFile> files, String folderId, CustomUser user) throws Exception {

        /*
         * 업로드 파일이 없으면 아무 작업도 하지 않는다.
         */
        if (files == null || files.isEmpty()) {
            return;
        }

        /*
         * 업로드할 폴더번호 확인
         */
        Long folderNo = resolveFolderNo(folderId, user);

        /*
         * 로그인 사용자의 저장공간 정보 확인
         * 없으면 DOCS_STORAGE에 새 행을 만든다.
         */
        DocsStorageDTO storage = ensureStorage(user);

        /*
         * 이번 요청에서 업로드되는 전체 파일 크기 합계
         * 저장공간 초과 여부를 확인하기 위해 먼저 계산한다.
         */
        long totalUploadSize = 0;

        /*
         * 파일별 크기 검증
         */
        for (MultipartFile file : files) {

            /*
             * 비어 있는 파일은 건너뛴다.
             */
            if (file == null || file.isEmpty()) {
                continue;
            }

            /*
             * 개별 파일이 20MB를 초과하면 업로드 중단
             */
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new IllegalArgumentException("20MB 이하 파일만 업로드 가능합니다.");
            }

            /*
             * 전체 업로드 크기에 현재 파일 크기 누적
             */
            totalUploadSize += file.getSize();
        }

        /*
         * 사용자 저장공간 초과 여부 확인
         *
         * 현재 사용량 + 이번 업로드 크기 > 최대 용량이면 업로드 불가
         */
        if (storage.getUsedCapa() + totalUploadSize > storage.getMaxCapa()) {
            throw new IllegalStateException("문서함 저장 용량이 부족합니다.");
        }

        /*
         * 현재 폴더에 존재하는 파일 이름 목록을 가져온다. (중복 방지용)
         */
        List<DocsItemDTO> existingFiles = docsMapper.selectFileItems(folderNo, user.getLoginId(), user.getRoleCd());
        Set<String> existingNames = new HashSet<>();
        for (DocsItemDTO item : existingFiles) {
            existingNames.add(item.getName());
        }

        /*
         * 실제 파일 저장 및 DB INSERT 처리
         */
        for (MultipartFile file : files) {

            /*
             * 비어 있는 파일은 건너뛴다.
             */
            if (file == null || file.isEmpty()) {
                continue;
            }

            /*
             * 실제 파일을 Google Drive에 저장하고,
             * DOCS_FILE_DATA에 넣을 FileInfoDTO를 만든다.
             */
            FileInfoDTO fileInfo = saveDriveFile(file, user);

            /*
             * 중복되지 않는 표시파일명 생성
             */
            String displayName = fileInfo.getDfiOrgNm();
            if (existingNames.contains(displayName)) {
                int dotIndex = displayName.lastIndexOf(".");
                String nameWithoutExt = dotIndex == -1 ? displayName : displayName.substring(0, dotIndex);
                String ext = dotIndex == -1 ? "" : displayName.substring(dotIndex);

                int count = 1;
                do {
                    displayName = nameWithoutExt + "(" + count + ")" + ext;
                    count++;
                } while (existingNames.contains(displayName));
            }
            existingNames.add(displayName);

            /*
             * DOCS_FILE_DATA의 PK 생성
             */
            Long dfiNo = docsMapper.selectDocsFileNo();

            /*
             * FileInfoDTO에 파일번호 세팅
             */
            fileInfo.setDfiFileNo(dfiNo);

            /*
             * DOCS_FILE_DATA INSERT
             *
             * 여기에는 실제 파일 원장 정보가 들어간다.
             * 예:
             * - 원본파일명
             * - UUID 저장파일명
             * - 파일크기
             * - 저장경로
             * - 확장자
             * - MIME 타입
             */
            docsMapper.insertFileData(fileInfo);

            /*
             * DOCS_BOX_FILE의 PK 생성
             */
            Long dbfNo = docsMapper.selectDocsBoxFileNo();

            /*
             * DOCS_BOX_FILE INSERT
             *
             * 여기에는 문서함 화면에 보이는 파일 항목 정보가 들어간다.
             * 예:
             * - 현재 폴더번호
             * - 실제 파일번호
             * - 화면 표시파일명
             * - 휴지통 여부
             */
            docsMapper.insertBoxFile(
                    dbfNo,
                    folderNo,
                    dfiNo,
                    displayName
            );

            DriveUploadAsyncService.DriveUploadCommand command =
                    new DriveUploadAsyncService.DriveUploadCommand(
                            dfiNo,
                            file.getBytes(), // WAS 로하면 동시에만약 파일을 업로드하면 100mb 10mb문제가 될 수 있음 , Byte로 하면 상관없음 중복x
                            fileInfo.getDfiStrNm(),
                            file.getContentType(),
                            fileInfo.getDfiPath()
                    );
            registerAfterCommitUpload(command);
        }

        /*
         * 업로드가 끝나면 사용자 저장공간 사용량 증가
         */
        docsMapper.updateStorageUsed(
                user.getLoginId(),
                user.getRoleCd(),
                totalUploadSize
        );
    }

    /*
     * 파일명 또는 폴더명 수정
     *
     * id 예시:
     * - file-10
     * - folder-3
     *
     * file- 로 시작하면 파일명 수정
     * folder- 로 시작하면 폴더명 수정
     */
    @Override
    @Transactional
    public void modifyName(String id, String name, CustomUser user) {

        /*
         * 수정 대상 ID 또는 새 이름이 없으면 수정 불가
         */
        if (id == null || id.isBlank() || name == null || name.isBlank()) {
            throw new IllegalArgumentException("수정할 이름이 없습니다.");
        }

        /*
         * 파일명 수정
         *
         * 실제 원본파일명인 DOCS_FILE_DATA.DFI_ORG_NM을 바꾸는 것이 아니라
         * 문서함 표시파일명인 DOCS_BOX_FILE.DBF_DISP_NM을 바꾼다.
         */
        if (id.startsWith("file-")) {
            docsMapper.updateFileName(
                    parseId(id),
                    user.getLoginId(),
                    user.getRoleCd(),
                    name.trim()
            );
            return;
        }

        /*
         * 폴더명 수정
         *
         * DOCS_FOLDER.DF_NM 수정
         */
        if (id.startsWith("folder-")) {
            docsMapper.updateFolderName(
                    parseId(id),
                    user.getLoginId(),
                    user.getRoleCd(),
                    name.trim()
            );
            return;
        }

        /*
         * file- 또는 folder- 형식이 아니면 잘못된 요청
         */
        throw new IllegalArgumentException("알 수 없는 문서함 항목입니다.");
    }

    /*
     * 파일/폴더 삭제
     *
     * 실제 삭제가 아니라 휴지통 이동이다.
     *
     * file- 로 시작하면 DOCS_BOX_FILE.DBF_TRASH_YN = 'Y'
     * folder- 로 시작하면 DOCS_FOLDER.DF_DEL_YN = 'Y'
     */
    @Override
    @Transactional
    public void deleteDocsItems(List<String> ids, CustomUser user) {

        /*
         * 삭제할 항목이 없으면 종료
         */
        if (ids == null || ids.isEmpty()) {
            return;
        }

        /*
         * 여러 개를 한 번에 삭제할 수 있으므로 반복 처리
         */
        for (String id : ids) {

            /*
             * 빈 ID는 건너뛴다.
             */
            if (id == null || id.isBlank()) {
                continue;
            }

            /*
             * 파일 휴지통 이동
             */
            if (id.startsWith("file-")) {
                docsMapper.updateFileTrash(
                        parseId(id),
                        user.getLoginId(),
                        user.getRoleCd()
                );
            }

            /*
             * 폴더 휴지통 이동
             */
            if (id.startsWith("folder-")) {
                docsMapper.updateFolderTrash(
                        parseId(id),
                        user.getLoginId(),
                        user.getRoleCd()
                );
            }
        }
    }

    /*
     * 파일 다운로드용 파일 정보 조회
     *
     * id 예시:
     * - file-10
     *
     * DOCS_BOX_FILE.DBF_NO 기준으로 로그인 사용자의 파일인지 확인한 뒤
     * 실제 저장 파일명, 저장 경로, 표시 파일명을 조회한다.
     */
    @Override
    @Transactional(readOnly = true)
    public FileInfoDTO retriveDownloadFile(String id, CustomUser user) {
        if (id == null || id.isBlank() || !id.startsWith("file-")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "다운로드할 파일이 올바르지 않습니다.");
        }

        FileInfoDTO fileInfo = docsMapper.selectDownloadFile(
                parseId(id),
                user.getLoginId(),
                user.getRoleCd()
        );

        // 본인 소유가 아니거나 존재하지 않으면 동일하게 404로 응답한다.
        // (남의 파일이 '존재하는지' 여부 자체를 노출하지 않기 위함)
        if (fileInfo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "파일을 찾을 수 없습니다.");
        }

        return fileInfo;
    }

    /*
     * Google Drive 업로드용 파일 정보 생성
     *
     * 처리 순서:
     * 1. UUID 저장명 생성
     * 2. Drive 논리 경로 생성
     * 3. DOCS_FILE_DATA INSERT용 FileInfoDTO 생성
     *
     * 실제 Drive 업로드는 DB commit 이후 DriveUploadAsyncService에서 처리한다.
     */
    private FileInfoDTO saveDriveFile(MultipartFile file, CustomUser user) throws Exception {

        /*
         * 사용자가 업로드한 원본 파일명
         */
        String originalFilename = file.getOriginalFilename();

        /*
         * 원본 파일명이 없으면 저장할 수 없다.
         */
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("원본 파일명이 없습니다.");
        }

        /*
         * 파일명에 경로문자가 들어오면 제거한다.
         *
         * 예:
         * a/b.pdf  -> a_b.pdf
         * a\b.pdf  -> a_b.pdf
         */
        String safeOriginalName = originalFilename.replace("\\", "_").replace("/", "_");

        /*
         * 서버에 실제 저장할 파일명
         *
         * 원본파일명 그대로 저장하면 같은 이름의 파일이 충돌할 수 있으므로
         * UUID를 앞에 붙인다.
         */
        String saveName = UUID.randomUUID() + "_" + safeOriginalName;

        String drivePath = makeDrivePath(user);

        /*
         * DOCS_FILE_DATA에 INSERT할 DTO 생성
         */
        FileInfoDTO fileInfo = new FileInfoDTO();

        /*
         * 업로드한 사용자 ID
         */
        fileInfo.setDfiActorId(user.getLoginId());

        /*
         * 업로드한 사용자 권한/액터 타입
         * 예: OWNER, BROKER, WAREHOUSE_MANAGER
         */
        fileInfo.setDfiActorType(user.getRoleCd());

        /*
         * 사용자가 올린 원본파일명
         */
        fileInfo.setDfiOrgNm(originalFilename);

        /*
         * 서버에 저장된 UUID 파일명
         */
        fileInfo.setDfiStrNm(saveName);

        /*
         * 파일 크기
         */
        fileInfo.setDfiSize(file.getSize());

        /*
         * Drive 논리 경로
         */
        fileInfo.setDfiPath(drivePath);

        /*
         * 확장자
         */
        fileInfo.setDfiExt(getExtension(originalFilename));

        /*
         * MIME 타입
         *
         * 현재 DB의 DFI_MIME_TY가 VARCHAR2(20)일 수 있으므로 길이 제한.
         * 나중에 DFI_MIME_TY를 VARCHAR2(100) 이상으로 늘리면 이 제한은 제거해도 된다.
         */
        fileInfo.setDfiMimeTy(limitLength(file.getContentType(), 20));

        /*
         * 실제 파일 원장 삭제 여부
         * 최초 업로드 시 삭제되지 않은 상태이므로 N
         */
        fileInfo.setDfiDelYn("N");

        /*
         * 파일 업무구분
         *
         * CLOUD = 개인 문서함 파일
         * BIZ   = 업무 첨부파일
         * RES   = 자료실 파일
         */
        fileInfo.setDfiBizTyCd("CLOUD");
        fileInfo.setDfiDriveFileId(null);
        fileInfo.setDfiUploadSttsCd("UPLOADING");

        return fileInfo;
    }

    private void registerAfterCommitUpload(DriveUploadAsyncService.DriveUploadCommand command) {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            driveUploadAsyncService.uploadAsync(command);
                        }
                    }
            );
            return;
        }

        driveUploadAsyncService.uploadAsync(command);
    }

    /*
     * Drive 논리 경로 생성
     *
     * 반환 예:
     * /CLOUD/OWNER/owner01/2026/05/07
     */
    private String makeDrivePath(CustomUser user) {
        Calendar cal = Calendar.getInstance();
        String year = String.valueOf(cal.get(Calendar.YEAR));
        String month = new DecimalFormat("00").format(cal.get(Calendar.MONTH) + 1);
        String day = new DecimalFormat("00").format(cal.get(Calendar.DATE));
        return "/CLOUD/" + user.getRoleCd() + "/" + user.getLoginId() + "/" + year + "/" + month + "/" + day;
    }

    /*
     * 파일 확장자 추출
     *
     * 예:
     * test.pdf -> pdf
     * image.PNG -> png
     */
    private String getExtension(String originalFilename) {
        int dotIndex = originalFilename.lastIndexOf(".");

        /*
         * 점이 없으면 확장자 없음
         */
        if (dotIndex == -1) {
            return "";
        }

        /*
         * 점 뒤의 문자열을 소문자로 반환
         */
        return originalFilename.substring(dotIndex + 1).toLowerCase();
    }

    /*
     * 문자열 길이 제한
     *
     * DB 컬럼 길이보다 긴 값이 들어가면 ORA-12899가 발생할 수 있으므로
     * 지정 길이까지만 잘라서 저장한다.
     */
    private String limitLength(String value, int maxLength) {
        if (value == null) {
            return null;
        }

        if (value.length() <= maxLength) {
            return value;
        }

        return value.substring(0, maxLength);
    }

    /*
     * 사용자 저장공간 조회 또는 생성
     *
     * 문서함을 처음 사용하는 사용자는 DOCS_STORAGE에 행이 없을 수 있다.
     * 그래서 없으면 기본 용량으로 INSERT하고 다시 조회한다.
     */
    private DocsStorageDTO ensureStorage(CustomUser user) {

        /*
         * 현재 로그인 사용자의 저장공간 조회
         */
        DocsStorageDTO storage = docsMapper.selectStorage(
                user.getLoginId(),
                user.getRoleCd()
        );

        /*
         * 저장공간 행이 없으면 생성
         */
        if (storage == null) {
            docsMapper.insertStorage(
                    user.getLoginId(),
                    user.getRoleCd()
            );

            /*
             * 생성 후 다시 조회
             */
            storage = docsMapper.selectStorage(
                    user.getLoginId(),
                    user.getRoleCd()
            );
        }

        return storage;
    }

    /*
     * 화면에서 받은 folderId를 실제 폴더번호로 변환
     *
     * folderId가 없으면 ROOT 폴더를 반환한다.
     * folderId가 있으면 해당 폴더가 로그인 사용자의 폴더인지 검사한다.
     */
    private Long resolveFolderNo(String folderId, CustomUser user) {

        /*
         * folderId가 없으면 사용자의 ROOT 폴더 기준으로 처리
         */
        if (folderId == null || folderId.isBlank() || "null".equals(folderId)) {
            return ensureRootFolder(user);
        }

        /*
         * folder-10 형태에서 10만 추출
         */
        Long folderNo = parseId(folderId);

        /*
         * 해당 폴더가 로그인 사용자의 폴더인지 확인
         *
         * 이 검사가 없으면 다른 사용자의 폴더번호를 넣어서 접근할 수 있는 문제가 생긴다.
         */
        int count = docsMapper.countFolderOwner(
                folderNo,
                user.getLoginId(),
                user.getRoleCd()
        );

        /*
         * 소유자가 아니면 접근 차단
         */
        if (count == 0) {
            throw new IllegalArgumentException("접근할 수 없는 폴더입니다.");
        }

        return folderNo;
    }

    /*
     * 사용자 ROOT 폴더 조회 또는 생성
     *
     * 문서함은 폴더 구조가 필요하므로
     * 사용자마다 숨김 ROOT 폴더가 하나 있어야 단다.
     */
    private Long ensureRootFolder(CustomUser user) {

        /*
         * 로그인 사용자의 ROOT 폴더 조회
         */
        Long rootNo = docsMapper.selectRootFolderNo(
                user.getLoginId(),
                user.getRoleCd()
        );

        /*
         * ROOT 폴더가 없으면 생성
         */
        if (rootNo == null) {
            rootNo = docsMapper.selectDocsFolderNo();

            docsMapper.insertRootFolder(
                    rootNo,
                    user.getLoginId(),
                    user.getRoleCd()
            );
        }

        return rootNo;
    }

    /*
     * 화면 ID에서 실제 DB 번호만 추출
     *
     * 예:
     * file-10   -> 10
     * folder-3  -> 3
     * 7         -> 7
     */
    private Long parseId(String id) {
        String raw = id.contains("-") ? id.substring(id.indexOf("-") + 1) : id;
        return Long.parseLong(raw);
    }

    /*
     * 휴지통 목록 조회
     *
     * page : 현재 페이지 번호
     * user : 로그인 사용자
     */
    @Override
    @Transactional(readOnly = true)
    public PaginationInfoVO<DocsTrashItemDTO> retriveTrashList(int page, CustomUser user) {
        PaginationInfoVO<DocsTrashItemDTO> pagingVO = new PaginationInfoVO<>(10, 5);
        pagingVO.setCurrentPage(page);

        int totalRecord = docsMapper.countTrashItems(user.getLoginId(), user.getRoleCd());
        pagingVO.setTotalRecord(totalRecord);

        if (totalRecord > 0) {
            List<DocsTrashItemDTO> list = docsMapper.selectTrashItems(
                    pagingVO,
                    user.getLoginId(),
                    user.getRoleCd()
            );
            pagingVO.setDataList(list);
        }

        return pagingVO;
    }

    @Override
    @Transactional
    public void deleteTrashItemsPerm(List<String> ids, CustomUser user) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        for (String id : ids) {
            if (id == null || id.isBlank()) {
                continue;
            }

            if (id.startsWith("file-")) {
                Long dbfNo = parseId(id);
                docsMapper.deleteTrashFileDataPerm(dbfNo, user.getLoginId(), user.getRoleCd());
                docsMapper.deleteTrashFilePerm(dbfNo, user.getLoginId(), user.getRoleCd());
            } else if (id.startsWith("folder-")) {
                Long folderNo = parseId(id);
                docsMapper.deleteTrashFolderFileDataPerm(folderNo, user.getLoginId(), user.getRoleCd());
                docsMapper.deleteTrashFolderFilesPerm(folderNo, user.getLoginId(), user.getRoleCd());
                docsMapper.deleteTrashFolderPerm(folderNo, user.getLoginId(), user.getRoleCd());
            }
        }
    }

    @Override
    @Transactional
    public void emptyTrashAll(CustomUser user) {
        docsMapper.emptyTrashFileData(user.getLoginId(), user.getRoleCd());
        docsMapper.emptyTrashFiles(user.getLoginId(), user.getRoleCd());
        docsMapper.emptyTrashFolderFileData(user.getLoginId(), user.getRoleCd());
        docsMapper.emptyTrashFolderFiles(user.getLoginId(), user.getRoleCd());
        docsMapper.emptyTrashFolders(user.getLoginId(), user.getRoleCd());
    }
}
