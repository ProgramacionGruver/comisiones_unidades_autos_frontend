<template>
  <q-layout>
    <div class="q-ma-md">
      <div class="q-pa-md">
        <h2>Añadir valor de objetivo real</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        color="primary"
        :columns="columns"
        :filter="buscar"
        :rows="valoresRealesKpis"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
      >
        <template v-slot:top>
          <div class="fit row q-gutter-sm q-mb-sm justify-end">
            <q-btn
              dense
              color="primary"
              icon-right="playlist_add"
              label="Registrar valores"
              no-caps
              @click="nuevoValorKpi"
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
                @update:model-value="filtrarKpis"
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
                @update:model-value="filtrarKpis"
              />
            </div>
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                :options="departamentos"
                v-model="departamentoSeleccionado"
                @update:model-value="filtrarKpis"
                map-options
                option-value="name"
              />
            </div>
          </div>
        </template>

        <template v-slot:body-cell-nivel="props">
          <q-td>
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-chip
                v-if="props.row.nivel === 'oro'"
                label="ORO"
                color="orange"
                text-color="white"
                class="text-bold"
              />
              <q-chip
                v-else-if="props.row.nivel === 'plata'"
                label="PLATA"
                color="grey"
                text-color="white"
                class="text-bold"
              />
              <q-chip
                v-if="props.row.nivel === 'bronce'"
                label="BRONCE"
                color="brown"
                text-color="white"
                class="text-bold"
              />
              <q-chip
                v-else-if="props.row.nivel === 'asesor'"
                label="ASESOR"
                color="green"
                text-color="white"
                class="text-bold"
              />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td>
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-btn
                color="primary"
                dense
                icon="edit"
                flat
                @click="editarValorKpi(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <ModalValoresKpis ref="modalValoresKpis" />
  </q-layout>
</template>

<script>
import { useKpiStore } from "src/stores/catalogos/kpis";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { listaMeses, listaAnios, listaQuincenas } from "src/helpers/listas";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import {
  obtenerNumeroQuincena,
  obtenerNumerosDeMes,
} from "src/constant/constantes";
import ModalValoresKpis from "./../../components/ModalValoresKpis.vue";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";

export default {
  components: {
    ModalValoresKpis,
  },
  setup() {
    const useKpis = useKpiStore();
    const { obtenerValoresRealesKpis } = useKpis;
    const { valoresRealesKpis } = storeToRefs(useKpis);

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const useDepartamentos = useDepartamentosStore();
    const { departamentos, departamentoSeleccionado } =
      storeToRefs(useDepartamentos);

    const columns = [
      {
        name: "idAsesor",
        label: "#",
        align: "center",
        field: "idAsesor",
      },
      {
        name: "numeroEmpleado",
        label: "Número de Empleado",
        align: "center",
        field: "numeroEmpleado",
      },
      {
        name: "nombreEmpleado",
        label: "Nombre",
        align: "left",
        field: "nombreEmpleado",
      },
      {
        name: "nivel",
        label: "Nivel",
        align: "center",
      },
      // {
      //   name: "acciones",
      //   label: "Acciones",
      //   align: "center",
      // },
    ];

    const objKpis = ref({
      mes: obtenerNumerosDeMes(mesSeleccionado.value),
      anio: anioSeleccionado.value,
    });

    const modalValoresKpis = ref(null);

    onMounted(async () => {
      departamentoSeleccionado.value = departamentos.value[0];

      await filtrarKpis();
    });

    const filtrarKpis = async () => {
      objKpis.value.mes = obtenerNumerosDeMes(mesSeleccionado.value);
      objKpis.value.anio = anioSeleccionado.value;
      objKpis.value.claveDepartamento =
        departamentoSeleccionado.value?.value?.claveDepartamento;

      await obtenerValoresRealesKpis(objKpis.value);
    };

    const nuevoValorKpi = () => {
      modalValoresKpis.value.abrir();
    };

    const editarValorKpi = (row) => {
      console.log("Editar valor KPI", row);
    };

    return {
      // States
      valoresRealesKpis,
      buscar: ref(""),
      listaAnios,
      listaMeses,
      listaQuincenas,
      anioSeleccionado,
      mesSeleccionado,
      columns,
      modalValoresKpis,
      departamentos,
      departamentoSeleccionado,
      // Methods
      filtrarKpis,
      nuevoValorKpi,
      editarValorKpi,
    };
  },
};
</script>
