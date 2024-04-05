import { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../contexts/FirebaseContext';
import {collection, query, getDocs, where} from 'firebase/firestore';
import moment from 'moment-timezone';


function Menu() {
  const [menuData, setMenuData] = useState([]); // State for holding menu data
  const { db } = useContext(FirebaseContext); // Database context for Firestore operations
  const [weekDates, setWeekDates] = useState([]); // State for the dates in the current week
  const [currentDate, setCurrentDate] = useState(new Date()); // State for the selected start date

  // Maps day abbreviations to Chinese characters
  const dayToCh = { Mon: '星期一', Tue: '星期二', Wed: '星期三', Thu: '星期四', Fri: '星期五' };
  // Maps numeric day indices to day abbreviations
  const numToDay = { 0: 'Mon', 1: 'Tue', 2: 'Wed', 3: 'Thu', 4: 'Fri' };

  const pstOffset = -480;

  useEffect(() => {
    const startOfWeek = currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1);
    const fridayDate = new Date(currentDate);
    fridayDate.setDate(startOfWeek + 4);
    let dates = [];
    
    // Check if the start date is before or after Friday 6:00 PM
    if (currentDate < new Date(fridayDate.getFullYear(), fridayDate.getMonth(), fridayDate.getDate(), 18)) {
      // If before Friday 6:00 PM, use the current week
      for (let i = 0; i < 5; i++) {
        let date = new Date(currentDate);
        date.setDate(startOfWeek + i);
        dates.push(moment(date).tz('America/Los_Angeles').format('YYYY-MM-DD'));
      }
    } else {
      // If after Friday 6:00 PM, use the next week
      for (let i = 0; i < 5; i++) {
        let date = new Date(currentDate);
        date.setDate(startOfWeek + i + 7);
        date.setTime(date.getTime() - 7)
        let timezoneDate = moment(date).tz('America/Los_Angeles').format('YYYY-MM-DD');
        dates.push(timezoneDate.toISOString().split('T')[0]);
      }
    }

    console.log('Week dates:', dates); // Log calculated week dates for debugging
    setWeekDates(dates);
  }, [currentDate]);

  // Fetch menu data when weekDates changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = weekDates.map(date => fetchMenuData(date));
        const results = await Promise.all(promises);
        console.log('Fetched menu data:', results); // Log fetched menu data for debugging
        setMenuData(results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (weekDates.length > 0) fetchData();
  }, [weekDates]);

  // Fetches menu data for a given date from Firestore
  async function fetchMenuData(date) {
    const q = query(collection(db, 'scheduledMenus'), where('date', '==', date));
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return [];
      }
      const dateMenu = querySnapshot.docs.map(doc => doc.data().menuItems);
      return dateMenu.length > 0 ? dateMenu[0] : [];
    } catch (error) {
      console.error('Error fetching menu data for date', date, ':', error);
      return [];
    }
  }

  // Render the menu UI
  return (
    <div>
      <div className='bg-green-500 w-full h-16 flex items-center justify-center'>
        <p className='text-white tracking-widest text-2xl font-extrabold'>每週菜單/WEEKLY MENU</p>
      </div>
      <div className='flex flex-col lg:flex-row mx-4 lg:mx-10 my-5 text-center'>
        {menuData.map((dayMenu, index) => (
          <div key={index} className='flex-1 mx-auto lg:mx-0 mb-8 lg:mb-0 border-b-2 md:border-l-2 md:border-b-0 md:basis-1/5 w-full'>
            <div className='text-2xl tracking-widest font-extrabold w-full'>{numToDay[index]} {dayToCh[numToDay[index]]}</div>
            <div className='text-lg tracking-widest font-bold md:mb-5'>{weekDates[index]}</div>
            {dayMenu.length > 0 ? (
              <>
                <div className='text-lg tracking-widest font-extrabold text-left mx-5'>
                  {dayMenu.map((item, itemIndex) => (
                    <div key={itemIndex}>•{item.ChnDescription}</div>
                  ))}
                </div>
	
                <div className='text-lg tracking-widest font-bold text-left mx-5 mt-6'>
                  {dayMenu.map((item, itemIndex) => (
                    <div key={itemIndex}>•{item.EnDescription}</div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className='text-lg tracking-widest font-extrabold text-left mx-5'>•无菜单</div>
                <div className='text-lg tracking-widest font-bold text-left mx-5 mt-6'>•No Menu Items for Today</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
