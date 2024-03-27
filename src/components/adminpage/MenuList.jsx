import { useEffect, useState, useContext } from "react";
import {
	collection,
	getDocs,
	deleteDoc,
	setDoc,
	addDoc,
	doc,
} from "firebase/firestore";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { useMenuItems } from "../../contexts/MenuItemsContext";
import Modal from "./Modal";

const MenuList = () => {
	// const [items, setItems] = useState([]);
	const { items, setItems } = useMenuItems();
	const { db } = useContext(FirebaseContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentItem, setCurrentItem] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

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
	}, [db]); // Dependency on db is usually not necessary, but included for completeness

	const handleDelete = async (id) => {
		await deleteDoc(doc(db, "menuItems", id));
		setItems((prevItems) => prevItems.filter((item) => item.id !== id));
	};

	const handleSubmit = (event) => {
		if (currentItem !== null) {
			handleEditSubmit(event);
		} else {
			handleNewSubmit(event);
		}
	};

	const handleNewSubmit = async (event) => {
		event.preventDefault(); // Prevent the default form submission

		// Assuming you have inputs named corresponding to your data structure
		const formData = new FormData(event.target);
		const NewItem = {
			ItemID: formData.get("ItemID"), // Make sure the names match your input's name attributes
			Category: formData.get("Category"),
			ChnDescription: formData.get("ChnDescription"),
			EnDescription: formData.get("EnDescription"),
		};


			try {
				// Update the document in Firestore
				const docRef = await addDoc(collection(db, "menuItems"), NewItem);
				const addedItem = { id: docRef.id, ...NewItem };
				// Add the new item to the local state to reflect the update
				const updatedItems = [...items, addedItem];
				setItems(updatedItems);
				// Close the modal
				setIsModalOpen(false);
			} catch (error) {
				console.error("Error adding document: ", error);
			}
		
	};

	const handleEditSubmit = async (event) => {
		event.preventDefault(); // Prevent the default form submission

		// Assuming you have inputs named corresponding to your data structure
		const formData = new FormData(event.target);
		const updatedItem = {
			ItemID: formData.get("ItemID"), // Make sure the names match your input's name attributes
			Category: formData.get("Category"),
			ChnDescription: formData.get("ChnDescription"),
			EnDescription: formData.get("EnDescription"),
		};

		// Check if currentItem is not null and has an id
		if (currentItem && currentItem.id) {
			try {
				// Update the document in Firestore
				await setDoc(doc(db, "menuItems", currentItem.id), updatedItem, {
					merge: true,
				});
				// Optionally, refresh the items list to reflect the update
				const updatedItems = items.map((item) =>
					item.id === currentItem.id ? { ...item, ...updatedItem } : item
				);
				setItems(updatedItems);
				// Close the modal
				setIsModalOpen(false);
			} catch (error) {
				console.error("Error updating document: ", error);
			}
		}
	};

	const handleEdit = (item) => {
		setCurrentItem(item);
	};
	// Add a useEffect hook that depends on currentItem
	useEffect(() => {
		if (currentItem) {
			setIsModalOpen(true);
		}
	}, [currentItem]);

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
					setCurrentItem(null); // Clear current item for a new item
					setIsModalOpen(true); // Open the modal in "add new" mode
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
						<div className="">
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
