# JWT Auth — Node (Express) + React

Projeto mínimo demonstrando autenticação com **JWT**.

## Estrutura

```
/project-root
  ├── server   // back-end (Node/Express)
  │     └── index.js
  └── client   // front (React)
        └── src/App.js
```

## Comandos para rodar

### Back-end

```bash
cd server
npm install
# copie .env.example para .env e ajuste JWT_SECRET se desejar
npm start
```

Servidor padrão: **[http://localhost:4000](http://localhost:4000)**

### Front-end

```bash
cd client
npm install
npm start
```

App: **[http://localhost:3000](http://localhost:3000)**

> Observe: o front usa `API_BASE = 'http://localhost:4000'` em `client/src/App.js` e espera que o servidor aceite CORS de `http://localhost:3000`.

## Rotas principais

* `POST /login` → recebe `{ username, password }` e, para credenciais válidas, retorna JSON `{ token }`.
* `GET /private` → rota protegida; exige header `Authorization: Bearer <token>`; responde `200` com mensagem e payload do usuário quando o token é válido.

## Credenciais de teste

```
username: testuser
password: testpass
```

## Teste rápido (cURL)

**Obter token:**

```bash
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

**Acessar rota privada:**

```bash
curl http://localhost:4000/private \
  -H "Authorization: Bearer <TOKEN_AQUI>"
```

## Notas

* Token tem `expiresIn` configurado (ex.: 1h).
* Este projeto usa usuário em memória — troque para banco de dados e hashing de senha para produção.
* Token é salvo no front em `sessionStorage` (conforme `client/src/App.js`).
