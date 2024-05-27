<template>
  <q-layout>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <h2>Panel de PVAS</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
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
              label="Cargar PVAS"
              no-caps
              @click="nuevoPva"
            />
            <div class="col">
              <q-input outlined dense v-model="buscar" placeholder="Buscar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
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
                @update:model-value="filtrarPvas"
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
                @update:model-value="filtrarPvas"
              />
            </div>
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                v-model="quincenaSeleccionada"
                :options="listaQuincenas"
                option-label="descripcion"
                @update:model-value="filtrarPvas"
              >
              </q-select>
            </div>
            <div>
              <q-btn
                color="green"
                label="Exportar Excel"
                icon="get_app"
                @click="exportarExcel(pvas)"
              />
            </div>
          </div>
        </template>
      </q-table>
      <modal-subir-pva ref="modalSubirPva"></modal-subir-pva>
    </div>
  </q-layout>
</template>

<script>
import { ref, onMounted } from "vue";
import { listaMeses, listaAnios, listaQuincenas } from "src/helpers/listas";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { formatearMonto } from "src/helpers/formatos";
import { storeToRefs } from "pinia";
import ModalSubirPva from "src/components/ModalSubirPva.vue";
import { usePvaStore } from "src/stores/catalogos/pvas";
import {
  obtenerNumeroQuincena,
  obtenerNumerosDeMes,
} from "src/constant/constantes";
import { tipoPva } from "src/constant/constantes";
import { convertirTablaCSV } from "src/helpers/generarCSV";

export default {
  components: {
    ModalSubirPva,
  },
  setup() {
    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado, quincenaSeleccionada } =
      storeToRefs(useFacturas);

    const usePva = usePvaStore();
    const { obtenerPvas } = usePva;
    const { pvas } = storeToRefs(usePva);

    const columns = [
      {
        name: "numeroEmpleado",
        label: "ID",
        field: "numeroEmpleado",
        align: "left",
        sortable: true,
      },
      {
        name: "nombreEmpleado",
        label: "Nombre",
        field: "nombreEmpleado",
        align: "left",
        sortable: true,
      },
      {
        name: "utilidad",
        label: "Utilidad",
        field: (row) =>
          row.utilidad ? formatearMonto(row.utilidad) : formatearMonto(0),
        align: "left",
        sortable: true,
      },
      {
        name: "pva",
        label: "PVA",
        field: (row) => {
          const tipo = tipoPva.find((tipo) => tipo.value === row.pva);
          return tipo ? tipo.label : row.pva;
        },
        align: "left",
        sortable: true,
      },
      {
        name: "cliente",
        label: "Cliente",
        field: "cliente",
        align: "left",
        sortable: true,
      },
      {
        name: "fi",
        label: "F&I",
        field: "fi",
        align: "left",
        sortable: true,
      },
    ];

    const modalSubirPva = ref(null);

    const objPvaInit = ref({
      quincena: obtenerNumeroQuincena(quincenaSeleccionada.value),
      mes: obtenerNumerosDeMes(mesSeleccionado.value),
      anio: anioSeleccionado.value,
    });

    onMounted(async () => {
      await obtenerPvas(objPvaInit.value);
    });

    const filtrarPvas = async () => {
      objPvaInit.value.quincena = obtenerNumeroQuincena(
        quincenaSeleccionada.value
      );
      objPvaInit.value.mes = obtenerNumerosDeMes(mesSeleccionado.value);
      objPvaInit.value.anio = anioSeleccionado.value;
      await obtenerPvas(objPvaInit.value);
    };

    const nuevoPva = async () => {
      modalSubirPva.value.abrir();
    };

    const exportarExcel = (pvasArray) => {
      const columnas = [
        {
          name: "cliente",
          label: "Cliente",
        },
        {
          name: "no_contrato",
          label: "No. Contrato",
        },
        {
          name: "plan_integral",
          label: "Plan Integral",
        },
        {
          name: "fecha_compra",
          label: "Fecha de Compra",
        },
        {
          name: "utilidad",
          label: "Monto",
        },
        {
          name: "garantia",
          label: "Garantia",
        },
        {
          name: "on_star_gap",
          label: "On Star / GAP",
        },
        {
          name: "aseguradora",
          label: "Aseguradora",
        },
        {
          name: "nombreEmpleado",
          label: "Vendedor",
        },
        {
          name: "fi",
          label: "Sucursal",
        },
      ];
      const fecha = `${anioSeleccionado.value}_${mesSeleccionado.value}_${quincenaSeleccionada.value}`;

      convertirTablaCSV(columnas, pvasArray, `PVA_${fecha}`);
    };

    return {
      columns,
      buscar: ref(""),

      listaAnios,
      listaMeses,
      listaQuincenas,
      anioSeleccionado,
      mesSeleccionado,
      quincenaSeleccionada,

      pvas,

      modalSubirPva,
      nuevoPva,
      filtrarPvas,
      exportarExcel,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 100rem
</style>
