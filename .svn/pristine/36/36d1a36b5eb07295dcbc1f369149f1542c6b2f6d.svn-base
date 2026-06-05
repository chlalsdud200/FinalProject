package kr.or.tacs.vo.systemadmin.hsknowledge;

import kr.or.tacs.vo.common.PaginationInfoVO;
import lombok.Data;

@Data
public class HsKeywordSearchVO extends PaginationInfoVO<HsKeywordVO> {

    private String hsCode;
    private String hsName;
    private String keyword;
    private String useYn = "all";

    public void setPage(int page) {
        setCurrentPage(page);
    }

    public int getPage() {
        return getCurrentPage();
    }

    public void setSize(int size) {
        setScreenSize(size == 20 || size == 50 ? size : 10);
        // screenSize 변경 후 startRow/endRow를 다시 계산한다.
        setCurrentPage(getCurrentPage());
    }

    public int getSize() {
        return getScreenSize();
    }
}
