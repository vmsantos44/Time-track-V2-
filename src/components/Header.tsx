import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart2, Briefcase, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Clock className="mr-2" /> TimeTrack
        </Link>
        {user && (
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="flex items-center hover:text-blue-200">
                  <Clock className="mr-1" size={18} /> Time Tracker
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="flex items-center hover:text-blue-200">
                  <BarChart2 className="mr-1" size={18} /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/projects" className="flex items-center hover:text-blue-200">
                  <Briefcase className="mr-1" size={18} /> Projects
                </Link>
              </li>
              <li>
                <button onClick={logout} className="flex items-center hover:text-blue-200">
                  <LogOut className="mr-1" size={18} /> Logout
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;