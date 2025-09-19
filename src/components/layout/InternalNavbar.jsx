import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaPlusCircle } from "react-icons/fa";
import ProfileMenu from "../ProfileMenu";

const InternalNavbar = () => {
  return (
    <div className="flex items-center justify-between">
      <nav className="flex gap-4 items-center whitespace-nowrap">
        <Link
          to="/items/list"
          className="flex items-center gap-2 font-semibold whitespace-nowrap"
        >
          <FaHome className="text-2xl" />
          <span>All items</span>
        </Link>

        <Link
          to="/items/new/lost"
          className="flex items-center gap-2 font-semibold whitespace-nowrap"
        >
          <FaPlusCircle className="text-[#E66240] text-xl" />
          <span className="text-[#E66240]">Add lost item</span>
        </Link>

        <Link
          to="/items/new/found"
          className="flex items-center gap-2 font-semibold whitespace-nowrap"
        >
          <FaPlusCircle className="text-[#7FD96C] text-xl" />
          <span className="text-[#7FD96C]">Add found item</span>
        </Link>
      </nav>

      <ProfileMenu />
    </div>
  );
};

export default InternalNavbar;
