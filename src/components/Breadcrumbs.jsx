import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="list-none flex gap-2">
        <li>
          <Link to="/" className="hover:underline text-pink-600 font-semibold">Home</Link>
        </li>
        {pathnames.map((name, idx) => {
          const routeTo = '/' + pathnames.slice(0, idx + 1).join('/');
          const isLast = idx === pathnames.length - 1;
          return (
            <li key={routeTo} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="font-bold text-gray-700">{decodeURIComponent(name.charAt(0).toUpperCase() + name.slice(1))}</span>
              ) : (
                <Link to={routeTo} className="hover:underline text-pink-600">{decodeURIComponent(name.charAt(0).toUpperCase() + name.slice(1))}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
} 