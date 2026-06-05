package kr.or.tacs.dto;

import lombok.Data;

@Data
public class PageDTO {

    // 페이징
    private int page = 1;       // 현재 페이지
    private int size = 10;      // 한 페이지 게시글 수
    private int blockSize = 5;  // 페이지 번호 블록 수
    private int totalCount;     // 전체 건수

    // 공통 검색
    private String keyword;      // 통합검색어
    private String searchType;   // 검색구분
    private String statusCd;     // 상태
    private String startDate;    // 시작일
    private String endDate;      // 종료일

    public int getOffset() {
        return (page - 1) * size;
    }

    public int getStartRow() {
        return getOffset() + 1;
    }

    public int getEndRow() {
        return page * size;
    }

    public int getTotalPage() {
        if (totalCount == 0) {
            return 1;
        }
        return (int) Math.ceil((double) totalCount / size);
    }

    public int getStartPage() {
        return ((page - 1) / blockSize) * blockSize + 1;
    }

    public int getEndPage() {
        int endPage = getStartPage() + blockSize - 1;
        return Math.min(endPage, getTotalPage());
    }

    public boolean isPrev() {
        return getStartPage() > 1;
    }

    public boolean isNext() {
        return getEndPage() < getTotalPage();
    }
}