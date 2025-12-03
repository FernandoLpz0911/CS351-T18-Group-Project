import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_URL = `${BASE_URL}/api/blocks/`;

const useBlocksApi = () => {
    const [blocks, setBlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlocks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            setBlocks(response.data);
        } catch (err) {
            setError('Failed to fetch blocks from the Django API.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createBlock = async (items, height) => {
        setError(null);
        try {
            const newBlockData = { items, block_height: height };
            const response = await axios.post(API_URL, newBlockData);
            
            setBlocks(prev => [...prev, response.data].sort((a, b) => b.block_height - a.block_height));
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to create block.';
            setError(errorMessage);
            console.error(err);
            throw new Error(errorMessage);
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);
 
    return { blocks, isLoading, error, fetchBlocks, createBlock };
};

export default useBlocksApi;