// need to handles data changes on state and side effects 
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';  // handleds http requests to use for django

// base api url just to be able to use it
const API_URL = 'http://127.0.0.1:8000/api/blocks/';

// cet the states of the api items
const useBlocksApi = () => {
    const [blocks, setBlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch all blocks
    const fetchBlocks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);  // listener for grabbibg of a box
            setBlocks(response.data);
        } catch (err) {
            setError('Failed to fetch blocks from the Django API.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Function to create a new block (items and height)
    const createBlock = async (items, height) => {
        setError(null);
        try {
            const newBlockData = {
                items: items,
                block_height: height
            };
            
            // Django serializer calculates Merkle Root here
            const response = await axios.post(API_URL, newBlockData);
            
            // Add the new block to the existing list and sort it by height
            setBlocks(prevBlocks => 
                [...prevBlocks, response.data].sort((a, b) => b.block_height - a.block_height)
            );
            return response.data; // Return the created block on success
        } catch (err) {
            const errorMessage = err.response?.data 
                ? JSON.stringify(err.response.data) 
                : 'Failed to create block.';
            setError(errorMessage);
            console.error(err);
            throw new Error(errorMessage); // Throw error if there was an issue
        }
    };

    // Fetch blocks automatically when the hook loads
    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);
 
    return { blocks, isLoading, error, fetchBlocks, createBlock };
};

export default useBlocksApi;