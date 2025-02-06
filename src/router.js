const express = require("express");
const router = express.Router();
const usuarioController=require('./controllers/usuarioControles')


// Usuario
router.post("/login", usuarioController.loginController)
router.get("/usuario", usuarioController.getAll);
router.post('/usuario',usuarioController.novoUsuario)
router.delete('/usuario/:id_usuario', usuarioController.deleteUsuarios)
router.put('/usurios/:id_usuario', usuarioController.deleteUsuarios)
//Fim Usuario
//Historico Humor
router.get("/historicoHumor",usuarioController.HumorEstadoMentalUsuarioGetAll)




router.get("/historicoHumo/:id_usuario", usuarioController.Historico_usuario);




router.post("/historicoHumor",usuarioController.addHistorio)
router.delete("/deleteHistorico/:id_registro", usuarioController.deleteUsuarios)
//Fim Historico Humor


router.get("/atividade",usuarioController.AtividadeRealizadaGetAll)
router.post("/novaAtividade",usuarioController.addAtividade)

module.exports = router;
