// contexts/MenuItemsContext.js
import React, { createContext, useContext, useState } from "react";

const MenuItemsContext = createContext();

export const useMenuItems = () => useContext(MenuItemsContext);

export const MenuItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Add functions to manage items here
  const value = { items, setItems };

  return <MenuItemsContext.Provider value={value}>{children}</MenuItemsContext.Provider>;
};
