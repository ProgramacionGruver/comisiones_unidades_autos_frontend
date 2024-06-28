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

      if (objComisiones.condicion === "NUEVAS") {
        for (const comision of comisionesUnidades.value) {
          if (
            comision.modelo.includes("AVEO") &&
            comision.estadoFactura === "FACTURADA"
          ) {
            comision.descuentosUnidades[0] = {
              previa:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].previa
                  : 1242,
              traslado:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].traslado
                  : 0,
              descVentas:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].descVentas
                  : 0,
              cortesia:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].cortesia
                  : 0,
              gasolina:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].gasolina
                  : 0,
              bonoub:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].bonoub
                  : 0,
            };
          } else if (
            (comision.modelo.includes("S10") ||
              comision.modelo.includes("CAPTIVA") ||
              comision.modelo.includes("GROOVE") ||
              comision.modelo.includes("TORNADO")) &&
            comision.estadoFactura === "FACTURADA"
          ) {
            comision.descuentosUnidades[0] = {
              previa:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].previa
                  : 1142,
              traslado:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].traslado
                  : 0,
              descVentas:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].descVentas
                  : 0,
              cortesia:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].cortesia
                  : 0,
              gasolina:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].gasolina
                  : 0,
              bonoub:
                comision.descuentosUnidades.length > 0
                  ? comision.descuentosUnidades[0].bonoub
                  : 0,
            };
          } else {
            if (comision.estadoFactura === "FACTURADA") {
              comision.descuentosUnidades[0] = {
                previa:
                  comision.descuentosUnidades.length > 0
                    ? comision.descuentosUnidades[0].previa
                    : 693,
                traslado:
                  comision.descuentosUnidades.length > 0
                    ? comision.descuentosUnidades[0].traslado
                    : 0,
                descVentas:
                  comision.descuentosUnidades.length > 0
                    ? comision.descuentosUnidades[0].descVentas
                    : 0,
                cortesia:
                  comision.descuentosUnidades.length > 0
                    ? comision.descuentosUnidades[0].cortesia
                    : 0,
                gasolina:
                  comision.descuentosUnidades.length > 0
                    ? comision.descuentosUnidades[0].gasolina
                    : 0,
                bonoub:
                  comision.descuentosUnidades.length > 0
                    ? comision.descuentosUnidades[0].bonoub
                    : 0,
              };
            }
          }
        }
      }
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
