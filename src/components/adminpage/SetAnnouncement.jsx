import { useState, useContext } from "react";
import { FirebaseContext } from "../../contexts/FirebaseContext";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

function SetAnnouncement() {
  const [announcement, setAnnouncement] = useState("");
  const { db } = useContext(FirebaseContext);
  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);

			setTimeout(() => {
				setSubmitted(false);
			}, 5000);
    } catch (error) {
      console.error("Error setting announcement:", error);
    }
  };

  return (
    <div className="p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-left">Set Announcement</h2>
      {submitted && (
						<div
							className="bg-green-100 border border-green-400 text-green-700 m-4 px-4 py-3 rounded relative"
							role="alert"
						>
							<strong className="font-bold">Menu Saved Successfully!</strong>
							<span className="absolute top-0 bottom-0 right-0 px-4 py-3">
								<svg
									className="fill-current h-6 w-6 text-green-500"
									role="button"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<title>Close</title>
									<path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
								</svg>
							</span>
						</div>
					)}
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