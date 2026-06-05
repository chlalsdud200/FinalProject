<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<link rel="stylesheet" href="${ctx}/resources/css/common/resourceArchive.css">

<div class="resource-archive-wrap" data-context-path="${ctx}">
    <div class="resource-archive-toolbar">
        <input id="res-archive-from" type="date" title="시작일">
        <span class="resource-archive-sep">~</span>
        <input id="res-archive-to" type="date" title="종료일">
        <input id="res-archive-keyword" type="text" placeholder="자료명 또는 파일명 검색">
        <button type="button" id="res-archive-search-btn">조회</button>
    </div>

    <table class="resource-archive-table">
        <thead>
        <tr>
            <th style="width:80px">번호</th>
            <th style="width:34%">자료명</th>
            <th style="width:300px">파일명</th>
            <th style="width:100px">용량</th>
            <th style="width:120px">등록일</th>
            <th style="width:100px">다운로드</th>
        </tr>
        </thead>
        <tbody id="res-archive-tbody">
        <tr>
            <td colspan="6" class="resource-archive-empty">자료를 조회 중입니다.</td>
        </tr>
        </tbody>
    </table>
</div>

<script src="${ctx}/resources/js/common/resourceArchive.js"></script>
