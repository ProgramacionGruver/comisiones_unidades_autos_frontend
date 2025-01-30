<template>
  <q-dialog
    v-model="abrirModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>Guardar Facturas de Unidades</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="row items-center q-pb-sm">
        <q-avatar
          class=""
          icon="help_outline"
          color="primary"
          text-color="white"
        />
        <div class="col-10 q-px-lg" style="font-size: 1.4rem">
          <div class="text-center">
            <strong
              >{{ quincenaSeleccionada }} de {{ mesSeleccionado }} del
              {{ anioSeleccionado }}</strong
            >
          </div>
          <div class="text-center">
            <strong
              >{{ sucursalSeleccionada.nombreSucursal }} - UNIDADES
              {{ departamentoSeleccionado.value.nombreDepartamento }}</strong
            >
          </div>
          <div class="text-center">
            ¿Seguro que deseas guardar las facturas de unidades?
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-py-sm">
        <q-card-actions align="center">
          <q-btn label="Aceptar" color="positive" @click="enviarComisiones">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
          <q-btn label="Cancelar" color="negative" v-close-popup />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { useSucursalesStore } from "src/stores/catalogos/sucursales";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";
import { useQuasar } from "quasar";

export default {
  setup() {
    const abrirModal = ref(false);
    const $q = useQuasar();
    let timer;

    const useFacturas = useFacturasStore();
    const { guardarFacturas } = useFacturas;
    const {
      facturas,
      facturaSeleccionada,
      facturasFiltrada,
      quincenaSeleccionada,
      mesSeleccionado,
      anioSeleccionado,
    } = storeToRefs(useFacturas);

    const useSucursales = useSucursalesStore();
    const { sucursalSeleccionada } = storeToRefs(useSucursales);

    const useDepartamentos = useDepartamentosStore();
    const { departamentoSeleccionado } = storeToRefs(useDepartamentos);

    const abrir = async () => {
      abrirModal.value = true;
    };

    const enviarComisiones = async () => {
      facturaSeleccionada.value = [];

      $q.loading.show({
        message: "Cargando facturas en el sistema...",
      });

      try {
        await guardarFacturas(facturasFiltrada.value);
        await realizarTareaAsincrona();
        $q.loading.hide();
      } catch (error) {
        console.error("Error:", error);
        $q.loading.hide();
      }
      facturasFiltrada.value = [];
      facturas.value = facturas.value.filter(
        (factura) =>
          factura.id_plaza != sucursalSeleccionada.value.idContabilidad
      );
      abrirModal.value = false;
    };

    const realizarTareaAsincrona = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Tarea asincrónica completa");
          resolve();
        }, 1000);
      });
    };

    return {
      abrirModal,
      sucursalSeleccionada,
      departamentoSeleccionado,
      quincenaSeleccionada,
      mesSeleccionado,
      anioSeleccionado,
      abrir,
      enviarComisiones,
    };
  },
};
</script>

<style></style>
