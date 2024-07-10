<template>
  <q-layout>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <h2>Panel de revisión de facturas</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        :loading="cargando"
        color="primary"
        :columns="columns"
        :filter="buscar"
        :rows="facturasFiltrada"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
        v-model:selected="facturaSeleccionada"
        selection="single"
        row-key="indice"
      >
        <template v-slot:top>
          <div class="fit row q-gutter-sm q-mb-sm justify-end">
            <div class="col">
              <q-input
                outlined
                dense
                v-model="buscar"
                :disable="cargando"
                placeholder="Buscar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <q-btn
              dense
              color="primary"
              icon-right="save"
              label="Guardar Facturas"
              no-caps
              :disable="cargando"
              @click="enviarComisiones()"
            />
          </div>
          <div class="fit row q-gutter-sm">
            <q-btn-dropdown
              dense
              outline
              class="col q-ma-sm"
              color="grey"
              label="Empresas"
            >
              <q-separator class="q-mx-md bg-gray"></q-separator>
              <q-option-group
                class="q-pa-md"
                dense
                :options="opcionesEmpresas"
                v-model="empresaSeleccionada"
                type="radio"
                @update:model-value="filtrarFacturas(true)"
              />
            </q-btn-dropdown>
            <q-btn-dropdown
              dense
              outline
              class="col q-ma-sm"
              color="grey"
              label="Sucursales"
            >
              <q-separator class="q-mx-sm bg-gray"></q-separator>

              <q-option-group
                class="q-pa-md"
                dense
                :options="opcionesSucursales"
                v-model="sucursalSeleccionada"
                type="radio"
                @update:model-value="filtrarFacturas()"
              />
            </q-btn-dropdown>
          </div>
          <div class="fit row q-gutter-sm">
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                :disable="cargando"
                :options="listaAnios"
                v-model="anioSeleccionado"
                @update:model-value="filtrarFacturas(true)"
                map-options
                option-value="name"
              />
            </div>
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                :disable="cargando"
                :options="departamentos"
                v-model="departamentoSeleccionado"
                @update:model-value="filtrarFacturas(true)"
                map-options
                option-value="name"
              />
            </div>
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                :disable="cargando"
                :options="listaMeses"
                v-model="mesSeleccionado"
                @update:model-value="filtrarFacturas(true)"
                map-options
                option-value="name"
              />
            </div>
            <div class="col q-ma-sm">
              <q-select
                outlined
                dense
                :disable="cargando"
                v-model="quincenaSeleccionada"
                :options="listaQuincenas"
                @update:model-value="filtrarFacturas(true)"
                option-label="descripcion"
              >
              </q-select>
            </div>
          </div>
        </template>
      </q-table>
      <div class="q-my-sm" v-if="facturaSeleccionada[0]">
        <div class="row justify-center">
          <h3>Detalle Factura</h3>
        </div>
        <div class="q-px-md row items-start q-gutter-md row justify-center">
          <q-card class="my-card">
            <q-card-section class="inline justify-center">
              <div class="text-h5 text-center text-weight-bolder">
                {{ facturaSeleccionada[0]?.factura }}
              </div>
              <div class="text-h6 text-center text-weight-medium">
                ({{ facturaSeleccionada[0]?.tipo_venta }})
              </div>
              <div style="display: flex; width: 100%; justify-content: center">
                <q-chip
                  :color="
                    facturaSeleccionada[0]?.estadoFactura.toUpperCase() ===
                    'FACTURADA'
                      ? 'green'
                      : 'red'
                  "
                  :label="facturaSeleccionada[0]?.estadoFactura.toUpperCase()"
                  class="text-white text-bold"
                />
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h5 text-center">
                Vendedor:
                <span class="text-weight-medium">{{
                  facturaSeleccionada[0]?.nombre
                }}</span>
              </div>
              <div class="text-h5 text-center">
                Número de empleado:
                <span class="text-weight-medium">{{
                  Number(facturaSeleccionada[0]?.no_empleado)
                }}</span>
              </div>
            </q-card-section>
            <q-card-section class="row justify-around q-px-lg">
              <div class="text-h5 text-center">
                Fecha factura:
                <span class="text-weight-medium">
                  {{
                    formatearFecha(facturaSeleccionada[0]?.fecha_facturacion)
                  }}
                </span>
              </div>
              <div class="text-h5 text-center">
                Utilidad Bruta:
                <span class="text-weight-medium">
                  {{ formatearMonto(facturaSeleccionada[0]?.utilidad) }}</span
                >
              </div>
              <!-- <div class="text-h5 text-center">
                Gasto Financiero:
                <span class="text-weight-medium">
                  {{
                    formatearMonto(facturaSeleccionada[0]?.gastoFinanciero)
                  }}</span
                >
              </div> -->
              <div class="text-h5 text-center">
                Utilidad:
                <span class="text-weight-medium">
                  {{
                    formatearMonto(facturaSeleccionada[0]?.utilidadCalculada)
                  }}</span
                >
              </div>
            </q-card-section>
            <q-card-section class="inline justify-center q-px-md">
              <div class="text-center">
                <q-expansion-item
                  class="text-h5 text-weight-bolder"
                  v-model="expanded"
                  label="Desglose"
                >
                  <q-card class="text-body1">
                    <q-table
                      hide-bottom
                      color="primary"
                      :rows="facturaSeleccionada"
                      :columns="columnsDetalles"
                      no-data-label="No se encontró información disponible."
                      loading-label="Buscando información . . ."
                      class="q-ma-md"
                    >
                    </q-table>
                  </q-card>
                </q-expansion-item>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <modal-confirmar-envio ref="modalConfirmarEnvio"></modal-confirmar-envio>
  </q-layout>
</template>

<script>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { useSucursalesStore } from "src/stores/catalogos/sucursales";
import { useEmpresasStore } from "src/stores/catalogos/empresas";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { filtrarElementos } from "src/helpers/filtros";
import { formatearFecha } from "src/helpers/formatearFecha";
import { listaMeses, listaAnios, listaQuincenas } from "src/helpers/listas";
import {
  formatearCapitalCase,
  formatearMonto,
  formatearPorcentajeDecimal,
} from "src/helpers/formatos";
import ModalConfirmarEnvio from "src/components/ModalConfirmarEnvio.vue";

export default {
  components: {
    ModalConfirmarEnvio,
  },
  setup() {
    const useAutenticacion = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticacion);

    const useEmpresas = useEmpresasStore();
    const { obtenerEmpresas } = useEmpresas;
    const { empresas, empresaSeleccionada } = storeToRefs(useEmpresas);

    const useSucursales = useSucursalesStore();
    const { obtenerSucursales } = useSucursales;
    const { sucursales, sucursalSeleccionada } = storeToRefs(useSucursales);

    const useDepartamentos = useDepartamentosStore();
    const { obtenerDepartamentos } = useDepartamentos;
    const { departamentos, departamentoSeleccionado } =
      storeToRefs(useDepartamentos);

    const useFacturas = useFacturasStore();
    const { obtenerFacturas } = useFacturas;
    const {
      facturas,
      facturaSeleccionada,
      facturasFiltrada,
      valoresUnicosSucursal,
      cargando,
      anioSeleccionado,
      mesSeleccionado,
      quincenaSeleccionada,
    } = storeToRefs(useFacturas);

    const opcionesEmpresas = ref([]);
    const opcionesSucursales = ref([]);
    const grupoEmpresas = ref([]);
    const modalConfirmarEnvio = ref(null);
    const usuarioAutorizado = ref(false);

    const columns = [
      {
        name: "factura",
        label: "Factura",
        field: "factura",
        align: "left",
        sortable: true,
      },
      {
        name: "fecha_facturacion",
        label: "Fecha factura",
        field: (row) => formatearFecha(row.fecha_facturacion),
        align: "left",
        sortable: true,
      },
      {
        name: "tipo_venta",
        label: "Tipo de venta",
        field: "tipo_venta",
        align: "left",
        sortable: true,
      },
      {
        name: "modelo",
        label: "Modelo",
        field: "modelo",
        align: "left",
        sortable: true,
      },
      {
        name: "utilidad",
        label: "Utilidad Bruta",
        field: (row) =>
          row.utilidad ? formatearMonto(row.utilidad) : formatearMonto(0),
        align: "left",
        sortable: true,
      },
      // {
      //   name: "gastoFinanciero",
      //   label: "Gasto Financiero",
      //   field: (row) =>
      //     row.gastoFinanciero
      //       ? formatearMonto(row.gastoFinanciero)
      //       : formatearMonto(0),
      //   align: "left",
      //   sortable: true,
      // },
      // {
      //   name: "utilidadCalculada",
      //   label: "Utilidad",
      //   field: (row) =>
      //     row.utilidadCalculada
      //       ? formatearMonto(row.utilidadCalculada)
      //       : formatearMonto(0),
      //   align: "left",
      //   sortable: true,
      // },
      // {
      //   name: "porcentaje",
      //   label: "Porcentaje",
      //   field: (row) =>
      //     row.porcentaje
      //       ? formatearPorcentajeDecimal(row.porcentaje)
      //       : formatearPorcentajeDecimal(0),
      //   align: "left",
      //   sortable: true,
      // },
    ];

    const columnsDetalles = [
      {
        name: "no_inventario",
        label: "Inventario",
        field: "no_inventario",
        align: "left",
        sortable: true,
      },
      {
        name: "vin",
        label: "Vin",
        field: "vin",
        align: "left",
        sortable: true,
      },
      {
        name: "marca",
        label: "Marca",
        field: "marca",
        align: "left",
        sortable: true,
      },
      {
        name: "modelo",
        label: "Modelo",
        field: "modelo",
        align: "left",
        sortable: true,
      },
      {
        name: "año",
        label: "Año",
        field: "año",
        align: "left",
        sortable: true,
      },
      {
        name: "cliente",
        label: "Cliente",
        field: "cliente",
        align: "left",
        sortable: true,
      },
      {
        name: "importe_venta",
        label: "Importe Venta",
        field: (row) =>
          row.importe_venta
            ? formatearMonto(row.importe_venta)
            : formatearMonto(0),
        align: "left",
        sortable: true,
      },
      {
        name: "iva",
        label: "IVA",
        field: (row) => (row.iva ? formatearMonto(row.iva) : formatearMonto(0)),
        align: "left",
        sortable: true,
      },
      {
        name: "importe_total",
        label: "Importe Total",
        field: (row) =>
          row.importe_total
            ? formatearMonto(row.importe_total)
            : formatearMonto(0),
        align: "left",
        sortable: true,
      },
      {
        name: "costo",
        label: "Costo",
        field: (row) =>
          row.costo ? formatearMonto(row.costo) : formatearMonto(0),
        align: "left",
        sortable: true,
      },
      {
        name: "desc_cxc",
        label: "Descuentos",
        field: (row) =>
          row.desc_cxc ? formatearMonto(row.desc_cxc) : formatearMonto(0),
        align: "left",
        sortable: true,
      },
      {
        name: "anticipos",
        label: "Anticipos",
        field: (row) =>
          row.anticipos ? formatearMonto(row.anticipos) : formatearMonto(0),
        align: "left",
        sortable: true,
      },
      {
        name: "fecha_entrega",
        label: "Fecha Entrega",
        field: (row) => formatearFecha(row.fecha_entrega),
        align: "left",
        sortable: true,
      },
    ];

    onMounted(async () => {
      await obtenerEmpresas();
      await obtenerSucursales();
      // await obtenerDepartamentos();
      facturaSeleccionada.value = [];
      facturasFiltrada.value = [];

      opcionesEmpresas.value = empresas.value.map((empresa) => {
        empresa.label = formatearCapitalCase(empresa.razonSocial);
        empresa.value = empresa;
        return empresa;
      });

      opcionesSucursales.value = sucursales.value.map((sucursal) => {
        return {
          label: formatearCapitalCase(sucursal.nombreSucursal),
          value: { ...sucursal },
        };
      });

      //Declaro la primera empresa, sucursal y departamento
      empresaSeleccionada.value = opcionesEmpresas.value[0];
      sucursalSeleccionada.value = opcionesSucursales.value[0].value;
      departamentoSeleccionado.value = departamentos.value[0];

      await filtrarFacturas(true);

      //Habilitar boton envio
      if (
        usuarioAutenticado.value.puesto === "ASISTENTE DE VENTAS" ||
        usuarioAutenticado.value.puesto === "PROGRAMADOR JUNIOR" ||
        usuarioAutenticado.value.puesto === "ENLACE FINANCIERO"
      ) {
        if (facturasFiltrada.value.length > 0) {
          usuarioAutorizado.value = true;
        }
      } else {
        usuarioAutorizado.value = false;
      }
    });

    const filtrarFacturas = async (buscarFacturas) => {
      facturaSeleccionada.value = [];
      facturasFiltrada.value = [];
      if (buscarFacturas) {
        await obtenerFacturas();
      }
      grupoEmpresas.value = [empresaSeleccionada.value.claveEmpresa];
      //TODAS LAS SUCURSALES PERTENECIENTES A LA EMPRESA
      opcionesSucursales.value = filtrarElementos(
        grupoEmpresas,
        sucursales,
        "claveEmpresa"
      ).map((sucursal) => {
        return {
          label: formatearCapitalCase(sucursal.nombreSucursal),
          value: { ...sucursal },
        };
      });
      //SOLO SUCURSALES CON FACTURAS
      opcionesSucursales.value = opcionesSucursales.value.filter((sucursal) =>
        valoresUnicosSucursal.value.includes(sucursal.value.idErp)
      );

      if (buscarFacturas) {
        sucursalSeleccionada.value = opcionesSucursales.value[0].value;
      } else {
        sucursalSeleccionada.value = opcionesSucursales.value.find(
          (sucursal) =>
            sucursal.value.idErp === sucursalSeleccionada.value.idErp
        ).value;
      }

      //Filtro por sucursal
      facturasFiltrada.value = facturas.value.filter(
        (factura) => factura.id_plaza === sucursalSeleccionada.value.idErp
      );

      let indice = 0;
      facturasFiltrada.value = facturasFiltrada.value.map((factura) => {
        return {
          ...factura,
          indice: indice++,
        };
      });

      if (
        usuarioAutenticado.value.puesto === "ASISTENTE DE VENTAS" ||
        usuarioAutenticado.value.puesto === "PROGRAMADOR JUNIOR" ||
        usuarioAutenticado.value.puesto === "ENLACE FINANCIERO"
      ) {
        if (facturasFiltrada.value.length > 0) {
          usuarioAutorizado.value = true;
        }
      } else {
        usuarioAutorizado.value = false;
      }
    };

    const enviarComisiones = async () => {
      modalConfirmarEnvio.value.abrir();
    };

    return {
      facturas,
      facturasFiltrada,
      facturaSeleccionada,
      filtrarFacturas,

      columns,
      columnsDetalles,
      buscar: ref(""),
      usuarioAutenticado,

      sucursales,
      sucursalSeleccionada,
      opcionesSucursales,

      empresas,
      empresaSeleccionada,
      opcionesEmpresas,

      departamentos,
      departamentoSeleccionado,

      listaAnios,
      listaMeses,
      listaQuincenas,

      anioSeleccionado,
      mesSeleccionado,
      quincenaSeleccionada,
      cargando,

      formatearFecha,
      formatearMonto,

      usuarioAutorizado,
      expanded: ref(true),
      enviarComisiones,
      modalConfirmarEnvio,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 100rem
</style>
