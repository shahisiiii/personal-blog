import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;