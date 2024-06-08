const conexion=require('./Connection');
const conexionIA=require('./conexion');

function Usuarios(){
    return conexion('usuarios')

}

function InicioSesion(Correo,Contrasena){
    return conexion('usuarios').select('*').where('Correo',Correo).andWhere('Contrasena',Contrasena)

}
function Historial(){
    return conexionIA('Historial')

}

// insert into Historial(Pregunta,RespuestaIA)values('Cuantos Usuarios Tengo','Tiene un total de 3 usuarios')

function InsertarHistroial(Pregunta,RespuestaIA){
    return conexionIA('Historial').insert({
        Pregunta:Pregunta,
        RespuestaIA:RespuestaIA
    })
}

module.exports={
    Usuarios,
    InicioSesion,
    Historial,
    InsertarHistroial
}