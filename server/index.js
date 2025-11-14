require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;


// Origem
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


// Usuário de teste
const TEST_USER = { username: 'testuser', password: 'testpass', name: 'Test User' };


// POST /login -> retorna { token }
app.post('/login', (req, res) => {
const { username, password } = req.body || {};
if (!username || !password) return res.status(400).json({ error: 'missing credentials' });


if (username === TEST_USER.username && password === TEST_USER.password) {
const payload = { username: TEST_USER.username, name: TEST_USER.name };
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
return res.json({ token });
}


return res.status(401).json({ error: 'invalid credentials' });
});


// Middleware de autenticação
function authenticateToken(req, res, next) {
const auth = req.headers['authorization'];
if (!auth) return res.status(401).json({ error: 'missing authorization header' });


const parts = auth.split(' ');
if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'malformed authorization header' });


const token = parts[1];
jwt.verify(token, JWT_SECRET, (err, decoded) => {
if (err) return res.status(401).json({ error: 'invalid or expired token' });
req.user = decoded; // payload disponível nas rotas
next();
});
}


// Rota protegida
app.get('/private', authenticateToken, (req, res) => {
// Token for válido
return res.json({ message: `Olá ${req.user.name}, acesso autorizado.`, user: req.user });
});


app.get('/', (req, res) => res.send('JWT Auth Server is running'));


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));