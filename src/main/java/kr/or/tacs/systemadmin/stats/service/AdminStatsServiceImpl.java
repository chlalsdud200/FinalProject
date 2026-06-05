package kr.or.tacs.systemadmin.stats.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.tacs.systemadmin.stats.mapper.IAdminStatsMapper;
import kr.or.tacs.systemadmin.stats.support.DeclarationStatusLabel;
import kr.or.tacs.vo.systemadmin.stats.AdminStatsOverviewVO;
import kr.or.tacs.vo.systemadmin.stats.AdminStatsSearchVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatsServiceImpl implements IAdminStatsService {

    private static final int DEFAULT_TOP_N = 10;
    private static final int MAX_TOP_N = 50;

    private final IAdminStatsMapper statsMapper;

    @Override
    public AdminStatsOverviewVO retrieveOverview(AdminStatsSearchVO search) {
        AdminStatsSearchVO normalized = normalize(search);

        AdminStatsOverviewVO overview = new AdminStatsOverviewVO();
        overview.setSummary(statsMapper.selectSummary(normalized));
        applyComparison(overview, normalized);
        overview.setDeclarationStatus(withStatusLabels(statsMapper.selectDeclarationStatus(normalized)));
        overview.setMonthlyTrend(statsMapper.selectMonthlyTrend(normalized));
        overview.setTopItems(statsMapper.selectTopItems(normalized));
        overview.setOriginDistribution(statsMapper.selectOriginDistribution(normalized));
        overview.setTopBrokers(statsMapper.selectTopBrokers(normalized));
        overview.setTopTransportManagers(statsMapper.selectTopTransportManagers(normalized));
        overview.setWarehouseUsage(statsMapper.selectWarehouseUsage(normalized));
        overview.setWarehouseFlow(statsMapper.selectWarehouseFlow(normalized));
        overview.setMemberDistribution(statsMapper.selectMemberDistribution(normalized));
        overview.setQuarantineStats(statsMapper.selectQuarantineStats(normalized));
        overview.setNotificationStats(statsMapper.selectNotificationStats(normalized));
        return overview;
    }

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * 조회기간(startDate~endDate)이 모두 지정된 경우에 한해
     * 전기(직전 동일길이 기간)·전년 동기 요약을 계산해 채운다.
     */
    private void applyComparison(AdminStatsOverviewVO overview, AdminStatsSearchVO normalized) {
        String start = normalized.getStartDate();
        String end = normalized.getEndDate();
        if (start == null || end == null) {
            return;
        }

        LocalDate startDate;
        LocalDate endDate;
        try {
            startDate = LocalDate.parse(start, DATE_FMT);
            endDate = LocalDate.parse(end, DATE_FMT);
        } catch (Exception e) {
            return;
        }
        if (endDate.isBefore(startDate)) {
            return;
        }

        long lengthDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        // 전기: 조회 시작일 직전으로 동일 길이만큼
        LocalDate prevPeriodEnd = startDate.minusDays(1);
        LocalDate prevPeriodStart = prevPeriodEnd.minusDays(lengthDays - 1);
        overview.setSummaryPrevPeriod(statsMapper.selectSummary(rangeSearch(prevPeriodStart, prevPeriodEnd)));
        overview.setPrevPeriodLabel(label(prevPeriodStart, prevPeriodEnd));

        // 전년 동기: 동일 구간을 1년 전으로
        LocalDate prevYearStart = startDate.minusYears(1);
        LocalDate prevYearEnd = endDate.minusYears(1);
        overview.setSummaryPrevYear(statsMapper.selectSummary(rangeSearch(prevYearStart, prevYearEnd)));
        overview.setPrevYearLabel(label(prevYearStart, prevYearEnd));
    }

    /** 날짜 범위만 담은 검색조건(요약 비교 전용). */
    private AdminStatsSearchVO rangeSearch(LocalDate start, LocalDate end) {
        AdminStatsSearchVO vo = new AdminStatsSearchVO();
        vo.setStartDate(start.format(DATE_FMT));
        vo.setEndDate(end.format(DATE_FMT));
        return vo;
    }

    private String label(LocalDate start, LocalDate end) {
        return start.format(DATE_FMT) + " ~ " + end.format(DATE_FMT);
    }

    /** 상태 분포 각 행에 한글 라벨(label)을 채워 넣는다. */
    private List<Map<String, Object>> withStatusLabels(List<Map<String, Object>> rows) {
        if (rows == null) {
            return rows;
        }
        for (Map<String, Object> row : rows) {
            Object code = row.get("code");
            row.put("label", DeclarationStatusLabel.resolve(code == null ? null : String.valueOf(code)));
        }
        return rows;
    }

    private AdminStatsSearchVO normalize(AdminStatsSearchVO search) {
        AdminStatsSearchVO result = search == null ? new AdminStatsSearchVO() : search;
        result.setStartDate(blankToNull(result.getStartDate()));
        result.setEndDate(blankToNull(result.getEndDate()));
        result.setTrendYear(blankToNull(result.getTrendYear()));
        result.setTrendMonth(blankToNull(result.getTrendMonth()));

        Integer topN = result.getTopN();
        if (topN == null || topN < 1) {
            topN = DEFAULT_TOP_N;
        }
        result.setTopN(Math.min(topN, MAX_TOP_N));
        return result;
    }

    private String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
