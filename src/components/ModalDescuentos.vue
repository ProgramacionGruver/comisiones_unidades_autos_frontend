<template>
  <q-dialog v-model="modalDescuentos">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Agregar Descuentos</h2>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          :disable="cargando"
        />
      </q-card-section>
      <q-card-section>
        <q-form>
          <div style="display: grid; grid-template-columns: 1fr 1fr">
            <div class="q-ma-md">
              <label>Agregar Previa.</label>
              <q-input
                dense
                filled
                label="Previa"
                v-model="factura.descuentos.previa"
                type="number"
                color="primary"
                tabindex="1"
                disable
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Traslado.</label>
              <q-input
                dense
                filled
                label="Traslado"
                v-model="factura.descuentos.traslado"
                type="number"
                color="primary"
                tabindex="2"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Desc/Ventas.</label>
              <q-input
                dense
                filled
                label="Desc/Ventas"
                v-model="factura.descuentos.descVentas"
                type="number"
                color="primary"
                tabindex="3"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Cortesia.</label>
              <q-input
                dense
                filled
                label="Cortesia"
                v-model="factura.descuentos.cortesia"
                type="number"
                color="primary"
                tabindex="4"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Gasolina.</label>
              <q-input
                dense
                filled
                label="Gasolina"
                v-model="factura.descuentos.gasolina"
                type="number"
                color="primary"
                tabindex="5"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Bono U.B.</label>
              <q-input
                dense
                filled
                label="Bono U.B."
                v-model="factura.descuentos.bonoub"
                type="number"
                color="primary"
                tabindex="6"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Garantía Extendida</label>
              <q-input
                dense
                filled
                label="Garantía Extendida"
                v-model="factura.descuentos.garantia_extendida"
                type="number"
                color="primary"
                tabindex="7"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Acondicionamiento</label>
              <q-input
                dense
                filled
                label="Acondicionamiento"
                v-model="factura.descuentos.acondicionamiento"
                type="number"
                color="primary"
                tabindex="8"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Gestorías</label>
              <q-input
                dense
                filled
                label="Gestorías"
                v-model="factura.descuentos.gestorias"
                type="number"
                color="primary"
                tabindex="9"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Toma de unidad</label>
              <q-input
                dense
                filled
                label="Toma de unidad"
                v-model="factura.descuentos.toma_unidad"
                type="number"
                color="primary"
                tabindex="10"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Cortesía</label>
              <q-input
                dense
                filled
                label="Cortesía"
                v-model="factura.descuentos.cortesia"
                type="number"
                color="primary"
                tabindex="11"
                :disable="cargando"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Gasto Financiero</label>
              <q-input
                dense
                filled
                label="Gasto Financiero"
                v-model="factura.descuentos.gastoFinanciero"
                type="number"
                color="primary"
                tabindex="12"
                disable
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>
          </div>
          <q-card-actions class="q-pt-md" align="right">
            <q-btn
              icon-right="save"
              label="Guardar"
              color="primary"
              @click="guardarDescuento"
              :disable="cargando"
              :loading="cargando"
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
import { useComisionesStore } from "src/stores/catalogos/comisionesUnidades.js";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const useComisiones = useComisionesStore();
    const { guardarDescuentos } = useComisiones;

    const useAutenticacion = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticacion);

    const modalDescuentos = ref(false);
    const factura = ref({});

    const cargando = ref(false);

    const abrir = (objFactura) => {
      factura.value = { ...objFactura };
      modalDescuentos.value = true;
    };

    const guardarDescuento = async () => {
      try {
        cargando.value = true;

        const guardarObj = {
          idFactura: factura.value.idFactura,
          descuentos: {
            previa: factura.value.descuentos.previa || 0,
            traslado: factura.value.descuentos.traslado || 0,
            descVentas: factura.value.descuentos.descVentas || 0,
            cortesia: factura.value.descuentos.cortesia || 0,
            gasolina: factura.value.descuentos.gasolina || 0,
            bonoub: factura.value.descuentos.bonoub || 0,
            garantia_extendida:
              factura.value.descuentos.garantia_extendida || 0,
            acondicionamiento: factura.value.descuentos.acondicionamiento || 0,
            gestorias: factura.value.descuentos.gestorias || 0,
            toma_unidad: factura.value.descuentos.toma_unidad || 0,
            gastoFinanciero: factura.value.descuentos.gastoFinanciero || 0,
          },
          usuario: usuarioAutenticado.value.usuario,
        };

        await guardarDescuentos(guardarObj);

        modalDescuentos.value = false;
      } catch (error) {
        console.error(error);
      } finally {
        cargando.value = false;
      }
    };

    return {
      factura,
      modalDescuentos,
      cargando,
      abrir,
      guardarDescuento,
    };
  },
};
</script>
