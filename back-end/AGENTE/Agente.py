from langchain_community.utilities import SQLDatabase
from langchain_openai import ChatOpenAI
from langchain_community.agent_toolkits import create_sql_agent
from langchain_community.vectorstores import FAISS
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_openai import OpenAIEmbeddings
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# Inicializa la aplicación Flask
app = Flask(__name__)
CORS(app)  # Habilita CORS para todos los endpoints de la aplicación
from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotPromptTemplate,
    MessagesPlaceholder,
    PromptTemplate,
    SystemMessagePromptTemplate,
)
load_dotenv()
db_name=os.getenv("DB_NAME")
db_user=os.getenv('DB_USER')
db_pass=os.getenv('DB_PASSWORD')
db_host=os.getenv('DB_HOST')
db_port=os.getenv('DB_PORT')
api_key=os.getenv("API_KEY")
# Establecer la conexión a la base de datos MySQL "db_eventos"
db = SQLDatabase.from_uri(f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}")

# Clave de API de OpenAI
openai_api_key = api_key

# Crear un modelo de lenguaje natural de ChatOpenAI con la clave de API proporcionada
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0, openai_api_key=openai_api_key)
@app.route('/Agente', methods=['POST'])
def Agentequestion():
    data = request.json
    question = data.get('question')
    if not question:
        return jsonify({'error': 'La pregunta es requerida'}), 400
    # Ejemplos de consultas SQL para interactuar con la base de datos

    examples = [
        # Consultas para la tabla `artistas`
        {"input": "Lista de todos los artistas.", "query": "SELECT * FROM artistas;"},
        {"input": "Detalles de un artista específico.",
         "query": "SELECT * FROM artistas WHERE Nombre_del_artista = 'Shakira';"},
        {"input": "Artistas que tienen 'a' en su nombre.",
         "query": "SELECT * FROM artistas WHERE Nombre_del_artista LIKE '%a%';"},

        # Consultas para la tabla `cupon`
        {"input": "Lista de todos los cupones disponibles.", "query": "SELECT * FROM cupon WHERE Cantidad_disponible > 0;"},
        {"input": "Cupones con un descuento mayor a 10%.", "query": "SELECT * FROM cupon WHERE Descuento > 10;"},
        {"input": "Cupones asociados a un evento específico.",
         "query": "SELECT c.* FROM cupon c JOIN entradas e ON c.ID_entradas = e.ID JOIN eventos ev ON e.ID_eventos = ev.ID WHERE ev.Nombre_del_evento = 'Festival de Música';"},

        # Consultas para la tabla `entradas`
        {"input": "Lista de todos los tipos de entradas disponibles.", "query": "SELECT * FROM entradas;"},
        {"input": "Entradas para un evento específico.", "query": "SELECT * FROM entradas WHERE ID_eventos = 1;"},
        {"input": "Entradas con precio mayor a 100.", "query": "SELECT * FROM entradas WHERE Precio > 100;"},

        # Consultas para la tabla `eventos`
        {"input": "Lista de todos los eventos.", "query": "SELECT * FROM eventos;"},
        {"input": "Eventos que ocurren en una fecha específica.",
         "query": "SELECT * FROM eventos WHERE Fecha = '2024-06-15';"},
        {"input": "Eventos en una ubicación específica.",
         "query": "SELECT * FROM eventos WHERE Ubicacion = 'Ciudad de Guatemala';"},

        # Consultas para la tabla `presentaciones`
        {"input": "Lista de todos los eventos en los que se presentará un artista específico.",
         "query": "SELECT e.Nombre_del_evento FROM eventos e JOIN presentaciones p ON e.ID = p.ID_evento JOIN artistas a ON p.ID_artista = a.ID WHERE a.Nombre_del_artista = 'Shakira';"},
        {"input": "Artistas que se presentan en un evento específico.",
         "query": "SELECT a.Nombre_del_artista FROM artistas a JOIN presentaciones p ON a.ID = p.ID_artista JOIN eventos e ON p.ID_evento = e.ID WHERE e.Nombre_del_evento = 'Metallica Live';"},

        # Consultas para la tabla `salida`
        {"input": "Lista de todas las salidas.", "query": "SELECT * FROM salida;"},
        {"input": "Salidas completadas.", "query": "SELECT * FROM salida WHERE Estado_compra = 'Completada';"},
        {"input": "Total de salidas por usuario específico.",
         "query": "SELECT COUNT(*) FROM salida WHERE ID_usuarios = 1;"},

        # Consultas para la tabla `salida_detalle`
        {"input": "Detalles de todas las salidas.", "query": "SELECT * FROM salida_detalle;"},
        {"input": "Detalles de salidas por ID de salida.", "query": "SELECT * FROM salida_detalle WHERE ID_salida = 1;"},
        {"input": "Detalles de entradas en estado 'No asistido'.",
         "query": "SELECT * FROM salida_detalle WHERE Estado_asistencia = 'No asistido';"},

        # Consultas para la tabla `usuarios`
        {"input": "Lista de todos los usuarios.", "query": "SELECT * FROM usuarios;"},
        {"input": "Usuarios con rol 'Admin'.", "query": "SELECT * FROM usuarios WHERE Rol = 'Admin';"},
        {"input": "Usuario específico por correo.",
         "query": "SELECT * FROM usuarios WHERE Correo = 'juan.perez@example.com';"}
    ]

    # Seleccionador de ejemplos semánticamente similares
    example_selector = SemanticSimilarityExampleSelector.from_examples(
        examples,
        OpenAIEmbeddings(openai_api_key=openai_api_key),  # Pasar la clave de API aquí
        FAISS,
        k=5,
        input_keys=["input"],
    )

    # Prefijo del mensaje del sistema
    system_prefix = """
    Eres un agente diseñado para interactuar con una base de datos SQL.
    Dada una pregunta de entrada, crea una consulta {dialect} sintácticamente correcta para ejecutar, luego mira los resultados de la consulta y devuelve la respuesta.
    A menos que el usuario especifique un número específico de ejemplos que desee obtener, siempre limita tu consulta a un máximo de {top_k} resultados.
    Puedes ordenar los resultados por una columna relevante para devolver los ejemplos más interesantes en la base de datos.
    Nunca consultes todas las columnas de una tabla específica, solo solicita las columnas relevantes dada la pregunta.
    Antes de ejecutar una consulta, verifica que las tablas y columnas especificadas existen en la base de datos para evitar errores.
    Usa la paginación para consultas que pueden devolver un gran número de resultados.
    Siempre usa consultas preparadas y parámetros en lugar de concatenar directamente las entradas del usuario en las consultas SQL para evitar vulnerabilidades de inyección SQL.
    Tienes acceso a herramientas para interactuar con la base de datos.
    Solo usa las herramientas proporcionadas. Solo usa la información devuelta por las herramientas para construir tu respuesta final.
    DEBES verificar tu consulta antes de ejecutarla. Si obtienes un error mientras ejecutas una consulta, reescribe la consulta y prueba nuevamente.
    NO realices ninguna declaración DML (INSERT, UPDATE, DELETE, DROP, etc.) en la base de datos.
    NO realices consultas que modifiquen la estructura de la base de datos (ALTER TABLE, CREATE TABLE, DROP TABLE, etc.).
    Usa consultas preparadas cuando sea posible para evitar vulnerabilidades de inyección SQL.
    Implementa límites de tiempo para la ejecución de consultas para evitar que consultas largas afecten el rendimiento del sistema.
    Si la pregunta no parece relacionada con la base de datos, simplemente devuelve "Dato no encontrado" como respuesta.
    Si se solicita una operación de modificación, eliminar, actualizar o mover los datos, devuelve "Operación no permitida, no se pueden realizar cambios en la base de datos." como respuesta.
    """

    # Plantilla de prompt de FewShot
    few_shot_prompt = FewShotPromptTemplate(
        example_selector=example_selector,
        example_prompt=PromptTemplate.from_template(
            "Entrada del usuario: {input}\nConsulta SQL: {query}"
        ),
        input_variables=["input", "dialect", "top_k"],
        prefix=system_prefix,
        suffix="",
    )

    # Plantilla completa del prompt
    full_prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate(prompt=few_shot_prompt),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad"),
        ]
    )

    # Obtener la pregunta desde la línea de comandos

    # Crear un agente para ejecutar las consultas
    agent_executor = create_sql_agent(
        llm=llm,
        db=db,
        prompt=full_prompt,
        verbose=False,
        agent_type="openai-tools",
    )

    # Invocar al agente y obtener la respuesta
    try:
        response = agent_executor.invoke(question)
        return jsonify({'question': question, 'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=4000, debug=True)


