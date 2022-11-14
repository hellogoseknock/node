# node ToDo
![soap](https://user-images.githubusercontent.com/61546237/201559095-38554040-2677-4218-b052-d69dd90efb16.jpg)

0. 미리 git이 설치 되어 있어야 함 https://git-scm.com/download/win
1. 어떤 경로에서도 git 명령어가 인식되어야함 ( https://youtu.be/ILMQLrJfNCE 참고 ) 
    -  안된다면 환경변수 확인및 수동 등록 필요
2. 미리 node.js 가 설치 되어 있어야 함 https://nodejs.org/en/
4. 적당한 작업 폴더로 이동후 탐색기 주소창 폴더 아이콘 클릭하고 cmd 입력
![Cap 2022-11-14 10-36-18-922](https://user-images.githubusercontent.com/61546237/201557835-ecf2a31e-fb7b-449d-a4b2-0e662d89663f.png)
![Cap 2022-11-14 10-36-28-587](https://user-images.githubusercontent.com/61546237/201557878-c597e147-4923-49fe-bad2-11b4439bf5ca.png)
![Cap 2022-11-14 10-36-35-702](https://user-images.githubusercontent.com/61546237/201557882-a0cd73e6-891c-4cc8-afa0-c9f08ea469fe.png)

5. cmd 창에서 "git clone https://github.com/hellogoseknock/node.git" 붙여놓고 실행
![Cap 2022-11-14 10-36-57-641](https://user-images.githubusercontent.com/61546237/201557909-c37fe7b2-ef66-48ac-ab91-147bc14a5014.png)

6. cd node 로 새로 생성된 폴더로 들어간 후
7. cmd 창에서 "npm install --save-dev" (해당 폴더에 존재하는 package.json 을 참고해서 필요한 모듈 자동 설치)
![Cap 2022-11-14 10-37-55-586](https://user-images.githubusercontent.com/61546237/201557932-1774abcc-9877-4ec3-878e-34016cc473c5.png)

8. nodemon index.js 실행 (vsc 터미널에서 작업시 프로젝트 경로 확인)
![Cap 2022-11-14 10-38-29-528](https://user-images.githubusercontent.com/61546237/201557944-1c2345c1-3ffa-48fc-9780-5f4c391afd38.png)

9. 웹브라우져에서 http://localhost:7070/ 접속해서 할일목록 과 추가 기능 확인가능  
![Cap 2022-11-14 10-39-13-308](https://user-images.githubusercontent.com/61546237/201557949-c21f62a3-a719-40c9-97e0-b8525a427e24.png)


