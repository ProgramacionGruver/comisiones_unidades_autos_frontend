<template>
    <q-dialog v-model="abrirModal">
      <q-card class="full-width">
        <q-card-section class="bg-primary text-white row items-center q-pb-none">
          <p>Enviar Comisiones Mecánicos</p>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="row items-center q-pb-sm">
          <q-avatar class="" icon="help_outline" color="primary" text-color="white" />
            <div class="col-10 q-px-lg" style="font-size: 1.4rem;">
              <div class="text-center"><strong>{{ quincenaSeleccionada }} de {{ mesSeleccionado }} del {{ anioSeleccionado }}</strong></div>
              <div class="text-center"><strong>{{ sucursalSeleccionada.nombreSucursal }}</strong></div>
              ¿Seguro que deseas enviar las comisiones de mecánicos?
            </div>
          </q-card-section>
        <q-card-section class="q-py-sm">
            <q-card-actions align="center">
              <q-btn
                label="Aceptar"
                color="positive"
                @click="enviarComisiones"
              >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
              </q-btn>
              <q-btn
                label="Cancelar"
                color="negative"
                v-close-popup
              />
            </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>

<script>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useComisionesStore } from 'src/stores/comisionesMecanicos'
import { useReportesStore } from 'src/stores/catalogos/reportes'
import { useEmpresasStore } from 'src/stores/catalogos/empresas'
import { useSucursalesStore } from 'src/stores/catalogos/sucursales'



export default {
  setup () {
    const abrirModal = ref(false)

    const useComisiones = useComisionesStore()
    const { guardarComisionesMecanicos } = useComisiones

    const useReportes = useReportesStore()
    const { quincenaSeleccionada, mesSeleccionado, anioSeleccionado} = storeToRefs(useReportes)

    const useSucursales = useSucursalesStore()
    const { sucursalSeleccionada } = storeToRefs(useSucursales)

    const useEmpresas = useEmpresasStore()
    const { empresaSeleccionada } = storeToRefs(useEmpresas)

    const comisionesMecanicos = ref([])

    const abrir = async (objComisiones) => {
      abrirModal.value = true
      comisionesMecanicos.value = [...objComisiones]
    }

    const enviarComisiones = async () => {
      await guardarComisionesMecanicos( comisionesMecanicos.value, quincenaSeleccionada, mesSeleccionado, anioSeleccionado)
      abrirModal.value = false
    }

    return {
      abrirModal,
      sucursalSeleccionada,
      empresaSeleccionada,
      quincenaSeleccionada,
      mesSeleccionado,
      anioSeleccionado,
      abrir,
      enviarComisiones,
    }
  }
}
</script>

<style></style>
