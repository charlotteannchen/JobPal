import axios from 'axios';

axios.post('http://localhost:5000/api/skills', {
    name: 'Python2',
    description: 'A programming language2',
    related_job: [4, 5, 6],
    related_LM: [1, 2, 3, 4],
    n_LM: 4,
    n_finished: 3,
    status: 1,
    note: 'aaa',
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error:', error);
});
