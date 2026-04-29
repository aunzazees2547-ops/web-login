import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ซ่อน navbar ในหน้า login และ form
  const hideNav = location.pathname === '/login' || location.pathname === '/form';
  if (hideNav) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      {user ? (
        <>
          <span>สวัสดี, {user.name}</span>
          <button onClick={handleLogout}>ออกจากระบบ</button>
        </>
      ) : (
        <button onClick={() => navigate('/login')}>เข้าสู่ระบบ</button>
      )}
    </nav>
  );
}

export default Navbar;