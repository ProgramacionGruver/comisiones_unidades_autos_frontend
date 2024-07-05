<template>
  <q-dialog v-model="abriModal">
    <q-card>
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Aprobar bono</h2>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div
          style="
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
          "
        >
          <div class="text-center">
            ¿Estás seguro de aprobar el bono del vendedor
            <strong>{{ infoVendedor.nombreEmpleado }}</strong
            >?
          </div>
          <div>
            Monto a pagar:
            <strong>{{
              monto.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            }}</strong>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Cancelar"
          color="primary"
          icon="close"
          flat
          v-close-popup
        />
        <q-btn
          label="Aprobar"
          color="primary"
          @click="aprobarBonoVenndedor"
          :loading="cargando"
          icon="check"
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
import { useKpiStore } from "src/stores/catalogos/kpis";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { obtenerNumerosDeMes } from "src/constant/constantes";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const useKpis = useKpiStore();
    const { aprobarBono } = useKpis;

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const useAutenticaciones = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticaciones);

    const abriModal = ref(false);

    const infoVendedor = ref(null);

    const cargando = ref(false);

    const monto = ref(0);

    const abrir = async (info) => {
      infoVendedor.value = info.infoVendedor;
      monto.value = info.monto;

      abriModal.value = true;
    };

    const aprobarBonoVenndedor = async () => {
      cargando.value = true;

      const data = {
        idAsesor: infoVendedor.value.idAsesor,
        anio: anioSeleccionado.value,
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
        monto: monto.value,
        estatus: 1,
        usuario: usuarioAutenticado.value.usuario,
      };

      await aprobarBono(data);

      cargando.value = false;
      abriModal.value = false;
    };

    return {
      // States
      abriModal,
      infoVendedor,
      cargando,
      monto,
      // Methods
      abrir,
      aprobarBonoVenndedor,
    };
  },
};
</script>
