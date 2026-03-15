export const RegisterPage = () => {
  return (
    <div className="w-full max-w-md rounded-md bg-[#313338] p-8 shadow-lg">
      <h1 className="mb-2 text-center text-2xl font-bold text-white">
        계정 만들기
      </h1>
      <p className="mb-6 text-center text-sm text-[#b5bac1]">
        계정을 만들고 Discord를 시작하세요.
      </p>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-bold text-[#b5bac1] uppercase">
          이메일
        </label>
        <input
          type="email"
          className="w-full rounded bg-[#1e1f22] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#5865f2]"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-bold text-[#b5bac1] uppercase">
          사용자명
        </label>
        <input
          type="text"
          className="w-full rounded bg-[#1e1f22] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#5865f2]"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-xs font-bold text-[#b5bac1] uppercase">
          비밀번호
        </label>
        <input
          type="password"
          className="w-full rounded bg-[#1e1f22] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#5865f2]"
        />
      </div>

      <button className="w-full rounded bg-[#5865f2] py-2 font-medium text-white transition hover:bg-[#4752c4]">
        회원가입
      </button>

      <p className="mt-4 text-sm text-[#b5bac1]">
        이미 계정이 있으신가요?{' '}
        <a href="/login" className="text-[#00a8fc] hover:underline">
          로그인
        </a>
      </p>
    </div>
  );
};
