import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={createBrowserRouter([
            { path: "/", element: <Home /> },
            {path:"/dashboard", element: <Dashboard/>},
          ])}
        />
      </QueryClientProvider>
    </>
  );
}

export default App;
