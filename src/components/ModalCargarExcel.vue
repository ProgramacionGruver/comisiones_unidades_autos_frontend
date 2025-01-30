<template>
  <q-dialog
    v-model="abrirModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>Cargar excel de contratos Su Auto</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="row items-center q-pb-sm">
        <p class="text-justify">
          Para que los contratos de Su Auto se carguen correctamente, debe
          respetar el formato y este debe ser un archivo .xlsx (Excel).
        </p>
        <q-file
          v-model="archivo"
          accept=".xlsx"
          label="Seleccionar archivo"
          class="q-mt-sm col"
          outlined
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="red"
          label="Cancelar"
          flat
          @click="abrirModal = false"
          icon="close"
        />
        <q-btn
          color="primary"
          label="Cargar"
          @click="cargarArchivo"
          :disable="archivo === null"
          icon="cloud_upload"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { storeToRefs } from "pinia";
import { QSpinnerIos, useQuasar } from "quasar";
import { obtenerNumerosDeMes } from "src/constant/constantes";
import { notificacion } from "src/helpers/mensajes";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { useSuAutoStore } from "src/stores/suAuto";
import { ref } from "vue";

export default {
  setup() {
    const useSuAuto = useSuAutoStore();
    const { registrarContratosSuAutoByExcel } = useSuAuto;

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const abrirModal = ref(false);

    const archivo = ref(null);

    const $q = useQuasar();

    const abrir = () => {
      archivo.value = null;
      abrirModal.value = true;
    };

    const cargarArchivo = async () => {
      if (archivo.value === null) {
        notificacion("warning", "Seleccione un archivo para continuar");
        return;
      }

      $q.loading.show({
        message: "Cargando contratos...",
        spinner: QSpinnerIos,
      });

      try {
        const obj = {
          anio: anioSeleccionado.value,
          mes: Number(obtenerNumerosDeMes(mesSeleccionado.value)),
        };

        await registrarContratosSuAutoByExcel(archivo.value, obj);
        $q.loading.hide();
      } catch (error) {
        $q.loading.hide();
      } finally {
        abrirModal.value = false;
      }
    };

    return {
      // States
      abrirModal,
      archivo,
      // Methods
      abrir,
      cargarArchivo,
    };
  },
};
</script>
