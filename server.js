const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000; // A porta onde seu servidor vai rodar

// --- Armazenamento em Memória ---
// Um array simples para guardar as submissões.
// Em um projeto real, isso seria um banco de dados.
let submissoes = [];

// --- Middlewares ---
app.use(cors()); // Permite que qualquer front-end acesse nossa API
app.use(express.json()); // Habilita o servidor a entender requisições com corpo em JSON
app.set('trust proxy', true); // Necessário para obter o IP correto se houver proxies no caminho

// --- Rotas (Endpoints) ---

/**
 * @route   POST /submit
 * @desc    Recebe os dados do formulário dos alunos.
 */
app.post('/submit', (req, res) => {
    // 1. Pega os dados enviados pelo aluno no corpo (body) da requisição
    const dadosDoAluno = req.body;

    // 2. Cria um novo registro com os dados, o IP e a data/hora
    const novaSubmissao = {
        dados: dadosDoAluno,
        ip: req.ip, // Express já nos dá o IP do requisitante!
        timestamp: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    };

    // 3. Adiciona o novo registro no nosso "banco de dados" em memória
    submissoes.unshift(novaSubmissao); // unshift() adiciona no início do array

    console.log('Nova submissão recebida de:', req.ip);
    console.log('Dados:', dadosDoAluno);

    // 4. Retorna uma resposta de sucesso
    res.status(201).json({ message: 'Dados recebidos com sucesso!', data: novaSubmissao });
});

/**
 * @route   GET /submissoes
 * @desc    Fornece a lista de todas as submissões para a página de controle.
 */
app.get('/submissoes', (req, res) => {
    res.status(200).json(submissoes);
});

// --- Inicia o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor de controle rodando na porta ${PORT}`);
    console.log('Aguardando submissões dos alunos...');
});
