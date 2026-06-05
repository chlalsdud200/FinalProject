<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<div class="form-group"
     id="import-supplement-section"
     style="margin-top:24px;padding:24px;background:#fff5f5;border:1px solid #fecaca;">

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:8px;">
            <span class="material-symbols-outlined" style="color:#dc2626;font-size:24px;">error</span>
            <h3 style="font-size:15px;font-weight:800;color:#991b1b;">
                관세사/세관 추가 서류 보완 요청
            </h3>
        </div>

        <span style="background:#dc2626;color:#fff;font-size:10px;font-weight:800;padding:3px 8px;">
            D-1 마감
        </span>
    </div>

    <div style="background:#fff;border:1px solid #fecaca;padding:16px;margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:6px;">
            [요청] 거래가격 소명자료 및 상세 카탈로그
        </div>

        <div style="font-size:12px;color:#64748b;line-height:1.6;margin-bottom:12px;">
            삼일관세법인: "세관에서 해당 수입물품의 가격 구성표와 상세 카탈로그를 요청했습니다.
            PDF 형식으로 업로드 부탁드립니다."
        </div>

        <input id="importSuppFile"
               type="file"
               name="supplementFiles"
               multiple
               style="display:none"
               onchange="handleImportSupplementFiles(this)">

        <div style="display:flex;gap:8px;align-items:center;">
            <button type="button"
                    class="btn btn-secondary"
                    style="font-size:11px;padding:8px 16px;"
                    onclick="document.getElementById('importSuppFile').click()">
                보완 파일 선택
            </button>

            <button type="button"
                    class="btn btn-danger"
                    style="font-size:11px;padding:8px 16px;"
                    onclick="submitImportSupplement()">
                보완 서류 제출
            </button>
        </div>

        <div id="importSuppFileName" style="font-size:11px;color:#64748b;margin-top:8px;">
            선택된 파일이 없습니다.
        </div>
    </div>

    <div style="margin-top:14px">
        <div style="font-size:11px;font-weight:700;color:#475569;margin-bottom:8px">
            보완 요청 이력
        </div>

        <table class="doc-table">
            <thead>
            <tr>
                <th>요청일</th>
                <th>요청 사유</th>
                <th>마감일</th>
                <th>상태</th>
                <th>제출</th>
            </tr>
            </thead>
            <tbody>
            <tr id="import-supp-row">
                <td>2026-04-15</td>
                <td>거래가격 소명자료 · 상세 카탈로그</td>
                <td style="color:#dc2626;font-weight:700">2026-04-22</td>
                <td><span class="doc-status wait">미제출</span></td>
                <td>
                    <span style="font-size:11px;color:#94a3b8">보완파일 대기</span>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
