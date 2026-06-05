package kr.or.tacs.common.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.exception.SolapiMessageNotReceivedException;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.service.DefaultMessageService;

@Service
public class SolapiSmsService implements SmsService {

    private final DefaultMessageService messageService;
    private final String sender;

    public SolapiSmsService(
            @Value("${solapi.api-key}") String apiKey,
            @Value("${solapi.api-secret}") String apiSecret,
            @Value("${solapi.sender}") String sender
    ) {
        this.messageService = StringUtils.hasText(apiKey) && StringUtils.hasText(apiSecret)
                ? SolapiClient.INSTANCE.createInstance(apiKey, apiSecret)
                : null;
        this.sender = removeHyphen(sender);
    }

    @Override
    public void sendAuthCode(String phoneNo, String authCode) {
        if (messageService == null) {
            throw new IllegalStateException("SOLAPI API Key/Secret 설정이 비어 있습니다. SOLAPI_API_KEY, SOLAPI_API_SECRET 환경변수를 확인하세요.");
        }

        String receiver = removeHyphen(phoneNo);
        validatePhoneNo("수신번호", receiver);
        validatePhoneNo("발신번호", sender);
        validateRequired("인증번호", authCode);

        Message message = new Message();
        message.setFrom(sender);
        message.setTo(receiver);
        message.setText("[TACS] 인증번호는 [" + authCode + "] 입니다. 5분 이내에 입력해주세요.");

        try {
            messageService.send(message);
        } catch (SolapiMessageNotReceivedException e) {
            throw new RuntimeException("문자 발송에 실패했습니다. 실패 목록: " + e.getFailedMessageList(), e);
        } catch (Exception e) {
            throw new RuntimeException("문자 발송 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    private String removeHyphen(String phoneNo) {
        if (phoneNo == null) {
            return null;
        }
        return phoneNo.replaceAll("[^0-9]", "");
    }

    private void validateRequired(String name, String value) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalStateException(name + " 설정값이 비어 있습니다.");
        }
    }

    private void validatePhoneNo(String name, String phoneNo) {
        if (!StringUtils.hasText(phoneNo) || !phoneNo.matches("01[0-9]{8,9}")) {
            throw new IllegalArgumentException(name + " 형식이 올바르지 않습니다. 예: 01012345678");
        }
    }
}
