package kr.or.tacs.officer.fulfillmentandexport.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.tacs.dto.officer.ExportAndFulfillmentDTO;
import kr.or.tacs.dto.officer.LoadedCargoListDTO;
import kr.or.tacs.officer.fulfillmentandexport.service.IExportAndFulfillmentService;
import kr.or.tacs.officer.fulfillmentandexport.service.ILoadedCargoListService;

/*
 * 행정공무원 - 이행 반출 및 화물 조회
 */
@Controller
@RequestMapping("/officer")
public class OfficerFulfillmentReleaseAndCargoTrackingController {

    @Autowired
    ILoadedCargoListService loadedCargoListService;

    @Autowired
    IExportAndFulfillmentService exportAndFulfillmentService;

    // 반출 및 이행 관리 페이지 요청
    @GetMapping("/exportAndFulfillment.do")
    public String exportAndFulfillment(
            @RequestParam(required = false) String reqNo,
            @RequestParam(required = false, defaultValue = "ALL") String workType,
            @RequestParam(required = false, defaultValue = "ALL") String statusCd,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword,
            Model model) {

        List<ExportAndFulfillmentDTO> fulfillmentList = exportAndFulfillmentService.selectExportAndFulfillmentList(
                reqNo, workType, statusCd, startDate, endDate, keyword);

        model.addAttribute("fulfillmentList", fulfillmentList);
        model.addAttribute("fulfillmentCount", fulfillmentList == null ? 0 : fulfillmentList.size());

        model.addAttribute("reqNo", reqNo);
        model.addAttribute("workType", workType);
        model.addAttribute("statusCd", statusCd);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);
        model.addAttribute("keyword", keyword);
        model.addAttribute("menuKey", "exportAndFulfillment");

        return "officer/exportAndFulfillment";
    }


    // 반출/이행 품목 상세내역 AJAX 조회
    @GetMapping("/exportAndFulfillmentItems.do")
    @ResponseBody
    public List<ExportAndFulfillmentDTO> exportAndFulfillmentItems(
            @RequestParam("reqNo") String reqNo,
            @RequestParam(required = false) String declareType) {

        return exportAndFulfillmentService.selectExportAndFulfillmentItemList(reqNo, declareType);
    }

    // 화물 현황 조회 페이지 요청
    @GetMapping("/loadedCargoList.do")
    public String loadedCargoList(
            @RequestParam(required = false) String reqNo,
            @RequestParam(required = false, defaultValue = "ALL") String declareStatusCd,
            @RequestParam(required = false, defaultValue = "ALL") String declareType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword,
            Model model) {

        List<LoadedCargoListDTO> loadedCargoList = loadedCargoListService.selectLoadedCargoList(
                reqNo, declareStatusCd, declareType, startDate, endDate, keyword);

        List<LoadedCargoListDTO> mixedCargoList = loadedCargoListService.selectMixedCargoList(
                reqNo, declareStatusCd, declareType, startDate, endDate, keyword);

        List<LoadedCargoListDTO> allCargoList = new ArrayList<>();
        if (loadedCargoList != null) allCargoList.addAll(loadedCargoList);
        if (mixedCargoList != null) allCargoList.addAll(mixedCargoList);
        allCargoList.sort(Comparator.comparing(LoadedCargoListDTO::getSubmitDate, Comparator.nullsLast(Comparator.reverseOrder())));

        model.addAttribute("allCargoList", allCargoList);
        model.addAttribute("loadedCargoList", loadedCargoList);
        model.addAttribute("mixedCargoList", mixedCargoList);
        model.addAttribute("allCargoCount", allCargoList.size());
        model.addAttribute("loadedCargoCount", loadedCargoList == null ? 0 : loadedCargoList.size());
        model.addAttribute("mixedCargoCount", mixedCargoList == null ? 0 : mixedCargoList.size());

        model.addAttribute("reqNo", reqNo);
        model.addAttribute("declareStatusCd", declareStatusCd);
        model.addAttribute("declareType", declareType);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);
        model.addAttribute("keyword", keyword);
        model.addAttribute("menuKey", "loadedCargoList");

        return "officer/loadedCargoList";
    }

    // 화물 품목 상세내역 AJAX 조회
    @GetMapping("/loadedCargoItems.do")
    @ResponseBody
    public List<LoadedCargoListDTO> loadedCargoItems(
            @RequestParam("reqNo") String reqNo,
            @RequestParam(required = false) String declareType) {

        return loadedCargoListService.selectCargoItemList(reqNo, declareType);
    }
}
