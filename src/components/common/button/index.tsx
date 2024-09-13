import React, { FC } from 'react';

interface Props {
  name: string;
  color?: string;
  type?: string;
  onClick?: Function;
}

const Button: FC<Props> = ({ name, type, color, onClick }) => {
  const handleClick = async values => {
    onClick();
  };

  if (color === 'blue') {
    return (
      <button
        onClick={handleClick}
        className="w-full h-[2.2rem] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-bold rounded px-4 py-1 text-sm text-center inline-flex items-center justify-center"
      >
        {name}
      </button>
    );
  } else if (color === 'green') {
    return (
      <button
        onClick={handleClick}
        className="w-full h-[2.2rem] text-white bg-green-600 hover:bg-green-700 focus:outline-none font-bold rounded px-4 py-1 text-sm text-center inline-flex items-center justify-center"
      >
        {name}
      </button>
    );
  } else if (color === 'gray') {
    return (
      <button
        onClick={handleClick}
        className="w-auto h-[2.2rem] bg-grayButton hover:bg-buttonHover text-gray text-sm font-bold py-1 px-4 m-1 border border-grayButton-700 rounded"
      >
        {name}
      </button>
    );
  } else if (color === 'disabled') {
    return (
      <button
        onClick={handleClick}
        disabled
        className="w-full h-[2.2rem] text-white bg-blue-600 focus:outline-none font-bold rounded px-4 py-1 text-sm text-center inline-flex items-center justify-center disabled:opacity-25"
      >
        {name}
      </button>
    );
  } else if (color === 'loader') {
    return (
      <button
        disabled
        type="button"
        className="w-full h-[2.2rem] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-bold rounded px-4 py-1 text-sm text-center inline-flex items-center justify-center"
      >
        <svg
          role="status"
          className="inline mr-3 w-4 h-4 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Уншиж байна...
      </button>
    );
  }
};

Button.defaultProps = {
  name: 'my button',
  color: 'blue',
  type: 'button',
  onClick: () => {
    console.log('');
  },
};

export default Button;