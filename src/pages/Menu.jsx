import React, { useState } from 'react';
import data from "../data/test.json"; // Assuming this imports correctly and contains the menu data

function Menu() {
    const [editMode, setEditMode] = useState(false);
    const [menuData, setMenuData] = useState(data); // Use state to hold and manage the editable menu data

    const dayToCh = {
        Mon: "星期一",
        Tue: "星期二",
        Wed: "星期三",
        Thu: "星期四",
        Fri: "星期五"
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    // Handler to update menu item data
    const handleMenuItemChange = (day, type, index, value) => {
        const updatedData = { ...menuData };
        updatedData[day][type][index] = value;
        setMenuData(updatedData);
    };

    // Handler to delete a menu item
    const handleDeleteMenuItem = (day, type, index) => {
        const updatedData = { ...menuData };
        updatedData[day][type] = updatedData[day][type].filter((_, itemIndex) => itemIndex !== index);
        setMenuData(updatedData);
    };

    // Handler to add a new menu item
    const handleAddMenuItem = (day, type) => {
        const updatedData = { ...menuData };
        updatedData[day][type] = [...updatedData[day][type], ""]; // Add a new empty item
        setMenuData(updatedData);
    };

    return (
        <div>
            <div className="bg-green-500 w-full h-16 flex items-center justify-center">
                <p className="text-white tracking-widest text-2xl font-extrabold">每週菜單/WEEKLY MENU</p>
                {/* Uncomment the following button to enable edit mode */}
                {/* <button onClick={handleEditToggle} className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 ml-3 rounded-full">
                    {editMode ? 'Save Changes' : '编辑'}
                </button> */}
            </div>

            <div className="flex flex-col lg:flex-row mx-4 lg:mx-10 my-5 text-center">
                {Object.entries(menuData).map(([day, { Date, Ch, En }]) => (
                    <div key={day} className="flex-1 mx-auto lg:mx-0 mb-8 lg:mb-0 border-b-2 md:border-l-2 md:border-b-0 md:basis-1/5 w-full">
                        <div className="text-2xl tracking-widest font-extrabold w-full">{day} {dayToCh[day]}</div>
                        <div className="text-lg tracking-widest font-bold">{Date}</div>
                        {editMode ? (
                            <>
                                {Ch.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleMenuItemChange(day, "Ch", index, e.target.value)}
                                            className="text-lg lg:text-xl tracking-widest font-extrabold text-left mx-5 flex-1 border-2 border-black border-solid"
                                        />
                                        <button
                                            onClick={() => handleDeleteMenuItem(day, "Ch", index)}
                                            className="text-red-500 mr-5"
                                        >X</button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddMenuItem(day, "Ch")}
                                    className="text-green-700 text-3xl"
                                >+</button>

                                <hr className="my-2" /> {/* Separator between Chinese and English items */}
                                {En.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleMenuItemChange(day, "En", index, e.target.value)}
                                            className="text-lg lg:text-xl tracking-widest font-bold text-left mx-5 flex-1 border-2 border-black border-solid"
                                        />
                                        <button
                                            onClick={() => handleDeleteMenuItem(day, "En", index)}
                                            className=" text-red-500 mr-5"
                                        >X</button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddMenuItem(day, "En")}
                                    className="text-green-700 text-3xl"
                                >+</button>
                            </>
                        ) : (
                            <>
                                <div className="text-lg tracking-widest font-extrabold text-left mx-5">
                                    {Ch.map((item, index) => (
                                        <div key={index}>•{item}</div>
                                    ))}
                                </div>
                                <div className="text-lg tracking-widest font-bold text-left mx-5">
                                    {En.map((item, index) => (
                                        <div key={index}>•{item}</div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Menu;
