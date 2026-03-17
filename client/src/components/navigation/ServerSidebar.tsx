import { useNavigate } from 'react-router';

export const ServerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
        {/* 하단 고정 영역 */}
        {/*mt-auto 부모 요소의 남은 영역을 margin-top으로 다 차지함.*/}
        {/*margin auto가 세로 방향도 적용되는 경우는 부모가 flex 또는 grid 일 때만 동작한다.*/}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-3xl bg-[#313338] text-red-400 transition-all duration-200 hover:rounded-2xl hover:bg-red-400 hover:text-white"
            title="로그아웃"
          >
            <span className="text-xs font-bold">OUT</span>
          </button>
        </div>
      </nav>
    </>
  );
};
