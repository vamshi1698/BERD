import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          isActive
            ? 'bg-primary-700 text-white'
            : 'text-neutral-300 hover:bg-primary-600 hover:text-white'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <AlertCircle className="h-8 w-8 text-white" />
                <span className="ml-2 text-white font-bold text-lg">BERD System</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {user && (
                  <>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/map">Map</NavLink>
                    <NavLink to="/incidents">Incidents</NavLink>
                  </>
                )}
                {
                  user && user.role === 'admin' && (
                    <>
                      <NavLink to="/analytics">Analytics</NavLink>
                    </>
                  )
                }
                {!user && (
                  <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                  </>
                )
                }
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user && (
                <>
                  <button
                    type="button"
                    className="p-1 rounded-full text-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <NavLink
                      to='/alerts'
                    >
                      <Bell className="h-6 w-6" />
                    </NavLink>
                  </button>
                  <div className="ml-3 relative">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white mr-2">{user.name}</span>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-1 rounded bg-primary-700 text-white hover:bg-primary-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
              {!user && (
                <div className="space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-1 rounded bg-primary-700 text-white hover:bg-primary-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 rounded bg-white text-primary-700 hover:bg-neutral-100"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-200 hover:text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/map"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-primary-600"
                >
                  Map
                </Link>
                <Link
                  to="/incidents"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-primary-600"
                >
                  Incidents
                </Link>
                {user.role === 'admin' && (
                  <><Link to='/analytics' className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-primary-600">Analytics</Link></>
                )}
                
              </>
            )}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-primary-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-primary-700">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-neutral-300 mt-1">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-primary-600"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;