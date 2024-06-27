<template>
  <q-layout>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <h2>Descuentos en Libro de Ventas</h2>
      </div>
      <q-separator color="primary" class="q-my-md" />
      <q-table
        :loading="cargando"
        color="primary"
        :columns="columns"
        :visible-columns="columnasVisibles"
        :filter="buscar"
        :rows="comisionesFiltradas"
        binary-state-sort
        no-data-label="No se encontró información disponible."
        no-results-label="No se encontraron coincidencias."
        loading-label="Buscando información . . ."
      >
        <template v-slot:body-cell-acciones="props">
          <q-td>
            <q-btn
              flat
              color="primary"
              icon="edit"
              @click="agregarDescuentos(props.row)"
            >
              <q-tooltip>Agregar Descuento</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-previa="props">
          <td>
            {{
              props.row.descuentosUnidades[0]?.previa
                ? formatearMonto(props.row.descuentosUnidades[0]?.previa)
                : formatearMonto(0)
            }}
          </td>
        </template>

        <template v-slot:body-cell-traslado="props">
          <td>
            {{
              props.row.descuentosUnidades[0]?.traslado
                ? formatearMonto(props.row.descuentosUnidades[0]?.traslado)
                : formatearMonto(0)
            }}
          </td>
        </template>

        <template v-slot:body-cell-descVentas="props">
          <td>
            {{
              props.row.descuentosUnidades[0]?.descVentas
                ? formatearMonto(props.row.descuentosUnidades[0]?.descVentas)
                : formatearMonto(0)
            }}
          </td>
        </template>

        <template v-slot:body-cell-cortesia="props">
          <td v-if="departamentoSeleccionado.label === 'NUEVAS'">
            {{
              props.row.descuentosUnidades[0]?.cortesia
                ? formatearMonto(props.row.descuentosUnidades[0]?.cortesia)
                : formatearMonto(0)
            }}
          </td>
          <!-- Honestamente, esta es una solucion de Copilot jeje -->
          <td v-else>
            {{
              (props.row.descuentosUnidadesSeminuevos || [])[0]?.cortesias
                ? formatearMonto(
                    (props.row.descuentosUnidadesSeminuevos || [])[0]?.cortesias
                  )
                : formatearMonto(0)
            }}
          </td>
        </template>

        <template v-slot:body-cell-gasolina="props">
          <td>
            {{
              props.row.descuentosUnidades[0]?.gasolina
                ? formatearMonto(props.row.descuentosUnidades[0]?.gasolina)
                : formatearMonto(0)
            }}
          </td>
        </template>

        <template v-slot:body-cell-bonoub="props">
          <td>
            {{
              props.row.descuentosUnidades[0]?.bonoub
                ? formatearMonto(props.row.descuentosUnidades[0]?.bonoub)
                : formatearMonto(0)
            }}
          </td>
        </template>

        <template v-slot:body-cell-garantia_extendida="props">
          <td>
            {{
              props.row.descuentosUnidadesSeminuevos[0]?.garantia_extendida
                ? formatearMonto(
                    props.row.descuentosUnidadesSeminuevos[0]
                      ?.garantia_extendida
                  )
                : formatearMonto(0)
            }}
          </td>
        </template>

        <template v-slot:body-cell-acondicionamiento="props">
          <td>
            {{
              props.row.descuentosUnidadesSeminuevos[0]?.acondicionamiento
                ? formatearMonto(
                    props.row.descuentosUnidadesSeminuevos[0]?.acondicionamiento
                  )
                : formatearMonto(0)
            }}
          </td>
        </template>

        <template v-slot:body-cell-gestorias="props">
          <td>
            {{
              props.row.descuentosUnidadesSeminuevos[0]?.gestorias
                ? formatearMonto(
                    props.row.descuentosUnidadesSeminuevos[0]?.gestorias
                  )
                : formatearMonto(0)
            }}
          </td>
        </template>

        <template v-slot:body-cell-toma_unidad="props">
          <td>
            {{
              props.row.descuentosUnidadesSeminuevos[0]?.toma_unidad
                ? formatearMonto(
                    props.row.descuentosUnidadesSeminuevos[0]?.toma_unidad
                  )
                : formatearMonto(0)
            }}
          </td>
        </template>

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
                @update:model-value="filtrarEmpresas"
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
                @update:model-value="filtrarFacturas"
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
                @update:model-value="filtrarFacturas"
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
                @update:model-value="filtrarFacturas"
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
                @update:model-value="filtrarFacturas"
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
                @update:model-value="filtrarFacturas"
                option-label="descripcion"
              >
              </q-select>
            </div>
          </div>
        </template>
      </q-table>
    </div>
    <modal-descuentos ref="modalDescuento"></modal-descuentos>
  </q-layout>
</template>

<script>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { useSucursalesStore } from "src/stores/catalogos/sucursales";
import { useEmpresasStore } from "src/stores/catalogos/empresas";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";
import { useComisionesStore } from "src/stores/catalogos/comisionesUnidades";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { filtrarElementos } from "src/helpers/filtros";
import { formatearFecha } from "src/helpers/formatearFecha";
import { listaMeses, listaAnios, listaQuincenas } from "src/helpers/listas";
import { formatearCapitalCase, formatearMonto } from "src/helpers/formatos";
import {
  obtenerNumeroQuincena,
  obtenerNumerosDeMes,
} from "src/constant/constantes";
import ModalDescuentos from "src/components/ModalDescuentos.vue";
import { de } from "date-fns/locale";

export default {
  components: {
    ModalDescuentos,
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

    const useComisiones = useComisionesStore();
    const { obtenerComisionesUnidades } = useComisiones;
    const { comisionesUnidades, comisionesFiltradas, cargando } =
      storeToRefs(useComisiones);

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado, quincenaSeleccionada } =
      storeToRefs(useFacturas);

    const opcionesEmpresas = ref([]);
    const opcionesSucursales = ref([]);
    const grupoEmpresas = ref([]);
    const objComisionesInit = {};
    const modalDescuento = ref(null);

    const columns = [
      {
        name: "factura",
        label: "Factura",
        align: "left",
        field: "factura",
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
        name: "modelo",
        label: "Modelo",
        align: "left",
        field: "modelo",
        sortable: true,
      },
      {
        name: "vin",
        label: "Num. Serie",
        align: "left",
        field: "vin",
        sortable: true,
      },
      {
        name: "previa",
        label: "Previa",
        align: "left",
        sortable: true,
      },
      {
        name: "traslado",
        label: "Traslado",
        align: "left",
        sortable: true,
      },
      {
        name: "descVentas",
        label: "Desc/Ventas",
        align: "left",
        sortable: true,
      },
      {
        name: "gasolina",
        label: "Gasolina",
        align: "left",
        sortable: true,
      },
      {
        name: "bonoub",
        label: "Bono U.B.",
        align: "left",
        sortable: true,
      },
      {
        name: "garantia_extendida",
        label: "Garantía Extendida",
        align: "left",
        sortable: true,
      },
      {
        name: "acondicionamiento",
        label: "Acondicionamiento",
        align: "left",
        sortable: true,
      },
      {
        name: "gestorias",
        label: "Gestorías",
        align: "left",
        sortable: true,
      },
      {
        name: "toma_unidad",
        label: "Toma Unidad",
        align: "left",
        sortable: true,
      },
      {
        name: "cortesia",
        label: "Cortesia",
        align: "left",
        sortable: true,
      },
      {
        name: "acciones",
        align: "left",
        sortable: true,
      },
    ];

    const columnasVisibles = ref([]);

    onMounted(async () => {
      await obtenerEmpresas();
      await obtenerSucursales();
      // await obtenerDepartamentos();

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
      grupoEmpresas.value = [empresaSeleccionada.value.claveEmpresa];

      await filtrarEmpresas();

      //Filtro por sucursal
      comisionesFiltradas.value = comisionesUnidades.value.filter(
        (comision) => comision.id_plaza === sucursalSeleccionada.value.idErp
      );

      await filtrarFacturas();
    });

    const filtrarEmpresas = async () => {
      objComisionesInit.value = {
        claveEmpresa: empresaSeleccionada.value.value.claveEmpresa,
        condicion: departamentoSeleccionado.value.value.nombreDepartamento,
        quincena: obtenerNumeroQuincena(quincenaSeleccionada.value),
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
        anio: anioSeleccionado.value,
      };

      await obtenerComisionesUnidades(objComisionesInit.value);
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
    };

    const filtrarFacturas = async () => {
      objComisionesInit.value = {
        claveEmpresa: empresaSeleccionada.value.value.claveEmpresa,
        condicion: departamentoSeleccionado.value.value.nombreDepartamento,
        quincena: obtenerNumeroQuincena(quincenaSeleccionada.value),
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
        anio: anioSeleccionado.value,
      };
      await obtenerComisionesUnidades(objComisionesInit.value);
      comisionesFiltradas.value = comisionesUnidades.value.filter(
        (factura) => factura.id_plaza === sucursalSeleccionada.value.idErp
      );

      columnasVisibles.value =
        departamentoSeleccionado.value.label === "NUEVAS"
          ? [
              "factura",
              "fecha_facturacion",
              "modelo",
              "vin",
              "previa",
              "traslado",
              "descVentas",
              "cortesia",
              "gasolina",
              "bonou",
              "acciones",
            ]
          : [
              "factura",
              "fecha_facturacion",
              "modelo",
              "vin",
              "garantia_extendida",
              "acondicionamiento",
              "gestorias",
              "toma_unidad",
              "cortesia",
              "acciones",
            ];
    };

    const agregarDescuentos = async (objFactura) => {
      modalDescuento.value.abrir(objFactura);
    };

    return {
      comisionesFiltradas,
      filtrarFacturas,

      columns,
      columnasVisibles,
      buscar: ref(""),
      usuarioAutenticado,

      sucursales,
      sucursalSeleccionada,
      opcionesSucursales,

      empresas,
      empresaSeleccionada,
      opcionesEmpresas,
      filtrarEmpresas,

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

      expanded: ref(true),
      agregarDescuentos,
      modalDescuento,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 100rem
</style>
