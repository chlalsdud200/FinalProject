package kr.or.tacs.owner.trace.service;

import jakarta.annotation.PostConstruct;
import kr.or.tacs.dto.owner.AisPortAliasDTO;
import kr.or.tacs.dto.owner.AisVslLatestDTO;
import kr.or.tacs.owner.trace.mapper.IAisMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class AisVesselServiceImpl implements IAisVesselService{

    @Autowired
    private IAisMapper aisMapper;

    /**
     * AIS 목적지 별칭 캐시.
     * 매 메시지마다 DB 조회하면 부하가 커지니까 서버 시작 시 한 번 읽어둠.
     */
    private List<AisPortAliasDTO> portAliasList = new ArrayList<>();

    @PostConstruct
    public void loadPortAliases() {
        refreshPortAliases();
    }

    @Override
    public void refreshPortAliases() {
        this.portAliasList = aisMapper.selectPortAliasList();
        log.info("[AIS] 항구 별칭 {}건 로드 완료", portAliasList.size());
    }

    @Override
    public void saveLatestVessel(AisVslLatestDTO aisDTO) {
        if (aisDTO == null || aisDTO.getAvlMmsi() == null || aisDTO.getAvlMmsi().isBlank()) {
            return;
        }

        Long shipNo = aisMapper.selectShipNoByMmsi(aisDTO.getAvlMmsi());
        aisDTO.setAvlShipNo(shipNo);

        aisMapper.mergeAisVslLatest(aisDTO);
    }

    @Override
    public boolean isIncomingToKorea(String destination, String mmsi) {
        String dest = normalizeDestination(destination);

        if (dest.isBlank()) {
            return false;
        }

        return portAliasList.stream()
                .map(AisPortAliasDTO::getApaAliasNm)
                .filter(alias -> alias != null && !alias.isBlank())
                .map(this::normalizeDestination)
                .anyMatch(dest::contains);
    }

    private String normalizeDestination(String value) {
        if (value == null) {
            return "";
        }

        return value
                .toUpperCase(Locale.ROOT)
                .replaceAll("[^A-Z0-9]", "");
    }

    @Override
    public List<AisVslLatestDTO> retrieveIncomingVesselList() {
        return aisMapper.selectIncomingVesselList();
    }

    @Override
    public List<AisVslLatestDTO> retrieveRecentVesselList() {
        return aisMapper.selectRecentVesselList();
    }

    @Override
    public AisVslLatestDTO retrieveVesselLatest(String mmsi) {
        return aisMapper.selectVesselLatest(mmsi);
    }

    private boolean isKoreanVessel(String mmsi) {
        if (mmsi == null) {
            return false;
        }

        return mmsi.startsWith("440") || mmsi.startsWith("441");
    }
}
