package kr.or.tacs.systemadmin.hsknowledge.service;

import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import kr.or.tacs.systemadmin.hsknowledge.mapper.IHsCodeMapper;
import kr.or.tacs.vo.common.PaginationInfoVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeRequestVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeSearchVO;
import kr.or.tacs.vo.systemadmin.hsknowledge.HsCodeVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HsCodeServiceImpl implements IHsCodeService {

    private final IHsCodeMapper hsCodeMapper;

    @Override
    public PaginationInfoVO<HsCodeVO> retriveHsCodeList(HsCodeSearchVO search) {
        HsCodeSearchVO normalized = search == null ? new HsCodeSearchVO() : search;
        normalized.setHsCode(trim(normalized.getHsCode()));
        normalized.setHsName(trim(normalized.getHsName()));
        normalized.setHsClassLevelCd(normalizeLevel(normalized.getHsClassLevelCd()));
        normalized.setUseYn(normalizeFilterUseYn(normalized.getUseYn()));
        normalizePage(normalized);

        int totalRecord = hsCodeMapper.selectHsCodeTotalRecord(normalized);
        normalized.setTotalRecord(totalRecord);
        normalized.setDataList(hsCodeMapper.selectHsCodeList(normalized));

        return normalized;
    }

    @Override
    public HsCodeVO retriveHsCode(String hsCode) {
        return getHsCode(requireText(hsCode, "HS 코드를 입력해 주세요."));
    }

    @Override
    @Transactional
    public void modifyHsCode(String hsCode, HsCodeRequestVO request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 데이터가 없습니다.");
        }

        String normalizedHsCode = requireText(hsCode, "HS 코드를 입력해 주세요.");
        getHsCode(normalizedHsCode);

        HsCodeVO target = new HsCodeVO();
        target.setHsCode(normalizedHsCode);
        target.setHsName(requireText(request.getHsName(), "품명을 입력해 주세요."));
        target.setHsTariffRate(request.getHsTariffRate());
        target.setHsClassNm(trim(request.getHsClassNm()));
        target.setHsClassDesc(trim(request.getHsClassDesc()));
        target.setUseYn(normalizeYn(defaultValue(request.getUseYn(), "Y"), "사용여부는 Y 또는 N만 가능합니다."));

        hsCodeMapper.updateHsCode(target);
        hsCodeMapper.updateHsClass(target);
    }

    @Override
    @Transactional
    public void modifyHsCodeUseYn(String hsCode, String useYn) {
        String normalizedHsCode = requireText(hsCode, "HS 코드를 입력해 주세요.");
        String normalizedUseYn = normalizeYn(useYn, "사용여부는 Y 또는 N만 가능합니다.");
        getHsCode(normalizedHsCode);
        int updated = hsCodeMapper.updateHsClassUseYn(normalizedHsCode, normalizedUseYn);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "HS 분류 정보가 존재하지 않습니다.");
        }
    }

    private HsCodeVO getHsCode(String hsCode) {
        HsCodeVO hs = hsCodeMapper.selectHsCode(hsCode);
        if (hs == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "HS 코드가 존재하지 않습니다.");
        }
        return hs;
    }

    private String normalizeLevel(String value) {
        String trimmed = trim(value);
        if (!StringUtils.hasText(trimmed) || "all".equalsIgnoreCase(trimmed)) {
            return "all";
        }
        return trimmed.toUpperCase(Locale.ROOT);
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

    private void normalizePage(HsCodeSearchVO search) {
        int currentPage = Math.max(search.getCurrentPage(), 1);

        int screenSize = search.getScreenSize();
        if (screenSize != 10 && screenSize != 20 && screenSize != 50) {
            screenSize = 10;
        }

        search.setScreenSize(screenSize);
        search.setCurrentPage(currentPage);
    }
}
