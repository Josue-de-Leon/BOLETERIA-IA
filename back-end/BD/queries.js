const conexion=require('./Connection');


function Usuarios(){
    return conexion('usuarios')

}

function InicioSesion(Correo,Contrasena){
    return conexion('usuarios').select('*').where('Correo',Correo).andWhere('Contrasena',Contrasena)

}
module.exports={
    Usuarios,
    InicioSesion
}