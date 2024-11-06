import { Link } from 'react-router-dom';
// import Login from '../pages/Login';
// import Register from '../pages/Register';

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}
