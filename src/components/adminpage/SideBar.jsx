import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-32 bg-gray-800 text-white">
      <ul className="space-y-2 text-center mt-10">
        <li>
          <Link to="/admin/menulist" className="block p-3 hover:bg-gray-700">Menu</Link>
        </li>
        <li>
          <Link to="/admin/menuform" className="block p-3 hover:bg-gray-700">Modify</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
