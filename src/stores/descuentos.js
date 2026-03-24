import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { notificacion } from "src/helpers/mensajes";

export const useDescuentosStore = defineStore("descuentos", () => {
  const descuentos = ref([]);
  const detalleDescuento = ref([]);
  const formularioDescuento = ref([]);
  const descuentoCreado = ref(null);

  const planPisoRegistrados = ref([]);

  const formulario = ref([])

  const obtenerTodosDescuentosVendedores = async () => {
    try {
      const { data } = await api.get("/descuentos/vendedores");

      descuentos.value = [...data];
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerDescuentosVendedores = async (
    mes,
    anio,
  ) => {
    try {
      const { data } = await api.post("/unidades/asesores/descuentos", {
        mes,
        anio,
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
      const { data } = await api.post("/unidades/asesores/descuentos/guardar", descuento);

      const index = descuentos.value.findIndex(
        (d) => d.numeroEmpleado === data.numeroEmpleado
      );

      if (index !== -1) {
        descuentos.value[index] = data;
      } else {
        descuentos.value = [...descuentos.value, data];
      }

      notificacion("positive", "Descuento guardado correctamente");
      return;
    } catch (error) {
      console.log(error);
      notificacion("negative", error.response.data.message);
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

  const obtenerFormularioDescuento = async (claveDepartamento) => {
    try {
      const { data } = await api.get(
        `/descuentos/vendedores/formularios/${claveDepartamento}`
      );

      formularioDescuento.value = [...data];
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const obtenerPlanPisoRegistrados = async (objBusqueda) => {
    try {
      const { data } = await api.post("/plan/piso", objBusqueda);

      planPisoRegistrados.value = [...data];
    } catch (error) {
      console.log(error);
    }
  };

  const guardarPlanPiso = async (planPiso) => {
    try {
      const { data } = await api.post("/plan/piso/guardar", planPiso);

      planPisoRegistrados.value = [...planPisoRegistrados.value, data];
      notificacion("positive", "Plan Piso guardado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerFormularioByDepartamento = async (claveDepartamento) => {
    try {
      const { data } = await api.get(`/unidades/asesores/formulario/${claveDepartamento}`);

      formulario.value = [...data];
    } catch (error) {
      console.log(error);
    }
  }

  return {
    // States / Vars
    descuentos,
    detalleDescuento,
    formularioDescuento,
    descuentoCreado,
    planPisoRegistrados,
    formulario,
    // Methods
    obtenerTodosDescuentosVendedores,
    obtenerDescuentosVendedores,
    obtenerDetalleDescuentoVendedor,
    guardarNuevoDescuentoVendedor,
    actualizarDescuentoVendedor,
    obtenerFormularioDescuento,
    obtenerPlanPisoRegistrados,
    guardarPlanPiso,
    obtenerFormularioByDepartamento
  };
});
