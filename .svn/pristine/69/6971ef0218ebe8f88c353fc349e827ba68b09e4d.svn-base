package kr.or.tacs.owner.arrival.controller;

import kr.or.tacs.dto.owner.OwnerArrivalNoticeDTO;
import kr.or.tacs.dto.owner.OwnerArrivalSearchDTO;
import kr.or.tacs.owner.arrival.service.IArrivalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/owner/arrival-notice")
public class ArrivalController {

    @Autowired
    private IArrivalService arrivalService;

    @GetMapping("/list.do")
    public String list(OwnerArrivalSearchDTO searchDTO,
                       Authentication authentication,
                       Model model) {

        String owrId = authentication.getName();
        searchDTO.setOwrId(owrId);

        if (searchDTO.getPage() < 1) {
            searchDTO.setPage(1);
        }
        if (searchDTO.getSize() < 1) {
            searchDTO.setSize(10);
        }

        int totalCount = arrivalService.retrieveArrivalNoticeCount(searchDTO);
        searchDTO.setTotalCount(totalCount);

        List<OwnerArrivalNoticeDTO> arrivalList =
                arrivalService.retrieveArrivalNoticeList(searchDTO);

        // KPI 카드는 검색/페이징과 무관하게 화주 전체 통지서 기준으로 집계한다.
        Map<String, Object> stats = arrivalService.retrieveArrivalNoticeStats(owrId);

        model.addAttribute("arrivalList", arrivalList);
        model.addAttribute("searchDTO", searchDTO);
        model.addAttribute("totalCount", toLong(stats.get("TOTAL")));
        model.addAttribute("pendingCount", toLong(stats.get("PENDING")));
        model.addAttribute("sentCount", toLong(stats.get("SENT")));

        return "owner/arrivalNotice";
    }

    private long toLong(Object value) {
        if (value == null) {
            return 0L;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return Long.parseLong(value.toString());
    }

    @GetMapping("/detail.do/{ianNo}")
    public String detail(@PathVariable String ianNo,
                         Authentication authentication,
                         Model model) {

        String owrId = authentication.getName();

        OwnerArrivalNoticeDTO arrival =
                arrivalService.retrieveArrivalNoticeDetail(ianNo, owrId);

        model.addAttribute("arrival", arrival);

        return "owner/arrivalNoticeDetail";
    }

    @GetMapping("/detail-by-trc.do/{trcNo}")
    public String detailByTrcNo(@PathVariable String trcNo,
                                Authentication authentication,
                                Model model) {

        String owrId = authentication.getName();

        OwnerArrivalNoticeDTO arrival =
                arrivalService.retrieveArrivalNoticeDetailByTrcNo(trcNo, owrId);

        model.addAttribute("arrival", arrival);

        return "owner/arrivalNoticeDetail";
    }
}