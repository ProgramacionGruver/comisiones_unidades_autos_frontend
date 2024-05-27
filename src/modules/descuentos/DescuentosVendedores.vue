<template>
  <q-layout>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <h2>Descuentos/Bonos de vendedores</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        color="primary"
        :columns="columns"
        :rows="descuentos"
        :filter="buscar"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
      >
        <template v-slot:body-cell-fechaDescuento="props">
          <td style="text-align: right">
            {{ formatearFecha(props.row.fechaDescuento) }}
          </td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <td align="center">
            <q-btn
              icon="edit"
              color="black"
              flat
              dense
              round
              @click="editarDescuento(props.row)"
            >
              <q-tooltip> Editar descuentos </q-tooltip>
            </q-btn>
          </td>
        </template>

        <template v-slot:top>
          <div class="fit row q-gutter-sm q-mb-sm justify-end">
            <q-btn
              dense
              color="primary"
              icon-right="playlist_add"
              label="Nuevo descuento"
              @click="nuevoDescuento"
              :loading="cargando"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>

            <div class="col">
              <q-input outlined dense v-model="buscar" placeholder="Buscar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="fit row q-gutter-sm q-mb-sm justify-end">
            <q-input
              v-model="fechaInicio"
              outlined
              dense
              label="Fecha de inicio"
              type="date"
            />
            <q-input
              v-model="fechaFin"
              outlined
              dense
              label="Fecha de fin"
              type="date"
            />
            <q-btn
              dense
              color="primary"
              icon-right="search"
              label="Buscar"
              :disable="!fechaInicio || !fechaFin"
              @click="obtenerDescuentos"
              :loading="cargandoDescuentos"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </template>
      </q-table>
    </div>
    <modal-crear-nuevo-descuento ref="modalCrearNuevoDescuento" />
    <modal-descuentos-vendedor ref="modalDescuentosVendedor" />
  </q-layout>
</template>

<script>
import { storeToRefs } from "pinia";
import { useDescuentosStore } from "src/stores/descuentos";
import { onMounted, ref } from "vue";
import ModalCrearNuevoDescuento from "src/components/ModalCrearNuevoDescuento.vue";
import ModalDescuentosVendedor from "src/components/ModalDescuentosVendedor.vue";
import { formatearFecha } from "src/helpers/formatearFecha";

export default {
  components: {
    ModalCrearNuevoDescuento,
    ModalDescuentosVendedor,
  },
  setup() {
    const useDescuentos = useDescuentosStore();
    ModalCrearNuevoDescuento;
    const {
      obtenerTodosDescuentosVendedores,
      obtenerDescuentosVendedoresByFechas,
      obtenerFormularioDescuento,
      obtenerDetalleDescuentoVendedor,
    } = useDescuentos;
    const { descuentos } = storeToRefs(useDescuentos);

    const columns = [
      {
        name: "idDescuentoVendedor",
        label: "#",
        align: "center",
        field: "idDescuentoVendedor",
        sortable: true,
      },
      {
        name: "no_empleado",
        label: "Número de Empleado",
        align: "center",
        field: "no_empleado",
      },
      {
        name: "nombre",
        label: "Nombre",
        align: "left",
        field: "nombre",
      },
      {
        name: "fechaDescuento",
        label: "Fecha de descuento",
        align: "center",
      },
      {
        name: "acciones",
        label: "Acciones",
        align: "center",
      },
    ];

    const buscar = ref("");
    const fechaInicio = ref("");
    const fechaFin = ref("");
    const modalCrearNuevoDescuento = ref(null);
    const modalDescuentosVendedor = ref(null);
    const cargando = ref(false);
    const cargandoDescuentos = ref(false);

    onMounted(async () => {
      await obtenerTodosDescuentosVendedores();
    });

    const obtenerDescuentos = async () => {
      cargandoDescuentos.value = true;

      await obtenerDescuentosVendedoresByFechas(
        fechaInicio.value,
        fechaFin.value
      );

      cargandoDescuentos.value = false;
    };

    const nuevoDescuento = async () => {
      cargando.value = true;

      await obtenerFormularioDescuento();
      modalCrearNuevoDescuento.value.abrir();

      cargando.value = false;
    };

    const editarDescuento = async (descuento) => {
      await obtenerDetalleDescuentoVendedor(descuento.idDescuentoVendedor);

      modalDescuentosVendedor.value.abrirModalDescuento("editar", descuento);
    };

    return {
      // States / Variables
      descuentos,
      columns,
      buscar,
      fechaInicio,
      fechaFin,
      modalCrearNuevoDescuento,
      cargando,
      cargandoDescuentos,
      modalDescuentosVendedor,
      // Methods
      obtenerDescuentos,
      nuevoDescuento,
      formatearFecha,
      editarDescuento,
    };
  },
};
</script>
