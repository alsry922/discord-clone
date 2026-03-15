import { useParams } from 'react-router';

const ChannelChatPage = () => {
  const { serverId, channelId } = useParams();

  return (
    <div className="flex h-full w-full">
      {/* 3단: 채팅 영역 */}
      <div className="flex grow flex-col border-r border-[#2e3035]">
        <header className="flex h-12 items-center border-b border-[#1f2123] px-4 font-bold shadow-sm">
          # {channelId}
        </header>
        <div className="grow overflow-y-auto p-4 text-gray-400">
          서버 {serverId}의 {channelId} 채널 메시지들...
        </div>
        <div className="p-4">
          <div className="rounded-lg bg-[#383a40] p-3 text-gray-500">
            #{channelId}에 메시지 보내기
          </div>
        </div>
      </div>

      {/* 4단: 구성원 목록 (서버에서만 노출) */}
      <aside className="hidden w-60 shrink-0 flex-col bg-[#2b2d31] md:flex">
        <header className="flex h-12 items-center border-b border-[#1f2123] px-4 text-xs font-bold text-gray-400 uppercase shadow-sm">
          구성원 — 1
        </header>
        <div className="grow overflow-y-auto p-3">
          <div className="group flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-[#35373c]">
            <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-500" />
            <span className="text-gray-400 group-hover:text-gray-100">
              사용자
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChannelChatPage;
