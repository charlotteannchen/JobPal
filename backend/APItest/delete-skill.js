import axios from 'axios';

const skillId = 4;  // 假設要刪除 ID 為 2 的技能

axios.delete(`http://localhost:3000/api/skills/${skillId}`)
  .then(response => {
    console.log('Skill deleted:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
