import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-16 px-4 bg-white font-display">
      <div className="text-center max-w-lg">
        {/* Large 404 Number */}
        <div className="text-8xl font-light text-gray-300 leading-none mb-4 tracking-tight">
          404
        </div>

        {/* Error Title */}
        <h1 className="text-5xl font-bold text-ink mb-4 leading-tight">
          Oops!
        </h1>

        {/* Error Subtitle */}
        <p className="text-xl text-gray600 mb-8 leading-relaxed">
          Looks like this page is lost too :(
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-md hover:bg-[#ea580c] hover:-translate-y-0.5 hover:shadow-lg no-underline"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
