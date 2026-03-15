export const ChannelSidebar = () => {
  return (
    <>
      {/* 2단: 채널 리스트 (240px) - 가변 너비 구현 전 고정값 */}
      <aside className="flex h-full w-60 shrink-0 flex-col bg-[#2b2d31]">
        <header className="flex h-12 items-center border-b border-[#1f2123] px-4 font-bold shadow-sm">
          서버 이름
        </header>
        <div className="grow overflow-y-auto p-3">
          <div className="mb-1 cursor-pointer rounded px-2 py-1 text-gray-400 hover:bg-[#35373c] hover:text-gray-100">
            # 일반 채널
          </div>
          <div className="mb-1 cursor-pointer rounded px-2 py-1 text-gray-400 hover:bg-[#35373c] hover:text-gray-100">
            # 공지사항
          </div>
        </div>
      </aside>
    </>
  );
};
