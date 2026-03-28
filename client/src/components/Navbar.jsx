import { Link, useNavigate, useLocation } from "react-router-dom";
import { publicMenu, privateMenu } from "./menuData";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  return (
    <div className="navbar bg-base-100 shadow-md fixed top-0 left-0 right-0 z-50 px-4 sm:px-10 py-3">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-base font-medium">
            {(user ? privateMenu : publicMenu).map((menuItem) => (
              <li key={menuItem.id}>
                <Link to={menuItem.path} className={location.pathname === menuItem.path ? "active" : ""}>
                    {menuItem.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-2xl font-bold">MailCraft</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-base font-medium">
          {(user ? privateMenu : publicMenu).map((menuItem) => (
            <li key={menuItem.id}>
                <Link to={menuItem.path} className={location.pathname === menuItem.path ? "active" : ""}>
                    {menuItem.title}
                </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-4">
        {user ? (
            <div className="flex items-center gap-4">
                <span className="text-base font-medium hidden md:block">
                  Hi, <span className="text-primary font-bold">{user.userName}</span>
                </span>
                <button onClick={handleLogout} className="btn btn-error btn-sm text-white">Logout</button>
            </div>
        ) : (
            <div className="flex items-center gap-2">
                <Link to="/signin" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm text-white">Signup</Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
