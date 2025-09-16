import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Create',
      path: '/ebook-creation',
      icon: 'Plus',
      description: 'Start new ebook project'
    },
    {
      label: 'Library',
      path: '/download-manager',
      icon: 'Library',
      description: 'Manage your ebooks'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/ebook-creation') {
      return location?.pathname === path || location?.pathname === '/generation-progress' || location?.pathname === '/content-preview';
    }
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-subtle">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-gentle">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="BookOpen" size={20} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground leading-tight">
              AI EBook
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              Generator
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-gentle
                ${isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-subtle'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              title={item?.description}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-gentle"
          aria-label="Toggle mobile menu"
        >
          <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-moderate animate-slide-in">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-gentle
                  ${isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-subtle'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon name={item?.icon} size={18} />
                <div className="flex flex-col">
                  <span>{item?.label}</span>
                  <span className="text-xs opacity-75">{item?.description}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;