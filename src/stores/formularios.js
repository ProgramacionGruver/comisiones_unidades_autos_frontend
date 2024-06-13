import { defineStore, storeToRefs } from "pinia";
import { apiForm } from "src/boot/axiosForm";
import { ref } from "vue";
import { useKpiStore } from "./catalogos/kpis";

export const useFormulariosStore = defineStore("formularios", () => {
  const useKpis = useKpiStore();
  const { comisionVendedor } = storeToRefs(useKpis);

  const urlComision = ref("");

  const obtenerUrlComision = async (dataEncriptar, tipoAutorizacion) => {
    try {
      const { data } = await apiForm.post(
        `/comisiones/autos/${tipoAutorizacion}`,
        dataEncriptar
      );

      urlComision.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const desencriptarData = async (token) => {
    try {
      const { data } = await apiForm.post("/encrypt", { token });

      comisionVendedor.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    // States
    urlComision,
    comisionVendedor,
    // Methods
    obtenerUrlComision,
    desencriptarData,
  };
});
