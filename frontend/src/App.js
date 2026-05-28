import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { publicRoutes, adminRoutes } from "./routes";

import User from "./components/layout/User";
import Admin from "./components/layout/Admin";
import { CartProvider } from "./contexts/CartContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ChatProvider } from "./contexts/ChatContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ScrollToTop from "./components/shared/ScrollToTop";

// ================== AUTH GUARD ==================
const RequireAuth = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (role && userRole?.toUpperCase() !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
    <SocketProvider>
    <Router>
      <ToastProvider>
        <CartProvider>
          <ChatProvider>
            <ScrollToTop />
            <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            {publicRoutes.map(({ path, component: Page, layout }, index) => {
              const Layout = layout ?? User;

              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            {/* ================= ADMIN ROUTES ================= */}
            {adminRoutes.map(({ path, component: Page, layout }, index) => {
              const Layout = layout ?? Admin;

              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <RequireAuth role="ADMIN">
                      <Layout>
                        <Page />
                      </Layout>
                    </RequireAuth>
                  }
                />
              );
            })}

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ChatProvider>
        </CartProvider>
      </ToastProvider>
    </Router>
    </SocketProvider>
    </AuthProvider>
  );
}

export default App;
