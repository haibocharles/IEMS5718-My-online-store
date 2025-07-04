// 使用參數化查詢來防止SQL注入攻擊
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // bcrypt 加密鹽 10 表示加密強度
const hashedPassword = bcrypt.hashSync("raw_password", salt);
const db = require('./db'); // 引入自定义数据库操作模块


//是否是管理者授權更改











//新增產品類別
router.post('/add',(req, res) => {
    const { name } = req.body;
    if (!name) 
        return res.status(400).send('Category name is required');

    // 檢查類別名稱是否已存在
    const checkSql = 'SELECT * FROM categories WHERE name = ?';
    db.query(checkSql, [name], (err, results) => {
        if (err) return res.status(500).send('Database error');
        
        if (results.length > 0) {
            // 如果名稱已存在，返回警告
            return res.status(400).send('Category name already exists');
        }

        // 插入新的類別名稱
        const sql = 'INSERT INTO categories (name) VALUES (?)';
        db.query(sql, [name], (err) => {
            if (err) return res.status(500).send('Database error');
            res.send('Category added successfully');
        });
    });
 
});

//獲取所有產品類別

router.get('/search', (req, res) => {
const { name } = req.query; // 從查詢參數中獲取名稱
  if (!name) {
    return res.status(400).send('Category name is required');
  }

  const sql = 'SELECT * FROM categories WHERE name = ?';
  db.query(sql, [name], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length > 0) {
      res.json(results[0]); // 返回查詢到的分類
    } else {
      res.status(404).send('Category not found');
    }
  });
});

//編輯產品類別
router.post('/update', (req, res) => {
    const { catid, name } = req.body;
    if (!catid || !name) {
      return res.status(400).send('Category ID and name are required');
    }
  
    const sql = 'UPDATE categories SET name = ? WHERE catid = ?';
    db.query(sql, [name, catid], (err) => {
      if (err) return res.status(500).send('Database error');
      res.send('Category updated successfully');
    });
  });

//刪除產品類別

router.post('/delete', (req, res) => {
    const { name } = req.body;

    // 檢查是否提供了 catid
    if (!name) {
        return res.status(400).send('Category Name is required');
    }

    // 檢查分類是否存在
    const checkSql = 'SELECT * FROM categories WHERE name = ?';
    db.query(checkSql, [name], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(404).send('Category not found');
        }

        // 如果分類存在，執行刪除操作
        const deleteSql = 'DELETE FROM categories WHERE name = ?';
        db.query(deleteSql, [name], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error');
            }
            res.send('Category deleted successfully');
        });
    });
});


//獲取所有產品類別,展示在html
router.get('/', (req, res) => {
    const query = 'SELECT * FROM categories';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.json(results);
    });
});




module.exports = router;
