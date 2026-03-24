import { defineStore, storeToRefs } from "pinia";
import { api } from "src/boot/axios";
import { notificacion } from "src/helpers/mensajes";
import { ref } from "vue";

export const useComisionesStore = defineStore("comisiones", () => {
  const comisionesUnidades = ref([]);
  const comisionesFiltradas = ref([]);
  const cargando = ref(false);

  const obtenerComisionesUnidades = async (objComisiones) => {
    try {
      cargando.value = true;
      const { data } = await api.post("/facturas/unidades/sistema", objComisiones);
      comisionesUnidades.value = [...data];
    } catch (error) {
      console.log(error);
    } finally {
      cargando.value = false;
    }
  };

  const guardarDescuentos = async (guardarObj) => {
    try {
      const { data } = await api.post("/facturas/unidades/descuentos", guardarObj);

      const index = comisionesUnidades.value.findIndex(
        (comision) => comision.idFactura === guardarObj.idFactura
      );

      if (index !== -1) {
        comisionesUnidades.value[index] = data;
      }

      notificacion("positive", "Descuento guardado correctamente");
    } catch (error) {
      console.log(error.response.data.message);
      notificacion("negative", error.response.data.message);
    }
  };

  return {
    comisionesUnidades,
    comisionesFiltradas,
    cargando,
    obtenerComisionesUnidades,
    guardarDescuentos,
  };
});
