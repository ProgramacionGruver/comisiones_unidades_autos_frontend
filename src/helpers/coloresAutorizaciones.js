const catalogoAutorizaciones = {
  1: { color: "gray", icon: "radio_button_unchecked", texto: "PENDIENTE" },
  2: { color: "green", icon: "check_circle", texto: "AUTORIZADA" },
  3: { color: "red", icon: "cancel", texto: "RECHAZADA" },
};

export const definirAutorizacion = (valor) =>
  catalogoAutorizaciones[valor] || { color: "", icon: "", texto: "" };
