<template>
  <q-layout>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <h2>Catalogo de Vendedores</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        color="primary"
        :columns="columns"
        :filter="buscar"
        :rows="vendedoresFiltrados"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
        :rows-per-page-label="'Registros por página'"
        :rows-per-page="15"
        :rows-per-page-options="[15, 30, 50, 100]"
      >
        <template v-slot:top>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
            "
          >
            <div
              style="
                width: 50%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                column-gap: 1rem;
              "
            >
              <!-- <q-btn
                color="primary"
                label="Agregar Asesor"
                @click="agregarAsesor"
                icon="add"
              /> -->
              <q-select
                v-model="nivelSeleccionado"
                :options="opcionesNivel"
                option-label="label"
                option-value="value"
                map-options
                label="Nivel"
                dense
                outlined
                @update:model-value="filtrarRows"
                style="width: 45%"
              />
            </div>
            <div>
              <q-input v-model="buscar" outlined placeholder="Buscar" dense>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>

        <template v-slot:body-cell-nivel="props">
          <td
            style="display: flex; justify-content: center; align-items: center"
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
              v-else-if="props.row.nivel === 'bronce'"
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
          </td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td>
            <div
              style="
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-btn
                color="primary"
                icon="edit"
                flat
                dense
                @click="editarVendedor(props.row)"
              >
                <q-tooltip> Cambiar nivel del vendedor </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <ModalNuevoVendedor ref="modalNuevoVendedor" />
    <ModalEditarNiivel ref="modalEditarNivel" />
  </q-layout>
</template>

<script>
import { storeToRefs } from "pinia";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { onMounted, ref } from "vue";
import ModalNuevoVendedor from "src/components/ModalNuevoVendedor.vue";
import ModalEditarNiivel from "src/components/ModalEditarNivel.vue";

export default {
  components: {
    ModalNuevoVendedor,
    ModalEditarNiivel,
  },
  setup() {
    const useFacturas = useFacturasStore();
    const { vendedores } = storeToRefs(useFacturas);

    const columns = [
      {
        name: "idAsesor",
        label: "#",
        align: "center",
        field: "idAsesor",
        sortable: true,
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
        name: "correo",
        label: "Correo",
        align: "center",
        field: "correo",
      },
      {
        name: "nivel",
        label: "Nivel",
        align: "center",
      },
      {
        name: "acciones",
        label: "Acciones",
        align: "center",
      },
    ];

    const opcionesNivel = [
      {
        label: "ORO",
        value: "oro",
      },
      {
        label: "PLATA",
        value: "plata",
      },
      {
        label: "BRONCE",
        value: "bronce",
      },
      {
        label: "ASESOR",
        value: "asesor",
      },
      {
        label: "TODOS",
        value: "",
      },
    ];
    const nivelSeleccionado = ref({ label: "TODOS", value: "" });

    const buscar = ref("");
    const vendedoresFiltrados = ref([]);

    const modalEditarNivel = ref(null);
    const modalNuevoVendedor = ref(null);

    const filtrarRows = () => {
      vendedoresFiltrados.value = vendedores.value;

      if (
        nivelSeleccionado.value &&
        nivelSeleccionado.value.label !== "TODOS"
      ) {
        vendedoresFiltrados.value = vendedoresFiltrados.value.filter(
          (vendedor) => vendedor.nivel === nivelSeleccionado.value
        );
      } else {
        vendedoresFiltrados.value = vendedores.value;
      }
    };

    onMounted(() => {
      filtrarRows();
    });

    const editarVendedor = (vendedor) => {
      modalEditarNivel.value.abrir(vendedor);
    };

    const agregarAsesor = () => {
      modalNuevoVendedor.value.abrir();
    };

    return {
      // States / Variables
      columns,
      vendedores,
      buscar,
      opcionesNivel,
      nivelSeleccionado,
      vendedoresFiltrados,
      modalEditarNivel,
      modalNuevoVendedor,
      // Methods
      filtrarRows,
      editarVendedor,
      agregarAsesor,
    };
  },
};
</script>
