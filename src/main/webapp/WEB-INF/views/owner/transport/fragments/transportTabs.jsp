<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div class="prog-tab-bar" style="margin-bottom:24px">
    <a class="prog-tab ${transportTab eq 'forwarder' ? 'active' : ''}"
       href="${pageContext.request.contextPath}/owner/transport/forwarder/list.do"
       style="text-decoration:none">
        운송업체 선택
    </a>

    <a class="prog-tab ${transportTab eq 'export' ? 'active' : ''}"
       href="${pageContext.request.contextPath}/owner/transport/export/list.do"
       style="text-decoration:none">
        <span style="display:inline-block;width:8px;height:8px;background:#3b82f6;margin-right:5px;vertical-align:middle"></span>
        수출 운송
    </a>

    <a class="prog-tab ${transportTab eq 'import' ? 'active' : ''}"
       href="${pageContext.request.contextPath}/owner/transport/import/list.do"
       style="text-decoration:none">
        <span style="display:inline-block;width:8px;height:8px;background:#22c55e;margin-right:5px;vertical-align:middle"></span>
        수입 운송
    </a>
</div>
