const usuarioModel = require("../model/modelusuario"); 
const { Historico_usuarios } = require('../model/modelusuario');

const bcrypt = require("bcryptjs");

// Ajuste o caminho conforme a estrutura do seu projeto.

//Usuario
const getAll = async (req, res) => {
  try {
    const listaUsuarioModel = await usuarioModel.getAll();
    if (!listaUsuarioModel || listaUsuarioModel.length === 0) {
      return res.status(404).json({ message: "Nenhum usuário encontrado" });
    }
    return res.status(200).json(listaUsuarioModel);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
const loginController = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o email e a senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Chama a função de login do modelo
    const usuario = await usuarioModel.loginUsuario(email, senha); // Corrigido para chamar do modelo

    // Retorna uma resposta bem-sucedida com os dados do usuário
    res.status(200).json({
      message: 'Login bem-sucedido',
      usuario,
    });
  } catch (error) {
    // Responde com um status de erro e a mensagem apropriada
    res.status(401).json({
      message: error.message || 'Falha na autenticação',
    });
  }
};
const novoUsuario = async (req, res) => {
  try {
    const novoUsuario = await usuarioModel.novoUsuario(req.body);
    if (!novoUsuario) {
      return res.status(400).json({ message: "Erro ao criar usuário" });
    }
    return res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
const deleteUsuarios = async (req, res) => {
  const { id_usuario } = req.params;
  await usuarioModel.deleteUsuario(id_usuario);
  return res.status(204).json();
};

const updateusuarios = async (req, res) => {
  const { id_usuario } = req.params;
  await usuarioModel.updateusuarios(id_usuario, req.body);
  return response.status(204).json();
};
//Fim Usuario

//Humor Bem Estar
const HumorEstadoMentalUsuarioGetAll=async(req, res)=>{
  try{
    const listHistoricoHumor=await usuarioModel.HumorEstadoMentalUsuarioGetAll();

    if(!listHistoricoHumor || listHistoricoHumor.length===0){
      return res.status(404).json({message: "Nenhum Histórico Encotrado"})
    }
    return res.status(200).json(listHistoricoHumor)
  }catch(error){
    console.error("Erro ao Buscar Historico", error)

    return res.status(500).json({message:"Erro Interno no Servodor"})
  }
}





const Historico_usuario = async (req, res) => {
  const id_usuario = req.params.id_usuario; // Pegando o id_usuario da URL

  console.log(`meu Id ${id_usuario}`);

  // Validação do parâmetro
  if (!id_usuario) {
    return res.status(400).json({ message: "O ID do usuário é obrigatório." });
  }

  try {
    // Chama a função que busca o histórico de humor no banco de dados
    const listHistoricoHumor = await Historico_usuarios(req, res);

    // Verifica se o histórico foi encontrado
    if (!listHistoricoHumor || listHistoricoHumor.length === 0) {
      return res.status(404).json({ message: "Nenhum histórico encontrado para este usuário." });
    }

    // Retorna os dados do histórico
    return res.status(200).json(listHistoricoHumor);
  } catch (error) {
    // Se houver erro ao buscar o histórico
    console.error("Erro ao buscar histórico de humor:", error.message);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

module.exports = { Historico_usuario };





















const addHistorio=async (req,res)=>{
  try{
    const addHistorio=await usuarioModel.addHistorio(req.body);
    if(!addHistorio){
      return res.status(400).json({message:"Erro ao Cria novo Historico"})
    }
    return res.status(201).json(addHistorio)
  }catch(error){
    console.error("Error ao cria Histórico: ",error)
    return res.status(500).json({message: "Erro interno do Sevidor"})
  }
}

const deleteHistorico=async(req,res)=>{
  const [id_usuario, id_registro]=req.params
  await usuarioModel.deleteHistorico(id_usuario,id_registro);
  return res.status(204).json()
}

//Fim Humor Bem Estar
//Atividade Diario

const   AtividadeRealizadaGetAll =async(req,res)=>{
  try{
    const listaAtividadeRealizada=await usuarioModel.AtividadeRealizadaGetAll();


    if(!listaAtividadeRealizada || listaAtividadeRealizada.length===0){
      return res.status(404).json({message:"Nenhuma Atividade Encotrada"})
    }

    return res.status(200).json(listaAtividadeRealizada)
  }catch(error){
    console.error("Erro ao Buscar Atividade Realizada")
  }
}

const   addAtividade= async(req,res)=>{
  try{
    const addAtividade=await usuarioModel.addAtividade(req.body)
    if(!addAtividade){
      return res.status(400).json({message:"Erro ao Cria novo Historico"})
    }
    return res.status(201).json(addAtividade)
  }catch(error){
    console.error("Error ao cria Nova Atividade: ",error)
    return res.status(500).json({message: "Erro interno do Sevidor"})
  }
}
module.exports = {
  getAll,
  novoUsuario,
  deleteUsuarios,
  updateusuarios,
  loginController,
  HumorEstadoMentalUsuarioGetAll,
  addHistorio,
  deleteHistorico,
  AtividadeRealizadaGetAll,
  addAtividade,
  Historico_usuario
};
