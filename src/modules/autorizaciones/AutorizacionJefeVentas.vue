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
    <div>
      <q-card v-if="comisionVendedorSuAuto?.infoVendedor?.claveDepartamento === 'SUAUTO'">
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
            <!-- <div>
              <q-btn
                icon="send"
                color="primary"
                label="Enviar comisión"
                class="q-mr-md"
                @click="enviarComision"
              />
            </div> -->
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
                comisionVendedorSuAuto?.totalContratos?.toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })
              }}
            </div>
            <div>
              <strong>Total base facturas:</strong>
              {{
                comisionVendedorSuAuto?.totalFacturas?.toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })
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
              icon-right="check"
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

      <q-card
        v-else-if="
          comisionVendedorSuAuto?.infoVendedor?.claveDepartamento === 'COOR SUAUTO'
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
            <!-- <div>
              <q-btn
                icon="send"
                color="primary"
                label="Enviar comisión"
                class="q-mr-md"
                @click="enviarComision"
              />
            </div> -->
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
                comisionVendedorSuAuto?.totalContratos?.toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })
              }}
            </div>
            <div>
              <strong>Total base facturas:</strong>
              {{
                comisionVendedorSuAuto?.totalFacturas?.toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })
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
              icon-right="check"
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

      <q-card v-else class="q-mt-md">
        <!-- <q-tabs v-model="tabs" indicator-color="yellow" align="justify">
              <q-tab
                name="comision"
                label="Comisión"
                class="bg-primary text-white"
              />
              <q-tab
                name="bono"
                label="Detalle del bono"
                class="bg-primary text-white"
              />
            </q-tabs> -->

        <!-- <q-tab-panels v-model="tabs" animated class="bg-white"> -->
        <q-tab-panel name="comision">
          <div>
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
                  {{ comisionVendedor?.infoVendedor?.nombreEmpleado }}
                </div>
                <div>
                  <strong>No. de empleado:</strong>
                  {{ comisionVendedor?.infoVendedor?.numeroEmpleado }}
                </div>
                <div>
                  <strong>Nivel:</strong>
                  <q-chip
                    v-if="comisionVendedor?.infoVendedor?.nivel === 'oro'"
                    color="orange"
                    text-color="white"
                    label="ORO"
                  />
                  <q-chip
                    v-else-if="comisionVendedor?.infoVendedor?.nivel === 'plata'"
                    color="grey"
                    text-color="white"
                    label="PLATA"
                  />
                  <q-chip
                    v-if="comisionVendedor?.infoVendedor?.nivel === 'bronce'"
                    color="brown"
                    text-color="white"
                    label="BRONCE"
                  />
                  <q-chip
                    v-if="comisionVendedor?.infoVendedor?.nivel === 'asesor'"
                    color="green"
                    text-color="white"
                    label="ASESOR"
                  />
                  <q-chip
                    v-if="comisionVendedor?.infoVendedor?.nivel === 'nuevo'"
                    color="primary"
                    text-color="white"
                    label="NUEVO INGRESO"
                  />
                </div>
              </div>
              <!-- <div>
                <q-btn
                  icon="send"
                  color="primary"
                  label="Enviar comisión"
                  class="q-mr-md"
                  @click="enviarComision"
                />
              </div> -->
            </div>
          </div>
          <div>
            <q-scroll-area style="height: 110rem; width: 100%">
              <q-table
                square
                dense
                flat
                hide-bottom
                class="my-sticky-header-column-table"
                :rows="comisionVendedor?.facturas"
                :columns="columnasFacturas"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="comisionVendedor?.infoVendedor?.claveDepartamento === 'NUE'"
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
                    <q-td style="text-align: center">
                      {{ props.row.condicion.toUpperCase() }}
                    </q-td>
                    <q-td>
                      {{ props.row.modelo }}
                    </q-td>
                    <q-td>
                      {{ props.row.serie }}
                    </q-td>
                    <q-td style="text-align: center">
                      {{
                        props.row.bono_fijo
                          ? props.row.bono_fijo.toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })
                          : ""
                      }}
                    </q-td>
                    <q-td style="text-align: center">
                      {{
                        props.row.utilidad.toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
<q-td
                      v-if="
                        Number(infoUrl.anio) > 2025 ||
                        (Number(infoUrl.anio) === 2025 && Number(infoUrl.mes) >= 9)
                      "
                      style="text-align: center"
                    >
                      {{
                        props.row.gastoFinanciero
                          ? props.row.gastoFinanciero.toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })
                          : ""
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
                      {{ props.row.condicion }}
                    </q-td>
                    <q-td>
                      {{ props.row.modelo }}
                    </q-td>
                    <q-td>
                      {{ props.row.serie }}
                    </q-td>
                    <q-td style="text-align: left; background-color: yellow">
                      {{ props.row.bono_fijo }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.utilidad).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
<q-td
                      v-if="
                        Number(infoUrl.anio) > 2025 ||
                        (Number(infoUrl.anio) == 2025 && Number(infoUrl.mes) >= 9)
                      "
                      style="text-align: center; background-color: yellow"
                    >
                      {{
                        Number(props.row.gastoFinanciero).toLocaleString("es-MX", {
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
                        Number(props.row.garantia_extendida).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.acondicionamiento).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.gestorias).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.toma_unidad).toLocaleString("es-MX", {
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
                class="my-sticky-header-column-table"
                :rows="comisionVendedor?.facturas"
                :columns="columnasFacturasSeminuevas"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-else-if="comisionVendedor?.infoVendedor?.claveDepartamento === 'SEM'"
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
                    <q-td style="text-align: center">
                      {{ props.row.condicion.toUpperCase() }}
                    </q-td>
                    <q-td>
                      {{ props.row.modelo }}
                    </q-td>
                    <q-td>
                      {{ props.row.serie }}
                    </q-td>
                    <q-td style="text-align: center">
                      {{
                        props.row.bono_fijo
                          ? props.row.bono_fijo.toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })
                          : ""
                      }}
                    </q-td>
                    <q-td style="text-align: center">
                      {{
                        props.row.utilidad.toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
<q-td
                      v-if="requiereGastoFinanciero(comisionVendedor?.facturas)"
                      style="text-align: center"
                    >
                      {{
                        props.row.gastoFinanciero
                          ? props.row.gastoFinanciero.toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })
                          : ""
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
                      {{ props.row.condicion }}
                    </q-td>
                    <q-td>
                      {{ props.row.modelo }}
                    </q-td>
                    <q-td>
                      {{ props.row.serie }}
                    </q-td>
                    <q-td style="text-align: left; background-color: yellow">
                      {{ props.row.bono_fijo }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.utilidad).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
<q-td
                      v-if="requiereGastoFinanciero(comisionVendedor?.facturas)"
                      style="text-align: center; background-color: yellow"
                    >
                      {{
                        Number(props.row.gastoFinanciero).toLocaleString("es-MX", {
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
                        Number(props.row.garantia_extendida).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.acondicionamiento).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.gestorias).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.toma_unidad).toLocaleString("es-MX", {
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
                class="my-sticky-header-column-table q-mt-md"
                :rows="comisionVendedor?.flotillas?.facturas"
                :columns="columnasFacturasFlotillas"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="
                  comisionVendedor?.flotillas &&
                  comisionVendedor?.flotillas?.facturas.length > 0
                "
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
                    <q-td style="text-align: center">
                      {{ props.row.condicion.toUpperCase() }}
                    </q-td>
                    <q-td>
                      {{ props.row.modelo }}
                    </q-td>
                    <q-td>
                      {{ props.row.serie }}
                    </q-td>
                    <q-td style="text-align: center">
                      {{
                        props.row.bono_fijo
                          ? props.row.bono_fijo.toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })
                          : ""
                      }}
                    </q-td>
                    <q-td style="text-align: center">
                      {{
                        props.row.utilidad.toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
<q-td
                      v-if="
                        Number(infoUrl.anio) > 2025 ||
                        (Number(infoUrl.anio) === 2025 && Number(infoUrl.mes) >= 9)
                      "
                      style="text-align: center"
                    >
                      {{
                        props.row.gastoFinanciero
                          ? props.row.gastoFinanciero.toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })
                          : ""
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
                      {{ props.row.condicion }}
                    </q-td>
                    <q-td>
                      {{ props.row.modelo }}
                    </q-td>
                    <q-td>
                      {{ props.row.serie }}
                    </q-td>
                    <q-td style="text-align: left; background-color: yellow">
                      {{ props.row.bono_fijo }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.utilidad).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
<q-td
                      v-if="
                        Number(infoUrl.anio) > 2025 ||
                        (Number(infoUrl.anio) === 2025 && Number(infoUrl.mes) >= 9)
                      "
                      style="text-align: center; background-color: yellow"
                    >
                      {{
                        props.row.gastoFinanciero
                          ? Number(props.row.gastoFinanciero).toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })
                          : ""
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
                        Number(props.row.garantia_extendida).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.acondicionamiento).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.gestorias).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{
                        Number(props.row.toma_unidad).toLocaleString("es-MX", {
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

              <div
                align="right"
                v-if="comisionVendedor?.flotillas && comisionVendedor?.flotillas?.facturas?.length > 0"
                class="q-mt-sm"
              >
                <table>
                  <tr>
                    <td class="q-pa-sm" style="background-color: #006ab2">
                      <span class="text-white">
                        <strong>Porcentaje UB:</strong>
                      </span>
                    </td>
                    <td>
                      <div class="text-center">
                        {{ comisionVendedor?.flotillas?.porcentajeUB?.porcentaje }}%
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="q-pa-sm" style="background-color: #006ab2">
                      <span class="text-white">
                        <strong>Total a pagar flotillas:</strong>
                      </span>
                    </td>
                    <td style="background-color: yellow">
                      <div class="text-center">
                        {{
                          comisionVendedor?.flotillas?.pagarFlotillas.toLocaleString(
                            "es-MX",
                            {
                              style: "currency",
                              currency: "MXN",
                            }
                          )
                        }}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <q-table
                square
                dense
                flat
                hide-bottom
                class="my-sticky-header-column-table q-mt-lg"
                :rows="comisionVendedor?.pvas"
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
                :rows="comisionVendedor?.totalUtilidadBruta"
                :columns="columnasUtilidadBruta"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="comisionVendedor?.infoVendedor?.claveDepartamento === 'NUE'"
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
                :rows="comisionVendedor?.totalUtilidadBruta"
                :columns="columnasUtilidadBrutaSeminuevos"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="comisionVendedor?.infoVendedor?.claveDepartamento === 'SEM'"
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
                    <!-- <q-td style="text-align: center">
                          {{
                            props.row.totalPlanPiso.toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })
                          }}
                        </q-td> -->
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
                :rows="comisionVendedor?.kpis"
                :columns="columnasKPIs"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
              >
                <template v-slot:body="props">
                  <q-tr v-if="props.row.tipoRenglon === 'dato'" :props="props">
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

                  <q-tr v-if="props.row.tipoRenglon === 'total'" :props="props">
                    <q-td></q-td>
                    <q-td></q-td>
                    <q-td></q-td>
                    <q-td></q-td>
                    <q-td></q-td>
                    <q-td></q-td>
                    <q-td></q-td>
                    <q-td></q-td>
                    <q-td></q-td>
                    <q-td style="text-align: center; background-color: yellow">
                      {{ props.row.pagoCompleto }}
                    </q-td>
                    <q-td style="text-align: center; background-color: yellow">
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
                :rows="comisionVendedor?.descuentosVendedor"
                :columns="columnasDescuentosVendedor"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-if="comisionVendedor?.infoVendedor?.claveDepartamento === 'NUE'"
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
                    <!-- <q-td style="text-align: center">
                          {{
                            Number(props.row.seminuevos).toLocaleString(
                              "es-MX",
                              {
                                style: "currency",
                                currency: "MXN",
                              }
                            )
                          }}
                        </q-td> -->
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

              <q-table
                square
                dense
                flat
                hide-bottom
                class="my-sticky-header-column-table q-mt-lg q-mb-lg"
                :rows="comisionVendedor?.descuentosVendedor"
                :columns="columnasDescuentosVendedorSeminuevos"
                no-data-label="No se encontró informacion disponible."
                no-results-label="No se encontraron coincidencias."
                :pagination="pagination"
                v-else-if="comisionVendedor?.infoVendedor?.claveDepartamento === 'SEM'"
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
                        Number(props.row.accesorios).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })
                      }}
                    </q-td>
                    <!-- <q-td style="text-align: center">
                          {{
                            Number(props.row.nuevos).toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })
                          }}
                        </q-td> -->
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

              <div v-if="comisionVendedor?.desgloseDescuentos?.length > 0">
                <div>Desglose de bonos y descuentos aplicados directos al vendedor</div>
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    column-gap: 2rem;
                  "
                >
                  <div
                    style="width: 50%"
                    v-if="
                      comisionVendedor?.desgloseDescuentos?.filter(
                        (item) => item.claveDepartamento === 'NUE'
                      ).length > 0
                    "
                  >
                    <span>Unidades nuevas:</span>
                    <q-table
                      square
                      dense
                      flat
                      hide-bottom
                      class="my-sticky-header-column-table q-mt-lg"
                      :rows="
                        comisionVendedor?.desgloseDescuentos?.filter(
                          (item) => item.claveDepartamento === 'NUE'
                        )
                      "
                      :columns="columnasDesgloseDescuentos"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                    />
                  </div>
                  <div
                    style="width: 50%"
                    v-if="
                      comisionVendedor?.desgloseDescuentos?.filter(
                        (item) => item.claveDepartamento === 'SEM'
                      ).length > 0
                    "
                  >
                    <span>Unidades seminuevas:</span>
                    <q-table
                      square
                      dense
                      flat
                      hide-bottom
                      class="my-sticky-header-column-table q-mt-lg"
                      :rows="
                        comisionVendedor?.desgloseDescuentos?.filter(
                          (item) => item.claveDepartamento === 'SEM'
                        )
                      "
                      :columns="columnasDesgloseDescuentos"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                    />
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </div>
        </q-tab-panel>

        <!-- <q-tab-panel name="bono">
                <div v-if="!comisionBonoVendedor">
                  <q-card>
                    <q-card-section>
                      <div class="text-h4">
                        No hay bono del departamento de unidades
                        {{
                          comisionVendedor?.infoVendedor?.claveDepartamento ===
                          "NUE"
                            ? "seminuevas"
                            : "nuevas"
                        }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div v-else>
                  <q-scroll-area style="height: 80rem; width: 100%">
                    <q-table
                      square
                      dense
                      flat
                      hide-bottom
                      class="my-sticky-header-column-table"
                      :rows="comisionBonoVendedor?.facturas"
                      :columns="columnasFacturas"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                      v-if="
                        comisionBonoVendedor?.infoVendedor
                          ?.claveDepartamento === 'SEM'
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
                              props.row.descuentoVentas.toLocaleString(
                                "es-MX",
                                {
                                  style: "currency",
                                  currency: "MXN",
                                }
                              )
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
                          <q-td
                            style="text-align: left; background-color: yellow"
                          >
                            {{ props.row.serie }}
                          </q-td>
                          <q-td
                            style="text-align: center; background-color: yellow"
                          >
                            {{
                              Number(props.row.utilidad).toLocaleString(
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
                              Number(props.row.traslado).toLocaleString(
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
                              Number(props.row.cortesias).toLocaleString(
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
                              Number(props.row.gasolina).toLocaleString(
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
                      :rows="comisionBonoVendedor?.facturas"
                      :columns="columnasFacturasSeminuevas"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                      v-else-if="
                        comisionBonoVendedor?.infoVendedor
                          ?.claveDepartamento === 'NUE'
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
                              props.row.garantia_extendida.toLocaleString(
                                "es-MX",
                                {
                                  style: "currency",
                                  currency: "MXN",
                                }
                              )
                            }}
                          </q-td>
                          <q-td style="text-align: center">
                            {{
                              props.row.acondicionamiento.toLocaleString(
                                "es-MX",
                                {
                                  style: "currency",
                                  currency: "MXN",
                                }
                              )
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
                      :rows="comisionBonoVendedor?.pvas"
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
                              Number(props.row.utilidad).toLocaleString(
                                "es-MX",
                                {
                                  style: "currency",
                                  currency: "MXN",
                                }
                              )
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
                              Number(props.row.utilidad).toLocaleString(
                                "es-MX",
                                {
                                  style: "currency",
                                  currency: "MXN",
                                }
                              )
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
                      :rows="comisionBonoVendedor?.totalUtilidadBruta"
                      :columns="columnasUtilidadBruta"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                      v-if="
                        comisionBonoVendedor?.infoVendedor
                          ?.claveDepartamento === 'NUE'
                      "
                    >
                      <template v-slot:body="props">
                        <q-tr>
                          <q-td style="text-align: center">
                            {{
                              props.row.totalBaseComision.toLocaleString(
                                "es-MX",
                                {
                                  style: "currency",
                                  currency: "MXN",
                                }
                              )
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
                              props.row.totalUtilidadBruta.toLocaleString(
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
                      class="my-sticky-header-column-table q-mt-lg"
                      :rows="comisionBonoVendedor?.totalUtilidadBruta"
                      :columns="columnasUtilidadBrutaSeminuevos"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                      v-if="
                        comisionBonoVendedor?.infoVendedor
                          ?.claveDepartamento === 'SEM'
                      "
                    >
                      <template v-slot:body="props">
                        <q-tr>
                          <q-td style="text-align: center">
                            {{
                              props.row.totalBaseComision.toLocaleString(
                                "es-MX",
                                {
                                  style: "currency",
                                  currency: "MXN",
                                }
                              )
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
                              props.row.totalUtilidadBruta.toLocaleString(
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
                  </q-scroll-area>
                </div>
              </q-tab-panel> -->
        <!-- </q-tab-panels> -->
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
              icon-right="check"
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
import { computed, onMounted, ref } from "vue";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { useRouter } from "vue-router";
import { listaMeses } from "src/helpers/listas";
import { useAutorizacionesStore } from "src/stores/autorizaciones";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { formatearFecha } from "src/helpers/formatearFecha";
import { notificacion } from "src/helpers/mensajes";
import { obtenerNumeroMes, obtenerNumerosDeMes } from "src/constant/constantes";

export default {
  setup() {
    const useFacturas = useFacturasStore();
    const { obtenerComisionesSuAuto } = useFacturas;
    const { comisionVendedorSuAuto } = storeToRefs(useFacturas);

    const useFormularios = useFormulariosStore();
    const { desencriptarData, obtenerUrlComision } = useFormularios;
    const { urlComision } = storeToRefs(useFormularios);

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
    const {
      aceptarAutorizacion,
      enviarComisionJefe,
      rechazarComision,
      enviarComisionRechazo,
      obtenerInfoVendedorByID,
      obtenerInfoAutorizacion,
    } = useAutorizaciones;

    const cargando = ref(true);
    const router = useRouter();

    const infoUrl = ref({
      idAsesor: router.currentRoute.value.params.idAsesor,
      mes: router.currentRoute.value.params.mes,
      anio: router.currentRoute.value.params.anio,
      idAutorizacion: router.currentRoute.value.params.idAutorizacion,
    });

    const mes = ref("");

    const pagination = ref({
      rowsPerPage: 10000,
    });

    const cargandoPDF = ref(false);
    const cargandoConfirmacion = ref(false);
    const cargandoRechazar = ref(false);

    const comentario = ref("");

    const infoVendedorAutorizacion = ref(null);

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
        label: "Total a pagar",
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
        label: "Total a pagar",
      },
    ];

    const columnasDescuentosNoExisten = [
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
      {
        name: "pago",
        label: "Pago por contrato",
        align: "center",
        field: (row) =>
          row.pago
            ? row.pago.toLocaleString("es-MX", {
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

    const autorizaciones = ref(null);

    onMounted(async () => {
      mes.value = listaMeses[infoUrl.value.mes];

      infoVendedorAutorizacion.value = await obtenerInfoVendedorByID(
        infoUrl.value.idAsesor
      );

      autorizaciones.value = await obtenerInfoAutorizacion(infoUrl.value.idAutorizacion);

      await buscarComision();

      cargando.value = false;
    });

    const buscarComision = async () => {
      const objBusqueda = {
        idErp: "",
        idAsesor: infoUrl.value.idAsesor,
        anio: Number(infoUrl.value.anio),
        mes: Number(infoUrl.value.mes),
      };

      await obtenerInfoVendedor(objBusqueda.idAsesor);

      if (
        informacionVendedor.value.claveDepartamento == "SUAUTO" ||
        informacionVendedor.value.claveDepartamento == "COOR SUAUTO"
      ) {
        await obtenerComisionesSuAuto(objBusqueda);
      } else {
        await obtenerComisionVendedor(objBusqueda);

        const busquedaBonoObj = {
          idAsesor: infoUrl.value.idAsesor,
          anio: infoUrl.value.anio,
          mes: infoUrl.value.mes,
          claveDepartamentoVendedor: infoVendedorAutorizacion.value.claveDepartamento,
          desdeCalculador: true,
        };

        // await obtenerComisionBonoVendedor(busquedaBonoObj);
      }
    };

    const enviarComision = async () => {
      try {
        cargandoConfirmacion.value = true;

        const autorizacionVendedor = autorizaciones.value.autorizaciones_comisiones_autos_detalles.find(
          (autorizacion) => autorizacion.tipoEmpleado === "JEFE"
        );

        const data = {
          idAutorizacionDetalle: autorizacionVendedor.idAutorizacionDetalle,
          comentario: comentario.value,
          idAutorizacion: infoUrl.value.idAutorizacion,
          autorizacionJefe: true,
        };

        await aceptarAutorizacion(data);

        notificacion("positive", "Comisión aceptada correctamente");
      } catch (error) {
        console.log(error);
      } finally {
        cargandoConfirmacion.value = false;
      }
    };

    const descargarPDF = async () => {
      console.log("Descargar PDF");
    };

    const rechazoComision = async () => {
      cargandoRechazar.value = true;

      const autorizacionVendedor = autorizaciones.value.autorizaciones_comisiones_autos_detalles.find(
        (autorizacion) => autorizacion.tipoEmpleado === "JEFE"
      );

      const data = {
        idAutorizacionDetalle: autorizacionVendedor.idAutorizacionDetalle,
        comentario: comentario.value,
        idAutorizacion: infoUrl.value.idAutorizacion,
      };

      await rechazarComision(data);

      const linkComision = `https://www.gruver.com.mx/portal_comisiones_unidades_autos/#/autorizacion/vendedor/${infoUrl.value.idAsesor}/${infoUrl.value.mes}/${infoUrl.value.anio}/${infoUrl.value.idAutorizacion}`;

      const objMensaje = {
        infoVendedor: comisionVendedor.value.infoVendedor,
        mes: mes.value,
        comentario: comentario.value,
        link: linkComision,
        infoAutorizacion: autorizaciones.value,
      };

      await enviarComisionRechazo(objMensaje);

      cargandoRechazar.value = false;

      notificacion("positive", "Comisión rechazada");
    };

    const tabs = ref("comision");

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
      return generarColumnasFacturas(comisionVendedor.value?.flotillas?.facturas);
    });

    // Función para generar columnas de facturas dinámicamente
    const generarColumnasFacturas = (facturas) => {
      const columnas = [...columnasFacturasBase];

      if (requiereGastoFinanciero(facturas)) {
        columnas.push(columnaGastoFinanciero);
      }

      columnas.push(...columnasFacturasDespuesUtilidad);
      return columnas;
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

    // Función para verificar si alguna factura requiere mostrar gasto financiero
    const requiereGastoFinanciero = (facturas) => {
      if (!facturas || facturas.length === 0) return false;
      return facturas.some((factura) => {
        if (!factura.fechaFactura) return false;
        const fechaFactura = new Date(factura.fechaFactura);
        return (
          fechaFactura.getFullYear() >= 2025 &&
          (fechaFactura.getFullYear() > 2025 || fechaFactura.getMonth() >= 8)
        );
      });
    };

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

    return {
      // States
      comisionVendedor,
      cargando,
      mes,
      columnasFacturas,
      pagination,
      columnasPvas,
      columnasUtilidadBruta,
      columnasKPIs,
      columnasDescuentosVendedor,
      cargandoPDF,
      cargandoConfirmacion,
      comentario,
      cargandoRechazar,
      infoVendedorAutorizacion,
      comisionBonoVendedor,
      columnasFacturasSeminuevas,
      columnasUtilidadBrutaSeminuevos,
      columnasDescuentosVendedorSeminuevos,
      bonoAprobado,
      tabs,
      columnasDescuentosNoExisten,
      columnasComisionSuAuto,
      columnasComisionCoorSuAuto,
      columnasFacturasSuAuto,
      autorizaciones,
      comisionVendedorSuAuto,
      columnasDesgloseDescuentos,
      urlComision,
      infoUrl,
      columnaGastoFinanciero,
      columnasFacturasFlotillas,
      // Methods
      enviarComision,
      descargarPDF,
      rechazoComision,
      generarColumnasFacturas,
      requiereGastoFinanciero,
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
