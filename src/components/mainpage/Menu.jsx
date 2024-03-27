import React, { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import {
	doc,
	setDoc,
	collection,
	query,
	getDocs,
	where,
	getDoc,
	updateDoc,
} from "firebase/firestore"; // Import Firestore functions

import data from "../../data/test.json"; // Assuming this imports correctly and contains the menu data

function Menu() {
	const [menuData, setMenuData] = useState([]); // Use state to hold and manage the editable menu data
	const { db } = useContext(FirebaseContext);
	const [weekDates, setWeekDates] = useState([]); // Holds the dates for the week
	const [startDate, setStartDate] = useState(new Date()); // State for the selected start date

	const dayToCh = {
		Mon: "星期一",
		Tue: "星期二",
		Wed: "星期三",
		Thu: "星期四",
		Fri: "星期五",
	};

	const numToDay = {
		0: "Mon",
		1: "Tue",
		2: "Wed",
		3: "Thu",
		4: "Fri",
	};

	useEffect(() => {
		const startOfWeek =
			startDate.getDate() -
			startDate.getDay() +
			(startDate.getDay() === 0 ? -6 : 1);

		let dates = [];

		for (let i = 0; i < 5; i++) {
			let date = new Date(startDate);
			date.setDate(startOfWeek + i);
			dates.push(date.toISOString().split("T")[0]);
		}
		console.log("dates: " + dates);
		setWeekDates(dates);
	}, [startDate]);

    useEffect(() => {
        console.log(menuData);
    }, [menuData]); // This useEffect runs whenever menuData changes
    

	useEffect(() => {
		const fetchData = async () => {
			const promises = weekDates.map((date) => fetchMenuData(date)); // Create a promise for each date
            const results = await Promise.all(promises); // Wait for all promises to resolve
			setMenuData(results); // Assuming each result is {date: date, menuItems: []}
  
		};

		fetchData().catch(console.error); // Call the async function and catch any error
	}, [weekDates]);

	async function fetchMenuData(date) {
		// Ensure 'db' is your initialized Firestore instance
		const q = query(
			collection(db, "scheduledMenus"),
			where("date", "==", date)
		);

		try {
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) {
				// No documents found
				return [];
			}
			const dateMenu = [];
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				// console.log(doc.id, " => ", doc.data().menuItems);

				dateMenu.push(doc.data().menuItems);
			});
			// Now you have your menuData, you can set it to state or return it

			return dateMenu[0];
		} catch (error) {
			console.error("Error fetching menu data: ", error);
			return []; // Return an empty array or handle the error as needed
		}
	}

	return (
		<div>
			<div className="bg-green-500 w-full h-16 flex items-center justify-center">
				<p className="text-white tracking-widest text-2xl font-extrabold">
					每週菜單/WEEKLY MENU
				</p>
			</div>

			<div className="flex flex-col lg:flex-row mx-4 lg:mx-10 my-5 text-center">
                {menuData.map((dayMenu, index) => (
                    <div key={index} className="flex-1 mx-auto lg:mx-0 mb-8 lg:mb-0 border-b-2 md:border-l-2 md:border-b-0 md:basis-1/5 w-full">
                        <div className="text-2xl tracking-widest font-extrabold w-full">{numToDay[index]} {dayToCh[numToDay[index]]}</div>
                        <div className="text-lg tracking-widest font-bold md:mb-5">{weekDates[index]}</div>
                        {dayMenu.length > 0 ?(
                            <>
                                <div className="text-lg tracking-widest font-extrabold text-left mx-5">
                                    {dayMenu.map((item, index) => (
                                        <div key={index}>•{item.ChnDescription}</div>
                                    ))}
                                </div>
                                <div className="text-lg tracking-widest font-bold text-left mx-5">
                                    {dayMenu.map((item, index) => (
                                        <div key={index}>•{item.EnDescription}</div>
                                    ))}
                                </div>
                            </>) : (<>
                                <div className="text-lg tracking-widest font-extrabold text-left mx-5">•无菜单</div>
                            <div className="text-lg tracking-widest font-bold text-left mx-5">•No Menu Items for Today</div></>)}
                        
                    </div>
                ))}
            </div>
		</div>
	);
}

export default Menu;
