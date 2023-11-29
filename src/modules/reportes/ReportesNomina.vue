<template>
  <q-layout>
    <div class="q-pa-md">
      <div div class="q-pa-md">
        <h2>Reporte Nómina </h2>
      </div>
      <q-separator color="primary" class="q-my-md"/>
      <q-table
        color="primary"
        :columns="columns"
        :filter="buscar"
        :rows="nomina"
        :loading="cargando"
        :visible-columns="columnasVisibles"
        no-data-label="No se encontró información disponible."
        loading-label="Buscando información . . ."
      >
      <template v-slot:body-cell-ttrPrimeraQuincena="props">
        <q-td :props="props" style="background-color:#e8eef686;">
          {{ typeof props.row.ttrPrimeraQuincena === 'number' ? props.row.ttrPrimeraQuincena.toFixed(4) : props.row.ttrPrimeraQuincena }}
        </q-td>
      </template>
      <template v-slot:body-cell-ttrSegundaQuincena="props">
        <q-td :props="props" style="background-color:#e8eef6; font-weight: bold">
          {{ typeof props.row.ttrSegundaQuincena === 'number' ? props.row.ttrSegundaQuincena.toFixed(4) : props.row.ttrSegundaQuincena }}
        </q-td>
      </template>
      <template v-slot:body-cell-totalNomina="props">
        <q-td :props="props" style="background-color:#305990; color: #e8eef6; font-weight: bold">
          {{ formatearMonto(props.row.totalNomina) }}
        </q-td>
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
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>
          <q-btn
          dense
          color="primary"
          icon-right="send"
          label="Envio Reporte"
          no-caps
          @click="enviarComisiones()"
          />
        </div>
          <div class="fit row q-gutter-sm">
            <q-btn-dropdown  dense outline  class="col q-ma-sm" color="grey" label="Empresas">
              <q-separator class="q-mx-md bg-gray"></q-separator>
              <q-option-group  class="q-pa-md" dense
              :options="opcionesEmpresas"
              v-model="empresaSeleccionada"
              type="radio"
              @update:model-value="filtrarEmpresas"
            />
            </q-btn-dropdown>
              <q-btn-dropdown dense outline  class="col q-ma-sm " color="grey" label="Sucursales">
                <q-separator class="q-mx-sm bg-gray"></q-separator>

                <q-option-group  class="q-pa-md" dense
                :options="opcionesSucursales"
                v-model="sucursalSeleccionada"
                type="radio"
                @update:model-value="busquedaNomina"
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
                @update:model-value="busquedaNomina"
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
                @update:model-value="busquedaNomina"
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
                @update:model-value="busquedaNomina"
                option-label="descripcion"
              >
              </q-select>
            </div>
         </div>
      </template>
      </q-table>
    </div>
   <modal-confirmar-envio ref="modalConfirmarEnvio"></modal-confirmar-envio>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useEmpresasStore } from 'src/stores/catalogos/empresas'
import { useSucursalesStore } from 'src/stores/catalogos/sucursales'
import { useReportesStore } from "src/stores/catalogos/reportes"
import { obtenerNumeroMes, fechaFormateada} from 'src/constant/constantes'
import { formatearCapitalCase } from 'src/helpers/formatos'
import { formatearMonto } from 'src/helpers/formatos'
import { filtrarElementos } from 'src/helpers/filtros'
import { tipoMecanicoMB } from 'src/constant/constantes'
import { listaMeses, listaAnios, listaQuincenas} from 'src/helpers/listas'
import ModalConfirmarEnvio from 'src/components/ModalConfirmarEnvio.vue'

export default {
  components: {
    ModalConfirmarEnvio
  },
  setup () {

    const useEmpresas = useEmpresasStore()
    const {opcionesEmpresas, empresas, grupoEmpresas, empresaSeleccionada } = storeToRefs(useEmpresas)

    const useSucursales = useSucursalesStore()
    const {opcionesSucursales, sucursales, grupoSucursales, sucursalSeleccionada} = storeToRefs(useSucursales)

    const useReportes = useReportesStore()
    const { obtenerNomina } = useReportes
    const { nomina, cargando, anioSeleccionado, mesSeleccionado, quincenaSeleccionada } = storeToRefs(useReportes)

    const columnasVisibles = ref([])
    const modalConfirmarEnvio = ref(null)

    const columns = [
      {
        name: 'id_mec',
        label: 'ID',
        field: 'id_mec',
        align: 'left',
        sortable: true
      },
      {
        name: 'nombreSucursal',
        label: 'Plaza',
        field: 'nombreSucursal',
        align: 'left',
        sortable: true
      },
      {
        name: 'tipoMecanico',
        label: 'Tipo Mecánico',
        field: row => {
          const mecanico = tipoMecanicoMB.find(mecanico => mecanico.data === row.tipoMecanico);
          return mecanico ? mecanico.label : row.tipoMecanico;
        },
        align: 'left',
        sortable: true
      },
      {
        name: 'mecanico',
        label: 'Mecánico',
        field: 'mecanico',
        align: 'left',
        sortable: true
      },
      {
        name: 'totalDestajo',
        label: 'Comisión',
        field: row => row.totalDestajo ? formatearMonto(row.totalDestajo) : formatearMonto(0),
        align: 'left',
        sortable: true
      },
      {
        name: 'costoHora',
        label: 'Costo MO',
        field: row => row.costoHora ? formatearMonto(row.costoHora) : formatearMonto(0),
        align: 'left',
        sortable: true
      },
      {
        name: 'ttr',
        label: 'Horas Tabuladas',
        field: 'ttr',
        align: 'left',
        sortable: true,
      },
      {
        name: 'ttrPrimeraQuincena',
        label: 'Horas 1ra Quincena',
        align: 'right',
        sortable: true,
      },
      {
        name: 'ttrSegundaQuincena',
        label: 'Horas 2da Quincena',
        align: 'right',
        sortable: true,
      },
      {
        name: 'horasMes',
        label: 'Horas Mes',
        field: (row) => {
          if (typeof row.horasMes === 'number') {
            return row.horasMes.toFixed(4)
          } else {
            return row.horasMes
          }
        },
        align: 'left',
        sortable: true,
      },
      {
        name: 'totalRescates',
        label: 'Rescates',
        field: row => row.totalRescates ? formatearMonto(row.totalRescates) : formatearMonto(0),
        align: 'left',
        sortable: true
      },
      {
        name: 'totalGratificaciones',
        label: 'Dias Cap/Vac',
        field: row => row.totalGratificaciones ? formatearMonto(row.totalGratificaciones) : formatearMonto(0),
        align: 'left',
        sortable: true
      },
      {
        name: 'totalNomina',
        label: 'Total',
        field: row => row.totalNomina ? formatearMonto(row.totalNomina) : formatearMonto(0),
        align: 'left',
        sortable: true,
      },

    ]

    const objBusquedaInit = {
      fechaInicio: ``,
      fechaFin: '',
      idPlaza: '',
      fecha: fechaFormateada,
      claveEmpresa: '',
      claveSucursal: '',
      quincena: ''
    }

    const objBusqueda = ref(objBusquedaInit)

    onMounted(async () => {

      objBusqueda.value = {...objBusquedaInit}

      opcionesEmpresas.value = empresas.value.map((empresa) => {
        empresa.label = formatearCapitalCase(empresa.razonSocial)
        empresa.value = empresa
        return empresa
      })

      opcionesSucursales.value = sucursales.value.map((sucursal) => {
        sucursal.label = formatearCapitalCase(sucursal.nombreSucursal)
        sucursal.value = sucursal
        return sucursal
      })

      //Declaro la primera empresa, sucursal y departamento
      empresaSeleccionada.value = opcionesEmpresas.value[0]
      sucursalSeleccionada.value = opcionesSucursales.value[0]
      grupoEmpresas.value = [empresaSeleccionada.value.claveEmpresa]

      objBusqueda.value.idPlaza = sucursalSeleccionada.value?.idContabilidad
      objBusqueda.value.claveSucursal = sucursalSeleccionada.value?.abreviacion
      objBusqueda.value.claveEmpresa = sucursalSeleccionada.value?.claveEmpresa
      objBusqueda.value.fecha = fechaFormateada
      objBusqueda.value.quincena = quincenaSeleccionada.value

      if(quincenaSeleccionada.value === 'Primera Quincena'){
        objBusqueda.value.fechaInicio = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-01`,
        objBusqueda.value.fechaFin = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-15`
        columnasVisibles.value = columns
          .filter((column) => column.name !== 'ttrPrimeraQuincena' && column.name !== 'ttrSegundaQuincena' && column.name !== 'horasMes')
          .map((column) => column.name)
      } else {
        const ultimoDiaDelMes = new Date(anioSeleccionado.value, obtenerNumeroMes(mesSeleccionado.value), 0).getDate()
        objBusqueda.value.fechaInicio = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-16`
        objBusqueda.value.fechaFin = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-${ultimoDiaDelMes}`
        columnasVisibles.value = columns
          .filter((column) => column.name !== 'ttr')
          .map((column) => column.name)
      }

      await filtrarEmpresas()
      await obtenerNomina(objBusqueda.value)
    })

    const busquedaNomina = async () => {
      nomina.value=[]

      objBusqueda.value.idPlaza = sucursalSeleccionada.value?.idContabilidad
      objBusqueda.value.claveSucursal = sucursalSeleccionada.value?.abreviacion
      objBusqueda.value.claveEmpresa = sucursalSeleccionada.value?.claveEmpresa
      objBusqueda.value.fecha = fechaFormateada
      objBusqueda.value.quincena = quincenaSeleccionada.value

      if(quincenaSeleccionada.value === 'Primera Quincena'){
        objBusqueda.value.fechaInicio = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-01`,
        objBusqueda.value.fechaFin = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-15`
        columnasVisibles.value = columns
          .filter((column) => column.name !== 'ttrPrimeraQuincena'  && column.name !== 'ttrSegundaQuincena' && column.name !== 'horasMes')
          .map((column) => column.name)
      } else {
        const ultimoDiaDelMes = new Date(anioSeleccionado.value, obtenerNumeroMes(mesSeleccionado.value), 0).getDate()
        objBusqueda.value.fechaInicio = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-16`
        objBusqueda.value.fechaFin = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-${ultimoDiaDelMes}`
        columnasVisibles.value = columns
          .filter((column) => column.name !== 'ttr')
          .map((column) => column.name)
      }

      await obtenerNomina(objBusqueda.value)
    }

    const filtrarEmpresas = async () => {
      grupoEmpresas.value = [empresaSeleccionada.value.claveEmpresa]
      //TODAS LAS SUCURSALES PERTENECIENTES A LA EMPRESA
      opcionesSucursales.value = filtrarElementos(grupoEmpresas, sucursales, 'claveEmpresa').map((sucursal) => {
        sucursal.label = formatearCapitalCase(sucursal.nombreSucursal)
        sucursal.value = sucursal
        return sucursal
      })
    }

    const enviarComisiones = async () => {
      modalConfirmarEnvio.value.abrir(nomina.value)
    }

    return {
      columns,
      buscar: ref(''),
      objBusqueda,
      cargando,
      columnasVisibles,

      nomina,
      busquedaNomina,

      sucursales,
      grupoSucursales,
      opcionesSucursales,
      sucursalSeleccionada,

      empresas,
      grupoEmpresas,
      opcionesEmpresas,
      filtrarEmpresas,
      empresaSeleccionada,

      listaAnios,
      listaMeses,
      listaQuincenas,
      anioSeleccionado,
      mesSeleccionado,
      quincenaSeleccionada,
      formatearMonto,

      enviarComisiones,
      modalConfirmarEnvio
    }
  }
}
</script>
