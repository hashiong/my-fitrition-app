import React from "react";
import logoImage from "../assets/logo.png"; // Replace with your logo's relative path
import phoneImage from "../assets/phone.png";

const Header = () => {
	return (
		<header className="bg-white text-black">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-row justify-center items-center border-b-2 h-full border-green-400 mb-3 pt-6 pb-3 md:justify-start md:space-x-10">
					{/* Logo and tagline container */}
					<div className="flex-col justify-center items-start lg:w-0 lg:flex-1">
						<img
							src={logoImage}
							alt="Fitrition Kitchen"
							className="h-18 w-auto"
						/>
						<p className="text-sm mt-5 font-extrabold text-gray-400 tracking-widest uppercase">
							HEALTHY CHOICE FOR ASIAN FOOD
						</p>
					</div>

					{/* Navigation Links */}
					<div >
						<nav className="space-x-10 mt-20">
							<a
								href="/"
								className="text-xl tracking-wide font-extrabold text-black hover:text-green-200"
							>
								HOME
							</a>
							<a
								href="/menu"
								className="text-xl tracking-wide font-extrabold text-black hover:text-green-200"
							>
								MENU
							</a>
						</nav>
					</div>

					{/* Rest of the header content */}
					<div className="flex-col justify-center md:flex items-end md:flex-1 lg:w-0 h-full">
						{/* Contact Number */}
						<div className="items-center justify-end h-10">
							<a
								href="tel:+16263008068"
								className="flex items-center text-xl font-bold text-green-600 hover:text-green-400"
							>
								{/* Phone Icon */}
								<img
									src={phoneImage}
									alt="phone: "
									className="h-5 w-auto mx-2"
								/>
								626-300-8068
							</a>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
