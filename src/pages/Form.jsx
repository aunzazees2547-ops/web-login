import { useState } from 'react';
// useState = เก็บค่าตัวแปรที่เปลี่ยนได้ในฟอร์ม

import { useNavigate } from 'react-router-dom';
// useNavigate = ใช้เปลี่ยนหน้า


const API_URL = `${import.meta.env.VITE_API_URL}/api/auth/register`;
// ดึง URL จาก .env แล้วต่อท้าย /api/auth/register
// เช่น http://localhost:3001/api/auth/register


function Form() {

  // ─────────────────────────────────────────
  // 📦 STATE — ตัวแปรเก็บค่าในฟอร์ม
  // ─────────────────────────────────────────

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ค่าเริ่มต้นเป็นค่าว่าง รอผู้ใช้พิมพ์

  const [loading, setLoading] = useState(false);
  // false = ปกติ, true = กำลังส่งข้อมูล (ปุ่มจะ disabled)

  const navigate = useNavigate();


  // ─────────────────────────────────────────
  // 📤 handleSubmit — ส่งฟอร์มสมัครสมาชิก
  // ─────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    // หยุดไม่ให้หน้า refresh เมื่อกด submit

    if (!name || !email || !password) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
      // ถ้ากรอกไม่ครบ → หยุดทันที ไม่ส่ง API
    }

    setLoading(true);
    // เปิด loading → ปุ่มเปลี่ยนเป็น "กำลังสมัคร..."

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        // POST = ส่งข้อมูลไปสร้างบัญชีใหม่

        headers: { 'Content-Type': 'application/json' },
        // บอก server ว่าข้อมูลที่ส่งไปเป็น JSON

        body: JSON.stringify({ name, email, password }),
        // แปลง object → JSON string แล้วส่งไป
        // เช่น { name: "สมชาย", email: "a@a.com", password: "1234" }
      });

      const data = await response.json();
      // แปลง response จาก server เป็น object

      if (!response.ok) {
        alert(data.message || 'เกิดข้อผิดพลาด');
        return;
        // ถ้า server ส่ง error กลับมา เช่น "อีเมลนี้ถูกใช้แล้ว"
        // → แจ้งเตือนแล้วหยุด
      }

      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login');
      // สมัครสำเร็จ → พาไปหน้า login ทันที

    } catch (error) {
      console.error('Error:', error);
      alert('ไม่สามารถเชื่อมต่อ server ได้');
      // network error เช่น server ดับ → แจ้งเตือน

    } finally {
      setLoading(false);
      // ปิด loading ทุกกรณี ไม่ว่าสำเร็จหรือไม่
    }
  };


  // ─────────────────────────────────────────
  // 🖥️ UI — ฟอร์มสมัครสมาชิก
  // ─────────────────────────────────────────

  return (
    <div className="App">
      <h1>สมัครสมาชิก</h1>
      <form onSubmit={handleSubmit}>
      {/* กด submit → เรียก handleSubmit */}

        <div>
          <label>ชื่อ:</label>
          <input
            type="text"
            value={name}
            // ค่าใน input ผูกกับ state name
            onChange={(e) => setName(e.target.value)}
            // พิมพ์อะไร → อัปเดต state ทันที
            placeholder="กรอกชื่อ"
          />
        </div>

        <div>
          <label>อีเมล:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          {/* loading = true  → แสดง "กำลังสมัคร..." + กดไม่ได้ */}
          {/* loading = false → แสดง "สมัครสมาชิก" ปกติ          */}
        </button>

        <p>
          มีบัญชีแล้ว?{' '}
          {/* {' '} = เว้นวรรคระหว่างข้อความกับปุ่ม */}
          <button type="button" onClick={() => navigate('/login')}>
            เข้าสู่ระบบ
            {/* type="button" = ไม่ให้ trigger onSubmit ของฟอร์ม */}
          </button>
        </p>

      </form>
    </div>
  );
}

export default Form;