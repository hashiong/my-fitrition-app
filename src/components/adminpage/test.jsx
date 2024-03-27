import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useMenuItems } from "../../contexts/MenuItemsContext";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // This imports the default styling

function EditMenu() {
	const [startDate, setStartDate] = useState(new Date()); // State for the selected start date
	const [weekDates, setWeekDates] = useState([]); // Holds the dates for the week
	const [menuItems, setMenuItems] = useState([]);
	const { db } = useContext(FirebaseContext);
	const [selectedDay, setSelectedDay] = useState("Monday");
	const [searchQuery, setSearchQuery] = useState("");
	const [editableIndex, setEditableIndex] = useState(null);
	const { items, setItems } = useMenuItems(); // Assuming useMenuItems is a custom hook for fetching items
	// const [menuData, setMenuData] = useState([]);

	useEffect(() => {
		if (weekDates.length > 0) {
			// Make sure weekDates is not empty
			const dateForSelectedDay = mapDayToDate(selectedDay);
			if (dateForSelectedDay) {
				setMenuItems([]);
				fetchMenuData(dateForSelectedDay).then((data) => {
					// Check if data is not null and has at least one item
					if (data && data.length > 0 && data[0].menuItems) {
						setMenuItems(data[0].menuItems);
						console.log("Fetched Menu Data: ", data[0].menuItems);
					} else {
						// Handle the case where there are no menu items or data is null
						setMenuItems([]);
						console.log("No menu data available for this date");
					}
				});
			}
		}
	}, [selectedDay, weekDates]);

	useEffect(() => {
		console.log("startdate: " + startDate);
		const startOfWeek =
			startDate.getDate() -
			startDate.getDay() +
			(startDate.getDay() === 0 ? -6 : 1);

		console.log("startdat: " + startDate.getDay());
		let dates = [];

		for (let i = 0; i < 5; i++) {
			let date = new Date(startDate);
			date.setDate(startOfWeek + i);
			dates.push(date);
		}
		setMenuItems([]);
		setWeekDates(dates);
		console.log("week dates: " + weekDates);
	}, [startDate]);

	async function fetchMenuData(date) {
		// Ensure 'db' is your initialized Firestore instance
		const q = query(
			collection(db, "scheduledMenus"),
			where("date", "==", date)
		);

		try {
			const querySnapshot = await getDocs(q);
			const menuData = [];
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				console.log(doc.id, " => ", doc.data());
				menuData.push(doc.data());
			});
			// Now you have your menuData, you can set it to state or return it
			return menuData;
		} catch (error) {
			console.error("Error fetching menu data: ", error);
			return []; // Return an empty array or handle the error as needed
		}
	}

	const fetchItems = async () => {
		const querySnapshot = await getDocs(collection(db, "menuItems"));
		const itemsList = querySnapshot.docs
			.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			.sort((a, b) => a.ItemID - b.ItemID);
		setItems(itemsList);
	};

	if (items.length === 0) {
		fetchItems();
	}

	const handleAddMenuItem = () => {
		// Add a new "searchable" placeholder item to the menuItems state
		setMenuItems([...menuItems, { isEditable: true }]);
		setSearchQuery("");
	};

	const mapDayToDate = (day) => {
		const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
		const index = weekdays.indexOf(day);
		if (index === -1) {
			console.error(`Invalid day: ${day}`);
			return null;
		}
		const date = weekDates[index];
		return date ? date.toISOString().split("T")[0] : null;
	};

	const handleRemoveMenuItem = async (indexToRemove) => {
		const date = mapDayToDate(selectedDay); // Ensuring the date format is correct
		if (!date) return; // Guard clause if date is not valid

		const docRef = doc(db, "scheduledMenus", date);

		try {
			// First, get the current document to work with the latest menuItems
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const currentMenuItems = docSnap.data().menuItems;
				const updatedMenuItems = currentMenuItems.filter(
					(_, i) => i !== indexToRemove
				);

				// Update the document with the new menuItems array
				await updateDoc(docRef, {
					menuItems: updatedMenuItems,
				});

				// Then, update the local state to reflect this change
				setMenuItems(updatedMenuItems);
				console.log("Updated menuItems after removal:", updatedMenuItems);
			} else {
				console.log("Document does not exist!");
			}
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	};

	// const handleRemoveMenuItem = async(indexToRemove) => {
	// 	const date = mapDayToDate(selectedDay); // Assuming mapDayToDate returns the date in the required format
	// 	if (!date) return; // Guard clause if date is not valid

	// 	const docRef = doc(db, "scheduledMenus", date);

	// 	try {
	// 		const isNotEmpty = (obj) => Object.keys(obj).length > 0;
	// 		await deleteDoc(docRef);
	// 		console.log("Document successfully deleted!");
	// 		console.log("indexToRemove: " + indexToRemove);
	// 		const updatedMenuItems = menuItems.filter((_, i) => i !== indexToRemove)
	// 		setMenuItems(updatedMenuItems);
	// 		console.log("menuItems: " + menuItems);

	// 		const menuData = {
	// 			date: date,

	// 			menuItems: menuItems
	// 				.filter(isNotEmpty), // Optionally clean up menuItems before saving
	// 		};
	// 		await setDoc(docRef, menuData); // Save the data to Firestore
	// 		console.log("Menu saved successfully for date:", date);
	// 	} catch (error) {
	// 		console.error("Error removing document: ", error);
	// 	}

	// };

	const handleMenuItemChange = (index, value) => {
		setSearchQuery(value);
	};

	const handleInputBoxSelect = (index) => {
		console.log("index: " + index);
		setEditableIndex(index);
	};

	const handleSaveChanges = async () => {
		const date = mapDayToDate(selectedDay); // Format the date as YYYY-MM-DD
		console.log("savedate: ", date);
		// Create a reference to the document location you want to write to
		const docRef = doc(db, "scheduledMenus", date);

		const isNotEmpty = (obj) => Object.keys(obj).length > 0;
		// Data structure to save
		const menuData = {
			date: date,

			menuItems: menuItems
				.map(({ isEditable, ...keepAttrs }) => keepAttrs)
				.filter(isNotEmpty), // Optionally clean up menuItems before saving
		};

		try {
			await setDoc(docRef, menuData); // Save the data to Firestore
			console.log("Menu saved successfully for date:", date);
		} catch (error) {
			console.error("Error saving menu:", error);
		}
	};

	const handleClearAll = () => {
		// Clear all menu items for the selected day
		setMenuItems([]);
	};
	const handleDayChange = (day) => {
		setSelectedDay(day);
	};

	// Correctly implement handleAdd to accept an item and replace the first searchable item
	const handleAdd = (selectedItem) => {
		const updatedMenuItems = menuItems.map((menuItem, index) =>
			index === editableIndex
				? { ...selectedItem, isEditable: false }
				: menuItem
		);
		setMenuItems(updatedMenuItems);
		setSearchQuery("");
		setEditableIndex(null);
	};

	// console.log(items);

	return (
		<div className="p-8 font-semibold">
			<div className="flex flex-col items-center mb-4 sm:flex-row">
				<label className="mr-2 mb-2 sm:mb-0">Start Date:</label>
				<DatePicker
					selected={startDate}
					onChange={(date) => setStartDate(date)}
					className="text-center text-md datePickerInput flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700"
				/>
			</div>
			<div className="flex flex-wrap justify-center mt-4 space-x-4">
				{weekDates.map((date, index) => (
					<div
						key={index}
						className="text-center flex-1 px-4 py-2 font-bold text-blue-950 sm:flex-none w-full sm:w-auto"
					>
						{date.toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
						})}
					</div>
				))}
			</div>
			<div className="flex flex-wrap justify-center space-x-4 mt-4">
				{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
					<button
						key={day}
						className={`px-4 py-2 rounded ${
							selectedDay === day
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						} sm:flex-1`}
						onClick={() => handleDayChange(day)}
					>
						{day}
					</button>
				))}
			</div>
			<div className="mt-8">
				<table className="w-full">
					<thead>
						<tr>
							<th className="px-4 py-2">Item Name</th>
							<th className="px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{menuItems.map((menuItem, index) => (
							<tr key={index}>
								<td className="border px-4 py-2">
									{menuItem.isEditable ? (
										<>
											<input
												type="text"
												placeholder="Search for an item..."
												value={index === editableIndex ? searchQuery : ""}
												onChange={(e) =>
													handleMenuItemChange(index, e.target.value)
												}
												onClick={() => handleInputBoxSelect(index)}
												className="w-full"
											/>
											{index === editableIndex &&
												items
													.filter(
														(item) =>
															searchQuery !== "" &&
															(item.EnDescription.toLowerCase().includes(
																searchQuery.toLowerCase()
															) ||
																item.ChnDescription.toLowerCase().includes(
																	searchQuery.toLowerCase()
																) ||
																item.ItemID.toString().includes(searchQuery))
													)
													.map((item) => (
														<div
															key={item.id}
															className="p-4 mb-2 w-full bg-gray-100 rounded-lg shadow flex justify-between items-center"
														>
															<div className="">
																<p className="text-md font-semibold text-gray-500">
																	Item ID: {item.ItemID} {"  "}
																	<span className="font-bold text-lg text-black">
																		{" "}
																		{/* Adjusted for emphasis */}
																		{item.ChnDescription} ({item.EnDescription})
																	</span>{" "}
																	<span className="text-gray-600">
																		Category: {item.Category}
																	</span>
																</p>
															</div>
															<button
																onClick={() => handleAdd(item)}
																className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 rounded-lg"
															>
																Add
															</button>
														</div>
													))}
										</>
									) : (
										// For added items, display their information
										`${menuItem.ItemID} - ${menuItem.EnDescription} - (${menuItem.ChnDescription})`
									)}
								</td>
								<td className="border px-4 py-2">
									<button
										className="bg-red-500 text-white px-2 py-1 rounded mr-2"
										onClick={() => handleRemoveMenuItem(index)}
									>
										Remove
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="mt-4">
					<button
						className="bg-green-500 text-white px-4 py-2 rounded mr-4"
						onClick={handleAddMenuItem}
					>
						Add New Item
					</button>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
						onClick={handleSaveChanges}
					>
						Save Changes
					</button>
					<button
						className="bg-gray-500 text-white px-4 py-2 rounded"
						onClick={handleClearAll}
					>
						Clear All
					</button>
				</div>
			</div>
		</div>
	);
}

export default EditMenu;
