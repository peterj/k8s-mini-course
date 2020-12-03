import { author, authorImg, authorTitle, shortBio, social } from '@config';
import React from 'react';
import { SocialIcons } from './';

const Author = () => {
  return (
    <div className='text-white bg-gray-700 md:flex md:flex-row'>
      <div className='w-48 p-8 md:flex-shrink-0'>
        <a href={social.website} target='_blank'>
          <img
            className='inline-block object-cover h-32 rounded-full ring-2 ring-white'
            src={authorImg}
            alt={author}
          />
        </a>
      </div>
      <div className='self-center px-8 pb-8 md:pt-8 md:pl-0'>
        <h3 className='mb-2 text-lg leading-4'>
          <a href={social.website} target='_blank' className=' hover:underline'>
            {author}
          </a>
          <br />
          <span className='text-xs text-gray-300 uppercase'>{authorTitle}</span>
        </h3>
        <p className='text-sm text-gray-200 '>{shortBio}</p>
        <SocialIcons />
      </div>
    </div>
  );
};

export default Author;
