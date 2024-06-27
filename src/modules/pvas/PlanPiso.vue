<template>
  <q-layout>
    <div class="q-ma-md">
      <div class="q-pa-md">
        <h2>Plan piso</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        color="primary"
        :columns="columns"
        :filter="buscar"
        :rows="planPisoRegistrados"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
      >
        <template v-slot:top>
          <div class="fit row q-gutter-sm q-mb-sm justify-end">
            <q-btn
              dense
              color="primary"
              icon-right="playlist_add"
              label="Registrar plan piso"
              no-caps
              @click="registrarNuevoPlanPiso"
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
                @update:model-value="filtrarPlanPiso"
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
                @update:model-value="filtrarPlanPiso"
              />
            </div>
          </div>
        </template>
      </q-table>
    </div>
    <ModalPlanPiso ref="modalPlanPiso" />
  </q-layout>
</template>

<script>
import { useDescuentosStore } from "src/stores/descuentos";
import { storeToRefs } from "pinia";
import { formatearFecha } from "src/helpers/formatearFecha";
import { onMounted, ref } from "vue";
import { formatearMonto } from "src/helpers/formatos";
import { listaMeses, listaAnios } from "src/helpers/listas";
import { mes, obtenerNumeroMes } from "src/constant/constantes";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import ModalPlanPiso from "src/components/ModalPlanPiso.vue";

export default {
  components: {
    ModalPlanPiso,
  },
  setup() {
    const useDescuentos = useDescuentosStore();
    const { obtenerPlanPisoRegistrados } = useDescuentos;
    const { planPisoRegistrados } = storeToRefs(useDescuentos);

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const modalPlanPiso = ref(null);

    const columns = [
      {
        name: "idPlanPiso",
        label: "#",
        align: "center",
        field: "idPlanPiso",
        sortable: true,
      },
      {
        name: "numeroEmpleado",
        label: "Número de empleado",
        align: "center",
        field: (row) => row.asesore.numeroEmpleado || "N/A",
      },
      {
        name: "nombreEmpleado",
        label: "Nombre del empleado",
        align: "center",
        field: (row) => row.asesore.nombreEmpleado || "N/A",
      },
      {
        name: "monto",
        label: "Monto",
        align: "center",
        field: (row) =>
          row.monto ? formatearMonto(row.monto) : formatearMonto(0),
      },
      {
        name: "fechaRegistro",
        label: "Fecha de registro",
        align: "center",
        field: (row) => formatearFecha(row.createdAt),
      },
    ];

    onMounted(async () => {
      await filtrarPlanPiso();
    });

    const filtrarPlanPiso = async () => {
      const buscar = {
        anio: anioSeleccionado.value,
        mes: obtenerNumeroMes(mesSeleccionado.value),
      };

      await obtenerPlanPisoRegistrados(buscar);
    };

    const registrarNuevoPlanPiso = () => {
      modalPlanPiso.value.abrir();
    };

    return {
      // States
      columns,
      planPisoRegistrados,
      buscar: ref(""),
      anioSeleccionado,
      mesSeleccionado,
      listaAnios,
      listaMeses,
      modalPlanPiso,
      // Methods
      filtrarPlanPiso,
      registrarNuevoPlanPiso,
    };
  },
};
</script>
