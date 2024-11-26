import './Header.css'
const Header = () => {

  return (
    <header className="app-header">
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>Travel Planner</h1>
        </div>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/settings">Settings</a></li>

        </ul>
      </nav>
    </header>
  );
};
export default Header;