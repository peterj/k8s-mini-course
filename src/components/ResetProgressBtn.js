import useLocalStorage from '@hooks/useLocalStorage';

const ResetProgressBtn = () => {
  const [, setProgress] = useLocalStorage('progress');
  const [, setCompleted] = useLocalStorage('completed');
  return (
    <button
      onClick={() => {
        setProgress([]);
        setCompleted(false);
        location.reload();
      }}
      type='button'
      className='block w-full p-2 mt-2 text-xs text-center transition-colors duration-200 rounded-sm hover:bg-blue-500 hover:text-white'
    >
      Reset Progress
    </button>
  );
};

export default ResetProgressBtn;
