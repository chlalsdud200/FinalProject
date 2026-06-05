package kr.or.tacs.systemadmin.stats.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.tacs.systemadmin.stats.service.IAdminStatsService;
import kr.or.tacs.vo.systemadmin.stats.AdminStatsOverviewVO;
import kr.or.tacs.vo.systemadmin.stats.AdminStatsSearchVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tacs/admin/stats")
public class AdminStatsController {

    private final IAdminStatsService statsService;

    /** 통계 대시보드 전체 섹션 조회. */
    @GetMapping("/overview")
    public AdminStatsOverviewVO retrieveOverview(@ModelAttribute AdminStatsSearchVO search) {
        return statsService.retrieveOverview(search);
    }
}
