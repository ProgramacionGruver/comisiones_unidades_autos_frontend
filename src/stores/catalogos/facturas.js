import { defineStore, storeToRefs } from "pinia";
import { api } from "src/boot/axios";
import {
  anio,
  obtenerNumeroMes,
  obtenerNumerosDeMes,
  obtenerNumeroQuincena,
  fecha,
  mesCaido,
  quincenaCaida,
} from "src/constant/constantes";
import { ref } from "vue";
import { useEmpresasStore } from "src/stores/catalogos/empresas";
import { useSucursalesStore } from "./sucursales";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";
import { useGastoFinancieroStore } from "src/stores/catalogos/gastosFinancieros";
import { useComisionesStore } from "src/stores/catalogos/comisionesUnidades";
import { formatoFecha } from "src/helpers/formatearFecha";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { notificacion } from "src/helpers/mensajes";

export const useFacturasStore = defineStore("facturas", () => {
  const mesSeleccionado = ref(mesCaido());
  const anioSeleccionado = ref(anio);
  const quincenaSeleccionada = ref(quincenaCaida());

  const cargando = ref(true);
  const facturaSeleccionada = ref([]);
  const facturas = ref([]);
  const detalleFactura = ref([]);
  const facturasFiltradas = ref([]);
  const facturasFiltrada = ref([]);

  const filtro = ref([]);
  const registrosEnviados = ref([]);
  const valoresUnicosSucursal = ref([]);

  const clientes = ref([]);
  const opcionesClientes = ref([]);

  const vendedores = ref([]);
  const vendedoresAlt = ref([]);
  const opcionesVendedores = ref([]);
  const opcionesVendedoresInversa = ref([]);
  const opcionesVendedoresJefes = ref([]);

  const comisionVendedorSuAuto = ref({});

  const useEmpresas = useEmpresasStore();
  const { empresaSeleccionada } = storeToRefs(useEmpresas);

  const useSucursales = useSucursalesStore();
  const { sucursalSeleccionada } = storeToRefs(useSucursales);

  const useDepartamentos = useDepartamentosStore();
  const { departamentoSeleccionado } = storeToRefs(useDepartamentos);

  const useGastoFinanciero = useGastoFinancieroStore();
  const { obtenerGastoFinanciero } = useGastoFinanciero;
  const { gastoFinancieroSeleccionado } = storeToRefs(useGastoFinanciero);

  const useComisiones = useComisionesStore();
  const { obtenerComisionesUnidades } = useComisiones;
  const { comisionesUnidades } = storeToRefs(useComisiones);

  const useUsuario = useAutenticacionStore();
  const { usuarioAutenticado, perfilUsuario } = storeToRefs(useUsuario);

  const obtenerFacturas = async () => {
    try {
      cargando.value = true;
      facturaSeleccionada.value = [];

      //ARMO LOS OBJETOS DE BÚSQUEDA
      const ObjBusquedaGasto = {
        claveEmpresa: empresaSeleccionada.value.value.claveEmpresa,
        claveSucursal: sucursalSeleccionada.value.abreviacion,
        claveDepartamento:
          departamentoSeleccionado.value.value.claveDepartamento,
        fecha: formatoFecha(
          obtenerNumeroQuincena(quincenaSeleccionada.value),
          obtenerNumerosDeMes(mesSeleccionado.value),
          anioSeleccionado.value
        ),
      };

      const ObjBusquedaFacturas = {
        claveEmpresa: empresaSeleccionada.value.value.claveEmpresa,
        quincena: obtenerNumeroQuincena(quincenaSeleccionada.value),
        mes: obtenerNumeroMes(mesSeleccionado.value),
        anio: anioSeleccionado.value,
      };

      const ObjComisiones = {
        claveEmpresa: empresaSeleccionada.value.value.claveEmpresa,
        condicion: departamentoSeleccionado.value.value.nombreDepartamento,
        quincena: obtenerNumeroQuincena(quincenaSeleccionada.value),
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
        anio: anioSeleccionado.value,
      };

      //OBTENGO GASTO FINANCIERO
      // await obtenerGastoFinanciero(ObjBusquedaGasto);

      // if (gastoFinancieroSeleccionado.value) {
      //OBTENGO FACTURAS DEL ERP
      if (departamentoSeleccionado.value.value.claveDepartamento === "NUE") {
        const { data } = await api.post(
          "/facturas/unidades/autos/nuevos",
          ObjBusquedaFacturas
        );
        facturasFiltradas.value = [...data];
      } else {
        const { data } = await api.post(
          "/facturas/unidades/autos/seminuevos",
          ObjBusquedaFacturas
        );
        facturasFiltradas.value = [...data];
      }

      //OBTENGO FACTURAS DEL SISTEMA
      await obtenerComisionesUnidades(ObjComisiones);

      //FILTRAR ELEMENTOS QUE YA ESTEN REGISTRADOS
      filtro.value = facturasFiltradas.value;
      // filtro.value = facturasFiltradas.value.filter((factura) => {
      //   return !comisionesUnidades.value.some(
      //     (comision) => comision.factura === factura.factura
      //   );
      // });

      if (filtro.value.length === 0) {
        notificacion("warning", "No hay facturas para registrar");
        filtro.value = [];
        facturas.value = [];
        return;
      }

      // if (registrosEnviados.value.length > 0) {
      //   filtro.value = [
      //     ...comisionesUnidades.value.filter(
      //       (comision) =>
      //         !facturasFiltradas.value.some(
      //           (factura) => factura.factura === comision.factura
      //         )
      //     ),
      //     ...facturasFiltradas.value.filter(
      //       (factura) =>
      //         !comisionesUnidades.value.some(
      //           (comision) => comision.factura === factura.factura
      //         )
      //     ),
      //   ];
      // } else {
      //   filtro.value = [
      //     ...facturasFiltradas.value.filter(
      //       (factura) =>
      //         !comisionesUnidades.value.some(
      //           (comision) => comision.factura === factura.factura
      //         )
      //     ),
      //   ];
      // }

      //CALCULO UTILIDAD, GASTO FINANCIERO Y PORCENTAJE
      facturas.value = filtro.value.map((factura) => {
        // const costoFactura = parseFloat(factura.costo);
        // const tasaInteres = parseFloat(
        //   gastoFinancieroSeleccionado.value.tasaInteres
        // );
        // const facturaUtilidad = parseFloat(factura.utilidad);
        // const multiplicacion = parseFloat(costoFactura * tasaInteres);
        // const dividir = parseFloat(multiplicacion / 360);
        // const gastoFinanciero = parseFloat(dividir * 60);
        // const utilidadCalculada = parseFloat(facturaUtilidad - gastoFinanciero);
        // const porcentaje = parseFloat(utilidadCalculada / costoFactura);

        if (departamentoSeleccionado.value.value.claveDepartamento === "NUE") {
          factura.condicion = "nuevas";
        } else {
          factura.condicion = "seminuevos";
        }

        return {
          ...factura,
          // utilidadCalculada: utilidadCalculada,
          // gastoFinanciero: gastoFinanciero,
          // porcentaje: porcentaje,
          usuario: usuarioAutenticado.value.usuario,
          fecha_creacion: fecha,
        };
      });

      valoresUnicosSucursal.value = facturas.value
        .map((factura) => factura.id_plaza)
        .filter((valor, index, self) => self.indexOf(valor) === index);
      // } else {
      //   cargando.value = false;
      //   facturas.value = null;
      // }
    } catch (error) {
      console.log(error);
    } finally {
      cargando.value = false;
    }
  };

  const guardarFacturas = async (objFacturas) => {
    try {
      cargando.value = true;
      const facturasObj = objFacturas.map((factura) => {
        return {
          ...factura,
          claveSucursal: sucursalSeleccionada.value.abreviacion,
        };
      });
      const { data } = await api.post("/facturas/unidades/autos", facturasObj);
      notificacion("positive", "Facturas Guardadas");
    } catch (error) {
      console.log(error);
      notificacion("negative", error.response.data.message);
    } finally {
      cargando.value = false;
    }
  };

  const obtenerClientes = async () => {
    try {
      const { data } = await api.get("/clientes/unidades/autos");
      clientes.value = [...data];

      //Opciones departamentos
      opcionesClientes.value = clientes.value.map((cliente) => {
        return {
          label: `${cliente.cliente}`,
          value: cliente,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerVendedores = async () => {
    try {
      const { data } = await api.get("/vendedores/unidades/autos");
      vendedores.value = [...data];

      // if (
      //   perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
      //   "AUXILIAR NUEVAS"
      // ) {
      //   vendedores.value = vendedores.value.filter((vendedor) => {
      //     return vendedor.claveDepartamento === "NUE";
      //   });
      // } else if (
      //   perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
      //   "AUXILIAR SEMINUEVAS"
      // ) {
      //   vendedores.value = vendedores.value.filter((vendedor) => {
      //     return vendedor.claveDepartamento === "SEM";
      //   });
      // }

      //Opciones departamentos
      opcionesVendedores.value = vendedores.value.map((vendedor) => {
        return {
          label: `${vendedor.nombreEmpleado} - ${vendedor.claveDepartamento}`,
          value: vendedor,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerVendedoresInversa = async () => {
    try {
      const { data } = await api.get("/vendedores/unidades/autos");
      vendedores.value = [...data];

      if (
        perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
        "AUXILIAR NUEVAS"
      ) {
        vendedores.value = vendedores.value.filter((vendedor) => {
          return vendedor.claveDepartamento === "SEM";
        });
      } else if (
        perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
        "AUXILIAR SEMINUEVAS"
      ) {
        vendedores.value = vendedores.value.filter((vendedor) => {
          return vendedor.claveDepartamento === "NUE";
        });
      }

      //Opciones departamentos
      opcionesVendedoresInversa.value = vendedores.value.map((vendedor) => {
        return {
          label: `${vendedor.nombreEmpleado}`,
          value: vendedor,
        };
      });

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const actualizarNivelAsesor = async (objAsesor) => {
    try {
      const index = vendedores.value.findIndex(
        (vendedor) => vendedor.idAsesor === objAsesor.idAsesor
      );

      const { data } = await api.put("/asesores/nivel", objAsesor);

      vendedores.value[index] = data;

      notificacion("positive", "Nivel del asesor actualizado correctamente");
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  const altaVendedor = async (objVendedor) => {
    try {
      const { data } = await api.post("/asesores/alta", objVendedor);

      vendedores.value = [...vendedores.value, data];
      notificacion("positive", "Vendedor dado de alta correctamente");
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  const obtenerVendedoresYJefes = async () => {
    try {
      const { data } = await api.get("/vendedores/jefes/unidades");
      vendedoresAlt.value = [...data];

      opcionesVendedoresJefes.value = vendedoresAlt.value.map((vendedor) => {
        return {
          label: `${vendedor.nombre}`,
          value: vendedor,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerComisionesSuAuto = async (busquedaObj) => {
    try {
      const { data } = await api.post("/suauto/comision", busquedaObj);

      comisionVendedorSuAuto.value = data;
    } catch (error) {
      notificacion("warning", error.response.data.message);
    }
  };

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
    comisionVendedorSuAuto,
    obtenerFacturas,
    guardarFacturas,
    obtenerClientes,
    obtenerVendedores,
    actualizarNivelAsesor,
    altaVendedor,
    obtenerVendedoresInversa,
    opcionesVendedoresInversa,
    opcionesVendedoresJefes,
    obtenerVendedoresYJefes,
    vendedoresAlt,
    obtenerComisionesSuAuto,
  };
});
