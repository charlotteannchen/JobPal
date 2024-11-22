import axios from 'axios';

// Fetch skill data based on skillId
export async function fetchSkill(skillId) {
    try {
        // Making GET request to fetch skill data
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/skills/${skillId}`);
        
        // Return the data if successful
        return response.data;
    } catch (err) {
        // Log error to console
        console.error("Error fetching skill:", err);
        
        // Throw error to be handled by the calling function
        throw new Error(`Failed to fetch skill with id ${skillId}`);
    }
}

// Edit skill data based on skillId
export async function editSkill(skillData) {
    // Send PUT request to update the skill data
    try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/skills/${skillData.id}`, skillData);
        console.log('Updated Skill:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}
