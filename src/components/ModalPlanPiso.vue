<template>
  <q-dialog v-model="abrirModal">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Registrar valor plan piso</h2>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 1rem;
          "
        >
          <q-input
            outlined
            dense
            v-model="anioSeleccionado"
            label="Año"
            readonly
          />
          <q-input
            outlined
            dense
            v-model="mesSeleccionado"
            label="Mes"
            readonly
          />
          <q-select
            outlined
            dense
            clearable
            use-input
            input-debounce="0"
            label="Vendedor"
            v-model="vendedorSeleccionado"
            @filter="parametrosFiltradosVendedores"
            :options="opcionesEmpleados"
            :rules="[(val) => !!val || 'Se requiere llenar este campo']"
            style="width: 100%; grid-column: 1 / -1"
            class="q-mt-md"
          />
          <q-input
            outlined
            dense
            v-model="montoPlanPiso"
            label="Monto a descontar"
            type="number"
            :rules="[(val) => !!val || 'Se requiere llenar este campo']"
            style="width: 100%; grid-column: 1 / -1"
          >
            <template v-slot:append>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Cancelar"
          icon="close"
          @click="abrirModal = false"
          flat
        />
        <q-btn
          color="primary"
          label="Registrar"
          icon="save"
          @click="registrarPlanPiso"
          :loading="cargando"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj";
import { storeToRefs } from "pinia";
import { useDescuentosStore } from "src/stores/descuentos";
import { obtenerNumeroMes } from "src/constant/constantes";
import { notificacion } from "src/helpers/mensajes";

export default {
  setup() {
    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado, opcionesVendedores } =
      storeToRefs(useFacturas);

    const useDescuentos = useDescuentosStore();
    const { guardarPlanPiso } = useDescuentos;

    const abrirModal = ref(false);
    const cargando = ref(false);

    const vendedorSeleccionado = ref(null);

    const opcionesEmpleados = ref([]);

    const montoPlanPiso = ref(null);

    const abrir = () => {
      opcionesEmpleados.value = opcionesVendedores.value.filter(
        (vendedor) => vendedor.value.claveDepartamento === "SEM"
      );

      abrirModal.value = true;
    };

    const parametrosFiltradosVendedores = (val, update) => {
      filtradoBusquedaObj(
        val,
        update,
        opcionesVendedores.value.filter(
          (vendedor) => vendedor.value.claveDepartamento === "SEM"
        ),
        opcionesEmpleados
      );
    };

    const registrarPlanPiso = async () => {
      cargando.value = true;

      if (!vendedorSeleccionado.value) {
        cargando.value = false;
        notificacion("negative", "Debe seleccionar un vendedor");
        return;
      }

      if (!montoPlanPiso.value) {
        cargando.value = false;
        notificacion("negative", "Debe ingresar un monto");
        return;
      }

      const planPiso = {
        anio: anioSeleccionado.value,
        mes: obtenerNumeroMes(mesSeleccionado.value),
        idAsesor: vendedorSeleccionado.value.value.idAsesor,
        monto: montoPlanPiso.value,
      };

      await guardarPlanPiso(planPiso);

      cargando.value = false;
      abrirModal.value = false;
    };

    return {
      // States
      abrirModal,
      anioSeleccionado,
      mesSeleccionado,
      vendedorSeleccionado,
      opcionesEmpleados,
      montoPlanPiso,
      cargando,
      // Methods
      abrir,
      parametrosFiltradosVendedores,
      registrarPlanPiso,
    };
  },
};
</script>
