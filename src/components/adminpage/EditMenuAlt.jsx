import { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useMenuItems } from "../../contexts/MenuItemsContext";
import { doc, setDoc, collection, query, getDocs, where, getDoc, updateDoc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import "react-datepicker/dist/react-datepicker.css";

function EditMenuAlt() {
  const [startDate, setStartDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const { db } = useContext(FirebaseContext);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [searchQuery, setSearchQuery] = useState("");
  const [editableIndex, setEditableIndex] = useState(null);
  const { items, setItems } = useMenuItems();

  useEffect(() => {
    if (weekDates.length > 0) {
      const dateForSelectedDay = mapDayToDate(selectedDay);
      if (dateForSelectedDay) {
        setMenuItems([]);
        fetchMenuData(dateForSelectedDay).then((data) => {
          if (data && data.length > 0 && data[0].menuItems) {
            setMenuItems(data[0].menuItems);
          } else {
            setMenuItems([]);
          }
        });
      }
    }
  }, [selectedDay, weekDates]);

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

  const fetchMenuData = async (date) => {
    const q = query(collection(db, "scheduledMenus"), where("date", "==", date));

    try {
      const querySnapshot = await getDocs(q);
      const menuData = [];
      querySnapshot.forEach((doc) => {
        menuData.push(doc.data());
      });
      return menuData;
    } catch (error) {
      console.error("Error fetching menu data: ", error);
      return [];
    }
  };

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
    return date ? moment(date)
    .tz("America/Los_Angeles")
    .format("YYYY-MM-DD") : null;
  };

  const handleRemoveMenuItem = async (indexToRemove) => {
    const date = mapDayToDate(selectedDay);
    if (!date) return;

    const docRef = doc(db, "scheduledMenus", date);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentMenuItems = docSnap.data().menuItems;
        const updatedMenuItems = currentMenuItems.filter(
          (_, i) => i !== indexToRemove
        );

        await updateDoc(docRef, {
          menuItems: updatedMenuItems,
        });

        setMenuItems(updatedMenuItems);
      } else {
        console.log("Document does not exist!");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleMenuItemChange = (index, value) => {
    setSearchQuery(value);
  };

  const handleInputBoxSelect = (index) => {
    setEditableIndex(index);
  };

  const handleSaveChanges = async () => {
    const date = mapDayToDate(selectedDay);
    const docRef = doc(db, "scheduledMenus", date);

    const isNotEmpty = (obj) => Object.keys(obj).length > 0;
    const menuData = {
      date,
      menuItems: menuItems
        .map(({ isEditable, ...keepAttrs }) => keepAttrs)
        .filter(isNotEmpty),
    };

    try {
      await setDoc(docRef, menuData);
    } catch (error) {
      console.error("Error saving menu:", error);
    }
  };

  const handleClearAll = () => {
    setMenuItems([]);
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

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
      <div className="hidden sm:flex flex-wrap gap-4 mt-4 sm:gap-2">
        {weekDates.map((date, index) => (
          <div
            key={index}
            className="text-center flex-1 px-4 py-2 font-bold text-blue-950 sm:px-2 sm:py-1"
          >
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 sm:gap-2">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
          <button
            key={day}
            className={`flex-1 px-4 py-2 rounded ${
              selectedDay === day
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } sm:px-2 sm:py-1`}
            onClick={() => handleDayChange(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="mt-8 sm:mt-4">
        <table className="w-full sm:table-auto">
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
                              <div>
                                <p className="text-md font-semibold text-gray-500">
                                  Item ID: {item.ItemID} {"  "}
                                  <span className="font-bold text-lg text-black">
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
        <div className="mt-4 flex flex-wrap gap-4 sm:gap-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded sm:px-2 sm:py-1"
            onClick={handleAddMenuItem}
          >
            Add New Item
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded sm:px-2 sm:py-1"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded sm:px-2 sm:py-1"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMenuAlt;