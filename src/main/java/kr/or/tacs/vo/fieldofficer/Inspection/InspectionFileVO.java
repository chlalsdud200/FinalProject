package kr.or.tacs.vo.fieldofficer.Inspection;

import lombok.Data;

@Data
public class InspectionFileVO {

	// 파일번호
    private Integer dfiFileNo;

    // 파일그룹번호
    private Integer tfgNo;

    // 원본 파일명
    private String dfiOrgNm;

    // 서버 저장 파일명
    private String dfiStrNm;

    // 파일 크기(Byte)
    private Long dfiSize;

    // 화면 표시용 파일 크기
    private String fileSizeText;

    // 파일 저장 경로
    private String dfiPath;

    // 삭제 여부
    private String dfiDelYn;

    // 파일 업무 구분
    private String dfiBizTyCd;

    // 등록일시
    private String dfiRegistDt;

}
