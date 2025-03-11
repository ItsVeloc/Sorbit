// components/common/Header.js
import React from 'react';

const Header = ({ title, children }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">{title}</h1>
        {children && <nav className="nav-links">{children}</nav>}
      </div>
    </header>
  );
};

export default Header;