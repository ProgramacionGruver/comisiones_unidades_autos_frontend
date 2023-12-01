

export const fecha = new Date()

export const anio = fecha.getFullYear()

const mesAnterior = fecha.getMonth()
export const mesFormateado = mesAnterior < 10 ? `0${mesAnterior}` : mesAnterior.toString()

const fechaActual = new Date()
const anioActual = fechaActual.getFullYear();
const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
const diaActual = fechaActual.getDate().toString().padStart(2, '0')

export const fechaFormateada = `${anioActual}-${mesActual}-${diaActual}`

export const meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto","Septiembre", "Octubre", "Noviembre", "Diciembre"]

export const anios = [anio, anio - 1, anio - 2, anio - 3, anio - 4];

export const mes = meses[fecha.getMonth()]

export const dia = fecha.getDay()

export const quincenaCaida = () => {
    const quincena = dia <= 15? "Segunda Quincena" : "Primera Quincena"
    return quincena
  }

export const mesCaido = () => {
    let mes
    if(dia <= 15){
      mes = meses[(fecha.getMonth()-1)]
    }else{
      mes = meses[fecha.getMonth()]
    }
    return mes
}

export const obtenerNumeroMes = (mes) => meses.indexOf(mes) + 1

export const obtenerNumerosDeMes = (mes) => {
  const numeroMes = meses.indexOf(mes) + 1;
  return numeroMes.toString().padStart(2, '0');
}

export const obtenerNumeroQuincena = (quincena) => quincena === 'Primera Quincena' ? 1 : 2

export const objBusquedaEsquema = [
  'ASESOR COMERCIAL',
  'GERENTE COMERCIAL',
  'GERENTE DE VENTAS',
  'GERENTE GENERAL',
  'GERENTE REGIONAL',
  'JEFE DE VENTAS',
  'COORDINADOR DE COMPRAS',
  'ENLACE FINANCIERO',
  'GERENTE DE VENTAS DE SEMINUEVOS'
]

export const usuariosEditan = [
  'ENLACE FINANCIERO',
  'ASISTENTE DE VENTAS',
]

export const usuariosDirectivo = [
  'hhernandez',
  'hgonzalez',
  'jreyesl',
  'amagdaleno',
  'jpedroza',
  'nperez'
]

export const objBusquedaAutorizaciones = [
  'GEADM',
  'GESE'
]
