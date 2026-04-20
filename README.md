# YouthApp (แอปสำหรับติดตามสุขภาพเด็ก)

โครงการ **YouthApp** เป็นเว็บแอปพลิเคชันที่ออกแบบมาเพื่อช่วยครู ผู้ปกครอง และโรงเรียนในการติดตามข้อมูลสุขภาพเด็ก (น้ำหนัก ส่วนสูง การประเมินความเสี่ยง และผลการวัดต่าง ๆ) โดยมีฟีเจอร์หลักดังนี้:

## ✨ ฟีเจอร์หลัก
- บันทึกและดูประวัติการเจริญเติบโต (น้ำหนัก ส่วนสูง)
- คำนวณและแสดงกราฟสถานะโภชนาการ (BMI, HFA, WFA, WFH)
- ระบบค้นหา และดูข้อมูลนักเรียน
- ฟอร์มประเมิน และบันทึกผลการประเมิน
- ดาวน์โหลดข้อมูลเป็นไฟล์ Excel
- ใช้งานร่วมกับ LINE LIFF 

## 🛠️ สภาพแวดล้อมและเทคโนโลยี
- React + TypeScript
- Vite (สำหรับการพัฒนาแบบ fast refresh)
- Tailwind CSS และ Material UI
- React Router สำหรับการนำทาง
- React Query สำหรับจัดการสถานะข้อมูล
- Axios สำหรับเรียก API

## ⚙️ การตั้งค่าสภาพแวดล้อม (Environment Variables)
ก่อนเริ่มต้นใช้งาน คุณต้องสร้างไฟล์ `.env` ที่ root directory ของโปรเจกต์ และกำหนดค่าดังนี้:

```env
VITE_API_BASE=http://your-api-url/childhood/
VITE_IMAGE_BASE_URL=http://your-api-url/
VITE_LIFF_ID=your-liff-id
VITE_APP_ENV=develop
```

### รายละเอียดตัวแปร:
| ตัวแปร | คำอธิบาย | แหล่งที่มา |
| :--- | :--- | :--- |
| **`VITE_API_BASE`** | URL พื้นฐานของ Backend API | ได้จากเครื่องเซิร์ฟเวอร์ที่รัน Backend (เช่น `http://localhost:8099/childhood/`) |
| **`VITE_IMAGE_BASE_URL`** | URL พื้นฐานสำหรับดึงรูปภาพ | ส่วนใหญ่จะเป็น root ของ Backend server (เช่น `http://localhost:8099/`) |
| **`VITE_LIFF_ID`** | รหัส LIFF ID สำหรับใช้งานผ่าน LINE | ได้จาก [LINE Developers Console](https://developers.line.biz/) ในส่วนของ LIFF App |
| **`VITE_APP_ENV`** | โหมดการทำงานของแอปพลิเคชัน | กำหนดเป็น `develop` สำหรับเครื่อง Developer (จะแสดงเมนู Debug) หรือ `production` |

## 🚀 วิธีเริ่มต้นใช้งาน (Local)
1. ติดตั้ง dependencies

   ```bash
   yarn install
   ```

2. รันเซิร์ฟเวอร์พัฒนา

   ```bash
   yarn dev
   ```

3. เปิดเว็บเบราว์เซอร์ และไปที่ `http://localhost:5173`

## ✅ คำสั่งสำคัญ
- `yarn dev` – รันโหมดพัฒนา
- `yarn build` – สร้างไฟล์สำหรับ production
- `yarn preview` – ทดสอบ build ที่สร้างขึ้น
- `yarn lint` – ตรวจสอบโค้ดตามมาตรฐาน ESLint

## 🧩 โครงสร้างโปรเจกต์ (ย่อ)
- `src/` – โค้ดหลักของแอป
- `src/components/` – คอมโพเนนต์ที่ใช้งานซ้ำได้
- `src/pages/` – หน้าต่าง ๆ ของแอป
- `src/hooks/` – Custom hooks สำหรับจัดการข้อมูลและ logic
- `src/utils/` – ฟังก์ชันช่วยเหลือทั่วไป
- `src/data/` – ข้อมูลกลาง (เช่น ตารางเตรียมข้อมูลการเจริญเติบโต)




