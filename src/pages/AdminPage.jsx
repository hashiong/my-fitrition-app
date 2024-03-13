import React from "react";
import MenuList from "../components/adminpage/MenuList";
import MenuForm from "../components/adminpage/MenuForm";
import { FirebaseProvider } from "../contexts/FirebaseContext";

function AdminPage() {
  return ( // Added the return statement here
    <FirebaseProvider>
      <div>
        <MenuForm />
        <MenuList />
      </div>
    </FirebaseProvider>
  );
}

export default AdminPage;
