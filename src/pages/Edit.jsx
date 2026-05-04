import { useEffect, useState } from 'react';
// useEffect = ทำงานอัตโนมัติเมื่อ component โหลด
// useState  = เก็บค่าตัวแปรที่เปลี่ยนได้

import { useNavigate, useParams } from 'react-router-dom';
// useNavigate = เปลี่ยนหน้า
// useParams   = ดึงค่าจาก URL เช่น /edit/5 → id = 5


const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;
// ดึง URL จาก .env แล้วต่อท้ายด้วย /api/users
// เช่น http://localhost:3001/api/users


function Edit() {

  const { id } = useParams();
  // ดึง id จาก URL เช่น /edit/5 → id = "5"

  const navigate = useNavigate();
  // ใช้เปลี่ยนหน้าหลังบันทึกสำเร็จ


  // ─────────────────────────────────────────
  // 📦 STATE — ตัวแปรที่เก็บค่าในฟอร์ม
  // ─────────────────────────────────────────

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ค่าเริ่มต้นเป็นค่าว่าง รอโหลดข้อมูลจาก API

  const [loading, setLoading] = useState(false);
  // false = ปกติ, true = กำลังบันทึก (ปุ่มจะ disabled)


  // ─────────────────────────────────────────
  // 🔄 useEffect — โหลดข้อมูล user เมื่อเปิดหน้า
  // ─────────────────────────────────────────

  useEffect(() => {
  // ทำงานครั้งแรกที่ component โหลด

    const token = localStorage.getItem('token');
    // ดึง token ที่เก็บไว้ตอน login

    fetch(`${API_URL}/${id}`, {
    // เรียก GET /api/users/5 (ตาม id ใน URL)

      headers: {
        'Authorization': `Bearer ${token}`
        // แนบ token ไปด้วย → server จะเช็คว่ามีสิทธิ์ไหม
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        // ถ้า status ไม่ใช่ 200 →던 error ทันที
        return res.json();
        // แปลง response เป็น object
      })
      .then(data => {
        setName(data.name);
        setEmail(data.email);
        // นำข้อมูลที่ได้มาใส่ใน state → แสดงในฟอร์มอัตโนมัติ
      })
      .catch(() => {
        alert('โหลดข้อมูลไม่สำเร็จ');
        // ถ้าเกิด error → แจ้งเตือน
      });

  }, [id]);
  // [id] = ถ้า id เปลี่ยน → ทำงานใหม่อีกครั้ง


  // ─────────────────────────────────────────
  // 💾 handleSubmit — บันทึกการแก้ไข
  // ─────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    // หยุดไม่ให้หน้า refresh เมื่อกด submit

    if (!name || !email) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
      // ถ้าชื่อหรืออีเมลว่าง → หยุดทันที
    }

    const body = { name, email };
    // เตรียมข้อมูลที่จะส่งไป API

    if (password.trim() !== '') {
      body.password = password;
    }
    // ถ้ากรอกรหัสผ่านใหม่ → ใส่เพิ่มใน body
    // ถ้าไม่กรอก → ไม่ส่งไป (รหัสผ่านเดิมไม่เปลี่ยน)

    setLoading(true);
    // เปิด loading → ปุ่มจะเปลี่ยนเป็น "กำลังบันทึก..."

    try {
      const token = localStorage.getItem('token');
      // ดึง token อีกครั้งสำหรับ request นี้

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        // PUT = อัปเดตข้อมูลที่มีอยู่แล้ว
        headers: {
          'Content-Type': 'application/json',
          // บอก server ว่า body เป็น JSON
          'Authorization': `Bearer ${token}`
          // แนบ token เพื่อยืนยันสิทธิ์
        },
        body: JSON.stringify(body),
        // แปลง object → JSON string ก่อนส่ง
      });

      const data = await response.json();
      // แปลง response เป็น object

      if (!response.ok) {
        alert(data.message || 'เกิดข้อผิดพลาด');
        return;
        // ถ้า server ส่ง error กลับมา → แจ้งเตือน
      }

      alert('แก้ไขข้อมูลสำเร็จ');
      navigate('/');
      // สำเร็จ → พากลับหน้าแรก

    } catch (error) {
      console.error(error);
      alert('เชื่อมต่อ server ไม่ได้');
      // network error → แจ้งเตือน

    } finally {
      setLoading(false);
      // ปิด loading ทุกกรณี ไม่ว่าสำเร็จหรือไม่
    }
  };


  // ─────────────────────────────────────────
  // 🖥️ UI — ฟอร์มแก้ไขข้อมูล
  // ─────────────────────────────────────────

  return (
    <div>
      <h1>แก้ไขผู้ใช้</h1>
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
          />
        </div>

        <div>
          <label>อีเมล:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>รหัสผ่านใหม่:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ไม่กรอก = ไม่เปลี่ยน"
            // placeholder = ข้อความแนะนำในช่อง input
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          {/* loading = true  → แสดง "กำลังบันทึก..." + กดไม่ได้ */}
          {/* loading = false → แสดง "บันทึกการแก้ไข" ปกติ      */}
        </button>

      </form>
    </div>
  );
}

export default Edit;