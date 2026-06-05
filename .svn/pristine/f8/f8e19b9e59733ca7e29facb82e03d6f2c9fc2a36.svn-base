<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div class="tacs-docs-cloud page active" id="pg-docs"
     data-actor-id="${docsActorId}"
     data-actor-type="${docsActorType}"
     data-biz-type="${docsBizType}"
     data-docs-role="${docsRole}"
     style="padding:0;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;gap:16px;flex-wrap:wrap;">
    <div>
      <h1 style="font-size:28px;font-weight:900;color:#0f172a;letter-spacing:0;margin:0 0 8px;">&#47928;&#49436;&#54632;</h1>
      <div id="docs-breadcrumb" style="display:flex;align-items:center;gap:4px;font-size:12px;color:#94a3b8;flex-wrap:wrap;"></div>
      <button id="docs-back-btn" onclick="docsGoBack()"
              style="display:none;margin-top:8px;padding:6px 12px;border:1px solid #e2e8f0;background:#fff;color:#64748b;font-size:12px;font-weight:700;cursor:pointer;border-radius:8px;">
        <span class="material-symbols-outlined" style="font-size:16px;vertical-align:-3px;margin-right:4px;">arrow_back</span>&#49345;&#50948;&#54260;&#45908;
      </button>
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
      <button class="btn btn-outline" onclick="docsNewFolder()" style="display:flex;align-items:center;gap:4px;padding:7px 11px;border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">
        <span class="material-symbols-outlined" style="font-size:16px;">create_new_folder</span>&#49352; &#54260;&#45908;
      </button>
      <label class="btn btn-primary" style="display:flex;align-items:center;gap:4px;cursor:pointer;margin:0;padding:7px 11px;border:1px solid #0f172a;background:#0f172a;color:#fff;border-radius:8px;font-weight:700;font-size:13px;">
        <span class="material-symbols-outlined" style="font-size:16px;">upload_file</span>&#50629;&#47196;&#46300;
        <input multiple onchange="docsUploadFiles(this.files)" style="display:none" type="file" />
      </label>
    </div>
  </div>

  <div id="docs-storage-wrap" style="margin-bottom:18px;padding:14px 16px;border:1px solid #e2e8f0;background:#fff;border-radius:14px;">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px;">
      <div style="font-size:13px;font-weight:900;color:#0f172a;display:flex;align-items:center;gap:6px;">
        <span class="material-symbols-outlined" style="font-size:18px;">database</span>&#51200;&#51109;&#44277;&#44036;
      </div>
      <div style="font-size:12px;color:#64748b;">
        <span id="docs-storage-used">0 B</span> &#49324;&#50857; / <span id="docs-storage-remain">5 GB</span> &#45224;&#51020;
        <span id="docs-storage-pct-badge" style="display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;background:#e2e8f0;font-weight:800;">0%</span>
      </div>
    </div>
    <div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden;">
      <div id="docs-storage-fill" style="width:0%;height:100%;background:linear-gradient(90deg,#565e74,#818cf8);"></div>
    </div>
    <div id="docs-storage-warn" style="display:none;margin-top:8px;font-size:12px;font-weight:800;color:#dc2626;">&#51200;&#51109;&#44277;&#44036; &#49324;&#50857;&#47049;&#51060; &#45458;&#49845;&#45768;&#45796;.</div>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;gap:12px;flex-wrap:wrap;">
    <div style="position:relative;flex:1;min-width:220px;max-width:360px;">
      <span class="material-symbols-outlined" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:16px;color:#94a3b8;pointer-events:none;">search</span>
      <input id="docs-search" oninput="docsRender()" placeholder="&#47928;&#49436; &#44160;&#49353;.." style="width:100%;box-sizing:border-box;padding:9px 12px 9px 38px;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;outline:none;background:#f8fafc;" />
    </div>
    <div style="display:flex;border:1px solid #e2e8f0;overflow:hidden;background:#fff;border-radius:10px;">
      <button id="docs-view-grid" onclick="docsSetView('grid')" style="padding:8px 12px;border:none;cursor:pointer;background:#fff;color:#64748b;" title="&#44536;&#47532;&#46300; &#48372;&#44592;">
        <span class="material-symbols-outlined" style="font-size:19px;display:block;">grid_view</span>
      </button>
      <button id="docs-view-list" onclick="docsSetView('list')" style="padding:8px 12px;border:none;cursor:pointer;background:#fff;color:#64748b;" title="&#47785;&#47197; &#48372;&#44592;">
        <span class="material-symbols-outlined" style="font-size:19px;display:block;">view_list</span>
      </button>
    </div>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:16px;flex-wrap:wrap;padding-bottom:12px;border-bottom:1px solid #e2e8f0;">
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
      <span style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:6px 0;">FILTER:</span>
      <button class="docs-filter-chip active" onclick="docsSetFilter('all',this)">&#51204;&#52404;</button>
      <button class="docs-filter-chip" onclick="docsSetFilter('folder',this)">&#54260;&#45908;</button>
      <button class="docs-filter-chip" onclick="docsSetFilter('file',this)">&#54028;&#51068;</button>
    </div>
    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
      <span style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:6px 0;">DATE:</span>
      <button class="docs-filter-chip active" id="docs-date-chip-all" onclick="docsSetDateFilter('all',this)">&#51204;&#52404; &#44592;&#44036;</button>
      <button class="docs-filter-chip" id="docs-date-chip-today" onclick="docsSetDateFilter('today',this)">&#50724;&#45720;</button>
      <button class="docs-filter-chip" id="docs-date-chip-week" onclick="docsSetDateFilter('week',this)">1&#51452;&#51068;</button>
      <button class="docs-filter-chip" id="docs-date-chip-month" onclick="docsSetDateFilter('month',this)">1&#44060;&#50900;</button>
      <button class="docs-filter-chip" id="docs-date-chip-custom" data-docs-date-range-btn onclick="docsOpenDatePicker(this)" style="display:flex;align-items:center;gap:4px">
        <span class="material-symbols-outlined" style="font-size:14px">calendar_today</span><span class="btn-text">&#44592;&#44036;&#49440;&#53469;</span>
      </button>
    </div>
  </div>

  <div id="docs-date-picker-modal" onclick="docsCloseDatePicker(event)" style="display:none"></div>

  <div id="docs-action-bar" style="display:none;background:#eff6ff;border:1px solid #bfdbfe;padding:10px 16px;margin-bottom:12px;align-items:center;justify-content:flex-end;border-radius:10px;">
    <div class="docs-selection-summary" style="display:none;"><span id="docs-sel-count">0</span></div>
  </div>

  <div id="docs-list-table-wrapper" style="display:none;border:1px solid #e2e8f0;background:#fff;border-radius:14px;overflow:hidden;">
    <table class="data-table docs-list-table" style="width:100%;border-collapse:collapse;">
      <thead id="docs-list-thead"></thead>
      <tbody id="docs-list-tbody"></tbody>
    </table>
  </div>
  <div id="docs-container" style="border:1px solid #e2e8f0;background:#fff;min-height:400px;border-radius:14px;overflow:hidden;"></div>
  <div id="docs-empty" style="display:none;padding:64px;text-align:center;background:#fff;border:1px solid #e2e8f0;border-radius:14px;">
    <div style="display:flex;justify-content:center;align-items:center;gap:8px;margin-bottom:6px;">
      <span class="material-symbols-outlined" style="font-size:24px;color:#cbd5e1;">folder_open</span>
      <div style="font-size:15px;font-weight:800;color:#64748b;">&#47928;&#49436;&#44032; &#50630;&#49845;&#45768;&#45796;</div>
    </div>
    <div style="font-size:12px;color:#94a3b8;">&#47928;&#49436;&#47484; &#50629;&#47196;&#46300;&#54616;&#44144;&#45208; &#54260;&#45908;&#47484; &#47564;&#46308;&#50612;&#48372;&#49464;&#50836;.</div>
  </div>
</div>