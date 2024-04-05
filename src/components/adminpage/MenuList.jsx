import { useEffect, useState, useContext } from "react";
import {
	collection,
	getDocs,
	deleteDoc,
	setDoc,
	addDoc,
	doc,
} from "firebase/firestore";
import { FirebaseContext } from "../../contexts/FirebaseContext"; // Access Firebase services
import { useMenuItems } from "../../contexts/MenuItemsContext"; // Custom hook for managing menu items state
import Modal from "./Modal"; // Reusable modal component for editing and adding menu items
import { translateText } from "../../utils/translateUtils";

const MenuList = () => {
	const { items, setItems } = useMenuItems(); // Destructuring items and setItems from MenuItemsContext
	const { db } = useContext(FirebaseContext); // Accessing Firestore database instance from FirebaseContext
	const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
	const [currentItem, setCurrentItem] = useState(null); // State to keep track of the current item being edited or null for a new item
	const [searchQuery, setSearchQuery] = useState(""); // State for the search query

	// Fetch and set menu items from Firestore on component mount
	useEffect(() => {
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

		fetchItems();
	}, [db, setItems]); // Includes setItems in the dependency array for completeness

	// Deletes a menu item from Firestore and updates the local state
	const handleDelete = async (id) => {
		await deleteDoc(doc(db, "menuItems", id));
		setItems((prevItems) => prevItems.filter((item) => item.id !== id));
	};

	// Handles form submission for both new and edited items
	const handleSubmit = (event) => {
		event.preventDefault(); // Prevent default form submission behavior
		currentItem ? handleEditSubmit(event) : handleNewSubmit(event);
	};

	// Adds a new menu item to Firestore and updates the local state
	const handleNewSubmit = async (event) => {
		event.preventDefault(); // Prevent default form submission behavior
		const formData = new FormData(event.target);
		const EnDesc = formData.get("EnDescription") ? await translateText(formData.get("EnDescription"), "en") : "";

		const newItem = {
			ItemID: formData.get("ItemID"),
			Category: formData.get("Category"),
			ChnDescription: formData.get("ChnDescription"),
			EnDescription: EnDesc,
		};

		try {
			const docRef = await addDoc(collection(db, "menuItems"), newItem);
			setItems((prevItems) => [...prevItems, { id: docRef.id, ...newItem }]);
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	};

	// Updates an existing menu item in Firestore and the local state
	const handleEditSubmit = async (event) => {
		const formData = new FormData(event.target);
		const updatedItem = {
			ItemID: formData.get("ItemID"),
			Category: formData.get("Category"),
			ChnDescription: formData.get("ChnDescription"),
			EnDescription: formData.get("EnDescription"),
		};

		if (currentItem && currentItem.id) {
			try {
				await setDoc(doc(db, "menuItems", currentItem.id), updatedItem, {
					merge: true,
				});
				setItems((prevItems) =>
					prevItems.map((item) =>
						item.id === currentItem.id ? { ...item, ...updatedItem } : item
					)
				);
				setIsModalOpen(false);
			} catch (error) {
				console.error("Error updating document: ", error);
			}
		}
	};

	// Opens the modal for editing an item
	const handleEdit = (item) => {
		setCurrentItem(item);
		setIsModalOpen(true);
	};

	// Filters items based on the search query and renders the UI
	return (
		<div className="space-y-4">
			<input
				type="text"
				placeholder="Search items..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="w-full p-2 border rounded"
			/>
			<button
				onClick={() => {
					setCurrentItem(null); // Prepare for adding a new item
					setIsModalOpen(true); // Open the modal
				}}
				className="my-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
			>
				Add New Item
			</button>
			{items
				.filter(
					(item) =>
						item.EnDescription.toLowerCase().includes(
							searchQuery.toLowerCase()
						) ||
						item.ChnDescription.toLowerCase().includes(
							searchQuery.toLowerCase()
						) ||
						item.ItemID.toString().includes(searchQuery)
				)
				.map((item) => (
					<div
						key={item.id}
						className="p-4 mb-2 w-full bg-gray-100 rounded-lg shadow flex justify-between items-center"
					>
						<div>
							<p className="text-sm font-semibold text-gray-700">
								Item ID: {item.ItemID}
							</p>
							<p className="text-lg font-bold text-gray-900">
								{item.ChnDescription} ({item.EnDescription})
							</p>
							<p className="text-sm text-gray-600">Category: {item.Category}</p>
						</div>
						<div>
							<button
								onClick={() => handleEdit(item)}
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded-lg"
							>
								Edit
							</button>
							<button
								onClick={() => handleDelete(item.id)}
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
							>
								Delete
							</button>
						</div>
					</div>
				))}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-lg text-left font-medium text-gray-700 ">
							Item ID
						</label>
						<input
							type="text"
							name="ItemID"
							defaultValue={currentItem?.ItemID}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
						<label className="mt-3 block text-lg text-left font-medium text-gray-700">
							Category
						</label>
						<input
							type="text"
							name="Category"
							defaultValue={currentItem?.Category}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
						<label className="mt-3 block text-lg text-left font-medium text-gray-700">
							Chinese Description
						</label>
						<input
							type="text"
							name="ChnDescription"
							defaultValue={currentItem?.ChnDescription}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
						<label className="mt-3 block text-lg text-left font-medium text-gray-700">
							English Description
						</label>
						<input
							type="text"
							name="EnDescription"
							defaultValue={currentItem?.EnDescription}
							className="mt-1 mb-3 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
					>
						Save Changes
					</button>
					<button
						type="button" // Note: It's important to have `type="button"` to prevent form submission.
						onClick={() => setIsModalOpen(false)}
						className="mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
					>
						Close
					</button>
				</form>
			</Modal>
			{items.length === 0 && (
				<p className="text-center text-gray-500">No menu items found.</p>
			)}
		</div>
	);
};

export default MenuList;
