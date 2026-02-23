import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-4">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button size="lg">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
