import { defineStore } from "pinia";
import { ref } from "vue";

import { apiUsuarios } from "src/boot/axiosUsuarios";
import { notificacion } from "src/helpers/mensajes";

export const useModulosStore = defineStore("modulos", () => {
  const listaModulos = ref([]);
  const usuariosModulos = ref([]);
  const usuariosAcceso = ref([]);
  const filtroUsuariosAcceso = ref([]);

  const obtenerUsuariosModulo = async (id) => {
    try {
      const { data } = await apiUsuarios.post("/modulos", { id });
      usuariosModulos.value = data.usuariosPorModulo;
      usuariosAcceso.value = data.usuariosPortal;
      filtroUsuariosAcceso.value = data.usuariosPortal;
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  const actualizarPermisosModulos = async (permisosObj) => {
    try {
      const { data } = await apiUsuarios.put("/modulos", permisosObj);
      usuariosModulos.value = data;
      notificacion("positive", "Permisos actualizados correctamente");
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  return {
    // state
    usuariosModulos,
    usuariosAcceso,
    filtroUsuariosAcceso,
    listaModulos,

    // methods
    obtenerUsuariosModulo,
    actualizarPermisosModulos,
  };
});
