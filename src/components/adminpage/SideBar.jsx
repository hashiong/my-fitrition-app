import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();



  const toggleSidebar = () => setIsOpen(!isOpen);

  // Function to close the sidebar
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button 
        className="fixed top-0 left-0 z-50 p-2 m-2 bg-blue-900 text-white rounded-md shadow-lg md:hidden" 
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
          {isOpen ? (
            // Icon for "Close"
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          ) : (
            // Icon for "Menu"
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          )}
        </svg>
      </button>
      <div 
        className={`fixed top-0 left-0 h-full z-40 ${
          isOpen ? 'w-64' : 'w-0'
        } overflow-hidden bg-gray-800 text-white transition-width duration-300 ease-in-out md:w-32 md:z-auto`}
      >
        <ul className="space-y-2 text-center mt-10">
          <li>
            <Link to="/admin/menulist" className="block p-3 hover:bg-gray-700" onClick={closeSidebar}>Menu</Link>
          </li>
          <li>
            <Link to="/admin/editmenu" className="block p-3 hover:bg-gray-700" onClick={closeSidebar}>Edit</Link>
          </li>
          <li>
            <Link to="/admin/setannouncement" className="block p-3 hover:bg-gray-700" onClick={closeSidebar}>Announcement</Link>
          </li>
          <li>
            <Link to="/login" className="block p-3 hover:bg-gray-700" onClick={signOut}>Sign Out</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
