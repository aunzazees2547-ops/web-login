import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api/users';

function Table() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // ✅ ดึง token ตรงนี้
    fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}` // ✅ ส่ง token ไปด้วย
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => alert('โหลดข้อมูลไม่สำเร็จ'));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบ?')) return;
    try {
      const token = localStorage.getItem('token'); // ✅ ส่ง token ตอนลบด้วย
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error();
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      alert('ลบไม่สำเร็จ');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h1 style={{ margin: 0 }}>รายชื่อผู้ใช้</h1>
        <button
          onClick={() => navigate('/form')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#27ae60',
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
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            <th style={th}>ID</th>
            <th style={th}>ชื่อ</th>
            <th style={th}>อีเมล</th>
            <th style={th}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                ไม่มีข้อมูลผู้ใช้
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id} style={{
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
              }}>
                <td style={td}>{user.id}</td>
                <td style={td}>{user.name}</td>
                <td style={td}>{user.email}</td>
                <td style={td}>
                  <button
                    onClick={() => navigate(`/edit/${user.id}`)}
                    style={{
                      marginRight: '8px',
                      padding: '4px 12px',
                      backgroundColor: '#3498db',
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
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#e74c3c',
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

const th = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '500',
};

const td = {
  padding: '12px 16px',
  borderBottom: '1px solid #eee',
};

export default Table;