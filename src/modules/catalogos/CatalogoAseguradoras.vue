<template>
  <q-layout>
    <div class="q-ma-md">
      <div class="q-pa-md">
        <h2>Catalogo de Aseguradoras</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        color="primary"
        :columns="columns"
        :filter="buscar"
        :rows="aseguradoras"
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
            <q-btn
              color="primary"
              label="Agregar Aseguradora"
              icon="add"
              @click="agregarAseguradora"
            />
            <q-input
              v-model="buscar"
              label="Buscar"
              dense
              outlined
              style="width: 20%"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-estatus="props">
          <q-td>
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-chip
                :label="props.row.estatus ? 'ACTIVO' : 'INACTIVO'"
                :color="props.row.estatus ? 'green' : 'red'"
                class="text-white"
              />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td>
            <div
              style="
                display: flex;
                justify-content: space-around;
                align-items: center;
              "
            >
              <q-btn
                color="primary"
                icon="edit"
                flat
                dense
                @click="editarAseguradora(props.row)"
              />
              <q-btn
                color="primary"
                icon="visibility"
                flat
                dense
                @click="estatusAseguradora(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <ModalAseguradora ref="modalAseguradoras" />
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useAseguradorasStore } from "src/stores/catalogos/aseguradoras";
import { storeToRefs } from "pinia";
import ModalAseguradora from "src/components/ModalAseguradora.vue";

export default {
  components: {
    ModalAseguradora,
  },
  setup() {
    const useAseguradoras = useAseguradorasStore();
    const { cambiarEstatusAseguradora } = useAseguradoras;
    const { aseguradoras } = storeToRefs(useAseguradoras);

    const columns = [
      {
        name: "id_catalogo_aseguradoras",
        label: "ID",
        align: "center",
        field: "id_catalogo_aseguradoras",
        sortable: true,
      },
      {
        name: "nombre_aseguradora",
        label: "Nombre",
        align: "center",
        field: "nombre_aseguradora",
      },
      {
        name: "nombre_corto",
        label: "Nombre Corto",
        align: "center",
        field: "nombre_corto",
      },
      {
        name: "estatus",
        label: "Estatus",
        align: "center",
      },
      {
        name: "acciones",
        label: "Acciones",
        align: "center",
      },
    ];

    const modalAseguradoras = ref(null);

    const agregarAseguradora = () => {
      modalAseguradoras.value.abrir("nuevo", {});
    };

    const editarAseguradora = (aseguradora) => {
      modalAseguradoras.value.abrir("editar", aseguradora);
    };

    const estatusAseguradora = (aseguradora) => {
      cambiarEstatusAseguradora(aseguradora);
    };

    return {
      // States
      aseguradoras,
      buscar: "",
      columns,
      modalAseguradoras,
      // Methods
      agregarAseguradora,
      editarAseguradora,
      estatusAseguradora,
    };
  },
};
</script>
