<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div class="tacs-docs-trash page active" id="pg-docs-trash"
     data-actor-id="${docsActorId}"
     data-actor-type="${docsActorType}"
     data-biz-type="${docsBizType}"
     data-docs-role="${docsRole}"
     style="padding:0;">

  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;gap:16px;flex-wrap:wrap;">
    <div>
      <h1 style="font-size:28px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;margin:0 0 8px;">휴지통</h1>
      <div style="font-size:13px;color:#64748b;">휴지통으로 이동된 항목을 확인하고 영구삭제할 수 있습니다.</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
      <button class="btn btn-outline" id="btn-trash-empty" onclick="trashEmptyAll()" style="display:flex;align-items:center;gap:4px;padding:7px 11px;border:1px solid #cbd5e1;background:#fff;color:#dc2626;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">
        <span class="material-symbols-outlined" style="font-size:16px;">delete_forever</span>전체 삭제
      </button>
      <button class="btn btn-primary" id="btn-trash-delete-selected" onclick="trashDeleteSelected()" style="display:flex;align-items:center;gap:4px;padding:7px 11px;border:1px solid #0f172a;background:#0f172a;color:#fff;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;opacity:.5;" disabled>
        <span class="material-symbols-outlined" style="font-size:16px;">delete</span>선택 영구삭제
      </button>
      <button class="btn btn-secondary" id="btn-trash-delete-current" onclick="trashDeleteCurrentList()" style="display:flex;align-items:center;gap:4px;padding:7px 11px;border:1px solid #64748b;background:#64748b;color:#fff;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">
        <span class="material-symbols-outlined" style="font-size:16px;">delete_sweep</span>현재목록 삭제
      </button>
    </div>
  </div>

  <div id="trash-table-wrap" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <table style="width:100%;border-collapse:collapse;text-align:left;font-size:13px;">
      <thead>
        <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
          <th style="padding:12px 16px;width:40px;text-align:center;">
            <input type="checkbox" id="trash-check-all" onclick="trashToggleAll(this.checked)" style="cursor:pointer;">
          </th>
          <th style="padding:12px 16px;color:#475569;font-weight:600;width:72px;">유형</th>
          <th style="padding:12px 16px;color:#475569;font-weight:600;">이름</th>
          <th style="padding:12px 16px;color:#475569;font-weight:600;width:120px;">크기</th>
          <th style="padding:12px 16px;color:#475569;font-weight:600;width:180px;">휴지통 이동일</th>
        </tr>
      </thead>
      <tbody id="trash-list-body"></tbody>
    </table>
  </div>

  <div id="trash-pagination" style="display:flex;justify-content:center;margin-top:20px;gap:4px;"></div>

  <div id="trash-empty-state" style="display:none;padding:60px 20px;text-align:center;background:#fff;border:1px solid #e2e8f0;border-radius:12px;margin-top:0;">
    <div style="display:flex;justify-content:center;align-items:center;gap:8px;margin-bottom:6px;">
      <span class="material-symbols-outlined" style="font-size:24px;color:#cbd5e1;">delete</span>
      <div style="font-size:16px;font-weight:700;color:#0f172a;">휴지통이 비어 있음</div>
    </div>
    <div style="font-size:13px;color:#64748b;line-height:1.5;">휴지통으로 이동된 항목이 없습니다.</div>
  </div>
</div>

<%-- 휴지통 동작은 공통 모듈 /resources/js/common/trash.js 가 전담한다.
     (transport SPA 의 클라이언트 렌더링 경로와 동일 함수를 공유) --%>
<script src="${pageContext.request.contextPath}/resources/js/common/trash.js"></script>
