import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'เกิดข้อผิดพลาด');
        return;
      }

      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login'); // ✅ สมัครเสร็จพาไปหน้า login
      
    } catch (error) {
      console.error('Error:', error);
      alert('ไม่สามารถเชื่อมต่อ server ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>สมัครสมาชิก</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ชื่อ:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
        </button>

        {/* ✅ ปุ่มกลับไปหน้า login */}
        <p>
          มีบัญชีแล้ว?{' '}
          <button type="button" onClick={() => navigate('/login')}>
            เข้าสู่ระบบ
          </button>
        </p>
      </form>
    </div>
  );
}

export default Form;