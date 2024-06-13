import { defineStore } from "pinia";
import { apiUsuarios } from "src/boot/axiosUsuarios";
import { ref } from "vue";
import { notificacion } from "src/helpers/mensajes";

export const useAutenticacionStore = defineStore("autenticaciones", () => {
  const usuarioAutenticado = ref(null);
  const isLogin = ref(false);
  const perfilUsuario = ref(null);

  const iniciarSesion = async (usuario) => {
    try {
      const { data } = await apiUsuarios.post("/usuarios/login", usuario);
      isLogin.value = true;
      localStorage.setItem("token", data);
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  // reseteamos el store de la autenticacion
  const cerrarSesion = async () => {
    try {
      usuarioAutenticado.value = null;
      localStorage.removeItem("token");
      isLogin.value = false;
    } catch (error) {
      // console.log(error)
    }
  };

  const autenticarUsuario = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // console.log('No hay token')
      return;
    }

    const configuracion = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await apiUsuarios.get("/usuarios/perfil", configuracion);
      isLogin.value = true;
      usuarioAutenticado.value = { ...data };
    } catch (error) {
      isLogin.value = false;
      notificacion("negative", error.response.data.message);
    }
  };

  const obtenerPerfilUsuario = async (idUsuario, idPortal) => {
    try {
      const { data } = await apiUsuarios.get(
        `/perfil/comisiones/${idUsuario}/${idPortal}`
      );
      perfilUsuario.value = data;
    } catch (error) {
      console.log(error);
      perfilUsuario.value = null;
    }
  };

  return {
    iniciarSesion,
    cerrarSesion,
    autenticarUsuario,
    usuarioAutenticado,
    isLogin,
    obtenerPerfilUsuario,
    perfilUsuario,
  };
});
