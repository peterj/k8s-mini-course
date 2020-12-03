import dynamic from "next/dynamic";
import Link from "next/link";

const UnitProgress = dynamic(() => import("./UnitProgress"), {
  ssr: false,
});

const Unit = ({ unit, index, isCompleted }) => {
  const { slug, title, excerpt } = unit;

  return (
    <li className="relative z-10 border border-t-0 border-gray-200">
      <Link key={slug} href={`post/${slug}`}>
        <a
          className="relative block p-2 px-4 transition-colors duration-200 hover:bg-gray-100"
          href={`post/${slug}`}
        >
          <span className="flex">
            <span className="self-center flex-shrink-0 w-12 text-4xl text-right text-gray-200 opacity-75">
              {index + 1}
            </span>
            <span className="self-center pl-4">
              <strong className="text-gray-400">{title}</strong>
              <br />
              <span className="text-sm text-gray-400 opacity-75">
                {excerpt}
              </span>
            </span>
            <span className="self-center ml-auto">
              <UnitProgress isCompleted={isCompleted} />
            </span>
          </span>
        </a>
      </Link>
    </li>
  );
};

export default Unit;
