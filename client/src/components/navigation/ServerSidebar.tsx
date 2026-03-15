export const ServerSidebar = () => {
  return (
    <>
      {/* 1단: 서버 리스트 (72px) - 고정 영역 */}
      <nav className="flex h-full w-18 shrink-0 flex-col items-center gap-2 bg-[#1e1f22] py-3">
        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-3xl bg-[#5865f2] text-white transition-all duration-200 hover:rounded-2xl">
          <span className="text-xs font-bold uppercase">Home</span>
        </div>
        <div className="h-0.5 w-8 rounded-full bg-[#35363c]" />
        {/* 서버 아이콘들이 반복될 자리 */}
        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-3xl bg-[#313338] text-[#23a559] transition-all duration-200 hover:rounded-2xl hover:bg-[#23a559] hover:text-white">
          <span className="text-2xl">+</span>
        </div>
      </nav>
    </>
  );
};
