import { Navigate } from 'react-router-dom';
// Navigate = component สำหรับเปลี่ยนหน้าอัตโนมัติ
// ต่างจาก useNavigate ตรงที่ใช้ใน JSX ได้เลย

import { useAuth } from '../context/AuthContext';
// ดึงข้อมูล user จาก Context
// ถ้า login อยู่ → user มีข้อมูล
// ถ้ายังไม่ login → user เป็น null


function PrivateRoute({ children }) {
// children = component ที่ถูกครอบไว้ข้างใน
// เช่น <PrivateRoute> <หน้าที่ต้องการปกป้อง /> </PrivateRoute>

  const { user } = useAuth();
  // ดึง user มาเช็คว่า login อยู่ไหม

  return user ? children : <Navigate to="/login" replace />;
  //      ↓               ↓
  //  มี user          ไม่มี user
  //  → แสดงหน้านั้น   → พาไปหน้า login ทันที
  //
  // replace = ไม่เก็บหน้าปัจจุบันใน history
  // กด back จะไม่วนกลับมาหน้าที่ถูกบล็อก
}

export default PrivateRoute;