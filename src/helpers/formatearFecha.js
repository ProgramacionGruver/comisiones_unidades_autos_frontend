import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("es");
dayjs.extend(localizedFormat);

export const formatearFecha = (stringFecha) => {
  if (!stringFecha || stringFecha.trim() === "") {
    return "-";
  }
  const fechaSinHora = stringFecha.split("T")[0];
  return dayjs(fechaSinHora).format("DD/MMMM/YYYY");
};

export const formatDate = (stringFecha) =>
  dayjs(stringFecha).locale("es").format("DD/MM/YYYY HH:mm:ss");

export const formatoFecha = (quincena, mes, anio) => {
  if (quincena === 1) {
    const fecha = `${anio}-${mes}-01`;
    return fecha;
  } else {
    const fecha = `${anio}-${mes}-16`;
    return fecha;
  }
};

export const formatearFechaCorreo = (stringFecha) =>
  dayjs(stringFecha).locale("es").format("DD [de] MMMM [del] YYYY");

export const obtenerDia = (numeroQuincena) => {
  const quincenas = {
    "Primera Quincena": "01",
    "Segunda Quincena": "16",
  };

  return quincenas[numeroQuincena] || "Quincena inválida";
};

export const formatearFechaGuiones = (stringFecha) => {
  if (!stringFecha || stringFecha.trim() === "") {
    return "-";
  }
  const fechaSinHora = stringFecha.split("T")[0];
  return dayjs(fechaSinHora).format("YYYY-MM-DD");
};
