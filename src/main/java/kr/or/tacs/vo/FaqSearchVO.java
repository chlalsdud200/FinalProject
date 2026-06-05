package kr.or.tacs.vo;

import java.util.List;

import kr.or.tacs.vo.common.PaginationInfoVO;
import lombok.Data;

@Data
public class FaqSearchVO extends PaginationInfoVO<FaqVO> {

    // all이면 전체 분류
    private String ctgryCd = "all";

    // 질문/답변 검색어
    private String keyword;

    // 사용자 화면에서는 로그인한 사용자의 권한코드를 서버에서 넣는다.
    private String roleCd;

    // 관리자 화면에서 사용여부 필터링용. all, Y, N
    private String useYn = "all";

    // 사용자 권한으로 조회 가능한 FAQ 분류
    private List<String> availableCtgryCds;

    public void setPage(int page) {
        setCurrentPage(page);
    }

    public int getPage() {
        return getCurrentPage();
    }

    public void setSize(int size) {
        setScreenSize(Math.min(Math.max(size, 1), 100));
        setCurrentPage(getCurrentPage());
    }

    public int getSize() {
        return getScreenSize();
    }
}
