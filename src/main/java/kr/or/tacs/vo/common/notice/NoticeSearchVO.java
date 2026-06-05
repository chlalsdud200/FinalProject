package kr.or.tacs.vo.common.notice;

import kr.or.tacs.vo.common.PaginationInfoVO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeSearchVO extends PaginationInfoVO<NoticeVO> {

    private String type = "all";
    private String keyword;
    private String fromDate;
    private String toDate;
    private String pinnedYn = "all";
    private String useYn = "Y";

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
