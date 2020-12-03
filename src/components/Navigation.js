import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

const ButtonLink = React.forwardRef(
  ({ onClick, href, direction, title }, ref) => {
    const btnClass = classNames({
      'inline-block border border-gray-200 px-4 py-2 rounded-sm bg-gray-100 text-sm hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors duration-200': true,
      'place-self-end ml-auto text-right': direction === 'Next',
    });
    const isNext = direction === 'Next';
    const isPrev = direction === 'Previous';
    return (
      <a href={href} onClick={onClick} ref={ref} className={btnClass}>
        <strong>
          {isPrev && <>← </>}
          {direction} {isNext && <> →</>}
        </strong>
        <br />
        <span>{title}</span>
      </a>
    );
  }
);

const Navigation = ({ currentUnit, units }) => {
  const nextUnit = units.filter((unit) => unit.order === currentUnit + 1);
  const prevUnit = units.filter((unit) => unit.order === currentUnit - 1);
  return (
    <div className='flex py-4 border border-b-0 border-l-0 border-r-0 border-gray-200 mt-9 md:py-8 md:mt-16'>
      {prevUnit.length ? (
        <Link href={`/post/${prevUnit[0].slug}`} passHref>
          <ButtonLink direction='Previous' title={prevUnit[0].title} />
        </Link>
      ) : null}
      {nextUnit.length ? (
        <Link href={`/post/${nextUnit[0].slug}`} passHref>
          <ButtonLink direction='Next' title={nextUnit[0].title} />
        </Link>
      ) : null}
    </div>
  );
};

export default Navigation;
