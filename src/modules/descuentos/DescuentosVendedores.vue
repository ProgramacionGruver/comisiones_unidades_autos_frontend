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
        loading-label="Buscando información . . ."
        row-key="idDescuentoVendedor"
        :loading="cargandoDescuentos"
      >
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
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                :disable="cargando"
                :options="listaAnios"
                v-model="anioSeleccionado"
                @update:model-value="obtenerDescuentos"
                map-options
                option-value="name"
              />
            </div>
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                :disable="cargando"
                :options="listaMeses"
                v-model="mesSeleccionado"
                @update:model-value="obtenerDescuentos"
                map-options
                option-value="name"
              />
            </div>
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
import { formatearFecha } from "src/helpers/formatearFecha";
import { listaMeses, listaAnios } from "src/helpers/listas";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { obtenerNumeroMes } from "src/constant/constantes";
import { formatearMonto } from "src/helpers/formatos";
import ModalCrearNuevoDescuento from "src/components/ModalCrearNuevoDescuento.vue";
import ModalDescuentosVendedor from "src/components/ModalDescuentosVendedor.vue";

export default {
  components: {
    ModalCrearNuevoDescuento,
    ModalDescuentosVendedor,
  },
  setup() {
    const useDescuentos = useDescuentosStore();
    ModalCrearNuevoDescuento;
    const { obtenerDescuentosVendedores } = useDescuentos;
    const { descuentos } = storeToRefs(useDescuentos);

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const columns = [
      {
        name: "no_empleado",
        label: "Número de Empleado",
        align: "center",
        field: "numeroEmpleado",
      },
      {
        name: "nombre",
        label: "Nombre",
        align: "left",
        field: "nombreEmpleado",
      },
      {
        name: "fecha",
        label: "Fecha",
        align: "center",
        field: (row) => formatearFecha(row.descuentos_vendedores[0]?.createdAt),
      },
      {
        name: "total",
        label: "Total descuentos/bonos",
        align: "center",
        field: (row) => {
          const totalDescuentos = row.descuentos_vendedores.reduce(
            (total, descuento) => {
              const monto = descuento.idFormularioDescuentos
                ? descuento.catalogoFormularioDescuento.sumarRestar
                  ? descuento.monto
                  : -descuento.monto
                : 0;

              return total + monto;
            },
            0
          );
          return totalDescuentos;
        },
        format: (val) => formatearMonto(val),
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
    const datosCargados = ref(false);

    onMounted(async () => {
      await obtenerDescuentos();
    });

    const obtenerDescuentos = async () => {
      cargandoDescuentos.value = true;

      const mes = obtenerNumeroMes(mesSeleccionado.value);

      await obtenerDescuentosVendedores(mes, anioSeleccionado.value);

      if (descuentos.value.length === 0) {
        datosCargados.value = true;
      }

      cargandoDescuentos.value = false;
    };

    const nuevoDescuento = async () => {
      modalCrearNuevoDescuento.value.abrir();
    };

    const editarDescuento = async (descuento) => {
      modalCrearNuevoDescuento.value.abrir(descuento);
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
      listaAnios,
      listaMeses,
      anioSeleccionado,
      mesSeleccionado,
      // Methods
      obtenerDescuentos,
      nuevoDescuento,
      formatearFecha,
      editarDescuento,
    };
  },
};
</script>
