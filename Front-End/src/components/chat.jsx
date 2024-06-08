import React, { useEffect, useState } from "react";

function Chat() {
    const [respuestasIa, setRespuestasIa] = useState([]);
    const [preguntas, setPreguntas] = useState([]);

    const RespuestaAngente = (ev) => {
        if (ev.key === "Enter") {
            const mensajeInput = document.getElementById("mensaje");
            const mensaje = mensajeInput.value;
            // Verificar si el mensaje está vacío o solo contiene espacios en blanco
            if (!mensaje || mensaje.trim().length === 0) {
                alert('Debes llenar todos los campos');
                return;
            } else {
                fetch('http://127.0.0.1:4000/Agente', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        question: mensaje
                    }),
                })
                .then(res => res.json())
                .then((respuesta) => {
                    // Aquí puedes manejar la respuesta del agente
                    const nuevaPregunta = mensaje;
                    const nuevaRespuesta = respuesta.response.output;
    
                    // Añadir el nuevo historial
                    AgregarHistorial(nuevaPregunta, nuevaRespuesta);
                    
                    // Actualizar el estado para mostrar la nueva pregunta y respuesta en la interfaz de usuario
                    setPreguntas(prevPreguntas => [...prevPreguntas, nuevaPregunta]);
                    setRespuestasIa(prevRespuestas => [...prevRespuestas, nuevaRespuesta]);
    
                    // Limpiar el input de mensaje
                    mensajeInput.value = '';
                })
                .catch(error => console.error('Error:', error));
            }
        }
    };


    const HistorialAngente = () => {
        fetch('http://localhost:2500/Historial')
            .then(res => res.json())
            .then((respuesta) => {
                const preguntasArr = respuesta.map(item => item.Pregunta);
                const respuestasArr = respuesta.map(item => item.RespuestaIA);
                setPreguntas(preguntasArr);
                setRespuestasIa(respuestasArr);
            })
            .catch(error => console.error('Error:', error));
    };

    const AgregarHistorial = (Pregunta, RespuestaIA) => {
        fetch('http://localhost:2500/NuevoHistorial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Pregunta: Pregunta,
                RespuestaIA: RespuestaIA
            }),
        })
        .then(res => res.json())
        .then(() => {
            console.log("Agregado con éxito");
        })
        .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        HistorialAngente();
    }, []);

    return (
        <div className='container1'>
            {/* Renderizado estático */}

            {/* Renderizado dinámico del historial */}
            {preguntas.map((pregunta, index) => (
                <React.Fragment key={index}>
                    <div className="con_user">
                        <div className="circule_user_chat">
                            <i className='fa-solid fa-user icon_user1'></i>
                        </div>
                        <div className="container_mensaje_usuario">
                            <h2 className="name_user">Tú</h2>
                            <p>{pregunta}</p>
                        </div>
                    </div>
                    <div className="con_IA">
                        <div className="container_mensaje_IA">
                            <div className="text_container">
                                <h2 className="name_IA">Boletria GT</h2>
                                <div className="mensaje_IA">{respuestasIa[index]}</div>
                            </div>
                        </div>
                        <div className="circule_IA"></div>
                    </div>
                </React.Fragment>
            ))}

            <div className="cont_input_mensaje">
                <input
                    onKeyDown={RespuestaAngente}
                    className="input_mensaje"
                    type="text"
                    id="mensaje"
                    name="mensaje"
                    placeholder="Escribe un mensaje..."
                />
            </div>
        </div>
    );
}

export default Chat;
