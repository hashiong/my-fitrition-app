import React, { useState, useEffect } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useMenuItems } from "../../contexts/MenuItemsContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // This imports the default styling

function EditMenu() {
	const [selectedDate, setSelectedDate] = useState(new Date()); // State for the selected start date
	const [weekDates, setWeekDates] = useState([]); // Holds the dates for the week
	const [menuItems, setMenuItems] = useState([]);
	const [selectedDay, setSelectedDay] = useState("Monday");
	const [searchQuery, setSearchQuery] = useState("");
	const { items, setItems } = useMenuItems(); // Assuming useMenuItems is a custom hook for fetching items

	useEffect(() => {
		const startOfWeek =
			selectedDate.getDate() -
			selectedDate.getDay() +
			(selectedDate.getDay() === 0 ? -6 : 1);
		let dates = [];
		for (let i = 0; i < 5; i++) {
			let date = new Date(selectedDate);
			date.setDate(startOfWeek + i);
			dates.push(date);
		}
		setWeekDates(dates);
	}, [selectedDate]);

	const handleAddMenuItem = () => {
		// Add a new "searchable" placeholder item to the menuItems state
		setMenuItems([...menuItems, { isSearchable: true }]);
		console.log(menuItems);
		setSearchQuery("");
	};

	const handleRemoveMenuItem = (index) => {
		setMenuItems(menuItems.filter((_, i) => i !== index));
	};

	const handleMenuItemChange = (index, value) => {
		// Directly search the item list (assuming search logic is implemented elsewhere or items are pre-fetched)
		setSearchQuery(value);
	};

	const handleSaveChanges = () => {
		const updatedMenuItems = menuItems.map((item, index) => {
				const { isSearchable, ...rest } = item;
				return {
				...rest, // Spread operator to copy all existing properties of the item
				index: index // Add the index property
				};
			});
		console.log(updatedMenuItems)
		// Save changes to the menuItems for the selected day
		// You can implement this part using an API call to update the database
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
		const updatedMenuItems = menuItems.map((menuItem) =>
			menuItem.isSearchable
				? { ...selectedItem, isSearchable: false }
				: menuItem
		);
		setMenuItems(updatedMenuItems);
	};

	// console.log(items);

	return (
		<div className="p-8 font-smibold">
			Start Date:{" "}
			<DatePicker
				selected={selectedDate}
				onChange={(date) => setSelectedDate(date)}
				className="text-center text-md datePickerInput flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700"
			/>
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
									{menuItem.isSearchable ? (
										<>
											<input
												type="text"
												placeholder="Search for an item..."
												onChange={(e) =>
													handleMenuItemChange(index, e.target.value)
												}
												className="w-full"
											/>
											{items
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
