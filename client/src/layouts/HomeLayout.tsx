import { DMSidebar } from '../components/navigation/DMSidebar.tsx';
import { Outlet } from 'react-router';

const HomeLayout = () => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <DMSidebar />
      {/* 3단: 메인 영역 (친구 목록 또는 채팅) */}
      <main className="flex grow overflow-hidden bg-[#313338]">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
