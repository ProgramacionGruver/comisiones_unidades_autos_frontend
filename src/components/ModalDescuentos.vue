<template>
  <q-dialog v-model="modalDescuentos">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Agregar Descuentos</h2>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form>
          <div
            style="display: grid; grid-template-columns: 1fr 1fr"
            v-if="factura.condicion === 'nuevas'"
          >
            <div class="q-ma-md">
              <label>Agregar Previa.</label>
              <q-input
                dense
                filled
                label="Previa"
                v-model="factura.descuentosUnidades[0].previa"
                type="number"
                color="primary"
                tabindex="1"
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
                v-model="factura.descuentosUnidades[0].traslado"
                type="number"
                color="primary"
                tabindex="3"
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
                v-model="factura.descuentosUnidades[0].descVentas"
                type="number"
                color="primary"
                tabindex="5"
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
                v-model="factura.descuentosUnidades[0].cortesia"
                type="number"
                color="primary"
                tabindex="2"
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
                v-model="factura.descuentosUnidades[0].gasolina"
                type="number"
                color="primary"
                tabindex="4"
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
                v-model="factura.descuentosUnidades[0].bonoub"
                type="number"
                color="primary"
                tabindex="6"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr" v-else>
            <div class="q-ma-md">
              <label>Agregar Garantia Extendida.</label>
              <q-input
                dense
                filled
                label="Garantia Extendida"
                v-model="factura.descuentosUnidades[0].garantia_extendida"
                type="number"
                color="primary"
                tabindex="1"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Acondicionamiento.</label>
              <q-input
                dense
                filled
                label="Acondicionamiento"
                v-model="factura.descuentosUnidades[0].acondicionamiento"
                type="number"
                color="primary"
                tabindex="2"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Gestorias.</label>
              <q-input
                dense
                filled
                label="Gestorias"
                v-model="factura.descuentosUnidades[0].gestorias"
                type="number"
                color="primary"
                tabindex="3"
              >
                <template v-slot:prepend>
                  <q-icon name="paid" />
                </template>
              </q-input>
            </div>

            <div class="q-ma-md">
              <label>Agregar Toma Unidad.</label>
              <q-input
                dense
                filled
                label="Toma Unidad"
                v-model="factura.descuentosUnidades[0].toma_unidad"
                type="number"
                color="primary"
                tabindex="4"
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
                v-model="factura.descuentosUnidades[0].cortesia"
                type="number"
                color="primary"
                tabindex="5"
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
              @click="guardarDescuento()"
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

    const abrir = (objFactura) => {
      if (objFactura.condicion === "nuevas") {
        objFactura.descuentosUnidades = [
          {
            previa: objFactura.descuentosUnidades[0]?.previa ?? 0,
            traslado: objFactura.descuentosUnidades[0]?.traslado ?? 0,
            cortesia: objFactura.descuentosUnidades[0]?.cortesia ?? 0,
            gasolina: objFactura.descuentosUnidades[0]?.gasolina ?? 0,
            descVentas: objFactura.descuentosUnidades[0]?.descVentas ?? 0,
            bonoub: objFactura.descuentosUnidades[0]?.bonoub ?? 0,
          },
        ];
      } else {
        objFactura.descuentosUnidades = [
          {
            garantia_extendida:
              objFactura.descuentosUnidades[0]?.garantia_extendida ?? 0,
            acondicionamiento:
              objFactura.descuentosUnidades[0]?.acondicionamiento ?? 0,
            gestorias: objFactura.descuentosUnidades[0]?.gestorias ?? 0,
            toma_unidad: objFactura.descuentosUnidades[0]?.toma_unidad ?? 0,
            cortesia: objFactura.descuentosUnidades[0]?.cortesia ?? 0,
          },
        ];
      }

      factura.value = { ...objFactura };
      modalDescuentos.value = true;
    };

    const guardarDescuento = async () => {
      try {
        factura.value.descuentosUnidades.forEach((descuento) => {
          descuento.idFactura = factura.value.idFactura;
          descuento.usuario = usuarioAutenticado.value.usuario;
        });

        // Me equivoque al poner el nombre de la columna en la BD, para ya no mover todo, lo dejo asi
        if (factura.value.condicion === "SEM") {
          factura.value.descuentosUnidades[0].cortesias =
            factura.value.descuentosUnidades[0].cortesia;
        }

        await guardarDescuentos(
          factura.value.descuentosUnidades[0],
          factura.value.condicion
        );

        modalDescuentos.value = false;
      } catch (error) {
        console.error(error);
      }
    };

    return {
      abrir,
      factura,
      modalDescuentos,
      guardarDescuento,
    };
  },
};
</script>
