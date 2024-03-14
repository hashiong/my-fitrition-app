import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../components/adminpage/SideBar";
import { FirebaseProvider } from "../contexts/FirebaseContext";
import MenuForm from "../components/adminpage/MenuForm";
import MenuList from "../components/adminpage/MenuList";

function AdminPage() {
	return (
    <FirebaseProvider>
			<div className="flex min-h-screen">
				<div className="w-32 p-10 bg-gray-200"> {/* Adjusted: Removed flex-1 and added background color for visibility */}
					<Sidebar />
				</div>
				<div className="flex-grow p-10"> {/* Adjusted: Changed from w-64 to flex-grow */}

					<Routes>
						<Route path="/menuform" element={<MenuForm />} />
						<Route path="/menulist" element={<MenuList />} />
					</Routes>

				</div>
			</div>
		</FirebaseProvider>
	);
}


export default AdminPage;
