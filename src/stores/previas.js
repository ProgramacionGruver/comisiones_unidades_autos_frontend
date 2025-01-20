import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notificacion } from "src/helpers/mensajes";
import { ref } from "vue";

export const usePreviasStore = defineStore("previas", () => {
  const previas = ref([]);

  const obtenerCatalogoPrevias = async () => {
    try {
      const { data } = await api.get("/previas/catalogo");

      previas.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const registrarNuevaPrevia = async (previa) => {
    try {
      const { data } = await api.post("/previas/catalogo", previa);

      previas.value = [data, ...previas.value];

      notificacion("positive", "Previa registrada correctamente");
    } catch (error) {
      console.log(error);
      notificacion("negative", "Error al registrar la previa");
    }
  };

  const actualizarPrevia = async (previa) => {
    try {
      const index = previas.value.findIndex(
        (p) => p.idPrevia === previa.idPrevia
      );

      const { data } = await api.put(
        `/previas/catalogo/${previa.idPrevia}`,
        previa
      );

      previas.value[index] = data;

      notificacion("positive", "Previa actualizada correctamente");
    } catch (error) {
      console.log(error);
      notificacion("negative", "Error al actualizar la previa");
    }
  };

  return {
    // States
    previas,
    // Methods
    obtenerCatalogoPrevias,
    registrarNuevaPrevia,
    actualizarPrevia,
  };
});
