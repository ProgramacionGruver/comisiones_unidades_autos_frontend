import { exportFile } from "quasar";

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export function exportTable(columns, filas, nombre, empresa, mes, anio) {
  // naive encoding to csv format
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      filas.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");

  const status = exportFile(
    nombre + "_" + empresa + "_" + mes + "_" + anio + ".CSV",
    content,
    "text/csv"
  );

  if (status !== true) {
    $q.notify({
      message: "No se descargó el archivo correctamente...",
      color: "negative",
      icon: "warning",
    });
  }
}

export function exportCSV(columns, filas, nombre) {
  // naive encoding to csv format
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      filas.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");
  const status = exportFile(nombre + ".CSV", content, "text/csv");

  if (status !== true) {
    $q.notify({
      message: "No se descargó el archivo correctamente...",
      color: "negative",
      icon: "warning",
    });
  }
}
