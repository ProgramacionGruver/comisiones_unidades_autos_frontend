import { format } from "date-fns";
import esLocale from "date-fns/locale/es";

export const formatearFechaTextoES = (fecha) => {
  return format(fecha, "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: esLocale,
  });
};

export const formatearFechaES = (fecha) => {
  return format(fecha, "d'/'MMM'/'yyyy", {
    locale: esLocale,
  });
};

export const formatearMonto = (monto) => {
  return monto?.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  });
};

export const formatearGratificaciones = (row) => {
  if (
    row.tipoGratificacion === "vacaciones" ||
    row.tipoGratificacion === "capacitacion"
  ) {
    return row.monto + " días";
  } else {
    return row.monto?.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    });
  }
};

export const formatearNumeroEmpleado = (numero) => {
  return numero.toString().padStart(6, "0");
};

export const formatearPorcentaje = (numero) => {
  return numero.toLocaleString(undefined, { style: "percent" });
};

export const formatearPorcentajeDecimal = (numero, decimales = 3) => {
  const porcentaje = (numero * 100).toFixed(decimales);
  return `${porcentaje}%`;
};

export const formatearCapitalCase = (texto) => {
  const palabras = texto.split(" ");
  for (let i = 0; i < palabras.length; i++) {
    palabras[i] = palabras[i].toLowerCase();
    palabras[i] = palabras[i].charAt(0).toUpperCase() + palabras[i].slice(1);
  }
  return palabras.join(" ");
};

export const formatoEstado = (estado, tipo) => {
  let formato = "";
  const listaEstados = {
    1: { color: "positive", icon: "check_circle" },
    2: { color: "negative", icon: "cancel" },
    3: { color: "orange-6", icon: "update" },
    4: { color: "primary", icon: "paid" },
  };
  switch (estado) {
    case 1:
      tipo === "color"
        ? (formato = listaEstados[1].color)
        : (formato = listaEstados[1].icon);
      break;
    case 2:
      tipo === "color"
        ? (formato = listaEstados[2].color)
        : (formato = listaEstados[2].icon);
      break;
    case 3:
      tipo === "color"
        ? (formato = listaEstados[3].color)
        : (formato = listaEstados[3].icon);
      break;
    case 4:
      tipo === "color"
        ? (formato = listaEstados[4].color)
        : (formato = listaEstados[4].icon);
      break;
    default:
      tipo === "color" ? (formato = "gray") : (formato = "cancel");
      break;
  }
  return formato;
};

export const formatoEstadoCheck = (estado, tipo) => {
  let formato = "";
  const listaEstados = {
    1: { color: "green", icon: "check_circle", label: "Autorizado" },
    2: { color: "red", icon: "cancel", label: "No autorizado" },
  };
  if (tipo === "color" || tipo === "icon") {
    switch (estado) {
      case 1:
        tipo === "color"
          ? (formato = listaEstados[1].color)
          : (formato = listaEstados[1].icon);
        break;
      case 2:
        tipo === "color"
          ? (formato = listaEstados[2].color)
          : (formato = listaEstados[2].icon);
        break;
      default:
        tipo === "color"
          ? (formato = "primary")
          : (formato = "radio_button_unchecked");
        break;
    }
  } else {
    switch (estado) {
      case 1:
        formato = listaEstados[1].label;
        break;
      case 2:
        formato = listaEstados[2].label;
        break;
      default:
        formato = "Pendiente";
        break;
    }
  }

  return formato;
};

export const obtenerTextoEstado = (estado) => {
  let formato = "";
  const listaEstados = {
    1: { label: "Autorizado" },
    2: { label: "No autorizado" },
    3: { label: "Pendiente" },
  };

  switch (estado) {
    case 1:
      formato = listaEstados[1].label;
      break;
    case 2:
      formato = listaEstados[2].label;
      break;
    case 3:
      formato = listaEstados[3].label;
      break;
    default:
      formato = "Pendiente";
      break;
  }

  return formato;
};

export const formatearNombrePuesto = (nombre) => {
  const palabrasAEliminar = ["de", "y", "en", "el", "la"];
  let nombreFormateado = nombre.toLowerCase().trim();
  palabrasAEliminar.forEach((palabra) => {
    nombreFormateado = nombreFormateado.replace(
      new RegExp("\\b" + palabra + "\\b", "g"),
      ""
    );
  });
  nombreFormateado = nombreFormateado.replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  nombreFormateado = nombreFormateado.replace(/\s/g, "");
  return nombreFormateado;
};
