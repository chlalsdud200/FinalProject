<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TACS FAQ 관리</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, Arial, sans-serif; background: #f4f7fa; color: #1e293b; }
        .wrap { padding: 32px; max-width: 1400px; margin: 0 auto; }
        .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        h1 { margin: 0; font-size: 26px; font-weight: 800; color: #0f172a; }
        .grid { display: grid; grid-template-columns: 420px 1fr; gap: 24px; align-items: start; }
        .panel { background: #fff; border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(15,23,42,.08); }
        .panel h2 { margin: 0 0 20px; font-size: 18px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; }
        .form-group { margin-bottom: 18px; }
        label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #475569; }
        input[type="text"], input[type="number"], select, textarea { width: 100%; border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 14px; border-radius: 6px; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px #dbeafe; }
        textarea { min-height: 120px; resize: vertical; line-height: 1.6; }
        .role-selector { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; }
        .role-item { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
        .role-item input { width: 16px; height: 16px; cursor: pointer; }
        .btn-group { display: flex; gap: 10px; margin-top: 24px; }
        button { height: 42px; border-radius: 6px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all .2s; border: none; }
        .btn-group button { flex: 1; }
        .btn-primary { background: #0f172a; color: #fff; }
        .btn-primary:hover { background: #1e293b; }
        .btn-secondary { background: #fff; color: #475569; border: 1px solid #cbd5e1; }
        .btn-secondary:hover { background: #f8fafc; }
        .btn-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
        .btn-danger:hover { background: #fecaca; }
        .filters { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .filters > * { flex: 1; min-width: 150px; }
        .filters button { flex: 0 0 80px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 14px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        th { background: #f8fafc; font-weight: 700; color: #475569; }
        tr:hover { background: #fcfdfe; cursor: pointer; }
        .cat-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; background: #e2e8f0; color: #475569; }
        .role-tag { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; margin: 1px; border: 1px solid #e2e8f0; background: #fff; }
        .empty { text-align: center; padding: 40px; color: #94a3b8; font-size: 14px; }
        .pagination { display: flex; justify-content: center; gap: 6px; margin-top: 24px; }
        .page-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
        .page-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }
        a { color: #64748b; text-decoration: none; }
    </style>
</head>
<body>
<div class="wrap">
    <div class="head">
        <h1>FAQ 관리</h1>
        <div style="display:flex;gap:12px">
            <a href="${pageContext.request.contextPath}/systemadmin/dashboard.do">관리자 홈</a>
            <span style="color:#cbd5e1">|</span>
            <a href="${pageContext.request.contextPath}/admin/notices/manage.do">공지 관리</a>
        </div>
    </div>

    <div class="grid">
        <section class="panel">
            <h2 id="form-title">FAQ 등록</h2>
            <input type="hidden" id="faq-no">

            <div class="form-group">
                <label for="faq-ctgry">분류</label>
                <select id="faq-ctgry">
                    <option value="ACCOUNT">계정/인증</option>
                    <option value="SYSTEM">시스템 이용</option>
                    <option value="DOC">문서함</option>
                    <option value="IMPORT">수입통관</option>
                    <option value="EXPORT">수출통관</option>
                    <option value="TRANSPORT">운송</option>
                    <option value="WAREHOUSE">창고</option>
                    <option value="PAYMENT">세금/환급</option>
                    <option value="ETC">기타</option>
                </select>
            </div>

            <div class="form-group">
                <label>노출 대상 액터</label>
                <div class="role-selector">
                    <label class="role-item"><input type="checkbox" name="target-role" value="ALL" checked onchange="toggleAllRoles(this)"> 전체</label>
                    <label class="role-item"><input type="checkbox" name="target-role" value="OWNER"> 화주</label>
                    <label class="role-item"><input type="checkbox" name="target-role" value="BROKER"> 관세사</label>
                    <label class="role-item"><input type="checkbox" name="target-role" value="OFFICER"> 행정공무원</label>
                    <label class="role-item"><input type="checkbox" name="target-role" value="FIELD_OFFICER"> 현장공무원</label>
                    <label class="role-item"><input type="checkbox" name="target-role" value="TRANSPORT_MANAGER"> 운송담당자</label>
                    <label class="role-item"><input type="checkbox" name="target-role" value="WAREHOUSE_MANAGER"> 창고관리자</label>
                </div>
            </div>

            <div class="form-group">
                <label for="faq-qstn">질문</label>
                <input type="text" id="faq-qstn" maxlength="500" placeholder="자주 묻는 질문을 입력하세요">
            </div>

            <div class="form-group">
                <label for="faq-ans">답변</label>
                <textarea id="faq-ans" placeholder="답변 내용을 입력하세요"></textarea>
            </div>

            <div class="form-group">
                <label for="faq-sort">정렬 순서</label>
                <input type="number" id="faq-sort" value="1" min="1" style="width:100px">
            </div>

            <div class="btn-group">
                <button type="button" class="btn-primary" onclick="saveFaq()">저장</button>
                <button type="button" class="btn-secondary" onclick="resetFaqForm()">초기화</button>
                <button type="button" class="btn-danger" id="btn-delete" style="display:none" onclick="deleteFaq()">삭제</button>
            </div>
        </section>

        <section class="panel">
            <h2>FAQ 목록</h2>
            <div class="filters">
                <select id="filter-ctgry">
                    <option value="all">모든 분류</option>
                    <option value="ACCOUNT">계정/인증</option>
                    <option value="SYSTEM">시스템 이용</option>
                    <option value="DOC">문서함</option>
                    <option value="IMPORT">수입통관</option>
                    <option value="EXPORT">수출통관</option>
                    <option value="TRANSPORT">운송</option>
                    <option value="WAREHOUSE">창고</option>
                    <option value="PAYMENT">세금/환급</option>
                    <option value="ETC">기타</option>
                </select>
                <input type="text" id="filter-keyword" placeholder="질문 또는 답변 검색">
                <select id="filter-role">
                    <option value="all">모든 액터</option>
                    <option value="OWNER">화주</option>
                    <option value="BROKER">관세사</option>
                    <option value="OFFICER">행정공무원</option>
                    <option value="FIELD_OFFICER">현장공무원</option>
                    <option value="TRANSPORT_MANAGER">운송담당자</option>
                    <option value="WAREHOUSE_MANAGER">창고관리자</option>
                </select>
                <button type="button" class="btn-primary" onclick="loadFaqs(1)">조회</button>
            </div>

            <table>
                <thead>
                <tr>
                    <th style="width:60px">NO</th>
                    <th style="width:100px">분류</th>
                    <th>질문</th>
                    <th style="width:160px">노출 대상</th>
                    <th style="width:80px">순서</th>
                    <th style="width:100px">등록일</th>
                </tr>
                </thead>
                <tbody id="faq-list-body">
                    <tr><td colspan="6" class="empty">데이터를 불러오는 중입니다.</td></tr>
                </tbody>
            </table>

            <div class="pagination" id="pagination"></div>
        </section>
    </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/common/faq-admin.js"></script>
</body>
</html>
