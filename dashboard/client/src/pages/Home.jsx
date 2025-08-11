import { FaMicrochip } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="sm:text-2xl text-xl font-bold text-blue-700 flex items-center gap-2">
            <FaMicrochip />
            DevOps Pipeline Intelligence
          </h1>
          <Link
            to="/dashboard"
            className="hidden sm:inline-block bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Open Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 sm:gap-10 px-5 sm:px-8 pt-6 sm:pt-12 max-w-6xl mx-auto w-full">
        {/* Copy */}
        <div className="md:w-1/2">
          <h2 className="sm:text-4xl text-3xl font-extrabold mb-4 text-slate-900 leading-tight">
            Predict CI/CD Job Durations — Plan Faster, Ship Smarter
          </h2>

          <p className="text-slate-600 mb-5 sm:text-base text-sm">
            This project uses machine learning to estimate how long your build and
            test jobs will take in a pipeline. Instead of guessing or padding time,
            you get real-time duration predictions based on context like{" "}
            <span className="font-semibold">test suite</span>,{" "}
            <span className="font-semibold">time of day</span>,{" "}
            <span className="font-semibold">day of week</span>, and{" "}
            <span className="font-semibold">pull request vs regular builds</span>.
          </p>

          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2 sm:text-base text-sm">
            <li>
              <span className="font-semibold">LightGBM</span>-based model trained on historical pipeline runs
            </li>
            <li>React dashboard for instant predictions and visual insights</li>
            <li>Flask ML API with a lightweight Node.js proxy</li>
            <li>Reduce waiting, prioritize agents, and optimize infrastructure use</li>
          </ul>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-md text-base font-semibold hover:bg-blue-700 transition"
            >
              View Dashboard
            </Link>
            <a
              href="#how-it-works"
              className="inline-block px-6 py-3 rounded-2xl text-blue-700 bg-blue-100/70 border border-blue-200 font-semibold hover:bg-blue-100 transition"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Illustration */}
        <div className="md:w-1/2">
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 -z-10 blur-2xl bg-gradient-to-tr from-blue-200/60 via-indigo-200/50 to-transparent rounded-[32px]" />
            <img
              src="https://cdn-icons-png.flaticon.com/512/11153/11153595.png"
              alt="CI/CD Prediction"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </main>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 w-full">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Collect</h3>
            <p className="text-slate-600 text-sm">
              Ingest historical pipeline data (build type, test suite, timestamps) from CI runs
              and clean it for modeling.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Learn</h3>
            <p className="text-slate-600 text-sm">
              Train a LightGBM model to capture time patterns and suite complexity for accurate
              duration estimates.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Predict</h3>
            <p className="text-slate-600 text-sm">
              Query the Flask API via the Node.js proxy and view predictions, trends, and accuracy
              on the React dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center sm:text-base text-xs text-gray-500 py-6 mt-auto">
        &copy; 2025 DevOps Pipeline Intelligence · Final Year Project by Nirajan Mahato
      </footer>
    </div>
  );
};

export default Home;
