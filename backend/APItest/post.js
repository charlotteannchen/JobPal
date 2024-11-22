import axios from 'axios';

axios.post('http://localhost:3000/api/users', {
    name: 'Steve',
    email: 'steve@example.com'
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error:', error);
});
