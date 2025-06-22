import { FaMicrochip } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="sm:text-2xl text-xl font-bold text-blue-600 flex items-center gap-2">
          <FaMicrochip />
          DevOps Forecast
        </h1>
      </header>

      <main className="flex flex-col-reverse md:flex-row items-center justify-between sm:gap-10 gap-3 sm:px-8 px-5 sm:pt-8 pt-4 max-w-6xl mx-auto">
        <div className="md:w-1/2">
          <h2 className="sm:text-4xl text-2xl font-extrabold mb-4 text-gray-800">
            Smarter Resource Planning for DevOps Pipelines
          </h2>
          <p className="text-gray-600 mb-6 text-base">
            This project uses machine learning to predict resource usage (like
            CPU, memory, and storage) so DevOps teams can avoid crashes, reduce
            costs, and stay ahead of demand. Forecast future spikes using real
            data and automate smart decisions.
          </p>
          <ul className="list-disc list-inside sm:text-base text-sm text-gray-700 mb-6 space-y-2">
            <li>Forecast usage using LSTM, ARIMA & Prophet</li>
            <li>Visualize trends with beautiful dashboards</li>
            <li>Connect with DevOps tools for smart scaling</li>
          </ul>
          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-4xl shadow-lg text-lg hover:bg-blue-700 transition"
          >
            View Resource Dashboard
          </Link>
        </div>

        <div className="md:w-1/2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/11153/11153595.png"
            alt="DevOps Forecasting"
            className="w-full max-w-md sm:h-auto h-40 mx-auto"
          />
        </div>
      </main>

      <footer className="text-center sm:text-base text-xs text-gray-500 py-4 sm:mt-auto mt-10">
        &copy; 2025 DevOps Forecast | Final Year Project by Nirajan Mahato
      </footer>
    </div>
  );
};

export default Home;
