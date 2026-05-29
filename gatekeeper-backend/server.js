const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const cors = require('cors')

const PORT = 3000;
const app = express();
app.use(cors());
const connection = mysql.createConnection({
    host: 'localhost', //Just an example
    user: 'pulse_app', //Just an example
    password: 'pulse123', //Just an example
    database: 'gatekeeper_db' //Just an example
});

const saltRounds = 10;

const sql = 'INSERT INTO users (created_at, email, password, username) VALUES (NOW(), ?, ?, ?)';
const querySql = 'SELECT * FROM users WHERE email = ?';

app.use(express.json());

app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    bcrypt.hash(password, 10, function (err, encryptedPassword) {
        if (err){
            console.log(err);
            return res.status(500).json({ status: 'error', message: 'Encryption failed' });
        } else {
            connection.query(sql, [email, encryptedPassword, username], (err, result) => {
                if (err){
                    console.log(err);
                    return res.status(500).json({ status: 'error', error: err });
                }
                res.json({status: 'success', message: 'Successfully registered'});
            })
        }
    })
})

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    connection.query(querySql, [email], (err, result) => {
        if (err){
            console.log(err);
            return res.status(500).json({ status: 'error', error: err });
        }
        if (result.length === 0) {
            return res.status(401).json({status: 'error', message: 'Login failed.'});
        }
        bcrypt.compare(password, result[0].password, function (err, isMatch) {
            if (err){
                return res.status(401).json({status: 'error', message: 'Login failed.'});
            }
            if (!isMatch) {
                return res.status(401).json({status: 'error', message: 'Incorrect password.'});
            }
            res.status(200).json({status: 'success', message: 'Successfully logged in', username: result[0].username});
        })
    })
})




app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})



