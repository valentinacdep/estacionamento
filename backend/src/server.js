const express = require('express');
const cors = require('cors');
const connection = require('./db_config');
const app = express();

app.use(cors());
app.use(express.json());

const port = 3030;

// login usuario
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  connection.query(query, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login bem-sucedido!' });
    } else {
      res.json({ success: false, message: 'Usuário ou senha incorretos!' });
    }
  });
});

// cadastro usuario
app.post('/cadastro', (req, res) => {
  const { email, senha } = req.body;
  const query = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
  
  connection.query(query, [email, senha], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao cadastrar.' });
    res.json({ success: true, message: 'Cadastrado com sucesso!', id: result.insertId });
  });
});

// listar carros do usuário logado
app.get('/carros', (req, res) => {
  const { usuarioId } = req.query;
  
  const query = 'SELECT * FROM carros WHERE usuario_id = ?';
  connection.query(query, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao listar.' });
    res.json({ success: true, carros: results });
  });
});

// atualizar carros
app.put('/carros/:id', (req, res) => {
  const { id } = req.params;
  const { modelo, placa, cor, vaga } = req.body;
  const query = 'UPDATE carros SET modelo = ?, placa = ?, cor = ?, vaga = ? WHERE id = ?';
  
  connection.query(query, [modelo, placa, cor, vaga, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar.' });
    res.json({ success: true, message: 'Atualizado com sucesso!' });
  });
});

// deletar carros
app.delete('/carros/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM carros WHERE id = ?';
  
  connection.query(query, [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao deletar.' });
    res.json({ success: true, message: 'Deletado com sucesso!' });
  });
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
