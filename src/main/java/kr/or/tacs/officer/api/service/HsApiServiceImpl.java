package kr.or.tacs.officer.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.nio.charset.StandardCharsets;
import org.springframework.http.ResponseEntity;

import kr.or.tacs.officer.api.service.IHsApiService;

@Service
public class HsApiServiceImpl implements IHsApiService {

    @Value("${unipass.hs.navigation.url}")
    private String hsNavigationUrl;

    @Value("${unipass.hs.navigation.key}")
    private String hsNavigationKey;

    @Value("${unipass.hs.code.search.url}")
    private String hsCodeSearchUrl;

    @Value("${unipass.hs.code.search.key}")
    private String hsCodeSearchKey;

    private final RestTemplate restTemplate = new RestTemplate();
    @Override
    public String getHsCodeSearchRaw(String hsCode) {

        String url = hsCodeSearchUrl.trim()
                + "?crkyCn=" + hsCodeSearchKey.trim()
                + "&hsSgn=" + hsCode.trim()
                + "&koenTp=1";

        ResponseEntity<byte[]> response =
                restTemplate.getForEntity(url, byte[].class);

        return new String(response.getBody(), StandardCharsets.UTF_8);
    }
    
    @Override
    public String getHsNavigationRaw(String hsCode) {

        String url = hsNavigationUrl
                + "?crkyCn=" + hsNavigationKey
                + "&hsSgn=" + hsCode;

        System.out.println("NAV URL = " + url);

        return restTemplate.getForObject(url, String.class);
    }
    
    @Override
    public String makeHsCodeSearchUrl(String hsCode) {
        return hsCodeSearchUrl.trim()
                + "?crkyCn=" + hsCodeSearchKey.trim()
                + "&hsSgn=" + hsCode.trim()
                + "&koenTp=1";
    }
}