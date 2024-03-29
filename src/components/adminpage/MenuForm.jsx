import { useState, useContext } from 'react';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { FirebaseContext } from '../../contexts/FirebaseContext';

const MenuForm = () => {
  const [itemID, setItemID] = useState('');
  const [enDescription, setEnDescription] = useState('');
  const [chnDescription, setChnDescription] = useState('');
  const [category, setCategory] = useState('');
  const { db } = useContext(FirebaseContext);

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadData = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const data = JSON.parse(text);
      try {
        const collectionRef = collection(db, "menuItems");
        for (const item of data) {
          await addDoc(collectionRef, item);
        }
        alert('Data uploaded successfully!');
      } catch (error) {
        console.error("Error adding document: ", error);
        alert('Error uploading data!');
      }
    
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'menuItems', itemID);
    await setDoc(docRef, {
      ItemID: itemID, // Assuming you want to store the itemID as well
      EnDescription: enDescription,
      ChnDescription: chnDescription,
      Category: category
    });
    // Reset the form fields after submission
    setItemID('');
    setEnDescription('');
    setChnDescription('');
    setCategory('');
    // Optionally, add a success message or error handling here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form onSubmit={handleSubmit} className="form space-y-4">
      <div>
        <label htmlFor="itemID" className="block text-sm font-medium text-gray-700">Item ID</label>
        <input
          type="text"
          name="itemID"
          id="itemID"
          value={itemID}
          onChange={(e) => setItemID(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="enDescription" className="block text-sm font-medium text-gray-700">English Description</label>
        <input
          type="text"
          name="enDescription"
          id="enDescription"
          value={enDescription}
          onChange={(e) => setEnDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="chnDescription" className="block text-sm font-medium text-gray-700">Chinese Description</label>
        <input
          type="text"
          name="chnDescription"
          id="chnDescription"
          value={chnDescription}
          onChange={(e) => setChnDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Save Item
      </button>
    </form>
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadData}>Upload Data</button>
    </div>
    </div>
  );
};

export default MenuForm;
