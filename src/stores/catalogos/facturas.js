import { defineStore, storeToRefs } from 'pinia'
import { api } from 'src/boot/axios'
import { anio, obtenerNumeroMes, obtenerNumerosDeMes, obtenerNumeroQuincena, fecha, mesCaido, quincenaCaida} from 'src/constant/constantes'
import { ref } from 'vue'
import { useEmpresasStore } from 'src/stores/catalogos/empresas'
import { useSucursalesStore } from './sucursales'
import { useDepartamentosStore } from 'src/stores/catalogos/departamentos'
import { useGastoFinancieroStore } from 'src/stores/catalogos/gastosFinancieros'
import { useComisionesStore } from 'src/stores/catalogos/comisionesUnidades'
import { formatoFecha } from 'src/helpers/formatearFecha'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { notificacion } from 'src/helpers/mensajes'


export const useFacturasStore = defineStore('facturas',() => {
  const mesSeleccionado = ref(mesCaido())
  const anioSeleccionado = ref(anio)
  const quincenaSeleccionada = ref(quincenaCaida())

  const cargando = ref(true)
  const facturaSeleccionada = ref([])
  const facturas = ref([])
  const detalleFactura = ref([])
  const facturasFiltradas = ref([])
  const facturasFiltrada = ref([])

  const filtro = ref([])
  const registrosEnviados = ref([])
  const valoresUnicosSucursal = ref([])

  const clientes = ref([])
  const opcionesClientes = ref([])

  const vendedores = ref([])
  const opcionesVendedores = ref([])

  const useEmpresas = useEmpresasStore()
  const { empresaSeleccionada } = storeToRefs(useEmpresas)

  const useSucursales = useSucursalesStore()
  const { sucursalSeleccionada } = storeToRefs(useSucursales)

  const useDepartamentos = useDepartamentosStore()
  const { departamentoSeleccionado } = storeToRefs(useDepartamentos)

  const useGastoFinanciero = useGastoFinancieroStore()
  const { obtenerGastoFinanciero} = useGastoFinanciero
  const { gastoFinancieroSeleccionado } = storeToRefs(useGastoFinanciero)

  const useComisiones = useComisionesStore()
  const { obtenerComisionesUnidades } = useComisiones
  const { comisionesUnidades } = storeToRefs(useComisiones)

  const useUsuario = useAutenticacionStore()
  const { usuarioAutenticado } = storeToRefs(useUsuario)

  const obtenerFacturas = async () => {
    try {
      cargando.value = true
      facturaSeleccionada.value = []

      //ARMO LOS OBJETOS DE BÚSQUEDA
      const ObjBusquedaGasto = {
        claveEmpresa: empresaSeleccionada.value.value.claveEmpresa,
        claveSucursal: sucursalSeleccionada.value.abreviacion,
        claveDepartamento: departamentoSeleccionado.value.value.claveDepartamento,
        fecha: formatoFecha(obtenerNumeroQuincena(quincenaSeleccionada.value), obtenerNumerosDeMes(mesSeleccionado.value), anioSeleccionado.value )
      }

      const ObjBusquedaFacturas = {
        claveEmpresa: empresaSeleccionada.value.value.claveEmpresa,
        quincena: obtenerNumeroQuincena(quincenaSeleccionada.value),
        mes: obtenerNumeroMes(mesSeleccionado.value),
        anio: anioSeleccionado.value,
      }

      const ObjComisiones = {
        claveEmpresa: empresaSeleccionada.value.value.claveEmpresa,
        condicion: departamentoSeleccionado.value.value.nombreDepartamento,
        quincena: obtenerNumeroQuincena(quincenaSeleccionada.value),
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
        anio: anioSeleccionado.value,
      }

      //OBTENGO GASTO FINANCIERO
      await obtenerGastoFinanciero(ObjBusquedaGasto)

      if(gastoFinancieroSeleccionado.value){

      //OBTENGO FACTURAS DEL ERP
      if( departamentoSeleccionado.value.value.claveDepartamento === 'NUE'  ){
            const { data } = await api.post('/facturas/unidades/autos/nuevos', ObjBusquedaFacturas)
            facturasFiltradas.value = [...data]
      }else{
            const { data } = await api.post('/facturas/unidades/autos/seminuevos', ObjBusquedaFacturas)
            facturasFiltradas.value = [...data]
      }

      //OBTENGO FACTURAS DEL SISTEMA
      await obtenerComisionesUnidades(ObjComisiones)

      //FILTRAR ELEMENTOS QUE YA ESTEN REGISTRADOS
          registrosEnviados.value =  comisionesUnidades.value.filter(comision => !facturasFiltradas.value.some(factura => factura.factura === comision.factura))
          if(registrosEnviados.value.length > 0){
              filtro.value = [
                            ...comisionesUnidades.value.filter(comision => !facturasFiltradas.value.some(factura => factura.factura === comision.factura)),
                            ...facturasFiltradas.value.filter(factura => !comisionesUnidades.value.some(comision => comision.factura === factura.factura))
                          ]
          }else{
            filtro.value = [
                ...facturasFiltradas.value.filter(factura => !comisionesUnidades.value.some(comision => comision.factura === factura.factura))
            ]
          }


      //CALCULO UTILIDAD, GASTO FINANCIERO Y PORCENTAJE
      facturas.value = filtro.value.map((factura)=>{
        const costoFactura      = parseFloat(factura.costo)
        const tasaInteres       = parseFloat(gastoFinancieroSeleccionado.value.tasaInteres)
        const facturaUtilidad   = parseFloat(factura.utilidad)
        const multiplicacion    = parseFloat(costoFactura*tasaInteres)
        const dividir           = parseFloat(multiplicacion/360)
        const gastoFinanciero    = parseFloat(dividir*60)
        const utilidadCalculada = parseFloat(facturaUtilidad-gastoFinanciero)
        const porcentaje        = parseFloat(utilidadCalculada/costoFactura)
        if( departamentoSeleccionado.value.value.claveDepartamento === 'NUE'  ){
          factura.condicion = 'nuevas'
        }else{
          factura.condicion ='seminuevos'
        }
        return{...factura,utilidadCalculada: utilidadCalculada, gastoFinanciero: gastoFinanciero, porcentaje: porcentaje, usuario: usuarioAutenticado.value.usuario, fecha_creacion: fecha}
      })

      valoresUnicosSucursal.value = facturas.value.map(factura => factura.id_plaza)
                                               .filter((valor, index, self) => self.indexOf(valor) === index)

      }else{
        cargando.value = false
        facturas.value = null
      }
    } catch (error) {
      console.log(error)
    } finally {
      cargando.value = false
    }
  }

  const guardarFacturas = async (objFacturas) => {
    try {
      cargando.value = true
      const facturasObj = objFacturas.map(factura => {
        return {
          ...factura,
          claveSucursal: sucursalSeleccionada.value.value.abreviacion
        }
      })
      const { data } = await api.post('/facturas/unidades/autos', facturasObj)
      notificacion('positive', 'Facturas Guardadas', data)
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargando.value = false
    }
  }

  const obtenerClientes = async () => {
    try {
      const { data } = await api.get('/clientes/unidades/autos')
      clientes.value = [...data]

      //Opciones departamentos
      opcionesClientes.value = clientes.value.map(cliente => {
        return {
          label: `${cliente.cliente}`,
          value: cliente
        }
      })

    } catch (error) {
      console.log(error)
    }
  }

  const obtenerVendedores = async () => {
    try {
      const { data } = await api.get('/vendedores/unidades/autos')
      vendedores.value = [...data]

      //Opciones departamentos
      opcionesVendedores.value = vendedores.value.map(vendedor => {
        return {
          label: `${vendedor.nombre}`,
          value: vendedor
        }
      })

    } catch (error) {
      console.log(error)
    }
  }

  return {
        anioSeleccionado,
        mesSeleccionado,
        quincenaSeleccionada,
        departamentoSeleccionado,
        cargando,
        facturas,
        facturaSeleccionada,
        facturasFiltrada,
        detalleFactura,
        valoresUnicosSucursal,
        clientes,
        opcionesClientes,
        vendedores,
        opcionesVendedores,
        obtenerFacturas,
        guardarFacturas,
        obtenerClientes,
        obtenerVendedores
    }
})
