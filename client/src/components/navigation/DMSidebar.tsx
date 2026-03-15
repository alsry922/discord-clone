export const DMSidebar = () => {
  return (
    <>
      {/* 2단: DM 목록 사이드바 (240px) */}
      <aside className="flex h-full w-60 shrink-0 flex-col bg-[#2b2d31]">
        <div className="flex h-12 items-center border-b border-[#1f2123] px-4">
          <button className="w-full rounded bg-[#1e1f22] px-2 py-1 text-left text-sm text-gray-400">
            대화 찾기 또는 시작하기
          </button>
        </div>
        <div className="grow overflow-y-auto p-2">
          <div className="mb-4 flex cursor-pointer items-center gap-3 rounded px-2 py-2 text-gray-400 hover:bg-[#35373c] hover:text-gray-100">
            <span className="text-xl">👥</span>
            <span className="font-medium">친구</span>
          </div>
          <div className="px-2 py-1 text-xs font-bold text-gray-400 uppercase">
            다이렉트 메시지
          </div>
          <div className="mt-2 flex cursor-pointer items-center gap-3 rounded px-2 py-2 text-gray-400 hover:bg-[#35373c] hover:text-gray-100">
            <div className="h-8 w-8 rounded-full bg-indigo-500" />
            <span className="font-medium">사용자 1</span>
          </div>
        </div>
      </aside>
    </>
  );
};
