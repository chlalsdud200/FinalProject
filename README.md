# TACS

TACS는 통관 업무 흐름을 관리하기 위한 웹 프로젝트입니다. 사용자 권한별 업무 처리, 통계, 알림, 고객지원 콘텐츠 관리, HS 코드 지식 관리, AI 추천 연동 기능을 포함합니다.

## 주요 기능

- 통관 관련 사용자/권한별 업무 화면
- 관리자 대시보드 및 회원 관리
- 공통 코드, 메뉴 권한, 알림 정책/이력 관리
- 공지사항, FAQ, 자료실 콘텐츠 관리
- HS 코드 지식 관리 및 AI 추천 연동
- 문서 업로드, OCR, PDF/Excel 처리

## 기술 스택

- Java 21
- Spring Boot 4
- Spring Security, JWT
- MyBatis
- Oracle JDBC
- JSP/JSTL
- Spring AI, Google GenAI, Milvus VectorStore
- PDFBox, Apache POI, OpenPDF

## 실행 방법

```bash
./mvnw spring-boot:run
```

Windows 환경에서는 다음 명령을 사용할 수 있습니다.

```bash
mvnw.cmd spring-boot:run
```

기본 서버 포트는 `8077`입니다.

## 환경 설정

기본 설정은 `src/main/resources/application.properties`에서 관리합니다.

API 키, DB 계정, 외부 서비스 인증 정보는 `application-secret.properties`에 분리해서 관리하며 Git에는 올리지 않습니다.

AI 추천 기능은 Milvus와 Google GenAI 설정이 필요합니다. 로컬 개발에서 AI 추천을 사용하지 않을 경우 `hs.ai-recommend.enabled=false` 상태로 실행할 수 있습니다.
