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

    const abrir = (infoVendedor) => {
      vendedorObj.value = infoVendedor;

      fechaPrimerEnvio.value = new Date();
      fechaPrimerEnvio.value =
        fechaPrimerEnvio.value.toLocaleDateString("es-MX");

      abrirModal.value = true;
    };

    const enviarComision = async () => {
      cargando.value = true;

      const mes = Number(obtenerNumerosDeMes(mesSeleccionado.value));

      const folio = `COM-${vendedorObj.value.numeroEmpleado}-${anioSeleccionado.value}-${mes}`;

      const objObtenerPDF = {
        anio: anioSeleccionado.value,
        mes: mes,
        folio,
        idAsesor: vendedorObj.value.idAsesor,
        numeroEmpleado: vendedorObj.value.numeroEmpleado,
        nivel: vendedorObj.value.nivel,
        id: folio,
      };

      await obtenerUrlPDF(objObtenerPDF);

      const dataAutorizacion = {
        anio: anioSeleccionado.value,
        mes: mes,
        fechaPrimerEnvio: fechaPrimerEnvio.value,
        rutaPDF: `/var/www/backend/html/portalComisiones/${
          urlPDF.split("/")[urlPDF.split("/").length - 1]
        }`,
        infoVendedor: vendedorObj.value,
        comentario: "",
        urlPDF: urlPDF.value,
        folio,
      };

      const autorizaciones = await registrarAutorizaciones(dataAutorizacion);

      if (autorizaciones.length === 0) {
        cargando.value = false;
        return;
      }

      comisionVendedor.value.autorizaciones = autorizaciones;

      await obtenerUrlComision(comisionVendedor.value, "vendedor");

      const mesNombre = listaMeses[mes - 1];

      const objData = {
        destinatario: vendedorObj.value.correo,
        link: urlComision.value,
        infoVendedor: vendedorObj.value,
        mes: mesNombre,
        infoAutorizacion: comisionVendedor.value.autorizaciones,
      };

      await enviarCorreo(objData);

      cargando.value = false;
      abrirModal.value = false;
    };

    const copiarLink = async () => {
      cargandoCopiar.value = true;

      const mes = Number(obtenerNumerosDeMes(mesSeleccionado.value));

      const folio = `COM-${vendedorObj.value.numeroEmpleado}-${anioSeleccionado.value}-${mes}`;

      const objObtenerPDF = {
        anio: anioSeleccionado.value,
        mes: mes,
        folio,
        idAsesor: vendedorObj.value.idAsesor,
        numeroEmpleado: vendedorObj.value.numeroEmpleado,
        nivel: vendedorObj.value.nivel,
        id: folio,
      };

      await obtenerUrlPDF(objObtenerPDF);

      const dataAutorizacion = {
        anio: anioSeleccionado.value,
        mes: mes,
        fechaPrimerEnvio: fechaPrimerEnvio.value,
        rutaPDF: `/var/www/backend/html/portalComisiones/${
          urlPDF.split("/")[urlPDF.split("/").length - 1]
        }`,
        infoVendedor: vendedorObj.value,
        comentario: "",
        urlPDF: urlPDF.value,
        folio,
      };

      const autorizaciones = await registrarAutorizaciones(dataAutorizacion);

      if (autorizaciones.length === 0) {
        cargandoCopiar.value = false;
        return;
      }

      comisionVendedor.value.autorizaciones = autorizaciones;

      await obtenerUrlComision(comisionVendedor.value, "vendedor");

      await navigator.clipboard.writeText(urlComision.value);

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
