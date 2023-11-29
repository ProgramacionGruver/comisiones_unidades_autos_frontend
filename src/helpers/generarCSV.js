import { exportFile } from 'quasar'
import { storeToRefs } from 'pinia'
import { useReportesStore } from 'src/stores/catalogos/reportes'
import { useSucursalesStore } from 'src/stores/catalogos/sucursales'

const useReportes = useReportesStore()
const {anioSeleccionado, mesSeleccionado, quincenaSeleccionada} = storeToRefs(useReportes)

const useSucursales = useSucursalesStore()
const { sucursalSeleccionada } = storeToRefs(useSucursales)


export const wrapCsvValue = (val, formatFn, row) => {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

export const convertirTablaCSVExcel = (...conjuntos) => {
  try {
    let content = '';

    conjuntos.forEach((conjunto, index) => {
      content += [conjunto.columna.map(col => wrapCsvValue(col.label))].concat(
        conjunto.row.value.map(row => conjunto.columna.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )).join(','))
      ).join('\r\n')

      if (index < conjuntos.length - 1) {
        content += '\r\n,\r\n'; // Agregar una fila vacía entre cada conjunto
      }
    })

    //Retornar nombre y extension
    return exportFile(
      `${sucursalSeleccionada.value.abreviacion}_${quincenaSeleccionada.value}_${mesSeleccionado.value}_${anioSeleccionado.value}.csv`,
      content,
      'text/csv'
    )

  } catch (error) {
    return false;
  }
}



