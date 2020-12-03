import { coverImage, outcomes, siteName } from '@config';
import { Tick } from '@icons/index';
import Link from 'next/link';
import React from 'react';

const StartBtn = () => (
  <Link href='/post/introduction'>
    <a className='block px-4 py-2 text-center text-white transition duration-200 bg-blue-500 rounded-sm hover:bg-blue-600 md:text-left md:inline-block'>
      Start Learning →
    </a>
  </Link>
);

const Hero = () => {
  return (
    <div className='relative border border-gray-200 md:flex md:flex-row'>
      <div className='flex text-center bg-gray-100 md:w-1/3'>
        <img
          className='object-contain mx-auto'
          alt={siteName}
          src={coverImage}
        />
      </div>
      <div className='self-center px-4 py-6 md:px-8 md:w-2/3'>
        <h2 className='mb-3 text-2xl font-bold'>What you'll learn</h2>
        {outcomes && (
          <ul className='mb-6'>
            {outcomes.map((i) => (
              <li key={i} className='flex mb-2 text-gray-700 list-none'>
                <span className='flex'>
                  <Tick className='self-center h-4 w-9' />
                </span>
                <span className='pl-2 opacity-75'>{i}</span>
              </li>
            ))}
          </ul>
        )}
        <StartBtn />
      </div>
    </div>
  );
};

export default Hero;
