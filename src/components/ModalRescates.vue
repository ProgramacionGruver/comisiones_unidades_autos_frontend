<template>
    <q-dialog v-model="modalRescates">
      <q-card>
        <q-card-section class="bg-primary text-white row items-center q-pb-none">
          <h2 class="text-h4">Agregar Rescate Carretero</h2>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="formulario" @submit.prevent.stop="crearRescate">
            <div class="q-my-xs">
              <label>Selecciona el mecánico. </label>
            </div>
            <div class="row justify-around" style="width: 40rem;">
              <q-select class="col-12 q-mx-xs"
                clearable
                use-input
                outlined
                dense
                :options="mecanicosRegistrados"
                v-model="mecanicoSeleccionado"
                @filter="parametrosFiltradosMecanicos"
                :rules="[val => !!val || 'Seleccione un mecánico']"
                />
              </div>
              <div class="q-my-md">
                <label>Selecciona la orden. </label>
              </div>
              <q-select class="col-12 q-mx-xs"
                clearable
                use-input
                outlined
                dense
                :options="ordenesRegistradas"
                v-model="orden"
                @filter="parametrosFiltradosOrdenes"
                @update:model-value="buscarCliente"
                :rules="[val => !!val || 'Seleccione una orden']"
                />
            <div class="q-my-md">
              <label>Selecciona el tipo de rescate y mecánico. </label>
            </div>
            <div class="row justify-around">
              <q-select class="col-5 q-mx-xs"
                  outlined
                  dense
                  :options="opcionesRescate"
                  label="Rescate"
                  map-options
                  v-model="rescate"
                  :rules="[val => !!val || 'Seleccione un tipo de rescate']"
                />
              <q-select class="col-5 q-mx-xs"
                  outlined
                  dense
                  :options="opcionesMecanico"
                  label="Mecánico"
                  map-options
                  v-model="mecanico"
                  :rules="[val => !!val || 'Seleccione un tipo de mecánico']"
                />
              </div>
              <div class="q-my-md">
                <label>Selecciona  la fecha y costo del rescate. </label>
              </div>
              <div class="row justify-around">
                <q-input dense outlined filled v-model="objRescate.fechaRescate" type="date" :rules="[val => !!val || 'Seleccione una fecha']"/>
                <q-input dense outlined filled v-model="objRescate.costo" label="Costo" type="number" color="primary" :rules="validarDigitosEnteros">
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
                </q-input>
              </div>
              <div class="q-my-md">
                <label>Cliente. </label>
              </div>
              <q-input square outlined filled dense v-model="objRescate.cliente" readonly/>
              <q-card-actions align="right" class="q-pt-md">
                <q-btn
                :disable="cargando"
                icon-right="save"
                label="Guardar"
                color="primary"
                @click="crearRescate"
                 >
              </q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>

  <script>
  import { ref, onMounted } from 'vue'
  import { storeToRefs } from "pinia"
  import {useRescatesStore} from "src/stores/catalogos/rescates"
  import { useReportesStore } from 'src/stores/catalogos/reportes'
  import { useAutenticacionStore } from 'src/stores/autenticaciones'
  import { opcionesMecanico, opcionesRescate } from 'src/constant/constantes'
  import { validarDigitosEnteros } from 'src/helpers/inputReglas'
  import { filtradoBusquedaObj } from 'src/helpers/filtradoBusquedaObj'

  export default {
    setup () {

      const useReportes = useReportesStore()
      const { obtenerReportesMecanicos, obtenerIdOrdenes, obtenerCliente } = useReportes
      const { opcionesMecanicos, opcionesOrdenes, cliente } = storeToRefs(useReportes)

      const useRescates = useRescatesStore()
      const { guardarRescates } = useRescates
      const { cargando } = storeToRefs(useRescates)

      const useAutenticacion = useAutenticacionStore()
      const { usuarioAutenticado } = useAutenticacion

      const formulario = ref(null)
      const modalRescates = ref(false)
      const mecanicoSeleccionado = ref(null)
      const rescate = ref(null)
      const mecanico = ref(null)
      const orden = ref(null)

      const mecanicosRegistrados = ref(opcionesMecanicos.value)
      const ordenesRegistradas = ref(opcionesOrdenes.value)

      const objRescateInit = {
        idMecanico : '',
        idOrden: '',
        cliente: '',
        tipoRescate: '',
        tipoMecanico: '',
        costo: '',
        fechaRescate: '',
        usuario: '',
        claveSucursal: '',
        claveEmpresa: ''
      }
    const objRescate = ref(objRescateInit)


      const abrir = () => {
        mecanicoSeleccionado.value = null
        rescate.value = null
        mecanico.value = null
        orden.value = null
        objRescate.value = {...objRescateInit}
        modalRescates.value = true
      }

      onMounted(async () => {
        await obtenerReportesMecanicos()
        await obtenerIdOrdenes()
      })

      const buscarCliente = async() =>{
        await obtenerCliente({idOrden: orden.value.data?.no_orden})
        objRescate.value.cliente = cliente.value[0].cliente
      }

      const crearRescate = async() =>{
        if (!await formulario.value.validate()) {
          return
        }
        objRescate.value.tipoRescate = rescate.value?.data
        objRescate.value.tipoMecanico = mecanico.value?.data
        objRescate.value.idOrden = orden.value?.data?.no_orden
        objRescate.value.idMecanico = mecanicoSeleccionado.value?.data?.id_mec
        objRescate.value.usuario = usuarioAutenticado.usuario
        objRescate.value.claveEmpresa = mecanicoSeleccionado.value?.data?.claveEmpresa
        objRescate.value.claveSucursal = mecanicoSeleccionado.value?.data?.claveSucursal
        await guardarRescates(objRescate.value)
        modalRescates.value = false
      }

      const parametrosFiltradosMecanicos = (val, update) => {
        filtradoBusquedaObj(val, update, opcionesMecanicos.value, mecanicosRegistrados)
      }

      const parametrosFiltradosOrdenes = (val, update) => {
        filtradoBusquedaObj(val, update, opcionesOrdenes.value, ordenesRegistradas)
      }

      return{
        abrir,
        modalRescates,
        opcionesMecanicos,
        opcionesOrdenes,
        objRescate,
        opcionesMecanico,
        opcionesRescate,
        validarDigitosEnteros,
        mecanicoSeleccionado,
        rescate,
        mecanico,
        orden,
        cliente,
        cargando,
        formulario,
        mecanicosRegistrados,
        ordenesRegistradas,
        buscarCliente,
        crearRescate,
        parametrosFiltradosMecanicos,
        parametrosFiltradosOrdenes
      }
    }
  }
</script>

