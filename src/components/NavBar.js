import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/sehr_logo.png";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = (path) => `
    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
    ${location.pathname === path
      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
      : "text-gray-600 hover:text-teal-600 hover:bg-gray-100"}
  `;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* Brand / Logo */}
          <div className="flex-shrink-0 cursor-pointer group flex items-center space-x-3" onClick={() => navigate("/")}>
            <img src={logo} alt="SEHR Logo" className="h-20 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 group-hover:to-teal-300 transition-all duration-500">
                SEHR
              </h1>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase hidden sm:block">Secure Electronic Health Records</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button className={navLinkClass("/")} onClick={() => navigate("/")}>
                Home
              </button>
              <button className={navLinkClass("/AboutPage")} onClick={() => navigate("/AboutPage")}>
                About
              </button>
              <button className={navLinkClass("/register")} onClick={() => navigate("/register")}>
                Register
              </button>
              <button className={navLinkClass("/login")} onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
          </div>

          {/* Mobile Menu Button (Hamburger) - simplified for brevity, usually needs state */}
          <div className="-mr-2 flex md:hidden">
            <button className="text-gray-400 hover:text-white inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
