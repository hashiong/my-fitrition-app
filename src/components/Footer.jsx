import React from "react";
import phoneImage from "../assets/phone-white.png";

function Footer() {
    return (
        <footer className="bg-green-500">
            <div className="container mx-auto py-8 px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between">
                    {/* Address */}
                    <div className="flex flex-col justify-start mb-8 lg:mb-0">
                        <div className="text-white tracking-widest text-lg font-extrabold mb-3">
                            ADDRESS
                        </div>
                        <div className="text-white tracking-wide text-base font-medium">
                            500 S. Atlantic Blvd., #B<br />
                            Monterey Park, CA 91754
                        </div>
                        {/* Phone Numbers */}
                        <div className="flex mt-3">
                            <img src={phoneImage} alt="phone" className="h-6 mr-2" />
                            <a href="tel:+16263008068" className="text-xl font-bold text-white hover:text-green-100">
                                626-300-8068
                            </a>
                            <span className="mx-2 text-white">|</span>
                            <a href="tel:+16267081018" className="text-xl font-bold text-white hover:text-green-100">
                                626-708-1018
                            </a>
                        </div>
                    </div>
                    {/* Store Hours */}
                    <div className="flex flex-col items-start lg:items-end">
                        <div className="text-white tracking-widest text-lg font-extrabold mb-3">
                            STORE HOURS
                        </div>
                        <div className="text-white text-base font-medium">
                            <div className="mb-2">Monday - Thursday<br />11:00am - 6:30pm</div>
                            <div>Friday<br />1:00pm - 6:00pm</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
