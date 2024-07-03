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
      const { data } = await api.post("/unidades/autos", objComisiones);
      comisionesUnidades.value = [...data];
    } catch (error) {
      console.log(error);
    } finally {
      cargando.value = false;
    }
  };

  const guardarDescuentos = async (objDescuentos, departamento) => {
    try {
      if (departamento === "nuevas") {
        const { data } = await api.post("/descuentos/autos", objDescuentos);
        notificacion("positive", "Descuentos Agregados", data);
      } else if (departamento === "seminuevos") {
        const { data } = await api.post(
          "/descuentos/seminuevos/autos",
          objDescuentos
        );
        notificacion("positive", "Descuentos Agregados");
      }
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
