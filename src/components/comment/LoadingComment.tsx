export default function LoadingComment() {
  return (
    <div className='flex flex-row justify-start gap-2'>
      <div className="animate-pulse w-8 h-8 rounded-full bg-gray-100" />
      <div className='animate-pulse w-full h-24 grow p-4 flex flex-col gap-2 bg-gray-100 rounded-md' />
    </div>
  );
}