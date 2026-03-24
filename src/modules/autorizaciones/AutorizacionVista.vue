<template>
  <q-layout
    style="
      background-color: #c3c3c3;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <div
      v-if="cargando"
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <q-card
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 10rem;
        "
      >
        <q-spinner-ios color="primary" size="400px" />
        <span class="text-h3 q-mt-md"
          >Cargando la información, espere un momento...</span
        >
      </q-card>
    </div>
    <div v-else>
      <q-card
        v-if="estatusAutorizacionUsuario === 2"
        class="column justify-center items-center q-pa-md"
      >
        <q-icon name="check_circle" color="green" size="400px" />
        <span class="text-h3"
          >Bienvenido(a) <strong>{{ usuarioAutenticado.nombre }}</strong
          >. La comisión a la que intentas acceder ya fue autorizada.</span
        >
      </q-card>
      <q-card
        v-else-if="estatusAutorizacionUsuario === 3"
        class="column justify-center items-center q-pa-md"
      >
        <q-icon name="cancel" color="red" size="400px" />
        <span class="text-h3"
          >Bienvenido(a) <strong>{{ usuarioAutenticado.nombre }}</strong
          >. La comisión a la que intentas acceder ha sido rechazada.</span
        >
      </q-card>
      <q-card v-else class="column justify-center items-center q-pa-md">
        <q-card
          v-if="
            comisionVendedorSuAuto?.infoVendedor?.claveDepartamento === 'SUAUTO'
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
                  {{ comisionVendedorSuAuto?.infoVendedor?.claveDepartamento }}
                </div>
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
                Este asesor no cuenta con contratos de Su Auto para este período
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
                Este asesor no cuenta con facturación de unidades vendidas para
                este periodo
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
                v-if="comisionVendedorSuAuto?.unidadesVendidas.totalAPagar > 0"
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
                v-if="comisionVendedorSuAuto?.unidadesVendidas.totalAPagar > 0"
              >
                <strong>Porcentaje UB:</strong>
                {{
                  comisionVendedorSuAuto?.unidadesVendidas.esquema.porcentajeUB
                }}%
              </div>
              <div>
                <strong>Total a pagar:</strong>
                {{
                  comisionVendedorSuAuto?.totalAPagar?.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })
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
                  {{ comisionVendedorSuAuto?.infoVendedor?.claveDepartamento }}
                </div>
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
                Este asesor no cuenta con contratos de Su Auto para este período
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
                Este asesor no cuenta con facturas de Su Auto para este período
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
                  comisionVendedorSuAuto?.totalAPagar?.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })
                }}
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div v-else style="width: 90vw">
          <CardComision :esCalculador="false" />
        </div>
      </q-card>
    </div>
  </q-layout>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { useAutorizacionesStore } from "src/stores/autorizaciones";
import { storeToRefs } from "pinia";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import CardComision from "src/components/CardComision.vue";

export default {
  components: {
    CardComision,
  },
  setup() {
    const useAutenticacion = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticacion);

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
      obtenerInfoVendedor,
    } = useKpis;
    const {
      comisionVendedor,
      comisionBonoVendedor,
      bonoAprobado,
      informacionVendedor,
    } = storeToRefs(useKpis);

    const useAutorizaciones = useAutorizacionesStore();
    const { validarAutorizador } = useAutorizaciones;
    const { autorizacionSeleccionada } = storeToRefs(useAutorizaciones);

    const router = useRouter();

    const infoUrl = ref({
      idAsesor: router.currentRoute.value.params.idAsesor,
      mes: Number(router.currentRoute.value.params.mes),
      anio: Number(router.currentRoute.value.params.anio),
      idAutorizacion: router.currentRoute.value.params.idAutorizacion,
    });

    const cargando = ref(false);

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

    onMounted(async () => {
      cargando.value = true;

      if (!autorizacionSeleccionada.value) {
        await validarAutorizador(
          usuarioAutenticado.value.numero_empleado,
          infoUrl.value.idAutorizacion
        );
      }

      await obtenerInfoVendedor(infoUrl.value.idAsesor);
      await buscarComisiones();

      cargando.value = false;
    });

    const buscarComisiones = async () => {
      if (
        informacionVendedor.value.claveDepartamento === "SUAUTO" ||
        informacionVendedor.value.claveDepartamento === "COOR SUAUTO"
      ) {
        const busquedaObj = {
          mes: infoUrl.value.mes,
          anio: infoUrl.value.anio,
          idAsesor: informacionVendedor.value.idAsesor,
        };

        await obtenerComisionesSuAuto(busquedaObj);
      } else {
        const objBusqueda = {
          numeroEmpleado: informacionVendedor.value.numeroEmpleado,
          anio: infoUrl.value.anio,
          mes: infoUrl.value.mes,
        };

        await obtenerComisionVendedor(objBusqueda);
      }
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

    const columnasFacturas = computed(() => {
      return generarColumnasFacturas(comisionVendedor.value?.facturas);
    });

    const generarColumnasFacturas = (facturas) => {
      const columnas = [...columnasFacturasBase];

      if (requiereGastoFinanciero(facturas)) {
        columnas.push(columnaGastoFinanciero);
      }

      columnas.push(...columnasFacturasDespuesUtilidad);
      return columnas;
    };

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

    const autorizoUsuario = (autorizacion) => {
      if (!autorizacion?.autorizaciones_detalles) return null;

      const { autorizaciones_detalles } = autorizacion;
      const autorizacionUsuario = autorizaciones_detalles.find(
        (detalle) =>
          detalle.numeroEmpleado === usuarioAutenticado.value.numero_empleado
      );

      return autorizacionUsuario
        ? autorizacionUsuario.idEstatusAutorizacion
        : null;
    };

    const estatusAutorizacionUsuario = computed(() =>
      autorizoUsuario(autorizacionSeleccionada.value)
    );

    return {
      // States
      cargando,
      autorizacionSeleccionada,
      estatusAutorizacionUsuario,
      usuarioAutenticado,
      comisionVendedorSuAuto,
      columnasComisionSuAuto,
      columnasComisionCoorSuAuto,
      columnasFacturasSuAuto,
      pagination: ref({
        rowsPerPage: 10000,
      }),
      columnasFacturas,
      // Methods
      autorizoUsuario,
    };
  },
};
</script>
