package kr.or.tacs.common.file.service;

import kr.or.tacs.common.file.mapper.IFileMapper;
import kr.or.tacs.dto.FileAccessContextDTO;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.AuthUserVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FileAccessAuthorizerTest {

    @Mock
    private IFileMapper fileMapper;

    @InjectMocks
    private FileAccessAuthorizer authorizer;

    private CustomUser normalUser;
    private FileInfoDTO otherUserFile;

    @BeforeEach
    void setUp() {
        AuthUserVO authUser = new AuthUserVO();
        authUser.setLoginId("userA");
        authUser.setRoleCd("OWNER");
        normalUser = new CustomUser(authUser);

        otherUserFile = new FileInfoDTO();
        otherUserFile.setDfiFileNo(999L);
        otherUserFile.setDfiActorId("userB");
        otherUserFile.setDfiBizTyCd("UNKNOWN");
    }

    @Test
    @DisplayName("타인의 매핑되지 않은 파일 접근 시 차단되어야 함 (Deny by Default)")
    void checkDownloadable_ShouldDeny_WhenUnmappedOtherFile() {
        // given
        when(fileMapper.selectFileAccessContext(anyLong())).thenReturn(null);

        // when & then
        assertThrows(AccessDeniedException.class, () -> {
            authorizer.checkDownloadable(otherUserFile, normalUser);
        });
    }

    @Test
    @DisplayName("자료실(RES) 파일은 화이트리스트에 의해 허용되어야 함")
    void checkDownloadable_ShouldAllow_WhenResourceFile() {
        // given
        otherUserFile.setDfiBizTyCd("RES");
        // Business Context는 없다고 가정
        when(fileMapper.selectFileAccessContext(anyLong())).thenReturn(null);

        // when & then
        assertDoesNotThrow(() -> {
            authorizer.checkDownloadable(otherUserFile, normalUser);
        });
    }

    @Test
    @DisplayName("시스템 관리자는 모든 파일에 접근 가능해야 함")
    void checkDownloadable_ShouldAllow_WhenSystemAdmin() {
        // given
        AuthUserVO adminAuth = new AuthUserVO();
        adminAuth.setLoginId("admin");
        adminAuth.setRoleCd("SYSTEM_ADMIN");
        CustomUser adminUser = new CustomUser(adminAuth);

        // when & then
        assertDoesNotThrow(() -> {
            authorizer.checkDownloadable(otherUserFile, adminUser);
        });
    }

    @Test
    @DisplayName("담당 운송관리자는 운송접수건에 연결된 파일에 접근 가능해야 함")
    void checkDownloadable_ShouldAllow_WhenTransportManagerOwnsTransportContext() {
        // given
        AuthUserVO tmAuth = new AuthUserVO();
        tmAuth.setLoginId("999");
        tmAuth.setRoleCd("TRANSPORT_MANAGER");
        CustomUser transportManager = new CustomUser(tmAuth);

        FileAccessContextDTO context = new FileAccessContextDTO();
        context.setTfgNo(100L);
        context.setOwnerId("123");
        context.setTransportManagerId("999");
        when(fileMapper.selectFileAccessContext(anyLong())).thenReturn(context);

        // when & then
        assertDoesNotThrow(() -> {
            authorizer.checkDownloadable(otherUserFile, transportManager);
        });
    }

    @Test
    @DisplayName("담당자가 아닌 운송관리자는 운송접수건 파일 접근이 차단되어야 함")
    void checkDownloadable_ShouldDeny_WhenOtherTransportManagerAccessesTransportContext() {
        // given
        AuthUserVO tmAuth = new AuthUserVO();
        tmAuth.setLoginId("998");
        tmAuth.setRoleCd("TRANSPORT_MANAGER");
        CustomUser transportManager = new CustomUser(tmAuth);

        FileAccessContextDTO context = new FileAccessContextDTO();
        context.setTfgNo(100L);
        context.setOwnerId("123");
        context.setTransportManagerId("999");
        when(fileMapper.selectFileAccessContext(anyLong())).thenReturn(context);

        // when & then
        assertThrows(AccessDeniedException.class, () -> {
            authorizer.checkDownloadable(otherUserFile, transportManager);
        });
    }

    @Test
    @DisplayName("담당 창고관리자는 보세반출 요청건에 연결된 파일에 접근 가능해야 함")
    void checkDownloadable_ShouldAllow_WhenWarehouseManagerOwnsOutboundContext() {
        // given
        AuthUserVO wmAuth = new AuthUserVO();
        wmAuth.setLoginId("warehouseA");
        wmAuth.setRoleCd("WAREHOUSE_MANAGER");
        CustomUser warehouseManager = new CustomUser(wmAuth);

        FileAccessContextDTO context = new FileAccessContextDTO();
        context.setTfgNo(100L);
        context.setWarehouseManagerId("warehouseA");
        when(fileMapper.selectFileAccessContext(anyLong())).thenReturn(context);

        // when & then
        assertDoesNotThrow(() -> {
            authorizer.checkDownloadable(otherUserFile, warehouseManager);
        });
    }

    @Test
    @DisplayName("담당자가 아닌 창고관리자는 보세반출 요청건 파일 접근이 차단되어야 함")
    void checkDownloadable_ShouldDeny_WhenOtherWarehouseManagerAccessesOutboundContext() {
        // given
        AuthUserVO wmAuth = new AuthUserVO();
        wmAuth.setLoginId("warehouseB");
        wmAuth.setRoleCd("WAREHOUSE_MANAGER");
        CustomUser warehouseManager = new CustomUser(wmAuth);

        FileAccessContextDTO context = new FileAccessContextDTO();
        context.setTfgNo(100L);
        context.setWarehouseManagerId("warehouseA");
        when(fileMapper.selectFileAccessContext(anyLong())).thenReturn(context);

        // when & then
        assertThrows(AccessDeniedException.class, () -> {
            authorizer.checkDownloadable(otherUserFile, warehouseManager);
        });
    }
}
