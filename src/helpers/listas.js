
export const listaMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const fecha = new Date()
const anio = fecha.getFullYear()
export const listaAnios = [anio, anio - 1, anio - 2, anio - 3, anio - 4]

export const listaQuincenas = ['Primera Quincena', 'Segunda Quincena']
export const listaTrimestres = ['Primer Trimestre', 'Segundo Trimestre', 'Tercer Trimestre', 'Cuarto Trimestre']
export const listaDepartamentos = ['Nuevos', 'Seminuevos']

export const obtenerNumeroTrimestre = (trimestre) => {
  return listaTrimestres.indexOf(trimestre) + 1
}
