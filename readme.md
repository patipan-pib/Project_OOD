# project_ood

โปรเจ็กต์นี้ประกอบด้วยส่วน **Frontend** ที่ใช้ **React**, ส่วน **Backend** ที่ใช้ **Node.js**, และ **บอท** สำหรับทดสอบการเพิ่มและลบข้อมูลใน Backend นอกจากนี้ยังมีการรองรับ **Docker** เพื่อให้ง่ายต่อการตั้งค่าและการรันโปรเจ็กต์ในสภาพแวดล้อมคอนเทนเนอร์

## ตารางเนื้อหา

- [ข้อกำหนดเบื้องต้น](#ข้อกำหนดเบื้องต้น)
- [การติดตั้ง](#การติดตั้ง)
- [การรันโปรเจ็กต์ด้วย npm](#การรันโปรเจ็กต์ด้วย-npm)
  - [รัน Frontend](#รัน-frontend)
  - [รัน Backend](#รัน-backend)
- [การรันโปรเจ็กต์ด้วย Docker](#การรันโปรเจ็กต์ด้วย-docker)
  - [การใช้ Docker Compose](#การใช้-docker-compose)
  - [การรัน Frontend และ Backend แยกกัน](#การรัน-frontend-และ-backend-แยกกัน)
- [การใช้งานบอทสำหรับทดสอบ](#การใช้งานบอทสำหรับทดสอบ)
  - [เพิ่มข้อมูล](#เพิ่มข้อมูล)
  - [ลบข้อมูล](#ลบข้อมูล)
- [โครงสร้างโฟลเดอร์](#โครงสร้างโฟลเดอร์)


## ข้อกำหนดเบื้องต้น

ก่อนเริ่มต้น โปรดตรวจสอบว่าคุณได้ติดตั้งสิ่งต่อไปนี้บนเครื่องของคุณแล้ว:

- **Node.js**: ดาวน์โหลดและติดตั้ง Node.js ได้ที่ [https://nodejs.org/](https://nodejs.org/) ซึ่งจะติดตั้ง `npm` (Node Package Manager) ด้วย
- **Git**: สำหรับการโคลน repository สามารถดาวน์โหลดได้ที่ [https://git-scm.com/](https://git-scm.com/)
- **Docker**: ดาวน์โหลดและติดตั้ง Docker ได้ที่ [https://www.docker.com/get-started](https://www.docker.com/get-started)

## การติดตั้ง

ทำตามขั้นตอนด้านล่างเพื่อเตรียมโปรเจ็กต์ให้พร้อมใช้งาน:

### 1. โคลน Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
```
### 2.ติดตั้ง Dependencies สำหรับ Frontend

```bash
cd project_ood/frontend
npm install
```
### 3. ติดตั้ง Dependencies สำหรับ Backend

```bash
cd project_ood/backend
npm install
```
### การรัน Frontend
เพื่อเริ่มต้นรันแอป React Frontend:

### 1.เข้าไปยังโฟลเดอร์ Frontend:

```bash
cd project_ood/frontend
```
### 2.รันคำสั่ง:
```bash
npm start
```

แอปจะรันที่ http://localhost:3000 โดยอัตโนมัติ คุณสามารถเปิด URL นี้ในเว็บเบราว์เซอร์เพื่อดูและใช้งานแอป

### การรัน Backend

### 1.เข้าไปยังโฟลเดอร์ Backend:

```bash
cd project_ood/backend
```
### 2.รันคำสั่ง:
```bash
npm run dev
```
เซิร์ฟเวอร์จะรันที่ http://localhost:3001

### การใช้งานบอทสำหรับทดสอบ
บอทในโปรเจ็กต์นี้ใช้สำหรับทดสอบการเพิ่มและลบข้อมูลใน Backend คุณสามารถใช้งานได้ดังนี้:

### เพิ่มข้อมูล
```bash
cd project_ood/backend/bot
node addItem.js
```
สคริปต์นี้จะทำการเพิ่มข้อมูลตัวอย่างลงในฐานข้อมูลของ Backend
### ลบข้อมูล

```bash
cd project_ood/backend/bot
node deleteItem.js
```
สคริปต์นี้จะทำการลบข้อมูลที่ต้องการออกจากฐานข้อมูลของ Backend

### การรันโปรเจ็กต์ด้วย Docker
การใช้ Docker ช่วยให้การตั้งค่าและการรันโปรเจ็กต์ง่ายและรวดเร็วมากขึ้น โดยไม่ต้องกังวลเกี่ยวกับการติดตั้ง dependencies บนเครื่องของคุณ

1. การใช้ Docker Compose
Docker Compose ช่วยให้คุณสามารถรันทั้ง Frontend และ Backend พร้อมกันได้ในคอนเทนเนอร์แยกต่างหาก

ตรวจสอบให้แน่ใจว่ามีไฟล์ docker-compose.yml ในรากของโปรเจ็กต์ของคุณ ตัวอย่างของไฟล์ docker-compose.yml:

```bash
version: '3.8'

services:
  mysql:
    image: mysql:latest
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: my_database
      MYSQL_USER: user
      MYSQL_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    restart: always
    ports:
      - "8080:80"
    environment:
      PMA_HOST: mysql
      PMA_USER: user
      PMA_PASSWORD: root

volumes:  # This should not be indented
  mysql_data: {}
```

2. สร้างและรันคอนเทนเนอร์:
```bash
cd project_ood
docker-compose up --build
```
3. หากต้องการรันในโหมด background (detached):
```bash
docker-compose up --build -d

```
### โครงสร้างโฟลเดอร์
your-repo-name/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── backend/
│   ├── bot/
│   │   ├── addItem.js
│   │   ├── deleteItem.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── docker-compose.yml
├── .gitignore
└── README.md
