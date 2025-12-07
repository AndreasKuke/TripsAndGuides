import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home.jsx";
import Trips from "./components/Trips.jsx";
import TripDetail from "./components/TripDetail.jsx";
import Guides from "./components/Guides.jsx";
import Login from "./components/Login.jsx";
import LoggedIn from "./components/LoggedIn.jsx";

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Main Route */}
        <Route path="/" element={<App />}>
          {/* Index route / home route */}
          <Route index element={<Home />} />

          {/* Trips routes */}
          <Route path="trips" element={<Trips />} />
          <Route path="trips/:id" element={<TripDetail />} />

          {/* Guides route */}
          <Route path="guides" element={<Guides />} />

          {/* Login route */}
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
