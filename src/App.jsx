import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { getAllData } from "./util/index";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import EditItem from "./pages/items/EditItem";
import ItemsList from "./pages/ItemsList";

const URL = "http://localhost:8000/api/v1/";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const myData = await getAllData();
        setMessage(myData?.data ?? "Welcome to Retrieve");
      } catch (err) {
        console.error("getAllData failed:", err);
        setMessage("Welcome to Retrieve");
      }
    })();

    return () => {
      console.log("unmounting");
    };
  }, []);

  return (
   <>
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="text-lg">Logo</div>
        <nav className="flex gap-2">
          <Link to="/signin" className="px-3 py-1 rounded-full border">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1 rounded-full bg-black text-white"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<h1>{message}</h1>} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/items/list" element={<ItemsList />} />
        <Route path="/items/edit/:id" element={<EditItem />} />
      </Routes>
   </>
  );
}

export default App;
