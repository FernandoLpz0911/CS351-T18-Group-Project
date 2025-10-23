// src/components/BlockChainView.js

import React, { useState } from 'react';
import useBlocksApi from '../hooks/useBlocksApi'; // Adjust path as needed

// A sub-component for the form (optional but recommended for modularity)
const BlockSubmissionForm = ({ createBlock, lastHeight, onError }) => {
    const [itemsInputs, setItemsInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nextHeight = lastHeight ? lastHeight + 1 : 1;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        onError(null);

        const itemsArray = itemsInputs.split('\n').filter(tx => tx.trim() !== '');

        if (itemsArray.length === 0) {
            onError("Please enter at least one transaction.");
            setIsSubmitting(false);
            return;
        }

        try {
            await createBlock(itemsArray, nextHeight);
            setItemsInput(''); // Clear input on success
        } catch (e) {
            // Error is handled and thrown from the hook
            onError("Error: " + e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h3>Create New Block (Height: {nextHeight})</h3>
            <label>
                Transactions (one per line):
                <textarea
                    value={itemsInputs}
                    onChange={(e) => setItemsInput(e.target.value)}
                    rows="5"
                    style={{ width: '100%', resize: 'none' }}
                    disabled={isSubmitting}
                />
            </label>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Mining...' : 'POST New Block'}
            </button>
        </form>
    );
};

// Main modular component
const BlockChainView = () => {
    const { blocks, isLoading, error, createBlock } = useBlocksApi();
    const [formError, setFormError] = useState(null);

    if (isLoading) return <div>Loading api data...</div>;
    if (error && !formError) return <div style={{ color: 'red' }}>API Error: {error}</div>;

    // Find the current highest block height for the form
    const lastHeight = blocks.length > 0 ? blocks[0].block_height : 0;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Django/React Art Demo</h1>

            <BlockSubmissionForm 
                createBlock={createBlock} 
                lastHeight={lastHeight} 
                onError={setFormError}
            />

            {formError && <div style={{ color: 'red', marginBottom: '15px' }}>{formError}</div>}

            <h2>Block List ({blocks.length} Total)</h2>
            {blocks.map(block => (
                <div key={block.id} style={{ border: '1px solid #333', margin: '10px 0', padding: '15px', borderRadius: '5px' }}>
                    <p><strong>Height: {block.block_height}</strong> | Created: {new Date(block.timestamp).toLocaleTimeString()}</p>
                    <p><strong>Merkle Root:</strong> <code>{block.merkle_root}</code></p>
                    
                    <p><strong>Transactions:</strong></p>
                    <ul>
                        {block.transactions.map((tx, index) => <li key={index}>{tx}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default BlockChainView;