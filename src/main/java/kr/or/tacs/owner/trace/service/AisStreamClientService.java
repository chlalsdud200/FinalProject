package kr.or.tacs.owner.trace.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.or.tacs.dto.owner.AisVslLatestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import jakarta.annotation.PostConstruct;
import java.net.URI;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AisStreamClientService {

    private static final String AIS_STREAM_URL = "wss://stream.aisstream.io/v0/stream";

    private final IAisVesselService aisVesselService;
    private final ObjectMapper objectMapper;

    @Value("${aisstream.api-key}")
    private String apiKey;

    @Value("${aisstream.enabled:true}")
    private boolean enabled;

    @PostConstruct
    public void connect() {
        if (!enabled) {
            log.info("[AIS] AISStream 수신 기능 비활성화 상태입니다.");
            return;
        }

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("[AIS] AISStream API Key가 없습니다. application.properties를 확인하세요.");
            return;
        }

        try {
            StandardWebSocketClient client = new StandardWebSocketClient();
            client.execute(new AisMessageHandler(), null, URI.create(AIS_STREAM_URL));

            log.info("[AIS] AISStream WebSocket 연결 시도");
        } catch (Exception e) {
            log.error("[AIS] AISStream 연결 실패", e);
        }
    }

    private class AisMessageHandler extends AbstractWebSocketHandler {

        @Override
        public void afterConnectionEstablished(WebSocketSession session) throws Exception {
            Map<String, Object> subscriptionMessage = Map.of(
                    "APIKey", apiKey,
                    "BoundingBoxes", List.of(
                            List.of(
                                    List.of(32.0, 124.0),
                                    List.of(39.0, 132.0)
                            )
                    ),
                    "FilterMessageTypes", List.of("PositionReport", "ShipStaticData")
            );

            String payload = objectMapper.writeValueAsString(subscriptionMessage);
            session.sendMessage(new TextMessage(payload));

            log.info("[AIS] 대한민국 주변 해역 구독 메시지 전송 완료");
        }

        @Override
        protected void handleTextMessage(WebSocketSession session, TextMessage message) {
            processAisPayload(message.getPayload());
        }

        @Override
        protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
            ByteBuffer buffer = message.getPayload();
            byte[] bytes = new byte[buffer.remaining()];
            buffer.get(bytes);

            String payload = new String(bytes, StandardCharsets.UTF_8);
            processAisPayload(payload);
        }

        @Override
        public void handleTransportError(WebSocketSession session, Throwable exception) {
            log.error("[AIS] WebSocket 오류", exception);
        }

        @Override
        public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
            log.warn("[AIS] WebSocket 연결 종료: {}", status);
        }
    }

    private void processAisPayload(String payload) {
        try {
            JsonNode root = objectMapper.readTree(payload);

            String messageType = root.path("MessageType").asText(null);
            String mmsi = root.path("MetaData").path("MMSI").asText(null);

            if (messageType == null || mmsi == null || mmsi.isBlank()) {
                return;
            }

            if ("ShipStaticData".equals(messageType)) {
                handleShipStaticData(root, mmsi);
                return;
            }

            if ("PositionReport".equals(messageType)) {
                handlePositionReport(root, mmsi);
            }

        } catch (Exception e) {
            log.warn("[AIS] 메시지 처리 실패: {}", e.getMessage());
        }
    }

    private void handleShipStaticData(JsonNode root, String mmsi) {
        JsonNode staticData = root.path("Message").path("ShipStaticData");

        String shipName = staticData.path("Name").asText(null);
        String destination = staticData.path("Destination").asText(null);

        boolean koreanVessel = isKoreanVessel(mmsi);
        boolean incomingToKorea = aisVesselService.isIncomingToKorea(destination, mmsi);

        AisVslLatestDTO aisDTO = new AisVslLatestDTO();
        aisDTO.setAvlMmsi(mmsi);
        aisDTO.setAvlShipNm(shipName != null ? shipName.trim() : null);
        aisDTO.setAvlDest(destination != null ? destination.trim() : null);
        aisDTO.setAvlKrVslYn(koreanVessel ? "Y" : "N");
        aisDTO.setAvlIncomeKrYn(incomingToKorea ? "Y" : "N");
        aisDTO.setAvlMsgType("ShipStaticData");

        aisVesselService.saveLatestVessel(aisDTO);

        if (incomingToKorea) {
            log.info("[AIS] 입항 대상 선박 등록 - MMSI: {}, 선박명: {}, 목적지: {}",
                    mmsi, shipName, destination);
        }
    }

    private void handlePositionReport(JsonNode root, String mmsi) {
        JsonNode position = root.path("Message").path("PositionReport");

        Double lat = getNullableDouble(position, "Latitude");
        Double lon = getNullableDouble(position, "Longitude");
        Double sog = getNullableDouble(position, "Sog");
        Double cog = getNullableDouble(position, "Cog");
        Double heading = getNullableDouble(position, "TrueHeading");

        AisVslLatestDTO aisDTO = new AisVslLatestDTO();
        aisDTO.setAvlMmsi(mmsi);
        aisDTO.setAvlLat(lat);
        aisDTO.setAvlLon(lon);
        aisDTO.setAvlSog(sog);
        aisDTO.setAvlCog(cog);
        aisDTO.setAvlHead(heading);
        aisDTO.setAvlKrVslYn(isKoreanVessel(mmsi) ? "Y" : "N");
        aisDTO.setAvlMsgType("PositionReport");

        aisVesselService.saveLatestVessel(aisDTO);
    }

    private Double getNullableDouble(JsonNode node, String fieldName) {
        JsonNode value = node.path(fieldName);

        if (value.isMissingNode() || value.isNull()) {
            return null;
        }

        return value.asDouble();
    }

    private boolean isKoreanVessel(String mmsi) {
        return mmsi != null && (mmsi.startsWith("440") || mmsi.startsWith("441"));
    }
}