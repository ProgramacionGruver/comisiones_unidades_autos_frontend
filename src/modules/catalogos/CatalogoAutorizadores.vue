<template>
  <q-layout>
    <div class="q-ma-md">
      <div class="q-pa-md">
        <h2>Catálogo de autorizadores</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
    </div>
    <q-table
      :rows="autorizadores"
      :columns="columns"
      :pagination="{
        rowsPerPageOptions: [5, 10, 15],
        display: 'pagination',
      }"
      class="q-ma-md"
    >
      <template v-slot:body-cell-claveTipoAutorizador="props">
        <q-td>
          <div
            style="
              width: 1005;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <q-chip
              v-if="props.row.claveTipoAutorizador === 'AUT'"
              label="AUTORIZADOR
              "
              color="yellow
              "
              class="text-black"
            />

            <q-chip
              v-else-if="props.row.claveTipoAutorizador === 'COM'"
              label="COMISIONADOR"
              color="green"
              class="text-white"
            />

            <q-chip
              v-else-if="props.row.claveTipoAutorizador === 'FN'"
              label="FINAL"
              color="primary"
              class="text-white"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-estatus="props">
        <q-td>
          <div
            style="
              width: 100%;
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
    </q-table>
  </q-layout>
</template>

<script>
import { storeToRefs } from "pinia";
import { useAutorizacionesStore } from "src/stores/autorizaciones";

export default {
  setup() {
    const useAutorizaciones = useAutorizacionesStore();
    const { autorizadores } = storeToRefs(useAutorizaciones);

    const columns = [
      {
        name: "idAutorizador",
        label: "#",
        align: "center",
        field: "idAutorizador",
      },
      {
        name: "numeroEmpleado",
        label: "Número de empleado",
        align: "center",
        field: "numeroEmpleado",
      },
      {
        name: "nombre",
        label: "Nombre",
        align: "center",
        field: "nombre",
      },
      {
        name: "correo",
        label: "Correo",
        align: "center",
        field: "correo",
      },
      {
        name: "sucursal",
        label: "Sucursal",
        align: "center",
        field: "sucursal",
      },
      {
        name: "claveTipoAutorizador",
        label: "Tipo de autorizador",
        align: "center",
      },
      {
        name: "estatus",
        label: "Estatus",
        align: "center",
      },
    ];

    return {
      // States
      autorizadores,
      columns,
      // Methods
    };
  },
};
</script>
