package kr.or.tacs.vo.common;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaginationInfoVO<T> {

    private int totalRecord;
    private int totalPage;
    private int currentPage = 1;
    private int screenSize = 10;
    private int blockSize = 5;
    private int startRow;
    private int endRow;
    private int startPage;
    private int endPage;
    private List<T> dataList;
    private String searchType;
    private String searchWord;
    private T searchDTO;		// 검색조건 DTO

    public PaginationInfoVO() {
        setCurrentPage(1);
    }

    public PaginationInfoVO(int screenSize, int blockSize) {
        this.screenSize = screenSize;
        this.blockSize = blockSize;
        setCurrentPage(1);
    }

    public void setTotalRecord(int totalRecord) {
        this.totalRecord = Math.max(totalRecord, 0);
        this.totalPage = (int) Math.ceil(this.totalRecord / (double) getScreenSize());
        if (this.endPage > this.totalPage) {
            this.endPage = this.totalPage;
        }
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = Math.max(currentPage, 1);
        this.endRow = this.currentPage * getScreenSize();
        this.startRow = this.endRow - (getScreenSize() - 1);
        this.endPage = (this.currentPage + (getBlockSize() - 1)) / getBlockSize() * getBlockSize();
        this.startPage = this.endPage - (getBlockSize() - 1);
    }

    public int getScreenSize() {
        return screenSize < 1 ? 10 : screenSize;
    }

    public int getBlockSize() {
        return blockSize < 1 ? 5 : blockSize;
    }

    public boolean isHasPrevBlock() {
        return startPage > 1;
    }

    public boolean isHasNextBlock() {
        return endPage < totalPage;
    }

    public String getPagingHTML() {
        StringBuilder html = new StringBuilder();
        html.append("<ul class='pagination pagination-sm m-0 float-right'>");

        if (startPage > 1) {
            html.append("<li class='page-item'><a href='?page=")
                .append(startPage - 1)
                .append("' class='page-link' data-page='")
                .append(startPage - 1)
                .append("'>Prev</a></li>");
        }

        int lastPage = Math.min(endPage, totalPage);
        for (int i = startPage; i <= lastPage; i++) {
            if (i == currentPage) {
                html.append("<li class='page-item active'><span class='page-link'>")
                    .append(i)
                    .append("</span></li>");
            } else {
                html.append("<li class='page-item'><a href='?page=")
                    .append(i)
                    .append("' class='page-link' data-page='")
                    .append(i)
                    .append("'>")
                    .append(i)
                    .append("</a></li>");
            }
        }

        if (endPage < totalPage) {
            html.append("<li class='page-item'><a href='?page=")
                .append(endPage + 1)
                .append("' class='page-link' data-page='")
                .append(endPage + 1)
                .append("'>Next</a></li>");
        }

        html.append("</ul>");
        return html.toString();
    }
}
