import React, { useEffect, useState, useContext } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FirebaseContext } from '../../contexts/FirebaseContext';

const MenuList = () => {
  const [items, setItems] = useState([]);
  const { db } = useContext(FirebaseContext);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const itemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
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
      {items.map((item) => (
        <div key={item.id} className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{item.EnDescription} ({item.ChnDescription})</p>
            <p>Category: {item.Category}</p>
            {/* Add other details you want to display */}
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
