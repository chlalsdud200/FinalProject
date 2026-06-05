package kr.or.tacs.systemadmin.hsknowledge.service;

import java.math.BigDecimal;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import kr.or.tacs.systemadmin.hsknowledge.mapper.IHsKeywordMapper;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordRequestVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsKeywordVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HsKeywordServiceImpl implements IHsKeywordService {

    private final IHsKeywordMapper hsKeywordMapper;

    @Override
    public PaginationInfoVO<HsKeywordVO> retriveHsKeywordList(HsKeywordSearchVO search) {
        HsKeywordSearchVO normalized = search == null ? new HsKeywordSearchVO() : search;
        normalized.setHsCode(trim(normalized.getHsCode()));
        normalized.setHsName(trim(normalized.getHsName()));
        normalized.setKeyword(trim(normalized.getKeyword()));
        normalized.setUseYn(normalizeFilterUseYn(normalized.getUseYn()));
        normalizePage(normalized);

        int totalRecord = hsKeywordMapper.selectHsKeywordTotalRecord(normalized);
        normalized.setTotalRecord(totalRecord);
        normalized.setDataList(hsKeywordMapper.selectHsKeywordList(normalized));

        return normalized;
    }

    @Override
    public HsKeywordVO retriveHsKeyword(Long hsKeywordNo) {
        return getKeyword(requireId(hsKeywordNo));
    }

    @Override
    @Transactional
    public Long registHsKeyword(HsKeywordRequestVO request) {
        HsKeywordVO keyword = toKeywordVO(request, null);
        validateHsCodeExists(keyword.getHsCode());
        validateDuplicateKeyword(keyword.getHsCode(), keyword.getKeyword(), null);
        hsKeywordMapper.insertHsKeyword(keyword);
        return keyword.getHsKeywordNo();
    }

    @Override
    @Transactional
    public void modifyHsKeyword(Long hsKeywordNo, HsKeywordRequestVO request) {
        Long id = requireId(hsKeywordNo);
        getKeyword(id);
        HsKeywordVO keyword = toKeywordVO(request, id);
        validateHsCodeExists(keyword.getHsCode());
        validateDuplicateKeyword(keyword.getHsCode(), keyword.getKeyword(), id);
        int updated = hsKeywordMapper.updateHsKeyword(keyword);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "키워드가 존재하지 않습니다.");
        }
    }

    @Override
    @Transactional
    public void modifyHsKeywordUseYn(Long hsKeywordNo, String useYn) {
        Long id = requireId(hsKeywordNo);
        String normalizedUseYn = normalizeYn(useYn, "사용여부는 Y 또는 N만 가능합니다.");
        getKeyword(id);
        int updated = hsKeywordMapper.updateHsKeywordUseYn(id, normalizedUseYn);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "키워드가 존재하지 않습니다.");
        }
    }

    private HsKeywordVO toKeywordVO(HsKeywordRequestVO request, Long hsKeywordNo) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 데이터가 없습니다.");
        }
        HsKeywordVO keyword = new HsKeywordVO();
        keyword.setHsKeywordNo(hsKeywordNo);
        keyword.setHsCode(requireText(request.getHsCode(), "HS 코드를 입력해 주세요."));
        keyword.setKeyword(requireText(request.getKeyword(), "키워드를 입력해 주세요."));
        keyword.setKeywordWeight(normalizeWeight(request.getKeywordWeight()));
        keyword.setUseYn(normalizeYn(defaultValue(request.getUseYn(), "Y"), "사용여부는 Y 또는 N만 가능합니다."));
        return keyword;
    }

    private void validateHsCodeExists(String hsCode) {
        if (hsKeywordMapper.countHsCode(hsCode) == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않는 HS 코드입니다.");
        }
    }

    private void validateDuplicateKeyword(String hsCode, String keyword, Long excludeNo) {
        if (hsKeywordMapper.countActiveHsKeyword(hsCode, keyword, excludeNo) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 동일한 활성 키워드가 존재합니다.");
        }
    }

    private HsKeywordVO getKeyword(Long hsKeywordNo) {
        HsKeywordVO keyword = hsKeywordMapper.selectHsKeyword(hsKeywordNo);
        if (keyword == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "키워드가 존재하지 않습니다.");
        }
        return keyword;
    }

    private BigDecimal normalizeWeight(BigDecimal weight) {
        if (weight == null) {
            return BigDecimal.ONE;
        }
        if (weight.signum() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "가중치는 0 이상이어야 합니다.");
        }
        return weight;
    }

    private String normalizeFilterUseYn(String useYn) {
        String value = trim(useYn);
        if (!StringUtils.hasText(value) || "all".equalsIgnoreCase(value)) {
            return "all";
        }
        return normalizeYn(value, "사용여부 필터는 all, Y, N만 가능합니다.");
    }

    private String normalizeYn(String value, String message) {
        String normalized = trim(value);
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        normalized = normalized.toUpperCase(Locale.ROOT);
        if (!"Y".equals(normalized) && !"N".equals(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return normalized;
    }

    private Long requireId(Long value) {
        if (value == null || value <= 0L) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "키워드 번호가 올바르지 않습니다.");
        }
        return value;
    }

    private String requireText(String value, String message) {
        String trimmed = trim(value);
        if (!StringUtils.hasText(trimmed)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return trimmed;
    }

    private String defaultValue(String value, String defaultValue) {
        String trimmed = trim(value);
        return StringUtils.hasText(trimmed) ? trimmed : defaultValue;
    }

    private String trim(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void normalizePage(HsKeywordSearchVO search) {
        int currentPage = Math.max(search.getCurrentPage(), 1);

        int screenSize = search.getScreenSize();
        if (screenSize != 10 && screenSize != 20 && screenSize != 50) {
            screenSize = 10;
        }

        search.setScreenSize(screenSize);
        search.setCurrentPage(currentPage);
    }
}
