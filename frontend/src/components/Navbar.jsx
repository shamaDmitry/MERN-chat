import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="flex gap-2">
      <NavLink className="flex py-2 px-4 border" to="/">
        Home
      </NavLink>
      <NavLink className="flex py-2 px-4 border" to="/settings">
        settings
      </NavLink>
      <NavLink className="flex py-2 px-4 border" to="/profile">
        profile
      </NavLink>
    </nav>
  );
};
