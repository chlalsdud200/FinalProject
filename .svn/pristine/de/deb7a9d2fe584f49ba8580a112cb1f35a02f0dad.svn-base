package kr.or.tacs.dto.officer;

import kr.or.tacs.vo.common.PaginationInfoVO;
import lombok.Getter;
import lombok.Setter;

/**
 * 기본심사목록 검색 조건 + 페이지네이션.
 * NoticeSearchVO 와 동일한 PaginationInfoVO 상속 패턴을 사용한다.
 */
@Getter
@Setter
public class BasicScreenSearchDTO extends PaginationInfoVO<BasicScreenListDTO> {

    private String reqNo;        // 신고번호
    private String declareType;  // 신고구분 (수입/수출)
    private String companyName;  // 수입자명
    private String statusCd;     // 현재상태 코드
    private String riskGradeCd;  // AI 위험도 등급

    /** page 파라미터 → currentPage 로 위임 */
    public void setPage(int page) {
        setCurrentPage(page);
    }

    public int getPage() {
        return getCurrentPage();
    }

    /** size 파라미터 → screenSize 로 위임 (1~100 범위 제한) */
    public void setSize(int size) {
        setScreenSize(Math.min(Math.max(size, 1), 100));
        setCurrentPage(getCurrentPage());
    }

    public int getSize() {
        return getScreenSize();
    }
}