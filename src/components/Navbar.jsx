import { useNavigate, useLocation } from 'react-router-dom';
// useNavigate  = ใช้เปลี่ยนหน้า เช่น ไปหน้า /login
// useLocation  = ดูว่าตอนนี้อยู่หน้าไหน เช่น /home, /login

import { useAuth } from '../context/AuthContext';
// ดึง user และ logout จาก Context
// Context = ที่เก็บข้อมูล user ที่ทุก component เข้าถึงได้


function Navbar() {

  const { user, logout } = useAuth();
  // user   = ข้อมูลคนที่ login อยู่ (ถ้ายังไม่ login จะเป็น null)
  // logout = ฟังก์ชันสำหรับออกจากระบบ

  const navigate = useNavigate();
  // navigate('/login') = พาผู้ใช้ไปหน้า login

  const location = useLocation();
  // location.pathname = path ปัจจุบัน เช่น '/home', '/login'


  // ─────────────────────────────────────────
  // 🙈 ซ่อน Navbar ในบางหน้า
  // ─────────────────────────────────────────

  const hideNav = location.pathname === '/login' || location.pathname === '/form';
  // true  = อยู่หน้า login หรือ form
  // false = อยู่หน้าอื่น

  if (hideNav) return null;
  // ถ้า hideNav เป็น true → ไม่ render อะไรเลย (Navbar หายไป)


  // ─────────────────────────────────────────
  // 🚪 ฟังก์ชัน Logout
  // ─────────────────────────────────────────

  const handleLogout = () => {
    logout();
    // ล้างข้อมูล user ออกจาก Context และ localStorage

    navigate('/login');
    // พาผู้ใช้ไปหน้า login ทันที
  };


  // ─────────────────────────────────────────
  // 🖥️ UI ของ Navbar
  // ─────────────────────────────────────────

  return (
    <nav>
      {user ? (
        // ถ้า login อยู่ → แสดงชื่อและปุ่มออกจากระบบ
        <>
          <span>สวัสดี, {user.name}</span>
          {/* user.name = ชื่อที่ดึงมาจาก Context */}

          <button onClick={handleLogout}>ออกจากระบบ</button>
          {/* กดแล้วเรียก handleLogout → logout + ไปหน้า login */}
        </>
      ) : (
        // ถ้ายังไม่ login → แสดงปุ่มเข้าสู่ระบบ
        <button onClick={() => navigate('/login')}>เข้าสู่ระบบ</button>
        // กดแล้วพาไปหน้า /login ทันที
      )}
    </nav>
  );
}

export default Navbar;
// ส่งออก Navbar ให้ไฟล์อื่นนำไปใช้ได้