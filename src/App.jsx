import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Profile from "./pages/profile/Profile";
import EditItem from "./pages/items/EditItem";
import ItemDetail from "./pages/items/ItemDetail";
import ItemsList from "./pages/ItemsList";
import AddLostItemPage from "./pages/AddLostItemPage";
import AddFoundItemPage from "./pages/AddFoundItemPage";
import LandingPage from "./pages/LandingPage";

import MessagesPage from "./pages/MessagesPage";
import NotFound from "./pages/NotFound";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";

import "./index.css";

function App() {
  const location = useLocation();
  const hideHeader = ["/signin", "/signup"].includes(location.pathname);
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        {!hideHeader && <Header />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/items/list" element={<ItemsList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/items/edit/:id" element={<EditItem />} />
            <Route path="/items/new/lost" element={<AddLostItemPage />} />
            <Route path="/items/new/found" element={<AddFoundItemPage />} />
            <Route path="/threads" element={<MessagesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
