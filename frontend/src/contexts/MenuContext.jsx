// src/contexts/MenuContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { getMenu } from "../API/Menu";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
	const [menuList, setMenuList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false); // Flag to trigger refresh
  const [selectionCounts, setSelectionCounts] = useState({});

  const fetchMenu = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMenu();
      setMenuList(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      if (error.response) {
        setError(
          `Error: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu, needsRefresh]);

  const refreshMenu = () => {
    setNeedsRefresh((prev) => !prev);
  };

  return (
    <MenuContext.Provider
      value={{
        menuList,
        isLoading,
        error,
        fetchMenu,
        refreshMenu,
        setMenuList,
        selectionCounts,
        setSelectionCounts
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
