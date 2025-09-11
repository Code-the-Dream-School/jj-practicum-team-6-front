import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { getAllData } from "./util/index";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import EditItem from "./pages/items/EditItem";
import ItemsList from './pages/ItemsList'
import AddLostItemPage from "./pages/AddLostItemPage";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Header from "./components/layout/Header";

import './index.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* One header for all pages */}
      <Header />
      
      <main className="flex-1">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth pages */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* App pages */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/items/list" element={<ItemsList />} />
          <Route path="/items/edit/:id" element={<EditItem />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;