import React from 'react';
import '../css/Login.css';
import { useLoginLogic } from '../js/logiclogin';

function Login() {
    const {
        email,
        password,
        errorMessage,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit
    } = useLoginLogic();

    return (
        <div className="v3_5">
            <div className="v3_6">
                <div className="v4_9">
                    <span className="v4_30">
                        Ingresa al backstage: Acceso exclusivo para los organizadores.
                    </span>
                    <span className="v4_31">
                        ¡Prepárate para gestionar conciertos y eventos!
                    </span>
                </div>
            </div>
            <div className="v4_11">
                <span className="v4_10">BOLETERIA GT</span>
                <span className="v4_12">Iniciar sesión</span>
                <span className="v9_33">Ingresa tu correo electrónico y contraseña</span>
                {errorMessage && <span className="error">{errorMessage}</span>}
                <form onSubmit={handleSubmit}>
                    <span className="v4_22">Correo electrónico</span>
                    <label className="v4_20">
                        <i className="fa-solid fa-user"></i>
                        <input
                            type="email"
                            className="v4_21"
                            placeholder=" Ingresa tu correo"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </label>
                    <span className="v4_26">Contraseña</span>
                    <label className="v4_20">
                        <i className="fa-solid fa-lock"></i>
                        <input
                            type="password"
                            className="v4_21"
                            placeholder=" Ingresa tu contraseña"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </label>
                    <input className="v4_27" type="submit" value="Iniciar sesión" />
                </form>
            </div>
        </div>
    );
}

export default Login;
