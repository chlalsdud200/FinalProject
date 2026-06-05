package kr.or.tacs.common.ocr.service;

import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.protobuf.ByteString;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class GoogleVisionOcrService {

    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "";
        }

        String fileName = file.getOriginalFilename();
        String lowerName = fileName == null ? "" : fileName.toLowerCase();

        if (lowerName.endsWith(".pdf")) {
            return extractTextFromPdf(file);
        }

        return extractTextFromImageBytes(toBytes(file));
    }

    private String extractTextFromPdf(MultipartFile file) {
        StringBuilder result = new StringBuilder();

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFRenderer renderer = new PDFRenderer(document);

            for (int i = 0; i < document.getNumberOfPages(); i++) {
                ByteArrayOutputStream out = new ByteArrayOutputStream();

                ImageIO.write(renderer.renderImageWithDPI(i, 300), "png", out);

                result.append(extractTextFromImageBytes(out.toByteArray()))
                        .append("\n");
            }

            return result.toString();

        } catch (Exception e) {
            throw new RuntimeException("PDF를 이미지로 변환하여 OCR 처리하는 중 오류가 발생했습니다.", e);
        }
    }

    private String extractTextFromImageBytes(byte[] bytes) {
        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {
            ByteString imgBytes = ByteString.copyFrom(bytes);

            Image image = Image.newBuilder()
                    .setContent(imgBytes)
                    .build();

            Feature feature = Feature.newBuilder()
                    .setType(Feature.Type.DOCUMENT_TEXT_DETECTION)
                    .build();

            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .setImage(image)
                    .addFeatures(feature)
                    .build();

            AnnotateImageResponse response = vision.batchAnnotateImages(List.of(request))
                    .getResponsesList()
                    .get(0);

            if (response.hasError()) {
                throw new RuntimeException("Google Vision OCR 오류: " + response.getError().getMessage());
            }

            if (response.hasFullTextAnnotation()) {
                return response.getFullTextAnnotation().getText();
            }

            return response.getTextAnnotationsList().isEmpty()
                    ? ""
                    : response.getTextAnnotationsList().get(0).getDescription();

        } catch (Exception e) {
            throw new RuntimeException("Google Vision OCR 처리 중 오류가 발생했습니다.", e);
        }
    }

    private byte[] toBytes(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (Exception e) {
            throw new RuntimeException("업로드 파일을 읽는 중 오류가 발생했습니다.", e);
        }
    }
}