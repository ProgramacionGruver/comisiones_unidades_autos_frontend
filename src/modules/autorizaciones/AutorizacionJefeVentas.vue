<template>
  <q-layout style="overflow-y: hidden !important">
    <div
      v-if="cargando"
      style="
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      "
    >
      <q-spinner color="primary" size="200px" class="q-mb-lg" />
      <span>Espere un momento a que los datos sean cargados...</span>
    </div>
    <div v-else>
      <q-card class="q-ma-md">
        <q-card-section class="bg-primary text-white text-center"
          >Comisión del mes de:
          <strong>
            {{ mes.toUpperCase() }}
          </strong>
        </q-card-section>
        <q-card-section>
          <div style="display: block" class="q-mb-md">
            <div></div>
            <div>
              <strong>Nombre:</strong>
              {{ comisionVendedor.infoVendedor.nombreEmpleado }}
            </div>
            <div>
              <strong>No. de empleado:</strong>
              {{ comisionVendedor.infoVendedor.numeroEmpleado }}
            </div>
            <div>
              <strong>Nivel:</strong>
              <q-chip
                v-if="comisionVendedor.infoVendedor.nivel === 'oro'"
                color="orange"
                text-color="white"
                label="ORO"
              />
              <q-chip
                v-else-if="comisionVendedor.infoVendedor.nivel === 'plata'"
                color="grey"
                text-color="white"
                label="PLATA"
              />
              <q-chip
                v-if="comisionVendedor.infoVendedor.nivel === 'bronce'"
                color="brown"
                text-color="white"
                label="BRONCE"
              />
              <q-chip
                v-if="comisionVendedor.infoVendedor.nivel === 'asesor'"
                color="green"
                text-color="white"
                label="ASESOR"
              />
            </div>
          </div>

          <q-table
            square
            dense
            flat
            hide-bottom
            class="my-sticky-header-column-table"
            :rows="comisionVendedor.facturas"
            :columns="columnasFactuas"
            no-data-label="No se encontró informacion disponible."
            no-results-label="No se encontraron coincidencias."
            :pagination="pagination"
          >
            <template v-slot:body="props">
              <q-tr v-if="props.row.tipoRenglon === 'dato'" :props="props">
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

              <q-tr v-if="props.row.tipoRenglon === 'total'" :props="props">
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
                <q-td style="text-align: center; background-color: yellow">
                  {{
                    Number(props.row.utilidad).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center; background-color: yellow">
                  {{
                    Number(props.row.previa).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center; background-color: yellow">
                  {{
                    Number(props.row.traslado).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center; background-color: yellow">
                  {{
                    Number(props.row.descuentoVentas).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center; background-color: yellow">
                  {{
                    Number(props.row.cortesias).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center; background-color: yellow">
                  {{
                    Number(props.row.gasolina).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center; background-color: yellow">
                  {{
                    Number(props.row.bono).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center; background-color: yellow">
                  {{
                    Number(props.row.baseComision).toLocaleString("es-MX", {
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
            :rows="comisionVendedor.pvas"
            :columns="columnasPvas"
            no-data-label="No se encontró informacion disponible."
            no-results-label="No se encontraron coincidencias."
            :pagination="pagination"
          >
            <template v-slot:body="props">
              <q-tr v-if="props.row.tipoRenglon === 'dato'" :props="props">
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

              <q-tr v-if="props.row.tipoRenglon === 'total'" :props="props">
                <q-td style="background-color: yellow">
                  {{ props.row.nombreCliente }}
                </q-td>
                <q-td style="text-align: center; background-color: yellow">
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
            :rows="comisionVendedor.totalUtilidadBruta"
            :columns="columnasUtilidadBruta"
            no-data-label="No se encontró informacion disponible."
            no-results-label="No se encontraron coincidencias."
            :pagination="pagination"
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
            :rows="comisionVendedor.kpis"
            :columns="columnasKPIs"
            no-data-label="No se encontró informacion disponible."
            no-results-label="No se encontraron coincidencias."
            :pagination="pagination"
          >
            <template v-slot:body="props">
              <q-tr>
                <q-td>
                  {{ props.row.kpi }}
                </q-td>
                <q-td style="text-align: center">
                  {{ `${props.row.porcentajeUB}%` }}
                </q-td>
                <q-td style="text-align: center">
                  {{ props.row.objetivo }}
                </q-td>
                <q-td style="text-align: center">
                  {{ `${props.row.objetivoCumplimiento}%` }}
                </q-td>
                <q-td style="text-align: center">
                  {{ props.row.objetivoValorReal }}
                </q-td>
                <q-td style="text-align: center">
                  {{ `${props.row.desempenio}%` }}
                </q-td>
                <q-td>
                  {{ `${props.row.peso}%` }}
                </q-td>
                <q-td style="text-align: center">
                  {{ `${props.row.porcentajeDeComision}%` }}
                </q-td>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.utilidadBruta).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.pagoCompleto).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.montoAPagar).toLocaleString("es-MX", {
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
            class="my-sticky-header-column-table q-mt-lg q-mb-lg"
            :rows="comisionVendedor.descuentosVendedor"
            :columns="columnasDescuentosVendedor"
            no-data-label="No se encontró informacion disponible."
            no-results-label="No se encontraron coincidencias."
            :pagination="pagination"
          >
            <template v-slot:body="props">
              <q-tr>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.bono).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.descuento).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.inCredit).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.suAuto).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.accesorios).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.seminuevos).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
                <q-td style="text-align: center">
                  {{
                    Number(props.row.totalAPagar).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })
                  }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-input
            v-model="comentario"
            label="Comentario"
            outlined
            dense
            class="q-mt-md"
          />
        </q-card-section>
        <q-card-actions class="botones--div__comision">
          <!-- <div class="boton--superior">
            <q-btn
              label="Descargar PDF"
              color="primary"
              @click="descargarPDF"
              icon-right="cloud_download"
              :loading="cargandoPDF"
            >
              <template v-slot:loading>
                <q-spinner-facebook color="white" />
              </template>
            </q-btn>
          </div> -->

          <div class="botones--inferiores">
            <q-btn
              label="Confirmar"
              color="green"
              @click="enviarComision"
              icon-right="send"
              :loading="cargandoConfirmacion"
            >
              <template v-slot:loading>
                <q-spinner-facebook color="white" />
              </template>
            </q-btn>

            <q-btn
              label="Rechazar"
              color="red"
              @click="rechazoComision"
              icon-right="close"
              :loading="cargandoRechazar"
            >
              <template v-slot:loading>
                <q-spinner-facebook color="white" />
              </template>
            </q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </div>
  </q-layout>
</template>

<script>
import { useFormulariosStore } from "src/stores/formularios";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { useRouter } from "vue-router";
import { listaMeses } from "src/helpers/listas";
import { useAutorizacionesStore } from "src/stores/autorizaciones";

export default {
  setup() {
    const useFormularios = useFormulariosStore();
    const { desencriptarData } = useFormularios;

    const useKpis = useKpiStore();
    const { comisionVendedor } = storeToRefs(useKpis);

    const useAutorizaciones = useAutorizacionesStore();
    const {
      aceptarAutorizacion,
      enviarComisionJefe,
      rechazarComision,
      enviarComisionRechazo,
    } = useAutorizaciones;

    const cargando = ref(true);
    const router = useRouter();
    const token = ref(router.currentRoute.value.params.token);

    const mes = ref("");

    const pagination = ref({
      rowsPerPage: 10000,
    });

    const cargandoPDF = ref(false);
    const cargandoConfirmacion = ref(false);
    const cargandoRechazar = ref(false);

    const comentario = ref("");

    const infoVendedorAutorizacion = ref(null);

    const columnasFactuas = [
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
      {
        name: "seminuevos",
        label: "Seminuevos",
      },
      {
        name: "totalAPagar",
        label: "Total a pagar",
      },
    ];

    onMounted(async () => {
      await desencriptarData(token.value);

      mes.value = listaMeses[comisionVendedor.value.autorizaciones.mes - 1];

      infoVendedorAutorizacion.value =
        comisionVendedor.value.autorizaciones.autorizaciones_comisiones_autos_detalles.find(
          (item) => item.tipoEmpleado === "JEFE"
        );

      cargando.value = false;
    });

    const enviarComision = async () => {
      cargandoConfirmacion.value = true;

      const data = {
        idAutorizacionDetalle: idAutorizacionDetalle.value,
        comentario: comentario.value,
      };

      await aceptarAutorizacion(data);

      cargandoConfirmacion.value = false;
    };

    const descargarPDF = async () => {
      console.log("Descargar PDF");
    };

    const rechazoComision = async () => {
      cargandoRechazar.value = true;

      const data = {
        idAutorizacionDetalle: idAutorizacionDetalle.value,
        comentario: comentario.value,
      };

      await rechazarComision(data);

      await obtenerUrlComision(comisionVendedor.value, "jefe");

      const objMensaje = {
        infoVendedor: comisionVendedor.value.infoVendedor,
        mes: mes.value,
        comentario: comentario.value,
        link: urlComision.value,
        infoAutorizacion: infoVendedorAutorizacion.value,
      };

      await enviarComisionRechazo(objMensaje);

      cargandoRechazar.value = false;
    };

    return {
      // States
      comisionVendedor,
      cargando,
      mes,
      columnasFactuas,
      pagination,
      columnasPvas,
      columnasUtilidadBruta,
      columnasKPIs,
      columnasDescuentosVendedor,
      cargandoPDF,
      cargandoConfirmacion,
      comentario,
      cargandoRechazar,
      // Methods
      enviarComision,
      descargarPDF,
      rechazoComision,
    };
  },
};
</script>

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
