<template>
    <q-dialog v-model="modalPva" style="max-width: 200px, color: blue">
      <q-card style="max-width: 200px, color: blue">
        <q-card-section class="bg-primary text-white row items-center q-pb-none">
          <h2 class="text-h4">Subir PVAS</h2>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="formulario" >
            <div class="q-my-xs">
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
                <label>Selecciona el asesor.</label>
              </div>
              <div class="row justify-around" style="width: 40rem;">
                <q-select class="col-12 q-mx-xs"
                  outlined
                  dense
                  clearable
                  use-input
                  input-debounce="0"
                  label="Asesor"
                  v-model="vendedorSeleccionado"
                  @filter="parametrosFiltradosVendedores"
                  :options="opcionesEmpleados"
                  :rules="[val => !!val || 'Se requiere llenar este campo']"
                />
              </div>
              <div class="q-pt-md q-pb-xs">
                <label>Selecciona el cliente.</label>
              </div>
              <div class="row justify-around" style="width: 40rem;">
                <q-select class="col-12 q-mx-xs"
                  outlined
                  dense
                  clearable
                  use-input
                  input-debounce="0"
                  label="Cliente"
                  v-model="clienteSeleccionado"
                  @filter="parametrosFiltradosClientes"
                  :options="opcionesCliente"
                  :rules="[val => !!val || 'Se requiere llenar este campo']"
                />
              </div>
              <div class="q-my-md">
                <label>Selecciona el tipo de pva y la utilidad. </label>
              </div>
              <div class="row justify-around">
                <q-select
                  style="min-width: 18rem;"
                  label="Tipo PVA"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  outlined
                  dense
                  :options="tipoPva"
                  v-model="objPva.pva"
                  :rules="[val => !!val || 'Se requiere llenar este campo']"
                />
                <q-input style="max-width: 20rem;" dense filled label="Monto" type="number" color="primary" v-model="objPva.utilidad" :rules="validarDigitos" >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
              </div>
              <q-card-actions class="q-pt-md" align="right">
                <q-btn
                icon-right="save"
                label="Guardar"
                color="primary"
                :loading="cargando"
                @click="guardarPvas()"
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
  import { meses, anios, mes, tipoPva, obtenerNumeroQuincena, obtenerNumerosDeMes } from 'src/constant/constantes'
  import { useSucursalesStore } from 'src/stores/catalogos/sucursales'
  import { useFacturasStore } from 'src/stores/catalogos/facturas'
  import { filtradoBusquedaObj } from 'src/helpers/filtradoBusquedaObj'
  import { useAutenticacionStore } from 'src/stores/autenticaciones'
  import { usePvaStore } from 'src/stores/catalogos/pvas'
  import { validarDigitos } from 'src/helpers/inputReglas'

  export default {
      setup () {
        const useAutenticacion = useAutenticacionStore()
        const { usuarioAutenticado } = storeToRefs(useAutenticacion)

        const useFacturas = useFacturasStore()
        const { mesSeleccionado, anioSeleccionado, quincenaSeleccionada, opcionesClientes, opcionesVendedores } = storeToRefs(useFacturas)

        const useSucursales = useSucursalesStore()
        const {sucursales ,sucursalSeleccionada } = storeToRefs(useSucursales)

        const usePva = usePvaStore()
        const {guardarPva} = usePva

        const modalPva = ref(false)
        const formulario = ref(null)
        const opcionesSucursales = ref([])

        const opcionesEmpleados = ref(opcionesVendedores.value)
        const opcionesCliente= ref(opcionesClientes.value)

        const vendedorSeleccionado = ref(null)
        const clienteSeleccionado = ref(null)

        const objPvaInit = {
          numeroEmpleado: '',
          nombreEmpleado: '',
          utilidad: '',
          pva: '',
          cliente: '',
          fi: '',
          usuario: '',
          quincena: '',
          mes: '',
          anio: '',
        }

        const objPva = ref({...objPvaInit})

        const abrir = async() => {
          opcionesSucursales.value = sucursales.value.map((sucursal) => {
              return {
                label: `${sucursal.nombreSucursal}`,
                value: { ...sucursal },
              }
            })
          sucursalSeleccionada.value = opcionesSucursales.value[0]
          objPva.value = {...objPvaInit}
          vendedorSeleccionado.value = null
          clienteSeleccionado.value = null
          modalPva.value = true
        }

        const parametrosFiltradosVendedores = (val, update) => {
             filtradoBusquedaObj(val, update, opcionesVendedores.value, opcionesEmpleados)
        }

        const parametrosFiltradosClientes = (val, update) => {
             filtradoBusquedaObj(val, update, opcionesClientes.value, opcionesCliente)
        }

        const guardarPvas = async() => {
          if (!await formulario.value.validate()) {
                return;
            }
          objPva.value.nombreEmpleado = vendedorSeleccionado.value.value.nombre
          objPva.value.numeroEmpleado = vendedorSeleccionado.value.value.id_vendedor
          objPva.value.cliente = clienteSeleccionado.value.value.cliente
          objPva.value.fi = sucursalSeleccionada.value.value.abreviacion
          objPva.value.usuario = usuarioAutenticado.value.usuario
          objPva.value.quincena = obtenerNumeroQuincena(quincenaSeleccionada.value)
          objPva.value.mes = obtenerNumerosDeMes(mesSeleccionado.value)
          objPva.value.anio = anioSeleccionado.value
          await guardarPva(objPva.value)
        }

        return {
          abrir,
          modalPva,
          mesSeleccionado,
          anioSeleccionado,
          anios,
          meses,
          mes,
          sucursalSeleccionada,
          listaQuincenas,
          quincenaSeleccionada,
          opcionesSucursales,
          opcionesClientes,
          opcionesCliente,
          opcionesVendedores,
          opcionesEmpleados,
          vendedorSeleccionado,
          clienteSeleccionado,
          objPvaInit,
          objPva,
          tipoPva,
          formulario,
          parametrosFiltradosVendedores,
          parametrosFiltradosClientes,
          guardarPvas,
          validarDigitos
        }
      }
  }

  </script>

