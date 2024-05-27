import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { notificacion } from "src/helpers/mensajes";

export const useAseguradorasStore = defineStore("aseguradoras", () => {
  const aseguradoras = ref([]);

  const obtenerCatalogoAseguradoras = async () => {
    try {
      const { data } = await api.get("/catalogo/aseguradoras");
      aseguradoras.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const altaAseguradora = async (aseguradora) => {
    try {
      const { data } = await api.post("/catalogo/aseguradoras", aseguradora);
      aseguradoras.value.push(data);
      notificacion("positive", "Aseguradora registrada correctamente");
    } catch (error) {
      notificacion("negative", "Error al registrar aseguradora");
    }
  };

  const editarAseguradora = async (aseguradora) => {
    try {
      const { data } = await api.put(
        `/catalogo/aseguradoras/${aseguradora.id_catalogo_aseguradoras}`,
        aseguradora
      );
      const index = aseguradoras.value.findIndex(
        (item) =>
          item.id_catalogo_aseguradoras === data.id_catalogo_aseguradoras
      );

      aseguradoras.value[index] = data;
      notificacion("positive", "Aseguradora actualizada correctamente");
    } catch (error) {
      notificacion("negative", "Error al actualizar aseguradora");
    }
  };

  const cambiarEstatusAseguradora = async (aseguradora) => {
    try {
      const { data } = await api.delete(
        `/catalogo/aseguradoras/${aseguradora.id_catalogo_aseguradoras}`
      );
      const index = aseguradoras.value.findIndex(
        (item) =>
          item.id_catalogo_aseguradoras === data.id_catalogo_aseguradoras
      );

      aseguradoras.value[index] = data;
      notificacion(
        "positive",
        "Estatus de aseguradora actualizado correctamente"
      );
    } catch (error) {
      notificacion("negative", "Error al cambiar estatus de aseguradora");
    }
  };

  return {
    // States
    aseguradoras,
    // Methods
    obtenerCatalogoAseguradoras,
    altaAseguradora,
    editarAseguradora,
    cambiarEstatusAseguradora,
  };
});
