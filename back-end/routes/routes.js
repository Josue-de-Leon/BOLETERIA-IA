const express = require('express');
const { body, validationResult } = require('express-validator');
const consulta = require('../BD/queries');

const router = express.Router();

router.post('/login', [
  body('username').isEmail().withMessage('Debe ser un correo electrónico válido'),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .custom(value => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#])[A-Za-z\d#]{8,}$/;
      if (!passwordRegex.test(value)) {
        throw new Error('La contraseña debe tener al menos una mayúscula, una minúscula, un número y el carácter especial #');
      }
      return true;
    })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const respuesta = await consulta.InicioSesion(username, password);
    if (respuesta && respuesta.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error during login process' });
  }
});



router.get('/Historial',(req,res)=>{
  consulta.Historial()
  .then(respuesta=>res.json(respuesta))
  .catch((e)=>{
      res.status(500).json({message:"hay un error"});
  })

})

router.post('/NuevoHistorial',(req,res)=>{
  const Pregunta=req.body.Pregunta;
  const RespuestaIA=req.body.RespuestaIA;
  consulta.InsertarHistroial(Pregunta,RespuestaIA)
  .then(respuesta=>{
      if(respuesta){
          res.status(200).json({message:"Historial guardado"});
      }else{
          res.status(400).json({message:"hay un error"});
      }
  })
  .catch((e)=>{
      res.status(500).json({message:"hay un error"});
  })
});


module.exports = router;
