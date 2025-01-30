<template>
  <q-dialog
    v-model="abrirModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>Carga masiva de garantias GM</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="row items-center q-pb-sm">
        <p class="text-justify text-h4">
          Selecione el archivo de garantias proporcionado por GM (Solamente se
          admite el formato .xlsx)
        </p>
        <q-file
          v-model="archivo"
          accept=".xlsx"
          label="Seleccionar archivo"
          class="q-mt-sm col"
          outlined
        />
      </q-card-section>
      <q-card-section>
        <span>Seleccione el mes y año correspondiente a la carga:</span>
        <div class="fit row q-gutter-sm">
          <div class="col q-ma-sm">
            <q-select
              outlined
              dense
              :options="listaAnios"
              v-model="anioSeleccionado"
              map-options
              option-value="name"
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              outlined
              dense
              :options="listaMeses"
              v-model="mesSeleccionado"
              map-options
              option-value="name"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="red" label="Cancelar" flat v-close-popup icon="close" />
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
import { ref } from "vue";
import { usePvaStore } from "src/stores/catalogos/pvas";
import { notificacion } from "src/helpers/mensajes";
import { QSpinnerIos, useQuasar } from "quasar";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { storeToRefs } from "pinia";
import { obtenerNumerosDeMes } from "src/constant/constantes";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { listaMeses, listaAnios } from "src/helpers/listas";

export default {
  setup() {
    const usePvas = usePvaStore();
    const { guardarGarantias } = usePvas;

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const useAutenticaciones = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticaciones);

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
        message: "Cargando las garantías...",
        spinner: QSpinnerIos,
      });

      try {
        const objBusqueda = {
          anio: anioSeleccionado.value,
          mes: Number(obtenerNumerosDeMes(mesSeleccionado.value)),
          usuario: usuarioAutenticado.value.usuario,
        };

        await guardarGarantias(archivo.value, objBusqueda);
      } catch (error) {
        notificacion("error", "Ocurrio un error al cargar el archivo" + error);
      } finally {
        $q.loading.hide();
        abrirModal.value = false;
      }
    };

    return {
      // States
      abrirModal,
      archivo,
      listaMeses,
      listaAnios,
      anioSeleccionado,
      mesSeleccionado,
      // Methods
      abrir,
      cargarArchivo,
    };
  },
};
</script>
