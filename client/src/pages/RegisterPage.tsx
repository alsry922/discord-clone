import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

interface RegisterForm {
  email: string;
  username: string;
  password: string;
}

export const RegisterPage = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<RegisterForm>();
  // // 제출 시 검사 (기본값)
  // useForm({ mode: 'onSubmit' });
  //
  // // 포커스 벗어날 때 검사 (Angular touched랑 동일)
  // useForm({ mode: 'onBlur' });
  //
  // // 타이핑할 때마다 검사
  // useForm({ mode: 'onChange' });
  //
  // // onBlur + onChange 둘 다
  // useForm({ mode: 'all' });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) {
      const result = await response.json();
      // reack-hook-form에서 폼 전체 레벨의 에러를 나타내는 예약된 키.
      // 서버에서 네려오는 에러 처리를 할 때 보통 사용
      setError('root', { message: result.message });
      return;
    }

    navigate('/login');
  };

  return (
    <div className="w-full max-w-md rounded-md bg-[#313338] p-8 shadow-lg">
      <h1 className="mb-2 text-center text-2xl font-bold text-white">
        계정 만들기
      </h1>
      <p className="mb-6 text-center text-sm text-[#b5bac1]">
        계정을 만들고 Discord를 시작하세요.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="mb-2 block text-xs font-bold text-[#b5bac1] uppercase">
            이메일
          </label>
          <input
            type="email"
            {...register('email', {
              required: '이메일을 입력해주세요',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '올바른 이메일 형식이 아닙니다.',
              },
            })}
            className="w-full rounded bg-[#1e1f22] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#5865f2]"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-xs font-bold text-[#b5bac1] uppercase">
            사용자명
          </label>
          <input
            type="text"
            {...register('username', {
              required: '사용자명을 입력해주세요.',
              minLength: {
                value: 2,
                message: '사용자명은 최소 2자리 이상이어야 합니다.',
              },
              maxLength: {
                value: 32,
                message: '사용자명은 최대 32자리까지 가능합니다.',
              },
            })}
            className="w-full rounded bg-[#1e1f22] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#5865f2]"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-400">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-xs font-bold text-[#b5bac1] uppercase">
            비밀번호
          </label>
          <input
            type="password"
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: 8,
                message: '비밀번호는 최소 8자리 이상이어야 합니다.',
              },
            })}
            className="w-full rounded bg-[#1e1f22] px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#5865f2]"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="mb-4 text-sm text-red-400">{errors.root.message}</p>
        )}

        <button
          type={'submit'}
          disabled={isSubmitting}
          className="w-full rounded bg-[#5865f2] py-2 font-medium text-white transition hover:bg-[#4752c4]"
        >
          {isSubmitting ? '처리 중...' : '회원가입'}
        </button>
      </form>

      <p className="mt-4 text-sm text-[#b5bac1]">
        이미 계정이 있으신가요?{' '}
        <a href="/login" className="text-[#00a8fc] hover:underline">
          로그인
        </a>
      </p>
    </div>
  );
};
