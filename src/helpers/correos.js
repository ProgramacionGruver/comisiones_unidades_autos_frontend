import { formatearMonto } from './formatearFecha'
import { formatearNumeroEmpleado, formatearCapitalCase } from './formatos'

export const mensajeAutorizaciones = (comision, primerResponsable, segundoResponsable, tercerResponsable) => {
  return `
  <h3>Se requiere su autorización de la comisión con los siguientes detalles. </h3>
  <table border='1' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
  <thead bgcolor='#1052A0' text='white'>
     <tr>
       <th colspan='4' style='padding: 14px; background-color: #1052A0; color: white;'>Detalle de Comisión</th>
     </tr>
  </thead>
  <tbody bgcolor='white'>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Empleado:</td>
       <td colspan='3' style='padding: 12px;'> ${formatearNumeroEmpleado(comision?.numeroEmpleado)} - ${formatearCapitalCase(comision?.nombreEmpleado)} </td>
     </tr>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Puesto:</td>
       <td colspan='3' style='padding: 12px;'> ${formatearCapitalCase(comision.puesto?.nombrePuesto)} </td>
     </tr>
     <tr>
       <td style='padding: 12px;' bgcolor='#e8eef6'>Periodo:</td>
       <td style='padding: 12px;'> '01/Abril/2023 a 15/Abril/2023 </td>
       <td style='padding: 12px;' bgcolor='#e8eef6'>Monto:</td>
       <td style='padding: 12px;'> ${formatearMonto(comision.montoComision)} </td>
     </tr>
     <tr>
       <td style='padding: 12px;' bgcolor='#e8eef6'>Centro de trabajo:</td>
       <td style='padding: 12px;'> MBVE</td>
       <td style='padding: 12px;' bgcolor='#e8eef6'> Departamento:</td>
       <td style='padding: 12px;'> Refacciones </td>
     </tr>
     <thead bgcolor='#1052A0' text='white'>
     <tr>
       <th colspan='4' style='padding: 14px; background-color: #1052A0; color: white;'>Autorizaciones</th>
     </tr>
  </thead>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Primera:</td>
       <td colspan='3' style='padding: 12px;'>  ${descripcionEstadoAutorizacion(comision.primeraAutorizacionEstado)} ${primerResponsable} </td>
     </tr>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Segunda:</td>
       <td colspan='3' style='padding: 12px;'>  ${descripcionEstadoAutorizacion(comision.segundaAutorizacionEstado)} ${segundoResponsable} </td>
     </tr>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Tercera:</td>
       <td colspan='3' style='padding: 12px;'>  ${descripcionEstadoAutorizacion(comision.terceraAutorizacionEstado)}  ${tercerResponsable} </td>
     </tr>
  </tbody>
  </table>
  <h3> Para continuar con el proceso, acceder al portal de Comisiones en el siguiente enlace; <a href="https://www.gruver.com.mx/comisiones/#/principal/comisiones"> Portal de Comisiones </a> </h3>
  `
}

export const mensajeBonos = (bono, primerResponsable, segundoResponsable, tercerResponsable) => {
  return `
  <h3>Se requiere su autorización del bono con los siguientes detalles. </h3>
  <table border='1' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
  <thead bgcolor='#1052A0' text='white'>
     <tr>
       <th colspan='4' style='padding: 14px; background-color: #1052A0; color: white;'>Detalle de Bono</th>
     </tr>
  </thead>
  <tbody bgcolor='white'>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Empleado:</td>
       <td colspan='3' style='padding: 12px;'> ${formatearNumeroEmpleado(bono?.numeroEmpleado)} - ${formatearCapitalCase(bono?.nombreEmpleado)} </td>
     </tr>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Puesto:</td>
       <td colspan='3' style='padding: 12px;'> ${formatearCapitalCase(bono.puesto?.nombrePuesto)} </td>
     </tr>
     <tr>
       <td style='padding: 12px;' bgcolor='#e8eef6'>Periodo:</td>
       <td style='padding: 12px;'> '01/Abril/2023 a 15/Abril/2023 </td>
       <td style='padding: 12px;' bgcolor='#e8eef6'>Monto:</td>
       <td style='padding: 12px;'> ${formatearMonto(bono.montoBono)} </td>
     </tr>
     <tr>
       <td style='padding: 12px;' bgcolor='#e8eef6'>Centro de trabajo:</td>
       <td style='padding: 12px;'> MBVE </td>
       <td style='padding: 12px;' bgcolor='#e8eef6'> Departamento:</td>
       <td style='padding: 12px;'> Refacciones </td>
     </tr>
     <thead bgcolor='#1052A0' text='white'>
     <tr>
       <th colspan='4' style='padding: 14px; background-color: #1052A0; color: white;'>Autorizaciones</th>
     </tr>
  </thead>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Primera:</td>
       <td colspan='3' style='padding: 12px;'>  ${descripcionEstadoAutorizacion(bono.primeraAutorizacionEstado)} ${primerResponsable} </td>
     </tr>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Segunda:</td>
       <td colspan='3' style='padding: 12px;'>  ${descripcionEstadoAutorizacion(bono.segundaAutorizacionEstado)} ${segundoResponsable} </td>
     </tr>
     <tr>
       <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Tercera:</td>
       <td colspan='3' style='padding: 12px;'>  ${descripcionEstadoAutorizacion(bono.terceraAutorizacionEstado)}  ${tercerResponsable} </td>
     </tr>
  </tbody>
  </table>
  <h3> Para continuar con el proceso, acceder al portal de Comisiones en el siguiente enlace; <a href="https://www.gruver.com.mx/comisiones/#/principal/comisiones"> Portal de Comisiones </a> </h3>
  `
}

const descripcionEstadoAutorizacion = (estado) => {
  let descripcion = 'Autorización Pendiente por  '
  switch (estado) {
    case 1:
      descripcion = 'Autorizada por  '
      break
    case 2:
      descripcion = 'No Autorizada por  '
      break
    case 3:
      descripcion = 'Autorización Pendiente por  '
      break
    default:
      descripcion = 'Autorización Pendiente por  '
  }
  return descripcion
}
