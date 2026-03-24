<template>
  <q-layout>
    <div class="q-ma-md">
      <h2>Calculador de comisiones</h2>
      <q-separator color="primary" class="q-my-md" />
      <q-card>
        <q-card-section class="fit row justify-end q-gutter-md q-mt-md">
          <div class="col-3">
            <label>Seleccione el año</label>
            <q-select
              outlined
              dense
              :options="listaAnios"
              v-model="anioSeleccionado"
              map-options
              option-value="name"
              style="width: 100%"
              @update:model-value="datosCargados = false"
            />
          </div>
          <div class="col-3">
            <label>Seleccione el mes</label>
            <q-select
              outlined
              dense
              :options="listaMeses"
              v-model="mesSeleccionado"
              map-options
              option-value="name"
              style="width: 100%"
              @update:model-value="datosCargados = false"
            />
          </div>
          <div class="col-3">
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
              @update:model-value="datosCargados = false"
            />
          </div>
          <div class="col-2">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-btn
                color="primary"
                label="Buscar"
                icon-right="search"
                @click="buscarComisiones"
                class="q-mt-lg"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div v-if="cargando" class="spinner--div">
        <q-spinner size="20rem" color="primary" />
        <label>Espere un momento a que los datos sean cargados...</label>
      </div>
      <div v-else>
        <div v-if="datosCargados && !cargando">
          <q-card
            v-if="
              comisionVendedorSuAuto?.infoVendedor?.claveDepartamento ===
              'SUAUTO'
            "
          >
            <q-card-section>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 1rem;
                "
              >
                <div style="display: block">
                  <div>
                    <strong>Nombre:</strong>
                    {{ comisionVendedorSuAuto?.infoVendedor?.nombreEmpleado }}
                  </div>
                  <div>
                    <strong>No. de empleado:</strong>
                    {{ comisionVendedorSuAuto?.infoVendedor?.numeroEmpleado }}
                  </div>
                  <div>
                    <strong>Puesto:</strong>
                    {{
                      comisionVendedorSuAuto?.infoVendedor?.claveDepartamento
                    }}
                  </div>
                </div>
                <div>
                  <q-btn
                    icon="send"
                    color="primary"
                    label="Enviar comisión"
                    class="q-mr-md"
                    @click="enviarComision"
                  />
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-center text-bold text-h4 q-mb-md">CONTRATOS</div>
              <q-table
                square
                dense
                flat
                hide-bottom
                class="my-sticky-header-column-table"
                :rows="comisionVendedorSuAuto?.contratos"
                :columns="columnasComisionSuAuto"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="comisionVendedorSuAuto?.contratos?.length > 0"
              />
              <div v-else>
                <div class="text-h4 text-center">
                  Este asesor no cuenta con contratos de Su Auto para este
                  período
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-center text-bold text-h4 q-mb-md">
                FACTURACIÓN SUAUTO
              </div>
              <q-table
                square
                dense
                flat
                hide-bottom
                class="my-sticky-header-column-table"
                :rows="comisionVendedorSuAuto?.facturas"
                :columns="columnasFacturasSuAuto"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="comisionVendedorSuAuto?.facturas?.length > 0"
              />
              <div v-else>
                <div class="text-h4 text-center">
                  Este asesor no cuenta con facturación de unidades SuAuto para
                  este periodo
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-center text-bold text-h4 q-mb-md">
                FACTURACIÓN UNIDADES VENDIDAS
              </div>
              <q-table
                square
                dense
                flat
                hide-bottom
                class="my-sticky-header-column-table"
                :rows="comisionVendedorSuAuto?.unidadesVendidas.facturas"
                :columns="columnasFacturas"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="
                  comisionVendedorSuAuto?.unidadesVendidas.facturas.length > 0
                "
              >
                <template v-slot:body="props">
                  <q-td v-for="col in props.cols" :key="col.name">
                    <div
                      v-if="
                        col.name == 'utilidad' ||
                        col.name == 'previa' ||
                        col.name == 'traslado' ||
                        col.name == 'descuentoVentas' ||
                        col.name == 'cortesias' ||
                        col.name == 'gasolina' ||
                        col.name == 'garantia_extendida' ||
                        col.name == 'acondicionamiento' ||
                        col.name == 'gestorias' ||
                        col.name == 'toma_unidad' ||
                        col.name == 'bono' ||
                        col.name == 'baseComision'
                      "
                      style="text-align: center"
                    >
                      {{
                        props.row[col.name].toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </div>
                    <div v-else style="text-align: center">
                      {{ props.row[col.name] }}
                    </div>
                  </q-td>
                </template>
              </q-table>
              <div v-else>
                <div class="text-h4 text-center">
                  Este asesor no cuenta con facturación de unidades vendidas
                  para este periodo
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div>
                <div>
                  <strong>Total base contratos:</strong>
                  {{
                    comisionVendedorSuAuto?.totalContratos?.toLocaleString(
                      "es-MX",
                      {
                        style: "currency",
                        currency: "MXN",
                      }
                    )
                  }}
                </div>
                <div>
                  <strong>Total base facturas (SuAuto):</strong>
                  {{
                    comisionVendedorSuAuto?.totalFacturas?.toLocaleString(
                      "es-MX",
                      {
                        style: "currency",
                        currency: "MXN",
                      }
                    )
                  }}
                </div>
                <div
                  v-if="
                    comisionVendedorSuAuto?.unidadesVendidas.totalAPagar > 0
                  "
                >
                  <strong>Total base facturas (venta de unidades):</strong>
                  {{
                    comisionVendedorSuAuto?.unidadesVendidas.totalUtilidadFacturas.toLocaleString(
                      "es-MX",
                      {
                        style: "currency",
                        currency: "MXN",
                      }
                    )
                  }}
                </div>
                <div
                  v-if="
                    comisionVendedorSuAuto?.unidadesVendidas.totalAPagar > 0
                  "
                >
                  <strong>Porcentaje UB:</strong>
                  {{
                    comisionVendedorSuAuto?.unidadesVendidas.esquema
                      .porcentajeUB
                  }}%
                </div>
                <div>
                  <strong>Total a pagar:</strong>
                  {{
                    comisionVendedorSuAuto?.totalAPagar?.toLocaleString(
                      "es-MX",
                      {
                        style: "currency",
                        currency: "MXN",
                      }
                    )
                  }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card
            v-else-if="
              comisionVendedorSuAuto?.infoVendedor?.claveDepartamento ===
              'COOR SUAUTO'
            "
          >
            <q-card-section>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 1rem;
                "
              >
                <div style="display: block">
                  <div>
                    <strong>Nombre:</strong>
                    {{ comisionVendedorSuAuto?.infoVendedor?.nombreEmpleado }}
                  </div>
                  <div>
                    <strong>No. de empleado:</strong>
                    {{ comisionVendedorSuAuto?.infoVendedor?.numeroEmpleado }}
                  </div>
                  <div>
                    <strong>Puesto:</strong>
                    {{
                      comisionVendedorSuAuto?.infoVendedor?.claveDepartamento
                    }}
                  </div>
                </div>
                <div>
                  <q-btn
                    icon="send"
                    color="primary"
                    label="Enviar comisión"
                    class="q-mr-md"
                    @click="enviarComision"
                  />
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-center text-bold text-h4 q-mb-md">CONTRATOS</div>
              <q-table
                square
                dense
                flat
                hide-bottom
                class="my-sticky-header-column-table"
                :rows="comisionVendedorSuAuto?.contratos"
                :columns="columnasComisionCoorSuAuto"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="comisionVendedorSuAuto?.contratos?.length > 0"
              />
              <div v-else>
                <div class="text-h4 text-center">
                  Este asesor no cuenta con contratos de Su Auto para este
                  período
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-center text-bold text-h4 q-mb-md">FACTURAS</div>
              <q-table
                square
                dense
                flat
                hide-bottom
                class="my-sticky-header-column-table"
                :rows="comisionVendedorSuAuto?.facturas"
                :columns="columnasFacturasSuAuto"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="comisionVendedorSuAuto?.facturas?.length > 0"
              />
              <div v-else>
                <div class="text-h4 text-center">
                  Este asesor no cuenta con facturas de Su Auto para este
                  período
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div>
                <div>
                  <strong>Total base contratos:</strong>
                  {{
                    comisionVendedorSuAuto?.totalContratos?.toLocaleString(
                      "es-MX",
                      {
                        style: "currency",
                        currency: "MXN",
                      }
                    )
                  }}
                </div>
                <div>
                  <strong>Total base facturas:</strong>
                  {{
                    comisionVendedorSuAuto?.totalFacturas?.toLocaleString(
                      "es-MX",
                      {
                        style: "currency",
                        currency: "MXN",
                      }
                    )
                  }}
                </div>
                <div>
                  <strong>Total a pagar:</strong>
                  {{
                    comisionVendedorSuAuto?.totalAPagar?.toLocaleString(
                      "es-MX",
                      {
                        style: "currency",
                        currency: "MXN",
                      }
                    )
                  }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <CardComision v-else :esCalculador="true" />
        </div>
      </div>
    </div>
    <ModalEnviarComision ref="modalEnviarComision" />
  </q-layout>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { storeToRefs } from "pinia";
import { listaMeses, listaAnios } from "src/helpers/listas";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { obtenerNumeroMes, obtenerNumerosDeMes } from "src/constant/constantes";
import { notificacion } from "src/helpers/mensajes";
import ModalEnviarComision from "src/components/ModalEnviarComision.vue";
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj";
import { formatearFecha } from "src/helpers/formatearFecha";
import CardComision from "src/components/CardComision.vue";

export default {
  components: {
    ModalEnviarComision,
    CardComision,
  },
  setup() {
    const useFacturas = useFacturasStore();
    const { obtenerComisionesSuAuto } = useFacturas;
    const {
      opcionesVendedores,
      anioSeleccionado,
      mesSeleccionado,
      comisionVendedorSuAuto,
    } = storeToRefs(useFacturas);

    const useKpis = useKpiStore();
    const {
      obtenerComisionVendedor,
      obtenerComisionBonoVendedor,
      obtenerBonoAprobado,
    } = useKpis;
    const { comisionVendedor, comisionBonoVendedor, bonoAprobado } =
      storeToRefs(useKpis);

    const fechaInicio = ref("");
    const fechaFin = ref("");
    const vendedorSeleccionado = ref(null);

    const opcionesEmpleados = ref(opcionesVendedores.value);

    const cargando = ref(false);
    const datosCargados = ref(false);
    const hayBono = ref(false);

    const modalEnviarComision = ref(null);

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

    // Columnas base de facturas
    const columnasFacturasBase = [
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
        name: "condicion",
        label: "Condición",
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
        name: "bono_fijo",
        label: "Bono fijo seminuevos",
      },
      {
        name: "utilidad",
        label: "Utilidad",
      },
    ];

    // Columna de gasto financiero
    const columnaGastoFinanciero = {
      name: "gastoFinanciero",
      label: "Gasto financiero",
      format: (val, row) => {
        if (!val || val === null) return "N/A";
        return val.toLocaleString("es-MX", {
          style: "currency",
          currency: "MXN",
        });
      },
    };

    // Resto de columnas después de utilidad
    const columnasFacturasDespuesUtilidad = [
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
        name: "bonoub",
        label: "Bono",
      },
      {
        name: "baseComision",
        label: "Base comisión",
      },
    ];

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
      return generarColumnasFacturas(comisionVendedor.value?.facturas);
    });

    // Columnas dinámicas para facturas seminuevas
    const columnasFacturasSeminuevas = computed(() => {
      return generarColumnasFacturas(comisionVendedor.value?.facturas);
    });

    // Columnas dinámicas para facturas de flotillas
    const columnasFacturasFlotillas = computed(() => {
      return generarColumnasFacturasFlotillas(
        comisionVendedor.value?.flotillas?.facturas
      );
    });

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
        name: "totalUtilidadBruta",
        label: "Total utilidad bruta",
      },
    ];

    const columnasKPIs = [
      {
        name: "kpi",
        label: "KPI",
      },
      {
        name: "porcentajeUB",
        label: "% de UB",
      },
      {
        name: "objetivo",
        label: "Objetivo",
      },
      {
        name: "objetivoCumplimiento",
        label: "Objetivo cumplimiento",
      },
      {
        name: "objetivoValorReal",
        label: "Objetivo valor real",
      },
      {
        name: "desempenio",
        label: "Desempeño",
      },
      {
        name: "peso",
        label: "Peso",
      },
      {
        name: "porcentajeDeComision",
        label: "% de comisión",
      },
      {
        name: "utilidadBruta",
        label: "Utilidad bruta",
      },
      {
        name: "pagoCompleto",
        label: "Pago 100%",
      },
      {
        name: "montoAPagar",
        label: "Monto a pagar",
      },
    ];

    const columnasDescuentosVendedor = [
      {
        name: "bono",
        label: "Bono",
      },
      {
        name: "descuento",
        label: "Descuento",
      },
      {
        name: "inCredit",
        label: "InCredit",
      },
      {
        name: "suAuto",
        label: "SuAuto",
      },
      {
        name: "accesorios",
        label: "Accesorios",
      },
      // {
      //   name: "seminuevos",
      //   label: "Seminuevos",
      // },
      {
        name: "totalAPagar",
        label: "Total a pagar bonos",
      },
    ];

    const columnasDescuentosVendedorSeminuevos = [
      {
        name: "bono",
        label: "Bono",
      },
      {
        name: "descuento",
        label: "Descuento",
      },
      {
        name: "accesorios",
        label: "Accesorios",
      },
      // {
      //   name: "nuevos",
      //   label: "Nuevos",
      // },
      {
        name: "totalAPagar",
        label: "Total a pagar bonos",
      },
    ];

    const columansDescuentosNoExisten = [
      {
        name: "totalAPagar",
        label: "Total a pagar",
      },
    ];

    const columnasComisionSuAuto = [
      {
        name: "contrato",
        label: "Contrato",
        align: "center",
        field: "contrato",
      },
      {
        name: "fechaContrato",
        label: "Fecha contrato",
        align: "center",
        field: "fechaContrato",
      },
      {
        name: "plan",
        label: "Plan",
        align: "center",
        field: "plan",
      },
      {
        name: "modelo",
        label: "Modelo",
        align: "center",
        field: "tu",
      },
      {
        name: "cliente",
        label: "Cliente",
        align: "center",
        field: "cliente",
      },
      {
        name: "precioGuia",
        label: "Precio distribuidor",
        align: "center",
        field: (row) =>
          row.precioGuia
            ? row.precioGuia.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : "0".toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              }),
      },
    ];

    const columnasComisionCoorSuAuto = [
      {
        name: "contrato",
        label: "Contrato",
        align: "center",
        field: "contrato",
      },
      {
        name: "fechaContrato",
        label: "Fecha contrato",
        align: "center",
        field: "fechaContrato",
      },
      {
        name: "plan",
        label: "Plan",
        align: "center",
        field: "plan",
      },
      {
        name: "modelo",
        label: "Modelo",
        align: "center",
        field: "tu",
      },
      {
        name: "cliente",
        label: "Cliente",
        align: "center",
        field: "cliente",
      },
      {
        name: "precioLista",
        label: "Precio",
        align: "center",
        field: (row) =>
          row.precioLista
            ? row.precioLista.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : "0".toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              }),
      },
    ];

    const columnasFacturasSuAuto = [
      {
        name: "folioFactura",
        label: "Folio",
        align: "center",
        field: "factura",
      },
      {
        name: "fechaFactura",
        label: "Fecha",
        align: "center",
        field: (row) => formatearFecha(row.fecha_facturacion),
      },
      {
        name: "modelo",
        label: "Modelo",
        align: "center",
        field: "modelo",
      },
      {
        name: "serie",
        label: "Serie",
        align: "center",
        field: "vin",
      },
      {
        name: "importe_venta",
        label: "Importe de venta",
        align: "center",
        field: (row) =>
          row.importe_venta
            ? row.importe_venta.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : "0".toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              }),
      },
      {
        name: "utilidad",
        label: "Utilidad",
        align: "center",
        field: (row) =>
          row.utilidad
            ? row.utilidad.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : "0".toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              }),
      },
    ];

    const columnasDesgloseDescuentos = [
      {
        name: "nombreDescuento",
        label: "",
        align: "center",
        field: "nombreDescuento",
      },
      {
        name: "valor",
        label: "",
        align: "center",
        field: (row) =>
          row.valor
            ? row.valor.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : "0".toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              }),
      },
    ];

    const tabs = ref("comision");

    const buscarComisiones = async () => {
      if (!vendedorSeleccionado.value) {
        notificacion("warning", "Seleccione un vendedor para continuar");
        return;
      }

      if (!anioSeleccionado.value) {
        notificacion("warning", "Seleccione un año para continuar");
        return;
      }

      if (!mesSeleccionado.value) {
        notificacion("warning", "Seleccione un mes para continuar");
        return;
      }

      if (
        vendedorSeleccionado.value.value.claveDepartamento === "SUAUTO" ||
        vendedorSeleccionado.value.value.claveDepartamento === "COOR SUAUTO"
      ) {
        cargando.value = true;

        const busquedaObj = {
          mes: obtenerNumerosDeMes(mesSeleccionado.value),
          anio: anioSeleccionado.value,
          idAsesor: vendedorSeleccionado.value.value.idAsesor,
        };

        await obtenerComisionesSuAuto(busquedaObj);

        if (comisionVendedorSuAuto.value) {
          cargando.value = false;
          datosCargados.value = true;
        } else {
          cargando.value = false;
          datosCargados.value = false;
        }
      } else {
        cargando.value = true;

        const objBusqueda = {
          numeroEmpleado: vendedorSeleccionado.value.value.numeroEmpleado,
          anio: anioSeleccionado.value,
          mes: obtenerNumerosDeMes(mesSeleccionado.value),
        };

        await obtenerComisionVendedor(objBusqueda);

        if (comisionVendedor.value) {
          cargando.value = false;
          datosCargados.value = true;
        } else {
          cargando.value = false;
          datosCargados.value = false;
        }
      }
    };

    const enviarComision = () => {
      if (
        vendedorSeleccionado.value.value.claveDepartamento === "SUAUTO" ||
        vendedorSeleccionado.value.value.claveDepartamento === "COOR SUAUTO"
      ) {
        modalEnviarComision.value.abrir(
          comisionVendedorSuAuto.value.infoVendedor,
          comisionVendedorSuAuto.value
        );
      } else {
        modalEnviarComision.value.abrir(
          comisionVendedor.value.infoVendedor,
          comisionVendedor.value
        );
      }
    };

    const pagination = ref({
      rowsPerPage: 10000,
    });

    const { obtenerVendedores } = useFacturas;

    onMounted(async () => {
      await obtenerVendedores();
    });

    const parametrosFiltradosVendedores = (val, update) => {
      filtradoBusquedaObj(
        val,
        update,
        opcionesVendedores.value,
        opcionesEmpleados
      );
    };

    return {
      // States
      fechaInicio,
      fechaFin,
      vendedorSeleccionado,
      opcionesEmpleados,
      cargando,
      datosCargados,
      listaAnios,
      listaMeses,
      anioSeleccionado,
      mesSeleccionado,
      comisionVendedor,
      columnasFacturas,
      pagination,
      columnasPvas,
      columnasUtilidadBruta,
      columnasKPIs,
      columnasDescuentosVendedor,
      modalEnviarComision,
      columnasFacturasSeminuevas,
      columnasFacturasFlotillas,
      columnasDescuentosVendedorSeminuevos,
      columnasUtilidadBrutaSeminuevos,
      columansDescuentosNoExisten,
      tabs,
      comisionBonoVendedor,
      comisionVendedorSuAuto,
      columnasComisionSuAuto,
      columnasComisionCoorSuAuto,
      columnasFacturasSuAuto,
      columnasDesgloseDescuentos,
      // Methods
      buscarComisiones,
      enviarComision,
      parametrosFiltradosVendedores,
      obtenerNumeroMes,
      requiereGastoFinanciero,
      requiereGastoFinancieroFlotillas,
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

.my-sticky-header-column-table tr th {
  position: sticky;
  z-index: 2;
  background: #006ab2;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  color: white;
  text-wrap: wrap;
}
</style>
