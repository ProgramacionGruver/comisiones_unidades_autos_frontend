import { defineStore, storeToRefs } from "pinia";
import { api } from "src/boot/axios";
import { apiReport } from "src/boot/axiosReport";
import { notificacion } from "src/helpers/mensajes";
import { ref } from "vue";
import { useKpiStore } from "./catalogos/kpis";

export const useAutorizacionesStore = defineStore("autorizaciones", () => {
  const autorizadores = ref([]);
  const autorizaciones = ref([]);
  const urlPDF = ref("");
  const infoJefe = ref({});

  const useKpis = useKpiStore();
  const { comisionVendedor } = storeToRefs(useKpis);

  const esAutorizador = ref(false);
  const autorizacionSeleccionada = ref(null);

  const enviarCorreo = async (data) => {
    try {
      await api.post("/autorizaciones/enviar/correo/vendedor", data);

      notificacion("positive", "Correo enviado correctamente");
    } catch (error) {
      notificacion("negative", `Error al enviar correo: ${error.message}`);
    }
  };

  const obtenerAutorizadores = async () => {
    try {
      const { data } = await api.get("/autorizaciones/autorizadores");

      autorizadores.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerAutorizacionesByMes = async (mes, anio) => {
    try {
      const { data } = await api.post("/unidades/autorizaciones/todas/mes", {
        mes,
        anio,
      });

      autorizaciones.value = data.autorizaciones;
    } catch (error) {
      console.log(error);
    }
  };

  const registrarAutorizaciones = async (infoAutorizacion) => {
    try {
      const { data } = await api.post(
        "/autorizaciones/registrar",
        infoAutorizacion
      );

      return data.autorizacion;
    } catch (error) {
      console.log(error);
      notificacion(
        "negative",
        error.response.data.message || "Error al registrar la autorización"
      );
      return [];
    }
  };

  const aceptarAutorizacion = async (objAutorizacion) => {
    try {
      const { data } = await api.post(
        "/unidades/autorizaciones/aceptar",
        objAutorizacion
      );

      notificacion("positive", "Autorización aceptada correctamente");
    } catch (error) {
      console.log(error);
      notificacion(
        "negative",
        error.response.data.message || "Error al aceptar la autorización"
      );
    }
  };

  const enviarComisionJefe = async (objAutorizacion) => {
    try {
      await api.post("/autorizaciones/enviar/correo/jefe", objAutorizacion);

      notificacion(
        "positive",
        "Autorización enviada al jefe de ventas correctamente"
      );
    } catch (error) {
      notificacion(
        "negative",
        `Error al enviar la autorización al jefe de ventas: ${error.message}`
      );
    }
  };

  const rechazarComision = async (objAutorizacion) => {
    try {
      const { data } = await api.post(
        "/unidades/autorizaciones/rechazar",
        objAutorizacion
      );

      notificacion("positive", "Autorización rechazada correctamente");
    } catch (error) {
      console.log(error);
      notificacion(
        "negative",
        error.response.data.message || "Error al rechazar la autorización"
      );
    }
  };

  const enviarComisionRechazo = async (objAutorizacion) => {
    try {
      const { data } = await api.post(
        "/autorizaciones/enviar/correo/rechazo",
        objAutorizacion
      );

      // const index =
      //   comisionVendedor.value.autorizaciones.autorizaciones_comisiones_autos_detalles.findIndex(
      //     (item) => item.idAutorizacion === objAutorizacion.idAutorizacion
      //   );

      // comisionVendedor.value.autorizaciones.autorizaciones_comisiones_autos_detalles[
      //   index
      // ] = data;

      notificacion("positive", "Correo de rechazo enviado correctamente");
    } catch (error) {
      notificacion(
        "negative",
        `Error al enviar la autorización al vendedor: ${error.message}`
      );
    }
  };

  const obtenerInfoVendedorByID = async (idAsesor) => {
    try {
      const { data } = await api.get(`/autorizaciones/vendedor/${idAsesor}`);

      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const obtenerUrlPDF = async (objAutorizacion) => {
    try {
      const { data } = await apiReport.get(
        `/comisiones?nombre=reporteComisionAutos&anio=${objAutorizacion.anio}&mes=${objAutorizacion.mes}&idAsesor=${objAutorizacion.idAsesor}&numeroEmpleado=${objAutorizacion.numeroEmpleado}&nivel=${objAutorizacion.nivel}&id=${objAutorizacion.folio}`
      );

      urlPDF.value = data.url;
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerInfoVendedorByNumeroEmpleado = async (numeroEmpleado) => {
    try {
      const { data } = await api.get(
        `/autorizaciones/vendedor/numero/${numeroEmpleado}`
      );

      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const obtenerInfoJefe = async (busquedaObj) => {
    try {
      const { data } = await api.post(`/autorizaciones/jefe`, busquedaObj);

      infoJefe.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerInfoAutorizacion = async (idAutorizacion) => {
    try {
      const { data } = await api.get(
        `/autorizaciones/obtener/${idAutorizacion}`
      );

      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const validarAutorizador = async (numeroEmpleado, idAutorizacion) => {
    try {
      const { data } = await api.post("/unidades/autorizaciones/validar", {
        numeroEmpleado,
        idAutorizacion,
      });

      autorizacionSeleccionada.value = data
    } catch (error) {
      console.log(error);
      notificacion("negative", error.response.data.message || "Error al validar el autorizador");
      esAutorizador.value = false;
    }
  };

  const obtenerAutorizador = async (idAsesor) => {
    try {
      const { data } = await api.post("/unidades/autorizaciones/autorizador", {
        idAsesor,
      });

      autorizadores.value = data;
    } catch (error) {
      console.log(error);
      notificacion("negative", error.response.data.message || "Error al obtener el autorizador");
    }
  }

  const enviarRegistrarAutorizacion = async (infoAutorizacion) => {
    try {
      const { data } = await api.post("/unidades/autorizaciones/enviar", infoAutorizacion);

      notificacion("positive", data.message);
    } catch (error) {
      console.log(error);
      notificacion("negative", error.response.data.message || "Error al registrar la autorización");
    }
  }

  return {
    // States
    autorizadores,
    autorizaciones,
    urlPDF,
    infoJefe,
    esAutorizador,
    autorizacionSeleccionada,
    // Methods
    enviarCorreo,
    obtenerAutorizadores,
    obtenerAutorizacionesByMes,
    registrarAutorizaciones,
    aceptarAutorizacion,
    enviarComisionJefe,
    rechazarComision,
    enviarComisionRechazo,
    obtenerInfoVendedorByID,
    obtenerUrlPDF,
    obtenerInfoVendedorByNumeroEmpleado,
    obtenerInfoJefe,
    obtenerInfoAutorizacion,
    validarAutorizador,
    obtenerAutorizador,
    enviarRegistrarAutorizacion,
  };
});
