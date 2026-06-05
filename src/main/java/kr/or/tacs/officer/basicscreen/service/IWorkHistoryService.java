package kr.or.tacs.officer.basicscreen.service;

import java.util.List;
import java.util.Map;

import kr.or.tacs.dto.officer.WorkHistoryDTO;

public interface IWorkHistoryService {

    // ── 공무원용 ───────────────────────────────────────
    WorkHistoryDTO save(WorkHistoryDTO dto);
    WorkHistoryDTO cancel(String reqNo, String workType);
    List<WorkHistoryDTO> getList(String reqNo);
    WorkHistoryDTO findActive(String reqNo);

    // ── 관세사용 ───────────────────────────────────────
    /** 관세사에게 할당된 미처리 보완요청 목록 */
    List<WorkHistoryDTO> getSupplementListByReceiver(String receiverId);

    /** 보완요청 단건 상세 조회 (요청내용 + 제출내용 포함) */
    WorkHistoryDTO getSupplementDetail(String srNo);

    /** 관세사 보완제출 */
    WorkHistoryDTO submitSupplement(WorkHistoryDTO dto);
	void save(Map<String, Object> body, String username);
}