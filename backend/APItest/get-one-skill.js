import axios from 'axios';

axios.get('http://localhost:5000/api/skills/1')
  .then(response => { // 如果請求成功，會進入 .then() 來處理並顯示數據。
    console.log(response.data); // 直接訪問 response.data 來獲取 JSON 數據
  })
  .catch(error => { // 如果請求失敗，會進入 .catch()，顯示錯誤。
    console.error('Error:', error); // 這裡可以簡單地顯示錯誤
  });