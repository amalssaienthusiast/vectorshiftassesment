// Submit button — sends the current pipeline to the backend for DAG validation.
// Displays results via alert() and a styled toast notification.

import { useState } from 'react';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';

export const SubmitButton = () => {
    const { nodes, edges } = useStore(useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
    })));
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async () => {
        // Guard: don't send an empty pipeline
        if (nodes.length === 0) {
            alert('Pipeline is empty. Add some nodes first.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            const message = `Nodes: ${data.num_nodes} | Edges: ${data.num_edges} | Valid DAG: ${data.is_dag ? 'Yes' : 'No'}`;
            alert(message);
            showToast(message, data.is_dag ? 'success' : 'warning');
        } catch (err) {
            // "Failed to fetch" means the backend server isn't running
            const errMsg = err.message === 'Failed to fetch'
                ? 'Backend is not running. Start it with: uvicorn main:app --reload'
                : `Error: ${err.message}`;
            alert(errMsg);
            showToast(errMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="submit-wrapper">
            <button
                type="button"
                className="submit-button"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Pipeline'}
            </button>
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};
