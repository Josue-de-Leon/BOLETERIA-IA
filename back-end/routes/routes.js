const express = require('express');
const { body, validationResult } = require('express-validator');
const consulta = require('../BD/queries');
const router = express.Router();

router.post('/login', [
  body('username').isEmail().withMessage('Debe ser un correo electrónico válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .custom(value => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(value)) {
        throw new Error('La contraseña debe tener al menos una mayúscula, un número, un carácter especial y al menos 8 caracteres en total');
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

module.exports = router;
