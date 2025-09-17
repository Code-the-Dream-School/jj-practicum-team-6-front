import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaPlusCircle,
} from "react-icons/fa";
import ProfileMenu from "../ProfileMenu";

const InternalNavbar = () => {
  return (
    <div className="flex items-center justify-between">
      <nav className="flex gap-8 items-center">
        <Link to="/" title="Home" className="flex items-center gap-2 font-semibold">
          <FaHome className="text-2xl" />
        </Link>

        <Link to="/items/list" className="flex items-center gap-2 font-semibold">
          <span>All items</span>
        </Link>

        <Link to="/items/new" className="flex items-center gap-2 font-semibold">
          <FaPlusCircle className="text-[#E66240] text-xl" />
          <span className="text-[#E66240]">Add lost item</span>
        </Link>

        <Link to="/items/new" className="flex items-center gap-2 font-semibold">
          <FaPlusCircle className="text-[#7FD96C] text-xl" />
          <span className="text-[#7FD96C]">Add found item</span>
        </Link>
      </nav>

      <ProfileMenu />
    </div>
  );
};

export default InternalNavbar;
