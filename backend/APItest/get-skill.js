import axios from 'axios';

axios.get('http://localhost:5000/api/skills')
  .then(response => {
    console.log(response.data); // 直接訪問 response.data 來獲取 JSON 數據
  })
  .catch(error => {
    console.error('Error:', error); // 這裡可以簡單地顯示錯誤
  });