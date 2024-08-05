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
          <div
            style="
              width: 100%;
              display: grid;
              grid-template-columns: 1.8fr 1.8fr 0.4fr;
              column-gap: 1rem;
            "
          >
            <div>
              <label>Seleccione el año</label>
              <q-select
                outlined
                dense
                :options="listaAnios"
                v-model="anioSeleccionado"
                map-options
                option-value="name"
              />
            </div>
            <div>
              <label>Seleccione el mes</label>
              <q-select
                outlined
                dense
                :options="listaMeses"
                v-model="mesSeleccionado"
                map-options
                option-value="name"
              />
            </div>
            <div>
              <label class="text-white">......</label>
              <q-btn
                label="Buscar"
                icon-right="search"
                color="primary"
                @click="obtenerAutorizaciones"
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

        <template v-slot:body-cell-estatus="props">
          <q-td class="text-center">
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
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td class="text-center">
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
              <!-- <q-btn
                icon="download"
                color="primary"
                flat
                dense
                round
                @click="descargarPDF(props.row.urlPDF)"
              >
                <q-tooltip>Descargar PDF</q-tooltip>
              </q-btn> -->
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-autorizaciones="props">
          <q-td>
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
                    definirAutorizacion(autorizacion.idEstatusAutorizacion).icon
                  "
                >
                  <q-tooltip>
                    {{
                      autorizacion.catalogo_tipo_autorizacion.nombreAutorizacion
                    }}
                  </q-tooltip>
                </q-icon>
              </template>
            </div>
          </q-td>
        </template>
      </q-table>
      <div v-show="autorizacionSeleccionada.length > 0">
        <div
          class="q-ma-md"
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          "
        >
          <h3 style="text-align: center">Detalle de la autorización</h3>
          <q-table
            :columns="columnsDetalles"
            :rows="
              autorizacionSeleccionada[0] &&
              autorizacionSeleccionada[0]
                .autorizaciones_comisiones_autos_detalles
                ? autorizacionSeleccionada[0]
                    .autorizaciones_comisiones_autos_detalles
                : []
            "
            hide-bottom
          >
            <template v-slot:body-cell-tipoAutorizacion="props">
              <q-td>
                <div class="text-center">
                  {{ props.row.catalogo_tipo_autorizacion.nombreAutorizacion }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-estatus="props">
              <q-td>
                <div class="text-center">
                  <q-chip
                    :color="
                      definirAutorizacion(props.row.idEstatusAutorizacion).color
                    "
                    :class="
                      props.row.idEstatusAutorizacion === 1
                        ? 'text-black'
                        : 'text-white'
                    "
                    :label="
                      definirAutorizacion(props.row.idEstatusAutorizacion).texto
                    "
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
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
import { ref } from "vue";
import { obtenerNumerosDeMes } from "src/constant/constantes";
import { definirAutorizacion } from "src/helpers/coloresAutorizaciones";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { useFormulariosStore } from "src/stores/formularios";
import ModalCopiarUrl from "src/components/ModalCopiarUrl.vue";

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
        label: "Monto a pagar",
        align: "center",
        field: "monto",
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
    };
  },
};
</script>
