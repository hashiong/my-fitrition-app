import { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useMenuItems } from "../../contexts/MenuItemsContext";
import moment from "moment-timezone";
import {
	doc,
	setDoc,
	collection,
	query,
	getDocs,
	where,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EditMenu() {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [weekDates, setWeekDates] = useState([]);
	const [dayMenuSelections, setDayMenuSelections] = useState([]);
	const { db } = useContext(FirebaseContext);
	const [dayDisabled, setDayDisabled] = useState(Array(5).fill(false));
	const { items, setItems } = useMenuItems();

	// Fetch menu items only once or based on specific conditions
	useEffect(() => {
		const fetchMenuItems = async () => {
			const querySnapshot = await getDocs(collection(db, "menuItems"));
			const fetchedItems = querySnapshot.docs
				.map((doc) => ({ id: doc.id, ...doc.data() }))
				.sort((a, b) =>
					a.ChnDescription.localeCompare(b.ChnDescription, "zh-Hans", {
						sensitivity: "accent",
					})
				);
			setItems(fetchedItems);
		};

		if (!items.length) {
			fetchMenuItems();
		}
	}, [db, items.length, setItems]);

	const handleDayDisabledChange = (dayIndex) => {
		const newDayDisabled = [...dayDisabled];
		newDayDisabled[dayIndex] = !newDayDisabled[dayIndex];
		setDayDisabled(newDayDisabled);
	};

	// Update weekDates and reset dayMenuSelections when selectedDate changes
	useEffect(() => {
		const weekDates = Array.from({ length: 5 }, (_, i) => {
			const date = new Date(selectedDate);
			date.setDate(
				date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1) + i
			);
			return date;
		});
		setWeekDates(weekDates);
		setDayDisabled(Array(5).fill(false));

		const promises = weekDates.map((date) => {
			const formattedDate = moment(date)
				.tz("America/Los_Angeles")
				.format("YYYY-MM-DD");
			return fetchMenuData(formattedDate);
		});

		Promise.all(promises)
			.then((data) => setDayMenuSelections(data))
			.catch((error) => console.error("Error fetching menu data:", error));
	}, [selectedDate]);

	

	const fetchMenuData = async (date) => {
		const q = query(
			collection(db, "scheduledMenus"),
			where("date", "==", date)
		);

		try {
			const querySnapshot = await getDocs(q);
			let dayMenuData = Array(5).fill("");
			dayMenuData[3] = "1"; // Set the value at index 3 to 1 for each array
			querySnapshot.forEach((doc) => {
				const existingDayMenu = doc
					.data()
					.menuItems.map((item) => item.ItemID.toString());
				if(existingDayMenu.length !== 0){
					dayMenuData = existingDayMenu;
				}
			});
			return dayMenuData;
		} catch (error) {
			console.error("Error fetching menu data: ", error);
			return Array(5)
				.fill("")
				.map((_, index) => (index === 3 ? "1" : ""));
		}
	};

	const handleDropdownChange = (dayIndex, menuIndex, event) => {
		const newDayMenuSelections = [...dayMenuSelections];
		newDayMenuSelections[dayIndex] = [...newDayMenuSelections[dayIndex]];
		newDayMenuSelections[dayIndex][menuIndex] = event.target.value;
		setDayMenuSelections(newDayMenuSelections);
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		// Map for efficient item lookup by ID.
		const itemsMap = new Map(
			items.map((item) => [item.ItemID.toString(), item])
		);

		const newDayMenuSelections = dayMenuSelections.map((dayMenu, index) => {
			const date = moment(weekDates[index])
				.tz("America/Los_Angeles")
				.format("YYYY-MM-DD");
			const menuItems = dayMenu
				.map((selectionId) => (selectionId ? itemsMap.get(selectionId) : null))
				.filter((item) => item !== null);

			return { date, menuItems };
		});

		// Prepare all Firestore write operations.
		const firestoreWrites = newDayMenuSelections.map(
			({ date, menuItems }, i) => {
				const docRef = doc(db, "scheduledMenus", date);
				const payload = dayDisabled[i]
					? { date: date, menuItems: [] }
					: { date: date, menuItems };

				return setDoc(docRef, payload).catch((error) => {
					console.error(`Error saving menu for ${date}:`, error);
				});
			}
		);

		// Execute all writes concurrently.
		try {
			await Promise.all(firestoreWrites);
		} catch (error) {
			console.error("Error in batch saving menus:", error);
		}
	};

	return (
		<div className="p-4 font-semibold md:p-8">
			<div className="flex flex-col sm:flex-row items-center mb-4">
				<label className="mr-2 mb-2 sm:mb-0">Start Date:</label>
				<DatePicker
					selected={selectedDate}
					onChange={setSelectedDate}
					filterDate={(date) => date.getDay() === 1}
					className="text-center text-md flex-1 px-2 py-1 rounded bg-gray-200 text-gray-700 md:px-4 md:py-2"
				/>
			</div>
			{dayMenuSelections.length > 0 && (
				<form
					onSubmit={handleFormSubmit}
				>
					<div className="mt-4 flex flex-col gap-4 md:flex-row md:gap-2">
					{weekDates.map((date, index) => (
						<div key={index} className="flex-1">
							<div className="text-lg mb-3 px-4 py-2 rounded text-center bg-blue-500 text-white sm:px-2 sm:py-1">
								{date.toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
								<div className="mt-1 text-sm">
									<input
										type="checkbox"
										checked={dayDisabled[index]}
										onChange={() => handleDayDisabledChange(index)}
										className="mr-2"
									/>
									Disable Menu
								</div>
							</div>
							{dayDisabled[index] ? (
								<div>No Menu</div>
							) : (
								<div className="mt-3">
									<select
										value={dayMenuSelections[index][0]}
										onChange={(event) => handleDropdownChange(index, 0, event)}
										className="mb-1 bg-gray-50 border border-gray-300 text-gray-900 text rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									>
										<option value="">Select an Soup</option>
										{items
											.filter(
												(item) =>
													item.Category === "Soup" || item.Category === "soup"
											)
											.map((item, optionIndex) => (
												<option key={optionIndex} value={item.ItemID}>
													{item.ChnDescription}
												</option>
											))}
									</select>
									<select
										value={dayMenuSelections[index][1]}
										onChange={(event) => handleDropdownChange(index, 1, event)}
										className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									>
										<option value="">Select an Dish</option>
										{items
											.filter(
												(item) =>
													item.Category === "Dish" || item.Category === "dish"
											)
											.map((item, optionIndex) => (
												<option key={optionIndex} value={item.ItemID}>
													{item.ChnDescription}
												</option>
											))}
									</select>
									<select
										value={dayMenuSelections[index][2]}
										onChange={(event) => handleDropdownChange(index, 2, event)}
										className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									>
										<option value="">Select an Dish</option>
										{items
											.filter(
												(item) =>
													item.Category === "Dish" || item.Category === "dish"
											)
											.map((item, optionIndex) => (
												<option key={optionIndex} value={item.ItemID}>
													{item.ChnDescription}
												</option>
											))}
									</select>
									<select
										value={dayMenuSelections[index][3]}
										onChange={(event) => handleDropdownChange(index, 3, event)}
										className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									>
										{items
											.filter((item) => item.ItemID === 1)
											.map((item, optionIndex) => (
												<option key={optionIndex} value={item.ItemID}>
													{item.ChnDescription}
												</option>
											))}
									</select>
									<select
										value={dayMenuSelections[index][4]}
										onChange={(event) => handleDropdownChange(index, 4, event)}
										className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									>
										<option value="">Select an Dish</option>
										{items
											.filter(
												(item) =>
													item.Category === "Dish" || item.Category === "dish"
											)
											.map((item, optionIndex) => (
												<option key={optionIndex} value={item.ItemID}>
													{item.ChnDescription}
												</option>
											))}
									</select>
								</div>
							)}
						</div>
					))}
					
					</div>
					<div className="flex justify-center mt-4"> {/* Add this div wrapper */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 rounded md:px-4 md:py-2 tracking-4"
          >
            Submit
          </button>
        </div>
				</form>
			)}
		</div>
	);
}

export default EditMenu;
