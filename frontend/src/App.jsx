import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ChatPage } from "./pages/ChatPage";
import { EmptyChat } from "./pages/EmptyChat";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";

function App() {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    checkAuth();
  }, [checkAuth, theme]);

  if (isCheckingAuth && !user)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );

  return (
    <div className="min-h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
        </Route>

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" />}
          >
            <Route index element={<EmptyChat />} />
            <Route path="chat/:userId" element={<ChatPage />} />
          </Route>

          <Route path="/settings" element={<SettingsPage />} />

          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
