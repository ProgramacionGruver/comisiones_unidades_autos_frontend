<template>
  <q-layout>
    <div class="q-ma-md">
      <div class="q-pa-md">
        <h2>Bono fijo seminuevos</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        :columns="columns"
        :rows="facturasSeminuevosSistema"
        :filter="buscar"
        :pagination="pagination"
        :loading="cargando"
        no-data-label="No se encontró ninguna factura de seminuevos para este periodo."
        loading-label="Buscando información . . ."
      >
        <template v-slot:top>
          <div class="fit row">
            <q-input v-model="buscar" label="Buscar" outlined dense class="col">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="fit row q-mt-xs q-gutter-md">
            <q-select
              v-model="mesSeleccionado"
              :options="listaMeses"
              label="Mes"
              outlined
              dense
              class="col"
              @update:model-value="buscarFacturas"
            />
            <q-select
              v-model="anioSeleccionado"
              :options="listaAnios"
              label="Año"
              outlined
              dense
              class="col"
              @update:model-value="buscarFacturas"
            />
          </div>
        </template>

        <template v-slot:body-cell-agregarBonoFijo="props">
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
                round
                dense
                icon="attach_money"
                @click="agregarBonoFijo(props.row)"
                :disable="!habilitarBoton || props.row.enviadaComision"
              >
                <q-tooltip v-if="!habilitarBoton" class="text-h6">
                  Este botón solo está habilitado en el periodo de comisiones
                  (Del 1 al 5 del mes)
                </q-tooltip>
                <q-tooltip
                  v-else-if="props.row.enviadaComision"
                  class="text-h6"
                >
                  La factura ya fue enviada en una comisión
                </q-tooltip>
                <q-tooltip v-else class="text-h6">
                  Agregar bono fijo
                </q-tooltip>
              </q-btn>
              <q-btn
                color="negative"
                round
                dense
                icon="delete"
                @click="revertirBonoFijo(props.row)"
                v-if="props.row.bonos_fijo"
              >
                <q-tooltip class="text-h6">Elminar bono fijo</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-layout>
</template>

<script>
import { ref, onMounted } from "vue";
import { listaMeses, listaAnios } from "src/helpers/listas";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { storeToRefs } from "pinia";
import { formatearFecha } from "src/helpers/formatearFecha";
import { formatearMonto } from "src/helpers/formatos";
import { obtenerNumerosDeMes } from "src/constant/constantes";
import { QSpinnerIos, useQuasar } from "quasar";

export default {
  setup() {
    const useFacturas = useFacturasStore();
    const { facturasSeminuevosSistema, mesSeleccionado, anioSeleccionado } =
      storeToRefs(useFacturas);
    const {
      obtenerFacturasSeminuevosSistemas,
      obtenerBonoFijo,
      agregarActualizarBonoFijo,
      revertirOperacionBonoFijo,
    } = useFacturas;

    const habilitarBoton = ref(true);

    const $q = useQuasar();

    const columns = [
      {
        name: "factura",
        label: "Factura",
        field: "factura",
        align: "left",
        sortable: true,
      },
      {
        name: "fecha_facturacion",
        label: "Fecha factura",
        field: (row) => formatearFecha(row.fecha_facturacion),
        align: "left",
        sortable: true,
      },
      {
        name: "tipo_venta",
        label: "Tipo de venta",
        field: "tipo_venta",
        align: "left",
        sortable: true,
      },
      {
        name: "modelo",
        label: "Modelo",
        field: "modelo",
        align: "left",
        sortable: true,
      },
      {
        name: "utilidad",
        label: "Utilidad Bruta",
        field: (row) =>
          row.utilidad ? formatearMonto(row.utilidad) : formatearMonto(0),
        align: "left",
      },
      {
        name: "ubAntesBonoFijo",
        label: "Utilidad antes de bono fijo",
        field: (row) =>
          row.ubAntesBonoFijo
            ? formatearMonto(row.ubAntesBonoFijo)
            : "Sin registrar",
        align: "left",
      },
      {
        name: "bonos_fijo",
        label: "Bono fijo",
        field: (row) =>
          row.bonos_fijo
            ? formatearMonto(row.bonos_fijo.monto)
            : "Sin registrar",
        align: "left",
      },
      {
        name: "agregarBonoFijo",
        label: "",
        field: "agregarBonoFijo",
        align: "center",
      },
    ];

    const cargando = ref(false);

    onMounted(async () => {
      cargando.value = true;

      const fechaHoy = new Date();
      const diaActual = fechaHoy.getDate();
      const mesActual = fechaHoy.getMonth() + 1;

      await obtenerFacturasSeminuevosSistemas({
        mes: Number(obtenerNumerosDeMes(mesSeleccionado.value)),
        anio: anioSeleccionado.value,
      });

      if (
        diaActual >= 1 &&
        diaActual <= 5 &&
        (mesActual === Number(obtenerNumerosDeMes(mesSeleccionado.value)) + 1 ||
          (mesActual === 1 &&
            Number(obtenerNumerosDeMes(mesSeleccionado.value)) === 12))
      ) {
        habilitarBoton.value = false;
      }

      cargando.value = false;
    });

    const agregarBonoFijo = async (factura) => {
      const bonoFijo = await obtenerBonoFijo(factura.idFactura);

      $q.dialog({
        title: "<span class='text-primary text-h4'>Agregar bono fijo</span>",
        message: `<span>¿Desea agregar un bono fijo a la siguiente factura?</span><br><strong>${factura.factura}</strong>`,
        html: true,
        prompt: {
          model: bonoFijo ? bonoFijo.monto : 0,
          type: "number",
          label: "Monto del bono fijo",
          isValid: (val) => val > 0,
        },
        cancel: true,
        persistent: true,
      }).onOk(async (monto) => {
        cargando.value = true;

        const data = {
          idFactura: factura.idFactura,
          monto,
          ubAntesBonoFijo: factura.utilidad,
          mes: Number(obtenerNumerosDeMes(mesSeleccionado.value)),
          anio: anioSeleccionado.value,
        };

        await agregarActualizarBonoFijo(data);

        cargando.value = false;
      });
    };

    const revertirBonoFijo = async (factura) => {
      $q.dialog({
        title: "<span class='text-primary text-h4'>Revertir bono fijo</span>",
        message: `<span>¿Desea eliminar el bono fijo registrado de la factura <strong>${factura.factura}</strong>?</span>`,
        html: true,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        cargando.value = true;

        const data = {
          idFactura: factura.idFactura,
          ubAntesBonoFijo: factura.ubAntesBonoFijo,
          mes: Number(obtenerNumerosDeMes(mesSeleccionado.value)),
          anio: anioSeleccionado.value,
        };

        await revertirOperacionBonoFijo(data);

        cargando.value = false;
      });
    };

    const buscarFacturas = async () => {
      cargando.value = true;

      await obtenerFacturasSeminuevosSistemas({
        mes: Number(obtenerNumerosDeMes(mesSeleccionado.value)),
        anio: anioSeleccionado.value,
      });

      cargando.value = false;
    };

    return {
      // States
      columns,
      facturasSeminuevosSistema,
      mesSeleccionado,
      anioSeleccionado,
      listaMeses,
      listaAnios,
      buscar: ref(""),
      pagination: ref({ rowsPerPage: 10 }),
      cargando,
      habilitarBoton,
      // Methods
      agregarBonoFijo,
      buscarFacturas,
      revertirBonoFijo,
    };
  },
};
</script>
