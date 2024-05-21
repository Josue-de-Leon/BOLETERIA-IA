import '../css/Login.css';

function Login() {
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
                <span className="v9_33">Ingresa tu nombre de usuario y contraseña</span>
                <form action="">
                    <span className="v4_22">Nombre de usuario</span>
                    <label className="v4_20">
                        <i className="fa-solid fa-user"></i>
                        <input
                            type="text"
                            className="v4_21"
                            placeholder=" Ingresa tu usuario"
                        />
                    </label>
                    <span className="v4_26">Contraseña</span>
                    <label className="v4_20">
                        <i className="fa-solid fa-lock"></i>
                        <input
                            type="password"
                            className="v4_21"
                            placeholder=" Ingresa tu contraseña"
                        />
                    </label>
                    <input className="v4_27" type="submit" value="Iniciar sesión" />
                </form>
            </div>
            
        </div>
    );
}

export default Login;