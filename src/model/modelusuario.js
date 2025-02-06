const connection = require("./connection");
const bcrypt = require("bcryptjs");

//Usuario
const getAll = async () => {
  try {
    // Executa a consulta e desestrutura o resultado
    const [listaUsuarios] = await connection.execute("SELECT * FROM Usuarios");

    // Verifica se `listaUsuarios` é realmente um array
    if (!Array.isArray(listaUsuarios)) {
      throw new TypeError("Resultado da consulta não é um array");
    }

    return listaUsuarios;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error; // Propaga o erro para que ele seja tratado no controlador
  }
};

const loginUsuario = async (email, senha) => {
  try {
    // Verifica se o email e a senha foram fornecidos
    if (!email || !senha) {
      throw new Error("Email e senha são obrigatórios");
    }

    // Consulta o usuário pelo email
    const queryBuscaUsuario = "SELECT * FROM Usuarios WHERE email = ?";
    const [usuarios] = await connection.execute(queryBuscaUsuario, [email]);

    // Verifica se o usuário foi encontrado
    if (usuarios.length === 0) {
      throw new Error("Usuário não encontrado");
    }

    const usuario = usuarios[0];

    // Compara a senha fornecida com a senha criptografada no banco de dados
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error("Senha incorreta");
    }

    // Retorna os dados do usuário (excluindo a senha)
    return {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      data_nascimento: usuario.data_nascimento,
      genero: usuario.genero,
    };
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};
const novoUsuario = async (usuario) => {
  const { nome, email, senha } = usuario;

  if (!nome || !email || !senha) {
    throw new Error("Nome, email e senha são obrigatórios");
  }

  const queryVerificaUsuario = "SELECT * FROM Usuarios WHERE email = ?";
  const [usuarios] = await connection.execute(queryVerificaUsuario, [email]);

  if (usuarios.length > 0) {
    throw new Error("Já existe um usuário com esse email");
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const queryInserirUsuario =
    "INSERT INTO Usuarios (nome, email, senha) VALUES (?, ?, ?)";
  const [result] = await connection.execute(queryInserirUsuario, [
    nome,
    email,
    senhaCriptografada,
  ]);

  const insertId = result.insertId;

  // Consulta os dados do usuário recém-cadastrado
  const queryBuscarUsuario =
    "SELECT id_usuario, nome, email FROM Usuarios WHERE id_usuario = ?";
  const [novoUsuario] = await connection.execute(queryBuscarUsuario, [
    insertId,
  ]);

  if (novoUsuario.length === 0) {
    throw new Error("Erro ao buscar o usuário recém-cadastrado");
  }

  return novoUsuario[0]; // Retorna o objeto completo do usuário
};

const deleteUsuario = async (id_usuario) => {
  const removerUsuario = await connection.execute(
    "DELETE FROM Usuarios WHERE id_usuario=?",
    [id_usuario]
  );

  return removerUsuario;
};

const updateUsuarios = async (id_usuario, usuario) => {
  const { nome, email, senha, data_nascimento, genero } = usuario;
  const query = `
    UPDATE Usuarios 
    SET nome = ?, email = ?, senha = ?, data_nascimento = ?, genero = ? 
    WHERE id_usuario = ?`;
  const [updateUsuariosResult] = await connection.execute(query, [
    nome,
    email,
    senha,
    data_nascimento,
    genero,
    id_usuario,
  ]);

  return updateUsuariosResult;
};

//Fim Usuario
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
//HumorBemEstar
const HumorEstadoMentalUsuarioGetAll = async () => {
  try {
    const [historicoHumorEstadoMentalUsuario] = await connection.execute(
      "SELECT *FROM HumorEstadoMental"
    );

    if (!Array.isArray(historicoHumorEstadoMentalUsuario)) {
      throw new TypeError("Resultado da consulta não é um array");
    }

    return historicoHumorEstadoMentalUsuario;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};




const Historico_usuarios = async (req, res) => {
  const idUsuario = req.params.id_usuario;

  console.log(`Meu id ${idUsuario}`);
  try {
    const query = `
      SELECT 
        u.id_usuario,
        u.nome,
        he.id_registro,
        he.data_registro,
        he.humor,
        he.comentarios
      FROM 
        Usuarios u
      LEFT JOIN 
        HumorEstadoMental he ON u.id_usuario = he.id_usuario
      WHERE 
        u.id_usuario = ? 
      ORDER BY 
        he.data_registro DESC;
    `;

    const [results] = await connection.execute(query, [idUsuario]);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Nenhum histórico encontrado para este usuário" });
    }

    return results; // Corrigido: agora apenas retorna os resultados sem tentar enviar a resposta novamente
  } catch (error) {
    console.error("Erro ao buscar histórico de humor:", error.message); // Log para ver o erro
    throw error; // Lançar o erro para ser tratado no chamador
  }
};


const addHistorio = async (historicoUsuario) => {
  const { id_usuario, data_registro, humor, comentarios } = historicoUsuario;
  console.log(id_usuario, data_registro, humor, comentarios);
  const queryiserirHistorico =
    "INSERT INTO HumorEstadoMental (id_usuario,data_registro,humor,comentarios) VALUES (?,?,?,?)";
  const [result] = await connection.execute(queryiserirHistorico, [
    id_usuario,
    data_registro,
    humor,
    comentarios,
  ]);

  return { insertId: result.insertId };
};

const deleteHistorico = async (id_registro) => {
  if (!id_registro) {
    throw new Error("ID inválido ou ausente.");
  }

  const [rows] = await connection.execute(
    "SELECT id_registro FROM HumorEstadoMental WHERE id_registro = ?",
    [id_registro]
  );

  if (rows.length === 0) {
    throw new Error(`Registro com ID ${id_registro} não encontrado.`);
  }

  const removerHistorico = await connection.execute(
    "DELETE FROM HumorEstadoMental WHERE id_registro = ?",
    [id_registro]
  );

  return removerHistorico;
};
//Fim Humor
const AtividadeRealizadaGetAll = async () => {
  try {
    const [atividadeRealizada] = await connection.execute(
      "SELECT *FROM AtividadesRealizadas"
    );

    if (!Array.isArray(atividadeRealizada)) {
      throw new TypeError("Resultado da consulta não é um array");
    }

    return atividadeRealizada;
  } catch (error) {
    console.error("Erro ao Buscar Atividade Realizada: ", error);
    throw error;
  }
};
const addAtividade = async (novoAtividade) => {
  const { id_usuario, tipo_atividade, Duracao_minutos, data_atividade } =
    novoAtividade;

  const queryInsertAtividade =
    "INSERT INTO AtividadesRealizadas (id_usuario,tipo_atividade,Duracao_minutos,data_atividade) VALUES (?,?,?,?)";

  const [result] = await connection.execute(queryInsertAtividade, [
    id_usuario,
    tipo_atividade,
    Duracao_minutos,
    data_atividade,
  ]);

  return { insertId: result.insertId };
};

module.exports = {
  getAll,
  novoUsuario,
  deleteUsuario,
  updateUsuarios,
  loginUsuario,
  HumorEstadoMentalUsuarioGetAll,
  addHistorio,
  deleteHistorico,
  AtividadeRealizadaGetAll,
  addAtividade,
  Historico_usuarios ,
};
