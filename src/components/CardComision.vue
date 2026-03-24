<template>
  <q-card v-if="comisionVendedor" class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <div>
        <div>
          <strong>Nombre:</strong>
          {{ comisionVendedor?.infoVendedor?.nombreEmpleado }}
        </div>
        <div>
          <strong>No. de empleado:</strong>
          {{ comisionVendedor?.infoVendedor?.numeroEmpleado }}
        </div>
        <div>
          <strong>Sucursal:</strong>
          {{ comisionVendedor?.infoVendedor?.claveSucursal }}
        </div>
      </div>

      <q-btn
        v-if="esCalculador"
        icon="send"
        color="primary"
        label="Enviar comisión"
        class="q-mr-md"
        @click="enviarComision"
      />
    </div>

    <q-tabs
      v-model="tabsComisiones"
      indicator-color="yellow"
      align="justify"
      class="bg-primary text-white"
    >
      <q-tab name="comision" label="Comisión Asesor" />
      <q-tab name="flotillas" label="Comisión Flotillas" />
    </q-tabs>

    <q-tab-panels v-model="tabsComisiones" animated class="bg-white">
      <q-tab-panel name="comision">
        <template v-if="tieneInfoComision">
          <q-tabs
            v-model="tabsDetalleComision"
            indicator-color="yellow"
            align="justify"
            class="bg-primary text-white"
          >
            <q-tab name="kpis" label="KPIs" />
            <q-tab name="facturas" label="Facturas" />
            <q-tab name="pvas" label="PVAs" />
            <q-tab name="descuentos" label="Bonos / Descuentos" />
            <q-tab name="bonoFijoSeminuevos" label="Bono fijo seminuevos" />
          </q-tabs>

          <q-tab-panels v-model="tabsDetalleComision" animated class="bg-white">
            <q-tab-panel name="kpis">
              <div>
                <div>
                  <span class="text-bold">Utilidad bruta facturas:</span>
                  {{
                    formatearMonto(
                      comisionVendedor?.detalleComision?.comision?.detalle
                        ?.utilidadBrutaFacturas
                    )
                  }}
                </div>
                <div>
                  <span class="text-bold">Base comisión:</span>
                  {{
                    formatearMonto(
                      comisionVendedor?.detalleComision?.comision?.detalle
                        ?.baseComision
                    )
                  }}
                </div>
                <div>
                  <span class="text-bold">Porcentaje U.B:</span>
                  {{
                    comisionVendedor?.detalleComision?.comision?.detalle
                      ?.esquema?.porcentajeUB
                  }}%
                </div>
                <div>
                  <span class="text-bold">Totales:</span>
                  <ul>
                    <li>
                      <span class="text-bold">Total a pagar KPIs + PVAs: </span
                      >{{
                        formatearMonto(
                          comisionVendedor?.detalleComision?.comision?.detalle
                            ?.totalAPagarKpis
                        )
                      }}
                    </li>
                    <li>
                      <span class="text-bold">Total Descuentos/Bonos: </span
                      >{{
                        formatearMonto(
                          comisionVendedor?.detalleComision?.comision?.detalle
                            ?.totalDescuentos
                        )
                      }}
                    </li>
                    <li>
                      <span class="text-bold">Total Bono Fijo Seminuevos: </span
                      >{{
                        formatearMonto(
                          comisionVendedor?.detalleComision?.comision?.detalle
                            ?.totalBonosFijosSeminuevos
                        )
                      }}
                    </li>
                  </ul>
                </div>
                <div>
                  <span class="text-bold">Total a pagar: </span>
                  {{
                    formatearMonto(
                      comisionVendedor?.detalleComision?.comision?.detalle
                        ?.comisionFinal
                    )
                  }}
                </div>
              </div>

              <div
                style="
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
                class="q-mt-md"
              >
                <div style="width: 50%">
                  <div
                    class="bg-primary text-white text-bold q-pa-sm text-center"
                  >
                    RANGOS
                  </div>
                  <table style="width: 100%">
                    <tr>
                      <template
                        v-for="rango in comisionVendedor?.detalleComision
                          ?.comision?.tablaRangos"
                        :key="'rango-' + rango.valor"
                      >
                        <td
                          :style="`background-color: ${rango.color}; font-weight: bold; padding: 5px;`"
                          class="text-center"
                        >
                          {{
                            `${rango.rangoMenor} - ${Math.floor(
                              rango.rangoMayor
                            )}%`
                          }}
                        </td>
                      </template>
                    </tr>
                    <tr>
                      <template
                        v-for="rango in comisionVendedor?.detalleComision
                          ?.comision?.tablaRangos"
                        :key="'valor-' + rango.valor"
                      >
                        <td class="text-center">{{ rango.valor }}%</td>
                      </template>
                    </tr>
                  </table>
                </div>
              </div>

              <q-table
                :columns="columnasKPIs"
                :rows="comisionVendedor?.detalleComision?.comision?.listaKpis"
                row-key="idKpi"
                :pagination="pagination"
                hide-bottom
                table-header-class="bg-primary text-white"
                class="q-mt-md tabla-personalizada"
              />
            </q-tab-panel>

            <q-tab-panel name="facturas">
              <q-table
                :columns="columnasFacturas"
                :rows="comisionVendedor?.detalleComision?.comision?.facturas"
                row-key="idFactura"
                :pagination="pagination"
                hide-bottom
                table-header-class="bg-primary text-white"
                class="q-mt-md"
              />
            </q-tab-panel>

            <q-tab-panel name="pvas">
              <template v-if="tienePvas">
                <q-table
                  :columns="columnasPvas"
                  :rows="comisionVendedor?.detalleComision?.comision?.pvas"
                  row-key="idPva"
                  :pagination="pagination"
                  hide-bottom
                  table-header-class="bg-primary text-white"
                  class="q-mt-md"
                />
              </template>

              <div
                v-else
                class="column justify-center items-center q-mt-md q-pa-md"
              >
                <q-icon
                  name="info"
                  size="5rem"
                  color="primary"
                  class="q-mb-sm"
                />
                <span class="text-h4 text-center"
                  >No cuenta con PVAs en el periodo seleccionado</span
                >
              </div>
            </q-tab-panel>

            <q-tab-panel name="descuentos">
              <template v-if="tieneDescuentosVendedor">
                <q-table
                  :columns="columnasDescuentosVendedor"
                  :rows="
                    comisionVendedor?.detalleComision?.comision
                      ?.descuentosVendedor
                  "
                  row-key="idDescuento"
                  :pagination="pagination"
                  hide-bottom
                  table-header-class="bg-primary text-white"
                  class="q-mt-md"
                />
              </template>

              <div
                v-else
                class="column justify-center items-center q-mt-md q-pa-md"
              >
                <q-icon
                  name="info"
                  size="5rem"
                  color="primary"
                  class="q-mb-sm"
                />
                <span class="text-h4 text-center"
                  >No hay descuentos o bonos registrados en el periodo
                  seleccionado</span
                >
              </div>
            </q-tab-panel>

            <q-tab-panel name="bonoFijoSeminuevos">
              <template v-if="tieneBonosFijosSeminuevos">
                <q-table
                  :columns="columnasBonoFijoSeminuevos"
                  :rows="
                    comisionVendedor?.detalleComision?.comision
                      ?.bonosFijosSeminuevos
                  "
                  row-key="idBonoFijoSeminuevos"
                  :pagination="pagination"
                  hide-bottom
                  table-header-class="bg-primary text-white"
                  class="q-mt-md"
                />
              </template>

              <div
                v-else
                class="column justify-center items-center q-mt-md q-pa-md"
              >
                <q-icon
                  name="info"
                  size="5rem"
                  color="primary"
                  class="q-mb-sm"
                />
                <span class="text-h4 text-center"
                  >No hay bonos fijos seminuevos en el periodo
                  seleccionado</span
                >
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>

        <div v-else class="column justify-center items-center q-mt-md q-pa-md">
          <q-icon name="cancel" size="10rem" color="red" class="q-mb-sm" />
          <span class="text-h4 text-center"
            >No se encontro la información necesaria para generar la comisión
            del asesor bajo el esquema de ASESOR COMERCIAL</span
          >
        </div>
      </q-tab-panel>

      <q-tab-panel name="flotillas">
        <template v-if="tieneInfoFlotillas">
          <div>
            <div>
              <span class="text-bold">Utilidad bruta facturas: </span>
              {{
                formatearMonto(
                  comisionVendedor?.detalleComision?.flotillas?.detalle
                    ?.utilidadBrutaFlotillas
                )
              }}
            </div>
            <div>
              <span class="text-bold">Porcentaje U.B: </span>
              {{
                comisionVendedor?.detalleComision?.flotillas?.detalle
                  ?.porcentajeUBFlotillas.porcentaje
              }}%
            </div>
            <div>
              <span class="text-bold">Total a pagar flotillas: </span>
              {{
                formatearMonto(
                  comisionVendedor?.detalleComision?.flotillas?.detalle
                    ?.totalAPagarFlotillas
                )
              }}
            </div>
          </div>

          <q-table
            :columns="columnasFacturasFlotillas"
            :rows="comisionVendedor.detalleComision.flotillas.facturasFlotillas"
            row-key="idFactura"
            :pagination="pagination"
            hide-bottom
            table-header-class="bg-primary text-white"
            class="q-mt-md"
          />
        </template>

        <div v-else class="column justify-center items-center q-mt-md q-pa-md">
          <q-icon name="cancel" size="10rem" color="red" class="q-mb-sm" />
          <span class="text-h4 text-center"
            >No se encontro la información necesaria para generar la comisión
            bajo el esquema de ASESOR COMERCIAL FLOTILLAS</span
          >
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <div v-if="!esCalculador" style="width: 100%">
      <div style="width: 100%">
        <q-input
          v-model="comentario"
          label="Comentario"
          outlined
          maxlength="250"
          class="q-mb-md"
          :disabled="cargando"
        />
      </div>
      <div class="botones--comision">
        <q-btn
          color="green"
          label="Aceptar"
          icon-right="check"
          @click="aceptar"
          :disabled="cargando"
        />
        <q-btn
          color="red"
          label="Rechazar"
          icon-right="close"
          @click="rechazar"
          :disabled="cargando"
        />
      </div>
    </div>
  </q-card>
  <modal-enviar-comision-asesor ref="modalEnviar" />
</template>

<script>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { formatearMonto } from "src/helpers/formatearMonto";
import { formatearFecha } from "src/helpers/formatearFecha";
import { useAutorizacionesStore } from "src/stores/autorizaciones";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import ModalEnviarComisionAsesor from "./ModalEnviarComisionAsesor.vue";

export default {
  components: {
    ModalEnviarComisionAsesor,
  },
  props: {
    esCalculador: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const useComisiones = useKpiStore();
    const { comisionVendedor } = storeToRefs(useComisiones);

    const useAutorizaciones = useAutorizacionesStore();
    const { aceptarAutorizacion, rechazarComision, validarAutorizador } =
      useAutorizaciones;
    const { autorizacionSeleccionada } = storeToRefs(useAutorizaciones);

    const useAutenticaciones = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticaciones);

    const tabsComisiones = ref("comision");
    const tabsDetalleComision = ref("kpis");

    const comentario = ref("");

    const cargando = ref(false);

    const tieneInfoComision = computed(
      () => !!comisionVendedor.value?.detalleComision?.comision
    );

    const tienePvas = computed(
      () =>
        (comisionVendedor.value?.detalleComision?.comision?.pvas || []).length >
        0
    );

    const tieneDescuentosVendedor = computed(
      () =>
        (
          comisionVendedor.value?.detalleComision?.comision
            ?.descuentosVendedor || []
        ).length > 0
    );

    const tieneBonosFijosSeminuevos = computed(
      () =>
        (
          comisionVendedor.value?.detalleComision?.comision
            ?.bonosFijosSeminuevos || []
        ).length > 0
    );

    const tieneInfoFlotillas = computed(() => {
      const flotillas = comisionVendedor.value?.detalleComision?.flotillas;
      if (!flotillas) return false;

      const tieneDetalle = !!flotillas?.detalle;
      const tieneFacturas = Array.isArray(flotillas?.facturasFlotillas)
        ? flotillas.facturasFlotillas.length > 0
        : false;

      return tieneDetalle || tieneFacturas;
    });

    const columnasKPIs = [
      {
        name: "nombreKpi",
        label: "KPI",
        field: "nombreKpi",
        align: "left",
      },
      {
        name: "objetivo",
        label: "Objetivo",
        field: (row) => row.objetivo,
        align: "center",
        format: (val, row) => {
          if (val === null || val === undefined) return null;
          if (row?.tipoKPI === 1) return formatearMonto(val);
          if (row?.tipoKPI === 3) return `${val}%`;
          return val;
        },
      },
      {
        name: "valorReal",
        label: "Objetivo valor real",
        field: (row) => row.valorReal,
        align: "center",
        format: (val, row) => {
          if (val === null || val === undefined) return null;
          if (row?.tipoKPI === 1) return formatearMonto(val);
          if (row?.tipoKPI === 3) return `${val}%`;
          return val;
        },
      },
      {
        name: "peso",
        label: "Peso",
        field: "peso",
        align: "center",
        format: (val) => (val ? `${val}%` : null),
      },
      {
        name: "porcentajeDeComision",
        label: "% de comisión",
        field: (row) =>
          row?.rango !== null && row?.rango !== undefined
            ? `${row.rango}%`
            : null,
        align: "center",
      },
      {
        name: "pagoCompleto",
        label: "Pago 100%",
        field: "monto100",
        align: "center",
        format: (val) => (val ? formatearMonto(val) : null),
      },
      {
        name: "montoAPagar",
        label: "Monto a pagar",
        field: "montoAPagar",
        align: "center",
        format: (val) => formatearMonto(val),
      },
    ];

    // Columnas base para facturas
    const columnasFacturasBase = [
      {
        name: "folioFactura",
        label: "Folio",
        field: "factura",
        align: "center",
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "fechaFactura",
        label: "Fecha",
        field: (row) => formatearFecha(row.fecha_facturacion),
        align: "center",
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "tipo_venta",
        label: "Tasa de venta",
        align: "center",
        field: "tipo_venta",
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "condicion",
        label: "Condición",
        align: "center",
        field: (row) => row.condicion.toUpperCase(),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "modelo",
        label: "Modelo",
        field: "modelo",
        align: "center",
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "serie",
        label: "Serie",
        field: "vin",
        align: "center",
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "utilidad",
        label: "Utilidad",
        align: "center",
        field: "utilidad",
        format: (val) => (val ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
    ];

    // Columna de gasto financiero
    const columnaGastoFinanciero = {
      name: "gastoFinanciero",
      label: "Gasto financiero",
      align: "center",
      field: (row) => row.descuentos.gastoFinanciero,
      format: (val, row) => {
        if (!val || val === null) return "N/A";
        return val.toLocaleString("es-MX", {
          style: "currency",
          currency: "MXN",
        });
      },
      style: (row) =>
        row.estadoFactura.toUpperCase() == "FACTURADA"
          ? "background-color: #77DD77"
          : "background-color: #FF6961;",
    };

    // Resto de columnas después de utilidad
    const columnasFacturasDespuesUtilidad = [
      {
        name: "previa",
        label: "Previa",
        align: "center",
        field: (row) => row.descuentos.previa,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "traslado",
        label: "Traslado",
        align: "center",
        field: (row) => row.descuentos.traslado,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "descuentoVentas",
        label: "Descuento ventas",
        align: "center",
        field: (row) => row.descuentos.descVentas,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "cortesias",
        label: "Cortesías",
        align: "center",
        field: (row) => row.descuentos.cortesia,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "gasolina",
        label: "Gasolina",
        align: "center",
        field: (row) => row.descuentos.gasolina,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "garantia_extendida",
        label: "Garantía extendida",
        align: "center",
        field: (row) => row.descuentos.garantia_extendida,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "acondicionamiento",
        label: "Acondicionamiento",
        align: "center",
        field: (row) => row.descuentos.acondicionamiento,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "gestorias",
        label: "Gestorías",
        align: "center",
        field: (row) => row.descuentos.gestorias,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "toma_unidad",
        label: "Toma unidad",
        align: "center",
        field: (row) => row.descuentos.toma_unidad,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "bonoub",
        label: "Bono",
        align: "center",
        field: (row) => row.descuentos.bonoub,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
      {
        name: "baseComision",
        label: "Base comisión",
        align: "center",
        field: (row) => row.baseComision,
        format: (val) => (val != null ? formatearMonto(val) : null),
        style: (row) =>
          row.estadoFactura.toUpperCase() == "FACTURADA"
            ? "background-color: #77DD77"
            : "background-color: #FF6961;",
      },
    ];

    const columnasPvas = [
      {
        name: "nombreCliente",
        label: "Cliente",
        field: "cliente",
        align: "center",
      },
      {
        name: "no_contrato",
        label: "No. contrato",
        field: "no_contrato",
        align: "center",
      },
      {
        name: "utilidad",
        label: "Utilidad",
        field: "utilidad",
        align: "center",
        format: (val) => (val != null ? formatearMonto(val) : null),
      },
      {
        name: "pva",
        label: "PVA",
        field: "pva",
        align: "center",
      },
      {
        name: "fi",
        label: "F&I",
        field: "fi",
        align: "center",
      },
    ];

    const columnasDescuentosVendedor = [
      {
        name: "nombreDescuento",
        label: "Descuento",
        field: (row) => row.catalogoFormularioDescuento.nombreDescuento,
        align: "center",
      },
      {
        name: "monto",
        label: "Monto",
        field: (row) => row.monto,
        align: "center",
        format: (val) => (val != null ? formatearMonto(val) : null),
      },
      {
        name: "descripcion",
        label: "Descripción",
        field: (row) => row.descripcion || "",
        align: "center",
      },
    ];

    const columnasBonoFijoSeminuevos = [
      {
        name: "factura",
        label: "Factura",
        field: (row) => row.factura.factura,
        align: "center",
      },
      {
        name: "ubAntesBonoFijo",
        label: "UB antes bono fijo",
        field: (row) => row.factura.ubAntesBonoFijo,
        align: "center",
        format: (val) => (val != null ? formatearMonto(val) : null),
      },
      {
        name: "montoBonoFijo",
        label: "Monto bono fijo",
        field: (row) => row.monto,
        align: "center",
        format: (val) => (val != null ? formatearMonto(val) : null),
      },
      {
        name: "createdAt",
        label: "Fecha registro bono fijo",
        field: (row) => formatearFecha(row.createdAt),
        align: "center",
      },
    ];

    const modalEnviar = ref(null);

    const enviarComision = () => {
      modalEnviar.value.abrir();
    };

    // Función para generar columnas de facturas dinámicamente
    const generarColumnasFacturas = (facturas) => {
      const columnas = [...columnasFacturasBase];

      if (requiereGastoFinanciero(facturas)) {
        columnas.push(columnaGastoFinanciero);
      }

      columnas.push(...columnasFacturasDespuesUtilidad);
      return columnas;
    };

    // Función para generar columnas de facturas de flotillas dinámicamente
    const generarColumnasFacturasFlotillas = (facturas) => {
      const columnas = [...columnasFacturasBase];

      if (requiereGastoFinancieroFlotillas(facturas)) {
        columnas.push(columnaGastoFinanciero);
      }

      columnas.push(...columnasFacturasDespuesUtilidad);
      return columnas;
    };

    // Columnas dinámicas para facturas
    const columnasFacturas = computed(() => {
      return generarColumnasFacturas(
        comisionVendedor.value?.detalleComision?.comision?.facturas
      );
    });

    // Columnas dinámicas para facturas de flotillas
    const columnasFacturasFlotillas = computed(() => {
      return generarColumnasFacturasFlotillas(
        comisionVendedor.value?.detalleComision?.comision?.flotillas
      );
    });

    // Función para verificar si alguna factura requiere mostrar gasto financiero
    const requiereGastoFinanciero = (facturas) => {
      if (!facturas || facturas.length === 0) return false;
      return facturas.some((factura) => {
        if (!factura.fecha_facturacion) return false;
        const fechaFactura = new Date(factura.fecha_facturacion);

        return (
          fechaFactura.getFullYear() >= 2025 &&
          (fechaFactura.getFullYear() > 2025 || fechaFactura.getMonth() >= 8)
        );
      });
    };

    // Función para verificar si flotillas requieren mostrar gasto financiero
    // Las flotillas NO aplican gasto financiero desde noviembre 2025
    const requiereGastoFinancieroFlotillas = (facturas) => {
      if (!facturas || facturas.length === 0) return false;
      return facturas.some((factura) => {
        if (!factura.fecha_facturacion) return false;
        const fechaFactura = new Date(factura.fecha_facturacion);
        const anio = fechaFactura.getFullYear();
        const mes = fechaFactura.getMonth(); // 0-11

        // Solo aplicar desde septiembre (mes 8) hasta octubre (mes 9) de 2025
        return anio === 2025 && mes >= 8 && mes <= 9;
      });
    };

    const aceptar = async () => {
      cargando.value = true;

      const autorizacionObj = {
        idAutorizacion: autorizacionSeleccionada.value.idAutorizacion,
        numeroEmpleado: usuarioAutenticado.value.numero_empleado,
        comentario: comentario.value,
      };

      await aceptarAutorizacion(autorizacionObj);
      await validarAutorizador(
        usuarioAutenticado.value.numero_empleado,
        autorizacionSeleccionada.value.idAutorizacion
      );

      cargando.value = false;
    };

    const rechazar = async () => {
      cargando.value = true;

      const autorizacionObj = {
        idAutorizacion: autorizacionSeleccionada.value.idAutorizacion,
        numeroEmpleado: usuarioAutenticado.value.numero_empleado,
        comentario: comentario.value,
      };

      await rechazarComision(autorizacionObj);
      await validarAutorizador(
        usuarioAutenticado.value.numero_empleado,
        autorizacionSeleccionada.value.idAutorizacion
      );

      cargando.value = false;
    };

    return {
      // States
      comisionVendedor,
      tabsComisiones,
      tabsDetalleComision,
      tieneInfoComision,
      tienePvas,
      tieneDescuentosVendedor,
      tieneBonosFijosSeminuevos,
      tieneInfoFlotillas,
      columnasKPIs,
      pagination: ref({ rowsPerPage: 1000 }),
      columnasFacturas,
      columnasPvas,
      columnasDescuentosVendedor,
      columnasFacturasFlotillas,
      columnasBonoFijoSeminuevos,
      modalEnviar,
      comentario,
      cargando,
      // Helpers
      formatearMonto,
      // Methods
      enviarComision,
      aceptar,
      rechazar,
    };
  },
};
</script>

<style>
.tabla-personalizada > div > table > tbody > tr:nth-child(8) {
  background: var(--q-secondary);
  color: white;
  font-weight: bold;
}
</style>
