import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'


export const useGastoFinancieroStore = defineStore('gastofinaciero', () => {
  const cargando = ref(true)
  const gastosFinancieros = ref([])
  const gastosFinancierosComisiones = ref(null)
  const gastoFinancieroSeleccionado = ref()

  const obtenerGastosFinancieros = async () => {
    try {
        cargando.value = true
        const { data } = await api.get('/gastosFinancieros')
        gastosFinancieros.value = [...data]
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargando.value = false
    }
  }

  const obtenerGastoFinanciero = async (ObjGastoFinanciero) => {
    try {
        gastoFinancieroSeleccionado.value = null
        cargando.value = true
        const { data } = await api.post('/gastoFinanciero',ObjGastoFinanciero)
        gastoFinancieroSeleccionado.value = {...data}
    } catch (error) {
      notificacion("negative", error.response.data.message)
    } finally {
      cargando.value = false
    }
  }

  const obtenerGastoFinancieroComisiones = async (ObjGastoFinanciero) => {
    try {
      const { data } = await api.post('/gastoFinanciero', ObjGastoFinanciero)
      gastosFinancierosComisiones.value = { ...data }
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }


  const guardarGastosFinancieros = async (ObjGastoFinanciero) => {
    try {
        const { data } = await api.post('/gastosFinancieros', ObjGastoFinanciero)
        gastosFinancieros.value = [data, ...gastosFinancieros.value]
        notificacion('positive', 'Gasto Financiero Guardado')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }




  return {
        cargando,
        gastosFinancieros,
        gastoFinancieroSeleccionado,
        gastosFinancierosComisiones,
        obtenerGastosFinancieros,
        guardarGastosFinancieros,
        obtenerGastoFinanciero,
        obtenerGastoFinancieroComisiones
    }
})
