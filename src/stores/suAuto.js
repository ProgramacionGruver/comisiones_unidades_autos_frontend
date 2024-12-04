import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notificacion } from "src/helpers/mensajes";
import { ref } from "vue";

export const useSuAutoStore = defineStore("suAuto", () => {
  const contratos = ref([]);

  const obtenerContratosSuAuto = async (busquedaObj) => {
    try {
      const { data } = await api.post("/suauto/obtener", busquedaObj);

      contratos.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const registrarContratosSuAutoByExcel = async (excel, busquedaObj) => {
    try {
      const formData = new FormData();
      formData.append("mes", busquedaObj.mes);
      formData.append("anio", busquedaObj.anio);
      formData.append("excel", excel);

      const { data } = await api.post("/suauto/registrar", formData);

      contratos.value = [...contratos.value, ...data];
      notificacion("positive", "Contratos registrados correctamente");
    } catch (error) {
      console.log(error);
      notificacion("negative", "Error al registrar contratos");
    }
  };

  const descargarFormatoExcel = async () => {
    try {
      const { data } = await api.get("/suauto/descargar/formato", {
        responseType: "blob",
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    // States
    contratos,
    // Methods
    obtenerContratosSuAuto,
    registrarContratosSuAutoByExcel,
    descargarFormatoExcel,
  };
});
