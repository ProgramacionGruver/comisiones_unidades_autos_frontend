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
        <q-btn
          label="Cancelar"
          color="primary"
          flat
          v-close-popup
          icon-right="close"
        />
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
import { info } from "autoprefixer";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { obtenerNumerosDeMes } from "src/constant/constantes";

export default {
  setup() {
    const useKpis = useKpiStore();
    const { comisionVendedor } = storeToRefs(useKpis);

    const useFormularios = useFormulariosStore();
    const { obtenerUrlComision } = useFormularios;
    const { urlComision } = storeToRefs(useFormularios);

    const useAutorizaciones = useAutorizacionesStore();
    const { enviarCorreo, registrarAutorizaciones } = useAutorizaciones;

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const abrirModal = ref(false);
    const cargando = ref(false);

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

      const dataAutorizacion = {
        anio: anioSeleccionado.value,
        mes: Number(obtenerNumerosDeMes(mesSeleccionado.value)),
        fechaPrimerEnvio: fechaPrimerEnvio.value,
        rutaPDF: "",
        infoVendedor: vendedorObj.value,
        comentario: "",
      };

      const autorizaciones = await registrarAutorizaciones(dataAutorizacion);

      comisionVendedor.value.autorizaciones = autorizaciones;

      await obtenerUrlComision(comisionVendedor.value, "vendedor");

      // const objData = {
      //   destinatario: vendedorObj.value.correo,
      //   link: urlComision.value,
      //   infoVendedor: vendedorObj.value,
      // };

      // await enviarCorreo(objData);

      cargando.value = false;
    };

    return {
      // States
      abrirModal,
      vendedorObj,
      cargando,
      // Methods
      abrir,
      enviarComision,
    };
  },
};
</script>
