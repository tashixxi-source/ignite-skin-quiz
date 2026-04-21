# IGNITE Skin Quiz — วิธี Deploy

## ไฟล์ในโฟลเดอร์นี้
```
skin-quiz/
├── public/
│   └── index.html     ← หน้าเว็บ quiz
├── server.js          ← backend (ซ่อน API key)
├── package.json       ← config
└── README.md          ← ไฟล์นี้
```

---

## วิธี Deploy บน Render.com (ฟรี แนะนำ)

### ขั้นตอนที่ 1 — สร้าง GitHub repo
1. ไปที่ [github.com](https://github.com) → สมัครถ้ายังไม่มี account
2. กด **New repository** → ตั้งชื่อ `ignite-skin-quiz`
3. กด **Create repository**
4. อัปโหลดไฟล์ทั้ง 3 ไฟล์ (`index.html` ต้องอยู่ใน folder `public/`)

### ขั้นตอนที่ 2 — สมัคร Render
1. ไปที่ [render.com](https://render.com) → Sign up ด้วย GitHub
2. กด **New +** → เลือก **Web Service**
3. เลือก repo `ignite-skin-quiz`
4. ตั้งค่าดังนี้:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. กด **Advanced** → กด **Add Environment Variable**
   - Key: `ANTHROPIC_API_KEY`
   - Value: API key ของคุณ (จาก console.anthropic.com)
6. กด **Create Web Service**
7. รอ ~2 นาที → ได้ลิงก์ `https://ignite-skin-quiz.onrender.com`

### ขั้นตอนที่ 3 — ขอ API Key
1. ไปที่ [console.anthropic.com](https://console.anthropic.com)
2. สมัครบัญชี (ฟรี มี free credit ให้ทดสอบ)
3. ไปที่ **API Keys** → **Create Key**
4. Copy key (ขึ้นต้นด้วย `sk-ant-...`)
5. เอาไปใส่ใน Render ตามขั้นตอนที่ 2

---

## หมายเหตุ
- Render free tier จะ "sleep" หลังไม่มีคนใช้ 15 นาที ครั้งแรกที่เปิดอาจช้า ~30 วินาที
- ถ้าต้องการให้เร็วตลอด สามารถ upgrade เป็น paid plan ($7/เดือน)
- API key ปลอดภัย — เก็บไว้ใน server ไม่มีใคร inspect เจอได้
