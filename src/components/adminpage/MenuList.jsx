import React, { useEffect, useState, useContext } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FirebaseContext } from '../../contexts/FirebaseContext';

const MenuList = () => {
  const [items, setItems] = useState([]);
  const { db } = useContext(FirebaseContext);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const itemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => a.ItemID - b.ItemID);
      console.log(itemsList)
      setItems(itemsList);
    };

    fetchItems();
  }, [db]); // Dependency on db is usually not necessary, but included for completeness

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'menuItems', id));
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />
      {items
        .filter(item =>
          item.EnDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.ChnDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.ItemID.toString().includes(searchQuery)
        ).map((item) => (
        <div key={item.id} className="p-4 mb-2 w-full bg-gray-100 rounded-lg shadow flex justify-between items-center">
    
    <div className="">
      <p className="text-sm font-semibold text-gray-700">Item ID: {item.ItemID}</p>
      <p className="text-lg font-bold text-gray-900">{item.ChnDescription} ({item.EnDescription})</p>
      <p className="text-sm text-gray-600">Category: {item.Category}</p>
    </div>
          <button
            onClick={() => handleDelete(item.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-center text-gray-500">No menu items found.</p>
      )}
    </div>
  );
};

export default MenuList;
