import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import validator from 'validator';
import { loginUser } from './send_user';

export const useLoginLogic = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
    };

    const handlePasswordChange = (e) => {
        const inputPassword = e.target.value;
        setPassword(inputPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Validar correo electrónico
        if (!validator.isEmail(trimmedEmail)) {
            setErrorMessage('Por favor, ingresa un correo electrónico válido.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, ingresa un correo electrónico válido.'
            });
            return;
        }

        // Validar contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#])[A-Za-z\d#]{8,}$/;
        if (!passwordRegex.test(trimmedPassword)) {
            setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y el carácter especial #.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y el carácter especial #.'
            });
            return;
        }

        // Si la contraseña pasa la validación, verifique el correo electrónico
        try {
            const result = await loginUser(trimmedEmail, trimmedPassword);
            if (result.success) {
                navigate('/chatbot');
            } else {
                console.error('Login failed: Invalid credentials');
                setErrorMessage(result.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Correo electrónico o contraseña incorrectos'
                });
            }
        } catch (error) {
            console.error('Login failed:', error.message || 'Correo electrónico o contraseña incorrectos');
            setErrorMessage('Correo electrónico o contraseña incorrectos');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Correo electrónico o contraseña incorrectos'
            });
        }
    };

    return {
        email,
        password,
        errorMessage,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit
    };
};
