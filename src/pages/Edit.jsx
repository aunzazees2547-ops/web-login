import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api/users';

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // ✅ ดึง token
    fetch(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // ✅ ส่ง token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setName(data.name);
        setEmail(data.email);
      })
      .catch(() => {
        alert('โหลดข้อมูลไม่สำเร็จ');
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const body = { name, email };
    if (password.trim() !== '') {
      body.password = password;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // ✅ ดึง token
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ ส่ง token
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'เกิดข้อผิดพลาด');
        return;
      }

      alert('แก้ไขข้อมูลสำเร็จ');
      navigate('/');

    } catch (error) {
      console.error(error);
      alert('เชื่อมต่อ server ไม่ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>แก้ไขผู้ใช้</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ชื่อ:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
        </button>
      </form>
    </div>
  );
}

export default Edit;