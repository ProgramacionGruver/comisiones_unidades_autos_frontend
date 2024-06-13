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

      for (const comision of comisionesUnidades.value) {
        if (comision.modelo.includes("AVEO")) {
          comision.descuentosUnidades[0] = {
            previa: 1242,
          };
        } else if (
          comision.modelo.includes("S10") ||
          comision.modelo.includes("CAPTIVA") ||
          comision.modelo.includes("GROOVE") ||
          comision.modelo.includes("TORNADO")
        ) {
          comision.descuentosUnidades[0] = {
            previa: 1142,
          };
        } else {
          comision.descuentosUnidades[0] = {
            previa: 693,
          };
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      cargando.value = false;
    }
  };

  const guardarDescuentos = async (objDescuentos) => {
    try {
      const { data } = await api.post("/descuentos/autos", objDescuentos);
      notificacion("positive", "Descuentos Agregados", data);
    } catch (error) {
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
