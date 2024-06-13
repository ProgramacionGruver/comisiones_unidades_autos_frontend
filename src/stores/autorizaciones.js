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

  const useKpis = useKpiStore();
  const { comisionVendedor } = storeToRefs(useKpis);

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
      const { data } = await api.post("/autorizaciones/todas/mes", {
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
      return [];
    }
  };

  const aceptarAutorizacion = async (objAutorizacion) => {
    try {
      const { data } = await api.post(
        "/autorizaciones/aceptar",
        objAutorizacion
      );
      const index =
        comisionVendedor.value.autorizaciones.autorizaciones_comisiones_autos_detalles.findIndex(
          (item) => item.idAutorizacion === objAutorizacion.idAutorizacion
        );

      comisionVendedor.value.autorizaciones.autorizaciones_comisiones_autos_detalles[
        index
      ] = data;
    } catch (error) {
      console.log(error);
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
        "/autorizaciones/rechazar",
        objAutorizacion
      );

      const index =
        comisionVendedor.value.autorizaciones.autorizaciones_comisiones_autos_detalles.findIndex(
          (item) => item.idAutorizacion === objAutorizacion.idAutorizacion
        );

      comisionVendedor.value.autorizaciones.autorizaciones_comisiones_autos_detalles[
        index
      ] = data;
    } catch (error) {
      console.log(error);
    }
  };

  const enviarComisionRechazo = async (objAutorizacion) => {
    try {
      const { data } = await api.post(
        "/autorizaciones/enviar/correo/rechazo",
        objAutorizacion
      );

      const index =
        comisionVendedor.value.autorizaciones.autorizaciones_comisiones_autos_detalles.findIndex(
          (item) => item.idAutorizacion === objAutorizacion.idAutorizacion
        );

      comisionVendedor.value.autorizaciones.autorizaciones_comisiones_autos_detalles[
        index
      ] = data;

      notificacion("positive", "Correo de rechazo enviado correctamente");
    } catch (error) {
      notificacion(
        "negative",
        `Error al enviar la autorización al vendedor: ${error.message}`
      );
    }
  };

  const obtenerInfoVendedorByNumeroEmpleado = async (numeroEmpleado) => {
    try {
      const { data } = await api.get(
        `/autorizaciones/vendedor/${numeroEmpleado}`
      );

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

  return {
    // States
    autorizadores,
    autorizaciones,
    urlPDF,
    // Methods
    enviarCorreo,
    obtenerAutorizadores,
    obtenerAutorizacionesByMes,
    registrarAutorizaciones,
    aceptarAutorizacion,
    enviarComisionJefe,
    rechazarComision,
    enviarComisionRechazo,
    obtenerInfoVendedorByNumeroEmpleado,
    obtenerUrlPDF,
  };
});
