<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="faq-section" data-faq-root>
    <div class="tacs-faq-info-bar">
        <span class="material-symbols-outlined" style="font-size:18px">support_agent</span>
        자주 묻는 질문(FAQ)을 확인하실 수 있습니다.
    </div>

    <div class="filter-bar tacs-faq-search-bar" style="margin:0 0 12px; border-left:3px solid #565e74;">
        <select id="faq-search-type" data-faq-search-type style="min-width:120px">
            <option value="title">제목</option>
            <option value="content">내용</option>
        </select>
        <div class="search-wrap" style="flex:0 0 400px;">
            <span class="material-symbols-outlined">search</span>
            <input id="faq-search" data-faq-search placeholder="FAQ 제목 검색" onkeyup="if(event.keyCode===13) renderFaqList(1)">
        </div>
        <button type="button" class="btn btn-dark" onclick="renderFaqList(1)">조회</button>
    </div>

    <div class="faq-filter" style="margin-bottom:12px">
        <button type="button" class="cs-category active" data-faq-ctgry="all" onclick="filterFaq('all', this)">전체</button>
        <button type="button" class="cs-category" data-faq-ctgry="SYSTEM" onclick="filterFaq('system', this)">시스템 이용</button>
        <button type="button" class="cs-category" data-faq-ctgry="IMPORT" onclick="filterFaq('import', this)">수입통관</button>
        <button type="button" class="cs-category" data-faq-ctgry="EXPORT" onclick="filterFaq('export', this)">수출통관</button>
        <button type="button" class="cs-category" data-faq-ctgry="DOC" onclick="filterFaq('doc', this)">문서함</button>
        <button type="button" class="cs-category" data-faq-ctgry="TRANSPORT" onclick="filterFaq('transport', this)">운송</button>
        <button type="button" class="cs-category" data-faq-ctgry="WAREHOUSE" onclick="filterFaq('warehouse', this)">창고</button>
        <button type="button" class="cs-category" data-faq-ctgry="ACCOUNT" onclick="filterFaq('account', this)">계정/인증</button>
    </div>

    <div id="faq-container" class="tacs-faq-container" style="background:#fff;margin-bottom:24px"></div>
    <div id="faq-pagination" class="pagination tacs-faq-pagination" data-faq-pagination></div>
</div>
