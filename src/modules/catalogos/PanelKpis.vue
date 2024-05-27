<template>
  <q-layout>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <h2>Catalogo de KPIS</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        color="primary"
        :columns="columns"
        :filter="buscar"
        :rows="objetivosKpis"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
      >
        <template v-slot:body-cell-acciones="props">
          <td>
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              @click="editarObjetivo(props.row)"
            >
              <q-tooltip>Editar Requisicion</q-tooltip>
            </q-btn>
          </td>
        </template>
        <template v-slot:top>
          <div class="fit row q-gutter-sm q-mb-sm justify-end">
            <q-btn
              dense
              color="primary"
              icon-right="playlist_add"
              label="Nuevo Objetivo"
              no-caps
              @click="nuevoObjetivo()"
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
            <q-btn-dropdown
              dense
              outline
              class="col q-ma-sm"
              color="grey"
              label="Empresas"
            >
              <q-separator class="q-mx-md bg-gray"></q-separator>
              <q-option-group
                class="q-pa-md"
                dense
                :options="opcionesEmpresas"
                v-model="empresaSeleccionada"
                type="radio"
                @update:model-value="filtrarEmpresas"
              />
            </q-btn-dropdown>
            <q-btn-dropdown
              dense
              outline
              class="col q-ma-sm"
              color="grey"
              label="Sucursales"
            >
              <q-separator class="q-mx-sm bg-gray"></q-separator>

              <q-option-group
                class="q-pa-md"
                dense
                :options="opcionesSucursales"
                v-model="sucursalSeleccionada"
                type="radio"
                @update:model-value="filtrarFacturas"
              />
            </q-btn-dropdown>
            <q-select
              outlined
              dense
              class="col q-ma-sm"
              :options="opcionesNivel"
              v-model="nivelSeleccionado"
              @update:model-value="filtrarFacturas"
              label="Nivel"
            />
          </div>
        </template>
      </q-table>
    </div>
    <modal-objetivo-kpis ref="modalObjetivoKpis"></modal-objetivo-kpis>
    <modal-editar-objetivo ref="modalEditarObjetivo"></modal-editar-objetivo>
  </q-layout>
</template>

<script>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useEmpresasStore } from "src/stores/catalogos/empresas";
import { useSucursalesStore } from "src/stores/catalogos/sucursales";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { formatearCapitalCase } from "src/helpers/formatos";
import { filtrarElementos } from "src/helpers/filtros";
import ModalObjetivoKpis from "src/components/ModalObjetivoKpis.vue";
import ModalEditarObjetivo from "src/components/ModalEditarObjetivo.vue";

export default {
  components: {
    ModalObjetivoKpis,
    ModalEditarObjetivo,
  },
  setup() {
    const useEmpresas = useEmpresasStore();
    const { obtenerEmpresas } = useEmpresas;
    const { empresas, empresaSeleccionada } = storeToRefs(useEmpresas);

    const useSucursales = useSucursalesStore();
    const { obtenerSucursales } = useSucursales;
    const { sucursales, sucursalSeleccionada } = storeToRefs(useSucursales);

    const useKpi = useKpiStore();
    const { obtenerObjetivosKpis } = useKpi;
    const { objetivosKpis } = storeToRefs(useKpi);

    const columns = [
      {
        name: "nombreKpi",
        label: "Nombre Objetivo",
        field: "nombreKpi",
        align: "left",
        sortable: true,
      },
      {
        name: "nivel",
        label: "Nivel",
        field: (row) => row.nivel.toUpperCase(),
        align: "left",
        sortable: true,
      },
      {
        name: "claveSucursal",
        label: "Sucursal",
        field: "claveSucursal",
        align: "left",
        sortable: true,
      },
      {
        name: "peso",
        label: "Peso",
        field: "peso",
        align: "left",
        sortable: true,
      },
      {
        name: "objetivo",
        label: "Objetivo",
        field: "objetivo",
        align: "left",
        sortable: true,
      },
      {
        name: "objetivoCumplimiento",
        label: "Objetivo Cumplimiento",
        field: "objetivoCumplimiento",
        align: "left",
        sortable: true,
      },
      {
        name: "acciones",
        align: "left",
        sortable: true,
      },
    ];

    const opcionesNivel = ["TODOS", "ASESOR", "BRONCE", "PLATA", "ORO"];
    const nivelSeleccionado = ref("");

    const opcionesEmpresas = ref([]);
    const opcionesSucursales = ref([]);
    const grupoEmpresas = ref([]);
    const modalObjetivoKpis = ref(null);
    const modalEditarObjetivo = ref(null);

    onMounted(async () => {
      await obtenerEmpresas();
      await obtenerSucursales();

      opcionesEmpresas.value = empresas.value.map((empresa) => {
        empresa.label = formatearCapitalCase(empresa.razonSocial);
        empresa.value = empresa;
        return empresa;
      });

      opcionesSucursales.value = sucursales.value.map((sucursal) => {
        return {
          label: `${sucursal.nombreSucursal}`,
          value: { ...sucursal },
        };
      });

      //Declaro la primera empresa, sucursal y departamento
      empresaSeleccionada.value = opcionesEmpresas.value[0];
      sucursalSeleccionada.value = opcionesSucursales.value[0].value;
      grupoEmpresas.value = [empresaSeleccionada.value.claveEmpresa];
      nivelSeleccionado.value = opcionesNivel[0];

      await filtrarEmpresas();
    });

    const filtrarEmpresas = async () => {
      await obtenerObjetivosKpis(
        {
          claveSucursal: sucursalSeleccionada.value.abreviacion,
        },
        nivelSeleccionado.value
      );
      grupoEmpresas.value = [empresaSeleccionada.value.claveEmpresa];
      //TODAS LAS SUCURSALES PERTENECIENTES A LA EMPRESA
      opcionesSucursales.value = filtrarElementos(
        grupoEmpresas,
        sucursales,
        "claveEmpresa"
      ).map((sucursal) => {
        return {
          label: `${sucursal.nombreSucursal}`,
          value: { ...sucursal },
        };
      });
      sucursalSeleccionada.value = opcionesSucursales.value[0].value;
    };

    const filtrarFacturas = async () => {
      await obtenerObjetivosKpis(
        {
          claveSucursal: sucursalSeleccionada.value.abreviacion,
        },
        nivelSeleccionado.value
      );
    };

    const nuevoObjetivo = async () => {
      modalObjetivoKpis.value.abrir();
    };

    const editarObjetivo = async (objetivo) => {
      modalEditarObjetivo.value.abrir(objetivo);
    };

    return {
      buscar: ref(""),
      columns,
      objetivosKpis,
      opcionesEmpresas,
      opcionesSucursales,
      empresaSeleccionada,
      sucursalSeleccionada,
      modalObjetivoKpis,
      modalEditarObjetivo,
      opcionesNivel,
      nivelSeleccionado,
      filtrarFacturas,
      nuevoObjetivo,
      editarObjetivo,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 100rem
</style>
