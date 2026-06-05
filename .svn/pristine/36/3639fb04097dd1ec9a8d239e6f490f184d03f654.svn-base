package kr.or.tacs.fieldofficer.dashboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.tacs.vo.fieldofficer.dashboard.DashboardDeadlineVO;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardRecentRequestVO;
import kr.or.tacs.vo.fieldofficer.dashboard.DashboardVO;

@Mapper
public interface IFieldOfficerDashboardMapper {

	/*
	 * 대시보드 통계 조회
	 * 
	 * 조회 내용:
	 * 1. 신규 요청 수
	 * 2. 검역 판정 대기 수
	 * 3. 결과 통보 완료 수
	 * 4. 접수 처리율
	 * 5. 합격/불합격/보완요청 수
	 */
	public DashboardVO selectDashboard();

	/*
	 * 최근 검역 요청 목록 조회
	 * 
	 * 조회 내용:
	 * - 대시보드 가운데 영역에 표시할 최근 검역 요청 목록
	 */
	public List<DashboardRecentRequestVO> selectRecentRequestList();

	/*
	 * 회신시한 임박 목록 조회
	 * 
	 * 조회 내용:
	 * - 대시보드 오른쪽 하단의 다가오는 기한 목록
	 */
	public List<DashboardDeadlineVO> selectDeadlineList();

}
