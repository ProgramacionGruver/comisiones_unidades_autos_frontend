import { defineStore, storeToRefs } from 'pinia'
import { api } from 'src/boot/axios'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { apiForm } from 'src/boot/axiosForm'
import { ref } from 'vue'
import { useEmpresasStore } from './catalogos/empresas'
import { useSucursalesStore } from './catalogos/sucursales'
import { useAutenticacionStore } from './autenticaciones'
import { ID_COMISIONESMECANICOS } from 'src/constant/servidor'
import { obtenerNumerosDeMes, obtenerNumeroQuincena, fecha, objBusquedaAutorizaciones } from 'src/constant/constantes'
import { mensajeCorreoComisionesMecanicos } from 'src/constant/mensajeCorreo'
import { notificacion } from 'src/helpers/mensajes'
import { formatearNombrePuesto } from 'src/helpers/formatos'
import { ca } from 'date-fns/locale'

const useEmpresa = useEmpresasStore()
const { empresaSeleccionada } = storeToRefs(useEmpresa)

const useSucursales = useSucursalesStore()
const { sucursalSeleccionada } = storeToRefs(useSucursales)

const useAutenticacion = useAutenticacionStore()
const { usuarioAutenticado } = storeToRefs(useAutenticacion)

 const cargando = ref(true)
 const comisionesFolios = ref([])
 const comisiones = ref([])
 const comisionesExcel = ref([])
 const comisionSeleccionada = ref([])
 const comisionesFiltradas = ref([])
 const valoresUnicosSucursal = ref([])

export const useComisionesStore = defineStore('comisiones', () => {

  const guardarComisionesMecanicos = async(objComisiones, quincenaSeleccionada, mesSeleccionado, anioSeleccionado) => {
    try{

      //Armar folio
      const folio = `${sucursalSeleccionada.value.abreviacion}-MECANICOS-${obtenerNumeroQuincena(quincenaSeleccionada.value)}${obtenerNumerosDeMes(mesSeleccionado.value)}${anioSeleccionado.value}`

      //Revisar si ya se creo este folio
      const { data: respuesta } = await api.get(`/comisionesMecanicos/${folio}`)

      //Obtener usuarios que autorizan
      const usuariosAutorizacion = await apiUsuarios.post('/usuariosComisiones', { claveEmpresa: empresaSeleccionada.value.claveEmpresa, claveSucursal: sucursalSeleccionada.value.abreviacion, clavePuestos: objBusquedaAutorizaciones})

       // Creamos un objeto vacío para almacenar los usuarios que coincidan con los puestos
       const usuariosAutorizan = {}

       // Recorremos el arreglo de usuariosAutorizacion.data
       usuariosAutorizacion.data.forEach(elemento => {
           if (objBusquedaAutorizaciones.includes(elemento.puesto.clavePuesto)) {
                 usuariosAutorizan[`obtener${formatearNombrePuesto(elemento.puesto.nombrePuesto)}`] = { ...elemento.usuario }
           }
       })

      //Crear evento
     const eventoCreado = await apiForm.post('/eventoFormComisionMecanicos', { formulario: ID_COMISIONESMECANICOS, folio: folio})

      //Crear objeto
      const objComision = objComisiones.map(comision => {
        return {
          folio,
          claveEmpresa: comision.claveEmpresa,
          claveSucursal: comision.claveSucursal,
          numeroEmpleado: comision.id_mec,
          nombreEmpleado: comision.mecanico,
          tipoMecanico: comision.tipoMecanico,
          costoMano: comision.costoHora,
          horasMensuales: comision.horasMes ? comision.horasMes : 0,
          horasPrimeraQuincena: comision.ttrPrimeraQuincena,
          horasSegundaQuincena: comision.ttrSegundaQuincena,
          montoDestajo: comision.totalDestajo,
          montoRescates: comision.totalRescates,
          montoGratificaciones: comision.totalGratificaciones,
          montoTotal: comision.totalNomina,
          idEvento: eventoCreado.data.idEvento,
          usuario: usuarioAutenticado.value.usuario,
        }
      })

    //Crear comision
     const { data } = await api.post('/comisionMecanicos',{comisiones: objComision , folio: folio, usuariosAutorizan})

     let correoNotifica = [/*`${usuariosAutorizan.obtenerGerenteServicio.correo}`*/ 'amagdaleno@gruver.mx']

      //Datos del correo
      const objCorreo = {
          folio: folio,
          createdAt: fecha,
          claveSucursal: sucursalSeleccionada.value.abreviacion,
          quincena: quincenaSeleccionada.value,
          mes: mesSeleccionado.value,
          año: anioSeleccionado.value
      }

      //URL del correo
      const eventoEnlace = await apiForm.post('/obtenerURLComisionMecanicos', { idEvento: eventoCreado.data.idEvento,folio: folio})

      //Envio de correo
      await apiForm.post('/eventoCorreo', { correo: correoNotifica, titulo: `RV: Comisiones de Mecánicos--${folio}`, mensaje: mensajeCorreoComisionesMecanicos(objCorreo, eventoEnlace.data) })

      notificacion('positive', 'Envio realizado correctamente')

    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerComisionesMecanicosFolios = async(quincenaSeleccionada, mesSeleccionado, anioSeleccionado, empresa) => {
    try{
      cargando.value = true
      const objBusqueda = {mes: obtenerNumerosDeMes(mesSeleccionado), anio: `${anioSeleccionado}`, claveEmpresa: empresa.claveEmpresa}
      const { data } = await api.post('/comisionesMecanicosFolios', objBusqueda)
      comisionesFolios.value = [...data]
    } catch (error) {
    }finally{
      cargando.value = false
    }
  }

  const obtenerComisionesMecanicos = async(quincenaSeleccionada, mesSeleccionado, anioSeleccionado, empresa) => {
    try{
      cargando.value = true
      const objBusqueda = {mes: obtenerNumerosDeMes(mesSeleccionado), anio: `${anioSeleccionado}`, claveEmpresa: empresa.claveEmpresa}
      const { data } = await api.post('/comisionesMecanicosUsuarios', objBusqueda)
      const { data: excel } = await api.post('/comisionesMecanicosExcel', objBusqueda)
      comisiones.value = [...data]
      comisionesExcel.value = [...excel]
    } catch (error) {
    }finally{
      cargando.value = false
    }
  }

  return {
      cargando,
      comisiones,
      comisionesExcel,
      comisionesFolios,
      comisionSeleccionada,
      comisionesFiltradas,
      valoresUnicosSucursal,
      guardarComisionesMecanicos,
      obtenerComisionesMecanicosFolios,
      obtenerComisionesMecanicos
    }
})
