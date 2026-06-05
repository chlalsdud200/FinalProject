<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<div class="form-group" id="export-supplement-section" style="margin-top:24px;padding:24px;background:#fff5f5;border:1px solid #fecaca;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:8px;">
            <span class="material-symbols-outlined" style="color:#dc2626;font-size:24px;">error</span>
            <h3 style="font-size:15px;font-weight:800;color:#991b1b;">관세사/세관 추가 서류 보완 요청</h3>
        </div>
        <span style="background:#dc2626;color:#fff;font-size:10px;font-weight:800;padding:3px 8px;">D-1 마감</span>
    </div>
    <div style="background:#fff;border:1px solid #fecaca;padding:16px;margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:6px;">[요청] 거래가격 소명자료 및 상세 카탈로그</div>
        <div style="font-size:12px;color:#64748b;line-height:1.6;margin-bottom:12px;">
            에이스관세사무소: 세관에서 해당 품목의 가격 구성표와 기술 사양 확인을 위한 카탈로그를 요청했습니다. PDF 형식으로 업로드 부탁드립니다.
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
            <div class="fi" style="flex:1;margin:0;">
                <select id="expSuppDocTyCd" name="suppDocTyCd" style="font-size:12px;padding:7px;">
                    <option value="">-- 제출 서류 선택 --</option>
                    <option value="PRICE_EXPLAIN">거래가격 소명자료</option>
                    <option value="CATALOG">품목 카탈로그</option>
                    <option value="ORIGIN_EXPLAIN">원산지 소명서</option>
                </select>
            </div>
            <input id="exp-supp-file" name="suppFile" type="file" style="display:none">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('exp-supp-file').click()" style="font-size:11px;padding:8px 16px;">파일 선택</button>
            <button type="button" class="btn btn-danger" onclick="submitSupplement('exp')" style="font-size:11px;padding:8px 16px;">보완 서류 제출</button>
        </div>
    </div>
    <div style="margin-top:14px">
        <div style="font-size:11px;font-weight:700;color:#475569;margin-bottom:8px">보완 요청 이력</div>
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
            <tr id="exp-supp-row">
                <td>2026-04-14</td>
                <td>거래가격 소명자료 · 원산지 확인자료</td>
                <td style="color:#dc2626;font-weight:700">2026-04-22</td>
                <td><span class="doc-status wait">미제출</span></td>
                <td><button type="button" class="mini mini-sup" onclick="submitSupplement('exp')">제출</button></td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
