import React, { useState } from "react";
import NavBar from "./NavBar";
import logo from "../images/sehr_logo.png";
import background3d from "./Background3D"; // Keeping import if needed later, but using image overlay

function LandingPage() {
  const [hoveredBlock, setHoveredBlock] = useState(null);

  const medicalBg = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";

  const blocks = [
    {
      id: "patient",
      title: "Patient",
      icon: "👤",
      color: "from-blue-500 to-cyan-500",
      actions: [
        { label: "Login", path: "/patient_login" },
        { label: "Register", path: "/patient_registration" },
      ],
    },
    {
      id: "doctor",
      title: "Doctor",
      icon: "👨‍⚕️",
      color: "from-teal-500 to-emerald-500",
      actions: [
        { label: "Login", path: "/doctor_login" },
        { label: "Register", path: "/doctor_registration" },
      ],
    },
    {
      id: "admin",
      title: "Admin",
      icon: "🛡️",
      color: "from-purple-500 to-indigo-500",
      actions: [
        { label: "Login", path: "/diagnostic_login" },
        { label: "Register", path: "/diagnostic_registration" },
        { label: "Skip (Demo)", path: "/diagnostic/123456" },
      ],
    },
  ];

  // ... blogs ...
  const blogs = [
    {
      id: 1,
      title: "Blockchain Revolutionizing Healthcare Data",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      excerpt: "Explore how decentralized ledgers are securing patient records globally.",
      url: "https://www.ibm.com/topics/blockchain-healthcare"
    },
    {
      id: 2,
      title: "The Future of Electronic Health Records (EHR)",
      image: "https://images.unsplash.com/photo-1576091160550-217358d7c49f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      excerpt: "Why interoperability and security are the key drivers for next-gen EHR systems.",
      url: "https://www.healthit.gov/faq/what-electronic-health-record-ehr"
    },
    {
      id: 3,
      title: "Patient Privacy in the Digital Age",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      excerpt: "Understanding data ownership and consent in modern medical applications.",
      url: "https://www.hhs.gov/hipaa/index.html"
    },
  ];

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      <NavBar />

      {/* Hero Section with Medical Background */}
      <div className="relative h-screen flex flex-col items-center justify-center">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={medicalBg}
            alt="Medical Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>

          {/* Watermark Logo Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <img src={logo} alt="" className="w-[90vw] max-w-[1200px] object-contain opacity-10 grayscale blur-[2px] transform scale-110" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto -mt-20">
          <img
            src={logo}
            alt="SEHR Logo"
            className="h-40 sm:h-52 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)] animate-fade-in-down"
          />
          {/* Removed text H1 as per request to replace with logo */}

          {/* Keeping subtitle optionally or removing if logo has text. Keeping for clarity */}
          <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide mb-12 animate-fade-in-up">
            Secure. Transparent. Decentralized.
          </p>

          {/* Compact Action Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
            {blocks.map((block) => (
              <div
                key={block.id}
                className={`relative group bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-${block.color.split("-")[1]}-500/30 hover:-translate-y-2`}
                onMouseEnter={() => setHoveredBlock(block.id)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                {/* Default State (Icon + Title) */}
                <div className={`p-6 flex flex-col items-center justify-center h-48 transition-opacity duration-300 ${hoveredBlock === block.id ? "opacity-0 absolute inset-0" : "opacity-100"}`}>
                  <span className="text-5xl mb-4 drop-shadow-md">{block.icon}</span>
                  <h3 className="text-xl font-bold tracking-wider">{block.title}</h3>
                </div>

                {/* Hover State (Buttons) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${block.color} p-6 flex flex-col items-center justify-center space-y-3 transition-opacity duration-300 ${hoveredBlock === block.id ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <h3 className="text-xl font-bold mb-2 text-white">{block.title}</h3>
                  {block.actions.map((action) => (
                    <a
                      key={action.label}
                      href={action.path}
                      className="block w-full py-2 px-4 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-colors text-center backdrop-blur-sm border border-white/20"
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <section className="bg-black/90 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Latest Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300 border border-gray-700 group">
                <div className="h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">{blog.title}</h3>
                  <p className="text-gray-400 text-sm">{blog.excerpt}</p>
                  <a
                    href={blog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-teal-400 text-sm font-semibold hover:text-teal-300 flex items-center inline-block"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="bg-black py-8 text-center text-gray-600 text-xs tracking-widest uppercase">
        © 2026 SEHR • Decentralized Healthcare
      </div>
    </div>
  );
}

export default LandingPage;