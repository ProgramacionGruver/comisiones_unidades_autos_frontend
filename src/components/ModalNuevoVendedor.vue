<template>
  <q-dialog v-model="abrirModal">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>Nuevo vendedor</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="q-mb-md" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="guardarVendedor">
          <label>Ingrese el número de empleado del vendedor:</label>
          <q-input
            v-model="vendedorObj.numeroEmpleado"
            outlined
            dense
            label="Número de empleado"
            type="number"
            :rules="[(val) => !!val || 'Se requiere llenar este campo']"
          />
          <label>Ingrese el nombre del vendedor:</label>
          <q-input
            v-model="vendedorObj.nombreEmpleado"
            outlined
            dense
            label="Nombre del empleado"
            :rules="[(val) => !!val || 'Se requiere llenar este campo']"
          />
          <label>Asigne un nivel para el vendedor:</label>
          <q-select
            v-model="nivelSeleccionado"
            outlined
            dense
            label="Nivel"
            :options="opcionesNivel"
            :rules="[(val) => !!val || 'Se requiere seleccionar un nivel']"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          label="Cancelar"
          @click="abrirModal = false"
          icon="close"
        />
        <q-btn
          color="primary"
          label="Guardar"
          @click="guardarVendedor"
          :disable="
            !vendedorObj.numeroEmpleado ||
            !vendedorObj.nombreEmpleado ||
            !nivelSeleccionado
          "
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
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { storeToRefs } from "pinia";
import { useFacturasStore } from "src/stores/catalogos/facturas";

export default {
  setup() {
    const useAutenticaciones = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticaciones);

    const useFacturas = useFacturasStore();
    const { altaVendedor } = useFacturas;

    const abrirModal = ref(false);

    const vendedorObj = ref({
      numeroEmpleado: "",
      nombreEmpleado: "",
      nivel: "",
      usuario: "",
    });

    const cargando = ref(false);

    const opcionesNivel = ["ASESOR", "BRONCE", "PLATA", "ORO"];
    const nivelSeleccionado = ref("");

    const abrir = () => {
      vendedorObj.value.usuario = usuarioAutenticado.value.usuario;

      abrirModal.value = true;
    };

    const guardarVendedor = async () => {
      cargando.value = true;

      vendedorObj.value.nivel = nivelSeleccionado.value.toLowerCase();
      vendedorObj.value.nombreEmpleado =
        vendedorObj.value.nombreEmpleado.toUpperCase();

      await altaVendedor(vendedorObj.value);

      vendedorObj.value = {
        numeroEmpleado: "",
        nombreEmpleado: "",
        nivel: "",
        usuario: "",
      };

      cargando.value = false;
      abrirModal.value = false;
    };

    return {
      // States
      abrirModal,
      vendedorObj,
      opcionesNivel,
      nivelSeleccionado,
      cargando,
      // Methods
      abrir,
      guardarVendedor,
    };
  },
};
</script>
