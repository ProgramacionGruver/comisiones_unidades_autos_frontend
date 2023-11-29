import { formatearFechaCorreo } from 'src/helpers/formatearFecha'

export const mensajeCorreo = (entrevista, reporte) => {
  return `<table border='1' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
  <thead bgcolor='#1052A0' text='white'>
    <tr>
      <th colspan='2' style='padding: 16px; background-color: #1052A0; color: white;'>ENTREVISTA DE SALIDA</th>
    </tr>
  </thead>
  <tbody bgcolor='white' text='black'>
    <tr>
      <td style='padding: 12px;'>Fecha de elaboracion:</td>
      <td style='padding: 12px;'>${formatearFechaCorreo(entrevista.createdAt)}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Centro de trabajo:</td>
      <td style='padding: 12px;'>${entrevista.centroTrabajo}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Nombre:</td>
      <td style='padding: 12px;'>${entrevista.nombre}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Documento de entrevista:</td>
      <td style='padding: 12px;'><a href='${reporte.url}' style='color: #58ACFA; text-decoration: none;'>${reporte.url}</a></td>
    </tr>
  </tbody>
</table>
`
}

export const mensajeCorreoComisiones = (comision, liga) => {
  return `<div style="font-family:'Segoe UI',SUWR,Verdana,sans-serif; font-size:15px; line-height:20px; color:#000000; padding:12px 0; letter-spacing:-0.01em">
  Nota: A partir de ahora tienes la posibilidad de llevar a cabo las autorizaciones desde la comodidad de tu dispositivo móvil. Aprovecha y comienza a disfruta las ventajas que te brinda esta opción móvil.<br> <strong style="padding-left: 5px;">-Departamento de TI.</strong></div><br>
<table border='1' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
  <thead bgcolor='#a6b2bf' text='white'>
    <tr>
      <th colspan='2' style='padding: 16px; background-color: #a6b2bf; color: white;'>Comisiones Unidades</th>
    </tr>
  </thead>
  <tbody bgcolor='white' text='black'>
    <tr>
    <tr>
      <td style='padding: 12px;'>Folio:</td>
      <td style='padding: 12px;'>${comision.folio}</td>
    </tr>
      <td style='padding: 12px;'>Fecha de elaboracion:</td>
      <td style='padding: 12px;'>${formatearFechaCorreo(comision.createdAt)}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Centro de trabajo:</td>
      <td style='padding: 12px;'>${comision.claveSucursal}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Departamento:</td>
      <td style='padding: 12px;'>${comision.nombreDepartamento}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Periodo:</td>
      <td style='padding: 12px;'>${comision.quincena} de ${comision.mes} del ${comision.año}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Link de comisiones:</td>
      <td style='padding: 12px;'><a href='${liga.url}' style='color: #58ACFA; text-decoration: none;'>Click aqui para ir</a></td>
    </tr>
  </tbody>
</table>`
}

export const mensajeCorreoComisionesMecanicos = (comision, liga) => {
  return `<div style="font-family:'Segoe UI',SUWR,Verdana,sans-serif; font-size:15px; line-height:20px; color:#000000; padding:12px 0; letter-spacing:-0.01em">
  Nota: A partir de ahora tienes la posibilidad de llevar a cabo las autorizaciones desde la comodidad de tu dispositivo móvil. Aprovecha y comienza a disfruta las ventajas que te brinda esta opción móvil.<br> <strong style="padding-left: 5px;">-Departamento de TI.</strong></div><br>
<table border='1' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
  <thead bgcolor='#a6b2bf' text='white'>
    <tr>
      <th colspan='2' style='padding: 16px; background-color: #a6b2bf; color: white;'>Comisiones Mecánicos</th>
    </tr>
  </thead>
  <tbody bgcolor='white' text='black'>
    <tr>
    <tr>
      <td style='padding: 12px;'>Folio:</td>
      <td style='padding: 12px;'>${comision.folio}</td>
    </tr>
      <td style='padding: 12px;'>Fecha de elaboracion:</td>
      <td style='padding: 12px;'>${formatearFechaCorreo(comision.createdAt)}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Centro de trabajo:</td>
      <td style='padding: 12px;'>${comision.claveSucursal}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Periodo:</td>
      <td style='padding: 12px;'>${comision.quincena} de ${comision.mes} del ${comision.año}</td>
    </tr>
    <tr>
      <td style='padding: 12px;'>Link de comisiones:</td>
      <td style='padding: 12px;'><a href='${liga.url}' style='color: #58ACFA; text-decoration: none;'>Click aqui para ir</a></td>
    </tr>
  </tbody>
</table>`
}
