import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'เกิดข้อผิดพลาด');
        return;
      }

      login(data.user, data.token);
      navigate('/');

    } catch {
      alert('เชื่อมต่อ server ไม่ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit}>
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
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <p>
        ยังไม่มีบัญชี?{' '}
        <button onClick={() => navigate('/form')}>
          สมัครสมาชิก
        </button>
      </p>
    </div>
  );
}

export default Login;