# 스토어 연계 - backend

## Setting

### Install

- node [download](https://nodejs.org/ko/download/)
- npm [download](https://nodejs.org/ko/download/)
- docker [download](https://www.docker.com/products/docker-desktop)

### 환경 변수 설정

프로젝트 루트 디렉토리에서
/env/.env.dev 파일 생성

- notion [backend env](https://www.notion.so/acrossb/backend-env-7b8277f290644a5eb6216394c82a4c7d) 페이지의 내용 복붙

## 실행

### Node

```
npm run dev
```

### Docker

- 이미지 빌드

  ```
  npm run docker-build:dev
  ```

- 컨테이너 실행

  ```
  npm run docker-start:dev
  ```

## API docs

- [link](https://www.notion.so/acrossb/API-8a46d769932e47518f7d87058c9ec392)
