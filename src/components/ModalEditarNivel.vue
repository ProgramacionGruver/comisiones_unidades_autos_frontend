<template>
  <q-dialog v-model="abrirModal">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>Editar nivel</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="q-mb-md" />
      </q-card-section>
      <q-card-section>
        <div style="display: block">
          <p style="text-align: center">
            ¿Desea cambiar el nivel del vendedor
            <strong>{{ infoVendedor.nombreEmpleado }}</strong> con número de
            empleado <strong>{{ infoVendedor.numeroEmpleado }}</strong
            >?
          </p>
          <br />
          <div>
            <label><strong>Nivel actual:</strong></label>
            <q-chip
              v-if="infoVendedor.nivel.toLowerCase() === 'oro'"
              label="ORO"
              color="orange"
              text-color="white"
              class="text-bold"
            />
            <q-chip
              v-else-if="infoVendedor.nivel.toLowerCase() === 'plata'"
              label="PLATA"
              color="grey"
              text-color="white"
              class="text-bold"
            />
            <q-chip
              v-else-if="infoVendedor.nivel.toLowerCase() === 'bronce'"
              label="BRONCE"
              color="brown"
              text-color="white"
              class="text-bold"
            />
            <q-chip
              v-else-if="infoVendedor.nivel.toLowerCase() === 'asesor'"
              label="ASESOR"
              color="green"
              text-color="white"
              class="text-bold"
            />
          </div>
          <br />
          <div>
            <label><strong>Nuevo nivel:</strong></label>
            <q-select
              v-model="nivelSeleccionado"
              outlined
              dense
              label="Nuevo nivel"
              :options="opcionesNiveles"
              style="min-width: 30rem"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Cancelar"
          @click="abrirModal = false"
          flat
          icon="close"
        />
        <q-btn
          color="primary"
          label="Guardar"
          @click="guardarNivel"
          icon="save"
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

export default {
  setup() {
    const useFacturas = useFacturasStore();
    const { actualizarNivelAsesor } = useFacturas;

    const abrirModal = ref(false);
    const infoVendedor = ref(null);
    const cargando = ref(false);

    const opcionesNiveles = ["ORO", "PLATA", "BRONCE", "ASESOR"];
    const nivelSeleccionado = ref(null);

    const abrir = (vendedor) => {
      infoVendedor.value = vendedor;
      nivelSeleccionado.value = infoVendedor.value.nivel.toUpperCase();

      abrirModal.value = true;
    };

    const guardarNivel = async () => {
      cargando.value = true;

      const objVendedor = {
        idAsesor: infoVendedor.value.idAsesor,
        nivel: nivelSeleccionado.value.toLowerCase(),
      };

      await actualizarNivelAsesor(objVendedor);

      abrirModal.value = false;
      cargando.value = false;
    };

    return {
      // States
      abrirModal,
      infoVendedor,
      opcionesNiveles,
      cargando,
      nivelSeleccionado,
      // Methods
      abrir,
      guardarNivel,
    };
  },
};
</script>
