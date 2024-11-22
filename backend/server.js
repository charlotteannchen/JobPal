const express = require('express'); // 引入 Express 模組
const bodyParser = require('body-parser');
const cors = require('cors');
// Import sqlite3
const sqlite3 = require('sqlite3').verbose();

const app = express(); // 創建應用實例
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 創建或連接 SQLite 數據庫
const db = new sqlite3.Database('./database.db',
  // 打開一個 SQLite 數據庫文件'database.db'。如果文件不存在，會自動創建一個新的數據庫文件。
  (err) => { 
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// ======================= User API ==================================

// 創建一個名為 users 的表，並且只在該表尚不存在時執行創建操作
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
    /*id: 列名，用於存儲每條記錄的唯一標識。
    // INTEGER: 數據類型，表示此列只能存儲整數。
    // PRIMARY KEY: 設置該列為主鍵，確保值唯一且非空。
    // AUTOINCREMENT: 每次插入新記錄時，自動生成唯一的整數值。*/
  name TEXT NOT NULL,
    /* NOT NULL: 表示此列的值不能為空。*/
  email TEXT NOT NULL UNIQUE
    /* UNIQUE: 確保該列中的值必須唯一，不能有重複的電子郵件。*/
)`);

// API Endpoint: Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API Endpoint: Add a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// ======================= Skill API ==================================

db.run(`CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
    /*id: 列名，用於存儲每條記錄的唯一標識。
    INTEGER: 數據類型，表示此列只能存儲整數。
    PRIMARY KEY: 設置該列為主鍵，確保值唯一且非空。
    AUTOINCREMENT: 每次插入新記錄時，自動生成唯一的整數值。*/
  name TEXT NOT NULL,
    /* NOT NULL: 表示此列的值不能為空。*/
  description TEXT DEFAULT '',
  related_job TEXT DEFAULT '[]',
    /* default為空JSON數組，使用 TEXT 類型來存儲 JSON，進行更靈活的查詢和過濾 */
  related_LM TEXT DEFAULT '[]',
  n_LM INTEGER DEFAULT 0,
  n_finished INTEGER DEFAULT 0,
  status BOOL DEFAULT 0,
    /* 1:In progess; 0:Finished */
  note TEXT DEFAULT ''
)`);

app.get('/api/skills', (req, res) => {
  db.all('SELECT * FROM skills', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // 解析 JSON 字段
    rows.forEach(row => {
      row.related_job = JSON.parse(row.related_job);
      row.related_LM = JSON.parse(row.related_LM);
    });
    res.json(rows);
  });
});

app.get('/api/skills/:id', (req, res) => {
  const { id } = req.params;  // 從 URL 參數中獲取 skill ID

  db.get('SELECT * FROM skills WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    // 解析 JSON 字段
    row.related_job = JSON.parse(row.related_job);
    row.related_LM = JSON.parse(row.related_LM);
    res.json(row);
  });
});

app.post('/api/skills', (req, res) => {
  const { name, description, related_job, related_LM, n_LM, n_finished, status, note } = req.body;
  db.run('INSERT INTO skills (name, description, related_job, related_LM, n_LM, n_finished, status, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, JSON.stringify(related_job), JSON.stringify(related_LM), n_LM, n_finished, status, note], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.put('/api/skills/:id', (req, res) => {
  const skillId = req.params.id; // 從路徑中獲取 skill 的 id
  const { id, name, description, related_job, related_LM, n_LM, n_finished, status, note } = req.body;

  // 構建更新的 SQL 查詢
  const query = `
    UPDATE skills
    SET name = ?, description = ?, related_job = ?, related_LM = ?, n_LM = ?, n_finished = ?, status = ?, note = ?
    WHERE id = ?
  `;

  // 執行更新操作
  db.run(query, [name, description, JSON.stringify(related_job), JSON.stringify(related_LM), n_LM, n_finished, status, note, skillId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      // 如果沒有更新任何記錄，返回 404
      return res.status(404).json({ message: 'Skill not found' });
    }

    // 成功更新後返回更新的記錄 id
    res.status(200).json({ message: 'Skill updated successfully', id: skillId });
  });
});

app.delete('/api/skills/:id', (req, res) => {
  const { id } = req.params;  // 獲取要刪除的技能 ID
  
  // 執行刪除操作
  const query = 'DELETE FROM skills WHERE id = ?';
  
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      // 如果沒有找到匹配的技能，返回 404
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // 返回成功的刪除信息
    res.status(200).json({ message: 'Skill deleted successfully' });
  });
});

// ======================= learning materials API ==================================

db.run("PRAGMA foreign_keys = ON");
db.run(`CREATE TABLE IF NOT EXISTS LMs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
    /*id: 列名，用於存儲每條記錄的唯一標識。
    // INTEGER: 數據類型，表示此列只能存儲整數。
    // PRIMARY KEY: 設置該列為主鍵，確保值唯一且非空。
    // AUTOINCREMENT: 每次插入新記錄時，自動生成唯一的整數值。*/
  skill_id INTEGER,
    FOREIGN KEY (skill_id) REFERENCES skills(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
  name TEXT NOT NULL,
    /* NOT NULL: 表示此列的值不能為空。*/
  hyperlink TEXT,
  status BOOL DEFAULT 0, /* 1:notfinished; 0:finish */
  experted_duration INTEGER,
  note TEXT
)`);

app.get('/api/lms', (req, res) => {
  db.all('SELECT * FROM LMs', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/lms/:id', (req, res) => {
  const { id } = req.params;  // 從 URL 參數中獲取 skill ID

  db.get('SELECT * FROM LMs WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Learning material not found' });
    }
    res.json(row);
  });
});

app.post('/api/lms', (req, res) => {
  const { name, description, related_job, related_LM, n_LM, n_finished } = req.body;
  db.run('INSERT INTO LMs (name, description, related_job, related_LM, n_LM, n_finished) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, JSON.stringify(related_job), JSON.stringify(related_LM), n_LM, n_finished], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.put('/api/lms/:id', (req, res) => {
  const skillId = req.params.id; // 從路徑中獲取 skill 的 id
  const { name, description, related_job, related_LM, n_LM, n_finished } = req.body;

  // 構建更新的 SQL 查詢
  const query = `
    UPDATE skills
    SET name = ?, description = ?, related_job = ?, related_LM = ?, n_LM = ?, n_finished = ?
    WHERE id = ?
  `;

  // 執行更新操作
  db.run(query, [name, description, JSON.stringify(related_job), JSON.stringify(related_LM), n_LM, n_finished, skillId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      // 如果沒有更新任何記錄，返回 404
      return res.status(404).json({ message: 'Skill not found' });
    }

    // 成功更新後返回更新的記錄 id
    res.status(200).json({ message: 'Skill updated successfully', id: skillId });
  });
});

app.delete('/api/lms/:id', (req, res) => {
  const { id } = req.params;  // 獲取要刪除的技能 ID
  
  // 執行刪除操作
  const query = 'DELETE FROM skills WHERE id = ?';
  
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      // 如果沒有找到匹配的技能，返回 404
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // 返回成功的刪除信息
    res.status(200).json({ message: 'Skill deleted successfully' });
  });
});