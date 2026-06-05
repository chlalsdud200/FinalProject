package kr.or.tacs.broker.declare.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.or.tacs.broker.declare.mapper.IBrokerDeclareMapper;
import kr.or.tacs.vo.BrokerVO;
import kr.or.tacs.vo.broker.declare.ImpDclrItemMdlspecVO;
import kr.or.tacs.vo.broker.declare.ImpDclrItemVO;
import kr.or.tacs.vo.broker.declare.ImpDclrVO;
import kr.or.tacs.vo.broker.declare.ImpRqstVO;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;


import kr.or.tacs.common.file.service.IFileService;
import kr.or.tacs.dto.FileInfoDTO;
import kr.or.tacs.cmmenums.TacsCstmSt;
import kr.or.tacs.cmmenums.TacsUserType;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

import kr.or.tacs.common.notification.service.INotificationService;
@Service
public class BrokerDeclareServiceImpl implements IBrokerDeclareService {

    @Autowired
    private IBrokerDeclareMapper brokerDeclareMapper;
    
    @Value("${hs.ai-recommend.enabled:false}")
    private boolean hsAiRecommendEnabled;
    
    
    /*
     * 8D-ATTACH
     * 공통 파일 업로드 서비스
     *
     * uploadFiles       : 새 파일그룹 생성 + 파일 등록
     * uploadFilesToGroup: 기존 파일그룹에 파일 추가
     * getFileList       : 파일그룹번호 기준 목록 조회
     * deleteFile        : 파일번호 기준 삭제
     */
    @Autowired
    private  IFileService fileService;

    @Autowired
    private INotificationService notificationService;
    
    @Autowired
    private ObjectProvider<VectorStore> vectorStoreProvider;
    /**
     * 임시저장
     *  · idIrNo 는 IMP_RQST.IR_NO 와 동일 — 의뢰서 없이 신고서 못 만듦 (NOT NULL)
     *  · 같은 idIrNo 가 IMP_DCLR 에 이미 있으면 UPDATE, 없으면 INSERT
     *  · 자식 1: 란사항 (delete-all + bulk insert)
     *  · 자식 2: 모델/규격 (delete-all + bulk insert)
     */
    @Override
    @Transactional
    public String saveImpDraft(ImpDclrVO vo, String brokerId) {
        // 의뢰번호 필수 — 의뢰서(IMP_RQST.IR_NO) 없이는 신고서 작성 불가
        if (vo.getIdIrNo() == null || vo.getIdIrNo().trim().isEmpty()) {
            throw new IllegalArgumentException(
                "통관의뢰번호가 없습니다. 의뢰서를 먼저 조회해주세요.");
        }

        vo.setIdStatusCd("DCLR_TEMP");

        /*
         * 8E-SAVE
         * ID_OFFICER_ID는 세관 담당 공무원 ID이다.
         *
         * 현재 화면은 관세사가 신고서를 작성/전송하는 단계이므로
         * 공무원은 아직 배정되지 않았다.
         *
         * 따라서 ID_OFFICER_ID에는 로그인 관세사 ID를 넣지 않고 NULL로 둔다.
         */
        vo.setIdOfficerId(null);

        /*
         * 8E-SAVE
         * IMP_DCLR.ID_TOT_LN_CNT 필수값 세팅
         *
         * ID_TOT_LN_CNT는 부모 신고서의 총 란 수.
         * DB NOT NULL 컬럼이므로 INSERT/UPDATE 전에 반드시 세팅한다.
         */
        int totalLineCount = (vo.getItems() == null) ? 0 : vo.getItems().size();
        vo.setIdTotLnCnt(totalLineCount);

        // 1) 이미 IMP_DCLR 에 같은 idIrNo 행이 있는지 확인 → 없으면 INSERT, 있으면 UPDATE
        ImpDclrVO existing = brokerDeclareMapper.selectImpDclrById(vo.getIdIrNo(), brokerId);

        if (existing == null) {
            // 신규 — INSERT (idIrNo 는 사용자가 입력한 값 그대로 사용)
            brokerDeclareMapper.insertImpDclr(vo);
        } else {
            // 이어쓰기 — UPDATE
            int affected = brokerDeclareMapper.updateImpDclr(vo);
            if (affected == 0) {
                throw new IllegalStateException(
                    "수정할 수 없는 신고서입니다. (본인 임시저장 건이 아니거나 이미 전송됨)");
            }
        }

        // 2) 자식 — 란사항
        saveItems(vo);

        // 3) 자식 — 모델/규격
        saveMdlspecs(vo);

        return vo.getIdIrNo();
    }

    /** 란사항 IMP_DCLR_ITEM 일괄 저장 (delete-all + insert) */
    private void saveItems(ImpDclrVO vo) {
        String idIrNo = vo.getIdIrNo();
        if (idIrNo == null) return;

        // FK 순서: 손자(모델/규격)가 란사항을 참조하므로 자식부터 먼저 비워야
        // 란사항 DELETE 시 FK_IMP_DCLR_ITEM_TO_IMP_DCLR_ITEM_MDLSPEC 위반을 막을 수 있다.
        brokerDeclareMapper.deleteImpDclrItemMdlspecsByIrNo(idIrNo);
        brokerDeclareMapper.deleteImpDclrItemsByIrNo(idIrNo);

        List<ImpDclrItemVO> items = vo.getItems();
        if (items == null || items.isEmpty()) return;

        int sn = 1;
        for (ImpDclrItemVO item : items) {
            item.setIdiIrNo(idIrNo);
            item.setIdiSn(sn++);
            brokerDeclareMapper.insertImpDclrItem(item);
        }
    }

    /** 모델/규격 IMP_DCLR_ITEM_MDLSPEC 일괄 저장 (delete-all + insert) */
    private void saveMdlspecs(ImpDclrVO vo) {
        String idIrNo = vo.getIdIrNo();
        if (idIrNo == null) return;

        brokerDeclareMapper.deleteImpDclrItemMdlspecsByIrNo(idIrNo);

        List<ImpDclrItemMdlspecVO> mdlspecs = vo.getMdlspecs();
        if (mdlspecs == null || mdlspecs.isEmpty()) return;

        // 란번호(idimSn)별 모델규격순번 관리
        Map<Integer, Integer> mdlspecSnMap = new HashMap<>();

        for (ImpDclrItemMdlspecVO m : mdlspecs) {
            m.setIdimIrNo(idIrNo);

            // idimSn은 모델/규격 행번호가 아니라 소속 란번호다.
            // 프론트에서 impItems index 기준으로 세팅한 값을 유지해야 FK가 맞는다.
            if (m.getIdimSn() == null) {
                throw new IllegalArgumentException("모델/규격의 소속 란번호(idimSn)가 없습니다.");
            }

            int nextMdlspecSn = mdlspecSnMap.getOrDefault(m.getIdimSn(), 0) + 1;
            mdlspecSnMap.put(m.getIdimSn(), nextMdlspecSn);

            m.setIdimMdlspecSn(nextMdlspecSn);

            brokerDeclareMapper.insertImpDclrItemMdlspec(m);
        }
    }

    @Override
    public ImpDclrVO findImpDclrById(String brokerId, String idIrNo) {
        if (idIrNo == null || idIrNo.trim().isEmpty()) return null;
        ImpDclrVO vo = brokerDeclareMapper.selectImpDclrById(idIrNo, brokerId);
        if (vo != null) {
            vo.setItems(brokerDeclareMapper.selectImpDclrItemListByIrNo(idIrNo));
            vo.setMdlspecs(brokerDeclareMapper.selectImpDclrItemMdlspecListByIrNo(idIrNo));
        }
        return vo;
    }

    @Override
    public List<ImpDclrVO> findImpDraftList(String brokerId) {
        return brokerDeclareMapper.selectImpDraftList(brokerId);
    }

    /**
     * 의뢰번호 1건 조회 — [조회] 버튼 응답용
     * 본인 담당 또는 미배정 의뢰서만 반환
     */
    @Override
    public ImpRqstVO findImpRqstById(String brokerId, String irNo) {
        if (irNo == null || irNo.trim().isEmpty()) return null;
        return brokerDeclareMapper.selectImpRqstById(irNo.trim(), brokerId);
    }

    /**
     * 의뢰서 검색 — 돋보기 모달 응답용
     * keyword 가 null/빈문자면 본인 의뢰서 전체 목록
     */
    @Override
    public List<ImpRqstVO> findImpRqstList(String brokerId, String keyword) {
        String trimmed = (keyword == null) ? "" : keyword.trim();
        return brokerDeclareMapper.selectImpRqstList(brokerId, trimmed);
    }

    /** 로그인 사용자(관세사) BROKER 정보 조회 */
    @Override
    public BrokerVO findCurrentBroker(String brokerId) {
        if (brokerId == null || brokerId.trim().isEmpty()) return null;
        return brokerDeclareMapper.selectBrokerById(brokerId);
    }

    /**
     * 전송: 마지막 저장 + status 변경
     */
    @Override
    @Transactional
    public String sendImp(ImpDclrVO vo, String brokerId) {
        String idIrNo = saveImpDraft(vo, brokerId);

        int affected = brokerDeclareMapper.submitImpDclr(idIrNo, brokerId);
        if (affected == 0) {
            throw new IllegalStateException(
                "전송할 수 없는 신고서입니다. (본인 임시저장 건이 아니거나 이미 전송됨)");
        }

        int rqstAffected = brokerDeclareMapper.updateImpRqstStatusCstmInprg(idIrNo, brokerId);
        if (rqstAffected == 0) {
            throw new IllegalStateException(
                "신고서는 전송되었지만 통관의뢰 상태를 변경할 수 없습니다. (본인 담당 의뢰서가 아니거나 의뢰서가 비활성 상태입니다)");
        }
        brokerDeclareMapper.updateImpDclrItemsToItemDclr(idIrNo);

        notificationService.registNotification(
            "DCLR_SUBMITTED",
            idIrNo,
            brokerId,
            Map.of("irNo", idIrNo)
        );

        return idIrNo;
    }
    
    
    
    /**
     * 국가코드 조회
     */
    @Override
    public List<Map<String, Object>> selectCountryList(String keyword) {
        return brokerDeclareMapper.selectCountryList(keyword);
    }
    
    
    /**
     * 상호조회 
     */
    @Override
    public List<Map<String, Object>> selectOwnerList(String keyword) {
        return brokerDeclareMapper.selectOwnerList(keyword);
    }
    
    @Value("${exim.api.authkey}")
    private String eximAuthKey;

    private static final ObjectMapper exchangeObjectMapper = new ObjectMapper();
    
    
    @Override
    public Map<String, Object> findExchangeRate(String currency) throws Exception {
        if (currency == null || currency.trim().isEmpty()) {
            return null;
        }

        String targetCurrency = currency.trim().toUpperCase();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyyMMdd");

        /*
         * 한국수출입은행 환율 API는 주말/공휴일 데이터가 없을 수 있음.
         * 그래서 오늘부터 최대 7일 전까지 조회해서 가장 가까운 영업일 환율을 사용.
         */
        for (int i = 0; i < 7; i++) {
            String searchDate = LocalDate.now().minusDays(i).format(fmt);

            String apiUrl =
                "https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON"
              + "?authkey=" + eximAuthKey
              + "&searchdate=" + searchDate
              + "&data=AP01";

            String json = callExchangeApi(apiUrl);

            if (json == null || json.trim().isEmpty()) {
                continue;
            }

            List<Map<String, Object>> list =
                exchangeObjectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});

            for (Map<String, Object> row : list) {
                String curUnit = String.valueOf(row.get("cur_unit")).toUpperCase();

                // API에서 JPY는 JPY(100)처럼 내려올 수 있어서 startsWith 처리
                if (curUnit.equals(targetCurrency) || curUnit.startsWith(targetCurrency)) {
                    String dealBasR = String.valueOf(row.get("deal_bas_r")); // 예: 1,382.50
                    BigDecimal rate = parseRate(dealBasR);

                    Map<String, Object> result = new HashMap<>();
                    result.put("currency", targetCurrency);
                    result.put("curUnit", row.get("cur_unit"));
                    result.put("curName", row.get("cur_nm"));
                    result.put("dealBasR", dealBasR);
                    result.put("rate", rate);
                    result.put("searchDate", searchDate);

                    return result;
                }
            }
        }

        return null;
    }

    private String callExchangeApi(String apiUrl) throws Exception {
        HttpURLConnection conn = null;
        BufferedReader br = null;

        try {
            URL url = new URL(apiUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            int status = conn.getResponseCode();

            if (status < 200 || status >= 300) {
                return null;
            }

            br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

            StringBuilder sb = new StringBuilder();
            String line;

            while ((line = br.readLine()) != null) {
                sb.append(line);
            }

            return sb.toString();
        } finally {
            if (br != null) {
                br.close();
            }
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private BigDecimal parseRate(String rateText) {
        if (rateText == null) {
            return null;
        }

        String cleaned = rateText.replace(",", "").trim();

        if (cleaned.isEmpty()) {
            return null;
        }

        return new BigDecimal(cleaned);
    }
    
    
    /**수량코드 */
    @Override
    public List<Map<String, Object>> selectCommonCodeList(String groupId, String keyword) {
        Map<String, Object> param = new HashMap<>();
        param.put("groupId", groupId);
        param.put("keyword", keyword);

        return brokerDeclareMapper.selectCommonCodeList(param);
    }
    
    @Override
    public List<Map<String, Object>> selectHsCodeList(String keyword) {
        String trimmed = (keyword == null) ? "" : keyword.trim();
        return brokerDeclareMapper.selectHsCodeList(trimmed);
    }
    
    @Override
    public List<Map<String, Object>> selectHsClassChildren(String parentCd) {
        String trimmed = (parentCd == null) ? "" : parentCd.trim();
        return brokerDeclareMapper.selectHsClassChildren(trimmed);
    }
    
    @Override
    public Map<String, Object> findHsCodeInfo(String hsCode, String countryCd, String orgnCertYn) {
        if (hsCode == null || hsCode.trim().isEmpty()) {
            return null;
        }

        String cleanHsCode = hsCode.trim()
                                   .replace(".", "")
                                   .replace("-", "")
                                   .replace(" ", "")
                                   .toUpperCase();

        Map<String, Object> hs = brokerDeclareMapper.selectHsCodeInfo(cleanHsCode);
        if (hs == null) {
            return null;
        }

        Object basicRateObj = hs.get("basicTariffRate");

        Map<String, Object> result = new HashMap<>();
        result.put("hsCode", cleanHsCode);
        result.put("hsName", hs.get("hsName"));
        result.put("basicTariffRate", basicRateObj);
        result.put("appliedTariffRate", basicRateObj);
        result.put("appliedType", "BASIC");

        boolean useFta = "Y".equalsIgnoreCase(orgnCertYn)
                      && countryCd != null
                      && !countryCd.trim().isEmpty();

        if (useFta) {
            Map<String, Object> param = new HashMap<>();
            param.put("hsCode", cleanHsCode);
            param.put("countryCd", countryCd.trim().toUpperCase());
            param.put("baseYmd", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));

            Map<String, Object> fta = brokerDeclareMapper.selectFtaTariffInfo(param);

            if (fta != null) {
                result.put("appliedType", "FTA");
                result.put("ftaTariffRate", fta.get("ftaTariffRate"));
                result.put("appliedTariffRate", fta.get("ftaTariffRate"));
                result.put("agreementCd", fta.get("agreementCd"));
                result.put("agreementNm", fta.get("agreementNm"));
                result.put("orgnDtrmnCd", fta.get("orgnDtrmnCd"));
            }
        }

        return result;
    }
    
    
    
    /**
     * HS AI추천 기능 사용 가능 여부
     * - Milvus가 아직 연결되지 않았거나, 서버가 꺼진 환경에서는 false 유지
     */
    @Override
    public boolean isHsAiRecommendEnabled() {
        return hsAiRecommendEnabled;
    }

    
    
    
    
    
    
    
    
   

    /**
     * Milvus 추천 근거 문구 생성
     */
    private String buildMilvusReason(Document doc) {
        if (doc == null) {
            return "Milvus 기준문서 청크와 의미가 유사한 HS코드 후보입니다.";
        }

        String text = doc.getText();
        if (text == null || text.trim().isEmpty()) {
            return "Milvus 기준문서 청크와 의미가 유사한 HS코드 후보입니다.";
        }

        String clean = text.replaceAll("\\s+", " ").trim();
        if (clean.length() > 160) {
            clean = clean.substring(0, 160) + "...";
        }

        return "Milvus 기준문서 유사 청크 근거: " + clean;
    }


    
 
    
    
    /**
     * Milvus 검색 결과 Document 목록을 HS코드 추천 후보 목록으로 변환
     * - docId 또는 metadata.hsCode를 추출
     * - Oracle에서 HS정보 + 사용빈도 조회
     * - 유사도 + 사용빈도 가중치로 최종 정렬
     */
    private List<Map<String, Object>> buildHsRecommendListFromDocuments(List<Document> docs) {
        if (docs == null || docs.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> docIds = new ArrayList<>();
        List<String> hsCodes = new ArrayList<>();

        Map<String, Document> docByDocId = new HashMap<>();
        Map<String, Document> docByHsCode = new HashMap<>();
        Map<String, Double> similarityByDocId = new HashMap<>();
        Map<String, Double> similarityByHsCode = new HashMap<>();

        for (Document doc : docs) {
            if (doc == null) continue;

            Map<String, Object> meta = doc.getMetadata();

            String docId = doc.getId();
            if ((docId == null || docId.trim().isEmpty()) && meta != null) {
                Object metaDocId = meta.get("doc_id");
                if (metaDocId == null) metaDocId = meta.get("docId");
                if (metaDocId == null) metaDocId = meta.get("HS_DOC_ID");
                if (metaDocId != null) docId = String.valueOf(metaDocId);
            }

            String hsCode = "";
            if (meta != null) {
                Object hsObj = meta.get("hsCode");
                if (hsObj == null) hsObj = meta.get("hs_code");
                if (hsObj == null) hsObj = meta.get("HS_CODE");

                if (hsObj != null) {
                    hsCode = normalizeHsCode(String.valueOf(hsObj));
                }
            }

            double similarityScore = extractSimilarityScore(doc);

            if (docId != null && !docId.trim().isEmpty()) {
                String cleanDocId = docId.trim();
                docIds.add(cleanDocId);
                docByDocId.put(cleanDocId, doc);
                similarityByDocId.put(cleanDocId, similarityScore);
            }

            if (!hsCode.isEmpty()) {
                hsCodes.add(hsCode);
                docByHsCode.put(hsCode, doc);
                similarityByHsCode.put(hsCode, similarityScore);
            }
        }

        List<Map<String, Object>> resultList = new ArrayList<>();

        /*
         * 1) docId 기반 조회
         */
        if (!docIds.isEmpty()) {
            try {
                List<Map<String, Object>> dbList =
                    brokerDeclareMapper.selectHsRecommendByDocIds(distinctList(docIds));

                if (dbList != null) {
                    for (Map<String, Object> src : dbList) {
                        Map<String, Object> row = new HashMap<>(src);

                        String docId = str(row.get("hsDocId"));
                        String hsCode = normalizeHsCode(str(row.get("hsCode")));

                        Document doc = docByDocId.get(docId);
                        double similarityScore = similarityByDocId.getOrDefault(docId, 0.70);
                        int useCount = toInt(row.get("useCount"));

                        row.put("hsCode", hsCode);
                        row.put("similarityScore", similarityScore);
                        row.put("popularityScore", calcPopularityScore(useCount));
                        row.put("finalScore", calcFinalScore(similarityScore, useCount));
                        row.put("score", row.get("finalScore"));
                        row.put("recommendReason", buildRecommendReason(doc, useCount));
                        row.put("recommendMode", "MILVUS_DOC_USAGE");

                        resultList.add(row);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                // HS_REF_CHUNK 미존재/데이터 미매핑 시 hsCode 기반으로 내려간다.
            }
        }

        /*
         * 2) metadata hsCode 기반 조회
         */
        if (resultList.isEmpty() && !hsCodes.isEmpty()) {
            try {
                List<Map<String, Object>> dbList =
                    brokerDeclareMapper.selectHsRecommendWithUsageByHsCodes(distinctList(hsCodes));

                if (dbList != null) {
                    for (Map<String, Object> src : dbList) {
                        Map<String, Object> row = new HashMap<>(src);

                        String hsCode = normalizeHsCode(str(row.get("hsCode")));
                        Document doc = docByHsCode.get(hsCode);
                        double similarityScore = similarityByHsCode.getOrDefault(hsCode, 0.70);
                        int useCount = toInt(row.get("useCount"));

                        row.put("hsCode", hsCode);
                        row.put("similarityScore", similarityScore);
                        row.put("popularityScore", calcPopularityScore(useCount));
                        row.put("finalScore", calcFinalScore(similarityScore, useCount));
                        row.put("score", row.get("finalScore"));
                        row.put("recommendReason", buildRecommendReason(doc, useCount));
                        row.put("recommendMode", "MILVUS_HS_USAGE");

                        resultList.add(row);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return sortAndLimitRecommendList(resultList, 5);
    }

    private String buildRecommendReason(Document doc) {
        if (doc == null) {
            return "Milvus 기준문서와 의미가 유사한 HS코드 후보입니다.";
        }

        String text = doc.getText();
        if (text == null || text.trim().isEmpty()) {
            return "Milvus 기준문서 청크와 의미가 유사한 HS코드 후보입니다.";
        }

        String clean = text.replaceAll("\\s+", " ").trim();
        if (clean.length() > 160) {
            clean = clean.substring(0, 160) + "...";
        }

        return "Milvus 기준문서 유사 청크 근거: " + clean;
    }

    /**
     * Milvus 실패 또는 결과 없음 시 기존 DB 검색으로 fallback
     * - HS_CODE/HS_KEYWORD 검색 결과에도 사용빈도를 붙여서 재정렬
     */
    private List<Map<String, Object>> recommendHsCodeByDbFallback(String keyword) {
        List<Map<String, Object>> rawList = brokerDeclareMapper.selectHsCodeList(keyword);

        if (rawList == null || rawList.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> hsCodes = new ArrayList<>();
        for (Map<String, Object> row : rawList) {
            String hsCode = normalizeHsCode(str(row.get("hsCode")));
            if (!hsCode.isEmpty()) {
                hsCodes.add(hsCode);
            }
        }

        Map<String, Map<String, Object>> usageMap = new HashMap<>();

        if (!hsCodes.isEmpty()) {
            try {
                List<Map<String, Object>> usageList =
                    brokerDeclareMapper.selectHsRecommendWithUsageByHsCodes(distinctList(hsCodes));

                if (usageList != null) {
                    for (Map<String, Object> row : usageList) {
                        String hsCode = normalizeHsCode(str(row.get("hsCode")));
                        if (!hsCode.isEmpty()) {
                            usageMap.put(hsCode, row);
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        List<Map<String, Object>> resultList = new ArrayList<>();

        for (Map<String, Object> src : rawList) {
            Map<String, Object> row = new HashMap<>(src);

            String hsCode = normalizeHsCode(str(row.get("hsCode")));
            Map<String, Object> usageRow = usageMap.get(hsCode);

            int useCount = 0;
            if (usageRow != null) {
                useCount = toInt(usageRow.get("useCount"));

                if (row.get("hsName") == null) {
                    row.put("hsName", usageRow.get("hsName"));
                }
                if (row.get("basicTariffRate") == null) {
                    row.put("basicTariffRate", usageRow.get("basicTariffRate"));
                }
            }

            double keywordScore = calcKeywordScore(row.get("sortScore"));

            row.put("hsCode", hsCode);
            row.put("useCount", useCount);
            row.put("similarityScore", keywordScore);
            row.put("popularityScore", calcPopularityScore(useCount));
            row.put("finalScore", calcFinalScore(keywordScore, useCount));
            row.put("score", row.get("finalScore"));
            row.put("recommendReason", "Milvus 검색 결과가 없거나 연결되지 않아 DB 키워드 검색으로 대체했습니다. 사용빈도 " + useCount + "건을 함께 반영했습니다.");
            row.put("recommendMode", "DB_FALLBACK_USAGE");

            resultList.add(row);
        }

        return sortAndLimitRecommendList(resultList, 5);
    }

    /**
     * HS AI추천 후보 조회
     *
     * 흐름:
     * 1. 란사항 입력값으로 검색문장 생성
     * 2. Milvus VectorStore에서 유사 후보 20개 검색
     * 3. Oracle에서 HS정보 + 사용빈도 조회
     * 4. 유사도 + 사용빈도 가중치로 재정렬
     * 5. 상위 5개 반환
     */
    @Override
    public List<Map<String, Object>> recommendHsCode(Map<String, Object> param) {
        if (!hsAiRecommendEnabled) {
            throw new IllegalStateException("HS AI추천 기능이 비활성화되어 있습니다.");
        }

        String dclrGdsnm = str(param.get("dclrGdsnm"));
        String trdngGdsnm = str(param.get("trdngGdsnm"));

        String trdmkNm = str(param.get("trdmkNm"));
        if (trdmkNm.isEmpty()) {
            trdmkNm = str(param.get("brandName"));
        }

        String orgnCntryCd = str(param.get("orgnCntryCd"));
        if (orgnCntryCd.isEmpty()) {
            orgnCntryCd = str(param.get("originCountryCd"));
        }

        String qty = str(param.get("qty"));
        String qtyUnitCd = str(param.get("qtyUnitCd"));
        String mdlspecText = str(param.get("mdlspecText"));

        String keyword = (
            dclrGdsnm + " " +
            trdngGdsnm + " " +
            trdmkNm + " " +
            orgnCntryCd + " " +
            qty + " " +
            qtyUnitCd + " " +
            mdlspecText
        ).replaceAll("\\s+", " ").trim();

        if (keyword.isEmpty()) {
            throw new IllegalArgumentException("AI추천에 사용할 신고품명, 거래품명, 상표명 또는 규격을 입력해주세요.");
        }

        /*
         * 1순위: Milvus VectorStore 검색
         * - 처음부터 5개만 가져오면 사용빈도 재정렬 여지가 없음
         * - 20개 후보를 가져온 뒤 최종점수로 상위 5개 선정
         */
        if (!hsAiRecommendEnabled) {
            return recommendHsCodeByDbFallback(keyword);
        }

        try {
            VectorStore vectorStore = vectorStoreProvider.getIfAvailable();

            
            
            if (vectorStore != null) {
                List<Document> docs = vectorStore.similaritySearch(
                    SearchRequest.builder()
                        .query(keyword)
                        .topK(20)
                        .similarityThreshold(0.50)
                        .build()
                );

                List<Map<String, Object>> milvusList = buildHsRecommendListFromDocuments(docs);

                if (milvusList != null && !milvusList.isEmpty()) {
                    return milvusList;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Milvus 오류가 나도 신고서 작성 전체를 막지 않고 DB fallback으로 내려간다.
        }

        /*
         * 2순위: DB fallback
         * - Milvus가 없거나 비어 있으면 기존 HS_CODE/HS_KEYWORD 검색
         * - fallback에도 사용빈도 가중치를 붙인다.
         */
        return recommendHsCodeByDbFallback(keyword);
    }

    
    private List<String> distinctList(List<String> list) {
        if (list == null || list.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> result = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();

        for (String value : list) {
            if (value == null) continue;

            String trimmed = value.trim();
            if (trimmed.isEmpty()) continue;

            if (seen.add(trimmed)) {
                result.add(trimmed);
            }
        }

        return result;
    }

    private String normalizeHsCode(String value) {
        if (value == null) return "";

        return value
            .replace(".", "")
            .replace("-", "")
            .replace(" ", "")
            .trim()
            .toUpperCase();
    }

    private int toInt(Object value) {
        if (value == null) return 0;

        if (value instanceof Number) {
            return ((Number) value).intValue();
        }

        try {
            return Integer.parseInt(String.valueOf(value).trim());
        } catch (Exception e) {
            return 0;
        }
    }

    private double toDouble(Object value, double defaultValue) {
        if (value == null) return defaultValue;

        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }

        try {
            return Double.parseDouble(String.valueOf(value).trim());
        } catch (Exception e) {
            return defaultValue;
        }
    }

    /**
     * Milvus Document metadata에서 유사도 점수 추출
     * - Spring AI / VectorStore 구현체마다 metadata key가 다를 수 있어 여러 key를 허용
     * - distance는 낮을수록 유사하므로 1-distance로 변환
     */
    private double extractSimilarityScore(Document doc) {
        if (doc == null || doc.getMetadata() == null) {
            return 0.70;
        }

        Map<String, Object> meta = doc.getMetadata();

        Object score = meta.get("score");
        if (score == null) score = meta.get("similarity");
        if (score == null) score = meta.get("similarityScore");

        if (score != null) {
            double value = toDouble(score, 0.70);
            return clamp01(value);
        }

        Object distance = meta.get("distance");
        if (distance != null) {
            double d = toDouble(distance, 0.30);
            return clamp01(1.0 - d);
        }

        return 0.70;
    }

    private double calcKeywordScore(Object sortScoreObj) {
        double sortScore = toDouble(sortScoreObj, 0);

        if (sortScore <= 0) {
            return 0.50;
        }

        /*
         * selectHsCodeList의 sortScore는 1000점대까지 나올 수 있으므로 0~1로 정규화
         */
        double normalized = sortScore / 1000.0;

        if (normalized < 0.30) normalized = 0.30;
        if (normalized > 1.00) normalized = 1.00;

        return normalized;
    }

    /**
     * 사용빈도 점수
     * - COUNT를 그대로 쓰면 특정 HS코드가 과도하게 강해짐
     * - log10으로 완만하게 반영
     * - 999회 이상이면 거의 1점에 가까워짐
     */
    private double calcPopularityScore(int useCount) {
        if (useCount <= 0) {
            return 0.0;
        }

        double score = Math.log10(useCount + 1) / 3.0;
        return clamp01(score);
    }

    /**
     * 최종점수
     * - 의미 유사도 75%
     * - 사용빈도 25%
     */
    private double calcFinalScore(double similarityScore, int useCount) {
        double sim = clamp01(similarityScore);
        double pop = calcPopularityScore(useCount);

        return Math.round(((sim * 0.75) + (pop * 0.25)) * 10000.0) / 10000.0;
    }

    private double clamp01(double value) {
        if (value < 0) return 0;
        if (value > 1) return 1;
        return value;
    }

    private List<Map<String, Object>> sortAndLimitRecommendList(List<Map<String, Object>> list, int limit) {
        if (list == null || list.isEmpty()) {
            return Collections.emptyList();
        }

        list.sort(new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> a, Map<String, Object> b) {
                double aScore = toDouble(a.get("finalScore"), 0);
                double bScore = toDouble(b.get("finalScore"), 0);

                int scoreCompare = Double.compare(bScore, aScore);
                if (scoreCompare != 0) return scoreCompare;

                int aUse = toInt(a.get("useCount"));
                int bUse = toInt(b.get("useCount"));

                return Integer.compare(bUse, aUse);
            }
        });

        List<Map<String, Object>> result = new ArrayList<>();
        Set<String> seenHsCode = new HashSet<>();

        for (Map<String, Object> row : list) {
            String hsCode = normalizeHsCode(str(row.get("hsCode")));

            if (hsCode.isEmpty()) continue;
            if (!seenHsCode.add(hsCode)) continue;

            row.put("rank", result.size() + 1);
            row.put("hsCode", hsCode);

            result.add(row);

            if (result.size() >= limit) break;
        }

        return result;
    }

    private String buildRecommendReason(Document doc, int useCount) {
        String basis = buildRecommendReason(doc);
        return basis + " / 과거 사용빈도 " + useCount + "건 반영";
    }
    
    /**
     * HS 기준문서 Milvus 전체 재적재
     *
     * 주의:
     * - Document id는 반드시 HS_REF_CHUNK.HS_DOC_ID와 같아야 한다.
     * - 추천 검색 후 selectHsRecommendByDocIds(docIds)에서 다시 Oracle과 매칭하기 때문이다.
     */
    @Override
    public Map<String, Object> reloadHsVectorStore() {
        Map<String, Object> result = new HashMap<>();

        if (!hsAiRecommendEnabled) {
            result.put("success", false);
            result.put("count", 0);
            result.put("message", "HS AI추천 기능이 비활성화되어 있습니다.");
            return result;
        }

        VectorStore vectorStore = vectorStoreProvider.getIfAvailable();

        if (vectorStore == null) {
            result.put("success", false);
            result.put("count", 0);
            result.put("message", "VectorStore Bean을 찾을 수 없습니다. Milvus/Spring AI 설정을 확인하세요.");
            return result;
        }

        List<Map<String, Object>> rows = brokerDeclareMapper.selectHsSourceForEmbedding();

        if (rows == null || rows.isEmpty()) {
            result.put("success", false);
            result.put("count", 0);
            result.put("message", "HS_REF_CHUNK 적재 대상 데이터가 없습니다.");
            return result;
        }

        List<Document> docs = new ArrayList<>();
        List<Map<String, Object>> chunkRows = new ArrayList<>();

        for (Map<String, Object> row : rows) {
        	String hsCode = str(first(row, "hsCode", "HSCODE", "HS_CODE"));
        	String hsName = str(first(row, "hsName", "HSNAME", "HS_NAME"));
        	String basicTariffRate = str(first(row, "basicTariffRate", "BASICTARIFFRATE", "BASIC_TARIFF_RATE", "HS_TARIFF_RATE"));
        	String keywords = str(first(row, "keywords", "KEYWORDS"));

            if (hsCode.isEmpty() || hsName.isEmpty()) {
                continue;
            }

            String hsDocId = "HS-DOC-" + hsCode + "-001";

            String chunkText =
                  "HS코드: " + hsCode
                + " / 품명: " + hsName
                + " / 기본세율: " + basicTariffRate
                + " / 키워드: " + keywords;

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("doc_id", hsDocId);
            metadata.put("hs_code", hsCode);
            metadata.put("hs_name", hsName);
            metadata.put("chunk_index", 1);
            metadata.put("source", "HS_CODE");

            Document doc = new Document(
                hsDocId,
                chunkText,
                metadata
            );

            docs.add(doc);

            Map<String, Object> chunkRow = new HashMap<>();
            chunkRow.put("hsDocId", hsDocId);
            chunkRow.put("hsCode", hsCode);
            chunkRow.put("chunkIndex", 1);
            chunkRow.put("chunkText", chunkText);

            chunkRows.add(chunkRow);
        }

        if (docs.isEmpty()) {
            result.put("success", false);
            result.put("count", 0);
            result.put("message", "Milvus에 넣을 유효한 Document가 없습니다.");
            return result;
        }

        /*
         * 너무 많을 수 있으므로 100건씩 나눠서 add.
         * 한 번에 너무 많이 넣으면 embedding API 또는 Milvus insert에서 실패할 수 있다.
         */
        int batchSize = 100;
        int inserted = 0;

        for (int i = 0; i < docs.size(); i += batchSize) {
            int end = Math.min(i + batchSize, docs.size());
            List<Document> batch = docs.subList(i, end);

            vectorStore.add(batch);
            inserted += batch.size();
        }

        /*
         * Milvus 적재가 모두 성공한 뒤 Oracle 매핑을 1번만 재생성한다.
         * 배치 루프 안에서 delete/insert를 하면 배치마다 HS_REF_CHUNK를 지웠다 다시 넣게 된다.
         */
        for (Map<String, Object> chunkRow : chunkRows) {
            brokerDeclareMapper.insertHsRefChunk(chunkRow);
        }

        result.put("success", true);
        result.put("count", inserted);
        result.put("message", "HS 기준문서 Milvus 재적재 완료");

        return result;
    }
    
    private Object first(Map<String, Object> row, String... keys) {
        if (row == null || keys == null) {
            return null;
        }

        for (String key : keys) {
            if (row.containsKey(key)) {
                return row.get(key);
            }
        }

        return null;
    }
    
    
    
    /**
     * HS 기준자료를 Milvus VectorStore에 재적재
     *
     * 1차 구현:
     * - Oracle HS_CODE / HS_KEYWORD / HS_CLASS / 사용이력 기준으로 Document 생성
     * - metadata에 hsCode를 반드시 저장
     * - 추천 시 Milvus metadata.hsCode로 Oracle HS정보를 다시 조회
     *
     * 주의:
     * - 이 메서드는 기존 Milvus 데이터를 삭제하지 않고 add만 수행한다.
     * - 개발 테스트 시 중복 적재가 걱정되면 Attu에서 컬렉션 초기화 후 실행한다.
     */
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> reindexHsRecommendVector(String brokerId) {
        Map<String, Object> result = new HashMap<>();

        if (!hsAiRecommendEnabled) {
            result.put("success", false);
            result.put("count", 0);
            result.put("message", "HS AI추천 기능이 비활성화되어 있습니다.");
            return result;
        }

        VectorStore vectorStore = vectorStoreProvider.getIfAvailable();

        if (vectorStore == null) {
            result.put("success", false);
            result.put("count", 0);
            result.put("message", "VectorStore Bean을 찾을 수 없습니다. Milvus/Spring AI 설정을 확인하세요.");
            return result;
        }

        List<Map<String, Object>> sourceList = brokerDeclareMapper.selectHsVectorSourceList();

        if (sourceList == null || sourceList.isEmpty()) {
            result.put("success", false);
            result.put("count", 0);
            result.put("message", "벡터 적재 대상 HS 기준자료가 없습니다.");
            return result;
        }

        int totalCount = 0;
        int maxTestCount = 1;

        for (Map<String, Object> row : sourceList) {
            if (totalCount >= maxTestCount) {
                break;
            }

            String hsCode = str(row.get("hsCode"));
            String hsName = str(row.get("hsName"));

            if (hsCode.isEmpty()) {
                continue;
            }

            String content = buildHsVectorContent(row);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("source", "ORACLE_HS_CODE");
            metadata.put("hsCode", hsCode);
            metadata.put("hsName", hsName);
            metadata.put("basicTariffRate", row.get("basicTariffRate"));
            metadata.put("hsClassNm", row.get("hsClassNm"));
            metadata.put("useCount", row.get("useCount"));

            Document document = new Document(content, metadata);

            vectorStore.add(List.of(document));
            totalCount++;

            try {
                Thread.sleep(3000L);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                throw new IllegalStateException("HS 벡터 적재가 중단되었습니다.", ie);
            }
        }
        

        result.put("success", true);
        result.put("count", totalCount);
        result.put("message", "HS 벡터 재적재 완료: " + totalCount + "건");

        return result;
    }

    /**
     * HS 1건을 Milvus 검색용 문장으로 변환
     */
    private String buildHsVectorContent(Map<String, Object> row) {
        String hsCode = str(row.get("hsCode"));
        String hsName = str(row.get("hsName"));
        String hsClassPath = str(row.get("hsClassPath"));
        String hsClassNm = str(row.get("hsClassNm"));
        String hsClassDesc = str(row.get("hsClassDesc"));
        String keywords = str(row.get("keywords"));
        if (keywords.isEmpty()) {
            keywords = str(row.get("KEYWORDS"));
        }
        String tariffRate = str(row.get("basicTariffRate"));
        String useCount = str(row.get("useCount"));

        StringBuilder sb = new StringBuilder();

        sb.append("HS코드: ").append(hsCode).append("\n");
        sb.append("HS품명: ").append(hsName).append("\n");

        if (!hsClassPath.isEmpty()) {
            sb.append("분류경로: ").append(hsClassPath).append("\n");
        }

        if (!hsClassNm.isEmpty()) {
            sb.append("분류명: ").append(hsClassNm).append("\n");
        }

        if (!hsClassDesc.isEmpty()) {
            sb.append("분류설명: ").append(hsClassDesc).append("\n");
        }

        if (!keywords.isEmpty()) {
            sb.append("검색키워드: ").append(keywords).append("\n");
        }

        if (!tariffRate.isEmpty()) {
            sb.append("기본세율: ").append(tariffRate).append("%\n");
        }

        if (!useCount.isEmpty()) {
            sb.append("과거 사용빈도: ").append(useCount).append("건\n");
        }

        return sb.toString();
    }
    
    
    private String str(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }	
 
    
    /*
     * 8D-ATTACH
     * 수입신고서 첨부파일 업로드
     *
     * 핵심 구조:
     * - 수입신고서는 통관의뢰번호 IR_NO를 기준으로 작성됨
     * - 첨부파일은 IMP_DCLR이 아니라 IMP_RQST.IR_TFG_NO에 연결
     *
     * 처리 흐름:
     * 1. irNo로 수입의뢰 조회
     * 2. 기존 IR_TFG_NO 확인
     * 3. 없으면 새 파일그룹 생성 후 IMP_RQST.IR_TFG_NO 업데이트
     * 4. 있으면 기존 파일그룹에 파일만 추가
     */
    @Override
    @Transactional
    public Long uploadImpDocs(String irNo,
                              List<MultipartFile> files,
                              String brokerId) throws Exception {

        if (irNo == null || irNo.trim().isEmpty()) {
            throw new IllegalArgumentException("통관의뢰번호가 없습니다.");
        }

        /*
         * 8D-ATTACH
         * 현재 로그인한 관세사 기준으로 해당 수입의뢰 조회.
         * selectImpRqstById가 brokerId 조건을 이미 가지고 있다면 그대로 사용.
         */
        ImpRqstVO rqst = brokerDeclareMapper.selectImpRqstById(irNo.trim(), brokerId);

        if (rqst == null) {
            throw new IllegalStateException("수입의뢰 정보를 찾을 수 없습니다.");
        }

        Long tfgNo = rqst.getIrTfgNo();

        /*
         * 8D-ATTACH
         * 기존 파일그룹이 없는 경우:
         * - 공통 파일서비스 uploadFiles()로 새 파일그룹 생성
         * - 생성된 tfgNo를 IMP_RQST.IR_TFG_NO에 연결
         */
        if (tfgNo == null) {
            tfgNo = fileService.uploadFiles(
                TacsCstmSt.CSTM_REQ.name(),
                files,
                brokerId,
                TacsUserType.BROKER.name()
            );

            if (tfgNo != null) {
                brokerDeclareMapper.updateImpRqstTfgNo(irNo.trim(), tfgNo);
            }

            return tfgNo;
        }

        /*
         * 8D-ATTACH
         * 기존 파일그룹이 있는 경우:
         * - 새 파일그룹을 만들지 않음
         * - 기존 tfgNo에 파일만 추가
         */
        fileService.uploadFilesToGroup(
            tfgNo,
            TacsCstmSt.CSTM_REQ.name(),
            files,
            brokerId,
            TacsUserType.BROKER.name()
        );

        return tfgNo;
    }

    /*
     * 8D-ATTACH
     * 수입신고서 첨부파일 목록 조회
     *
     * 처리 흐름:
     * irNo → IMP_RQST.IR_TFG_NO → fileService.getFileList(tfgNo)
     */
    @Override
    public List<FileInfoDTO> getImpDocList(String irNo,
                                           String brokerId) {

        if (irNo == null || irNo.trim().isEmpty()) {
            return Collections.emptyList();
        }

        ImpRqstVO rqst = brokerDeclareMapper.selectImpRqstById(irNo.trim(), brokerId);

        if (rqst == null || rqst.getIrTfgNo() == null) {
            return Collections.emptyList();
        }

        return fileService.getFileList(rqst.getIrTfgNo());
    }

    /*
     * 8D-ATTACH
     * 수입신고서 첨부파일 삭제
     *
     * 현재 MVP:
     * - fileNo 기준 공통 삭제 호출
     *
     * 추후 보강:
     * - fileNo가 해당 irNo의 IR_TFG_NO에 속하는지 검증하는 쿼리 추가 권장
     */
    @Override
    @Transactional
    public void deleteImpDoc(String irNo,
                             Long fileNo,
                             String brokerId) {

        if (irNo == null || irNo.trim().isEmpty()) {
            throw new IllegalArgumentException("통관의뢰번호가 없습니다.");
        }

        if (fileNo == null) {
            throw new IllegalArgumentException("삭제할 파일번호가 없습니다.");
        }

        ImpRqstVO rqst = brokerDeclareMapper.selectImpRqstById(irNo.trim(), brokerId);

        if (rqst == null || rqst.getIrTfgNo() == null) {
            throw new IllegalStateException("첨부파일 그룹을 찾을 수 없습니다.");
        }

        /*
         * 8D-ATTACH
         * 공통 파일 삭제.
         * fileService.deleteFile()은 dfiFileNo 기준 삭제.
         */
        fileService.deleteFile(fileNo);
    }

    /*
     * 8E-DELETE
     * 수입신고서 임시저장 삭제
     *
     * 처리 순서:
     * 1. 모델/규격 삭제
     * 2. 란사항 삭제
     * 3. 부모 IMP_DCLR 삭제
     *
     * SUBMIT 상태는 삭제 불가.
     */
    @Override
    @Transactional
    public void deleteImpDraft(String idIrNo, String brokerId) {
        if (idIrNo == null || idIrNo.trim().isEmpty()) {
            throw new IllegalArgumentException("삭제할 통관의뢰번호가 없습니다.");
        }

        if (brokerId == null || brokerId.trim().isEmpty()) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        String trimmedIdIrNo = idIrNo.trim();

        brokerDeclareMapper.deleteImpDclrItemMdlspecsByIrNo(trimmedIdIrNo);
        brokerDeclareMapper.deleteImpDclrItemsByIrNo(trimmedIdIrNo);

        int affected = brokerDeclareMapper.deleteImpDclr(trimmedIdIrNo, brokerId);

        if (affected == 0) {
            throw new IllegalStateException("삭제할 수 없는 신고서입니다. 본인 임시저장 건이 아니거나 이미 전송된 신고서입니다.");
        }
    }
}
