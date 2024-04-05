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
	getDoc,
	updateDoc,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EditMenu() {
	const [startDate, setStartDate] = useState(new Date());
	const [weekDates, setWeekDates] = useState([]);
	const [menuItems, setMenuItems] = useState([]);
	const [selections, setSelections] = useState([]);
	const { db } = useContext(FirebaseContext);
	const { items, setItems } = useMenuItems();

	// Fetch items only once or based on specific conditions
	useEffect(() => {
		const fetchItems = async () => {
			const querySnapshot = await getDocs(collection(db, "menuItems"));
			const fetchedItems = querySnapshot.docs
				.map((doc) => ({ id: doc.id, ...doc.data() }))
				.sort((a, b) => a.ItemID - b.ItemID);
			setItems(fetchedItems);
		};

		if (!items.length) {
			fetchItems();
		}
	}, [db, items.length, setItems]);

	// Update weekDates and reset selections when startDate changes
	useEffect(() => {
		const dates = Array.from({ length: 5 }, (_, i) => {
			const date = new Date(startDate);
			date.setDate(
				date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1) + i
			);
			return date;
		});
		setWeekDates(dates);

		// // Update here for setting the value at index 3 to 1
		// const initialSelections = dates.map(() => {
		// 	let arr = Array(5).fill("");
		// 	arr[3] = "1"; // Set the value at index 3 to 1 for each array
		// 	return arr;
		// });

		const promises = dates.map((date) => {
			const formattedDate = moment(date)
				.tz("America/Los_Angeles")
				.format("YYYY-MM-DD");
			return fetchMenuData(formattedDate);
		});

		Promise.all(promises)
			.then((data) => {
				console.log("Fetched data structure:", data); // Check the structure here
				setSelections(data);
			})
			.catch((error) => {
				console.error("Error fetching menu data:", error);
			});
	}, [startDate]);

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
				dayMenuData = existingDayMenu
			});
			console.log("fetching")
			return dayMenuData;
		} catch (error) {
			console.error("Error fetching menu data: ", error);
			let arr = Array(5).fill("");
			arr[3] = "1"; // Set the value at index 3 to 1 for each array
			return arr;
		}
	};

	const handleDropdownChange = (dayIndex, menuIndex, event) => {
		const newSelections = [...selections];
		newSelections[dayIndex] = [...newSelections[dayIndex]];
		newSelections[dayIndex][menuIndex] = event.target.value;
		setSelections(newSelections);
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		const newSelections = selections.map((dayMenu, index) => {
			const date = moment(weekDates[index])
				.tz("America/Los_Angeles")
				.format("YYYY-MM-DD");
			const menuItems = dayMenu
				.map((selectionId) => {
					if (selectionId) {
						return items.find((item) => item.ItemID.toString() === selectionId);
					}
					return null;
				})
				.filter((item) => item !== null);

			return { date, menuItems };
		});

		for (let i = 0; i < newSelections.length; i++) {
			const date = newSelections[i].date;
			const docRef = doc(db, "scheduledMenus", date);

			try {
				await setDoc(docRef, newSelections[i]);
			} catch (error) {
				console.error("Error saving menu:", error);
			}
		}
	};

	return (
		<div className="p-8 font-semibold sm:p-4">
			<div className="flex items-center mb-4">
				<label className="mr-2 sm:mr-1">Start Date:</label>
				<DatePicker
					selected={startDate}
					onChange={(date) => setStartDate(date)}
					filterDate={(date) => date.getDay() === 1}
					className="text-center text-md datePickerInput flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700 sm:px-2 sm:py-1"
				/>
			</div>
			{selections.length > 0 && (
				<form onSubmit={handleFormSubmit} className="flex gap-4 mt-4 sm:gap-2">
					{weekDates.map((date, index) => (
						<div key={index} className="flex-1">
							<div className="px-4 py-2 rounded text-center bg-blue-500 text-white sm:px-2 sm:py-1">
								{date.toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
							</div>
							<div className="mt-2">
								<select
									value={selections[index][0]}
									onChange={(event) => handleDropdownChange(index, 0, event)}
									className="block w-full mt-1"
									required
								>
									<option value="">Select an Soup</option>
									{items
										.filter((item) => item.Category === "Soup")
										.map((item, optionIndex) => (
											<option key={optionIndex} value={item.ItemID}>
												{item.ChnDescription}
											</option>
										))}
								</select>
								<select
									value={selections[index][1]}
									onChange={(event) => handleDropdownChange(index, 1, event)}
									className="block w-full mt-1"
									required
								>
									<option value="">Select an Dish</option>
									{items
										.filter((item) => item.Category === "Dish")
										.map((item, optionIndex) => (
											<option key={optionIndex} value={item.ItemID}>
												{item.ChnDescription}
											</option>
										))}
								</select>
								<select
									value={selections[index][2]}
									onChange={(event) => handleDropdownChange(index, 2, event)}
									className="block w-full mt-1"
									required
								>
									<option value="">Select an Dish</option>
									{items
										.filter((item) => item.Category === "Dish")
										.map((item, optionIndex) => (
											<option key={optionIndex} value={item.ItemID}>
												{item.ChnDescription}
											</option>
										))}
								</select>
								<select
									value={selections[index][3]}
									onChange={(event) => handleDropdownChange(index, 3, event)}
									className="block w-full mt-1"
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
									value={selections[index][4]}
									onChange={(event) => handleDropdownChange(index, 4, event)}
									className="block w-full mt-1"
									required
								>
									<option value="">Select an Dish</option>
									{items
										.filter((item) => item.Category === "Dish")
										.map((item, optionIndex) => (
											<option key={optionIndex} value={item.ItemID}>
												{item.ChnDescription}
											</option>
										))}
								</select>
							</div>
						</div>
					))}
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded sm:px-2 sm:py-1"
					>
						Submit
					</button>
				</form>
			)}
		</div>
	);
}

export default EditMenu;
