<template>
    <q-dialog v-model="modalObjetivo" style="max-width: 200px, color: blue">
      <q-card style="max-width: 200px, color: blue">
        <q-card-section class="bg-primary text-white row items-center q-pb-none">
          <h2 class="text-h4">Agregar Objetivo</h2>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="formulario">
            <div class="q-pb-xs">
              <label>Escribe el nombre del objetivo. </label>
            </div>
            <div class="row justify-around" style="width: 40rem;">
              <q-input class="col-12 q-mx-xs"
                filled
                dense
                v-model="objKpi.nombreKpi"
                :rules="[val => !!val || 'Se requiere llenar este campo']"
                />
            </div>
            <div class="q-pb-xs">
              <label>Selecciona la sucursal. </label>
            </div>
            <div class="row justify-around" style="width: 40rem;">
              <q-select class="col-12 q-mx-xs"
                outlined
                dense
                :options="opcionesSucursales"
                v-model="sucursalSeleccionada"
                />
              </div>
              <div class="q-pt-md q-pb-xs">
                <label>Selecciona el nivel.</label>
              </div>
              <div class="row justify-around">
                <q-select class="col-12 q-mx-xs"
                  outlined
                  dense
                  clearable
                  use-input
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  label="Nivel"
                  v-model="objKpi.nivel"
                  :options="nivelKpi"
                  :rules="[val => !!val || 'Se requiere llenar este campo']"
                />
              </div>
              <div class="q-my-xs">
                <label>Selecciona el porcentaje U.B. y el Peso. </label>
              </div>
              <div class="row justify-around">
                <q-input class="q-pr-xs" style="max-width: 20rem;" dense filled label="Porcentaje U.B." type="number" color="primary" v-model="objKpi.porcentajeub" :rules="validarDigitos" >
                  <template v-slot:prepend>
                  </template>
                </q-input>
                <q-input style="max-width: 20rem;" dense filled label="Peso" type="number" color="primary" v-model="objKpi.peso" :rules="validarDigitos" >
                  <template v-slot:prepend>
                  </template>
                </q-input>
              </div>
              <div class="q-my-xs">
                <label>Selecciona el objetivo y el objetivo cumplimiento. </label>
              </div>
              <div class="row justify-around">
                <q-input class="q-pr-xs" style="max-width: 20rem;" dense filled label="Objetivo" type="number" color="primary" v-model="objKpi.objetivo" :rules="validarDigitos" >
                  <template v-slot:prepend>
                  </template>
                </q-input>
                <q-input style="max-width: 20rem;" dense filled label="Objetivo Cumplimiento" type="number" color="primary" v-model="objKpi.objetivoCumplimiento" :rules="validarDigitos" >
                  <template v-slot:prepend>
                  </template>
                </q-input>
              </div>
              <q-card-actions class="q-pt-md" align="right">
                <q-btn
                icon-right="save"
                label="Guardar"
                color="primary"
                @click="guardarKpis()"
                 >
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>

  <script>
  import { ref } from 'vue'
  import { storeToRefs } from "pinia"
  import { listaQuincenas } from 'src/helpers/listas'
  import { meses, anios, mes, tipoPva } from 'src/constant/constantes'
  import { useSucursalesStore } from 'src/stores/catalogos/sucursales'
  import { useFacturasStore } from 'src/stores/catalogos/facturas'
  import { validarDigitos } from 'src/helpers/inputReglas'
  import { nivelKpi } from 'src/constant/constantes'
  import { useKpiStore } from 'src/stores/catalogos/kpis'
  import { useAutenticacionStore } from 'src/stores/autenticaciones'

  export default {
      setup () {

        const useFacturas = useFacturasStore()
        const { mesSeleccionado, anioSeleccionado, quincenaSeleccionada } = storeToRefs(useFacturas)

        const useSucursales = useSucursalesStore()
        const {sucursalSeleccionada, sucursales} = storeToRefs(useSucursales)

        const useKpi = useKpiStore()
        const { guardarObjetivosKpis } = useKpi

        const useAutenticacion = useAutenticacionStore()
        const { usuarioAutenticado } = storeToRefs(useAutenticacion)


        const modalObjetivo = ref(false)
        const formulario = ref(null)
        const opcionesSucursales = ref([])
        const objKpiInit = {
          nombreKpi: '',
          nivel: '',
          claveSucursal: '',
          porcentajeub: '',
          objetivo: '',
          objetivoCumplimiento: '',
          peso: '',
          usuario: ''
        }

        const objKpi = ref({...objKpiInit})

        const abrir = async() => {
          opcionesSucursales.value = sucursales.value.map((sucursal) => {
              return {
                label: `${sucursal.nombreSucursal}`,
                value: { ...sucursal },
              }
            })
          sucursalSeleccionada.value = opcionesSucursales.value[0]
          objKpi.value = {...objKpiInit}
          modalObjetivo.value = true
        }

        const guardarKpis = async() => {
          if (!await formulario.value.validate()) {
                return;
            }
          objKpi.value.claveSucursal = sucursalSeleccionada.value.value.abreviacion
          objKpi.value.usuario = usuarioAutenticado.value.usuario
          await guardarObjetivosKpis(objKpi.value)
        }

        return {
          abrir,
          modalObjetivo,
          mesSeleccionado,
          anioSeleccionado,
          anios,
          meses,
          mes,
          listaQuincenas,
          quincenaSeleccionada,
          opcionesSucursales,
          sucursalSeleccionada,
          objKpi,
          formulario,
          nivelKpi,
          validarDigitos,
          guardarKpis
        }
      }
  }

  </script>

