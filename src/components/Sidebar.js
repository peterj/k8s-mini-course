import { FeedbackFish } from '@feedback-fish/react';
import classNames from 'classnames';
import Link from 'next/link';
import { withRouter } from 'next/router';
import React from 'react';
import { CourseProgress, ResetProgressBtn } from './';

const FEEDBACK_FISH_ID = process.env.FEEDBACK_FISH_ID;

const ProgressMarker = ({ isCurrent, isCompleted }) => {
  const markerClass = classNames({
    'bg-gray-200 text-white rounded-full inline-block w-2 h-2 self-center mr-2 transition-colors duration-200': true,
    'bg-completed': isCompleted || isCurrent,
  });
  return <span className={markerClass}>&nbsp;</span>;
};

const UnitItem = ({ unit: { slug, title }, progress, query }) => {
  const listItemClass = classNames({
    'text-sm': true,
    'font-bold': slug === query.slug,
  });
  return (
    <li className={listItemClass}>
      <Link href={`/post/${slug}`}>
        <a className='inline-flex p-1 pl-0'>
          <ProgressMarker
            isCurrent={slug === query.slug}
            isCompleted={progress.find((item) => item.path === slug)}
          />
          {title}
        </a>
      </Link>
    </li>
  );
};
const ModuleItem = ({ module }) => <li className='py-2 font-bold'>{module}</li>;

const Sidebar = ({ units, router: { query }, progress, isSticky }) => {
  const sidebarClass = classNames({
    'p-4 bg-white border border-gray-200 md:border-0 m-4': true,
    'sticky top-0': isSticky,
  });

  return (
    <div className='relative col-span-3'>
      <div className={sidebarClass}>
        <div className='py-4'>
          <FeedbackFish projectId={FEEDBACK_FISH_ID}>
            <button
              className='inline-block w-full px-4 py-2 mb-4 text-center text-white transition-colors duration-200 bg-gray-200 rounded-sm bold hover:bg-blue-500'
              title='Leave a short review, question or feedback. Thank you!'
            >
              Give me feedback
            </button>
          </FeedbackFish>
          <CourseProgress
            units={units}
            progress={progress}
            className='hidden md:block'
          />
          <div className='md:p-0'>
            <ul>
              {units.map((unit) => {
                const item = unit.module ? (
                  <React.Fragment key={unit.slug}>
                    <ModuleItem module={unit.module} />
                    <UnitItem unit={unit} query={query} progress={progress} />
                  </React.Fragment>
                ) : (
                  <UnitItem
                    key={unit.slug}
                    unit={unit}
                    query={query}
                    progress={progress}
                  />
                );

                return item;
              })}
            </ul>
            <Link href='/'>
              <a className='inline-block w-full px-4 py-2 mt-4 text-center text-white transition-colors duration-200 bg-gray-200 rounded-sm bold hover:bg-blue-500'>
                ← Back to Overview
              </a>
            </Link>
            <ResetProgressBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Sidebar);
