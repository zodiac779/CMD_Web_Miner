
---

### ✅ **ไฟล์ `README.md`**
```md
# 🚀 DeFi Mining App

🔗 **DeFi Mining App** เป็น Web3 DApp ที่ช่วยให้คุณสามารถขุด NFT ได้โดยใช้ Proof of Work (PoW) บน Blockchain ที่รองรับ smart contract เช่น Ethereum หรือ JBC Chain

## 🌟 **Features**
- ✅ **Connect Wallet** รองรับ MetaMask และ WalletConnect
- ⛏️ **Mining System** ใช้ Web Worker ในการขุดโดยรองรับ Multi-threading
- 🔄 **Auto Update** ค่าบล็อกและความยากจาก Smart Contract
- 🔥 **Real-time Hash Rate** แสดงผลอัตราการขุดแบบเรียลไทม์
- 🛠️ **Web3 Integration** ใช้งานร่วมกับ `wagmi`, `viem`, และ `chakra-ui`

---

## 📥 **การติดตั้ง & เริ่มต้นใช้งาน**
### 🔹 **1️⃣ ติดตั้ง Dependencies**
```sh
git clone https://github.com/USERNAME/DeFi-Mining-App.git
cd DeFi-Mining-App
npm install
```

### 🔹 **2️⃣ ตั้งค่าไฟล์ `.env`** (ถ้ามีการตั้งค่า RPC หรือ WalletConnect Project ID)
สร้างไฟล์ `.env` และเพิ่มข้อมูลที่จำเป็น:
```env
VITE_RPC_URL=https://your-rpc-url
VITE_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
```

### 🔹 **3️⃣ เริ่มต้นรันโปรเจค**
```sh
npm run dev
```
จากนั้นเปิด **http://localhost:5173/** เพื่อเริ่มต้นใช้งาน

---

## 🔧 **การใช้งาน**
### 1️⃣ **เชื่อมต่อ Wallet**
- คลิก **"Connect with MetaMask"** หรือ **"Connect with WalletConnect"** เพื่อเชื่อมต่อกับกระเป๋าเงิน

### 2️⃣ **ใส่ข้อมูล NFT ที่ต้องการขุด**
- **NFT Index:** หมายเลข Index ของ NFT ที่ใช้ขุด  
- **NFT ID:** หมายเลข ID ของ NFT  
- **Threads:** จำนวน Thread ที่ใช้ขุด (มากขึ้น = เร็วขึ้น แต่กิน CPU มากขึ้น)

### 3️⃣ **เริ่มขุด**
- กดปุ่ม **"⛏️ Start Mining"** ระบบจะเริ่มขุดและแสดงค่า **Hash Rate** และ **Logs**
- เมื่อขุดสำเร็จ ระบบจะส่งข้อมูลไปที่ Smart Contract อัตโนมัติ  

### 4️⃣ **หยุดขุด**
- กดปุ่ม **"🛑 Stop Mining"** เพื่อหยุดกระบวนการขุด

---

## 🏗 **โครงสร้างโปรเจค**
```sh
DeFi-Mining-App/
│── src/
│   ├── App.jsx          # ไฟล์หลักของ DApp
│   ├── worker.js        # Web Worker สำหรับการขุด
│   ├── abi.json         # Smart Contract ABI
│   ├── main.jsx         # ไฟล์ Entry ของโปรเจค
│   ├── styles.css       # ไฟล์ CSS (ใช้ Tailwind/Chakra UI)
│── public/
│   ├── index.html
│── package.json
│── README.md
│── .gitignore
```

---

## 🛠 **Technologies Used**
- **React + Vite** 🚀 (Frontend Framework)
- **wagmi + viem** 🔗 (Web3 Connection)
- **Chakra UI** 🎨 (UI Library)
- **Web Worker** ⚡ (Parallel Mining)

---

## 📜 **License**
MIT License - สามารถใช้ได้ฟรีและแก้ไขโค้ดได้ตามต้องการ 🚀