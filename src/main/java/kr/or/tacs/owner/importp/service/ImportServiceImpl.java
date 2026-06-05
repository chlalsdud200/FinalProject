package kr.or.tacs.owner.importp.service;

import kr.or.tacs.cmmenums.*;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.common.notification.service.INotificationService;
import kr.or.tacs.dto.owner.OwnerExportRequestDTO;
import kr.or.tacs.dto.owner.OwnerImportRequestDTO;
import kr.or.tacs.dto.owner.OwnerImportSearchDTO;
import kr.or.tacs.owner.importp.mapper.IImportMapper;
import kr.or.tacs.vo.BrokerVO;
import kr.or.tacs.vo.OwnerVO;
import kr.or.tacs.vo.transport.PortVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ImportServiceImpl implements IImportService{

    @Autowired
    private IImportMapper impMapper;

    @Autowired
    private IFileService fileService;

    @Autowired
    private INotificationService notificationService;

    @Override
    @Transactional
    public ServiceResult registImp(OwnerImportRequestDTO impDTO) throws Exception {

        Long seq = impMapper.selectImpRqstSeq();

        String today = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String irNo = String.format("IMP-%s-%05d", today, seq);

        impDTO.setIrNo(irNo);

        OwnerVO ownerInfo = impMapper.selectOwnerInfo(impDTO.getIrOwrId());

        impDTO.setIrCstmIdfNo(ownerInfo.getOwrCstmIdfNo());

        Long tfgNo = fileService.uploadFiles(
                TacsCstmSt.CSTM_REQ.name(),
                impDTO.getDocFiles(),
                impDTO.getIrOwrId(),
                TacsUserType.OWNER.name()
        );

        impDTO.setIrTfgNo(tfgNo);

        impDTO.setIrStatusCd(TacsCstmSt.CSTM_REQ.name());

        int result = impMapper.insertImp(impDTO);

        if(result > 0){
            // 관세사 알림 클릭 시 신고서 진행화면(신규 의뢰라 데이터 없음)이 아니라
            // 화주관리의 '해당 의뢰번호 상세'로 이동하도록 링크를 지정한다.
            Map<String, String> notiBindings = new HashMap<>();
            notiBindings.put("linkUrl", "/broker/clients/detail.do?reqNo=" + irNo + "&reqType=IMPORT");
            notificationService.registNotification(
                "CSTM_REQUESTED",
                irNo,
                impDTO.getIrOwrId(),
                notiBindings
            );
            return ServiceResult.OK;
        }
        return ServiceResult.FAILED;
    }

    @Override
    public List<PortVO> retrivePortList() {
        return impMapper.selectPortList();
    }

    @Override
    public List<OwnerImportRequestDTO> retriveImpList(OwnerImportSearchDTO searchDTO) {
        return impMapper.selectImpList(searchDTO);
    }

    @Override
    public List<BrokerVO> retriveBrokerList() {
        return impMapper.selectBrokerList();
    }

    @Override
    public OwnerVO retriveOwnerInfo(String owrId) {
        return impMapper.selectOwnerInfo(owrId);
    }

    @Override
    public OwnerImportRequestDTO retriveImp(String irNo) {
        return impMapper.selectImp(irNo);
    }

    @Override
    public int retriveImpCount(OwnerImportSearchDTO searchDTO) {
        return impMapper.selectImpCount(searchDTO);
    }

    @Override
    @Transactional
    public ServiceResult modifyImp(OwnerImportRequestDTO impDTO) throws Exception {

        String irNo = impDTO.getIrNo();

        OwnerImportRequestDTO saved = impMapper.selectImp(irNo);

        if (saved == null) {
            return ServiceResult.FAILED;
        }

        // 로그인한 화주와 DB의 화주가 같은지 확인 (안전장치1)
        if (!impDTO.getIrOwrId().equals(saved.getIrOwrId())) {
            return ServiceResult.FAILED;
        }

        // 클라이언트로부터 받은 수입번호와 조회한 수입번호가 같은지 확인 (안전장치1)
        if (!impDTO.getIrNo().equals(saved.getIrNo())) {
            return ServiceResult.FAILED;
        }

        int result = impMapper.updateImp(impDTO);

        if (result <= 0) {
            return ServiceResult.FAILED;
        }

        // 기존 첨부파일 삭제 or 삭제여부 Y로 바꾸기(일단 삭제여부 Y 처리중)
        if (impDTO.getDeleteDfiFileNoList() != null && !impDTO.getDeleteDfiFileNoList().isEmpty()){
            for (Long dfiFileNo : impDTO.getDeleteDfiFileNoList()){
                fileService.deleteFile(dfiFileNo);
            }
        }

        // 업데이트시 새 첨부파일 추가 업로드 처리
        if(impDTO.getDocFiles() != null && !impDTO.getDocFiles().isEmpty() && impDTO.getDocFiles().stream().anyMatch(file -> !file.isEmpty())){
            fileService.uploadFilesToGroup(
                    impDTO.getIrTfgNo(),
                    TacsCstmSt.CSTM_REQ.name(),
                    impDTO.getDocFiles(),
                    impDTO.getIrOwrId(),
                    TacsUserType.OWNER.name()
            );
        }

        // 보완요청시 보완요청 테이블 업데이트 및 상태값(보완제출로) 업데이트
        if("SUPP_SUBMIT".equals(impDTO.getSubmitType())){

            if(impDTO.getSrSubmitCn() == null || impDTO.getSrSubmitCn().trim().isEmpty()){
                return ServiceResult.FAILED;
            }

            impDTO.setSrRefBizCd(TacsBizCd.IMPORT.getCode());
            impDTO.setBeforeSrStatusCd(TacsSuppSt.REQ.getCode());
            impDTO.setSrStatusCd(TacsSuppSt.SUB.getCode());

            int suppResult = impMapper.updateImpSupp(impDTO);

            if(suppResult <= 0){
                return ServiceResult.FAILED;
            }

            impDTO.setBeforeIrStatusCd(TacsCstmSt.CSTM_SUPP.getCode());
            impDTO.setIrStatusCd(TacsCstmSt.CSTM_SUPP_SUB.getCode());
            int statusResult = impMapper.updateImpStatus(impDTO);

            if(statusResult <=0){
                return ServiceResult.FAILED;
            }

            // 관세사가 화주에게 요청한 보완자료를 화주가 제출 → 요청한 관세사에게 통지
            Map<String, String> suppBindings = new HashMap<>();
            suppBindings.put("reqNo", irNo);
            suppBindings.put("linkUrl", "/broker/clients/detail.do?reqNo=" + irNo + "&reqType=IMPORT");
            notificationService.registNotification(
                "CSTM_SUPP_SUBMITTED",
                irNo,
                impDTO.getIrOwrId(),
                suppBindings
            );
        }

        return ServiceResult.OK;
    }

    @Override
    public OwnerImportRequestDTO retriveSupp(String irNo) {
        return impMapper.selectSupp(irNo);
    }
}
