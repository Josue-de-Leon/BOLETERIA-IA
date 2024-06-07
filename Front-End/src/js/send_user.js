export const loginUser = async (username, password) => {
    const url = 'http://localhost:2500/login';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Network response was not ok');
        }

        return result;
    } catch (error) {
        console.error('Error in loginUser:', error.message || error);
        throw error;
    }
};
