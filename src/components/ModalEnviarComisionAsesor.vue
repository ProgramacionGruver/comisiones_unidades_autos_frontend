<template>
  <q-dialog v-model="abrirModal">
    <q-card style="min-width: 50vw">
      <q-card-section
        class="bg-primary text-white row items-center q-pb-none q-mt-none q-pt-none"
      >
        <h2 class="text-h4">Enviar comisión</h2>
        <q-space />
        <q-btn icon="close" flat round dense @click="cerrar" />
      </q-card-section>
      <q-card-section>
        <p class="text-h4">
          ¿Desea enviar el reporte de comisión al empleado
          <strong>{{ vendedorObj.nombreEmpleado }}</strong> con número de
          empleado <strong>{{ vendedorObj.numeroEmpleado }}</strong
          >?
        </p>
        <p class="text-h4">Autorizadores:</p>
        <q-table
          :rows="autorizadores"
          :columns="columns"
          table-header-class="bg-primary text-white"
          hide-bottom
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Cancelar"
          color="red"
          @click="cerrar"
          icon-right="close"
        />
        <q-btn
          label="Enviar"
          color="primary"
          @click="enviarComision"
          icon-right="send"
        >
          <template v-slot:loading>
            <q-spinner-facebook color="white" />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { QSpinnerIos, useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { useAutorizacionesStore } from "src/stores/autorizaciones";
import { obtenerNumeroMes } from "src/constant/constantes";
import { useFacturasStore } from "src/stores/catalogos/facturas";

export default {
  setup() {
    const useKpis = useKpiStore();
    const { comisionVendedor } = storeToRefs(useKpis);

    const useAutorizaciones = useAutorizacionesStore();
    const { obtenerAutorizador, enviarRegistrarAutorizacion } =
      useAutorizaciones;
    const { autorizadores } = storeToRefs(useAutorizaciones);

    const useFacturas = useFacturasStore();
    const { mesSeleccionado, anioSeleccionado } = storeToRefs(useFacturas);

    const $q = useQuasar();

    const abrirModal = ref(false);

    const vendedorObj = ref(null);

    const columns = [
      { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
      {
        name: "numeroEmpleado",
        label: "Número de empleado",
        field: "numero_empleado",
        align: "center",
      },
      {
        name: "correo",
        label: "Correo electrónico",
        field: "correo",
        align: "center",
      },
    ];

    const abrir = () => {
      obtenerAutorizador(comisionVendedor.value.infoVendedor.idAsesor);

      vendedorObj.value = comisionVendedor.value.infoVendedor;
      abrirModal.value = true;
    };

    const cerrar = () => {
      autorizadores.value = [];
      vendedorObj.value = null;
      abrirModal.value = false;
    };

    const enviarComision = async () => {
      $q.loading.show({
        message: "Enviando comisión, espere un momento...",
        spinner: QSpinnerIos,
        spinnerColor: "primary",
        spinnerSize: 150,
        backgroundColor: "black",
        messageColor: "white",
      });

      const autorizacionObj = {
        idAsesor: comisionVendedor.value.infoVendedor.idAsesor,
        mes: obtenerNumeroMes(mesSeleccionado.value),
        anio: anioSeleccionado.value,
        monto: comisionVendedor.value.detalleComision.comision
          ? comisionVendedor.value.detalleComision.comision.detalle
              .comisionFinal
          : 0,
        montoFlotillas: comisionVendedor.value.detalleComision.flotillas
          ? comisionVendedor.value.detalleComision.flotillas.detalle
              .totalAPagarFlotillas
          : 0,
        totalBonos: comisionVendedor.value.detalleComision.comision
          ? comisionVendedor.value.detalleComision.comision.detalle
              .totalDescuentos +
            comisionVendedor.value.detalleComision.comision.detalle
              .totalBonosFijosSeminuevos
          : 0,
        autorizadores: autorizadores.value,
      };

      await enviarRegistrarAutorizacion(autorizacionObj);

      $q.loading.hide();
      cerrar();
    };

    return {
      // States
      abrirModal,
      columns,
      vendedorObj,
      autorizadores,
      // Methods
      abrir,
      cerrar,
      enviarComision,
    };
  },
};
</script>
