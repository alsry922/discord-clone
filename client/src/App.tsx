import { Route, Routes, Navigate } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import HomeLayout from './layouts/HomeLayout';
import ServerLayout from './layouts/ServerLayout';
import FriendsPage from './pages/FriendsPage';
import DirectMessagePage from './pages/DirectMessagePage';
import ChannelChatPage from './pages/ChannelChatPage';
import { AuthLayout } from './layouts/AuthLayout.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';

function App() {
  return (
    <Routes>
      {/* 1. 루트(/) 접속 시 자동으로 /channels/@me 로 이동 */}
      <Route path="/" element={<Navigate to="/channels/@me" replace />} />

      <Route element={<AuthLayout />}>
        <Route path={'login'} element={<LoginPage />}></Route>
        <Route path={'register'} element={<RegisterPage />}></Route>
      </Route>

      {/* 2. 메인 구조: 1단(서버 리스트)이 항상 고정 */}
      <Route element={<ProtectedRoute />}>
        <Route path="channels" element={<MainLayout />}>
          {/* 2-1. DM 레이아웃: 2단(DM 리스트) + 3단(메인) */}
          <Route path="@me" element={<HomeLayout />}>
            <Route index element={<FriendsPage />} />
            <Route path=":chatId" element={<DirectMessagePage />} />
          </Route>

          {/* 2-2. 서버 레이아웃: 2단(채널 리스트) + 3단(채팅) + 4단(구성원) */}
          <Route path=":serverId" element={<ServerLayout />}>
            <Route path=":channelId" element={<ChannelChatPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
