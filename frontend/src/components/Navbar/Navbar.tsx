import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className='flex py-5 bg-[#CBE3FF] justify-between items-center px-10 w-full fixed'>
      <div className='flex items-center'>
        <img className='w-[30px]' src="/images/logo.png" alt="Archistock Logo" />
        <h1 className='text-2xl font-bold ml-2'>Archistock</h1>
      </div>
      <ul className='flex space-x-4'>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/pricing">Prix</Link></li>
        <li><Link to="/api">API</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup" className='bg-[#3794C5] py-1 px-3 rounded text-white'>Sign Up</Link></li>
      </ul>
    </nav>
  );
}
