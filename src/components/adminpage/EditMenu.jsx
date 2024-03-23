import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useMenuItems } from "../../contexts/MenuItemsContext";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
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

	useEffect(() => {
		const startOfWeek =
			startDate.getDate() -
			startDate.getDay() +
			(startDate.getDay() === 0 ? -6 : 1);
		let dates = [];
		for (let i = 0; i < 5; i++) {
			let date = new Date(startDate);
			date.setDate(startOfWeek + i);
			dates.push(date);
		}
		setMenuItems([]);
		setWeekDates(dates);
	}, [startDate]);

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

	const handleRemoveMenuItem = (index) => {
		setMenuItems(menuItems.filter((_, i) => i !== index));
	};

	const handleMenuItemChange = (index, value) => {
		setSearchQuery(value);
	};

	const handleInputBoxSelect = (index) => {
		console.log("index: " + index);
		setEditableIndex(index);
	};

	const handleSaveChanges = async () => {
		const date = mapDayToDate(selectedDay); // Format the date as YYYY-MM-DD

		// Create a reference to the document location you want to write to
		const docRef = doc(db, "scheduledMenus", date);

		// Data structure to save
		const menuData = {
			date: date,
			menuItems: menuItems.map(({ isEditable, ...keepAttrs }) => keepAttrs), // Optionally clean up menuItems before saving
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
			<div className="flex items-center mb-4">
				<label className="mr-2">Start Date:</label>
				<DatePicker
					selected={startDate}
					onChange={(date) => setStartDate(date)}
					className="text-center text-md datePickerInput flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700"
				/>
			</div>
			<div className="flex space-x-4 mt-4">
				{weekDates.map((date, index) => (
					<div
						key={index}
						className="text-center flex-1 px-4 py-2 font-bold text-blue-950"
					>
						{date.toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
						})}
					</div>
				))}
			</div>
			<div className="flex space-x-4">
				{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
					<button
						key={day}
						className={`flex-1 px-4 py-2 rounded ${
							selectedDay === day
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}
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
