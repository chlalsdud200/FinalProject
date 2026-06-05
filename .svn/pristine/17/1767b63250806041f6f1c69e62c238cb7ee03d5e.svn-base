package kr.or.tacs.owner.transport.service;

import kr.or.tacs.dto.owner.OwnerFreightCertCompareResultDTO;
import kr.or.tacs.dto.owner.OwnerFreightDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IFreightService {

    List<OwnerFreightDTO> retrieveFreightList(String owrId);

    OwnerFreightDTO retrieveFreight(String tcsNo, String owrId);

    void uploadFreightCertificate(String tcsNo, String trcNo, MultipartFile certFile, String owrId
    );

    OwnerFreightCertCompareResultDTO compareFreightCertificate(String tcsNo, String trcNo, MultipartFile certFile, String owrId
    );
}
