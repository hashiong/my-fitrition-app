import React from "react";
import Header from "../components/mainpage/Header";
import Menu from "../components/mainpage/Menu";
import Footer from "../components/mainpage/Footer";
import Announcement from "../components/mainpage/Announcement";
import { FirebaseProvider } from "../contexts/FirebaseContext";

function MenuPage() {
	return (
		<FirebaseProvider>
			<div>
				<Header />
				<Announcement />
				<Menu />
				<br></br>
				<Footer />
			</div>
		</FirebaseProvider>
	);
}

export default MenuPage;
