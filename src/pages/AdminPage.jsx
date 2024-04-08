// AdminPage.js
import { Navigate, Routes, Route } from "react-router-dom";
import Sidebar from "../components/adminpage/SideBar";
import MenuList from "../components/adminpage/MenuList";
import EditMenu from "../components/adminpage/EditMenu";
import EditMenuAlt from "../components/adminpage/EditMenuAlt";
import SetAnnouncement from "../components/adminpage/SetAnnouncement";
function AdminPage() {


  return (
    <div className="flex min-h-screen">
      <div className="md:w-32 md:p-10 bg-gray-200">
        <Sidebar />
      </div>
      <div className="flex-grow p-10">
        <Routes>
          <Route path="/menulist" element={<MenuList />} />
          <Route path="/editmenu" element={<EditMenu />} />
          <Route path="/editmenualt" element={<EditMenuAlt />} />
          <Route path="/setannouncement" element={<SetAnnouncement />} />
          <Route path="*" element={<Navigate replace to="/admin/menulist" />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminPage;
