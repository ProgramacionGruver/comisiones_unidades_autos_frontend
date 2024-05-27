import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const useDescuentosStore = defineStore("descuentos", () => {
  const descuentos = ref([]);
  const detalleDescuento = ref([]);
  const formularioDescuento = ref([]);
  const descuentoCreado = ref(null);

  const obtenerTodosDescuentosVendedores = async () => {
    try {
      const { data } = await api.get("/descuentos/vendedores");

      descuentos.value = [...data];
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerDescuentosVendedoresByFechas = async (fechaInicio, fechaFin) => {
    try {
      const { data } = await api.post("/descuentos/vendedores/fecha", {
        fechaInicio,
        fechaFin,
      });

      descuentos.value = [...data];
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerDetalleDescuentoVendedor = async (idDescuentoVendedor) => {
    try {
      const { data } = await api.post("/descuentos/vendedores/detalle", {
        idDescuentoVendedor,
      });

      detalleDescuento.value = [...data];
    } catch (error) {
      console.log(error);
    }
  };

  const guardarNuevoDescuentoVendedor = async (descuento) => {
    try {
      const { data } = await api.post("/descuentos/vendedores", descuento);

      descuentoCreado.value = data;
      descuentos.value = [...descuentos.value, data];

      return;
    } catch (error) {
      console.log(error);
    }
  };

  const actualizarDescuentoVendedor = async (descuento) => {
    try {
      const { data } = await api.put("/descuentos/vendedores", descuento);

      notificacion("positive", data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerFormularioDescuento = async () => {
    try {
      const { data } = await api.get("/descuentos/vendedores/formularios");

      formularioDescuento.value = [...data];
    } catch (error) {
      console.log(error);
    }
  };

  return {
    // States / Vars
    descuentos,
    detalleDescuento,
    formularioDescuento,
    descuentoCreado,
    // Methods
    obtenerTodosDescuentosVendedores,
    obtenerDescuentosVendedoresByFechas,
    obtenerDetalleDescuentoVendedor,
    guardarNuevoDescuentoVendedor,
    actualizarDescuentoVendedor,
    obtenerFormularioDescuento,
  };
});
