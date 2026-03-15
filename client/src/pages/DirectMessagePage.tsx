import { useParams } from 'react-router';

const DirectMessagePage = () => {
  const { chatId } = useParams();

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-12 items-center border-b border-[#1f2123] px-4 font-bold shadow-sm">
        DM: {chatId}
      </header>
      <div className="flex grow items-center justify-center text-gray-500">
        {chatId}님과의 채팅창입니다.
      </div>
    </div>
  );
};

export default DirectMessagePage;
