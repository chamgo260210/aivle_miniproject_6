# 4차 미니 프로젝트 - AI 도서 표지 생성 도서 관리 서비스

React, json-server, OpenAI 이미지 생성 API를 활용한 도서 관리 웹 서비스입니다.

사용자는 도서 목록을 조회하고, 새 도서를 등록하거나 기존 도서를 수정할 수 있습니다. 또한 도서 내용 기반으로 AI 표지를 생성할 수 있으며, 도서별 리뷰 작성, 좋아요, 수정, 삭제 기능을 사용할 수 있습니다.

---

## 프로젝트 주요 기능

### 도서 기능

- 도서 목록 조회
- 도서 상세 조회
- 새 도서 등록
- 도서 수정
- 도서 삭제
- 도서 좋아요
- 최신순 / 이름순 / 좋아요순 정렬

### 리뷰 기능

- 도서별 리뷰 작성
- 리뷰 목록 조회
- 리뷰 수정
- 리뷰 삭제
- 리뷰 좋아요
- 홈 화면에서 인기 리뷰 확인

### AI 표지 생성 기능

- OpenAI API Key 입력
- 생성 모델 선택
- 품질 선택
- 도서 제목과 내용을 기반으로 AI 표지 생성
- 생성된 표지를 도서 데이터의 `coverImageUrl`에 저장

---

## 페이지 구성

### 1. 홈 페이지

- 월간 인기 도서 표시
- 인기 리뷰 표시
- 도서 또는 리뷰 클릭 시 상세 페이지로 이동

### 2. 도서 목록 페이지

- 전체 도서 목록 표시
- 최신순, 이름순, 좋아요순 정렬
- 도서별 자세히 보기 버튼 제공

### 3. 새 도서 등록 페이지

- 도서명 입력
- 작가 입력
- 태그 입력
- 책 내용 입력
- OpenAI API Key 입력
- AI 표지 생성
- 도서 등록

### 4. 책 자세히 보기 페이지

- 책 표지 이미지 표시
- 책 제목, 내용, 생성일 표시
- 도서 좋아요 기능
- 도서 수정 기능
- 도서 삭제 기능
- 해당 도서에 대한 리뷰 목록 표시
- 리뷰 작성, 수정, 삭제, 좋아요 기능 제공

---

## 기술 스택

- React
- Vite
- React Router DOM
- json-server
- OpenAI Image Generation API
- JavaScript
- CSS

---

## 설치 및 실행 방법

### 1. 프로젝트 클론

```bash
git clone https://github.com/gkstjr0722/aivle_miniproject.git
cd aivle_miniproject
```

### 2. 패키지 설치

```bash
npm install
```

### 3. json-server 실행

새 터미널을 열고 아래 명령어를 실행합니다.

```bash
npm run server
```

json-server는 아래 주소에서 실행됩니다.

```txt
http://localhost:3000
```

### 4. React 개발 서버 실행

다른 터미널을 열고 아래 명령어를 실행합니다.

```bash
npm run dev
```

브라우저에서 안내되는 로컬 주소로 접속합니다.

```txt
http://localhost:5173
```

---

## 사용 가능한 명령어

```bash
npm run dev
```

React 개발 서버를 실행합니다.

```bash
npm run server
```

`db.json`을 기반으로 json-server를 실행합니다.

```bash
npm run build
```

배포용 파일을 생성합니다.

```bash
npm run lint
```

코드 문법 및 스타일 오류를 검사합니다.

```bash
npm run preview
```

빌드 결과를 로컬에서 미리 확인합니다.

---

## 데이터 구조

이 프로젝트는 `db.json`을 사용해 도서와 리뷰 데이터를 관리합니다.

```json
{
  "books": [],
  "reviews": []
}
```

---

## books 데이터 구조

```json
{
  "id": "368186951",
  "title": "돌이킬 수 있는",
  "author": "문목하 (지은이)",
  "tag": [],
  "likes": 12,
  "content": "도서 내용 또는 요약",
  "coverImageUrl": "https://image.aladin.co.kr/product/...",
  "createdAt": "2026-05-22T09:00:00.000Z",
  "updatedAt": "2026-05-22T09:00:00.000Z"
}
```

| 필드명 | 설명 |
|---|---|
| `id` | 도서 고유 ID |
| `title` | 도서명 |
| `author` | 작가 |
| `tag` | 도서 카테고리 태그 |
| `likes` | 도서 좋아요 수 |
| `content` | 도서 내용 또는 요약 |
| `coverImageUrl` | 도서 표지 이미지 URL |
| `createdAt` | 도서 등록 시간 |
| `updatedAt` | 도서 수정 시간 |

---

## reviews 데이터 구조

```json
{
  "id": 1,
  "bookId": "368186951",
  "bookTitle": "돌이킬 수 있는",
  "nickname": "독서왕",
  "content": "리뷰 내용",
  "likes": 0,
  "createdAt": "2026-05-22T10:00:00.000Z",
  "updatedAt": "2026-05-22T10:00:00.000Z"
}
```

| 필드명 | 설명 |
|---|---|
| `id` | 리뷰 고유 ID |
| `bookId` | 리뷰가 연결된 도서 ID |
| `bookTitle` | 리뷰가 연결된 도서명 |
| `nickname` | 리뷰 작성자 닉네임 |
| `content` | 리뷰 내용 |
| `likes` | 리뷰 좋아요 수 |
| `createdAt` | 리뷰 등록 시간 |
| `updatedAt` | 리뷰 수정 시간 |

---

## API 명세

json-server를 통해 아래 API를 사용합니다.

### 도서 API

| 기능 | Method | URL |
|---|---|---|
| 도서 목록 조회 | GET | `/books` |
| 도서 상세 조회 | GET | `/books/:id` |
| 도서 등록 | POST | `/books` |
| 도서 수정 | PATCH | `/books/:id` |
| 도서 삭제 | DELETE | `/books/:id` |

### 리뷰 API

| 기능 | Method | URL |
|---|---|---|
| 리뷰 목록 조회 | GET | `/reviews` |
| 특정 도서 리뷰 조회 | GET | `/reviews?bookId=:bookId` |
| 리뷰 등록 | POST | `/reviews` |
| 리뷰 수정 | PATCH | `/reviews/:id` |
| 리뷰 삭제 | DELETE | `/reviews/:id` |

---

## 라우팅 구조

| 페이지 | 경로 | 설명 |
|---|---|---|
| 홈 | `/` | 인기 도서와 인기 리뷰를 보여주는 페이지 |
| 도서 목록 | `/list` | 전체 도서 목록을 보여주는 페이지 |
| 새 도서 등록 | `/create` | 새 도서를 등록하는 페이지 |
| 책 자세히 보기 | `/detail/:id` | 특정 도서의 상세 정보와 리뷰를 보여주는 페이지 |

---

## 폴더 구조

```txt
aivle_miniproject
├─ public
├─ src
│  ├─ components
│  │  ├─ BookHomeItem.jsx
│  │  ├─ BookHomeList.jsx
│  │  ├─ Create.jsx
│  │  ├─ BookReportDetailList.jsx
│  │  ├─ BookReportDetailItem.jsx
│  │  ├─ BookReportHomeItem.jsx
│  │  ├─ BookReportHomeList.jsx
│  │  ├─ api.js
│  │  └─ utils.js
│  │
│  ├─ pages
│  │  ├─ HomePage.jsx
│  │  ├─ ListPage.jsx
│  │  ├─ CreatePage.jsx
│  │  └─ DetailPage.jsx
│  │
│  ├─ App.jsx
│  ├─ App.css
│  ├─ main.jsx
│  └─ index.css
│
├─ db.json
├─ index.html
├─ package.json
└─ README.md
```


---

## OpenAI 표지 생성 기능

새 도서 등록 페이지에서 사용자가 입력한 도서 제목과 책 내용을 바탕으로 OpenAI 이미지 생성 API를 호출합니다.

### 동작 흐름

1. 사용자가 도서명, 작가, 태그, 책 내용을 입력합니다.
2. OpenAI API Key를 입력합니다.
3. 생성 모델과 품질을 선택합니다.
4. 표지 생성 버튼을 클릭합니다.
5. 입력된 도서 정보를 기반으로 이미지 생성 요청을 보냅니다.
6. 생성된 이미지 URL 또는 Base64 이미지를 `coverImageUrl`에 저장합니다.
7. 등록된 도서는 목록 페이지와 상세 페이지에서 확인할 수 있습니다.

### API Key 관련 주의사항

OpenAI API Key는 코드나 `db.json`에 저장하지 않습니다.  
보안을 위해 사용자가 화면에서 직접 입력하도록 구현했습니다.

---

## 주요 화면 (이미지 추가 필요 - screenshots 폴더 생성 후 png 파일 삽입, 파일명으로 수정)


### 홈 화면

![홈 화면](./screenshots/home.png)

### 도서 목록 화면

![도서 목록 화면](./screenshots/list.png)

### 새 도서 등록 화면

![새 도서 등록 화면](./screenshots/create.png)

### 책 상세 화면

![책 상세 화면](./screenshots/detail.png)

---

## 프로젝트 사용 흐름

1. 홈 페이지에서 인기 도서와 인기 리뷰를 확인합니다.
2. 도서 목록 페이지에서 전체 도서를 확인합니다.
3. 자세히 보기 버튼을 눌러 책 상세 페이지로 이동합니다.
4. 책 상세 페이지에서 좋아요를 누르거나 리뷰를 작성합니다.
5. 새 도서 등록 페이지에서 도서 정보를 입력합니다.
6. OpenAI API Key를 입력한 뒤 AI 표지를 생성합니다.
7. 도서를 등록하면 `db.json`에 저장됩니다.

---

## 프로젝트 목표

이 프로젝트의 목표는 React의 컴포넌트 구조, 상태 관리, REST API 통신, json-server 기반 데이터 관리, OpenAI API 활용을 실습하는 것입니다.

단순한 도서 CRUD 기능에서 나아가, AI 표지 생성과 리뷰 게시판 기능을 결합하여 사용자가 직접 도서를 등록하고 관리할 수 있는 웹 서비스를 구현했습니다.
