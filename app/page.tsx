export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to ECESTORMS
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Electrical and Computer Engineering Course Union for Toronto Metropolitan Students
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/about"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Learn More
          </a>
          <a
            href="/calendar"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            View Calendar <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
