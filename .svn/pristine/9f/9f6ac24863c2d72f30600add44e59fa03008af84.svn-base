<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%-- =============================================================
     전역 모달 묶음 (의뢰상세, 통관조회, 반려, 보완, 인증서, 세금 등)
     원본: 관세사_신고서조회_v2.html 7463-8785
     ============================================================= --%>
      <div class="modal-bg" id="modal-doc-detail">
        <div class="modal-box" style="width:760px;max-height:88vh;overflow-y:auto;padding:0">
          <button class="modal-close" onclick="hideModal('doc-detail')" style="top:16px;right:20px;z-index:2"><span
              class="material-symbols-outlined">close</span></button>

          <!-- 헤더 -->
          <div id="docD-header"
            style="background:linear-gradient(135deg,#ecf4ff,#dae2fd);padding:24px 28px 18px;border-bottom:1px solid #cbd5e1">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span id="docD-typeLabel"
                style="font-size:10px;font-weight:800;letter-spacing:1px;color:#565e74;text-transform:uppercase">TACS ·
                Import Customs</span>
              <span id="docD-statusBadge"
                style="font-size:10px;font-weight:800;padding:2px 10px;border-radius:2px;background:#dbeafe;color:#1e40af">신규접수</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:flex-end">
              <div>
                <h3 id="docD-title" style="font-size:20px;font-weight:900;color:#203444;margin:0">수입신고의뢰서</h3>
                <div id="docD-no" style="font-size:11px;color:#697d8f;margin-top:4px;font-family:monospace">
                  IMP-REQ-20240520-001</div>
              </div>
              <div style="text-align:right;font-size:11px;color:#697d8f">
                <div>접수일시</div>
                <div id="docD-date" style="font-weight:700;color:#203444;margin-top:2px">2024-05-20 14:10</div>
              </div>
            </div>
          </div>

          <div style="padding:20px 28px 24px">

            <!-- ① 담당 운송사 -->
            <div style="margin-bottom:18px">
              <div
                style="font-size:13px;font-weight:800;color:#203444;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <span
                  style="background:#565e74;color:#fff;font-size:10px;font-weight:800;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:2px">①</span>
                담당 운송사
              </div>
              <div style="background:#f8fafc;padding:12px 16px;border-left:3px solid #a0b4c8;font-size:12px">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                  <div><span style="color:#697d8f">운송사명</span>
                    <div id="docD-forwarder" style="font-weight:700;margin-top:2px">글로벌로지스(주)</div>
                  </div>
                  <div><span style="color:#697d8f">운송 방법</span>
                    <div id="docD-transport" style="font-weight:700;margin-top:2px">해상 (Sea)</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ② 담당 관세사 -->
            <div style="margin-bottom:18px">
              <div
                style="font-size:13px;font-weight:800;color:#203444;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <span
                  style="background:#565e74;color:#fff;font-size:10px;font-weight:800;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:2px">②</span>
                담당 관세사
              </div>
              <div style="background:#f8fafc;padding:12px 16px;border-left:3px solid #a0b4c8;font-size:12px">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                  <div><span style="color:#697d8f">관세사명</span>
                    <div id="docD-broker" style="font-weight:700;margin-top:2px">김관세 관세사</div>
                  </div>
                  <div><span style="color:#697d8f">관세사 번호</span>
                    <div id="docD-brokerNo" style="font-weight:700;margin-top:2px">CS-20241</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ③ 기본정보 -->
            <div style="margin-bottom:18px">
              <div
                style="font-size:13px;font-weight:800;color:#203444;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <span
                  style="background:#565e74;color:#fff;font-size:10px;font-weight:800;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:2px">③</span>
                <span id="docD-infoTitle">기본정보</span>
              </div>
              <div style="background:#f8fafc;padding:14px 16px;border-left:3px solid #565e74;font-size:12px">
                <div id="docD-infoGrid" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                  <!-- JS로 동적 렌더링 -->
                </div>
              </div>
            </div>

            <!-- ④ 거래/선적 조건 -->
            <div style="margin-bottom:18px">
              <div
                style="font-size:13px;font-weight:800;color:#203444;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <span
                  style="background:#565e74;color:#fff;font-size:10px;font-weight:800;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:2px">④</span>
                <span id="docD-condTitle">거래 및 납부 조건</span>
              </div>
              <div style="background:#f8fafc;padding:14px 16px;border-left:3px solid #605c78;font-size:12px">
                <div id="docD-condGrid" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
                  <!-- JS로 동적 렌더링 -->
                </div>
              </div>
            </div>

            <!-- ⑤ 부가신청 (수출 전용, 수입시 숨김) -->
            <div id="docD-addSection" style="margin-bottom:18px;display:none">
              <div
                style="font-size:13px;font-weight:800;color:#203444;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <span
                  style="background:#565e74;color:#fff;font-size:10px;font-weight:800;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:2px">⑤</span>
                부가 신청 사항
              </div>
              <div style="background:#f8fafc;padding:14px 16px;border-left:3px solid #d97706;font-size:12px">
                <div id="docD-addGrid" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                  <!-- JS로 동적 렌더링 -->
                </div>
              </div>
            </div>

            <!-- 품목 리스트 -->
            <div style="margin-bottom:18px">
              <div
                style="font-size:13px;font-weight:800;color:#203444;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <span id="docD-itemNum"
                  style="background:#565e74;color:#fff;font-size:10px;font-weight:800;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:2px">④</span>
                <span id="docD-itemTitle">품목 리스트</span>
              </div>
              <table class="data-table" style="font-size:11px">
                <thead>
                  <tr>
                    <th>품명</th>
                    <th>HS코드</th>
                    <th>수량</th>
                    <th>단가</th>
                    <th>금액</th>
                    <th>중량(KG)</th>
                    <th>원산지</th>
                  </tr>
                </thead>
                <tbody id="docD-itemBody">
                  <!-- JS로 동적 렌더링 -->
                </tbody>
              </table>
              <div id="docD-itemSummary"
                style="text-align:right;font-size:12px;margin-top:8px;padding:8px 16px;background:#ecf4ff;font-weight:700;color:#203444">
                총 금액: <span id="docD-totalAmt">-</span> · 총 중량: <span id="docD-totalWt">-</span>
              </div>
            </div>

            <!-- 비고/특이사항 -->
            <div id="docD-remarkWrap" style="margin-bottom:18px;display:none">
              <div
                style="font-size:13px;font-weight:800;color:#203444;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <span class="material-symbols-outlined" style="font-size:16px;color:#697d8f">sticky_note_2</span>
                특이사항 / 비고
              </div>
              <div id="docD-remark"
                style="background:#fffbeb;padding:12px 16px;border-left:3px solid #d97706;font-size:12px;color:#203444;line-height:1.7">
                -</div>
            </div>

            <!-- 첨부서류 -->
            <div style="margin-bottom:18px">
              <div
                style="font-size:13px;font-weight:800;color:#203444;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <span class="material-symbols-outlined" style="font-size:16px;color:#697d8f">attach_file</span>
                첨부 서류
              </div>
              <div id="docD-fileList" style="font-size:12px">
                <!-- JS로 동적 렌더링 -->
              </div>
            </div>

            <!-- 하단 버튼 -->
            <div
              style="border-top:1px solid #e2e8f0;padding-top:16px;display:flex;justify-content:space-between;align-items:center">
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary"
                  onclick="alert('✅ 수락 완료\n신고서 작성 화면으로 이동합니다.');hideModal('doc-detail')"><span
                    class="material-symbols-outlined" style="font-size:14px">check_circle</span> 의뢰 수락</button>
                <button class="btn btn-danger" onclick="hideModal('doc-detail');showModal('reject')"><span
                    class="material-symbols-outlined" style="font-size:14px">block</span> 거절</button>
                <button class="btn btn-secondary" onclick="hideModal('doc-detail');showModal('supplement')"><span
                    class="material-symbols-outlined" style="font-size:14px">note_add</span> 서류 보완 요청</button>
              </div>
              <button class="btn btn-outline" onclick="hideModal('doc-detail')">닫기</button>
            </div>

          </div>
        </div>
      </div>


      <!-- ============================================================
     화주명 검색 모달 (declare-search)
     신고서 작성 > 기존 신고서 조회 돋보기 클릭 시 표시
     ============================================================ -->
      <div class="modal-bg" id="modal-declare-search">
        <div class="modal-box" style="width:900px;max-width:96%;max-height:88vh;overflow-y:auto;padding:0">
          <button class="modal-close" onclick="hideModal('declare-search')" style="top:16px;right:20px;z-index:2"><span
              class="material-symbols-outlined">close</span></button>

          <!-- 모달 헤더 -->
          <div
            style="background:linear-gradient(135deg,#ecf4ff,#dae2fd);padding:20px 28px 16px;border-bottom:1px solid #cbd5e1">
            <div
              style="font-size:10px;font-weight:800;letter-spacing:1px;color:#565e74;text-transform:uppercase;margin-bottom:4px">
              TACS · Client Search</div>
            <h3 style="font-size:18px;font-weight:900;color:#203444;margin:0;display:flex;align-items:center;gap:8px">
              <span class="material-symbols-outlined" style="color:#565e74">manage_search</span>
              화주명으로 통관의뢰번호 검색
            </h3>
            <div style="font-size:11px;color:#697d8f;margin-top:4px">화주명을 입력하면 해당 화주의 통관의뢰번호 목록이 표시됩니다. <b
                style="color:#565e74">행을 클릭하면 신고서 조회란에 자동 입력됩니다.</b></div>
          </div>

          <div style="padding:18px 24px 20px">

            <!-- 화주명 검색 입력 영역 -->
            <div style="background:#f8fafc;padding:14px 16px;margin-bottom:16px;border:1px solid #e2e8f0">
              <div style="font-size:11px;font-weight:700;color:#4d6172;margin-bottom:10px">■ 화주명 검색</div>
              <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">
                <div class="form-item" style="flex:1;min-width:180px">
                  <label>화주명 <span class="req">*</span></label>
                  <input type="text" id="ds-keyword" placeholder="화주명 입력 (일부만 입력해도 검색됩니다)"
                    style="padding:8px 10px;border:1px solid #a0b4c8;font-size:13px;width:100%"
                    onkeydown="dsKeyEnter(event)">
                </div>
                <div class="form-item" style="min-width:130px">
                  <label>신고유형</label>
                  <select id="ds-type-filter"
                    style="padding:8px 10px;border:1px solid #a0b4c8;font-size:13px;width:100%">
                    <option value="all">전체</option>
                    <option value="수입">수입신고</option>
                    <option value="수출">수출신고</option>
                  </select>
                </div>
                <div class="form-item" style="flex-shrink:0">
                  <label>&nbsp;</label>
                  <button class="btn btn-primary" onclick="runDeclareSearch()"
                    style="padding:8px 16px;white-space:nowrap">
                    <span class="material-symbols-outlined" style="font-size:14px">search</span> 검색
                  </button>
                </div>
              </div>
              <!-- 자주 사용 화주 빠른선택 -->
            </div>

            <!-- 결과 건수 -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <div style="font-size:12px;color:#4d6172">검색결과 <b id="ds-count" style="color:#9f403d">0</b>건</div>
              <div style="font-size:10px;color:#697d8f">※ 행을 클릭하면 통관의뢰번호가 자동 입력됩니다.</div>
            </div>

            <!-- 결과 테이블 영역 -->
            <div id="ds-result-area" style="display:none">
              <table class="data-table" style="font-size:11px">
                <thead>
                  <tr>
                    <th style="width:150px">통관의뢰번호</th>
                    <th style="width:90px">화주명</th>
                    <th style="width:55px">유형</th>
                    <th>품목</th>
                    <th style="width:90px">신고일</th>
                    <th style="width:70px">상태</th>
                    <th style="width:80px">도착항</th>
                    <th style="width:55px">선택</th>
                  </tr>
                </thead>
                <tbody id="ds-list-body">
                  <!-- 동적 삽입 -->
                </tbody>
              </table>
            </div>

            <!-- 초기 / 결과없음 메시지 -->
            <div id="ds-empty-msg" style="text-align:center;padding:32px 0;color:#a0b4c8">
              <span class="material-symbols-outlined"
                style="font-size:40px;display:block;margin-bottom:10px">person_search</span>
              <p style="font-size:13px;font-weight:600;color:#697d8f;margin:0">화주명을 입력하고 검색 버튼을 눌러주세요.</p>
              <p style="font-size:11px;color:#a0b4c8;margin-top:4px">일부만 입력해도 검색됩니다. (예: "삼성", "LG", "SK")</p>
            </div>

            <!-- 안내 -->
            <div class="alert-bar info" style="margin-top:14px;font-size:11px">
              <span class="material-symbols-outlined" style="font-size:16px">info</span>
              통관의뢰번호를 선택하면 신고서 조회란에 자동으로 입력됩니다. 이후 [조회] 버튼을 눌러 신고서 데이터를 불러오세요.
            </div>

            <!-- 닫기 버튼 -->
            <div style="text-align:right;margin-top:14px">
              <button class="btn btn-outline" onclick="hideModal('declare-search')">닫기</button>
            </div>
          </div>

        
          <!-- 폼타입 폼트 저장용 히든 필드 -->
          <input type="hidden" id="ds-form-type" value="">
        </div>
      </div>

      <div class="modal-bg" id="modal-reject">
        <div class="modal-box">
          <button class="modal-close" onclick="hideModal('reject')"><span
              class="material-symbols-outlined">close</span></button>
          <h3><span class="material-symbols-outlined" style="color:#9f403d">block</span> 의뢰 거절</h3>
          <div class="form-item" style="margin-bottom:12px"><label>거절 사유 <span class="req">*</span></label>
            <select style="margin-bottom:8px">
              <option>선택</option>
              <option>담당 관할 불일치</option>
              <option>서류 미비</option>
              <option>업무 과부하</option>
              <option>기타</option>
            </select>
          </div>
          <div class="form-item" style="margin-bottom:14px"><label>상세 사유</label><textarea rows="3"
              placeholder="화주에게 전달될 상세 거절 사유를 입력하세요." style="width:100%"></textarea></div>
          <div class="btn-row"><button class="btn btn-danger"
              onclick="alert('거절 완료\n화주에게 거절 사유가 전달됩니다.');hideModal('reject')">거절 확정</button><button
              class="btn btn-outline" onclick="hideModal('reject')">취소</button></div>
        </div>
      </div>

      <div class="modal-bg" id="modal-supplement">
        <div class="modal-box">
          <button class="modal-close" onclick="hideModal('supplement')"><span
              class="material-symbols-outlined">close</span></button>
          <h3><span class="material-symbols-outlined" style="color:#d97706">note_add</span> 서류 보완 요청</h3>
          <div class="form-item" style="margin-bottom:12px"><label>대상 화주</label><input value="SK하이닉스(주)" disabled
              style="background:#ecf4ff"></div>
          <div class="form-item" style="margin-bottom:12px"><label>관련 통관의뢰번호</label><input value="IMP-20240520-001"
              disabled style="background:#ecf4ff"></div>
          <div class="form-item" style="margin-bottom:12px"><label>요청 서류 <span class="req">*</span></label>
            <div><label style="display:block;font-size:12px;padding:4px"><input type="checkbox"> 원산지증명서</label>
              <label style="display:block;font-size:12px;padding:4px"><input type="checkbox" checked> 검사성적서</label>
              <label style="display:block;font-size:12px;padding:4px"><input type="checkbox"> 포장명세서</label>
              <label style="display:block;font-size:12px;padding:4px"><input type="checkbox"> 가격신고서</label>
              <label style="display:block;font-size:12px;padding:4px"><input type="checkbox"> B/L 원본</label>
              <label style="display:block;font-size:12px;padding:4px"><input type="checkbox"> 기타</label>
            </div>
          </div>
          <div class="form-item" style="margin-bottom:12px"><label>제출 기한 <span class="req">*</span></label><input
              type="date" value="2024-05-22"></div>
          <div class="form-item" style="margin-bottom:14px"><label>요청 메시지</label><textarea rows="3"
              placeholder="화주에게 전달될 보완 요청 메시지를 입력하세요." style="width:100%"></textarea></div>
          <div class="btn-row"><button class="btn btn-primary"
              onclick="alert('✅ 보완 요청 완료\n\nSK하이닉스에게 서류 보완 요청이 전송되었습니다.\n요청서류: 검사성적서\n제출기한: 2024-05-22');hideModal('supplement')"><span
                class="material-symbols-outlined" style="font-size:14px">send</span> 보완요청 전송</button><button
              class="btn btn-outline" onclick="hideModal('supplement')">취소</button></div>
        </div>
      </div>
      <div class="modal-bg" id="modal-recv-detail">
        <div class="modal-box" style="width:600px">
          <button class="modal-close" onclick="hideModal('recv-detail')"><span
              class="material-symbols-outlined">close</span></button>
          <h3><span class="material-symbols-outlined" style="color:#9f403d">assignment_late</span> 보완요구서 상세</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;margin-bottom:16px;font-size:12px">
            <div><span style="color:#697d8f">신고서제출번호</span>
              <div style="font-weight:700;margin-top:2px">IMP-20240520-001</div>
            </div>
            <div><span style="color:#697d8f">신고일자</span>
              <div style="font-weight:700;margin-top:2px">2024-05-20</div>
            </div>
            <div><span style="color:#697d8f">근거문서번호</span>
              <div style="font-weight:700;margin-top:2px">BW-2024-ICN-00142</div>
            </div>
            <div><span style="color:#697d8f">보완완료일자</span>
              <div style="font-weight:700;margin-top:2px;color:#9f403d">2024-05-22 (D-2)</div>
            </div>
            <div><span style="color:#697d8f">통보세관</span>
              <div style="font-weight:700;margin-top:2px">인천세관 심사1과</div>
            </div>
            <div><span style="color:#697d8f">담당자</span>
              <div style="font-weight:700;margin-top:2px">김세관 (032-890-1234)</div>
            </div>
            <div><span style="color:#697d8f">화주</span>
              <div style="font-weight:700;margin-top:2px">SK하이닉스(주)</div>
            </div>
            <div><span style="color:#697d8f">보완사유코드</span>
              <div style="font-weight:700;margin-top:2px">03 - 서류 미비</div>
            </div>
          </div>
          <div style="background:#fef2f2;padding:12px;margin-bottom:16px;border-left:4px solid #9f403d">
            <div style="font-size:11px;font-weight:700;color:#9f403d;margin-bottom:6px">보완요구사항</div>
            <div style="font-size:12px;color:#203444;line-height:1.6">
              1. 원산지증명서 원본 미첨부 - 수입신고 시 원산지증명서 원본을 첨부하여 제출하시기 바랍니다.<br>
              2. 검사성적서 미비 - HS 9018.19 해당 물품에 대한 검사성적서를 제출하시기 바랍니다.<br>
              3. 거래가격 소명자료 - 신고가격과 과세가격 간 차이에 대한 소명자료를 제출하시기 바랍니다.
            </div>
          </div>
          <div style="font-size:11px;color:#697d8f;margin-bottom:12px">
            <span style="font-weight:700">관련 란번호:</span> 001, 002 &nbsp;|&nbsp;
            <span style="font-weight:700">검사품명:</span> 정밀 의료기기
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" onclick="hideModal('recv-detail');showModal('resend')"><span
                class="material-symbols-outlined" style="font-size:14px">reply</span> 보완서류 재전송</button>
            <button class="btn btn-secondary" onclick="hideModal('recv-detail');showModal('supplement')"><span
                class="material-symbols-outlined" style="font-size:14px">forward_to_inbox</span> 화주에게 서류요청</button>
            <button class="btn btn-outline" onclick="alert('보완요구서를 인쇄합니다.')"><span class="material-symbols-outlined"
                style="font-size:14px">print</span> 인쇄</button>
            <button class="btn btn-outline" onclick="hideModal('recv-detail')">닫기</button>
          </div>
        </div>
      </div>

      <div class="modal-bg" id="modal-resend">
        <div class="modal-box" style="width:620px">
          <button class="modal-close" onclick="hideModal('resend')"><span
              class="material-symbols-outlined">close</span></button>
          <h3><span class="material-symbols-outlined" style="color:#565e74">reply</span> 보완서류 세관 재전송</h3>

          <div style="background:#ecf4ff;padding:12px;margin-bottom:16px;border-left:4px solid #565e74">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px">
              <div><span style="color:#697d8f">원 통관의뢰번호:</span> <b>IMP-20240520-001</b></div>
              <div><span style="color:#697d8f">보완요구번호:</span> <b>BW-2024-ICN-00142</b></div>
              <div><span style="color:#697d8f">화주:</span> <b>SK하이닉스(주)</b></div>
              <div><span style="color:#697d8f">보완기한:</span> <b style="color:#9f403d">2024-05-22 (D-2)</b></div>
            </div>
          </div>

          <div style="margin-bottom:14px">
            <div style="font-size:11px;font-weight:700;color:#4d6172;margin-bottom:8px">보완요구 항목별 대응</div>
            <table class="data-table" style="font-size:11px">
              <thead>
                <tr>
                  <th style="width:24px"><input type="checkbox" checked></th>
                  <th style="width:30px">No</th>
                  <th>보완요구사항</th>
                  <th style="width:100px">대응상태</th>
                  <th style="width:120px">첨부파일</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox" checked></td>
                  <td>1</td>
                  <td>원산지증명서 원본 미첨부</td>
                  <td><span class="badge badge-ok" style="font-size:8px">파일첨부완료</span></td>
                  <td style="font-size:10px;color:#565e74">C_O_cert.pdf</td>
                </tr>
                <tr>
                  <td><input type="checkbox" checked></td>
                  <td>2</td>
                  <td>검사성적서 미비</td>
                  <td><span class="badge badge-ok" style="font-size:8px">파일첨부완료</span></td>
                  <td style="font-size:10px;color:#565e74">test_report.pdf</td>
                </tr>
                <tr style="background:#fef2f2">
                  <td><input type="checkbox"></td>
                  <td>3</td>
                  <td>거래가격 소명자료</td>
                  <td><span class="badge badge-urgent" style="font-size:8px">미첨부</span></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-bottom:14px">
            <div style="font-size:11px;font-weight:700;color:#4d6172;margin-bottom:8px">첨부파일 등록</div>
            <div style="display:flex;gap:6px;justify-content:flex-end;margin-bottom:6px">
              <button class="btn btn-secondary" style="padding:4px 8px;font-size:9px"
                onclick="alert('파일 선택란이 추가되었습니다.')">＋ 행추가</button>
              <button class="btn btn-danger" style="padding:4px 8px;font-size:9px">－ 행삭제</button>
            </div>
            <table class="data-table" style="font-size:11px">
              <thead>
                <tr>
                  <th style="width:24px"><input type="checkbox"></th>
                  <th style="width:30px">No</th>
                  <th style="width:140px">문서종류</th>
                  <th>파일 선택</th>
                  <th style="width:60px">용량</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox"></td>
                  <td>1</td>
                  <td><select style="font-size:11px;padding:3px;width:100%">
                      <option>선택</option>
                      <option selected>원산지증명서</option>
                      <option>검사성적서</option>
                      <option>가격소명자료</option>
                      <option>송품장(INVOICE)</option>
                      <option>포장명세서(P/L)</option>
                      <option>B/L 사본</option>
                      <option>계약서</option>
                      <option>기타</option>
                    </select></td>
                  <td>
                    <div style="display:flex;gap:4px;align-items:center"><span
                        style="font-size:10px;color:#1d6b4f">C_O_cert.pdf</span></div>
                  </td>
                  <td style="font-size:10px;color:#697d8f">245KB</td>
                </tr>
                <tr>
                  <td><input type="checkbox"></td>
                  <td>2</td>
                  <td><select style="font-size:11px;padding:3px;width:100%">
                      <option>선택</option>
                      <option>원산지증명서</option>
                      <option selected>검사성적서</option>
                      <option>가격소명자료</option>
                      <option>송품장(INVOICE)</option>
                      <option>포장명세서(P/L)</option>
                      <option>B/L 사본</option>
                      <option>계약서</option>
                      <option>기타</option>
                    </select></td>
                  <td>
                    <div style="display:flex;gap:4px;align-items:center"><span
                        style="font-size:10px;color:#1d6b4f">test_report.pdf</span></div>
                  </td>
                  <td style="font-size:10px;color:#697d8f">1.2MB</td>
                </tr>
                <tr>
                  <td><input type="checkbox"></td>
                  <td>3</td>
                  <td><select style="font-size:11px;padding:3px;width:100%">
                      <option>선택</option>
                      <option>원산지증명서</option>
                      <option>검사성적서</option>
                      <option selected>가격소명자료</option>
                      <option>송품장(INVOICE)</option>
                      <option>포장명세서(P/L)</option>
                      <option>B/L 사본</option>
                      <option>계약서</option>
                      <option>기타</option>
                    </select></td>
                  <td><input type="file" style="font-size:10px"></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-item" style="margin-bottom:14px">
            <label style="font-size:11px;font-weight:700;color:#4d6172">보완 소명 내용</label>
            <textarea rows="3"
              placeholder="세관에 전달할 보완 소명 내용을 작성하세요.&#10;&#10;예) 원산지증명서 원본 및 검사성적서를 첨부하여 재전송합니다. 거래가격 소명자료는 별첨 참조 바랍니다."
              style="width:100%;font-size:12px"></textarea>
          </div>

          <div
            style="background:#fef3c7;padding:10px 12px;margin-bottom:14px;font-size:11px;color:#92400e;display:flex;align-items:center;gap:6px">
            <span class="material-symbols-outlined" style="font-size:16px">warning</span>
            미첨부 항목(거래가격 소명자료)이 1건 있습니다. 모든 항목을 첨부한 후 전송하시기를 권장합니다.
          </div>

          <div style="display:flex;justify-content:space-between">
            <div class="btn-row">
              <button class="btn btn-outline" onclick="hideModal('resend')">취소</button>
              <button class="btn btn-secondary"
                onclick="alert('임시저장 완료\n\n보완 대응 내용이 임시저장되었습니다.\n문서함 > 내문서에서 이어서 작업할 수 있습니다.')"><span
                  class="material-symbols-outlined" style="font-size:14px">save</span> 임시저장</button>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary"
                onclick="if(confirm('보완서류를 세관에 전송하시겠습니까?\n\n대상: 인천세관 심사1과\n통관의뢰번호: IMP-20240520-001\n첨부파일: 3건 (미첨부 1건 포함)\n\n※ 전송 후 수정이 불가합니다.'))alert('✅ 보완서류 전송 완료\n\n전송일시: 2024-05-20 15:32:01\n전송문서번호: SND-20240520-003\n\n세관 접수 후 처리결과가 내문서로 통보됩니다.\n화주(SK하이닉스)에게 보완대응 완료가 자동 통보됩니다.');hideModal('resend')"><span
                  class="material-symbols-outlined" style="font-size:14px">send</span> 세관 전송</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================
     ① 상세 모달 (cert-detail-v2)
     ============================================================ -->
      <div class="modal-bg" id="modal-cert-detail-v2">
        <div class="modal-box" style="width:680px;max-height:85vh;overflow-y:auto">
          <button class="modal-close" onclick="hideModal('cert-detail-v2')"><span
              class="material-symbols-outlined">close</span></button>
          <h3><span class="material-symbols-outlined" style="color:#565e74">description</span> 신고필증 상세 조회</h3>

          <!-- 상단 요약 박스 -->
          <div style="background:#ecf4ff;padding:14px 16px;margin-bottom:16px;border-left:4px solid #565e74">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
              <div><span style="color:#697d8f">통관의뢰번호</span>
                <div id="certD-no" style="font-weight:800;font-size:14px;margin-top:3px;color:#203444">-</div>
              </div>
              <div><span style="color:#697d8f">필증유형</span>
                <div id="certD-type" style="font-weight:800;font-size:14px;margin-top:3px;color:#565e74">-</div>
              </div>
            </div>
          </div>

          <!-- 화주 정보 -->
          <div style="border-left:3px solid #565e74;padding-left:12px;margin-bottom:14px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:10px">■ 화주 정보</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:12px">
              <div><span style="color:#697d8f">화주명</span>
                <div id="certD-client" style="font-weight:700;margin-top:3px">-</div>
              </div>
              <div><span style="color:#697d8f">통관고유부호</span>
                <div id="certD-clientCode" style="font-weight:700;margin-top:3px">-</div>
              </div>
            </div>
          </div>

          <!-- 신고 정보 -->
          <div style="border-left:3px solid #506076;padding-left:12px;margin-bottom:14px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:10px">■ 신고 정보</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
              <div><span style="color:#697d8f">품명</span>
                <div id="certD-item" style="font-weight:700;margin-top:3px">-</div>
              </div>
              <div><span style="color:#697d8f">HS코드</span>
                <div id="certD-hs" style="font-weight:700;margin-top:3px">-</div>
              </div>
              <div><span style="color:#697d8f">B/L번호</span>
                <div id="certD-bl" style="font-weight:700;margin-top:3px">-</div>
              </div>
              <div><span style="color:#697d8f">수리일시</span>
                <div id="certD-acceptDate" style="font-weight:700;margin-top:3px;color:#1d6b4f">-</div>
              </div>
            </div>
          </div>

          <!-- 세관 정보 -->
          <div style="border-left:3px solid #605c78;padding-left:12px;margin-bottom:14px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:10px">■ 세관 정보</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
              <div><span style="color:#697d8f">통관지세관</span>
                <div id="certD-customs" style="font-weight:700;margin-top:3px">-</div>
              </div>
              <div><span style="color:#697d8f">담당자</span>
                <div id="certD-officer" style="font-weight:700;margin-top:3px">-</div>
              </div>
            </div>
          </div>

          <!-- 납부 정보 -->
          <div
            style="border-left:3px solid #1d6b4f;padding-left:12px;margin-bottom:16px;background:#f0fdf4;padding:12px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:10px">■ 납부 정보</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
              <div><span style="color:#697d8f">총 납부세액</span>
                <div id="certD-tax" style="font-weight:800;margin-top:3px;font-size:14px;color:#565e74">-</div>
              </div>
              <div><span style="color:#697d8f">납부상태</span>
                <div id="certD-payStatus" style="font-weight:700;margin-top:3px;color:#1d6b4f">-</div>
              </div>
              <div><span style="color:#697d8f">전자납부번호</span>
                <div id="certD-enpNo" style="font-weight:700;margin-top:3px;font-family:monospace">-</div>
              </div>
            </div>
          </div>

         

          <div class="btn-row" style="justify-content:flex-end;padding-top:12px;border-top:1px solid #e2e8f0">
            <button class="btn btn-outline" onclick="hideModal('cert-detail-v2')">닫기</button>
            <button type="button" class="btn btn-secondary"
			        onclick="downloadCertPdfFromDetail()">
			  <span class="material-symbols-outlined" style="font-size:14px">download</span> 다운로드
			</button>
          </div>
        </div>
      </div>


     
      
 <!-- ============================================================
     처리현황 상세조회 모달 (status-detail)
     ============================================================ -->
                <div class="modal-bg" id="modal-status-detail">
                  <div class="modal-box" style="width:820px;max-height:88vh;overflow-y:auto;padding:0">
                    <button class="modal-close" onclick="hideModal('status-detail')"
                      style="top:16px;right:20px;z-index:2"><span
                        class="material-symbols-outlined">close</span></button>

                    <!-- 헤더 -->
                    <div
                      style="background:linear-gradient(135deg,#ecf4ff,#dae2fd);padding:20px 28px 16px;border-bottom:1px solid #cbd5e1">
                      <div
                        style="font-size:10px;font-weight:800;letter-spacing:1px;color:#565e74;text-transform:uppercase;margin-bottom:4px">
                        TACS · Declaration Search</div>
                      <h3 style="font-size:18px;font-weight:900;color:#203444;margin:0">
                        <span class="material-symbols-outlined"
                          style="vertical-align:middle;color:#565e74">search</span>
                        관련 신고서 조회
                      </h3>
                      <div style="font-size:11px;color:#697d8f;margin-top:4px">선택한 화주와 접수일시 기준으로 관련 신고서를 조회합니다. <b
                          style="color:#565e74">목록을 클릭하면 하단 신고서 영역에 내용이 표시됩니다.</b></div>
                    </div>

                    <div style="padding:18px 24px 20px">

                      <!-- 검색 조건 (자동 입력) -->
                      <div style="background:#f8fafc;padding:12px 14px;margin-bottom:14px;border:1px solid #e2e8f0">
                        <div style="font-size:11px;font-weight:700;color:#4d6172;margin-bottom:8px">■ 검색 조건</div>
                        <div class="form-grid" style="grid-template-columns:1fr 1fr 1fr auto">
                          <div class="form-item">
                            <label>화주</label>
                            <input type="text" id="stM-search-client" readonly
                              style="background:#ecf4ff;font-weight:700;color:#203444">
                          </div>
                          <div class="form-item">
                            <label>접수일시 (기준)</label>
                            <input type="text" id="stM-search-date" readonly
                              style="background:#ecf4ff;font-weight:700;color:#203444">
                          </div>
                          <div class="form-item">
                            <label>신고유형</label>
                            <select id="stM-search-type" onchange="renderStatusModalList()">
                              <option value="all">전체</option>
                              <option value="수입">수입신고</option>
                              <option value="수출">수출신고</option>
                              <option value="환급">환급신청</option>
                            </select>
                          </div>
                          <div class="form-item" style="justify-content:flex-end">
                            <label>&nbsp;</label>
                            <button class="btn btn-primary" onclick="renderStatusModalList()"
                              style="padding:7px 12px"><span class="material-symbols-outlined"
                                style="font-size:14px">search</span> 조회</button>
                          </div>
                        </div>
                      </div>

                      <!-- 결과 건수 -->
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                        <div style="font-size:12px;color:#4d6172">검색결과 <b id="stM-count" style="color:#9f403d">0</b>건
                        </div>
                        <div style="font-size:10px;color:#697d8f">※ 각 행을 클릭하면 하단 신고서에 내용이 자동 입력됩니다.</div>
                      </div>

                      <!-- 목록 테이블 -->
                      <table class="data-table" style="font-size:11px">
                        <thead>
                          <tr>
                            <th style="width:140px">통관의뢰번호</th>
                            <th style="width:55px">유형</th>
                            <th>품목</th>
                            <th style="width:90px">HS코드</th>
                            <th style="width:120px">접수일시</th>
                            <th style="width:75px">상태</th>
                            <th style="width:60px">선택</th>
                          </tr>
                        </thead>
                        <tbody id="stM-list-body">
                          <!-- 동적 삽입 -->
                        </tbody>
                      </table>

                      <!-- 안내 -->
                      <div class="alert-bar info" style="margin-top:14px;font-size:11px">
                        <span class="material-symbols-outlined" style="font-size:16px">info</span>
                        선택된 화주의 최근 접수 건이 먼저 표시됩니다. 동일 화주의 신고서가 여러 건인 경우 모두 조회할 수 있습니다.
                      </div>
                    </div>
                  </div>
                </div>

      <!-- ============================================================
     ① 세금 상세 (tax-detail-v2)
     ============================================================ -->
      <div class="modal-bg" id="modal-tax-detail-v2">
        <div class="modal-box" style="width:680px;max-height:85vh;overflow-y:auto">
          <button class="modal-close" onclick="hideModal('tax-detail-v2')"><span
              class="material-symbols-outlined">close</span></button>
          <h3><span class="material-symbols-outlined" style="color:#565e74">receipt_long</span> 세금납부 상세 조회</h3>

          <!-- 상단 요약 -->
          <div
            style="background:linear-gradient(135deg,#ecf4ff,#dae2fd);padding:16px;margin-bottom:16px;border-left:4px solid #565e74">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
              <div>
                <div><span style="color:#697d8f">필증번호</span>
			  <div id="certD-no" style="font-weight:800;font-size:14px;margin-top:3px;color:#203444">-</div>
			</div>
              <div id="taxD-status" style="text-align:right">-</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
              <div><span style="color:#697d8f">납부기한:</span> <b id="taxD-dueDate">-</b> <span id="taxD-dday"
                  style="margin-left:6px">-</span></div>
              <div><span style="color:#697d8f">수리일자:</span> <b id="taxD-acceptDate">-</b></div>
            </div>
          </div>

          <!-- 화주 정보 -->
          <div style="border-left:3px solid #565e74;padding-left:12px;margin-bottom:14px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:8px">■ 화주 / 신고 정보</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
              <div><span style="color:#697d8f">화주:</span> <b id="taxD-client">-</b></div>
              <div><span style="color:#697d8f">품명:</span> <b id="taxD-item">-</b></div>
              <div><span style="color:#697d8f">HS코드:</span> <b id="taxD-hs">-</b></div>
              <div style="grid-column:1/-1"><span style="color:#697d8f">B/L번호:</span> <b id="taxD-bl">-</b></div>
            </div>
          </div>

          <!-- 세액 내역 -->
          <div style="margin-bottom:14px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:8px">■ 세액 산출 내역</h4>
            <div class="tax-breakdown">
              <div class="tax-row"><span>관세</span><b id="taxD-customs">-</b></div>
              <div class="tax-row"><span>부가세</span><b id="taxD-vat">-</b></div>
              <div class="tax-row"><span>개별소비세</span><b id="taxD-spc">-</b></div>
              <div class="tax-row"><span>기타</span><b id="taxD-other">-</b></div>
              <div class="tax-row total"><span>총 납부세액</span><b id="taxD-total">-</b></div>
            </div>
          </div>

          <!-- 납부 정보 -->
          <div style="border-left:3px solid #1d6b4f;padding:12px;margin-bottom:14px;background:#f0fdf4">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:8px">■ 납부 정보</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
              <div><span style="color:#697d8f">전자납부번호:</span> <b id="taxD-enpNo" style="font-family:monospace">-</b>
              </div>
              <div><span style="color:#697d8f">납부일자:</span> <b id="taxD-payDate">-</b></div>
            </div>
          </div>

          <!-- 처리 이력 -->
          <div style="margin-bottom:14px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:8px">■ 처리 이력</h4>
            <table class="data-table" style="font-size:11px">
              <thead>
                <tr>
                  <th>일시</th>
                  <th>처리내용</th>
                  <th>담당</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="td-muted">05-20 14:35</td>
                  <td>신고필증 발급</td>
                  <td>인천세관</td>
                </tr>
                <tr>
                  <td class="td-muted">05-18 15:20</td>
                  <td>심사 수리</td>
                  <td>김세관</td>
                </tr>
                <tr>
                  <td class="td-muted">05-18 09:15</td>
                  <td>신고 접수</td>
                  <td>TACS 자동</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0">
            <button class="btn btn-outline" onclick="hideModal('tax-detail-v2')">닫기</button>
            <div class="btn-row">
              <button class="btn btn-secondary" onclick="alert('세액 산출내역서를 PDF로 저장합니다.')"><span
                  class="material-symbols-outlined" style="font-size:14px">download</span> 산출내역서</button>
              <button class="btn btn-primary"
                onclick="hideModal('tax-detail-v2');openTaxPay(document.getElementById('taxD-no').textContent)"><span
                  class="material-symbols-outlined" style="font-size:14px">payments</span> 납부</button>
            </div>
          </div>
        </div>
      </div>


      <!-- ============================================================
     ② 납부 (tax-pay-v2)
     ============================================================ -->
      <div class="modal-bg" id="modal-tax-pay-v2">
        <div class="modal-box" style="width:600px;max-height:85vh;overflow-y:auto">
          <button class="modal-close" onclick="hideModal('tax-pay-v2')"><span
              class="material-symbols-outlined">close</span></button>
          <h3><span class="material-symbols-outlined" style="color:#565e74">payments</span> 전자납부 요청</h3>

          <!-- 납부 정보 헤더 -->
          <div style="background:#ecf4ff;padding:14px 16px;margin-bottom:16px;border-left:4px solid #565e74">
            <div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center">
              <div>
                <div style="font-size:10px;color:#697d8f;font-weight:700">통관의뢰번호</div>
                <div id="taxP-no" style="font-size:14px;font-weight:800;margin-top:2px">-</div>
                <div style="font-size:11px;color:#697d8f;margin-top:4px"><b id="taxP-client">-</b></div>
              </div>
              <div style="text-align:right">
                <div style="font-size:10px;color:#697d8f">납부세액</div>
                <div id="taxP-total" style="font-size:22px;font-weight:900;color:#9f403d;letter-spacing:-1px">-</div>
                <div style="font-size:10px;color:#d97706">납부기한: <b id="taxP-dueDate">-</b></div>
              </div>
            </div>
          </div>

          <!-- 납부 진행 단계 -->
          <div class="pay-stepper">
            <div class="step active">
              <div class="circle">1</div>방식 선택
            </div>
            <div class="step">
              <div class="circle">2</div>정보 확인
            </div>
            <div class="step">
              <div class="circle">3</div>인증/결제
            </div>
            <div class="step">
              <div class="circle">4</div>완료
            </div>
          </div>

          <!-- 납부 방식 -->
          <div class="form-item" style="margin-bottom:14px">
            <label>납부 방식 <span class="req">*</span></label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px">
              <label
                style="font-size:12px;padding:10px;border:2px solid #565e74;background:#ecf4ff;cursor:pointer;font-weight:700">
                <input type="radio" name="payMethod" value="realtime" checked>
                <span class="material-symbols-outlined"
                  style="font-size:16px;vertical-align:middle;color:#565e74">bolt</span> 실시간 계좌이체
                <div style="font-size:10px;color:#697d8f;font-weight:400;margin-top:3px">즉시 처리 · 수수료 무료</div>
              </label>
              <label style="font-size:12px;padding:10px;border:1px solid #a0b4c8;background:#fff;cursor:pointer">
                <input type="radio" name="payMethod" value="cms">
                <span class="material-symbols-outlined"
                  style="font-size:16px;vertical-align:middle;color:#697d8f">account_balance</span> 자동이체(CMS)
                <div style="font-size:10px;color:#697d8f;font-weight:400;margin-top:3px">등록된 계좌 자동 출금</div>
              </label>
              <label style="font-size:12px;padding:10px;border:1px solid #a0b4c8;background:#fff;cursor:pointer">
                <input type="radio" name="payMethod" value="card">
                <span class="material-symbols-outlined"
                  style="font-size:16px;vertical-align:middle;color:#697d8f">credit_card</span> 신용카드
                <div style="font-size:10px;color:#697d8f;font-weight:400;margin-top:3px">수수료 0.8% 별도</div>
              </label>
              <label style="font-size:12px;padding:10px;border:1px solid #a0b4c8;background:#fff;cursor:pointer">
                <input type="radio" name="payMethod" value="virtual">
                <span class="material-symbols-outlined"
                  style="font-size:16px;vertical-align:middle;color:#697d8f">qr_code_2</span> 가상계좌
                <div style="font-size:10px;color:#697d8f;font-weight:400;margin-top:3px">기한 내 입금</div>
              </label>
            </div>
          </div>

          <!-- 납부 유형 -->
          <div class="form-item" style="margin-bottom:14px">
            <label>납부 유형</label>
            <div style="display:flex;gap:12px;margin-top:6px;font-size:12px">
              <label><input type="radio" name="payType" value="full" checked> 일시납</label>
              <label><input type="radio" name="payType" value="installment"> 분할납부 신청</label>
              <label><input type="radio" name="payType" value="deferred"> 사후납부 (담보)</label>
            </div>
          </div>

          <!-- 출금 계좌 -->
          <div style="border-left:3px solid #565e74;padding-left:12px;margin-bottom:14px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:8px">출금 계좌</h4>
            <div class="form-grid" style="grid-template-columns:1fr 2fr;gap:8px">
              <div class="form-item"><label>은행</label>
                <select>
                  <option>국민은행</option>
                  <option>신한은행</option>
                  <option>우리은행</option>
                  <option>하나은행</option>
                  <option>농협</option>
                  <option>기업은행</option>
                </select>
              </div>
              <div class="form-item"><label>계좌번호</label><input value="123-45-678901" placeholder="계좌번호"></div>
              <div class="form-item"><label>예금주</label><input value="김관세"></div>
              <div class="form-item"><label>연락처</label><input value="010-1234-5678"></div>
            </div>
          </div>

          <!-- 추가 옵션 -->
          <div style="background:#f8fafc;padding:10px 12px;margin-bottom:14px;font-size:11px">
            <div style="font-weight:700;color:#4d6172;margin-bottom:6px">추가 옵션</div>
            <label style="display:block;padding:3px 0"><input type="checkbox" checked> 납부영수증 자동 발급 (이메일)</label>
            <label style="display:block;padding:3px 0"><input type="checkbox" checked> 화주에게 납부완료 알림 전송</label>
            <label style="display:block;padding:3px 0"><input type="checkbox"> 신고필증 자동 출력</label>
          </div>

          <!-- 동의 -->
          <div style="background:#fef3c7;padding:10px 12px;margin-bottom:14px;font-size:11px;color:#92400e">
            <label><input type="checkbox"> <b>전자납부 약관</b>에 동의하며, 상기 금액을 납부합니다. <a href="#"
                style="color:#92400e;text-decoration:underline">[약관보기]</a></label>
          </div>

          <div style="display:flex;justify-content:space-between">
            <button class="btn btn-outline" onclick="hideModal('tax-pay-v2')">취소</button>
            <div class="btn-row">
              <button class="btn btn-secondary" onclick="alert('납부 정보를 임시저장합니다.')"><span
                  class="material-symbols-outlined" style="font-size:14px">save</span> 저장</button>
              <button class="btn btn-primary"
                onclick="if(confirm('납부를 진행하시겠습니까?\n\n금액: '+document.getElementById('taxP-total').textContent+'\n방식: 실시간 계좌이체'))alert('✅ 납부 처리 중...\n\n전자납부번호가 발급되었습니다.\nENP-2024-0520-015\n\n처리완료 시 알림됩니다.');hideModal('tax-pay-v2')"><span
                  class="material-symbols-outlined" style="font-size:14px">payments</span> 납부 실행</button>
            </div>
          </div>
        </div>
      </div>


      <!-- ============================================================
     ③ 일정 (tax-schedule)
     ============================================================ -->
      <div class="modal-bg" id="modal-tax-schedule">
        <div class="modal-box" style="width:640px;max-height:85vh;overflow-y:auto">
          <button class="modal-close" onclick="hideModal('tax-schedule')"><span
              class="material-symbols-outlined">close</span></button>
          <h3><span class="material-symbols-outlined" style="color:#d97706">schedule</span> 분할납부 일정 관리</h3>

          <!-- 요약 -->
          <div style="background:#ecf4ff;padding:14px 16px;margin-bottom:16px;border-left:4px solid #565e74">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px;margin-bottom:10px">
              <div><span style="color:#697d8f">필증번호:</span> <b id="certS-no">-</b></div>
              <div><span style="color:#697d8f">화주:</span> <b id="taxS-client">-</b></div>
              <div><span style="color:#697d8f">총 세액:</span> <b id="taxS-total" style="color:#9f403d">-</b></div>
              <div><span style="color:#697d8f">진행률:</span> <b id="taxS-progress">- / -</b></div>
            </div>
            <div class="pay-progress">
              <div class="pay-progress-fill" id="taxS-progressBar" style="width:0%"></div>
            </div>
          </div>

          <!-- 스텝퍼 -->
          <div class="pay-stepper" id="taxS-stepper"></div>

          <!-- 회차별 상세 -->
          <div style="margin-bottom:14px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:8px">■ 회차별 납부 내역</h4>
            <table class="data-table" style="font-size:11px">
              <thead>
                <tr>
                  <th>회차</th>
                  <th>금액</th>
                  <th>납부일</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody id="taxS-rows"></tbody>
            </table>
          </div>

          <!-- 알림 설정 -->
          <div style="border-left:3px solid #a0b4c8;padding-left:12px;margin-bottom:14px">
            <h4 style="font-size:12px;font-weight:700;color:#4d6172;margin-bottom:8px">■ 납부 알림 설정</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">
              <label><input type="checkbox" checked> 납부 7일 전 이메일</label>
              <label><input type="checkbox" checked> 납부 3일 전 SMS</label>
              <label><input type="checkbox" checked> 납부 당일 SMS</label>
              <label><input type="checkbox"> 미납 시 경고 알림</label>
              <label><input type="checkbox"> 화주에게 동시 알림</label>
              <label><input type="checkbox"> 카카오 알림톡</label>
            </div>
          </div>

          <!-- 일정 변경 옵션 -->
          <div
            style="background:#fef3c7;padding:10px 12px;margin-bottom:14px;font-size:11px;color:#92400e;display:flex;align-items:center;gap:8px">
            <span class="material-symbols-outlined" style="font-size:16px">info</span>
            분납 일정 변경은 세관 승인이 필요합니다. <a href="#" style="text-decoration:underline;color:#92400e;font-weight:700">[변경
              신청]</a>
          </div>

          <div style="display:flex;justify-content:space-between">
            <button class="btn btn-outline" onclick="hideModal('tax-schedule')">닫기</button>
            <div class="btn-row">
              <button class="btn btn-secondary" onclick="alert('일정표를 PDF로 저장합니다.')"><span
                  class="material-symbols-outlined" style="font-size:14px">calendar_month</span> 일정표 출력</button>
              <button class="btn btn-primary" onclick="alert('알림 설정이 저장되었습니다.')"><span class="material-symbols-outlined"
                  style="font-size:14px">save</span> 저장</button>
            </div>
          </div>
        </div>
      </div>
