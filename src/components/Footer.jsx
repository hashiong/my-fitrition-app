import React from "react";
import phoneImage from "../assets/phone-white.png";

function Footer() {
	return (
		<footer>
			<div className="bg-green-500 w-full flex justify-between">
				<div className="flex-col justify-start my-14 mx-28">
					<div className="flex-row text-white tracking-widest text-lg font-extrabold">
							ADDRESS
					</div>
					<div className="flex-row my-5 text-white tracking-wide text-base font-medium">

							500 S. Atlantic Blvd., #B<br></br>
							Monterey Park, CA 91754{" "}
				
					</div>

					<div className="flex-row">
						<a
							href="tel:+16263008068"
							className="flex items-center text-xl font-bold text-white hover:text-green-100"
						>
							{/* Phone Icon */}
							<img src={phoneImage} alt="phone: " className="mr-2"/>
							626-300-8068
						</a>
					</div>
				</div>
                <div className="flex-col items-end my-14 mx-28 justify-end">
                    <div className="flex-row text-white tracking-widest text-lg font-extrabold">
                   
                                STORE HOUR
          
                    </div>
                    <div className="flex-row my-5 text-white text-center text-base font-medium">
                    Monday - Thursday<br></br>
                    11:00am - 7:30pm
                    </div>
                    <div className="flex-row my-5 text-white text-center text-base font-medium">
                    Friday<br></br>
                    1:00pm - 6:30pm
                    </div>
			</div>
            </div>
		</footer>
	);
}

export default Footer;
