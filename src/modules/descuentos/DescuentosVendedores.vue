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
        :no-data-label="
          datosCargados
            ? 'No se encontraron datos'
            : 'Seleccione un rango de fechas para buscar'
        "
        loading-label="Buscando información . . ."
        row-key="idDescuentoVendedor"
      >
        <template v-slot:body-cell-fechaDescuento="props">
          <td style="text-align: center">
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
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                :disable="cargando"
                :options="departamentos"
                v-model="departamentoSeleccionado"
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
import ModalCrearNuevoDescuento from "src/components/ModalCrearNuevoDescuento.vue";
import ModalDescuentosVendedor from "src/components/ModalDescuentosVendedor.vue";
import { formatearFecha } from "src/helpers/formatearFecha";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";
import { listaMeses, listaAnios, listaQuincenas } from "src/helpers/listas";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { obtenerNumeroMes } from "src/constant/constantes";

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

    const useDepartamentos = useDepartamentosStore();
    const { obtenerDepartamentos } = useDepartamentos;
    const { departamentos, departamentoSeleccionado } =
      storeToRefs(useDepartamentos);

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

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
    const datosCargados = ref(false);

    onMounted(async () => {
      await obtenerDepartamentos();

      departamentoSeleccionado.value = departamentos.value[0];

      if (departamentoSeleccionado.value) {
        await obtenerDescuentos();
      }
    });

    const obtenerDescuentos = async () => {
      cargandoDescuentos.value = true;

      const claveDepartamento =
        departamentoSeleccionado.value.value.claveDepartamento;

      const mes = Number(obtenerNumeroMes(mesSeleccionado.value));

      await obtenerDescuentosVendedoresByFechas(
        mes,
        anioSeleccionado.value,
        claveDepartamento
      );

      if (descuentos.value.length === 0) {
        datosCargados.value = true;
      }

      cargandoDescuentos.value = false;
    };

    const nuevoDescuento = async () => {
      cargando.value = true;

      modalCrearNuevoDescuento.value.abrir();

      cargando.value = false;
    };

    const editarDescuento = async (descuento) => {
      await obtenerDetalleDescuentoVendedor(descuento.idDescuentoVendedor);

      modalDescuentosVendedor.value.abrirModalDescuento(descuento);
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
      datosCargados,
      departamentos,
      departamentoSeleccionado,
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
