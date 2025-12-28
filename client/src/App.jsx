import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppContextData } from "../context/AppContext";
import { assets } from "./assets/assets";
import ChatBox from "../components/ChatBox";
import Credits from "../pages/Credits";
import Community from "../pages/Community";
import "./assets/prism.css";
import Loading from "../pages/Loading";
import Login from "../pages/Login";
import {Toaster} from 'react-hot-toast'
const App = () => {
  const data = useContext(AppContextData);
  const { user,loadingUser ,} = useContext(AppContextData);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { pathname } = useLocation();
  if (pathname === "/loading" || loadingUser) return <Loading />;
  return (
    <>
    <Toaster/>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md-hidden not-dark:invert"
          onClick={() => {
            setIsMenuOpen(true);
          }}
        />
      )}
      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
              <Route path="/loading" element={<Loading />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div
          className="bg-gradiant-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
