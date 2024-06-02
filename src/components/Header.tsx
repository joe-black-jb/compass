import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const Header = () => {
  return (
    <div className="bg-orange-300">
      <nav>
        <div className="flex">
          <Link to="/" className="hover:bg-orange-500">
            <Button label="Home" />
          </Link>
          <Link to="/about" className="hover:bg-orange-500 ml-4">
            <Button label="About" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Header;
