<template>
  <q-dialog
    v-model="abrirModal"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>Descuentos</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="q-mb-md" />
      </q-card-section>
      <q-card-section
        class="row wrap justify-center items-center content-center"
      >
        <div class="col-12 renglon--padre">
          <div class="renglon--hijo">
            <label>No. Empleado</label>
            <q-input v-model="objDescuentos.no_empleado" outlined readonly />
          </div>
          <div class="renglon--hijo">
            <label>Nombre</label>
            <q-input v-model="objDescuentos.nombre" outlined readonly>
              <q-tooltip>
                {{ objDescuentos.nombre }}
              </q-tooltip>
            </q-input>
          </div>
        </div>
        <div class="col-12 renglon--padre">
          <div class="renglon--hijo">
            <label>Fecha del descuento</label>
            <q-input v-model="objDescuentos.fechaDescuento" outlined readonly />
          </div>
        </div>
        <template
          v-for="(descuento, index) in objDescuentos.descuentos"
          :key="index"
        >
          <div class="col-12 renglon--padre">
            <div class="renglon--hijo">
              <label>{{
                descuento.catalogoFormularioDescuento.nombreDescuento
              }}</label>
              <q-input
                v-model="descuento.valor"
                outlined
                label="Valor del descuento"
              />
            </div>
            <div class="renglon--hijo">
              <label style="color: white">.</label>
              <q-input
                v-model="descuento.descripcion"
                outlined
                label="Descripción"
              />
            </div>
          </div>
        </template>
        <div
          class="col-12 q-mt-md"
          style="
            display: flex;
            justify-content: flex-end;
            align-items: center;
            column-gap: 1rem;
          "
        >
          <q-btn
            icon="close"
            flat
            color="primary"
            label="Cancelar"
            v-close-popup
          />

          <q-btn
            color="primary"
            label="Guardar"
            icon="save"
            @click="guardarDescuento"
            :loading="cargando"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch } from "vue";
import { useDescuentosStore } from "src/stores/descuentos";
import { storeToRefs } from "pinia";
import { formatearFecha } from "src/helpers/formatearFecha";

export default {
  setup() {
    const useDescuentos = useDescuentosStore();
    const { actualizarDescuentoVendedor } = useDescuentos;
    const { detalleDescuento, descuentoCreado } = storeToRefs(useDescuentos);

    const cargando = ref(false);
    const abrirModal = ref(false);
    const origen = ref("");

    const objDescuentos = ref({});

    const abrirModalDescuento = (desde, data = "") => {
      origen.value = desde;

      if (origen.value === "nuevo") {
        objDescuentos.value = {
          descuentos: detalleDescuento.value,
          idDescuentoVendedor: descuentoCreado.value.idDescuentoVendedor,
          no_empleado: descuentoCreado.value.numeroEmpleado,
          nombre: descuentoCreado.value.nombreEmpleado,
          fechaDescuento: formatearFecha(descuentoCreado.value.fechaDescuento),
        };

        abrirModal.value = true;

        return new Promise((resolve, reject) => {
          watch(abrirModal, (value) => {
            if (!value) {
              resolve();
            }
          });
        });
      } else {
        objDescuentos.value = {
          idDescuentoVendedor: data.idDescuentoVendedor,
          no_empleado: data.no_empleado,
          nombre: data.nombre,
          fechaDescuento: formatearFecha(data.fechaDescuento),
          descuentos: detalleDescuento.value,
        };

        abrirModal.value = true;
      }
    };

    const guardarDescuento = async () => {
      cargando.value = true;

      await actualizarDescuentoVendedor(objDescuentos.value);

      objDescuentos.value = {};
      cargando.value = false;
      abrirModal.value = false;
    };

    return {
      // States / Vars
      abrirModal,
      detalleDescuento,
      descuentoCreado,
      cargando,
      origen,
      objDescuentos,
      // Methods
      abrirModalDescuento,
      guardarDescuento,
    };
  },
};
</script>

<style>
.renglon--padre {
  display: flex;
  justify-content: space-between;
  column-gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.renglon--hijo {
  width: 50%;
}
</style>
