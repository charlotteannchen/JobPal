import axios from 'axios';

const skillData = {
    id: 1,
    name: 'Python',
    description: 'An advanced programming language',
    related_job: [1, 2],
    related_LM: [4, 5],
    n_LM: 2,
    n_finished: 1,
    status: 1,
    note: '',
};

axios.put(`http://localhost:3000/api/skills/${skillData.id}`, skillData)
    .then(response => {
            console.log('Updated Skill:', response.data);
    })
    .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
    });