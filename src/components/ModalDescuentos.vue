<template>
    <q-dialog v-model="modalDescuentos"  style="max-width: 200px, color: blue">
      <q-card style="max-width: 200px, color: blue">
        <q-card-section class="bg-primary text-white row items-center q-pb-none">
          <h2 class="text-h4">Agregar Descuentos</h2>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form>
            <div class="row">
              <div class="col-md-6">
                <div class="q-pa-md">
                  <label>Agregar Previa. </label>
                  <q-input  dense filled label="Previa" v-model="factura.descuentosUnidades[0].previa" type="number" color="primary">
                  <template v-slot:prepend>
                    <q-icon name="paid" />
                  </template>
                  </q-input>
                </div>

                <div class="q-pa-md">
                  <label>Agregar Traslado.</label>
                  <q-input  dense filled label="Traslado" v-model="factura.descuentosUnidades[0].traslado" type="number" color="primary">
                  <template v-slot:prepend>
                    <q-icon name="paid" />
                  </template>
                </q-input>
                </div>

                <div class="q-pa-md">
                  <label>Agregar Desc/Ventas.</label>
                  <q-input  dense filled label="Desc/Ventas" v-model="factura.descuentosUnidades[0].descVentas" type="number" color="primary">
                  <template v-slot:prepend>
                    <q-icon name="paid" />
                  </template>
                </q-input>
                </div>
              </div>

              <div class="col-md-6">
                <div class="q-pa-md">
                  <label>Agregar Cortesia.</label>
                  <q-input  dense filled label="Cortesia" v-model="factura.descuentosUnidades[0].cortesia" type="number" color="primary">
                  <template v-slot:prepend>
                    <q-icon name="paid" />
                  </template>
                </q-input>
                </div>

                <div class="q-pa-md">
                  <label>Agregar Gasolina.</label>
                  <q-input  dense filled label="Gasolina" v-model="factura.descuentosUnidades[0].gasolina" type="number" color="primary">
                  <template v-slot:prepend>
                    <q-icon name="paid" />
                  </template>
                </q-input>
                </div>

                <div class="q-pa-md">
                  <label>Agregar Bono U.B.</label>
                  <q-input  dense filled label="Bono U.B." v-model="factura.descuentosUnidades[0].bonoub" type="number" color="primary">
                  <template v-slot:prepend>
                    <q-icon name="paid" />
                  </template>
                </q-input>
                </div>
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
  import { ref } from 'vue'
  import { useComisionesStore } from 'src/stores/catalogos/comisionesUnidades.js'
  import { useAutenticacionStore } from 'src/stores/autenticaciones'
  import { storeToRefs } from 'pinia'

  export default {
      setup () {

        const useComisiones = useComisionesStore()
        const { guardarDescuentos } = useComisiones

        const useAutenticacion = useAutenticacionStore()
        const { usuarioAutenticado } = storeToRefs(useAutenticacion)

        const modalDescuentos = ref(false)
        const factura = ref({})

        const abrir = (objFactura) => {
          if(objFactura.descuentosUnidades.length === 0){
            objFactura.descuentosUnidades = [{
              previa: 0,
              traslado: 0,
              descVentas: 0,
              cortesia: 0,
              gasolina: 0,
              bonoub: 0
            }]
          }
          factura.value = {...objFactura}
          modalDescuentos.value = true
        }

        const guardarDescuento = async() => {
          factura.value.descuentosUnidades.forEach((descuento) => {
            descuento.idFactura = factura.value.idFactura
            descuento.usuario = usuarioAutenticado.value.usuario
          })
           await guardarDescuentos(factura.value.descuentosUnidades[0])
           modalDescuentos.value = false
        }

          return {
            abrir,
            factura,
            modalDescuentos,
            guardarDescuento,
          }
      }
  }

  </script>

