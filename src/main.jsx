import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MenuPage from './pages/MenuPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import LoginPage from './pages/Login.jsx';
import RequireAuth from './components/adminpage/RequireAuth.jsx';
import { AuthProvider } from './contexts/AuthContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { MenuItemsProvider } from './contexts/MenuItemsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap the entire application with AuthProvider */}
      <FirebaseProvider> {/* Wrap with FirebaseProvider */}
        <MenuItemsProvider> {/* Wrap with MenuItemsProvider */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MenuPage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Protect the /admin/* routes with RequireAuth */}
              <Route path="/admin/*" element={<RequireAuth><AdminPage /></RequireAuth>} />
            </Routes>
          </BrowserRouter>
        </MenuItemsProvider>
      </FirebaseProvider>
    </AuthProvider>
  </React.StrictMode>,
);
