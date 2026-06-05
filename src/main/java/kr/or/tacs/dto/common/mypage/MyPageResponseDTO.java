package kr.or.tacs.dto.common.mypage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyPageResponseDTO {

    private boolean success;
    private String message;
    private String redirectUrl;
    private Object data;

    public static MyPageResponseDTO success(String message) {
        return new MyPageResponseDTO(true, message, null, null);
    }

    public static MyPageResponseDTO success(String message, String redirectUrl) {
        return new MyPageResponseDTO(true, message, redirectUrl, null);
    }

    public static MyPageResponseDTO success(String message, Object data) {
        return new MyPageResponseDTO(true, message, null, data);
    }

    public static MyPageResponseDTO fail(String message) {
        return new MyPageResponseDTO(false, message, null, null);
    }
}
