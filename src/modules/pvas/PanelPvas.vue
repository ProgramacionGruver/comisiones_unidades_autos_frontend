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
        v-model:selected="pvaSeleccionado"
        selection="single"
        row-key="idPva"
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
                :options="departamentos"
                v-model="departamentoSeleccionado"
                @update:model-value="filtrarPvas"
                map-options
                option-value="name"
              />
            </div>
            <!-- <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                v-model="quincenaSeleccionada"
                :options="listaQuincenas"
                option-label="descripcion"
                @update:model-value="filtrarPvas"
              >
              </q-select>
            </div> -->
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
      <div v-if="pvaSeleccionado.length > 0">
        <div
          style="
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-bottom: 2rem;
          "
        >
          <h3>Detalles del contrato</h3>
          <div
            style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              column-gap: 16rem;
              row-gap: 1rem;
            "
          >
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">Cliente:</label>
              <span>{{ pvaSeleccionado[0].cliente }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">No. Contrato:</label>
              <span>{{ pvaSeleccionado[0].no_contrato }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">Plan Integral:</label>
              <span>{{ pvaSeleccionado[0].plan_integral }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">Fecha de Compra:</label>
              <span>{{ formatearFecha(pvaSeleccionado[0].fecha_compra) }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">Monto:</label>
              <span>{{
                formatearMonto(pvaSeleccionado[0].utilidad_completa)
              }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">Garantia:</label>
              <span>{{ pvaSeleccionado[0].garantia }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">Monto financiado:</label>
              <span>{{ formatearMonto(pvaSeleccionado[0].utilidad) }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">On Star / GAP:</label>
              <span>{{ pvaSeleccionado[0].on_star_gap }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">Aseguradora:</label>
              <span>{{ pvaSeleccionado[0].aseguradora }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">Vendedor:</label>
              <span>{{ pvaSeleccionado[0].nombreEmpleado }}</span>
            </div>
            <div style="display: flex; flex-direction: column">
              <label class="text-bold">F&I:</label>
              <span>{{ pvaSeleccionado[0].fi }}</span>
            </div>
          </div>
        </div>
      </div>
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
import { formatearFecha } from "src/helpers/formatearFecha";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";

export default {
  components: {
    ModalSubirPva,
  },
  setup() {
    const useFacturas = useFacturasStore();
    const { obtenerVendedoresYJefes } = useFacturas;
    const { anioSeleccionado, mesSeleccionado, quincenaSeleccionada } =
      storeToRefs(useFacturas);

    const usePva = usePvaStore();
    const { obtenerPvas } = usePva;
    const { pvas } = storeToRefs(usePva);

    const pvaSeleccionado = ref([]);

    const useDepartamentos = useDepartamentosStore();
    const { departamentos, departamentoSeleccionado } =
      storeToRefs(useDepartamentos);

    const columns = [
      {
        name: "idPva",
        label: "#",
        field: "idPva",
        align: "center",
      },
      {
        name: "numeroEmpleado",
        label: "No. Empleado",
        field: "numeroEmpleado",
        align: "center",
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
      departamentoSeleccionado.value = departamentos.value[0];

      await obtenerVendedoresYJefes();
      await filtrarPvas();
    });

    const filtrarPvas = async () => {
      // objPvaInit.value.quincena = obtenerNumeroQuincena(
      //   quincenaSeleccionada.value
      // );
      objPvaInit.value.mes = obtenerNumerosDeMes(mesSeleccionado.value);
      objPvaInit.value.anio = anioSeleccionado.value;
      objPvaInit.value.departamento =
        departamentoSeleccionado.value.value.claveDepartamento;

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
          name: "utilidad_completa",
          label: "Monto",
        },
        {
          name: "utilidad",
          label: "Monto financiado",
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
      pvaSeleccionado,

      formatearFecha,

      departamentos,
      departamentoSeleccionado,
      formatearMonto,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 100rem
</style>
