import { defineStore, storeToRefs } from 'pinia'
import { api } from 'src/boot/axios.js'
import { ref } from 'vue'
import { mes, anio } from 'src/constant/constantes'
import { useRescatesStore } from './rescates'
import { useGratificacionesStore } from './gratificaciones'
import { obtenerNumeroMes } from 'src/constant/constantes'

export const useReportesStore = defineStore('reportes', () => {
  const cargando = ref(true)
  const mecanicos = ref([])
  const mecanicosFiltrados = ref([])
  const opcionesMecanicos = ref([])

  const opcionesOrdenes = ref([])
  const cliente = ref([])

  const destajo = ref([])
  const manoObra = ref([])
  const destajoMano = ref([])

  const mesSeleccionado = ref(mes)
  const anioSeleccionado = ref(anio)
  const quincenaSeleccionada = ref('Primera Quincena')

  const nomina = ref([])
  const destajoQuincena = ref([])
  const destajoSegundaQuincena = ref([])


  const useRescates = useRescatesStore()
  const { obtenerRescatesSucursal } = useRescates
  const { rescates } = storeToRefs(useRescates)

  const useGratificaciones = useGratificacionesStore()
  const { obtenerGratificacionesSucursal } = useGratificaciones
  const { gratificaciones } = storeToRefs(useGratificaciones)

  const obtenerReportesMecanicos = async () => {
    try {
      const { data } = await api.get('/reportes/mecanicos')
      mecanicos.value = [...data]

      opcionesMecanicos.value = mecanicos.value.map(mecanico => {
        return {
          label: `${mecanico.nombreSucursal} - ${mecanico.nombre}`,
          data: mecanico
        }
      })

    } catch (error) {
      console.log(error)
    }
  }

  const obtenerIdOrdenes = async () => {
    try {
      const { data } = await api.get('/reportes/ordenesID')
      opcionesOrdenes.value = data.map(orden => {
        return {
          label: `${orden.no_orden}`,
          data: orden
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerCliente = async (orden) => {
    try {
      const { data } = await api.post('/reportes/cliente', orden)
      cliente.value = [...data]
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerDestajo = async (objBusqueda) => {
    try {
      cargando.value = true
      const { data: respuesta } = await api.post('/reportes/destajo', objBusqueda)
      const { data: valor } = await api.post('/manoObra', objBusqueda)
      destajoMano.value = [...respuesta]
      manoObra.value = [...valor]
      destajo.value = destajoMano.value.map((elemento) => {
        const horasTabuladas = parseFloat(elemento.ttr)
        const mano = manoObra.value.find((mano) => mano.tipoMecanico === elemento.tipo)
        const costoMano = mano ? parseFloat(mano.costo) : 0
        const multiplicacion = horasTabuladas * costoMano
        return { ...elemento, costo: costoMano, importeDestajo: multiplicacion }
      })

    } catch (error) {
      console.log(error)
    }finally{
      cargando.value = false
    }
  }

  const obtenerDestajoNomina = async (objBusqueda) => {
    try {
      const { data: respuesta } = await api.post('/reportes/destajo/mecanicos', objBusqueda)
      const { data: valor } = await api.post('/manoObra', objBusqueda)
      destajoMano.value = [...respuesta]
      manoObra.value = [...valor]
      destajo.value = destajoMano.value.map((elemento) => {
        const horasTabuladas = parseFloat(elemento.ttr)
        const mano = manoObra.value.find((mano) => mano.tipoMecanico === elemento.tipo)
        const costoMano = mano ? parseFloat(mano.costo) : 0
        const multiplicacion = horasTabuladas * costoMano
        return { ...elemento, costo: costoMano, importeDestajo: multiplicacion }
      })

    } catch (error) {
      console.log(error)
    }
  }

  const obtenerNomina = async (objBusqueda) => {
    try {
      cargando.value = true
      await obtenerDestajoNomina(objBusqueda)
      destajoQuincena.value = [...destajo.value]
      await obtenerRescatesSucursal(objBusqueda)
      await obtenerGratificacionesSucursal(objBusqueda)

      if(objBusqueda.quincena === 'Segunda Quincena'){
        objBusqueda.fechaInicio = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-01`,
        objBusqueda.fechaFin = `${anioSeleccionado.value}-${obtenerNumeroMes(mesSeleccionado.value)}-15`
        await obtenerDestajoNomina(objBusqueda)
        destajoSegundaQuincena.value = [...destajo.value]
      }

      destajoQuincena.value.forEach((destajo) => {
        const mecanico = {
          id_mec: destajo.id_mec,
          mecanico: destajo.mecanico,
          claveSucursal: destajo.claveSucursal,
          claveEmpresa: destajo.claveEmpresa,
          nombreSucursal: destajo.nombreSucursal,
          ttr: destajo.ttr,
          ttrPrimeraQuincena: destajo.ttr,
          ttrSegundaQuincena: destajo.ttr ,
          costoHora: destajo.costo,
          tipoMecanico: destajo.tipo,
          totalDestajo: destajo.importeDestajo,
          totalRescates: 0,
          totalGratificaciones: 0,
        }

        //SUMO LOS RESCATES
        rescates.value.forEach((rescate) => {
          if (mecanico.id_mec === rescate.idMecanico) {
            mecanico.totalRescates += rescate.costo
          }
        })


        //SUMO LAS GRATIFICACIONES
        gratificaciones.value.forEach((gratificacion) => {
          if (mecanico.id_mec === gratificacion.idMecanico) {
            //Si son dias, cada dia equivale a 8 horas
            if(gratificacion.tipoGratificacion === 'vacaciones' || gratificacion.tipoGratificacion === 'capacitacion'){
              const conversion = parseFloat(gratificacion.monto * 8)
              const montoConversion = parseFloat(conversion * mecanico.costoHora)
              mecanico.totalGratificaciones += montoConversion
            }else{
              mecanico.totalGratificaciones += gratificacion.monto
            }
          }
        })

        if(objBusqueda.quincena === 'Segunda Quincena'){
          //Obtengo la primera quincea
          destajoSegundaQuincena.value.forEach((elemento) => {
            if(mecanico.id_mec === elemento.id_mec){
              mecanico.ttrPrimeraQuincena = elemento.ttr
              mecanico.horasMes = destajo.ttr + elemento.ttr
            }
          })

          //Condicionantes de esquema
          if(mecanico.horasMes >= 180 && mecanico.horasMes <= 199){
            const sumaNomina = parseFloat(mecanico.totalDestajo)
            const porcentaje = parseFloat(sumaNomina * 0.10)
            const totalDestajo = parseFloat(sumaNomina+porcentaje)
            mecanico.totalNomina = parseFloat(totalDestajo + mecanico.totalRescates + mecanico.totalGratificaciones)
          }else if(mecanico.horasMes >= 200){
            const sumaNomina = parseFloat(mecanico.totalDestajo)
            const porcentaje = parseFloat(sumaNomina * 0.10)
            const primerTotalDestajo = parseFloat(sumaNomina+porcentaje)
            const segundoPorcentaje = parseFloat(primerTotalDestajo * 0.10)
            const segundoTotalDestajo = parseFloat(primerTotalDestajo+segundoPorcentaje)
            mecanico.totalNomina = parseFloat(segundoTotalDestajo + mecanico.totalRescates + mecanico.totalGratificaciones)
          }else{
            mecanico.totalNomina = mecanico.totalDestajo + mecanico.totalRescates + mecanico.totalGratificaciones
          }
        } else{
          mecanico.ttrSegundaQuincena = 0
          mecanico.horasMes = destajo.ttr
          mecanico.totalNomina = mecanico.totalDestajo + mecanico.totalRescates + mecanico.totalGratificaciones
        }

        nomina.value.push(mecanico)
      })

      let nuevoMecanico
      let mecanicoExistente

      //REVISAR SI EXISTE RESCATES AUNQUE NO HAYA DESTAJO
      rescates.value.forEach((rescate) => {
         mecanicoExistente = nomina.value.find((mecanico) => mecanico.id_mec === rescate.idMecanico)
        //CHECAR SI EN LOS RESCATES HAY UN MECANICO QUE NO ESTE EN DESTAJO
        if (!mecanicoExistente) {
          nuevoMecanico = {
            id_mec: rescate.idMecanico,
            mecanico: rescate.mecanico,
            claveEmpresa: rescate.claveEmpresa,
            claveSucursal: rescate.claveSucursal,
            nombreSucursal: rescate.sucursal,
            costoHora: 0,
            horasMes: 0,
            totalDestajo: 0,
            totalRescates: rescate.costo,
            totalGratificaciones: 0,
            ttr: 0.0,
            tipoMecanico: 'A',
            ttrPrimeraQuincena: 0.0,
            ttrSegundaQuincena: 0.0,
            totalNomina:  rescate.costo
          }
          nomina.value.push(nuevoMecanico)
        }else{
          mecanicoExistente.totalRescates += rescate.costo
          mecanicoExistente.totalNomina +=  rescate.costo
        }
      })

      //REVISAR SI EXISTE GRATIFICAIONES AUNQUE NO HAYA DESTAJO
      gratificaciones.value.forEach((gratificacion) => {
        mecanicoExistente = nomina.value.find((mecanico) => mecanico.id_mec === gratificacion.idMecanico)
        //CHECAR SI EN LAS GRATIFICACIONES HAY UN MECANICO QUE NO ESTE EN DESTAJO
        if (!mecanicoExistente) {
                  //SI ES VACACIONES CALCULO EL MONTO X 8 HRS
                  if(gratificacion.tipoGratificacion === 'vacaciones' || gratificacion.tipoGratificacion === 'capacitacion'){
                      const conversion = parseFloat(gratificacion.monto * 8)
                      const mano = manoObra.value.find((mano) => mano.tipoMecanico === "A")
                      const montoConversion = parseFloat(conversion * mano.costo)
                      nuevoMecanico = {
                        id_mec: gratificacion.idMecanico,
                        mecanico: gratificacion.mecanico,
                        claveEmpresa: gratificacion.claveEmpresa,
                        claveSucursal: gratificacion.claveSucursal,
                        nombreSucursal: gratificacion.sucursal,
                        costoHora: 0,
                        horasMes: 0,
                        totalDestajo: 0,
                        totalRescates: 0,
                        totalGratificaciones: montoConversion,
                        ttr: 0.0,
                        ttrPrimeraQuincena: 0.0,
                        ttrSegundaQuincena: 0.0,
                        tipoMecanico: 'A',
                        totalNomina: montoConversion
                      }
                      nomina.value.push(nuevoMecanico)
                  }else{
                    //SI NO ES VACACIONES, GUARDO EL MONTO
                      nuevoMecanico = {
                        id_mec: gratificacion.idMecanico,
                        mecanico: gratificacion.mecanico,
                        claveEmpresa: gratificacion.claveEmpresa,
                        claveSucursal: gratificacion.claveSucursal,
                        nombreSucursal: gratificacion.sucursal,
                        costoHora: 0,
                        horasMes: 0,
                        totalDestajo: 0,
                        totalRescates: 0,
                        totalGratificaciones: gratificacion.monto,
                        ttr: 0.0,
                        ttrPrimeraQuincena: 0.0,
                        ttrSegundaQuincena: 0.0,
                        tipoMecanico: 'A',
                        totalNomina: gratificacion.monto
                      }
                      nomina.value.push(nuevoMecanico)
                  }
              }else{
                  //SI ES VACACIONES CALCULO EL MONTO X 8 HRS
                if(gratificacion.tipoGratificacion === 'vacaciones' || gratificacion.tipoGratificacion === 'capacitacion'){
                      const conversion = parseFloat(gratificacion.monto * 8)
                      const mano = manoObra.value.find((mano) => mano.tipoMecanico === "A")
                      const montoConversion = parseFloat(conversion * mano.costo)
                      mecanicoExistente.totalGratificaciones += montoConversion
                      mecanicoExistente.totalNomina +=  montoConversion
                  }else{
                    //SI NO ES VACACIONES, GUARDO EL MONTO
                      mecanicoExistente.totalGratificaciones += gratificacion.monto
                      mecanicoExistente.totalNomina += gratificacion.monto
                  }
              }
      })

    } catch (error) {
      console.log(error)
    }finally{
      cargando.value = false
    }
  }


  return {
    mecanicos,
    mecanicosFiltrados,
    opcionesMecanicos,
    opcionesOrdenes,
    cargando,
    cliente,
    destajo,
    anioSeleccionado,
    mesSeleccionado,
    quincenaSeleccionada,
    nomina,
    obtenerReportesMecanicos,
    obtenerIdOrdenes,
    obtenerCliente,
    obtenerDestajo,
    obtenerNomina
  }
})
