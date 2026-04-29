import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Table from './pages/table';
import Edit from './pages/Edit';
import Form from './pages/Form';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* ✅ หน้าที่ไม่ต้องล็อคอิน */}
          <Route path="/login" element={<Login />} />
          <Route path="/form" element={<Form />} />

          {/* ✅ หน้าที่ต้องล็อคอิน */}
          <Route path="/" element={
            <PrivateRoute><Table /></PrivateRoute>
          } />
          <Route path="/edit/:id" element={
            <PrivateRoute><Edit /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;