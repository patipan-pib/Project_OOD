// src/API/Bill.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/bills'; // เปลี่ยน URL ตามการตั้งค่า


export const getUnpaidBills = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/unpaid`);
        console.log(response)
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const payBill = async (billId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${billId}/pay`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const cancelBill = async (billId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${billId}/cancel`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createBill = async (billData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, billData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBillById = async (billId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${billId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editBill = async (billId, billData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${billId}/edit`, billData);
        return response.data;
    } catch (error) {
        console.error("Error editing bill:", error);
        throw error;
    }
};

export const getHistoryBills = async () => {
    try {
        console.log(444)
        const response = await axios.get(`${API_BASE_URL}/history`);
        return response.data;
    } catch (error) {
        console.error("Error fetching history bills:", error);
        throw error;
    }
};