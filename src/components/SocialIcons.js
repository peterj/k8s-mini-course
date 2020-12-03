import { social } from '@config';
import { Facebook, Twitch, Twitter, YouTube, Website } from '@icons/index';
import classNames from 'classnames';
import React from 'react';

const Icons = {
  facebook: <Facebook />,
  twitter: <Twitter />,
  youtube: <YouTube />,
  twitch: <Twitch />,
  website: <Website />,
};

const SocialLink = ({ type }) => {
  const btnClass = classNames({
    [`flex text-center text-gray-300 p-2 transition-colors duration-300 hover:text-white fill-current`]: true,
    [`hover:bg-facebook`]: type === 'facebook',
    [`hover:bg-twitter`]: type === 'twitter',
    [`hover:bg-twitch`]: type === 'twitch',
    [`hover:bg-youtube`]: type === 'youtube',
    [`hover:bg-green-500`]: type === 'website',
  });
  return (
    <li className='self-center m-0 text-center sm:w-auto'>
      <a
        target='_blank'
        title={`Follow me on ${type.toUpperCase()}`}
        href={social[type]}
        rel='noopener'
        className={btnClass}
      >
        <span className='inline-block w-4 h-4'>{Icons[type]}</span>
      </a>
    </li>
  );
};

const SocialIcons = () => {
  return (
    <div className='w-full mt-2 sm:ml-auto'>
      <ul className='flex m-0'>
        {Object.keys(social).map((s) => (
          <SocialLink key={s} type={s} />
        ))}
      </ul>
    </div>
  );
};

export default SocialIcons;
