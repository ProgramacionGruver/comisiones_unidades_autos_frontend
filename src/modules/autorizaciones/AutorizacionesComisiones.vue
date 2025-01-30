<template>
  <q-layout>
    <div class="q-ma-md">
      <div class="q-pa-md">
        <h2>Autorizaciones</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        color="primary"
        :columns="columns"
        :rows="autorizaciones"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
        :loading="cargando"
        v-model:selected="autorizacionSeleccionada"
        selection="single"
        row-key="idAutorizacion"
        :pagination="pagination"
      >
        <template v-slot:top>
          <div class="fit row q-gutter-md">
            <div class="col">
              <label>Seleccione el año</label>
              <q-select
                outlined
                dense
                :options="listaAnios"
                v-model="anioSeleccionado"
                map-options
                option-value="name"
                @update:model-value="obtenerAutorizaciones"
              />
            </div>
            <div class="col">
              <label>Seleccione el mes</label>
              <q-select
                outlined
                dense
                :options="listaMeses"
                v-model="mesSeleccionado"
                map-options
                option-value="name"
                @update:model-value="obtenerAutorizaciones"
              />
            </div>
            <div class="col-auto">
              <div class="text-white">...</div>
              <q-btn
                color="green"
                label="Descargar layout"
                @click="descargarLayoutNomina"
                icon="fa-solid fa-file-excel"
              />
            </div>
          </div>
        </template>

        <template v-slot:body-cell-monto="props">
          <td class="text-center">
            {{
              props.row.monto.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            }}
          </td>
        </template>

        <template v-slot:header="props">
          <q-tr
            :props="props"
            style="background-color: #1052a0; color: white; font-weight: bold"
          >
            <q-th auto-width />
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :class="col.align"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox v-model="props.expand" :value="!props.expand" />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'numeroEmpleado'">
                {{
                  props.row.autorizaciones_comisiones_autos_detalles.find(
                    (autorizacion) => autorizacion.tipoEmpleado === "VENDEDOR"
                  ).numeroEmpleado
                }}
              </div>
              <div v-else-if="col.name === 'nombreEmpleado'">
                {{
                  props.row.autorizaciones_comisiones_autos_detalles.find(
                    (autorizacion) => autorizacion.tipoEmpleado === "VENDEDOR"
                  ).nombreEmpleado
                }}
              </div>
              <div v-else-if="col.name === 'autorizaciones'">
                <div
                  style="
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <template
                    v-for="autorizacion in props.row
                      .autorizaciones_comisiones_autos_detalles"
                    :key="autorizacion.idAutorizacionDetalle"
                  >
                    <q-icon
                      class="q-mx-sm"
                      size="2.5rem"
                      :color="
                        definirAutorizacion(autorizacion.idEstatusAutorizacion)
                          .color
                      "
                      :name="
                        definirAutorizacion(autorizacion.idEstatusAutorizacion)
                          .icon
                      "
                    >
                      <q-tooltip>
                        {{
                          autorizacion.catalogo_tipo_autorizacion
                            .nombreAutorizacion
                        }}
                      </q-tooltip>
                    </q-icon>
                  </template>
                </div>
              </div>
              <div v-else-if="col.name === 'estatus'">
                <q-td
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <div>
                    <q-chip
                      v-if="props.row.estatus === 0"
                      color="gray"
                      text-color="black"
                      label="PENDIENTE"
                    />

                    <q-chip
                      v-else-if="props.row.estatus === 1"
                      color="green"
                      text-color="white"
                      label="AUTORIZADA"
                    />

                    <q-chip
                      v-else-if="props.row.estatus === 2"
                      color="red"
                      text-color="white"
                      label="RECHAZADA"
                    />
                  </div>
                </q-td>
              </div>
              <div v-else-if="col.name === 'acciones'">
                <div
                  style="
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <q-btn
                    icon="content_copy"
                    color="primary"
                    flat
                    dense
                    round
                    @click="copiarURL(props.row)"
                    :loading="cargandoCopiar"
                  >
                    <q-tooltip>Copiar link</q-tooltip>

                    <template v-slot:loading>
                      <q-spinner color="primary" />
                    </template>
                  </q-btn>
                </div>
              </div>
              <div v-else-if="col.name === 'monto'">
                {{
                  props.row[col.name] > 0
                    ? props.row[col.name].toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })
                    : "0".toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })
                }}
              </div>
              <div v-else-if="col.name === 'totalBonos'">
                {{
                  props.row[col.name] > 0
                    ? props.row[col.name].toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })
                    : "0".toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })
                }}
              </div>
              <div v-else>
                {{ props.row[col.name] }}
              </div>
            </q-td>
          </q-tr>

          <q-tr
            v-show="props.expand"
            :props="props"
            style="background-color: #f0efef"
          >
            <q-td colspan="100%">
              <q-card>
                <q-card-section>
                  <q-table
                    :columns="columnsDetalles"
                    :rows="props.row.autorizaciones_comisiones_autos_detalles"
                    hide-bottom
                  >
                    <template v-slot:body-cell-tipoAutorizacion="props">
                      <q-td>
                        <div class="text-center">
                          {{
                            props.row.catalogo_tipo_autorizacion
                              .nombreAutorizacion
                          }}
                        </div>
                      </q-td>
                    </template>

                    <template v-slot:body-cell-estatus="props">
                      <q-td>
                        <div
                          style="
                            width: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                          "
                        >
                          <q-chip
                            :color="
                              definirAutorizacion(
                                props.row.idEstatusAutorizacion
                              ).color
                            "
                            :class="
                              props.row.idEstatusAutorizacion === 1
                                ? 'text-black'
                                : 'text-white'
                            "
                            :label="
                              definirAutorizacion(
                                props.row.idEstatusAutorizacion
                              ).texto
                            "
                          />
                        </div>
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <ModalCopiarUrl ref="modalCopiarUrl" />
  </q-layout>
</template>

<script>
import { storeToRefs } from "pinia";
import { listaMeses, listaAnios } from "src/helpers/listas";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { useAutorizacionesStore } from "src/stores/autorizaciones";
import { notificacion } from "src/helpers/mensajes";
import { onMounted, ref } from "vue";
import { obtenerNumerosDeMes } from "src/constant/constantes";
import { definirAutorizacion } from "src/helpers/coloresAutorizaciones";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { useFormulariosStore } from "src/stores/formularios";
import "@fortawesome/fontawesome-free/css/all.css";
import ModalCopiarUrl from "src/components/ModalCopiarUrl.vue";
import { convertirTablaCSV } from "src/helpers/generarCSV";

export default {
  components: {
    ModalCopiarUrl,
  },
  setup() {
    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const useAutorizaciones = useAutorizacionesStore();
    const {
      obtenerAutorizacionesByMes,
      obtenerInfoVendedorByID,
      obtenerInfoVendedorByNumeroEmpleado,
    } = useAutorizaciones;
    const { autorizaciones } = storeToRefs(useAutorizaciones);

    const useKpis = useKpiStore();
    const { obtenerComisionVendedor } = useKpis;
    const { comisionVendedor } = storeToRefs(useKpis);

    const useFormularios = useFormulariosStore();
    const { obtenerUrlComision } = useFormularios;
    const { urlComision } = storeToRefs(useFormularios);

    const cargando = ref(false);
    const cargandoCopiar = ref(false);
    const autorizacionSeleccionada = ref([]);

    const modalCopiarUrl = ref(null);

    const columns = [
      {
        name: "idAutorizacion",
        label: "#",
        align: "center",
        field: "idAutorizacion",
      },
      {
        name: "numeroEmpleado",
        label: "Número de empleado",
        align: "center",
        field: "autorizaciones_comisiones_autos_detalles",
      },
      {
        name: "nombreEmpleado",
        label: "Nombre del empleado",
        align: "center",
        field: "autorizaciones_comisiones_autos_detalles",
      },
      {
        name: "folio",
        label: "Folio",
        align: "center",
        field: "folio",
      },
      {
        name: "autorizaciones",
        label: "Autorizaciones",
        align: "center",
      },
      {
        name: "fechaPrimerEnvio",
        label: "Fecha de envío",
        align: "center",
        field: "fechaPrimerEnvio",
      },
      {
        name: "monto",
        label: "Monto a pagar comisión",
        align: "center",
        field: "monto",
      },
      {
        name: "totalBonos",
        label: "Monto a pagar bonos",
        align: "center",
        field: "totalBonos",
      },
      {
        name: "estatus",
        label: "Estatus",
        align: "center",
      },
      {
        name: "acciones",
        label: "Acciones",
        align: "center",
      },
    ];

    const columnsDetalles = [
      {
        name: "idAutorizacionDetalle",
        label: "#",
        align: "center",
        field: "idAutorizacionDetalle",
      },
      {
        name: "numeroEmpleado",
        label: "Número de empleado",
        align: "center",
        field: "numeroEmpleado",
      },
      {
        name: "nombreEmpleado",
        label: "Nombre del empleado",
        align: "center",
        field: "nombreEmpleado",
      },
      {
        name: "tipoAutorizacion",
        label: "Tipo de autorización",
        align: "center",
      },
      {
        name: "estatus",
        label: "Estatus",
        align: "center",
      },
      {
        name: "comentario",
        label: "Comentario",
        align: "center",
        field: "comentario",
      },
      {
        name: "tipoEmpleado",
        label: "Tipo de empleado",
        align: "center",
        field: "tipoEmpleado",
      },
    ];

    onMounted(async () => {
      await obtenerAutorizacionesByMes(
        Number(obtenerNumerosDeMes(mesSeleccionado.value)),
        anioSeleccionado.value
      );
    });

    const obtenerAutorizaciones = async () => {
      cargando.value = true;

      if (!anioSeleccionado.value) {
        notificacion("warning", "Seleccione un año para continuar");
        return;
      }

      if (!mesSeleccionado.value) {
        notificacion("warning", "Seleccione un mes para continuar");
        return;
      }

      await obtenerAutorizacionesByMes(
        Number(obtenerNumerosDeMes(mesSeleccionado.value)),
        anioSeleccionado.value
      );

      cargando.value = false;
    };

    const descargarPDF = async (link) => {
      window.open(link, "_blank");
    };

    const pagination = ref({
      rowsPerPage: 5,
    });

    const copiarURL = async (autorizacionObj) => {
      modalCopiarUrl.value.abrir(autorizacionObj);
    };

    const descargarLayoutNomina = () => {
      const columnas = [
        {
          label: "Codigo Trabajador",
          field: "numeroEmpleado",
        },
        {
          label: "ID Comision",
          field: "idComision",
        },
        {
          label: "Monto",
          field: "monto",
        },
        {
          label: "NUM. DE QUINCENAS",
          field: "numQuincenas",
        },
        {
          label: "Importe de la Comision",
          field: "monto",
        },
        {
          label: "Import de Bonos",
          field: "totalBonos",
        },
        {
          label: "Fecha Inicial",
          field: "fechaInicial",
        },
        {
          label: "Nombre",
          field: "nombreEmpleado",
        },
      ];

      const autorizacionesAutorizadas = autorizaciones.value.filter(
        (autorizacion) => autorizacion.estatus === 1
      );

      const datos = autorizacionesAutorizadas.map((autorizacion) => {
        return {
          numeroEmpleado:
            autorizacion.autorizaciones_comisiones_autos_detalles.find(
              (autorizacion) => autorizacion.tipoEmpleado === "VENDEDOR"
            ).numeroEmpleado,
          idComision: "NUEVAS",
          monto: autorizacion.monto,
          totalBonos: autorizacion.totalBonos,
          numQuincenas: 2,
          fechaInicial: "",
          nombreEmpleado:
            autorizacion.autorizaciones_comisiones_autos_detalles.find(
              (autorizacion) => autorizacion.tipoEmpleado === "VENDEDOR"
            ).nombreEmpleado,
        };
      });

      convertirTablaCSV(
        columnas,
        datos,
        `ComisionesUnidadesAutos_${obtenerNumerosDeMes(
          mesSeleccionado.value
        )}_${anioSeleccionado.value}`
      );
    };

    return {
      // States
      anioSeleccionado,
      mesSeleccionado,
      listaAnios,
      listaMeses,
      autorizaciones,
      cargando,
      autorizacionSeleccionada,
      columns,
      columnsDetalles,
      pagination,
      cargandoCopiar,
      modalCopiarUrl,
      // Methods
      obtenerAutorizaciones,
      descargarPDF,
      definirAutorizacion,
      copiarURL,
      descargarLayoutNomina,
    };
  },
};
</script>
