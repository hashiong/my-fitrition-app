import React from "react";
import Header from "../components/mainpage/Header";
import Menu from "../components/mainpage/Menu";
import Footer from "../components/mainpage/Footer";
import Announcement from "../components/mainpage/Announcement";

function MenuPage() {
	return (
		<div>
			<Header />
			<Announcement />
			<Menu />
			<br></br>
			<Footer />
		</div>
	);
}

export default MenuPage;
