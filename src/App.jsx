import React, { useState } from 'react'
import './App.css'
import { Outlet, Link, useNavigate } from 'react-router'
import facade from './apiFacade'

function App() {
  const [loggedIn, setLoggedIn] = useState(facade.loggedIn());
  const navigate = useNavigate();

  const handleLogout = () => {
    facade.logout();
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <nav style={{ padding: "20px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Trips & Guides</h1>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#333" }}>Home</Link>
          <Link to="/trips" style={{ textDecoration: "none", color: "#333" }}>Trips</Link>
          <Link to="/guides" style={{ textDecoration: "none", color: "#333" }}>Guides</Link>
          {loggedIn ? (
            <button onClick={handleLogout} style={{ padding: "8px 16px", cursor: "pointer" }}>Logout</button>
          ) : (
            <Link to="/login">
              <button style={{ padding: "8px 16px", cursor: "pointer" }}>Login</button>
            </Link>
          )}
        </div>
      </nav>
      <Outlet context={{ loggedIn, setLoggedIn }} />
    </>
  )
}

export default App
