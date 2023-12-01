<template>
  <q-layout>
    <div class="q-pa-md">
      <div div class="q-pa-md">
        <h2>Panel de PVAS</h2>
      </div>
      <q-separator color="primary" class="q-my-md"/>
      <q-table
        color="primary"
        :columns="columns"
        :filter="buscar"
        :rows="[]"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
        selection="single"
      >
      <template v-slot:top>
        <div class="fit row q-gutter-sm q-mb-sm justify-end">
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
          <q-btn
          dense
          color="primary"
          icon-right="map"
          label="Cargar PVAS"
          @click="nuevoPva"
          no-caps
          />
        </div>
        <div class="fit row q-gutter-sm">
          <q-btn-dropdown  dense outline  class="col q-ma-sm" color="grey" label="Empresas">
            <q-separator class="q-mx-md bg-gray"></q-separator>
            <q-option-group  class="q-pa-md" dense
            :options="[]"
            type="radio"
          />
          </q-btn-dropdown>
            <q-btn-dropdown dense outline  class="col q-ma-sm " color="grey" label="Sucursales">
              <q-separator class="q-mx-sm bg-gray"></q-separator>

              <q-option-group  class="q-pa-md" dense
              :options="[]"
              type="radio"

            />
            </q-btn-dropdown>
        </div>
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
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                v-model="quincenaSeleccionada"
                :options="listaQuincenas"
                option-label="descripcion"
              >
              </q-select>
            </div>
         </div>
        </template>
      </q-table>
      <modal-subir-pva ref="modalSubirPva"></modal-subir-pva>
    </div>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { listaMeses, listaAnios, listaQuincenas} from 'src/helpers/listas'
import { useFacturasStore } from 'src/stores/catalogos/facturas'
import { storeToRefs } from 'pinia'
import ModalSubirPva from 'src/components/ModalSubirPva.vue'

export default {
  components: {
    ModalSubirPva
  },
  setup () {

    const useFacturas = useFacturasStore()
    const {anioSeleccionado, mesSeleccionado, quincenaSeleccionada} = storeToRefs(useFacturas)

    const columns = [
      {
        name: 'numeroEmpleado',
        label: 'ID',
        field: 'numeroEmpleado',
        align: 'left',
        sortable: true
      },
      {
        name: 'nombreEmpleado',
        label: 'Nombre',
        field: 'nombreEmpleado',
        align: 'left',
        sortable: true
      },
      {
        name: 'utilidad',
        label: 'Utilidad',
        field: 'utilidad',
        align: 'left',
        sortable: true
      },
      {
        name: 'pva',
        label: 'PVA',
        field: 'pva',
        align: 'left',
        sortable: true
      },
      {
        name: 'vendedor',
        label: 'Vendedor',
        field: 'vendedor',
        align: 'left',
        sortable: true
      },
      {
        name: 'fi',
        label: 'F&I',
        field: 'fi',
        align: 'left',
        sortable: true
      }
    ]

    const modalSubirPva = ref(null)

    onMounted(async () => {

    })

    const nuevoPva = async() => {
      modalSubirPva.value.abrir()
    }

    return {
      columns,

      listaAnios,
      listaMeses,
      listaQuincenas,
      anioSeleccionado,
      mesSeleccionado,
      quincenaSeleccionada,

      modalSubirPva,
      nuevoPva,
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 100rem
</style>
