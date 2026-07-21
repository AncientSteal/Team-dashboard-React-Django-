import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './pages/DashboardLayout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './layouts/Profile';
import Tasks from './layouts/Tasks';

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={ <DashboardLayout /> }>
              <Route path='profile' element={ <ProfilePage /> }/>
              <Route path='Task/Kanban' element={ <Tasks /> }/>
            </Route>
          </Route>
          <Route path="/login" element={ <LoginPage />} />
          <Route path="/registration" element={ <RegistrationPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
