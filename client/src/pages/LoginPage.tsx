import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  // reactive form과 비슷한 기능의 라이브러리
  const {
    register,
    handleSubmit,
    // formState에 errors, isDirty, isSubmitting, touchedFields, submitCount 등
    // 여러 필드들을 가지고 있음.
    formState: { errors },
    setError,
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      setError('root', { message: result.message });
      return;
    }

    const result = await response.json();
    localStorage.setItem('token', result.accessToken);
    navigate('/channels/@me');
  };

  return (
    <div className="w-full max-w-md rounded-md bg-[#313338] p-8 shadow-lg">
      <h1 className="mb-2 text-center text-2xl font-bold text-white">
        다시 만나서 반가워요!
      </h1>
      <p className="mb-6 text-center text-sm text-[#b5bac1]">
        로그인하여 Discord를 계속 이용하세요.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="mb-2 block text-xs font-bold text-[#b5bac1] uppercase">
            이메일
          </label>
          <input
            type="email"
            {...register('email', {
              required: '이메일을 입력해주세요.',
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
          type="submit"
          className="w-full rounded bg-[#5865f2] py-2 font-medium text-white transition hover:bg-[#4752c4]"
        >
          로그인
        </button>
      </form>
      <p className="mt-4 text-sm text-[#b5bac1]">
        계정이 없으신가요?{' '}
        <Link to="/register" className="text-[#00a8fc] hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
};
