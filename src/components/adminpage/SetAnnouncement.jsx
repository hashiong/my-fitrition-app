import { useState, useContext } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

function SetAnnouncement() {
  const [announcement, setAnnouncement] = useState("");
  const { db } = useContext(FirebaseContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if a document already exists in the "announcement" collection
      const docRef = doc(db, "announcement", "current");
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Update the existing document
        await updateDoc(docRef, { content: announcement });
        console.log("Announcement updated successfully");
      } else {
        // Create a new document
        await setDoc(docRef, { content: announcement });
        console.log("Announcement created successfully");
      }
    } catch (error) {
      console.error("Error setting announcement:", error);
    }
  };

  return (
    <div className="p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-left">Set Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <input
            type="text"
            id="announcement"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Announcement"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default SetAnnouncement;