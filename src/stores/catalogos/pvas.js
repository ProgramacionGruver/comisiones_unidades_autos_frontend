import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { notificacion } from "src/helpers/mensajes";
import { api } from "src/boot/axios";

export const usePvaStore = defineStore("pva", () => {
  const pvas = ref([]);

  const obtenerPvas = async (objPva) => {
    try {
      const { data } = await api.post("/pvas/autos", objPva);
      pvas.value = [...data];
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  const guardarPva = async (objPva) => {
    try {
      const { data } = await api.post("/pva/autos", objPva);
      pvas.value = [...pvas.value, data];
      notificacion("positive", "Pva Agregado", data);
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  const guardarGarantias = async (excel, busquedaObj) => {
    try {
      const formData = new FormData();
      formData.append("mes", busquedaObj.mes);
      formData.append("anio", busquedaObj.anio);
      formData.append("usuario", busquedaObj.usuario);
      formData.append("excel", excel);

      const { data } = await api.post("/pvas/garantias/autos", formData);

      pvas.value = [...pvas.value, ...data];
      notificacion("positive", "Contratos registrados correctamente");
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  return {
    pvas,
    obtenerPvas,
    guardarPva,
    guardarGarantias,
  };
});
