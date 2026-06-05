package kr.or.tacs.systemadmin.hsknowledge.service;

import java.util.List;
import java.util.Locale;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import kr.or.tacs.vo.systemadmin.hsknowledge.HsRefChunkVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class HsRefDocVectorStoreService {

    private final ObjectProvider<VectorStore> vectorStoreProvider;

    @Value("${spring.ai.vectorstore.type:none}")
    private String vectorStoreType;

    /*
     * 임베딩 API(무료 등급) 분당 요청 한도(429)에 걸리지 않도록
     * 청크를 작은 배치로 나눠 보내고 배치 사이에 잠깐 쉰다.
     * 한도/요금제에 맞게 application.properties에서 조정 가능.
     */
    // 무료 등급 분당 한도(429)가 빡빡해 기본을 보수적으로 둔다. (1건씩, 5초 간격 ≈ 분당 12건)
    // 결제(billing) 활성화 등으로 한도가 넉넉하면 batch-size를 키우고 delay를 줄여 속도를 올린다.
    @Value("${tacs.hs.embedding.batch-size:1}")
    private int embeddingBatchSize;

    @Value("${tacs.hs.embedding.batch-delay-ms:5000}")
    private long embeddingBatchDelayMs;

    public boolean isMilvusEnabled() {
        return "milvus".equals(normalizeType()) && vectorStoreProvider.getIfAvailable() != null;
    }

    public void addChunks(String collectionName, List<ChunkDocument> chunks) {
        VectorStore vectorStore = vectorStoreProvider.getIfAvailable();
        if (!isMilvusEnabled() || vectorStore == null) {
            log.info("Milvus 비활성: 청크 DB만 저장됨");
            return;
        }
        if (chunks == null || chunks.isEmpty()) {
            return;
        }

        List<Document> documents = chunks.stream()
                .map(chunk -> Document.builder()
                        .id(chunk.chunk().getHsDocId())
                        .text(chunk.content())
                        .metadata("hs_ref_doc_no", chunk.chunk().getHsRefDocNo())
                        .metadata("hs_ref_chunk_no", chunk.chunk().getHsRefChunkNo())
                        .metadata("chunk_index", chunk.chunk().getHsChunkIndex())
                        .metadata("parent_document_id", chunk.chunk().getHsParentDocumentId())
                        .metadata("collection_name", collectionName)
                        .build())
                .toList();

        // 임베딩 API 분당 한도(429) 회피: 작은 배치로 나눠 보내고 배치 사이에 잠깐 대기한다.
        int batchSize = embeddingBatchSize > 0 ? embeddingBatchSize : documents.size();
        for (int start = 0; start < documents.size(); start += batchSize) {
            int end = Math.min(start + batchSize, documents.size());
            vectorStore.add(documents.subList(start, end));

            if (end < documents.size() && embeddingBatchDelayMs > 0) {
                try {
                    Thread.sleep(embeddingBatchDelayMs);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new IllegalStateException("임베딩 적재가 중단되었습니다.", e);
                }
            }
        }
    }

    public void deleteChunks(List<String> documentIds) {
        VectorStore vectorStore = vectorStoreProvider.getIfAvailable();
        if (!isMilvusEnabled() || vectorStore == null) {
            log.info("Milvus 비활성: 청크 벡터 삭제 스킵");
            return;
        }
        if (documentIds == null || documentIds.isEmpty()) {
            return;
        }
        vectorStore.delete(documentIds);
    }

    public List<Document> search(String query, int topK) {
        VectorStore vectorStore = vectorStoreProvider.getIfAvailable();
        if (!isMilvusEnabled() || vectorStore == null) {
            throw new IllegalStateException("Milvus가 비활성화되어 검색을 사용할 수 없습니다.");
        }
        SearchRequest request = SearchRequest.builder()
                .query(query)
                .topK(topK)
                .build();
        return vectorStore.similaritySearch(request);
    }

    private String normalizeType() {
        return StringUtils.hasText(vectorStoreType)
                ? vectorStoreType.trim().toLowerCase(Locale.ROOT)
                : "none";
    }

    public record ChunkDocument(HsRefChunkVO chunk, String content) {
    }
}
