<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/fieldofficer/common/taglibs.jsp" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="activeMenu" value="dashboard" />
<c:set var="activeSub" value="" />

<!DOCTYPE html>
<html lang="ko">
<head>
    <%@ include file="/WEB-INF/views/fieldofficer/header/head.jsp" %>
</head>
<body>
<div class="app" id="app">
    <%@ include file="/WEB-INF/views/fieldofficer/header/sidebar.jsp" %>

    <div class="main-wrap">
        <%@ include file="/WEB-INF/views/fieldofficer/header/header.jsp" %>

        <div class="content">
<div class="page active" id="pg-search">
<div class="breadcrumb"><span onclick="go('dash')">Home</span><span class="sep">›</span><span>통합 조회</span></div>
<div class="sub-page">
<h2><span class="material-symbols-outlined">search</span> 통합 조회</h2>
<div class="alert-bar info">
<span class="material-symbols-outlined" style="font-size:18px">info</span>
          신청 접수, 검역 수행, 결과 처리, 증명서 발급까지 식품 검역 업무 전 과정을 통합 조회합니다.
        </div>
<div class="selector-bar">
<label>조회 구분</label>
<select>
<option>전체</option>
<option>접수 현황</option>
<option>검역 진행 현황</option>
<option>판정 / 결과 현황</option>
<option>증명서 발급 현황</option>
</select>
<label style="margin-left:16px">문서 유형</label>
<select>
<option>전체</option>
<option>검역증명서</option>
</select>
<label style="margin-left:16px">관할 지방청</label>
<select>
<option>전체</option>
<option>경인청</option>
<option>서울청</option>
<option>부산청</option>
<option>대전청</option>
<option>광주청</option>
<option>대구청</option>
</select>
</div>
<div class="form-grid" style="grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr">
<div class="form-item">
<label>조회 시작일</label>
<input type="date" value="2026-04-01"/>
</div>
<div class="form-item">
<label>조회 종료일</label>
<input type="date" value="2026-04-15"/>
</div>
<div class="form-item">
<label>신청번호</label>
<input placeholder="QI-20260415-001"/>
</div>
<div class="form-item">
<label>접수번호</label>
<input placeholder="RCPT-20260415-001"/>
</div>
<div class="form-item">
<label>업체명</label>
<input placeholder="AAA푸드"/>
</div>
<div class="form-item">
<label>품목명</label>
<input placeholder="냉동 새우"/>
</div>
<div class="form-item">
<label>HS Code</label>
<input placeholder="0306.17-1000"/>
</div>
<div class="form-item">
<label>화물관리번호</label>
<input placeholder="24ZZ000000I0001"/>
</div>
<div class="form-item">
<label>검역방법</label>
<select>
<option>전체</option>
<option>서류검역</option>
<option>관능검역</option>
<option>정밀검역</option>
<option>무작위표본검역</option>
</select>
</div>
<div class="form-item">
<label>접수상태</label>
<select>
<option>전체</option>
<option>신규</option>
<option>접수 완료</option>
<option>서류 검토중</option>
</select>
</div>
<div class="form-item">
<label>판정상태</label>
<select>
<option>전체</option>
<option>판정 대기</option>
<option>합격</option>
<option>불합격</option>
</select>
</div>
<div class="form-item">
<label>증명서 발급상태</label>
<select>
<option>전체</option>
<option>발급 대기</option>
<option>발급 가능</option>
<option>발급 완료</option>
</select>
</div>
</div>
<div class="btn-row" style="justify-content:flex-end;margin-bottom:18px">
<button class="btn btn-primary">조회</button>
<button class="btn btn-secondary">초기화</button>
<button class="btn btn-outline">엑셀 다운로드</button>
</div>
<table class="data-table">
<thead>
<tr>
<th>신청번호</th>
<th>접수번호</th>
<th>업체명</th>
<th>품목명</th>
<th>검역방법</th>
<th>접수상태</th>
<th>판정상태</th>
<th>증명서</th>
<th>관할청</th>
<th>최종처리일</th>
<th>보기</th>
</tr>
</thead>
<tbody>
<tr>
<td class="td-id">QI-20260415-001</td>
<td>RCPT-20260415-001</td>
<td>AAA푸드</td>
<td>냉동 새우</td>
<td>정밀검역</td>
<td><span class="badge badge-wait">서류 검토중</span></td>
<td><span class="badge badge-rev">판정 대기</span></td>
<td><span class="badge badge-ok">발급 예정</span></td>
<td>경인청</td>
<td class="td-muted">2026-04-15</td>
<td><button class="mini mini-view" onclick="go('receipt')">접수</button></td>
</tr>
<tr>
<td class="td-id">QI-20260415-002</td>
<td>RCPT-20260415-002</td>
<td>한빛푸드</td>
<td>견과류가공품</td>
<td>관능검역</td>
<td><span class="badge badge-ok">접수 완료</span></td>
<td><span class="badge badge-rev">판정 대기</span></td>
<td><span class="badge badge-wait">발급 승인</span></td>
<td>서울청</td>
<td class="td-muted">2026-04-15</td>
<td><button class="mini mini-view" onclick="go('receipt')">검역요청</button></td>
</tr>
<tr>
<td class="td-id">QI-20260415-003</td>
<td>RCPT-20260415-003</td>
<td>현대물류</td>
<td>수입 농산물</td>
<td>관능검역</td>
<td><span class="badge badge-ok">접수 완료</span></td>
<td><span class="badge badge-wait">발급 승인</span></td>
<td>부산청</td>
<td class="td-muted">2026-04-15</td>
<td><button class="mini mini-view" onclick="go('cert')">증명서</button></td>
</tr>
<tr>
<td class="td-id">QI-20260414-017</td>
<td>RCPT-20260414-017</td>
<td>동남식품</td>
<td>견과류가공품</td>
<td>정밀검역</td>
<td><span class="badge badge-ok">접수 완료</span></td>
<td><span class="badge badge-ok">합격</span></td>
<td><span class="badge badge-ok">발급 완료</span></td>
<td>서울청</td>
<td class="td-muted">2026-04-14</td>
<td><button class="mini mini-view" onclick="go('cert')">증명서</button></td>
</tr>
<tr>
<td class="td-id">QI-20260413-009</td>
<td>RCPT-20260413-009</td>
<td>한빛푸드</td>
<td>고형차</td>
<td>정밀검역</td>
<td><span class="badge badge-ok">접수 완료</span></td>
<td><span class="badge badge-doc">위험품목 검역중</span></td>
<td><span class="badge badge-wait">발급 대기</span></td>
<td>경인청</td>
<td class="td-muted">2026-04-13</td>
<td><button class="mini mini-view" onclick="go('receipt')">검역요청</button></td>
</tr>
</tbody>
</table>
</div>
</div>
        </div>

        <%@ include file="/WEB-INF/views/fieldofficer/footer/footer.jsp" %>
    </div>
</div>

<%@ include file="/WEB-INF/views/fieldofficer/footer/modals.jsp" %>
<%@ include file="/WEB-INF/views/fieldofficer/footer/scripts.jsp" %>
</body>
</html>
