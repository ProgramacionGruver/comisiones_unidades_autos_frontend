<template>
  <q-layout>
    <div class="q-pa-md">
      <div div class="q-pa-md">
        <h2>Panel de KPIS</h2>
      </div>
      <q-separator color="primary" class="q-my-md"/>
      <q-table
        color="primary"
        :columns="columns"
        :filter="buscar"
        :rows="pvas"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
      >

      <template v-slot:top>
        <div class="fit row q-gutter-sm q-mb-sm justify-end">
          <q-btn
            dense
            color="primary"
            icon-right="playlist_add"
            label="Nuevo KPI"
            no-caps
            @click="nuevoPva"
          />
          <div class="col">
            <q-input
              outlined
              dense
              v-model="buscar"
              placeholder="Buscar"
            >
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>
        </div>
        <div class="fit row q-gutter-sm">
          <q-btn-dropdown  dense outline  class="col q-ma-sm" color="grey" label="Empresas">
            <q-separator class="q-mx-md bg-gray"></q-separator>
            <q-option-group  class="q-pa-md" dense
            :options="opcionesEmpresas"
            v-model="empresaSeleccionada"
            type="radio"
            @update:model-value="filtrarEmpresas"
          />
          </q-btn-dropdown>
            <q-btn-dropdown dense outline  class="col q-ma-sm " color="grey" label="Sucursales">
              <q-separator class="q-mx-sm bg-gray"></q-separator>

              <q-option-group  class="q-pa-md" dense
              :options="opcionesSucursales"
              v-model="sucursalSeleccionada"
              type="radio"
              @update:model-value="filtrarFacturas"

            />
            </q-btn-dropdown>
        </div>
        </template>
      </q-table>
    </div>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useEmpresasStore } from 'src/stores/catalogos/empresas'
import { useSucursalesStore } from 'src/stores/catalogos/sucursales'
import { formatearCapitalCase } from 'src/helpers/formatos'


export default {
  components: {
  },
  setup () {

    const useEmpresas = useEmpresasStore()
    const { obtenerEmpresas } = useEmpresas
    const { empresas, empresaSeleccionada } = storeToRefs(useEmpresas)

    const useSucursales = useSucursalesStore()
    const { obtenerSucursales } = useSucursales
    const { sucursales, sucursalSeleccionada } = storeToRefs(useSucursales)


    const columns = [
      {
        name: 'nombreKpi',
        label: 'Nombre Objetivo',
        field: 'nombreKpi',
        align: 'left',
        sortable: true
      },
      {
        name: 'nivel',
        label: 'Nivel',
        field: 'nivel',
        align: 'left',
        sortable: true
      },
      {
        name: 'claveSucursal',
        label: 'Sucursal',
        field: 'claveSucursal',
        align: 'left',
        sortable: true
      },
      {
        name: 'porcentajeub',
        label: 'Porcentaje U.B.',
        feld: 'porcentajeub',
        align: 'left',
        sortable: true
      },
      {
        name: 'objetivo',
        label: 'Objetivo',
        field: 'objetivo',
        align: 'left',
        sortable: true
      },
      {
        name: 'objetivoCumplimiento',
        label: 'Objetivo Cumplimiento',
        field: 'objetivoCumplimiento',
        align: 'left',
        sortable: true
      },
      {
        name: 'peso',
        label: 'Peso',
        field: 'peso',
        align: 'left',
        sortable: true
      }
    ]

    const opcionesEmpresas = ref([])
    const opcionesSucursales = ref([])
    const grupoEmpresas = ref([])


    onMounted(async () => {
      await obtenerEmpresas()
      await obtenerSucursales()

      opcionesEmpresas.value = empresas.value.map((empresa) => {
        empresa.label = formatearCapitalCase(empresa.razonSocial)
        empresa.value = empresa
        return empresa
      })

      opcionesSucursales.value = sucursales.value.map((sucursal) => {
        sucursal.label = formatearCapitalCase(sucursal.nombreSucursal)
        sucursal.value = sucursal
        return sucursal
      })

      //Declaro la primera empresa, sucursal y departamento
      empresaSeleccionada.value = opcionesEmpresas.value[0]
      sucursalSeleccionada.value = opcionesSucursales.value[0]
      grupoEmpresas.value = [empresaSeleccionada.value.claveEmpresa]

      await filtrarEmpresas()

    //Filtro por sucursal
      comisionesFiltradas.value = comisionesUnidades.value.filter(comision => comision.id_plaza === sucursalSeleccionada.value.idErp)

    })

    const filtrarEmpresas = async () => {
      grupoEmpresas.value = [empresaSeleccionada.value.claveEmpresa]
      //TODAS LAS SUCURSALES PERTENECIENTES A LA EMPRESA
      opcionesSucursales.value = filtrarElementos(grupoEmpresas, sucursales, 'claveEmpresa').map((sucursal) => {
        sucursal.label = formatearCapitalCase(sucursal.nombreSucursal)
        sucursal.value = sucursal
        return sucursal
      })
      }

      const filtrarFacturas = async () => {
          comisionesFiltradas.value = comisionesUnidades.value.filter(factura => factura.id_plaza === sucursalSeleccionada.value.idErp)
      }

    return {
      columns,
      opcionesEmpresas,
      opcionesSucursales,
      empresaSeleccionada,
      sucursalSeleccionada,
      }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 100rem
</style>
