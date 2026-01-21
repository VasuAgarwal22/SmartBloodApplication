import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', path: '/home-dashboard', icon: 'LayoutDashboard' },
    { label: 'Request Blood', path: '/request-blood', icon: 'Droplet', emergencyLevel: 'critical' },
    { label: 'Priority Queue', path: '/emergency-priority-queue', icon: 'ListOrdered' },
    { label: 'Find Donors', path: '/nearest-donor-finder', icon: 'MapPin' },
    { label: 'Ambulance', path: '/ambulance-tracking', icon: 'Ambulance' }
  ];

  const moreItems = [
    { label: 'Admin', path: '/admin-dashboard', icon: 'Settings' }
  ];

  const isActive = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header-nav">
        <div className="header-container">
          <Link to="/home-dashboard" className="header-logo">
            <div className="header-logo-icon">
              <Icon name="Droplet" size={24} color="#FFFFFF" />
            </div>
            <span className="hidden sm:inline">SmartBloodApplication</span>
          </Link>

          <nav className="header-nav-list">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`header-nav-item ${isActive(item?.path) ? 'active' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <Icon name={item?.icon} size={18} />
                  {item?.label}
                </span>
              </Link>
            ))}
            
            <div className="relative group">
              <button className="header-nav-item flex items-center gap-1">
                <Icon name="MoreHorizontal" size={18} />
                <span>More</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-250 z-50">
                {moreItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-250 first:rounded-t-lg last:rounded-b-lg ${
                      isActive(item?.path) ? 'bg-muted' : ''
                    }`}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span className="text-sm font-medium">{item?.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="header-actions">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex"
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                }}
              >
                <Icon name="LogOut" size={18} />
                <span className="ml-2">Logout</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => {
                document.documentElement?.classList?.toggle('dark');
              }}
            >
              <Icon name="Moon" size={20} />
            </Button>

            <button
              className="header-mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div className="header-mobile-menu">
          <nav className="header-mobile-nav">
            {[...navigationItems, ...moreItems]?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`header-mobile-nav-item ${isActive(item?.path) ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="flex items-center gap-3">
                  <Icon name={item?.icon} size={20} />
                  {item?.label}
                </span>
              </Link>
            ))}
            
            {user && (
              <button
                className="header-mobile-nav-item mt-4"
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                  closeMobileMenu();
                }}
              >
                <span className="flex items-center gap-3">
                  <Icon name="LogOut" size={20} />
                  Logout
                </span>
              </button>
            )}
            <button
              className="header-mobile-nav-item mt-4"
              onClick={() => {
                document.documentElement?.classList?.toggle('dark');
              }}
            >
              <span className="flex items-center gap-3">
                <Icon name="Moon" size={20} />
                Toggle Dark Mode
              </span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;