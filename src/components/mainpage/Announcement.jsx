import { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../contexts/FirebaseContext';
import { doc, getDoc } from 'firebase/firestore';

function Announcement() {
  const [announcement, setAnnouncement] = useState('');
  const { db } = useContext(FirebaseContext);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const docRef = doc(db, 'announcement', 'current');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAnnouncement(docSnap.data().content); 
      } else {
        console.log('No such document!');
      }
    };

    fetchAnnouncement();
  }, [db]);

  return (
    <div className="mx-auto px-4 md:px-8 lg:px-16">
      <div className="flex flex-col items-center justify-center my-5">
        <p className="text-black tracking-widest text-lg md:text-xl lg:text-2xl font-extrabold">
          <span className='text-2xl md:text-3xl text-red-500'>Announcement:</span> {announcement || 'Empty'}
        </p>
      </div>
    </div>
  );
}

export default Announcement;
