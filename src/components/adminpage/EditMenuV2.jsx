import React, { useState, useEffect } from "react";
import { useMenuItems } from "../../contexts/MenuItemsContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EditMenu() {
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [menuItemsByDate, setMenuItemsByDate] = useState({});
    const [selectedDayMenuItems, setSelectedDayMenuItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editableIndex, setEditableIndex] = useState(null);
    const { items } = useMenuItems();

    useEffect(() => {
        const startOfWeek = new Date(
            selectedStartDate.setDate(
                selectedStartDate.getDate() -
                    selectedStartDate.getDay() +
                    (selectedStartDate.getDay() === 0 ? -6 : 1)
            )
        );

        const dates = [];
        const newMenuItemsByDate = {};
        for (let i = 0; i < 5; i++) {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            dates.push(date);
            const dateString = date.toISOString().split("T")[0];
            newMenuItemsByDate[dateString] = [];
        }

        setWeekDates(dates);
        setMenuItemsByDate(newMenuItemsByDate);
        const selectedDateString = selectedStartDate.toISOString().split("T")[0];
        setSelectedDate(selectedDateString);
        setEditableIndex(null);
    }, [selectedStartDate]);

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

    const handleAddMenuItem = () => {
        const updatedMenuItems = [...(menuItemsByDate[selectedDate] || []), { isEditable: true }];
        setMenuItemsByDate({
            ...menuItemsByDate,
            [selectedDate]: updatedMenuItems,
        });
        setSelectedDayMenuItems(updatedMenuItems);
        // setSearchQuery(null,"");
		console.log(updatedMenuItems);
        
    };

    const handleRemoveMenuItem = (index) => {
        const updatedMenuItems = selectedDayMenuItems.filter((_, i) => i !== index);
        setMenuItemsByDate({
            ...menuItemsByDate,
            [selectedDate]: updatedMenuItems,
        });
        setSelectedDayMenuItems(updatedMenuItems);
        setEditableIndex(null);
    };

    const handleMenuItemChange = (index, value) => {
		if(index === editableIndex){
			setSearchQuery(value);
		}

    };

	const handleInputBoxSelect = (index) => {
		console.log("index: " + index)
		setEditableIndex(index);
    };

	

    const handleSaveChanges = () => {
        // Implement API call to save changes to the database
    };

    const handleClearAll = () => {
        setSelectedDayMenuItems([]);
        setMenuItemsByDate({
            ...menuItemsByDate,
            [selectedDate]: [],
        });
        setSearchQuery("");
        setEditableIndex(null);
    };

    const handleDayChange = (day) => {
        const date = mapDayToDate(day);
        if (date === null) {
            console.error(`mapDayToDate returned null for day: ${day}`);
            return;
        }
        setSelectedDate(date);
        setSelectedDayMenuItems(menuItemsByDate[date] || []);
        setSearchQuery("");
        setEditableIndex(null);
    };

    const handleAdd = (selectedItem) => {
        const updatedMenuItems = menuItemsByDate[selectedDate].map((menuItem, index) =>
            index === editableIndex
                ? { ...selectedItem, isEditable: false }
                : menuItem
        );
        setSelectedDayMenuItems(updatedMenuItems);
        setMenuItemsByDate({
            ...menuItemsByDate,
            [selectedDate]: updatedMenuItems,
        });
        setSearchQuery("");
        setEditableIndex(null);
    };

    return (
        <div className="p-8 font-semibold">
            <div className="flex items-center mb-4">
                <label className="mr-2">Start Date:</label>
                <DatePicker
                    selected={selectedStartDate}
                    onChange={(date) => setSelectedStartDate(date)}
                    className="text-center text-md datePickerInput flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700"
                />
            </div>
            <div className="flex space-x-4 mb-4">
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
            <div className="flex space-x-4 mb-8">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                    (day) => {
                        const dayDate = mapDayToDate(day);
                        if (!dayDate) {
                            console.error(
                                `mapDayToDate returned undefined for day: ${day}`
                            );
                            return null;
                        }
                        const isSelectedDate = selectedDate === dayDate;
                        return (
                            <button
                                key={day}
                                className={`flex-1 px-4 py-2 rounded ${
                                    isSelectedDate
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                                onClick={() => handleDayChange(day)}
                            >
                                {day}
                            </button>
                        );
                    }
                )}
            </div>
            <div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Item Name</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedDayMenuItems.map((menuItem, index) => (
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
                                            {index === editableIndex && items
                                                .filter(
                                                    (item) =>
                                                        searchQuery !== "" &&
                                                        (item.EnDescription.toLowerCase().includes(
                                                            searchQuery.toLowerCase()
                                                        ) ||
                                                            item.ChnDescription.toLowerCase().includes(
                                                                searchQuery.toLowerCase()
                                                            ) ||
                                                            item.ItemID.toString().includes(
                                                                searchQuery
                                                            ))
                                                )
                                                .map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="p-4 mb-2 w-full bg-gray-100 rounded-lg shadow flex justify-between items-center"
                                                    >
                                                        <div className="">
                                                            <p className="text-md font-semibold text-gray-500">
                                                                Item ID: {item.ItemID}{" "}
                                                                <span className="font-bold text-lg text-black">
                                                                    {item.ChnDescription} (
                                                                    {item.EnDescription})
                                                                </span>{" "}
                                                                <span className="text-gray-600">
                                                                    Category: {item.Category}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                handleAdd(item)
                                                            }
                                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 rounded-lg"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                ))}
                                        </>
                                    ) : (
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
                <div className="mt-4 flex space-x-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={handleAddMenuItem}
                    >
                        Add New Item
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
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