import { logo, siteDescription, siteName } from '@config';
import Link from 'next/link';
import React from 'react';

const Header = () => (
  <div className='pb-8 text-center sm:flex sm:flex-row sm:text-left'>
    <Link href='/'>
      <a title='Go to course overview' className='block'>
        <img
          className='w-24 m-auto my-4 sm:m-0 sm:w-auto'
          alt='startkubernetes'
          src={logo}
        />
      </a>
    </Link>
    <div className='self-center w-full sm:pl-8'>
      <h1 className='mb-1 text-xl font-bold text-gray-700 md:text-2xl'>
        {siteName}
      </h1>
      <p className='w-48 mx-auto text-gray-600 sm:w-auto md:mx-0'>
        {siteDescription}
      </p>
    </div>
  </div>
);

export default Header;
