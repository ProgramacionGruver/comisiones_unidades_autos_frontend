<template>
  <q-layout>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <h2>Previas</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        :columns="columns"
        :rows="previas"
        row-key="idPrevia"
        :filter="buscar"
        table-header-class="bg-primary text-white"
        :pagination="pagination"
      >
        <template v-slot:top>
          <div class="fit row q-gutter-md">
            <q-btn
              color="primary"
              label="Registrar Previa"
              @click="registrarPrevia"
              icon="add"
              class="col-auto"
            />
            <q-input
              v-model="buscar"
              debounce="300"
              placeholder="Buscar"
              dense
              outlined
              class="col"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td key="acciones" :props="props">
            <q-btn
              color="primary"
              round
              flat
              @click="editarPrevia(props.row)"
              icon="edit"
              dense
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <ModalPrevias ref="modalPrevias" />
  </q-layout>
</template>

<script>
import { storeToRefs } from "pinia";
import { usePreviasStore } from "src/stores/previas";
import { onMounted, ref } from "vue";
import ModalPrevias from "src/components/ModalPrevias.vue";

export default {
  components: {
    ModalPrevias,
  },
  setup() {
    const usePrevias = usePreviasStore();
    const { previas } = storeToRefs(usePrevias);
    const { obtenerCatalogoPrevias } = usePrevias;

    const columns = [
      {
        name: "idPrevia",
        label: "#",
        align: "center",
        field: "idPrevia",
      },
      {
        name: "modelo",
        label: "Modelo",
        align: "center",
        field: "modelo",
      },
      {
        name: "anio",
        label: "Año",
        align: "center",
        field: "anio",
      },
      {
        name: "monto",
        label: "Monto",
        align: "center",
        field: (row) =>
          row.monto.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
          }),
      },
      {
        name: "acciones",
        label: "Acciones",
        align: "center",
        field: "acciones",
      },
    ];

    const modalPrevias = ref(null);

    onMounted(async () => {
      await obtenerCatalogoPrevias();
    });

    const registrarPrevia = () => {
      modalPrevias.value.abrir();
    };

    const editarPrevia = (previa) => {
      modalPrevias.value.abrir(previa);
    };

    return {
      // States
      previas,
      columns,
      buscar: ref(""),
      pagination: { rowsPerPage: 25 },
      modalPrevias,
      // Methods
      registrarPrevia,
      editarPrevia,
    };
  },
};
</script>
