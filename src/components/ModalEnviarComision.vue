<template>
  <q-dialog v-model="abrirModal">
    <q-card class="full-width">
      <q-card-section
        class="bg-primary text-white row items-center q-pb-none q-mt-none q-pt-none"
      >
        <h2 class="text-h4">Enviar comisión</h2>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <p style="text-align: justify; font-size: 1.5rem">
          ¿Desea enviar el reporte de comisión al empleado
          <strong>{{ vendedorObj.nombreEmpleado }}</strong> con número de
          empleado <strong>{{ vendedorObj.numeroEmpleado }}</strong
          >?
        </p>
        <q-input
          v-model="vendedorObj.correo"
          label="Correo electrónico"
          outlined
          dense
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Cancelar" color="red" v-close-popup icon-right="close" />
        <q-btn
          label="Copiar Link"
          color="primary"
          flat
          icon-right="content_copy"
          @click="copiarLink"
          :loading="cargandoCopiar"
        >
          <template v-slot:loading>
            <q-spinner-facebook color="primary" />
          </template>
        </q-btn>
        <q-btn
          label="Enviar"
          color="primary"
          @click="enviarComision"
          icon-right="send"
          :loading="cargando"
        >
          <template v-slot:loading>
            <q-spinner-facebook color="white" />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useKpiStore } from "src/stores/catalogos/kpis";
import { useFormulariosStore } from "src/stores/formularios";
import { useAutorizacionesStore } from "src/stores/autorizaciones";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { obtenerNumerosDeMes } from "src/constant/constantes";
import { listaMeses } from "src/helpers/listas";
import { notificacion } from "src/helpers/mensajes";

export default {
  setup() {
    const useKpis = useKpiStore();
    const { comisionVendedor } = storeToRefs(useKpis);

    const useFormularios = useFormulariosStore();
    const { obtenerUrlComision } = useFormularios;
    const { urlComision } = storeToRefs(useFormularios);

    const useAutorizaciones = useAutorizacionesStore();
    const { enviarCorreo, registrarAutorizaciones, obtenerUrlPDF } =
      useAutorizaciones;
    const { urlPDF } = storeToRefs(useAutorizaciones);

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const abrirModal = ref(false);
    const cargando = ref(false);
    const cargandoCopiar = ref(false);

    const vendedorObj = ref({});
    const fechaPrimerEnvio = ref(null);
    const comision = ref(null);

    const abrir = (infoVendedor, infoComision) => {
      vendedorObj.value = infoVendedor;
      comision.value = infoComision;

      fechaPrimerEnvio.value = new Date();
      const mesPrimerEnvio = (fechaPrimerEnvio.value.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const diaPrimerEnvio = fechaPrimerEnvio.value
        .getDate()
        .toString()
        .padStart(2, "0");

      fechaPrimerEnvio.value = `${diaPrimerEnvio}/${mesPrimerEnvio}/${fechaPrimerEnvio.value.getFullYear()}`;

      abrirModal.value = true;
    };

    const enviarComision = async () => {
      try {
        cargando.value = true;

        const mes = Number(obtenerNumerosDeMes(mesSeleccionado.value));

        const folioPrev = `COM-${vendedorObj.value.claveDepartamento}-${vendedorObj.value.numeroEmpleado}-${anioSeleccionado.value}-${mes}`;
        const folio = folioPrev.replace(/\s/g, "-");

        let montoComision = 0;

        if (
          vendedorObj.value.claveDepartamento == "SUAUTO" ||
          vendedorObj.value.claveDepartamento == "COOR SUAUTO"
        ) {
          montoComision = Number(comision.value.totalAPagar.toFixed(2));
        } else {
          montoComision = Number(
            comision.value.kpis
              .find((kpi) => kpi.tipoRenglon === "total")
              .montoAPagar.toFixed(2)
          );
        }

        const dataAutorizacion = {
          anio: anioSeleccionado.value,
          mes: mes,
          fechaPrimerEnvio: fechaPrimerEnvio.value,
          rutaPDF: "",
          infoVendedor: vendedorObj.value,
          comentario: "",
          urlPDF: "",
          folio,
          claveDepartamento: vendedorObj.value.claveDepartamento,
          montoComision,
          montoBonos:
            vendedorObj.value.claveDepartamento == "SUAUTO" ||
            vendedorObj.value.claveDepartamento == "COOR SUAUTO"
              ? 0
              : comision.value.descuentosVendedor[0].totalAPagar,
        };

        const autorizaciones = await registrarAutorizaciones(dataAutorizacion);

        if (!autorizaciones) {
          cargando.value = false;
          return;
        }

        // await obtenerUrlComision(comisionVendedor.value, "vendedor");
        // const linkComision = `http://localhost:9000/portal_comisiones_unidades_autos/#/autorizacion/vendedor/${vendedorObj.value.idAsesor}/${mes}/${anioSeleccionado.value}/${autorizaciones.idAutorizacion}`;
        const linkComision = `https://www.gruver.com.mx/portal_comisiones_unidades_autos/#/autorizacion/vendedor/${vendedorObj.value.idAsesor}/${mes}/${anioSeleccionado.value}/${autorizaciones.idAutorizacion}`;
        // const linkComision = `` // <--------- Cambiar a productivo

        const mesNombre = listaMeses[mes - 1];

        const objData = {
          destinatario: vendedorObj.value.correo,
          link: linkComision,
          infoVendedor: vendedorObj.value,
          mes: mesNombre,
          infoAutorizacion: autorizaciones,
        };

        await enviarCorreo(objData);

        cargando.value = false;
        abrirModal.value = false;
      } catch (error) {
        console.log(error);
      } finally {
        cargando.value = false;
        abrirModal.value = false;
      }
    };

    const copiarLink = async () => {
      cargandoCopiar.value = true;

      const mes = Number(obtenerNumerosDeMes(mesSeleccionado.value));

      const folio = `COM-${vendedorObj.value.claveDepartamento}-${vendedorObj.value.numeroEmpleado}-${anioSeleccionado.value}-${mes}`;

      // const objObtenerPDF = {
      //   anio: anioSeleccionado.value,
      //   mes: mes,
      //   folio,
      //   idAsesor: vendedorObj.value.idAsesor,
      //   numeroEmpleado: vendedorObj.value.numeroEmpleado,
      //   nivel: vendedorObj.value.nivel,
      //   id: folio,
      // };

      // await obtenerUrlPDF(objObtenerPDF);

      const dataAutorizacion = {
        anio: anioSeleccionado.value,
        mes: mes,
        fechaPrimerEnvio: fechaPrimerEnvio.value,
        rutaPDF: "",
        infoVendedor: vendedorObj.value,
        comentario: "",
        urlPDF: "",
        folio,
        monto: comision.value.descuentosVendedor[0].totalAPagar,
      };

      const autorizaciones = await registrarAutorizaciones(dataAutorizacion);

      if (autorizaciones.length === 0) {
        cargando.value = false;
        return;
      }

      comisionVendedor.value.autorizaciones = autorizaciones;

      // await obtenerUrlComision(comisionVendedor.value, "vendedor");

      const linkComision = `http://localhost:9000/portal_comisiones_unidades_autos/autorizacion/vendedor/${vendedorObj.value.idAsesor}/${mes}/${anioSeleccionado.value}`;
      // const linkComision = `` // <--------- Cambiar a productivo

      await navigator.clipboard.writeText(linkComision);

      notificacion("positive", "Link copiado al portapapeles");

      cargandoCopiar.value = false;
      abrirModal.value = false;
    };

    return {
      // States
      abrirModal,
      vendedorObj,
      cargando,
      cargandoCopiar,
      // Methods
      abrir,
      enviarComision,
      copiarLink,
    };
  },
};
</script>
