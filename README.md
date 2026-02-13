# SIMVEX
**제4회 2026 블레이버스 MVP 개발 해커톤**을 진행하며 제작된 서비스입니다.<br/>
> 차세대 공학자들의 기계 학습의 어려움을 해결하는 **3D 물리 시뮬레이션 기반 학습 웹 서비스** <br/>

<img width="521" height="176" alt="스크린샷 2026-02-10 오후 8 04 04" src="https://github.com/user-attachments/assets/0791484d-e8c5-4ef7-a6a5-484ac7e5fb27" />


2D 도면/이론 중심 학습에서 발생하는 **구조 이해의 한계**를, 3D 인터랙션(탐색·분해/조립·시뮬레이션)과 **RAG 기반 AI 어시스턴트**, **메모/퀴즈/워크플로우/PDF 내보내기**로 연결해  **이해 → 정리 → 활용**의 학습 흐름을 끊기지 않게 지원합니다.
## 배포 주소
- [https://balybus-runtime-front.vercel.app/](https://blaybus-runtime-front.vercel.app/)



## 핵심 기능 (Key Features)
- **3D 뷰 상태 관리**: 위치·확대/축소·각도 등 탐색 상태를 제어
- **렌더링 품질 설정**: 광원·셰이더·텍스처 등으로 디테일 확인
- **오브젝트 분해/조립 인터랙션**: 부품 간 연결 구조를 단계적으로 학습
- **RAG 기반 AI 부품 설명/질의응답**: 부품 정보 + 이론 설명을 맥락 기반으로 제공
- **학습 메모(모델별 관리)**: 수정/삭제 가능한 개인 학습 노트
- **랜덤 퀴즈 + 채점**: 학습 이해도 점검
- **학습 결과 PDF 저장/내보내기**: 이미지·메모·AI 답변 기록을 복습 자료로 저장
- **워크플로우 기반 복습**: 학습 흐름을 단계적으로 정리하고 반복 학습


## 사용자 워크플로우 (MVP User Flow)
<img width="1536" height="865" alt="스크린샷 2026-02-13 오후 8 14 17" src="https://github.com/user-attachments/assets/1ee83266-7a5e-45e4-950f-993d0a1bf4ce" />

**기기 선택 → 3D 구조 탐색 → 분해/조립·시뮬레이션 → 메모·AI Assistant → 복습 퀴즈 → PDF 저장/복습**
<br />


## 기술 스택 (Tech Stack)
<img width="1551" height="868" alt="스크린샷 2026-02-13 오후 8 14 28" src="https://github.com/user-attachments/assets/23e733c3-9259-4189-a347-4a2a1193d191" />


## 🖥️ 뷰 및 기능 설명

---

### 1️⃣ 인증 & 초기 진입

<table width="100%">
  <thead>
    <tr>
      <th width="20%">화면</th>
      <th width="40%">스크린샷</th>
      <th width="40%">설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>랜딩페이지</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/f2dc22aa-dd8d-4bae-a130-32d97942eb11" width="500"/>
      </td>
      <td>
        - 서비스에 처음 진입하면 SIMVEX의 주요 기능에 대한 설명을 확인할 수 있습니다.<br/>
        - 로그인/회원가입 후 최초 가입 시 프로필 설정이 필요합니다.
      </td>
    </tr>
    <tr>
      <td>로그인 / 회원가입</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/7e04f477-e6d4-4b29-a1ed-d6140f9a08cd" width="500"/>
      </td>
      <td>
        - 자체 로그인 및 회원가입 서비스를 제공합니다.
      </td>
    </tr>
    <tr>
      <td>프로필 설정 모달</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/a57d3c21-34ad-46e0-9e41-2739f74225d7" width="500"/>
      </td>
      <td>
        - 로그인 완료 후 프로필 입력 모달이 표시됩니다.<br/>
        - 해당 모달을 입력해야 정상적으로 서비스를 이용할 수 있습니다.
      </td>
    </tr>
  </tbody>
</table>

---

### 2️⃣ 홈 & 학습 시작

<table width="100%">
  <thead>
    <tr>
      <th width="20%">화면</th>
      <th width="40%">스크린샷</th>
      <th width="40%">설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>홈 페이지</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/080bb15a-05f2-4fca-9e4e-5dd9b5b1812e" width="500"/>
      </td>
      <td>
        - 이전 학습 내역을 확인할 수 있습니다.<br/>
        - 새로운 학습을 생성할 수 있습니다.<br/>
        - 원하는 기계/장비 선택 후 바로 학습 시작이 가능합니다.
      </td>
    </tr>
  </tbody>
</table>

---

### 3️⃣ 3D 학습 기능 (학습 페이지)

<table width="100%">
  <thead>
    <tr>
      <th width="20%">화면</th>
      <th width="40%">스크린샷</th>
      <th width="40%">설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>단일 부품 학습</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/b0428d77-2977-4ca0-935e-ee8178e63c8d" width="500"/>
      </td>
      <td>
        - 각 단일 부품의 설명 및 위치를 제공합니다.<br/>
        - 쉐이더 슬라이더를 통해 실시간 설정 변화를 확인할 수 있습니다.
      </td>
    </tr>
    <tr>
      <td>조립도 / 분해도</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/162e3097-8098-4e55-8243-d79318b81e10" width="500"/>
      </td>
      <td>
        - 부품 구조와 역할을 이해할 수 있습니다.<br/>
        - 실제 분해·조립 과정을 통해 작동 원리를 학습합니다.
      </td>
    </tr>
    <tr>
      <td>시뮬레이터</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/f1b7df74-0807-428d-8f2e-61ba0825842f" width="500"/>
      </td>
      <td>
        - 조립부터 분해까지의 과정을 시뮬레이션 영상으로 제공합니다.
      </td>
    </tr>
    <tr>
      <td>추가 학습 기기</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/89052655-02ea-4aae-af2f-30042a10da35" width="500"/>
      </td>
      <td>
        - Leaf Spring, Machine Vice, Robot Gripper, Drone, V4 Engine, Robot Arm 학습을 제공합니다.
      </td>
    </tr>
  </tbody>
</table>

---

### 4️⃣ 학습 보조 & 관리 기능

<table width="100%">
  <thead>
    <tr>
      <th width="20%">화면</th>
      <th width="40%">스크린샷</th>
      <th width="40%">설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>AI Assistant(학습페이지)</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/2b1ee395-a707-4e88-9e36-51645f251eb2" width="500"/>
      </td>
      <td>
        - 대화형 AI를 통해 실시간 질의응답을 제공합니다.
      </td>
    </tr>
    <tr>
      <td>메모 기능(학습페이지)</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/c0c8ef6c-fe70-45f2-8142-a00636468e98" width="500"/>
      </td>
      <td>
        - 부품별로 분리된 학습 메모를 제공합니다.<br/>
        - 메모 생성/수정/삭제가 가능합니다.
      </td>
    </tr>
    <tr>
      <td>Quiz(학습페이지)</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/499d7f10-28bf-48c2-9334-6c053b278640" width="500"/>
      </td>
      <td>
        - 20개 문제 중 5개를 랜덤 출제합니다.<br/>
        - 학습 중인 부품 관련 문제로 이해도를 향상시킵니다.
      </td>
    </tr>
    <tr>
      <td>PDF 저장(학습페이지)</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/9cac6aeb-a360-455d-8302-e6233e5531e2" width="500"/>
      </td>
      <td>
        - 조립도, 메모, AI 채팅 기록을 PDF로 저장합니다.
      </td>
    </tr>
    <tr>
      <td>워크플로우 페이지</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/45ce7ca7-a971-4f0a-a9da-fbea54aa7ce3" width="500"/>
      </td>
      <td>
        - 학습 흐름을 단계별로 정리하고 반복 학습이 가능합니다.<br/>
        - 노드 생성 및 연결 기능을 제공합니다.
      </td>
    </tr>
    <tr>
      <td>설정 페이지</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/13b60fd4-a785-4962-b9e9-017e0ce93303" width="500"/>
      </td>
      <td>
        - 비밀번호 변경, 로그아웃, 회원 탈퇴 기능을 제공합니다.
      </td>
    </tr>
    <tr>
      <td>마이 페이지</td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/cb0b76a8-8875-460b-93ca-99d0144cbe80" width="500"/>
      </td>
      <td>
        - 프로필 수정 기능을 제공합니다.<br/>
        - 개인 메모를 모아서 확인할 수 있습니다.
      </td>
    </tr>
  </tbody>
</table>
