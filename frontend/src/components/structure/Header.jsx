// src/components/Header.js
import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import menuIcon from "../assets/icons/Menu.svg"; // Ensure this path is correct

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const baseNavLinkClasses = "px-6 py-3 text-xl hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500";

  return (
    <header className="bg-yellow-800 text-white w-full px-4 py-3 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center w-full md:w-auto">
        <Link to="/" className="font-medium ml-4 text-4xl font-Parisienne">
          Thai Hao Kitchen
        </Link>
        <nav className="hidden md:flex flex-row items-center justify-center ml-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseNavLinkClasses} ${isActive ? "bg-yellow-900 rounded-md" : ""}`
            }
            aria-current="page"
          >
            Sales
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `${baseNavLinkClasses} ${isActive ? "bg-yellow-900 rounded-md" : ""}`
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${baseNavLinkClasses} ${isActive ? "bg-yellow-900 rounded-md" : ""}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${baseNavLinkClasses} ${isActive ? "bg-yellow-900 rounded-md" : ""}`
            }
          >
            History
          </NavLink>
        </nav>
        {/* Mobile Menu Button */}
        <button className="md:hidden ml-auto">
          <img src={menuIcon} alt="Menu" />
        </button>
      </div>

      <div className="text-center text-lg mt-4 md:mt-0">
        <p>{formattedTime}</p>
        <p>{formattedDate}</p>
      </div>
    </header>
  );
}

export default Header;
