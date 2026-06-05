package kr.or.tacs.common.faq.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import kr.or.tacs.vo.common.CustomUser;
import kr.or.tacs.common.faq.mapper.IFaqMapper;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.dto.FaqRequest;
import kr.or.tacs.vo.FaqSearchVO;
import kr.or.tacs.vo.FaqVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FaqServiceImpl implements IFaqService {

    private static final Set<String> FAQ_CTGRY_CODES = Set.of(
            "ACCOUNT", "IMPORT", "EXPORT", "DOC", "PAYMENT",
            "TRANSPORT", "WAREHOUSE", "SYSTEM", "ETC"
    );

    private static final Set<String> TARGET_ROLE_CODES = Set.of(
            "ALL",
            "OWNER",
            "BROKER",
            "OFFICER",
            "FIELD_OFFICER",
            "TRANSPORT_MANAGER",
            "WAREHOUSE_MANAGER",
            "SYSTEM_ADMIN"
    );

    private final IFaqMapper faqMapper;

    @Override
    public PaginationInfoVO<FaqVO> retrieveFaqList(FaqSearchVO search, CustomUser loginUser) {
        if (loginUser == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        if (search == null) {
            search = new FaqSearchVO();
        }

        normalizeSearch(search);

        // 화면 파라미터 roleCd는 신뢰하지 않고 로그인 사용자 권한 기준으로만 조회한다.
        // FIELD_OFFICER는 ACTOR_TYPE이 아니지만 게시판 노출 대상 코드로는 유지한다.
        search.setRoleCd(resolveBoardTargetRoleCd(loginUser));

        int totalCount = faqMapper.selectFaqCount(search);
        search.setTotalRecord(totalCount);
        search.setAvailableCtgryCds(faqMapper.selectAvailableFaqCtgryCds(search));
        search.setDataList(faqMapper.retrieveFaqList(search));

        return search;
    }

    @Override
    public PaginationInfoVO<FaqVO> retrieveFaqAdminList(FaqSearchVO search) {
        if (search == null) {
            search = new FaqSearchVO();
        }

        normalizeSearch(search);
        normalizeUseYn(search);

        int totalCount = faqMapper.selectFaqAdminCount(search);
        search.setTotalRecord(totalCount);
        search.setDataList(faqMapper.retrieveFaqAdminList(search));

        return search;
    }

    @Override
    @Transactional
    public FaqVO retrieveFaq(Long faqNo, boolean increaseHit, CustomUser loginUser) {
        if (loginUser == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        if (faqNo == null) {
            throw new IllegalArgumentException("FAQ 번호가 필요합니다.");
        }

        if (increaseHit) {
            faqMapper.updateFaqHit(faqNo);
        }

        FaqVO faq = faqMapper.selectFaq(faqNo, resolveBoardTargetRoleCd(loginUser));
        if (faq == null) {
            throw new IllegalArgumentException("조회 가능한 FAQ가 없습니다.");
        }

        faq.setTargetRoleCds(faqMapper.selectFaqTargetRoleCds(faqNo));
        return faq;
    }

    @Override
    public FaqVO retrieveFaqForAdmin(Long faqNo) {
        if (faqNo == null) {
            throw new IllegalArgumentException("FAQ 번호가 필요합니다.");
        }

        FaqVO faq = faqMapper.selectFaqForAdmin(faqNo);
        if (faq == null) {
            throw new IllegalArgumentException("FAQ가 존재하지 않습니다.");
        }

        faq.setTargetRoleCds(faqMapper.selectFaqTargetRoleCds(faqNo));
        return faq;
    }

    @Override
    @Transactional
    public Long registFaq(FaqRequest request, CustomUser loginUser) {
        if (loginUser == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        FaqVO faq = toFaq(request);
        faq.setFaqAdminId(loginUser.getLoginId());

        faqMapper.insertFaq(faq);
        faq.setFaqSortSn(reorderFaqSortNumbers(faq.getFaqNo(), faq.getFaqSortSn()));
        faqMapper.insertFaqAuths(faq.getFaqNo(), faq.getTargetRoleCds());

        return faq.getFaqNo();
    }

    @Override
    @Transactional
    public void modifyFaq(Long faqNo, FaqRequest request) {
        if (faqNo == null) {
            throw new IllegalArgumentException("FAQ 번호가 필요합니다.");
        }

        FaqVO faq = toFaq(request);
        faq.setFaqNo(faqNo);
        if (faqMapper.selectFaqForAdmin(faqNo) == null) {
            throw new IllegalArgumentException("FAQ가 존재하지 않습니다.");
        }

        faq.setFaqSortSn(reorderFaqSortNumbers(faqNo, faq.getFaqSortSn()));

        int count = faqMapper.updateFaq(faq);
        if (count == 0) {
            throw new IllegalArgumentException("FAQ가 존재하지 않습니다.");
        }

        // 노출대상은 수정 시 기존 권한 삭제 후 다시 등록한다.
        faqMapper.deleteFaqAuths(faqNo);
        faqMapper.insertFaqAuths(faqNo, faq.getTargetRoleCds());
    }

    @Override
    @Transactional
    public void deleteFaq(Long faqNo) {
        if (faqNo == null) {
            throw new IllegalArgumentException("FAQ 번호가 필요합니다.");
        }

        faqMapper.deleteFaqAuths(faqNo);

        int count = faqMapper.deleteFaq(faqNo);
        if (count == 0) {
            throw new IllegalArgumentException("FAQ가 존재하지 않습니다.");
        }
    }

    private FaqVO toFaq(FaqRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("요청 데이터가 없습니다.");
        }

        String ctgryCd = trim(request.getFaqCtgryCd());
        String qstnCn = trim(request.getFaqQstnCn());
        String ansCn = trim(request.getFaqAnsCn());
        String useYn = trim(request.getFaqUseYn());

        if (!StringUtils.hasText(ctgryCd)) {
            throw new IllegalArgumentException("FAQ 분류를 선택해 주세요.");
        }
        if (!FAQ_CTGRY_CODES.contains(ctgryCd)) {
            throw new IllegalArgumentException("허용되지 않은 FAQ 분류입니다.");
        }
        if (!StringUtils.hasText(qstnCn)) {
            throw new IllegalArgumentException("질문을 입력해 주세요.");
        }
        if (!StringUtils.hasText(ansCn)) {
            throw new IllegalArgumentException("답변을 입력해 주세요.");
        }

        if (useYn == null) {
            useYn = "Y";
        }
        if (!Set.of("Y", "N").contains(useYn)) {
            throw new IllegalArgumentException("사용여부는 Y 또는 N만 가능합니다.");
        }

        List<String> targetRoleCds = request.getTargetRoleCds();
        if (targetRoleCds == null || targetRoleCds.isEmpty()) {
            throw new IllegalArgumentException("노출대상을 1개 이상 선택해 주세요.");
        }

        targetRoleCds = targetRoleCds.stream()
                .map(this::trim)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();

        if (targetRoleCds.isEmpty()) {
            throw new IllegalArgumentException("노출대상을 1개 이상 선택해 주세요.");
        }
        if (!TARGET_ROLE_CODES.containsAll(targetRoleCds)) {
            throw new IllegalArgumentException("허용되지 않은 노출대상이 포함되어 있습니다.");
        }
        if (targetRoleCds.contains("ALL") && targetRoleCds.size() > 1) {
            throw new IllegalArgumentException("전체 노출을 선택한 경우 다른 노출대상은 함께 선택하지 않습니다.");
        }

        FaqVO faq = new FaqVO();
        faq.setFaqCtgryCd(ctgryCd);
        faq.setFaqQstnCn(qstnCn);
        faq.setFaqAnsCn(ansCn);
        faq.setFaqSortSn(request.getFaqSortSn() == null ? 1 : request.getFaqSortSn());
        faq.setFaqUseYn(useYn);
        faq.setTargetRoleCds(targetRoleCds);

        return faq;
    }

    private int reorderFaqSortNumbers(Long targetFaqNo, Integer requestedSortSn) {
        List<FaqVO> orderedFaqs = faqMapper.selectFaqOrderListForUpdate();
        if (orderedFaqs == null || orderedFaqs.isEmpty()) {
            return 1;
        }

        FaqVO targetFaq = null;
        for (FaqVO faq : orderedFaqs) {
            if (targetFaqNo.equals(faq.getFaqNo())) {
                targetFaq = faq;
                break;
            }
        }

        if (targetFaq == null) {
            return requestedSortSn == null || requestedSortSn < 1 ? 1 : requestedSortSn;
        }

        orderedFaqs = orderedFaqs.stream()
                .filter(faq -> !targetFaqNo.equals(faq.getFaqNo()))
                .toList();

        int targetIndex = requestedSortSn == null ? 0 : requestedSortSn - 1;
        targetIndex = Math.max(0, Math.min(targetIndex, orderedFaqs.size()));
        int normalizedSortSn = targetIndex + 1;

        for (int index = 0, nextSortSn = 1; index <= orderedFaqs.size(); index++) {
            FaqVO faq = index == targetIndex ? targetFaq : orderedFaqs.get(index > targetIndex ? index - 1 : index);
            if (!Integer.valueOf(nextSortSn).equals(faq.getFaqSortSn())) {
                faqMapper.updateFaqSortSn(faq.getFaqNo(), nextSortSn);
            }
            nextSortSn++;
        }

        return normalizedSortSn;
    }

    private void normalizeSearch(FaqSearchVO search) {
        String ctgryCd = trim(search.getCtgryCd());

        if (ctgryCd == null || "all".equalsIgnoreCase(ctgryCd)) {
            search.setCtgryCd("all");
        } else {
            search.setCtgryCd(ctgryCd.toUpperCase());
        }

        // 기존 keyword 파라미터와 PaginationInfoVO의 searchWord를 함께 지원한다.
        // 화면에서는 searchType(title/content) + searchWord 조합을 사용한다.
        String searchWord = trim(search.getSearchWord());
        String keyword = trim(search.getKeyword());
        if (!StringUtils.hasText(searchWord)) {
            searchWord = keyword;
        }

        String searchType = trim(search.getSearchType());
        if (!StringUtils.hasText(searchType)) {
            searchType = "title";
        } else {
            searchType = searchType.toLowerCase();
        }
        if (!Set.of("title", "content", "all").contains(searchType)) {
            searchType = "title";
        }

        search.setSearchType(searchType);
        search.setSearchWord(searchWord);
        search.setKeyword(searchWord);
    }

    private void normalizeUseYn(FaqSearchVO search) {
        String useYn = trim(search.getUseYn());

        if (useYn == null || "all".equalsIgnoreCase(useYn)) {
            search.setUseYn("all");
            return;
        }

        useYn = useYn.toUpperCase();
        if (!Set.of("Y", "N").contains(useYn)) {
            search.setUseYn("all");
            return;
        }

        search.setUseYn(useYn);
    }

    private String trim(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String resolveBoardTargetRoleCd(CustomUser loginUser) {
        if ("OFFICER".equals(loginUser.getRoleCd()) && "FIELD_OFFICER".equals(loginUser.getOfficerTyCd())) {
            return "FIELD_OFFICER";
        }
        return loginUser.getRoleCd();
    }
}
