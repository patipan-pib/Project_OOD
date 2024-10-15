// src/contexts/BillContext.js
import React, { createContext, useState, useEffect } from "react";
import { getUnpaidBills } from "../API/Bill";

export const BillContext = createContext();

export const BillProvider = ({ children }) => {
	const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUnpaidBills = async () => {
    setIsLoading(true);
    try {
      const data = await getUnpaidBills();
      setBills(data);
      setError(null);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลบิลได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidBills();
  }, []);

  return (
    <BillContext.Provider
      value={{ bills, isLoading, error, fetchUnpaidBills, setBills }}
    >
      {children}
    </BillContext.Provider>
  );
};
