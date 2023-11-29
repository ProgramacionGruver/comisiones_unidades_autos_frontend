<template>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="modalMano">
        <q-card style="width: 40rem;">
            <q-card-section>
              <div class="text-h4 text-center">
                Agregar Costo Mano De Obra
                <q-separator color="primary" class="q-my-xs" />
              </div>
            </q-card-section>
          <q-form ref="formulario" @submit.prevent.stop="guardarMano">

            <q-card-section class="q-pt-none q-pb-xs">
              <q-select
                outlined
                use-input
                input-debounce="0"
                v-model="objetoEmpresa"
                :options="opcionesEmpresas"
                label="Seleccione la empresa"
                behavior="menu"
                @update:model-value="filtrarEmpresas"
                :rules="[val => !!val || 'Seleccione una empresa']"
              />
            </q-card-section>

            <q-card-section class="q-pt-none q-pb-lg">
              <q-select
                outlined
                use-input
                input-debounce="0"
                v-model="objetoSucursal"
                :options="opcionesSucursales"
                label="Seleccione la sucursal"
                behavior="menu"
              />
            </q-card-section>

            <q-card-section class="q-pt-none q-pb-xs">
              <q-select
                outlined
                use-input
                input-debounce="0"
                v-model="objetoTipo"
                :options="tipoMecanicoMB"
                label="Seleccione el puesto"
                behavior="menu"
                :rules="[val => !!val || 'Seleccione un puesto']"
              />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input v-model="manoObj.fechaInicio" filled type="date" hint="Fecha de inicio" :rules="[validarFechaInicio, validarCampoVacio]"/>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input v-model="manoObj.fechaFin" filled type="date" hint="Fecha de fin" :rules="[validarFechaFin, validarCampoVacio]"/>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <label>Costo</label>
              <q-input outlined v-model="manoObj.costo" label="Ingresa un costo" type="number"  step="any" :rules="validarPorcentajeConDecimales">
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </q-card-section>

          </q-form>

            <q-card-actions align="right">
              <q-btn
                flat
                label="Cerrar"
                color="red"
                @click="modalMano = false"
              />
              <q-btn
                flat
                label="Agregar"
                color="primary"
                @click="guardarMano"
              />
            </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </template>

<script>
import { ref } from 'vue'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { useEmpresasStore } from 'src/stores/catalogos/empresas'
import { useSucursalesStore } from 'src/stores/catalogos/sucursales'
import { useManoObraStore } from 'src/stores/ajustes/manoObra'
import { storeToRefs } from 'pinia'
import { validarTexto, validarCampo } from 'src/helpers/inputReglas'
import { validarPorcentajeConDecimales } from 'src/helpers/inputReglas'
import { tipoMecanicoMB } from 'src/constant/constantes'
import { filtrarElementos } from 'src/helpers/filtros'
import { formatearCapitalCase } from 'src/helpers/formatos'

export default {
  setup () {

    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const useEmpresas = useEmpresasStore()
    const { opcionesEmpresas } = storeToRefs(useEmpresas)

    const useSucursales = useSucursalesStore()
    const { opcionesSucursales, sucursales } = storeToRefs(useSucursales)


    const useManoObra= useManoObraStore()
    const { guardarManoObra } = useManoObra


    const formulario = ref(null)
    const modalMano = ref(false)
    const objetoEmpresa = ref(null)
    const objetoSucursal = ref(null)
    const objetoTipo = ref(null)
    const grupoEmpresas = ref(null)

    const gastoInit = {
      claveEmpresa: '',
      claveSucursal: '',
      tipoMecanico: '',
      costo: '',
      fechaInicio: '',
      fechaFin: '',
      usuario: ''
    }

    const manoObj = ref(gastoInit)

    const abrir = () => {
      objetoEmpresa.value = null
      objetoSucursal.value = null
      objetoTipo.value = null
      manoObj.value = { ...gastoInit }
      modalMano.value = true
    }

    const guardarMano = async () => {
      if (!await formulario.value.validate()) {
        return
      }
      manoObj.value.claveEmpresa = objetoEmpresa.value?.claveEmpresa
      manoObj.value.claveSucursal = objetoSucursal.value?.value?.abreviacion
      manoObj.value.tipoMecanico = objetoTipo.value?.data
      manoObj.value.usuario = usuarioAutenticado.value.usuario
      guardarManoObra(manoObj.value)
      modalMano.value = false
    }

    const validarFechaInicio = (val) => {
      const fechaInicio = new Date(val)
      const fechaFin = new Date(manoObj.value.fechaFin)
      if (fechaInicio > fechaFin) {
        return 'La fecha de inicio debe ser anterior a la fecha de fin.'
      }
      return true
    }

    const validarFechaFin = (val) => {
      const fechaInicio = new Date(manoObj.value.fechaInicio)
      const fechaFin = new Date(val)
      if (fechaInicio > fechaFin) {
        return 'La fecha de fin debe ser posterior a la fecha de inicio.'
      }
      return true
    }

    const validarCampoVacio = (val) => {
      return (val && val.length > 0) || 'Completa este campo para continuar.'
    }

    const filtrarEmpresas = async () => {
      grupoEmpresas.value = [objetoEmpresa.value.claveEmpresa]
      //TODAS LAS SUCURSALES PERTENECIENTES A LA EMPRESA
      opcionesSucursales.value = filtrarElementos(grupoEmpresas, sucursales, 'claveEmpresa').map((sucursal) => {
        sucursal.label = formatearCapitalCase(sucursal.nombreSucursal)
        sucursal.value = sucursal
        return sucursal
      })
    }


    return {
      abrir,
      modalMano,
      tipoMecanicoMB,

      opcionesEmpresas,
      objetoEmpresa,
      filtrarEmpresas,

      opcionesSucursales,
      objetoSucursal,

      manoObj,
      objetoTipo,
      guardarMano,

      formulario,
      validarTexto,
      validarCampo,
      validarPorcentajeConDecimales,
      validarFechaInicio,
      validarFechaFin,
      validarCampoVacio,
    }
  }
}
</script>

  <style>
  </style>
