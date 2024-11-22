import axios from 'axios';

axios.post('http://localhost:5000/api/skills', {
    name: 'JavaScript',
    description: 'A programming language',
    related_job: [1, 2, 3],
    related_LM: [4, 5, 6],
    n_LM: 3,
    n_finished: 1,
    status: true,
    note: '',
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error:', error);
});
