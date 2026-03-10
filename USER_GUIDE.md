# 📝 TODO 앱 사용자 가이드

> React + Firebase + Vercel/Netlify로 만드는 나만의 할 일 관리 앱

---

## 목차

1. [앱 소개](#1-앱-소개)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [초기 설정](#4-초기-설정)
5. [Firebase 설정](#5-firebase-설정)
6. [로컬 개발](#6-로컬-개발)
7. [배포](#7-배포)
8. [앱 사용법](#8-앱-사용법)
9. [개발 루틴](#9-개발-루틴)
10. [문제 해결](#10-문제-해결)

---

## 1. 앱 소개

Google 계정으로 로그인하면 어디서든 할 일을 관리할 수 있는 웹 앱입니다.

### 주요 기능

| 기능 | 설명 |
|------|------|
| Google 로그인 | 계정별 독립 데이터 관리 |
| 할 일 추가/삭제 | 실시간 Firestore 저장 |
| 상태 3분할 | 👀 할일 → 😊 해결 → 😑 중단 |
| 자동 로그인 | 새로고침 후에도 로그인 유지 |
| 자동 배포 | git push 하면 자동으로 배포 |

### 배포 주소

- **Vercel**: https://todoapp2-gilt.vercel.app
- **Netlify**: https://todoapp000001.netlify.app

---

## 2. 기술 스택

| 역할 | 도구 |
|------|------|
| UI 프레임워크 | React 19 + Vite |
| 인증 | Firebase Authentication (Google) |
| 데이터베이스 | Firestore (실시간 동기화) |
| 테스트 | Vitest + Testing Library |
| CI | GitHub Actions |
| 배포 | Vercel + Netlify (자동 배포) |

---

## 3. 프로젝트 구조

```
todo-app/
├── src/
│   ├── firebase.js              # Firebase 초기화 (환경변수 사용)
│   ├── App.jsx                  # 인증 상태에 따라 화면 전환
│   ├── hooks/
│   │   ├── useAuth.js           # Google 로그인/로그아웃/자동로그인
│   │   └── useTodos.js          # Firestore CRUD (추가/삭제/상태변경)
│   ├── components/
│   │   ├── Login.jsx            # Google 로그인 버튼 화면
│   │   └── TodoApp.jsx          # Todo 메인 화면
│   └── __tests__/
│       └── App.test.jsx         # Vitest 단위 테스트
├── .github/workflows/
│   └── ci.yml                   # GitHub Actions (push 시 자동 테스트)
├── .env.local                   # Firebase 키 (git 제외 — 절대 커밋 금지)
└── USER_GUIDE.md                # 이 파일
```

---

## 4. 초기 설정

### 사전 요구사항

- Node.js 설치 확인: `node -v`
- Git 설치 확인: `git --version`
- GitHub 계정

### 프로젝트 클론

```bash
git clone git@github.com:stargager01/todoapp.git
cd todoapp
npm install
```

### SSH 키 설정 (GitHub 인증)

```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your@email.com" -f ~/.ssh/id_ed25519 -N ""

# 공개키 확인 (GitHub에 등록할 값)
cat ~/.ssh/id_ed25519.pub
```

GitHub → Settings → SSH and GPG keys → **New SSH key** → 공개키 붙여넣기

```bash
# 연결 테스트
ssh -T git@github.com
# 결과: Hi username! You've successfully authenticated
```

---

## 5. Firebase 설정

### 5-1. Firebase 프로젝트 생성

1. [console.firebase.google.com](https://console.firebase.google.com) 접속
2. **프로젝트 추가** → 이름: `todo-app`
3. Google Analytics 설정 후 완료

### 5-2. Google 로그인 활성화

1. **Authentication** → **Sign-in method**
2. **Google** 클릭 → 사용 설정 → 저장

### 5-3. Authorized Domains 등록

**Authentication → Settings → Authorized domains**에 아래 도메인 추가:

```
localhost
todoapp2-gilt.vercel.app
todoapp000001.netlify.app
```

> ⚠️ `https://` 없이 도메인만 입력해야 합니다.

### 5-4. Firestore 데이터베이스 생성

1. **Firestore Database** → **데이터베이스 만들기**
2. 위치: `asia-northeast3` (서울) 권장
3. **프로덕션 모드**로 시작

### 5-5. Firestore 보안 규칙 설정

**Firestore → Rules 탭**에서 아래 내용으로 교체 후 **Publish**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

> 이 규칙은 만료 없이 로그인한 사용자가 자기 데이터만 접근할 수 있게 합니다.
> 테스트 모드는 30일 후 만료되므로 반드시 이 규칙을 사용하세요.

### 5-6. 웹 앱 등록 및 환경변수 확인

1. ⚙️ 프로젝트 설정 → **웹 앱 추가** (`</>`)
2. SDK 설정값 확인 후 `.env.local`에 저장

### 5-7. .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일 생성:

```bash
VITE_FIREBASE_API_KEY=여기에_값_입력
VITE_FIREBASE_AUTH_DOMAIN=여기에_값_입력
VITE_FIREBASE_PROJECT_ID=여기에_값_입력
VITE_FIREBASE_STORAGE_BUCKET=여기에_값_입력
VITE_FIREBASE_MESSAGING_SENDER_ID=여기에_값_입력
VITE_FIREBASE_APP_ID=여기에_값_입력
VITE_FIREBASE_MEASUREMENT_ID=여기에_값_입력
```

> ⚠️ `.env.local`은 절대 git에 커밋하지 마세요. `.gitignore`에 이미 등록되어 있습니다.

---

## 6. 로컬 개발

### 개발 서버 실행

```bash
npm run dev
# → http://localhost:5173 접속
```

### 테스트 실행

```bash
npm test
# 결과: 3 tests passed
```

### 빌드 확인

```bash
npm run build
# 결과: ✓ built in Xms
```

---

## 7. 배포

### 7-1. Vercel 환경변수 설정

1. [vercel.com](https://vercel.com) → 프로젝트 선택
2. **Settings → Environment Variables**
3. `.env.local`의 7개 변수 동일하게 입력
4. **Deployments → Redeploy**

### 7-2. Netlify 환경변수 설정

1. [netlify.com](https://netlify.com) → 프로젝트 선택
2. **Site configuration → Environment variables**
3. `.env.local`의 7개 변수 동일하게 입력
4. **Deploys → Trigger deploy → Deploy site**

### 7-3. GitHub Actions CI 확인

push 후 **github.com/stargager01/todoapp → Actions 탭**에서 초록 체크 확인

---

## 8. 앱 사용법

### 로그인

- 첫 화면에서 **Google로 로그인** 버튼 클릭
- Google 계정 선택 → 자동으로 할 일 화면으로 이동
- 다음 방문 시 자동 로그인 유지

### 할 일 관리

| 동작 | 방법 |
|------|------|
| 추가 | 입력창에 내용 입력 후 **추가** 버튼 또는 **Enter** |
| 상태 변경 | 이모지 클릭 (👀 → 😊 → 😑 → 👀 순환) |
| 삭제 | 🗑️ 버튼 클릭 |
| 로그아웃 | 우측 상단 **로그아웃** 버튼 |

### 상태 3분할

| 이모지 | 상태 | 의미 |
|--------|------|------|
| 👀 | 할일 | 노려보는 중 — 아직 해야 함 |
| 😊 | 해결 | 완료! |
| 😑 | 중단 | 중단 또는 실패 |

---

## 9. 개발 루틴

```bash
# 1. 코드 수정
# 2. 로컬 테스트
npm test

# 3. 커밋 & 푸시
git add .
git commit -m "feat: 기능 설명"
git push

# 자동 실행:
# → GitHub Actions: 테스트 자동 실행
# → Vercel: 자동 빌드 & 배포
# → Netlify: 자동 빌드 & 배포
```

---

## 10. 문제 해결

### 배포 사이트가 공백(빈 화면)으로 보일 때

Vercel/Netlify에 환경변수가 설정되지 않은 경우입니다.
→ **7. 배포** 섹션의 환경변수 설정 후 Redeploy

### Google 로그인 팝업이 뜨지 않을 때

Firebase Authorized domains에 도메인이 없는 경우입니다.
→ **5-3. Authorized Domains 등록** 확인
→ `https://` 없이 도메인만 입력했는지 확인

### localhost에서 로그인이 안 될 때

```
Firebase → Authentication → Settings → Authorized domains
→ localhost 추가
```

### SSH push 인증 오류

```bash
# HTTPS → SSH로 변경
git remote set-url origin git@github.com:stargager01/todoapp.git

# 연결 테스트
ssh -T git@github.com
```

### GitHub Actions 빨간 X가 뜰 때

```bash
# 로컬에서 테스트 먼저 확인
npm test

# 오류 수정 후
git add . && git commit -m "fix: 테스트 수정" && git push
```

---

## 참고

- Firebase 콘솔: https://console.firebase.google.com
- Vercel 대시보드: https://vercel.com/dashboard
- Netlify 대시보드: https://app.netlify.com
- GitHub 저장소: https://github.com/stargager01/todoapp
