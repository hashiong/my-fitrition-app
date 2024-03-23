import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Sidebar from "../components/adminpage/SideBar";
import { FirebaseProvider } from "../contexts/FirebaseContext";
import { MenuItemsProvider } from "../contexts/MenuItemsContext";
import MenuForm from "../components/adminpage/MenuForm";
import MenuList from "../components/adminpage/MenuList";
import EditMenu from "../components/adminpage/EditMenu";

function AdminPage() {
	return (
    <FirebaseProvider>
		<MenuItemsProvider>
			<div className="flex min-h-screen">
				<div className="w-32 p-10 bg-gray-200"> {/* Adjusted: Removed flex-1 and added background color for visibility */}
					<Sidebar />
				</div>
				<div className="flex-grow p-10"> {/* Adjusted: Changed from w-64 to flex-grow */}

					<Routes>
						<Route path="/menuform" element={<MenuForm />} />
						<Route path="/menulist" element={<MenuList />} />
						<Route path="/editmenu" element={<EditMenu />} />
						<Route path="*" element={<Navigate replace to="/admin/menulist" />} />
					</Routes>

				</div>
			</div>
			</MenuItemsProvider>
		</FirebaseProvider>
	);
}


export default AdminPage;
