# API 정의서

## 1. API 개요

본 프로젝트는 기존 Frontend 미니프로젝트에서 사용하던 `json-server`를 Spring Boot 기반 Backend 서버로 대체하여 도서관리시스템을 구현한다.

주요 기능은 다음과 같다.

* 도서 목록 조회
* 도서 상세 조회
* 도서 등록
* 도서 수정
* 도서 삭제
* AI 생성 표지 이미지 URL 저장
* 리뷰 조회/등록/수정/삭제/좋아요 기능

Spring Boot 서버는 도서 및 리뷰 데이터를 관리하고, React Frontend는 `fetch`를 통해 Spring Boot REST API를 호출한다.

AI 표지 생성은 Frontend에서 OpenAI API를 직접 호출하고, 응답으로 받은 `b64_json`을 Data URL로 변환한 뒤 Spring Boot의 표지 저장 API로 전달한다.

---

## 2. Base URL

## 2.1 Spring Boot Server

```txt
http://localhost:8080
```

## 2.2 Frontend Server

```txt
http://localhost:5173
```

## 2.3 OpenAI Image Generation API

```txt
https://api.openai.com/v1/images/generations
```

---

## 3. CORS 설정

Frontend와 Backend의 포트가 다르기 때문에 CORS 설정이 필요하다.

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:8080
```

Spring Boot 서버에서는 React 앱에서 오는 요청을 허용해야 한다.

허용 Method:

```txt
GET, POST, PUT, PATCH, DELETE, OPTIONS
```

---

## 4. 데이터 모델

## 4.1 Book

도서 정보를 저장하는 엔티티이다.

```json
{
  "id": 1,
  "title": "돌이킬 수 있는",
  "author": "문목하",
  "tag": ["한국소설", "SF"],
  "likes": 0,
  "content": "도서 내용 또는 요약",
  "coverImageUrl": "https://image.aladin.co.kr/product/...",
  "createdAt": "2026-05-22T09:00:00",
  "updatedAt": "2026-05-22T09:00:00"
}
```

| 필드명             | 타입            | 필수 여부 | 설명                           |
| --------------- | ------------- | ----: | ---------------------------- |
| `id`            | Long          | 자동 생성 | 도서 고유 ID                     |
| `title`         | String        |    필수 | 도서명                          |
| `author`        | String        |    필수 | 작가명                          |
| `tag`           | List<String>  |    선택 | 도서 카테고리 태그                   |
| `likes`         | Integer       |    필수 | 도서 좋아요 수                     |
| `content`       | String        |    필수 | 도서 내용 또는 요약                  |
| `coverImageUrl` | String        |    선택 | 표지 이미지 URL 또는 AI 생성 Data URL |
| `createdAt`     | LocalDateTime |    필수 | 도서 등록 시간                     |
| `updatedAt`     | LocalDateTime |    필수 | 도서 수정 시간                     |

### 검증 규칙

| 필드명         | 검증 조건         |
| ----------- | ------------- |
| `title`     | 공백 불가         |
| `author`    | 공백 불가         |
| `content`   | 공백 불가         |
| `likes`     | 기본값 0         |
| `createdAt` | 등록 시 자동 생성    |
| `updatedAt` | 등록/수정 시 자동 갱신 |

---

## 4.2 Review

리뷰 정보를 저장하는 엔티티이다.

```json
{
  "id": 1,
  "bookId": 1,
  "bookTitle": "돌이킬 수 있는",
  "nickname": "독서왕",
  "content": "흥미로운 설정이 좋았습니다.",
  "likes": 0,
  "createdAt": "2026-05-22T10:00:00",
  "updatedAt": "2026-05-22T10:00:00"
}
```

| 필드명         | 타입            | 필수 여부 | 설명            |
| ----------- | ------------- | ----: | ------------- |
| `id`        | Long          | 자동 생성 | 리뷰 고유 ID      |
| `bookId`    | Long          |    필수 | 리뷰가 연결된 도서 ID |
| `bookTitle` | String        |    선택 | 리뷰가 연결된 도서명   |
| `nickname`  | String        |    필수 | 리뷰 작성자 닉네임    |
| `content`   | String        |    필수 | 리뷰 내용         |
| `likes`     | Integer       |    필수 | 리뷰 좋아요 수      |
| `createdAt` | LocalDateTime |    필수 | 리뷰 등록 시간      |
| `updatedAt` | LocalDateTime |    필수 | 리뷰 수정 시간      |

### 관계

```txt
Book 1 : N Review
```

하나의 도서에는 여러 개의 리뷰가 작성될 수 있다.
리뷰는 `bookId`를 통해 특정 도서와 연결된다.

---

# 5. Books API

## 5.1 도서 목록 조회

### Request

```txt
GET /books
```

### 설명

전체 도서 목록을 조회한다.

### Query Parameter

| 이름        | 타입     | 필수 여부 | 설명                                   |
| --------- | ------ | ----: | ------------------------------------ |
| `keyword` | String |    선택 | 도서명, 작가, 내용 검색어                      |
| `sort`    | String |    선택 | 정렬 기준. 예: `latest`, `likes`, `title` |

### Request 예시

```txt
GET /books
GET /books?keyword=소설
GET /books?sort=likes
```

### Response

```json
[
  {
    "id": 1,
    "title": "돌이킬 수 있는",
    "author": "문목하",
    "tag": ["한국소설", "SF"],
    "likes": 1,
    "content": "촉망받는 신입 수사관 윤서리...",
    "coverImageUrl": "https://image.aladin.co.kr/product/...",
    "createdAt": "2026-05-22T09:00:00",
    "updatedAt": "2026-05-22T09:00:00"
  }
]
```

### Status Code

|  코드 | 설명          |
| --: | ----------- |
| 200 | 도서 목록 조회 성공 |

---

## 5.2 도서 상세 조회

### Request

```txt
GET /books/{id}
```

### 설명

특정 도서의 상세 정보를 조회한다.

### Path Variable

| 이름   | 타입   | 설명        |
| ---- | ---- | --------- |
| `id` | Long | 조회할 도서 ID |

### Request 예시

```txt
GET /books/1
```

### Response

```json
{
  "id": 1,
  "title": "돌이킬 수 있는",
  "author": "문목하",
  "tag": ["한국소설", "SF"],
  "likes": 1,
  "content": "촉망받는 신입 수사관 윤서리...",
  "coverImageUrl": "https://image.aladin.co.kr/product/...",
  "createdAt": "2026-05-22T09:00:00",
  "updatedAt": "2026-05-22T09:00:00"
}
```

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 200 | 도서 상세 조회 성공    |
| 404 | 해당 도서를 찾을 수 없음 |

---

## 5.3 도서 등록

### Request

```txt
POST /books
```

### 설명

새로운 도서를 등록한다.

### Request Body

```json
{
  "title": "새 도서 제목",
  "author": "작가명",
  "tag": ["한국소설", "감성"],
  "content": "도서 내용 또는 줄거리",
  "coverImageUrl": ""
}
```

### Response

```json
{
  "id": 2,
  "title": "새 도서 제목",
  "author": "작가명",
  "tag": ["한국소설", "감성"],
  "likes": 0,
  "content": "도서 내용 또는 줄거리",
  "coverImageUrl": "",
  "createdAt": "2026-05-22T10:00:00",
  "updatedAt": "2026-05-22T10:00:00"
}
```

### 처리 규칙

* `title`, `author`, `content`는 필수 입력값이다.
* `likes`는 최초 등록 시 `0`으로 설정한다.
* `createdAt`, `updatedAt`은 서버에서 자동 생성한다.
* `coverImageUrl`은 비어 있을 수 있다.
* AI 표지를 미리 생성한 경우 `coverImageUrl`에 Data URL 또는 이미지 URL을 포함할 수 있다.

### Status Code

|  코드 | 설명               |
| --: | ---------------- |
| 201 | 도서 등록 성공         |
| 400 | 필수값 누락 또는 잘못된 요청 |

---

## 5.4 도서 수정

### Request

```txt
PATCH /books/{id}
```

### 설명

기존 도서 정보를 부분 수정한다.

### Path Variable

| 이름   | 타입   | 설명        |
| ---- | ---- | --------- |
| `id` | Long | 수정할 도서 ID |

### Request Body

```json
{
  "title": "수정된 도서 제목",
  "author": "수정된 작가명",
  "tag": ["해외소설", "고전"],
  "content": "수정된 도서 내용"
}
```

### Response

```json
{
  "id": 1,
  "title": "수정된 도서 제목",
  "author": "수정된 작가명",
  "tag": ["해외소설", "고전"],
  "likes": 1,
  "content": "수정된 도서 내용",
  "coverImageUrl": "https://image.aladin.co.kr/product/...",
  "createdAt": "2026-05-22T09:00:00",
  "updatedAt": "2026-05-22T11:00:00"
}
```

### 처리 규칙

* PATCH 요청이므로 요청 본문에서 전달된 필드만 수정한다.
* `null`인 필드는 기존 값을 유지한다.
* 도서 수정 시 `updatedAt`을 갱신한다.
* `createdAt`은 변경하지 않는다.
* `likes`는 별도 좋아요 API 또는 PATCH 요청에서 변경할 수 있다.

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 200 | 도서 수정 성공       |
| 400 | 필수값 검증 실패      |
| 404 | 해당 도서를 찾을 수 없음 |

---

## 5.5 도서 좋아요

### Request

```txt
PATCH /books/{id}/like
```

### 설명

도서의 좋아요 수를 1 증가시킨다.

### Path Variable

| 이름   | 타입   | 설명            |
| ---- | ---- | ------------- |
| `id` | Long | 좋아요를 누를 도서 ID |

### Request Body

없음

### Response

```json
{
  "id": 1,
  "title": "돌이킬 수 있는",
  "author": "문목하",
  "tag": ["한국소설", "SF"],
  "likes": 2,
  "content": "촉망받는 신입 수사관 윤서리...",
  "coverImageUrl": "https://image.aladin.co.kr/product/...",
  "createdAt": "2026-05-22T09:00:00",
  "updatedAt": "2026-05-22T09:00:00"
}
```

### 처리 규칙

* 좋아요 수를 1 증가시킨다.
* 좋아요는 도서 본문 수정이 아니므로 `updatedAt`은 변경하지 않는 것을 권장한다.
* 사용자 인증이 없으므로 중복 좋아요 방지는 하지 않는다.

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 200 | 좋아요 처리 성공      |
| 404 | 해당 도서를 찾을 수 없음 |

---

## 5.6 AI 표지 이미지 저장

### Request

```txt
PATCH /books/{id}/cover
```

### 설명

Frontend에서 OpenAI API를 통해 생성한 표지 이미지를 도서의 `coverImageUrl` 필드에 저장한다.

### Path Variable

| 이름   | 타입   | 설명            |
| ---- | ---- | ------------- |
| `id` | Long | 표지를 저장할 도서 ID |

### Request Body

```json
{
  "coverImageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

### Response

```json
{
  "id": 1,
  "title": "돌이킬 수 있는",
  "author": "문목하",
  "tag": ["한국소설", "SF"],
  "likes": 1,
  "content": "촉망받는 신입 수사관 윤서리...",
  "coverImageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "createdAt": "2026-05-22T09:00:00",
  "updatedAt": "2026-05-22T11:30:00"
}
```

### 처리 규칙

* Backend는 OpenAI API를 직접 호출하지 않는다.
* Frontend가 OpenAI API를 직접 호출한다.
* Frontend는 OpenAI 응답의 `b64_json`을 `data:image/png;base64,...` 형식의 Data URL로 변환한다.
* 변환한 Data URL을 `PATCH /books/{id}/cover`로 Backend에 전달한다.
* Backend는 전달받은 값을 `coverImageUrl`에 저장한다.
* 표지 변경은 도서 정보 변경에 해당하므로 `updatedAt`을 갱신한다.

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 200 | 표지 이미지 저장 성공   |
| 400 | 표지 이미지 URL 누락  |
| 404 | 해당 도서를 찾을 수 없음 |

---

## 5.7 도서 삭제

### Request

```txt
DELETE /books/{id}
```

### 설명

특정 도서를 삭제한다.

### Path Variable

| 이름   | 타입   | 설명        |
| ---- | ---- | --------- |
| `id` | Long | 삭제할 도서 ID |

### Request 예시

```txt
DELETE /books/1
```

### Response

응답 본문 없음.

### 처리 규칙

* 삭제 전 Frontend에서 사용자 확인창을 띄운다.
* 해당 도서를 삭제한다.
* 해당 도서에 연결된 리뷰가 있다면 함께 삭제하는 것을 권장한다.
* 삭제 성공 후 Frontend는 도서 목록 페이지로 이동한다.

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 204 | 도서 삭제 성공       |
| 404 | 해당 도서를 찾을 수 없음 |

---

# 6. Reviews API

본 프로젝트의 핵심 Spring 미션은 Book 중심 API이지만, 기존 Frontend 프로젝트의 리뷰 기능을 유지하려면 Reviews API도 함께 구현할 수 있다.

---

## 6.1 리뷰 전체 조회

### Request

```txt
GET /reviews
```

### 설명

전체 리뷰 목록을 조회한다.

### Response

```json
[
  {
    "id": 1,
    "bookId": 1,
    "bookTitle": "돌이킬 수 있는",
    "nickname": "독서왕",
    "content": "흥미로운 설정이 좋았습니다.",
    "likes": 0,
    "createdAt": "2026-05-22T10:00:00",
    "updatedAt": "2026-05-22T10:00:00"
  }
]
```

### Status Code

|  코드 | 설명          |
| --: | ----------- |
| 200 | 리뷰 전체 조회 성공 |

---

## 6.2 특정 도서 리뷰 조회

### Request

```txt
GET /reviews?bookId={bookId}
```

### 설명

특정 도서에 작성된 리뷰 목록을 조회한다.

### Query Parameter

| 이름       | 타입   | 필수 여부 | 설명            |
| -------- | ---- | ----: | ------------- |
| `bookId` | Long |    필수 | 리뷰가 연결된 도서 ID |

### Request 예시

```txt
GET /reviews?bookId=1
```

### Response

```json
[
  {
    "id": 1,
    "bookId": 1,
    "bookTitle": "돌이킬 수 있는",
    "nickname": "독서왕",
    "content": "흥미로운 설정이 좋았습니다.",
    "likes": 0,
    "createdAt": "2026-05-22T10:00:00",
    "updatedAt": "2026-05-22T10:00:00"
  }
]
```

### 처리 규칙

* `bookId`를 기준으로 특정 도서의 리뷰만 조회한다.
* 리뷰는 최신 작성일 또는 수정일 기준으로 정렬할 수 있다.

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 200 | 특정 도서 리뷰 조회 성공 |
| 404 | 해당 도서를 찾을 수 없음 |

---

## 6.3 리뷰 등록

### Request

```txt
POST /reviews
```

### 설명

특정 도서에 리뷰를 작성한다.

### Request Body

```json
{
  "bookId": 1,
  "bookTitle": "돌이킬 수 있는",
  "nickname": "독서왕",
  "content": "흥미로운 설정이 좋았습니다."
}
```

### Response

```json
{
  "id": 1,
  "bookId": 1,
  "bookTitle": "돌이킬 수 있는",
  "nickname": "독서왕",
  "content": "흥미로운 설정이 좋았습니다.",
  "likes": 0,
  "createdAt": "2026-05-22T10:00:00",
  "updatedAt": "2026-05-22T10:00:00"
}
```

### 처리 규칙

* `bookId`, `nickname`, `content`는 필수 입력값이다.
* 최초 등록 시 `likes`는 `0`으로 설정한다.
* `createdAt`, `updatedAt`은 서버에서 자동 생성한다.
* 리뷰 등록 후 Frontend는 리뷰 목록을 갱신한다.

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 201 | 리뷰 등록 성공       |
| 400 | 필수값 누락         |
| 404 | 해당 도서를 찾을 수 없음 |

---

## 6.4 리뷰 수정

### Request

```txt
PATCH /reviews/{id}
```

### 설명

기존 리뷰 내용을 수정한다.

### Path Variable

| 이름   | 타입   | 설명        |
| ---- | ---- | --------- |
| `id` | Long | 수정할 리뷰 ID |

### Request Body

```json
{
  "content": "수정된 리뷰 내용입니다."
}
```

### Response

```json
{
  "id": 1,
  "bookId": 1,
  "bookTitle": "돌이킬 수 있는",
  "nickname": "독서왕",
  "content": "수정된 리뷰 내용입니다.",
  "likes": 0,
  "createdAt": "2026-05-22T10:00:00",
  "updatedAt": "2026-05-22T11:00:00"
}
```

### 처리 규칙

* 리뷰 내용을 수정할 때만 `updatedAt`을 갱신한다.
* 좋아요 클릭 시에는 `updatedAt`을 갱신하지 않는다.
* `bookId`, `bookTitle`, `nickname`, `createdAt`은 유지한다.

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 200 | 리뷰 수정 성공       |
| 400 | 리뷰 내용 누락       |
| 404 | 해당 리뷰를 찾을 수 없음 |

---

## 6.5 리뷰 좋아요

### Request

```txt
PATCH /reviews/{id}/like
```

### 설명

리뷰의 좋아요 수를 1 증가시킨다.

### Path Variable

| 이름   | 타입   | 설명            |
| ---- | ---- | ------------- |
| `id` | Long | 좋아요를 누를 리뷰 ID |

### Request Body

없음

### Response

```json
{
  "id": 1,
  "bookId": 1,
  "bookTitle": "돌이킬 수 있는",
  "nickname": "독서왕",
  "content": "흥미로운 설정이 좋았습니다.",
  "likes": 1,
  "createdAt": "2026-05-22T10:00:00",
  "updatedAt": "2026-05-22T10:00:00"
}
```

### 처리 규칙

* 리뷰 좋아요 수를 1 증가시킨다.
* 좋아요는 리뷰 내용 수정이 아니므로 `updatedAt`은 변경하지 않는다.
* 사용자 인증이 없으므로 중복 좋아요 방지는 하지 않는다.

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 200 | 리뷰 좋아요 성공      |
| 404 | 해당 리뷰를 찾을 수 없음 |

---

## 6.6 리뷰 삭제

### Request

```txt
DELETE /reviews/{id}
```

### 설명

특정 리뷰를 삭제한다.

### Path Variable

| 이름   | 타입   | 설명        |
| ---- | ---- | --------- |
| `id` | Long | 삭제할 리뷰 ID |

### Response

응답 본문 없음.

### 처리 규칙

* 삭제 전 Frontend에서 사용자 확인창을 띄운다.
* 삭제 성공 후 Frontend는 리뷰 목록에서 해당 리뷰를 제거한다.

### Status Code

|  코드 | 설명             |
| --: | -------------- |
| 204 | 리뷰 삭제 성공       |
| 404 | 해당 리뷰를 찾을 수 없음 |

---

# 7. OpenAI Image Generation API

## 7.1 AI 표지 생성

### Request

```txt
POST https://api.openai.com/v1/images/generations
```

### 설명

도서 제목, 태그, 내용을 기반으로 AI 표지 이미지를 생성한다.
이 요청은 Spring Boot 서버가 아니라 Frontend에서 OpenAI API로 직접 보낸다.

### Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {사용자_API_KEY}"
}
```

### Request Body

```json
{
  "model": "gpt-image-2",
  "prompt": "도서 제목과 내용을 기반으로 구성한 표지 생성 프롬프트",
  "n": 1,
  "size": "1024x1536",
  "quality": "medium",
  "output_format": "png"
}
```

### Response 예시

```json
{
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

### Frontend 처리

```js
const data = await response.json();
const b64Image = data.data[0].b64_json;
const dataUrl = `data:image/png;base64,${b64Image}`;

await fetch(`http://localhost:8080/books/${bookId}/cover`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    coverImageUrl: dataUrl
  })
});
```

### 처리 규칙

* OpenAI API Key는 코드에 하드코딩하지 않는다.
* API Key는 Frontend의 password input으로 입력받는다.
* OpenAI API 호출 시 사용량에 따라 비용이 발생할 수 있음을 사용자에게 안내한다.
* OpenAI 응답의 `b64_json`은 반드시 Data URL 형식으로 변환한다.
* 변환한 Data URL은 `PATCH /books/{id}/cover`로 Spring Boot 서버에 저장한다.

---

# 8. 에러 응답 형식

Spring Boot에서는 전역 예외 처리를 통해 에러 응답을 일관된 형식으로 반환한다.

## 8.1 공통 에러 응답

```json
{
  "status": 404,
  "error": "NOT_FOUND",
  "message": "도서를 찾을 수 없습니다.",
  "path": "/books/999"
}
```

| 필드명       | 설명               |
| --------- | ---------------- |
| `status`  | HTTP 상태 코드       |
| `error`   | 에러 타입            |
| `message` | 사용자에게 보여줄 에러 메시지 |
| `path`    | 에러가 발생한 요청 경로    |

---

## 8.2 400 Bad Request

### 발생 상황

* 필수 필드 누락
* 공백 문자열 입력
* 잘못된 요청 본문

### Response

```json
{
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "도서 제목은 필수입니다.",
  "path": "/books"
}
```

---

## 8.3 404 Not Found

### 발생 상황

* 존재하지 않는 도서 조회
* 존재하지 않는 도서 수정
* 존재하지 않는 도서 삭제
* 존재하지 않는 리뷰 조회/수정/삭제

### Response

```json
{
  "status": 404,
  "error": "NOT_FOUND",
  "message": "도서를 찾을 수 없습니다.",
  "path": "/books/999"
}
```

---

## 8.4 500 Internal Server Error

### 발생 상황

* 서버 내부 오류
* 예상하지 못한 예외

### Response

```json
{
  "status": 500,
  "error": "INTERNAL_SERVER_ERROR",
  "message": "서버 내부 오류가 발생했습니다.",
  "path": "/books"
}
```

---

# 9. 상태 코드 요약

|                     상태 코드 | 의미        | 사용 예시              |
| ------------------------: | --------- | ------------------ |
|                    200 OK | 요청 성공     | 조회, 수정, 좋아요, 표지 저장 |
|               201 Created | 리소스 생성 성공 | 도서 등록, 리뷰 등록       |
|            204 No Content | 삭제 성공     | 도서 삭제, 리뷰 삭제       |
|           400 Bad Request | 잘못된 요청    | 필수값 누락, 검증 실패      |
|             404 Not Found | 리소스 없음    | 존재하지 않는 도서/리뷰      |
| 500 Internal Server Error | 서버 오류     | 예외 처리되지 않은 서버 오류   |

---

# 10. API 요약표

## 10.1 Books API

| 기능       | Method | URL                 | 설명                   |
| -------- | ------ | ------------------- | -------------------- |
| 도서 목록 조회 | GET    | `/books`            | 전체 도서 목록 조회          |
| 도서 상세 조회 | GET    | `/books/{id}`       | 특정 도서 상세 조회          |
| 도서 등록    | POST   | `/books`            | 새 도서 등록              |
| 도서 수정    | PATCH  | `/books/{id}`       | 도서 정보 부분 수정          |
| 도서 좋아요   | PATCH  | `/books/{id}/like`  | 도서 좋아요 수 증가          |
| AI 표지 저장 | PATCH  | `/books/{id}/cover` | AI 생성 표지 Data URL 저장 |
| 도서 삭제    | DELETE | `/books/{id}`       | 특정 도서 삭제             |

## 10.2 Reviews API

| 기능          | Method | URL                        | 설명          |
| ----------- | ------ | -------------------------- | ----------- |
| 리뷰 전체 조회    | GET    | `/reviews`                 | 전체 리뷰 목록 조회 |
| 특정 도서 리뷰 조회 | GET    | `/reviews?bookId={bookId}` | 특정 도서 리뷰 조회 |
| 리뷰 등록       | POST   | `/reviews`                 | 새 리뷰 등록     |
| 리뷰 수정       | PATCH  | `/reviews/{id}`            | 리뷰 내용 수정    |
| 리뷰 좋아요      | PATCH  | `/reviews/{id}/like`       | 리뷰 좋아요 수 증가 |
| 리뷰 삭제       | DELETE | `/reviews/{id}`            | 특정 리뷰 삭제    |

## 10.3 OpenAI API

| 기능       | Method | URL                                            | 설명                      |
| -------- | ------ | ---------------------------------------------- | ----------------------- |
| AI 표지 생성 | POST   | `https://api.openai.com/v1/images/generations` | Frontend에서 직접 OpenAI 호출 |

---

# 11. Frontend fetch URL 변경 기준

기존 json-server 사용 시:

```js
const API_BASE_URL = "http://localhost:3000";
```

Spring Boot 전환 후:

```js
const API_BASE_URL = "http://localhost:8080";
```

기존 호출 예시:

```js
request("/books");
request(`/books/${id}`);
request("/reviews");
request(`/reviews?bookId=${id}`);
```

Spring Boot 전환 후에도 URL 구조를 동일하게 유지하면 Frontend 수정 범위를 최소화할 수 있다.

---

# 12. 구현 우선순위

## 필수 구현

```txt
GET    /books
GET    /books/{id}
POST   /books
PATCH  /books/{id}
DELETE /books/{id}
PATCH  /books/{id}/cover
```

## 확장 구현

```txt
PATCH  /books/{id}/like
GET    /reviews
GET    /reviews?bookId={bookId}
POST   /reviews
PATCH  /reviews/{id}
PATCH  /reviews/{id}/like
DELETE /reviews/{id}
```

필수 구현은 교안의 Spring Boot 미션 기준 API이며, 확장 구현은 기존 Frontend 프로젝트의 리뷰 및 좋아요 기능을 유지하기 위한 API이다.
