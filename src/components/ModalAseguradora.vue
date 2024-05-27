<template>
  <q-dialog v-model="abrirModal">
    <q-card class="full-width">
      <q-card-section class="bg-primary">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          "
        >
          <div class="text-white text-h4">
            {{
              origen === "nuevo" ? "Nueva Aseguradora" : "Editar Aseguradora"
            }}
          </div>
          <q-btn flat round dense icon="close" v-close-popup color="white" />
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="guardar" class="q-gutter-y-md">
          <q-input
            v-model="objAseguradora.nombre_aseguradora"
            label="Nombre"
            outlined
            dense
            style="width: 100%"
          />
          <q-input
            v-model="objAseguradora.nombre_corto"
            label="Nombre Corto"
            outlined
            dense
            style="width: 100%"
          />
          <div>
            <span>Estatus</span>
            <q-toggle
              v-model="objAseguradora.estatus"
              dense
              style="width: 100%"
              color="green"
            />
          </div>
          <q-card-actions align="right">
            <q-btn
              color="primary"
              label="Cancelar"
              flat
              v-close-popup
              icon-right="close"
            />
            <q-btn
              color="primary"
              label="Guardar"
              type="submit"
              @click="guardar"
              :loading="cargando"
              icon-right="save"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useAseguradorasStore } from "src/stores/catalogos/aseguradoras";

export default {
  setup() {
    const useAseguradoras = useAseguradorasStore();
    const { altaAseguradora, editarAseguradora } = useAseguradoras;

    const abrirModal = ref(false);
    const origen = ref("");
    const objAseguradora = ref({
      id_catalogo_aseguradora: 0,
      nombre_aseguradora: "",
      nombre_corto: "",
      estatus: false,
    });
    const cargando = ref(false);

    const abrir = (desde, dataAseguradora = "") => {
      if (desde === "nuevo") {
        origen.value = "nuevo";
      } else {
        objAseguradora.value = dataAseguradora;

        origen.value = "editar";
      }

      abrirModal.value = true;
    };

    const guardar = () => {
      if (origen.value === "nuevo") {
        altaAseguradora(objAseguradora.value);
      } else {
        editarAseguradora(objAseguradora.value);
      }

      abrirModal.value = false;
    };

    return {
      // States
      abrirModal,
      origen,
      objAseguradora,
      cargando,
      // Methods
      abrir,
      guardar,
    };
  },
};
</script>
