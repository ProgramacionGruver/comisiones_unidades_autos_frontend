<template>
  <q-dialog
    v-model="abrirModal"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="custom--width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>{{ tituloModal }}</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="row items-center q-pb-sm">
        <div class="fit row q-gutter-md">
          <div class="col">
            <span>Ingrese el modelo:</span>
            <q-input
              v-model="previaObj.modelo"
              outlined
              dense
              label="Modelo"
              :rules="[(val) => val.length > 0 || 'Ingrese un valor']"
            />
          </div>
          <div class="col">
            <span>Seleccione el año del modelo:</span>
            <q-select
              v-model="previaObj.anio"
              outlined
              dense
              label="Año"
              :options="listaAnios"
              :rules="[
                (val) => {
                  return val !== null && val !== undefined && val !== ''
                    ? true
                    : 'Selecciona una opción válida.';
                },
              ]"
            />
          </div>
          <div class="col">
            <span>Ingrese el monto:</span>
            <q-input
              v-model="previaObj.monto"
              outlined
              dense
              label="Monto"
              type="number"
              min="0"
              :rules="[(val) => val > 0 || 'El monto debe ser mayor a 0']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Cancelar" color="red" v-close-popup icon="close" flat />
        <q-btn
          v-if="esEdicion"
          label="Editar"
          color="primary"
          icon="edit"
          @click="editarPrevia"
          :loading="cargando"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
        <q-btn
          v-else
          label="Registrar"
          color="primary"
          icon="save"
          @click="registrarPrevia"
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
import { listaAnios } from "src/helpers/listas";
import { usePreviasStore } from "src/stores/previas";
import { notificacion } from "src/helpers/mensajes";

export default {
  setup() {
    const usePrevias = usePreviasStore();
    const { registrarNuevaPrevia, actualizarPrevia } = usePrevias;

    const abrirModal = ref(false);

    const tituloModal = ref("");

    const previaObj = ref();

    const esEdicion = ref(false);
    const cargando = ref(false);

    const abrir = (previa = null) => {
      if (previa) {
        previaObj.value = previa;
        esEdicion.value = true;
        tituloModal.value = "Editar Previa";
      } else {
        previaObj.value = {
          modelo: "",
          anio: "",
          monto: 0,
        };
        esEdicion.value = false;
        tituloModal.value = "Registrar Previa";
      }

      abrirModal.value = true;
    };

    const editarPrevia = async () => {
      if (
        !previaObj.value.modelo ||
        !previaObj.value.anio ||
        !previaObj.value.monto
      ) {
        notificacion("warning", "Llene todos los campos para continuar");
        return;
      }

      cargando.value = true;

      previaObj.value.modelo = previaObj.value.modelo.toUpperCase();

      await actualizarPrevia(previaObj.value);

      cargando.value = false;
      abrirModal.value = false;
    };

    const registrarPrevia = async () => {
      if (
        !previaObj.value.modelo ||
        !previaObj.value.anio ||
        !previaObj.value.monto
      ) {
        notificacion("warning", "Llene todos los campos para continuar");
        return;
      }

      cargando.value = true;

      previaObj.value.modelo = previaObj.value.modelo.toUpperCase();

      await registrarNuevaPrevia(previaObj.value);

      cargando.value = false;
      abrirModal.value = false;
    };

    return {
      // States
      abrirModal,
      tituloModal,
      previaObj,
      esEdicion,
      listaAnios,
      cargando,
      // Methods
      abrir,
      editarPrevia,
      registrarPrevia,
    };
  },
};
</script>

<style>
.custom--width {
  min-width: 55vw !important;
}
</style>
