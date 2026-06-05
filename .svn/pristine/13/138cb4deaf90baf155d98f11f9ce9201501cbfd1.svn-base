package kr.or.tacs.common.file.controller;

import kr.or.tacs.common.file.service.FileAccessAuthorizer;
import kr.or.tacs.common.file.service.GoogleDriveService;
import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.vo.common.AuthUserVO;
import kr.or.tacs.vo.common.CustomUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FileDownloadControllerTest {

    @Mock
    private IFileService fileService;

    @Mock
    private GoogleDriveService googleDriveService;

    @Mock
    private FileAccessAuthorizer fileAccessAuthorizer;

    @InjectMocks
    private FileDownloadController controller;

    private CustomUser warehouseManager;
    private FileInfoDTO fileInfo;

    @BeforeEach
    void setUp() {
        AuthUserVO authUser = new AuthUserVO();
        authUser.setLoginId("warehouseB");
        authUser.setRoleCd("WAREHOUSE_MANAGER");
        warehouseManager = new CustomUser(authUser);

        fileInfo = new FileInfoDTO();
        fileInfo.setDfiFileNo(999L);
    }

    @Test
    @DisplayName("권한 없는 파일 다운로드 요청은 파일 존재 여부를 숨기기 위해 404를 반환해야 함")
    void download_ShouldReturnNotFound_WhenAccessDenied() {
        // given
        when(fileService.getFileInfo(999L)).thenReturn(fileInfo);
        doThrow(new AccessDeniedException("접근 권한 없음"))
                .when(fileAccessAuthorizer).checkDownloadable(fileInfo, warehouseManager);

        // when
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> controller.download(999L, warehouseManager));

        // then
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verifyNoInteractions(googleDriveService);
    }

    @Test
    @DisplayName("존재하지 않는 파일 다운로드 요청도 권한 없는 요청과 동일하게 404를 반환해야 함")
    void download_ShouldReturnNotFound_WhenFileDoesNotExist() {
        // given
        when(fileService.getFileInfo(999L)).thenReturn(null);

        // when
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> controller.download(999L, warehouseManager));

        // then
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verifyNoInteractions(googleDriveService);
    }

    @Test
    @DisplayName("권한 없는 파일 미리보기 요청도 파일 존재 여부를 숨기기 위해 404를 반환해야 함")
    void preview_ShouldReturnNotFound_WhenAccessDenied() {
        // given
        when(fileService.getFileInfo(999L)).thenReturn(fileInfo);
        doThrow(new AccessDeniedException("접근 권한 없음"))
                .when(fileAccessAuthorizer).checkDownloadable(fileInfo, warehouseManager);

        // when
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> controller.preview(999L, warehouseManager));

        // then
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verifyNoInteractions(googleDriveService);
    }
}
