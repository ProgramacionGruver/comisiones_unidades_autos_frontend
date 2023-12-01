<template>
    <q-dialog v-model="modalPolizaAjuste" @hide="resetForm" style="max-width: 200px, color: blue">
      <q-card style="max-width: 200px, color: blue">
        <q-card-section class="bg-primary text-white row items-center q-pb-none">
          <h2 class="text-h4">Subir PVAS</h2>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form>
            <div class="q-my-xs">
              <label>Selecciona la sucursal. </label>
            </div>
            <div class="row justify-around" style="width: 40rem;">
              <q-select class="col-12 q-mx-xs"
                outlined
                dense
                :options="opcionesSucursales"
                v-model="sucursalSeleccionada"
                />
              </div>
              <div class="q-pt-md q-pb-xs">
                <label>Selecciona la quincena.</label>
              </div>
              <div class="row justify-around" style="width: 40rem;">
                <q-select class="col-12 q-mx-xs"
                  outlined
                  dense
                  :options="listaQuincenas"
                  v-model="quincenaSeleccionada"
                />
              </div>
            <div class="q-my-md">
              <label>Selecciona el mes y año de los pvas. </label>
            </div>
            <div class="row justify-around">
              <q-select class="col-5 q-mx-xs"
                  outlined
                  dense
                  :options="anios"
                  v-model="anioSeleccionado"
                  label="Año"
                  map-options
                  option-value="name"
                />
              <q-select class="col-5 q-mx-xs"
                  outlined
                  dense
                  :options="meses"
                  v-model="mesSeleccionado"
                  label="Mes"
                  map-options
                  option-value="name"
                />
              </div>
              <div class="q-my-md">
                <label>Selecciona el archivo. </label>
              </div>
              <q-file
                      color="teal"
                      required
                      outlined
                      dense
                      v-model="modelPolizaArchivo"
                      label="Ingresa la poliza"
                      accept=".xlsx, .xls, .csv/*"
                >
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" />
                </template>
                </q-file>
              <q-card-actions align="right">
                <q-btn
                icon-right="save"
                label="Guardar"
                color="primary"
                :loading="cargando"
                @click="handleFileUpload(modelPolizaArchivo)"
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
  import * as XLSX from 'xlsx'
  import { ref } from 'vue'
  import { storeToRefs } from "pinia"
  import { listaQuincenas } from 'src/helpers/listas'
  import { meses, anios, mes } from 'src/constant/constantes'
  import { useSucursalesStore } from 'src/stores/catalogos/sucursales'
  import { useFacturasStore } from 'src/stores/catalogos/facturas'



  export default {
      setup () {
        const useFacturas = useFacturasStore()
        const { mesSeleccionado, anioSeleccionado, quincenaSeleccionada } = storeToRefs(useFacturas)

        const useSucursales = useSucursalesStore()
        const { opcionesSucursales, sucursalSeleccionada } = storeToRefs(useSucursales)

        const modalPolizaAjuste = ref(false)
        const modelPolizaArchivo = ref(null)
        const nombrePropiedad = 'F&I'

        const abrir = () => {
          modelPolizaArchivo.value = null
          modalPolizaAjuste.value = true
          sucursalSeleccionada.value = opcionesSucursales.value[0]
        }

        //Metodo para manejar ya el Json Convertido
        const handleFileUpload = (file) => {
            if (file) {
              convertExcelToJson(file)
                .then((jsonData) => {
                  //Darle estructura al json resultante
                  const transformedData = jsonData.map((obj) => {
                      return {
                        //Los datos que cambiare su nombre
                        cliente: obj.NOMBRE,
                        utilidad: obj.UTILIDAD,
                        pva: obj.PVA,
                        numeroEmpleado: obj.NUMEROEMPLEADO,
                        nombreEmpleado: obj.VENDEDOR,
                        fi: obj[nombrePropiedad]
                      }
                    })
                    console.log(transformedData)
                })
                .catch((error) => {
                  console.error('Error al convertir el archivo de Excel a JSON', error)
                })
            }
          }

        const convertExcelToJson = (file) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();

              reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const headers = jsonData[0];
                const rows = jsonData.slice(1);

                const jsonObjects = rows.map((row) => {
                  const obj = {};

                  headers.forEach((header, index) => {
                    const value = row[index];
                    const trimmedValue = typeof value === 'string' ? value.trim() : value;
                    obj[header] = trimmedValue !== '' && trimmedValue !== undefined ? trimmedValue : null;
                  });

                  return obj;
                });

                const filteredJsonObjects = jsonObjects.filter((obj) => {
                  return Object.values(obj).some((value) => value !== null);
                });

                resolve(filteredJsonObjects);
              };

              reader.onerror = (e) => {
                reject(e);
              };

              reader.readAsArrayBuffer(file);
            });
          };

          return {
            abrir,
            handleFileUpload,
            modalPolizaAjuste,
            mesSeleccionado,
            anioSeleccionado,
            anios,
            meses,
            mes,
            opcionesSucursales,
            sucursalSeleccionada,
            listaQuincenas,
            quincenaSeleccionada,
            modelPolizaArchivo,
          }
      }
  }

  </script>

