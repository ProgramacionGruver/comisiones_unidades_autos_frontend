<template>
  <q-layout>
    <div class="q-ma-md">
      <div class="q-pa-md">
        <h2>Calculador de comisiones</h2>
      </div>
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
          <q-card class="q-mt-md">
            <q-tabs v-model="tabs" indicator-color="yellow" align="justify">
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
            </q-tabs>

            <q-tab-panels v-model="tabs" animated class="bg-white">
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
                          v-else-if="
                            comisionVendedor.infoVendedor.nivel === 'plata'
                          "
                          color="grey"
                          text-color="white"
                          label="PLATA"
                        />
                        <q-chip
                          v-if="
                            comisionVendedor.infoVendedor.nivel === 'bronce'
                          "
                          color="brown"
                          text-color="white"
                          label="BRONCE"
                        />
                        <q-chip
                          v-if="
                            comisionVendedor.infoVendedor.nivel === 'asesor'
                          "
                          color="green"
                          text-color="white"
                          label="ASESOR"
                        />
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
                </div>
                <div>
                  <q-scroll-area style="height: 80rem; width: 100%">
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
                      v-if="
                        comisionVendedor.infoVendedor.claveDepartamento ===
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
                      :rows="comisionVendedor.facturas"
                      :columns="columnasFacturasSeminuevas"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                      v-else-if="
                        comisionVendedor.infoVendedor.claveDepartamento ===
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
                      :rows="comisionVendedor.pvas"
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
                      :rows="comisionVendedor.totalUtilidadBruta"
                      :columns="columnasUtilidadBruta"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                      v-if="
                        comisionVendedor.infoVendedor.claveDepartamento ===
                        'NUE'
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
                      :rows="comisionVendedor.totalUtilidadBruta"
                      :columns="columnasUtilidadBrutaSeminuevos"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                      v-if="
                        comisionVendedor.infoVendedor.claveDepartamento ===
                        'SEM'
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
                              Number(props.row.utilidadBruta).toLocaleString(
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
                              Number(props.row.pagoCompleto).toLocaleString(
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
                              Number(props.row.montoAPagar).toLocaleString(
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
                      class="my-sticky-header-column-table q-mt-lg q-mb-lg"
                      :rows="comisionVendedor.descuentosVendedor"
                      :columns="columnasDescuentosVendedor"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                      v-if="
                        comisionVendedor.infoVendedor.claveDepartamento ===
                        'NUE'
                      "
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
                              Number(props.row.descuento).toLocaleString(
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
                              Number(props.row.inCredit).toLocaleString(
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
                              Number(props.row.suAuto).toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                              })
                            }}
                          </q-td>
                          <q-td style="text-align: center">
                            {{
                              Number(props.row.accesorios).toLocaleString(
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
                              Number(props.row.seminuevos).toLocaleString(
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
                              Number(props.row.totalAPagar).toLocaleString(
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
                      class="my-sticky-header-column-table q-mt-lg q-mb-lg"
                      :rows="comisionVendedor.descuentosVendedor"
                      :columns="columnasDescuentosVendedorSeminuevos"
                      no-data-label="No se encontró informacion disponible."
                      no-results-label="No se encontraron coincidencias."
                      :pagination="pagination"
                      v-else-if="
                        comisionVendedor.infoVendedor.claveDepartamento ===
                        'SEM'
                      "
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
                              Number(props.row.descuento).toLocaleString(
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
                              Number(props.row.accesorios).toLocaleString(
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
                              Number(props.row.nuevos).toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                              })
                            }}
                          </q-td>
                          <q-td style="text-align: center">
                            {{
                              Number(props.row.totalAPagar).toLocaleString(
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
              </q-tab-panel>
              <q-tab-panel name="bono">
                <div v-if="!comisionBonoVendedor">
                  <q-card>
                    <q-card-section>
                      <div class="text-h4">
                        No hay bono del departamento de unidades
                        {{
                          comisionVendedor.infoVendedor.claveDepartamento ===
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
                      :rows="comisionBonoVendedor.facturas"
                      :columns="columnasFactuas"
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
                      :rows="comisionBonoVendedor.totalUtilidadBruta"
                      :columns="columnasUtilidadBruta"
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
                      :rows="comisionBonoVendedor.totalUtilidadBruta"
                      :columns="columnasUtilidadBrutaSeminuevos"
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
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
    <ModalEnviarComision ref="modalEnviarComision" />
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { storeToRefs } from "pinia";
import { listaMeses, listaAnios } from "src/helpers/listas";
import { useKpiStore } from "src/stores/catalogos/kpis";
import { obtenerNumerosDeMes } from "src/constant/constantes";
import { notificacion } from "src/helpers/mensajes";
import ModalEnviarComision from "src/components/ModalEnviarComision.vue";
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj";

export default {
  components: {
    ModalEnviarComision,
  },
  setup() {
    const useFacturas = useFacturasStore();
    const { opcionesVendedores, anioSeleccionado, mesSeleccionado } =
      storeToRefs(useFacturas);

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
      {
        name: "nuevos",
        label: "Nuevos",
      },
      {
        name: "totalAPagar",
        label: "Total a pagar",
      },
    ];

    const columansDescuentosNoExisten = [
      {
        name: "totalAPagar",
        label: "Total a pagar",
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

      cargando.value = true;

      const bucarBonoAprobado = {
        idAsesor: vendedorSeleccionado.value.value.idAsesor,
        anio: anioSeleccionado.value,
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
      };

      await obtenerBonoAprobado(bucarBonoAprobado);

      if (!bonoAprobado.value) {
        notificacion(
          "warning",
          "No se puede calcular la comision debido a que el bono de venta de unidades no ha sido validado por el otro departamento"
        );
        cargando.value = false;
        return;
      }

      const objBusqueda = {
        idErp: vendedorSeleccionado.value.value.idErp,
        idAsesor: vendedorSeleccionado.value.value.idAsesor,
        anio: anioSeleccionado.value,
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
      };

      await obtenerComisionVendedor(objBusqueda);

      const busquedaBonoObj = {
        idAsesor: vendedorSeleccionado.value.value.idAsesor,
        anio: anioSeleccionado.value,
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
        claveDepartamentoVendedor:
          vendedorSeleccionado.value.value.claveDepartamento,
        desdeCalculador: true,
      };

      await obtenerComisionBonoVendedor(busquedaBonoObj);

      if (comisionVendedor.value) {
        cargando.value = false;
        datosCargados.value = true;
      } else {
        cargando.value = false;
        datosCargados.value = false;
      }

      if (comisionBonoVendedor.value) {
        hayBono.value = true;
      } else {
        hayBono.value = false;
      }
    };

    const enviarComision = () => {
      modalEnviarComision.value.abrir(
        comisionVendedor.value.infoVendedor,
        comisionVendedor.value
      );
    };

    const pagination = ref({
      rowsPerPage: 10000,
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
      columnasFactuas,
      pagination,
      columnasPvas,
      columnasUtilidadBruta,
      columnasKPIs,
      columnasDescuentosVendedor,
      modalEnviarComision,
      columnasFacturasSeminuevas,
      columnasDescuentosVendedorSeminuevos,
      columnasUtilidadBrutaSeminuevos,
      columansDescuentosNoExisten,
      tabs,
      comisionBonoVendedor,
      // Methods
      buscarComisiones,
      enviarComision,
      parametrosFiltradosVendedores,
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
}
</style>
