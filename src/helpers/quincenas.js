import { formatearFechaES } from './formatos'

export const obtenerPeriodoQuincena = (anio, mes, quincena) => {
  const diasMes = new Date(anio, mes, 0).getDate()
  const fechaInicial = new Date(anio, mes - 1, quincena === 1 ? 1 : 16)
  const fechaFinal = new Date(anio, mes - 1, quincena === 1 ? 15 : diasMes)
  const periodo = formatearFechaES(fechaInicial) + ' al ' + formatearFechaES(fechaFinal)
  return periodo
}
export const obtenerQuincenas = (anio) => {
  // Lista con todas las quincenas del año en orden
  let listaQuincenas = []

  for (let mes = 1; mes <= 12; mes++) {
    for (let num = 1; num <= 2; num++) {
      const quincena = {
        anio: 0,
        mes: 0,
        numero: 1,
        descripcion: '',
        fechaInicial: new Date(),
        fechaFinal: new Date()
      }
      const diasMes = new Date(anio, mes, 0).getDate()
      quincena.anio = Number(anio)
      quincena.mes = Number(mes)
      quincena.numero = Number(num)
      quincena.descripcion = num === 1 ? 'Primera Quincena' : 'Segunda Quincena'
      quincena.fechaInicial = new Date(anio, mes - 1, num === 1 ? 1 : 16)
      quincena.fechaFinal = new Date(anio, mes - 1, num === 1 ? 15 : diasMes)
      listaQuincenas = [...listaQuincenas, quincena]
    }
  }
  return listaQuincenas
}
