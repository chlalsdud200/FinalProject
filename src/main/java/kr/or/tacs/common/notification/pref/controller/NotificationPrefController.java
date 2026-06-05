package kr.or.tacs.common.notification.pref.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.common.notification.pref.service.INotificationPrefService;
import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.vo.common.notification.NotificationPrefVO;
import lombok.RequiredArgsConstructor;

/**
 * 마이페이지 알림 수신 on/off 설정 API.
 * 기존 알림 인박스와 동일하게 /api/notifications/** 인증 경로 하위.
 */
@RestController
@RequestMapping("/api/notifications/pref")
@RequiredArgsConstructor
public class NotificationPrefController {

    private final INotificationPrefService prefService;

    /** 로그인 사용자 유형이 받는 알림 목록 + 현재 on/off 상태 */
    @GetMapping
    public List<NotificationPrefVO> list(@AuthenticationPrincipal CustomUser user) {
        return prefService.retrievePrefList(effectiveUserType(user), user.getLoginId());
    }

    /**
     * 알림 수신자 유형. 공무원은 행정/현장(검역관)이 roleCd=OFFICER로 같아,
     * 현장공무원은 OFFICER_TY_CD로 구분해 FIELD_OFFICER로 본다.
     */
    private String effectiveUserType(CustomUser user) {
        if ("OFFICER".equals(user.getUserType()) && "FIELD_OFFICER".equals(user.getOfficerTyCd())) {
            return "FIELD_OFFICER";
        }
        return user.getUserType();
    }

    /** 개별 알림 on/off 저장 */
    @PostMapping
    public Map<String, Object> update(@AuthenticationPrincipal CustomUser user,
                                      @RequestBody Map<String, Object> body) {
        String eventCd = String.valueOf(body.get("eventCd"));
        boolean on = Boolean.TRUE.equals(body.get("on"));
        prefService.modifyPref(user.getLoginId(), eventCd, on);
        return Map.of("result", "OK", "eventCd", eventCd, "on", on);
    }

    /** 전체 켜기/끄기 (한 번에 일괄 처리) */
    @PostMapping("/all")
    public Map<String, Object> updateAll(@AuthenticationPrincipal CustomUser user,
                                         @RequestBody Map<String, Object> body) {
        boolean on = Boolean.TRUE.equals(body.get("on"));
        prefService.modifyAllPref(effectiveUserType(user), user.getLoginId(), on);
        return Map.of("result", "OK", "on", on);
    }
}
