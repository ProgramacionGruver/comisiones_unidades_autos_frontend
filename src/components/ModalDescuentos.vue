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
                v-model="
                  factura.descuentosUnidadesSeminuevos[0].garantia_extendida
                "
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
                v-model="
                  factura.descuentosUnidadesSeminuevos[0].acondicionamiento
                "
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
                v-model="factura.descuentosUnidadesSeminuevos[0].gestorias"
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
                v-model="factura.descuentosUnidadesSeminuevos[0].toma_unidad"
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
                v-model="factura.descuentosUnidadesSeminuevos[0].cortesia"
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
              <label>Agregar Bono U.B.</label>
              <q-input
                dense
                filled
                label="Bono U.B."
                v-model="factura.descuentosUnidadesSeminuevos[0].bonoub"
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
      try {
        if (objFactura.condicion === "nuevas") {
          if (objFactura.descuentosUnidades.length === 0) {
            objFactura.descuentosUnidades = [
              {
                previa: 0,
                traslado: 0,
                cortesia: 0,
                gasolina: 0,
                descVentas: 0,
                bonoub: 0,
                garantia_extendida: 0,
                acondicionamiento: 0,
                gestorias: 0,
                toma_unidad: 0,
              },
            ];
          } else {
            objFactura.descuentosUnidades = [
              {
                previa: objFactura.descuentosUnidades[0]?.previa ?? 0,
                traslado: objFactura.descuentosUnidades[0]?.traslado ?? 0,
                cortesia: objFactura.descuentosUnidades[0]?.cortesia ?? 0,
                gasolina: objFactura.descuentosUnidades[0]?.gasolina ?? 0,
                descVentas: objFactura.descuentosUnidades[0]?.descVentas ?? 0,
                bonoub: objFactura.descuentosUnidades[0]?.bonoub ?? 0,
                garantia_extendida:
                  objFactura.descuentosUnidades[0]?.garantia_extendida ?? 0,
                acondicionamiento:
                  objFactura.descuentosUnidades[0]?.acondicionamiento ?? 0,
                gestorias: objFactura.descuentosUnidades[0]?.gestorias ?? 0,
                toma_unidad: objFactura.descuentosUnidades[0]?.toma_unidad ?? 0,
              },
            ];
          }
        } else {
          if (objFactura.descuentosUnidadesSeminuevos.length === 0) {
            objFactura.descuentosUnidadesSeminuevos = [
              {
                previa: 0,
                traslado: 0,
                cortesia: 0,
                gasolina: 0,
                descVentas: 0,
                bonoub: 0,
                garantia_extendida: 0,
                acondicionamiento: 0,
                gestorias: 0,
                toma_unidad: 0,
              },
            ];
          } else {
            objFactura.descuentosUnidadesSeminuevos = [
              {
                previa: objFactura.descuentosUnidadesSeminuevos[0]?.previa ?? 0,
                traslado: objFactura.descuentosUnidadesSeminuevos[0]?.traslado ?? 0,
                cortesia: objFactura.descuentosUnidadesSeminuevos[0]?.cortesia ?? 0,
                gasolina: objFactura.descuentosUnidadesSeminuevos[0]?.gasolina ?? 0,
                descVentas: objFactura.descuentosUnidadesSeminuevos[0]?.descVentas ?? 0,
                bonoub: objFactura.descuentosUnidadesSeminuevos[0]?.bonoub ?? 0,
                garantia_extendida:
                  objFactura.descuentosUnidadesSeminuevos[0]?.garantia_extendida ?? 0,
                acondicionamiento:
                  objFactura.descuentosUnidadesSeminuevos[0]?.acondicionamiento ?? 0,
                gestorias: objFactura.descuentosUnidadesSeminuevos[0]?.gestorias ?? 0,
                toma_unidad: objFactura.descuentosUnidadesSeminuevos[0]?.toma_unidad ?? 0,
              },
            ];
          }
        }
  
        factura.value = { ...objFactura };
        modalDescuentos.value = true;
      } catch (error) {
        console.error(error);
      }
    };

    const guardarDescuento = async () => {
      try {
        if (factura.value.condicion === "nuevas") {
          factura.value.descuentosUnidades.forEach((descuento) => {
            descuento.idFactura = factura.value.idFactura;
            descuento.usuario = usuarioAutenticado.value.usuario;
          });
        } else {
          factura.value.descuentosUnidadesSeminuevos.forEach((descuento) => {
            descuento.idFactura = factura.value.idFactura;
            descuento.usuario = usuarioAutenticado.value.usuario;
          });
        }

        await guardarDescuentos(
          factura.value.condicion === "nuevas"
            ? factura.value.descuentosUnidades[0]
            : factura.value.descuentosUnidadesSeminuevos[0],
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
