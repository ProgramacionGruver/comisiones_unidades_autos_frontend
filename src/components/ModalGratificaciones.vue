<template>
    <q-dialog v-model="modalGratificaciones">
      <q-card>
        <q-card-section class="bg-primary text-white row items-center q-pb-none">
          <h2 class="text-h4">Gratificaciones</h2>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="q-pt-xs">
                <q-tabs
                          v-model="tab"
                          dense
                          borderless
                          class="text-grey"
                          active-color="primary"
                          indicator-color="primary"
                          align="justify"
                        >
                          <q-tab name="comisiones" label="Agregar Comisiones" />
                          <q-tab name="dias" label="Agregar Dias" />
                </q-tabs>
          </div>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="comisiones">
              <q-card-section>
                  <q-form ref="formulario" @submit.prevent.stop="crearComision">
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
                        v-model="mecanicoSeleccionadoComision"
                        label="Mecánico"
                        @filter="parametrosFiltradosMecanicos"
                        :rules="[val => !!val || 'Seleccione un mecánico']"
                        />
                      </div>
                    <div class="q-my-md">
                      <label>Selecciona el tipo de Gratificación. </label>
                    </div>
                    <div class="row justify-around">
                      <q-select class="col q-mx-xs"
                          outlined
                          dense
                          :options="opcionesComision"
                          v-model="comisiones"
                          label="Gratificación"
                          map-options
                          :rules="[val => !!val || 'Seleccione un tipo de gratificacion']"
                        />
                      </div>
                      <div class="q-my-md">
                        <label>Selecciona  la fecha y monto. </label>
                      </div>
                      <div class="row justify-around">
                        <q-input dense filled v-model="objComisiones.fechaGratificacion" type="date" :rules="[val => !!val || 'Seleccione una fecha']"/>
                        <q-input dense filled v-model="objComisiones.monto" label="Monto" type="number" color="primary" :rules="validarDigitosEnteros">
                        <template v-slot:prepend>
                          <q-icon name="paid" />
                        </template>
                        </q-input>
                      </div>
                      <q-card-actions align="right" class="q-pt-md">
                        <q-btn
                        :disable="cargando"
                        icon-right="save"
                        label="Guardar"
                        color="primary"
                        @click="crearComision"
                        >
                      </q-btn>
                    </q-card-actions>
                  </q-form>
              </q-card-section>
            </q-tab-panel>
            <q-tab-panel name="dias">
              <q-card-section>
                  <q-form ref="formulario" @submit.prevent.stop="crearDias">
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
                        v-model="mecanicoSeleccionadoDias"
                        label="Mecánico"
                        @filter="parametrosFiltradosMecanicos"
                        :rules="[val => !!val || 'Seleccione un mecánico']"
                        />
                      </div>
                      <div class="q-my-md">
                        <label>Selecciona el tipo y número de dias. </label>
                      </div>
                      <div class="row justify-around">
                        <q-select class="col q-mx-xs"
                          outlined
                          dense
                          :options="opcionesDias"
                          v-model="dias"
                          label="Gratificación"
                          map-options
                          :rules="[val => !!val || 'Seleccione un tipo de gratificacion']"
                        />
                        <q-input dense filled v-model="objDias.monto" label="Dias" type="number" color="primary" :rules="validarDigitosEnteros">
                        <template v-slot:prepend>
                          <q-icon name="today" />
                        </template>
                        </q-input>
                      </div>
                      <div class="q-my-md">
                        <label>Selecciona  la fecha. </label>
                      </div>
                        <q-input dense filled v-model="objDias.fechaGratificacion" type="date" :rules="[val => !!val || 'Seleccione una fecha']"/>
                      <q-card-actions align="right" class="q-pt-md">
                        <q-btn
                        :disable="cargando"
                        icon-right="save"
                        label="Guardar"
                        color="primary"
                        @click="crearDias"
                        >
                      </q-btn>
                    </q-card-actions>
                  </q-form>
              </q-card-section>
            </q-tab-panel>
          </q-tab-panels>
      </q-card>
    </q-dialog>
  </template>

  <script>
  import { ref, onMounted } from 'vue'
  import { storeToRefs } from "pinia"
  import { useGratificacionesStore } from 'src/stores/catalogos/gratificaciones'
  import { useReportesStore } from 'src/stores/catalogos/reportes'
  import { useAutenticacionStore } from 'src/stores/autenticaciones'
  import { opcionesComision, opcionesDias } from 'src/constant/constantes'
  import { validarDigitosEnteros } from 'src/helpers/inputReglas'
  import { filtradoBusquedaObj } from 'src/helpers/filtradoBusquedaObj'

  export default {
    setup () {

      const useReportes = useReportesStore()
      const { obtenerReportesMecanicos } = useReportes
      const { opcionesMecanicos } = storeToRefs(useReportes)

      const useGratificaciones = useGratificacionesStore()
      const { guardarGratificaciones } = useGratificaciones
      const { cargando } = storeToRefs(useGratificaciones)

      const useAutenticacion = useAutenticacionStore()
      const { usuarioAutenticado } = useAutenticacion

      const formulario = ref(null)
      const comisiones = ref(null)
      const dias = ref(null)
      const modalGratificaciones = ref(false)
      const mecanicoSeleccionadoComision = ref(null)
      const mecanicoSeleccionadoDias = ref(null)

      const mecanicosRegistrados = ref(opcionesMecanicos.value)

      const objComisionesInit = {
        idMecanico : '',
        tipoGratificacion: '',
        monto: '',
        fechaGratificacion: '',
        usuario: '',
        claveSucursal: '',
        claveEmpresa: ''
      }

      const objDiasInit = {
        idMecanico : '',
        tipoGratificacion: '',
        monto: '',
        fechaGratificacion: '',
        usuario: '',
        claveSucursal: '',
        claveEmpresa: ''
      }

    const objComisiones = ref(objComisionesInit)
    const objDias = ref(objDiasInit)

      const abrir = () => {
        dias.value = null
        comisiones.value = null
        mecanicoSeleccionadoComision.value = null
        mecanicoSeleccionadoDias.value = null
        objComisiones.value = {...objComisionesInit}
        objDias.value = {...objDiasInit}
        modalGratificaciones.value = true
      }

      onMounted(async () => {
        await obtenerReportesMecanicos()
      })

      const crearComision = async() =>{
        if (!await formulario.value.validate()) {
          return
        }
        objComisiones.value.tipoGratificacion = comisiones.value?.data
        objComisiones.value.idMecanico = mecanicoSeleccionadoComision.value?.data?.id_mec
        objComisiones.value.usuario = usuarioAutenticado.usuario
        objComisiones.value.claveEmpresa = mecanicoSeleccionadoComision.value?.data?.claveEmpresa
        objComisiones.value.claveSucursal = mecanicoSeleccionadoComision.value?.data?.claveSucursal
        await guardarGratificaciones(objComisiones.value)
        modalGratificaciones.value = false
      }

      const crearDias = async() =>{
        if (!await formulario.value.validate()) {
          return
        }
        objDias.value.tipoGratificacion = dias.value?.data
        objDias.value.idMecanico = mecanicoSeleccionadoDias.value?.data?.id_mec
        objDias.value.usuario = usuarioAutenticado.usuario
        objDias.value.claveEmpresa = mecanicoSeleccionadoDias.value?.data?.claveEmpresa
        objDias.value.claveSucursal = mecanicoSeleccionadoDias.value?.data?.claveSucursal
        await guardarGratificaciones(objDias.value)
        modalGratificaciones.value = false
      }

      const parametrosFiltradosMecanicos = (val, update) => {
        filtradoBusquedaObj(val, update, opcionesMecanicos.value, mecanicosRegistrados)
      }


      return{
        abrir,
        tab: ref('comisiones'),
        modalGratificaciones,
        opcionesMecanicos,
        opcionesComision,
        opcionesDias,
        comisiones,
        dias,
        objComisiones,
        objDias,
        validarDigitosEnteros,
        mecanicoSeleccionadoComision,
        mecanicoSeleccionadoDias,
        cargando,
        formulario,
        mecanicosRegistrados,
        crearComision,
        crearDias,
        parametrosFiltradosMecanicos,
      }
    }
  }
</script>

