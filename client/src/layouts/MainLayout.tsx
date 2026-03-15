import { ServerSidebar } from '../components/navigation/ServerSidebar.tsx';
import { Outlet } from 'react-router';

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#313338] text-[#dbdee1]">
      <ServerSidebar />
      {/* 2단, 3단, 4단이 렌더링될 영역 */}
      <main className="flex grow overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
