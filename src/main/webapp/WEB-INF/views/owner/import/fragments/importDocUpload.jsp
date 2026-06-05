<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<div class="form-doc-divider"></div>

<div class="form-group" style="margin-bottom:0">
    <div class="form-group-title">⑦ 관련 문서 업로드</div>

    <div class="alert-bar info">
        <span class="material-symbols-outlined">description</span>
        송장, 패킹리스트, B/L, 원산지증명서, 보험증권, 계약서 등 수입통관에 필요한 문서를 첨부하세요.
    </div>

    <input id="importDocFile"
           name="docFiles"
           type="file"
           multiple
           style="display:none"
           onchange="handleImportDocFiles(this)">

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <label style="font-size:11px;font-weight:700;color:#475569">
            첨부 문서 <span class="req">*</span>
        </label>

        <div style="display:flex;gap:8px">
            <button type="button"
                    class="btn btn-secondary"
                    style="padding:9px 16px;font-size:12px;white-space:nowrap"
                    onclick="document.getElementById('importDocFile').click()">
                파일 선택
            </button>
        </div>
    </div>

    <div class="upload-drop"
         style="margin-bottom:16px"
         onclick="document.getElementById('importDocFile').click()">
        <span class="material-symbols-outlined">upload_file</span>
        <p>파일을 이곳에 드래그하거나 <strong>클릭하여 선택</strong>하세요</p>
        <p id="importDocFileName" style="margin-top:4px;font-size:11px;color:#94a3b8">
            PDF · JPG · PNG · XLSX — 최대 20MB
        </p>
    </div>

    <table class="doc-table" id="importDocUploadTable">
        <thead>
        <tr>
            <th>문서종류</th>
            <th>파일명</th>
            <th>상태</th>
            <th></th>
        </tr>
        </thead>
        <tbody id="importDocUploadTbody">
        <tr class="empty-row">
            <td colspan="4" style="text-align:center;color:#94a3b8;padding:18px;">
                첨부된 문서가 없습니다.
            </td>
        </tr>
        </tbody>
    </table>
</div>
