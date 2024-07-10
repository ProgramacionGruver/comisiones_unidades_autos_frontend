<template>
  <q-layout>
    <div class="q-ma-md">
      <div class="q-pa-md">
        <h2>{{ titulo }}</h2>
        <q-separator color="primary" class="q-my-md" />
        <q-card>
          <q-card-section class="fit row q-gutter-md justify-end q-mt-md">
            <div class="col" style="display: block">
              <label>Seleccione el año</label>
              <q-select
                outlined
                dense
                :options="listaAnios"
                v-model="anioSeleccionado"
                map-options
                option-value="name"
                :disable="cargando_1"
              />
            </div>
            <div class="col" style="display: block">
              <label>Seleccione el mes</label>
              <q-select
                outlined
                dense
                :options="listaMeses"
                v-model="mesSeleccionado"
                map-options
                option-value="name"
                :disable="cargando_1"
              />
            </div>
            <div class="col">
              <label>Seleccione un vendedor</label>
              <q-select
                v-model="vendedorSeleccionado"
                outlined
                dense
                label="Vendedor"
                :options="opcionesEmpleados"
                option-value="value"
                option-label="label"
                style="width: 100%"
                @filter="parametrosFiltradosVendedores"
                clearable
                use-input
                input-debounce="0"
                :disable="cargando_1"
              />
            </div>
            <div class="col">
              <label class="text-white">...</label>
              <q-btn
                class="col"
                style="width: 100%"
                color="primary"
                icon="search"
                label="Buscar"
                :disable="cargando_1"
                :loading="cargando_2"
                @click="buscarComision"
              >
                <template v-slot:loading>
                  <q-spinner-facebook color="white" />
                </template>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
        <div v-if="cargando_2" class="spinner--div">
          <q-spinner size="20rem" color="primary" />
          <label>Espere un momento a que los datos sean cargados...</label>
        </div>
        <div v-else-if="!comisionBonoVendedor && noHayDatos">
          <q-card>
            <q-card-section
              class="fit column q-gutter-md justify-center items-center q-pb-lg q-pl-lg q-pr-lg q-mt-md"
            >
              <label class="text-h4 text-center"
                >El vendedor no cuenta con facturas para este periodo</label
              >
              <q-btn
                class="col"
                style="width: 50%"
                color="primary"
                label="Aprobar bono"
                icon="check"
                @click="aprobarBonoVendedor"
                :loading="cargando_3"
              >
                <template v-slot:loading>
                  <q-spinner-facebook color="white" />
                </template>
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
        <div v-else-if="datosCargados && !cargando_2">
          <q-card class="q-mt-md">
            <q-card-section>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div style="display: block">
                  <div>
                    <strong>Nombre:</strong>
                    {{ comisionBonoVendedor.infoVendedor.nombreEmpleado }}
                  </div>
                  <div>
                    <strong>No. de empleado:</strong>
                    {{ comisionBonoVendedor.infoVendedor.numeroEmpleado }}
                  </div>
                  <div>
                    <strong>Nivel:</strong>
                    <q-chip
                      v-if="comisionBonoVendedor.infoVendedor.nivel === 'oro'"
                      color="orange"
                      text-color="white"
                      label="ORO"
                    />
                    <q-chip
                      v-else-if="
                        comisionBonoVendedor.infoVendedor.nivel === 'plata'
                      "
                      color="grey"
                      text-color="white"
                      label="PLATA"
                    />
                    <q-chip
                      v-if="
                        comisionBonoVendedor.infoVendedor.nivel === 'bronce'
                      "
                      color="brown"
                      text-color="white"
                      label="BRONCE"
                    />
                    <q-chip
                      v-if="
                        comisionBonoVendedor.infoVendedor.nivel === 'asesor'
                      "
                      color="green"
                      text-color="white"
                      label="ASESOR"
                    />
                  </div>
                </div>
                <div>
                  <q-btn
                    icon="check"
                    color="primary"
                    label="Aprobar bono"
                    class="q-mr-md"
                    @click="aprobarBonoVendedor"
                  />
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <q-scroll-area style="height: 80rem; width: 100%">
                <q-table
                  square
                  dense
                  flat
                  hide-bottom
                  class="my-sticky-header-column-table"
                  :rows="comisionBonoVendedor.facturas"
                  :columns="columnasFacturas"
                  no-data-label="No se encontró informacion disponible."
                  no-results-label="No se encontraron coincidencias."
                  :pagination="pagination"
                  v-if="
                    comisionBonoVendedor.infoVendedor.claveDepartamento ===
                    'SEM'
                  "
                >
                  <template v-slot:body="props">
                    <q-tr
                      v-if="props.row.tipoRenglon === 'dato'"
                      :props="props"
                    >
                      <q-td style="text-align: center">
                        {{ props.row.folioFactura }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{ props.row.fechaFactura }}
                      </q-td>
                      <q-td>
                        {{ props.row.tasaCredito }}
                      </q-td>
                      <q-td>
                        {{ props.row.modelo }}
                      </q-td>
                      <q-td>
                        {{ props.row.serie }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.utilidad.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.previa.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.traslado.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.descuentoVentas.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.cortesias.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.gasolina.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.bono.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.baseComision.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                    </q-tr>

                    <q-tr
                      v-if="props.row.tipoRenglon === 'total'"
                      :props="props"
                    >
                      <q-td>
                        {{ props.row.folioFactura }}
                      </q-td>
                      <q-td>
                        {{ props.row.fechaFactura }}
                      </q-td>
                      <q-td>
                        {{ props.row.tasaCredito }}
                      </q-td>
                      <q-td>
                        {{ props.row.modelo }}
                      </q-td>
                      <q-td style="text-align: left; background-color: yellow">
                        {{ props.row.serie }}
                      </q-td>
                      <q-td
                        style="text-align: center; background-color: yellow"
                      >
                        {{
                          Number(props.row.utilidad).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td
                        style="text-align: center; background-color: yellow"
                      >
                        {{
                          Number(props.row.previa).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td
                        style="text-align: center; background-color: yellow"
                      >
                        {{
                          Number(props.row.traslado).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td
                        style="text-align: center; background-color: yellow"
                      >
                        {{
                          Number(props.row.descuentoVentas).toLocaleString(
                            "es-MX",
                            {
                              style: "currency",
                              currency: "MXN",
                            }
                          )
                        }}
                      </q-td>
                      <q-td
                        style="text-align: center; background-color: yellow"
                      >
                        {{
                          Number(props.row.cortesias).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td
                        style="text-align: center; background-color: yellow"
                      >
                        {{
                          Number(props.row.gasolina).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td
                        style="text-align: center; background-color: yellow"
                      >
                        {{
                          Number(props.row.bono).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td
                        style="text-align: center; background-color: yellow"
                      >
                        {{
                          Number(props.row.baseComision).toLocaleString(
                            "es-MX",
                            {
                              style: "currency",
                              currency: "MXN",
                            }
                          )
                        }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>

                <q-table
                  square
                  dense
                  flat
                  hide-bottom
                  class="my-sticky-header-column-table"
                  :rows="comisionBonoVendedor.facturas"
                  :columns="columnasFacturasSeminuevas"
                  no-data-label="No se encontró informacion disponible."
                  no-results-label="No se encontraron coincidencias."
                  :pagination="pagination"
                  v-else-if="
                    comisionBonoVendedor.infoVendedor.claveDepartamento ===
                    'NUE'
                  "
                >
                  <template v-slot:body="props">
                    <q-tr
                      v-if="props.row.tipoRenglon === 'dato'"
                      :props="props"
                    >
                      <q-td style="text-align: center">
                        {{ props.row.folioFactura }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{ props.row.fechaFactura }}
                      </q-td>
                      <q-td>
                        {{ props.row.tasaCredito }}
                      </q-td>
                      <q-td>
                        {{ props.row.modelo }}
                      </q-td>
                      <q-td>
                        {{ props.row.serie }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.utilidad.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.garantia_extendida.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.acondicionamiento.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.gestorias.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.toma_unidad.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.cortesias.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.bono.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.baseComision.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>

                <q-table
                  square
                  dense
                  flat
                  hide-bottom
                  class="my-sticky-header-column-table q-mt-lg"
                  :rows="comisionBonoVendedor.pvas"
                  :columns="columnasPvas"
                  no-data-label="No se encontró informacion disponible."
                  no-results-label="No se encontraron coincidencias."
                  :pagination="pagination"
                >
                  <template v-slot:body="props">
                    <q-tr
                      v-if="props.row.tipoRenglon === 'dato'"
                      :props="props"
                    >
                      <q-td>
                        {{ props.row.nombreCliente.toUpperCase() }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          Number(props.row.utilidad).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{ props.row.pva.toUpperCase() }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{ props.row.fi }}
                      </q-td>
                    </q-tr>

                    <q-tr
                      v-if="props.row.tipoRenglon === 'total'"
                      :props="props"
                    >
                      <q-td style="background-color: yellow">
                        {{ props.row.nombreCliente }}
                      </q-td>
                      <q-td
                        style="text-align: center; background-color: yellow"
                      >
                        {{
                          Number(props.row.utilidad).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td>
                        {{ props.row.pva }}
                      </q-td>
                      <q-td>
                        {{ props.row.fi }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>

                <q-table
                  square
                  dense
                  flat
                  hide-bottom
                  class="my-sticky-header-column-table q-mt-lg"
                  :rows="comisionBonoVendedor.totalUtilidadBruta"
                  :columns="columnasUtilidadBruta"
                  no-data-label="No se encontró informacion disponible."
                  no-results-label="No se encontraron coincidencias."
                  :pagination="pagination"
                  v-if="
                    comisionBonoVendedor.infoVendedor.claveDepartamento ===
                    'SEM'
                  "
                >
                  <template v-slot:body="props">
                    <q-tr>
                      <q-td style="text-align: center">
                        {{
                          props.row.totalBaseComision.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.totalPvas.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.totalUtilidadBruta.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>

                <q-table
                  square
                  dense
                  flat
                  hide-bottom
                  class="my-sticky-header-column-table q-mt-lg"
                  :rows="comisionBonoVendedor.totalUtilidadBruta"
                  :columns="columnasUtilidadBrutaSeminuevos"
                  no-data-label="No se encontró informacion disponible."
                  no-results-label="No se encontraron coincidencias."
                  :pagination="pagination"
                  v-if="
                    comisionBonoVendedor.infoVendedor.claveDepartamento ===
                    'NUE'
                  "
                >
                  <template v-slot:body="props">
                    <q-tr>
                      <q-td style="text-align: center">
                        {{
                          props.row.totalBaseComision.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.totalPvas.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.totalPlanPiso.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                      <q-td style="text-align: center">
                        {{
                          props.row.totalUtilidadBruta.toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })
                        }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-scroll-area>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <ModalAprobarBono ref="modalAprobarBono" />
  </q-layout>
</template>

<script>
import { onMounted, ref } from "vue";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { storeToRefs } from "pinia";
import { listaMeses, listaAnios } from "src/helpers/listas";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj";
import { useKpiStore } from "src/stores/catalogos/kpis";
import ModalAprobarBono from "src/components/ModalAprobarBono.vue";
import { notificacion } from "src/helpers/mensajes";
import { obtenerNumerosDeMes } from "src/constant/constantes";

export default {
  components: {
    ModalAprobarBono,
  },
  setup() {
    const useAutenticaciones = useAutenticacionStore();
    const { perfilUsuario } = storeToRefs(useAutenticaciones);

    const useFacturas = useFacturasStore();
    const { opcionesVendedores, anioSeleccionado, mesSeleccionado } =
      storeToRefs(useFacturas);

    const useKpis = useKpiStore();
    const { obtenerComisionBonoVendedor } = useKpis;
    const { comisionBonoVendedor } = storeToRefs(useKpis);

    const titulo = ref("...");

    const vendedorSeleccionado = ref(null);
    const opcionesEmpleados = ref([...opcionesVendedores.value]);

    const cargando_1 = ref(true);
    const cargando_2 = ref(false);
    const cargando_3 = ref(false);
    const datosCargados = ref(false);
    const noHayDatos = ref(false);

    const modalAprobarBono = ref(null);

    const columnasFacturas = [
      {
        name: "folioFactura",
        label: "Folio",
      },
      {
        name: "fechaFactura",
        label: "Fecha",
      },
      {
        name: "tasaCredito",
        label: "Tasa de crédito",
      },
      {
        name: "modelo",
        label: "Modelo",
      },
      {
        name: "serie",
        label: "Serie",
      },
      {
        name: "utilidad",
        label: "Utilidad",
      },
      {
        name: "previa",
        label: "Previa",
      },
      {
        name: "traslado",
        label: "Traslado",
      },
      {
        name: "descuentoVentas",
        label: "Descuento ventas",
      },
      {
        name: "cortesias",
        label: "Cortesías",
      },
      {
        name: "gasolina",
        label: "Gasolina",
      },
      {
        name: "bonoub",
        label: "Bono",
      },
      {
        name: "baseComision",
        label: "Base comisión",
      },
    ];

    const columnasFacturasSeminuevas = [
      {
        name: "folioFactura",
        label: "Folio",
      },
      {
        name: "fechaFactura",
        label: "Fecha",
      },
      {
        name: "tasaCredito",
        label: "Tasa de crédito",
      },
      {
        name: "modelo",
        label: "Modelo",
      },
      {
        name: "serie",
        label: "Serie",
      },
      {
        name: "utilidad",
        label: "Utilidad",
      },
      {
        name: "garantia_extendida",
        label: "Garantía extendida",
      },
      {
        name: "acondicionamiento",
        label: "Acondicionamiento",
      },
      {
        name: "gestorias",
        label: "Gestorías",
      },
      {
        name: "toma_unidad",
        label: "Toma unidad",
      },
      {
        name: "cortesias",
        label: "Cortesías",
      },
      {
        name: "bonoub",
        label: "Bono",
      },
      {
        name: "baseComision",
        label: "Base comisión",
      },
    ];

    const columnasPvas = [
      {
        name: "nombreCliente",
        label: "Cliente",
      },
      {
        name: "utilidad",
        label: "Utilidad",
      },
      {
        name: "pva",
        label: "PVA",
      },
      {
        name: "fi",
        label: "F&I",
      },
    ];

    const columnasUtilidadBruta = [
      {
        name: "totalBaseComision",
        label: "Total base comisión",
      },
      {
        name: "totalPvas",
        label: "Total PVA's",
      },
      {
        name: "totalUtilidadBruta",
        label: "Total utilidad bruta",
      },
    ];

    const columnasUtilidadBrutaSeminuevos = [
      {
        name: "totalBaseComision",
        label: "Total base comisión",
      },
      {
        name: "totalPvas",
        label: "Total PVA's",
      },
      {
        name: "totalPlanPiso",
        label: "Plan piso",
      },
      {
        name: "totalUtilidadBruta",
        label: "Total utilidad bruta",
      },
    ];

    onMounted(async () => {
      if (
        perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
        "AUXILIAR NUEVAS"
      ) {
        titulo.value =
          "Calculador de Bono de Vendedores de Seminuevas para Unidades Nuevas";
      } else if (
        perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
        "AUXILIAR SEMINUEVAS"
      ) {
        titulo.value =
          "Calculador de Bono de Vendedores de Unidades Nuevas para Seminuevas";
      } else {
        titulo.value = "Calculador de Bono de Vendedores de Otro Departamento";
      }

      cargando_1.value = false;
    });

    const parametrosFiltradosVendedores = (val, update) => {
      filtradoBusquedaObj(
        val,
        update,
        opcionesVendedores.value,
        opcionesEmpleados
      );
    };

    const buscarComision = async () => {
      cargando_2.value = true;

      if (!vendedorSeleccionado.value) {
        cargando_2.value = false;
        notificacion("warning", "Debe seleccionar un vendedor para continuar");
        return;
      }

      if (!anioSeleccionado.value || !mesSeleccionado.value) {
        cargando_2.value = false;
        notificacion(
          "warning",
          "Debe seleccionar un año y un mes para continuar"
        );
        return;
      }

      const data = {
        anio: anioSeleccionado.value,
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
        idAsesor: vendedorSeleccionado.value.value.idAsesor,
        claveDepartamentoVendedor:
          vendedorSeleccionado.value.value.claveDepartamento,
      };

      await obtenerComisionBonoVendedor(data);

      if (comisionBonoVendedor.value) {
        datosCargados.value = true;
      } else {
        noHayDatos.value = true;
      }

      cargando_2.value = false;
    };

    const aprobarBonoVendedor = () => {
      let data = {};

      if (comisionBonoVendedor.value) {
        data = {
          infoVendedor: comisionBonoVendedor.value.infoVendedor,
          monto:
            comisionBonoVendedor.value.totalUtilidadBruta[0].totalBaseComision,
        };
      } else {
        data = {
          infoVendedor: vendedorSeleccionado.value.value,
          monto: 0,
        };
      }

      modalAprobarBono.value.abrir(data);
    };

    return {
      // States
      titulo,
      listaAnios,
      anioSeleccionado,
      listaMeses,
      mesSeleccionado,
      vendedorSeleccionado,
      opcionesEmpleados,
      cargando_1,
      cargando_2,
      cargando_3,
      columnasFacturas,
      columnasFacturasSeminuevas,
      columnasPvas,
      columnasUtilidadBruta,
      columnasUtilidadBrutaSeminuevos,
      comisionBonoVendedor,
      datosCargados,
      pagination: ref({ rowsPerPage: 10000 }),
      noHayDatos,
      modalAprobarBono,
      // Methods
      parametrosFiltradosVendedores,
      buscarComision,
      aprobarBonoVendedor,
    };
  },
};
</script>

<style>
.spinner--div {
  width: 100%;
  margin-top: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 3rem;
}
</style>

<style>
.my-sticky-header-column-table tr th {
  position: sticky;
  z-index: 2;
  background: #006ab2;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  color: white;
}
</style>
