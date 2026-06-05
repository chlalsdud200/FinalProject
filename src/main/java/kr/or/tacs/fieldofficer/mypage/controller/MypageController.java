package kr.or.tacs.fieldofficer.mypage.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import kr.or.tacs.dto.common.mypage.MyPageResponseDTO;
import kr.or.tacs.fieldofficer.mypage.service.IMypageService;

@Controller("fieldOfficerMypageController")
@RequestMapping("/fieldofficer")
public class MypageController {

    private final IMypageService mypageService;

    public MypageController(IMypageService mypageService) {
        this.mypageService = mypageService;
    }

    @GetMapping("/mypage.do")
    public String mypage(
            @RequestParam(value = "tab", required = false, defaultValue = "profile") String tab,
            Model model
    ) {
        String normalizedTab = ("alarm".equals(tab) || "notify".equals(tab)) ? "alarm" : "profile";

        model.addAttribute("activeMenu", "mypage");
        model.addAttribute("activeSub", normalizedTab);
        model.addAttribute("mypageActorPath", "fieldofficer");
        model.addAttribute("mypageTab", normalizedTab);

        return "fieldofficer/mypage";
    }

    @PostMapping("/mypage/update.do")
    @ResponseBody
    @ResponseStatus(HttpStatus.GONE)
    public MyPageResponseDTO updateMypage() {
        return MyPageResponseDTO.fail("기존 fieldofficer 마이페이지 수정 URL은 사용 중지되었습니다. /fieldofficer/mypage/profile/modify.do를 사용해 주세요.");
    }

    @PostMapping("/mypage/alarm/update.do")
    @ResponseBody
    @ResponseStatus(HttpStatus.GONE)
    public MyPageResponseDTO updateAlarmSetting() {
        return MyPageResponseDTO.fail("fieldofficer 알림 수신 설정 저장 기능은 준비 중입니다.");
    }
}
