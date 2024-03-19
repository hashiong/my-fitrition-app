import React, { useState } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useMenuItems } from "../../contexts/MenuItemsContext";

function EditMenu() {
	const [selectedDay, setSelectedDay] = useState("Monday"); // Default selected day
	const [menuItems, setMenuItems] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const { items, setItems } = useMenuItems();

	const handleDayChange = (day) => {
		setSelectedDay(day);
		// Fetch menu items for the selected day from the database and set the menuItems state
		// You can implement this part using useEffect and an API call
	};

	const handleAddMenuItem = () => {
		// Add a new menu item to the menuItems state
		setMenuItems([...menuItems, { itemName: "" }]);
	};

    const handleAdd = () => {

    }

	const handleRemoveMenuItem = (index) => {
		// Remove a menu item from the menuItems state based on index
		setMenuItems(menuItems.filter((_, i) => i !== index));
	};

	const handleMenuItemChange = (index, field, value) => {
		// Update a menu item in the menuItems state based on index and field
		const updatedMenuItems = [...menuItems];
		updatedMenuItems[index][field] = value;
		setMenuItems(updatedMenuItems);
		setSearchQuery(value);
	};

	const handleSaveChanges = () => {
		// Save changes to the menuItems for the selected day
		// You can implement this part using an API call to update the database
	};

	const handleClearAll = () => {
		// Clear all menu items for the selected day
		setMenuItems([]);
	};

	console.log(items);

	return (
		<div className="p-8">
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
									<input
										type="text"
										value={menuItem.itemName}
										onChange={(e) =>
											handleMenuItemChange(index, "itemName", e.target.value)
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
