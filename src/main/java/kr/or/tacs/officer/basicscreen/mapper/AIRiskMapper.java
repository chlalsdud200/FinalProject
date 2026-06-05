package kr.or.tacs.officer.basicscreen.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.tacs.dto.officer.AIRiskDTO;

@Mapper
public interface AIRiskMapper {
	
	 String selectArrNo();

	 public int insertAiRiskResult(AIRiskDTO dto);

	    public AIRiskDTO selectAiRiskResult(AIRiskDTO dto);

	    public int updateAiRiskResult(AIRiskDTO dto);

	}

