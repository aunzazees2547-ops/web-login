import { useEffect, useState } from 'react';
// useEffect = ทำงานอัตโนมัติเมื่อ component โหลด
// useState  = เก็บค่าตัวแปรที่เปลี่ยนได้

import { useNavigate } from 'react-router-dom';
// useNavigate = ใช้เปลี่ยนหน้า


const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;
// ดึง URL จาก .env แล้วต่อท้าย /api/users
// เช่น http://localhost:3001/api/users


function Table() {

  const [users, setUsers] = useState([]);
  // users = array เก็บรายชื่อผู้ใช้ทั้งหมด
  // เริ่มต้นเป็น [] รอโหลดจาก API

  const navigate = useNavigate();


  // ─────────────────────────────────────────
  // 🔄 useEffect — โหลดรายชื่อผู้ใช้ทั้งหมด
  // ─────────────────────────────────────────

  useEffect(() => {
  // ทำงานครั้งแรกที่ component โหลด

    const token = localStorage.getItem('token');
    // ดึง token ที่เก็บไว้ตอน login

    fetch(API_URL, {
    // เรียก GET /api/users → ดึงรายชื่อทั้งหมด
      headers: {
        'Authorization': `Bearer ${token}`
        // แนบ token ไปด้วย → server จะเช็คว่ามีสิทธิ์ไหม
      }
    })
      .then(res => res.json())
      // แปลง response เป็น array of object

      .then(data => setUsers(data))
      // เก็บข้อมูลลง state → React จะ render ตาราง

      .catch(() => alert('โหลดข้อมูลไม่สำเร็จ'));
      // ถ้าเกิด error → แจ้งเตือน

  }, []);
  // [] = ทำแค่ครั้งเดียวตอนเปิดหน้า


  // ─────────────────────────────────────────
  // 🗑️ handleDelete — ลบผู้ใช้
  // ─────────────────────────────────────────

  const handleDelete = async (id) => {

    if (!confirm('ยืนยันการลบ?')) return;
    // confirm = popup ถามผู้ใช้ก่อน
    // กด cancel → return หยุดทันที ไม่ลบ

    try {
      const token = localStorage.getItem('token');
      // ดึง token สำหรับ request นี้

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        // DELETE = ลบข้อมูลตาม id
        headers: {
          'Authorization': `Bearer ${token}`
          // แนบ token → server เช็คสิทธิ์
        }
      });

      if (!res.ok) throw new Error();
      // ถ้า server ส่ง error →던 error ไปที่ catch

      setUsers(prev => prev.filter(u => u.id !== id));
      // อัปเดต state โดยเอา user ที่ลบออก
      // filter = เก็บเฉพาะ user ที่ id ไม่ตรงกับที่ลบ
      // → ตารางอัปเดตทันทีโดยไม่ต้องโหลดใหม่

    } catch {
      alert('ลบไม่สำเร็จ');
    }
  };


  // ─────────────────────────────────────────
  // 🖥️ UI — ตารางแสดงรายชื่อผู้ใช้
  // ─────────────────────────────────────────

  return (
    <div style={{ padding: '24px' }}>

      <div style={{
        display: 'flex',           // จัดเรียงแนวนอน
        justifyContent: 'space-between', // ชื่อซ้าย ปุ่มขวา
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h1 style={{ margin: 0 }}>รายชื่อผู้ใช้</h1>
        <button
          onClick={() => navigate('/form')}
          // กดแล้วไปหน้าสมัครสมาชิก /form
          style={{
            padding: '8px 16px',
            backgroundColor: '#27ae60', // สีเขียว
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          + เพิ่มผู้ใช้
        </button>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse', // ไม่ให้ border ซ้อนกัน
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)', // เงาจางๆ
      }}>

        {/* หัวตาราง */}
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            <th style={th}>ID</th>
            <th style={th}>ชื่อ</th>
            <th style={th}>อีเมล</th>
            <th style={th}>จัดการ</th>
          </tr>
        </thead>

        {/* เนื้อหาตาราง */}
        <tbody>
          {users.length === 0 ? (
            // ถ้าไม่มีผู้ใช้เลย → แสดงข้อความ
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                ไม่มีข้อมูลผู้ใช้
                {/* colSpan="4" = ขยายให้กว้างเต็ม 4 คอลัมน์ */}
              </td>
            </tr>
          ) : (
            // ถ้ามีผู้ใช้ → วน loop แสดงทีละแถว
            users.map((user, index) => (
              <tr key={user.id} style={{
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                // แถวคู่ = สีเทาอ่อน, แถวคี่ = สีขาว (สลับสี)
              }}>
                <td style={td}>{user.id}</td>
                <td style={td}>{user.name}</td>
                <td style={td}>{user.email}</td>
                <td style={td}>

                  <button
                    onClick={() => navigate(`/edit/${user.id}`)}
                    // กดแล้วไปหน้าแก้ไข เช่น /edit/5
                    style={{
                      marginRight: '8px',
                      padding: '4px 12px',
                      backgroundColor: '#3498db', // สีฟ้า
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    แก้ไข
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    // กดแล้วเรียก handleDelete ส่ง id ของ user นั้น
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#e74c3c', // สีแดง
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    ลบ
                  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


// ─────────────────────────────────────────
// 🎨 Style object — ใช้ซ้ำใน th และ td
// ─────────────────────────────────────────

const th = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '500',
  // style ของหัวตาราง
};

const td = {
  padding: '12px 16px',
  borderBottom: '1px solid #eee',
  // style ของแต่ละช่องในตาราง
};

export default Table;