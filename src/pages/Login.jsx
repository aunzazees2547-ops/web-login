import { useState } from 'react';
// useState = เก็บค่าตัวแปรที่เปลี่ยนได้

import { useNavigate } from 'react-router-dom';
// useNavigate = ใช้เปลี่ยนหน้า

import { useAuth } from '../context/AuthContext';
// ดึง login function จาก Context
// login() = บันทึกข้อมูล user + token ลง Context และ localStorage


function Login() {

  const { login } = useAuth();
  // login = ฟังก์ชันที่จะเรียกหลัง server ยืนยันตัวตนสำเร็จ

  const navigate = useNavigate();


  // ─────────────────────────────────────────
  // 📦 STATE — ตัวแปรเก็บค่าในฟอร์ม
  // ─────────────────────────────────────────

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ค่าเริ่มต้นเป็นค่าว่าง รอผู้ใช้พิมพ์

  const [loading, setLoading] = useState(false);
  // false = ปกติ, true = กำลังรอ server ตอบ


  // ─────────────────────────────────────────
  // 🔑 handleSubmit — ส่งฟอร์ม login
  // ─────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    // หยุดไม่ให้หน้า refresh เมื่อกด submit

    if (!email || !password) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
      // กรอกไม่ครบ → หยุดทันที ไม่ส่ง API
    }

    setLoading(true);
    // เปิด loading → ปุ่มเปลี่ยนเป็น "กำลังเข้าสู่ระบบ..."

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        // เรียก POST /api/auth/login

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // บอก server ว่าข้อมูลที่ส่งไปเป็น JSON

        body: JSON.stringify({ email, password }),
        // แปลง object → JSON string แล้วส่งไป
      });

      const data = await response.json();
      // แปลง response จาก server เป็น object
      // data จะมี → { message, token, user }

      if (!response.ok) {
        alert(data.message || 'เกิดข้อผิดพลาด');
        return;
        // server ส่ง error กลับมา เช่น "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
        // → แจ้งเตือนแล้วหยุด
      }

      login(data.user, data.token);
      // ส่ง user และ token ให้ Context เก็บไว้
      // Context จะเก็บลง localStorage ด้วย → refresh แล้วยังอยู่

      navigate('/');
      // login สำเร็จ → พาไปหน้าแรกทันที

    } catch {
      alert('เชื่อมต่อ server ไม่ได้');
      // network error เช่น server ดับ → แจ้งเตือน

    } finally {
      setLoading(false);
      // ปิด loading ทุกกรณี ไม่ว่าสำเร็จหรือไม่
    }
  };


  // ─────────────────────────────────────────
  // 🖥️ UI — ฟอร์ม login
  // ─────────────────────────────────────────

  return (
    <div className="App">
      <h1>เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit}>
      {/* กด submit → เรียก handleSubmit */}

        <div>
          <label>อีเมล:</label>
          <input
            type="email"
            value={email}
            // ค่าใน input ผูกกับ state email
            onChange={(e) => setEmail(e.target.value)}
            // พิมพ์อะไร → อัปเดต state ทันที
            placeholder="กรอกอีเมล"
          />
        </div>

        <div>
          <label>รหัสผ่าน:</label>
          <input
            type="password"
            // type="password" → ซ่อนตัวอักษรเป็น ●●●●
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          {/* loading = true  → แสดง "กำลังเข้าสู่ระบบ..." + กดไม่ได้ */}
          {/* loading = false → แสดง "เข้าสู่ระบบ" ปกติ               */}
        </button>

      </form>

      <p>
        ยังไม่มีบัญชี?{' '}
        {/* {' '} = เว้นวรรคระหว่างข้อความกับปุ่ม */}
        <button onClick={() => navigate('/form')}>
          สมัครสมาชิก
          {/* กดแล้วไปหน้า /form (หน้าสมัครสมาชิก) */}
        </button>
      </p>

    </div>
  );
}

export default Login;