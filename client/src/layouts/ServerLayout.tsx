import { ChannelSidebar } from '../components/navigation/ChannelSidebar.tsx';
import { Outlet } from 'react-router';

const ServerLayout = () => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <ChannelSidebar />
      {/* 3단 & 4단: 채팅창 및 구성원 목록 */}
      <main className="flex grow overflow-hidden bg-[#313338]">
        <Outlet />
      </main>
    </div>
  );
};

export default ServerLayout;
