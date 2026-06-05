package kr.or.tacs.dto;

import lombok.Data;

import java.util.List;

@Data
public class FileListDTO {

    private String tfgNo;
    private List<FileInfoDTO> fileList;
}
