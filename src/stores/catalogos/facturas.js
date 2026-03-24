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

  const facturasSeminuevosSistema = ref([]);

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

      const ObjBusquedaFacturas = {
        claveEmpresa: empresaSeleccionada.value.value.claveEmpresa,
        quincena: obtenerNumeroQuincena(quincenaSeleccionada.value),
        mes: obtenerNumeroMes(mesSeleccionado.value),
        anio: anioSeleccionado.value,
      };

      //OBTENGO FACTURAS DEL ERP
      if (departamentoSeleccionado.value.claveDepartamento === "NUE") {
        const { data } = await api.post(
          "/facturas/unidades/autos/nuevos",
          ObjBusquedaFacturas
        );
        facturas.value = [...data];
        facturasFiltrada.value = [...data];
      } else {
        const { data } = await api.post(
          "/facturas/unidades/autos/seminuevos",
          ObjBusquedaFacturas
        );
        facturas.value = [...data];
        facturasFiltradas.value = [...data];
      }
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
      const { data } = await api.get("/unidades/asesores");
      vendedores.value = [...data];

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

  const obtenerFacturasSeminuevosSistemas = async (busquedaObj) => {
    try {
      const { data } = await api.post("/facturas/unidades/bonoSeminuevos", busquedaObj);

      facturasSeminuevosSistema.value = data;
    } catch (error) {
      console.log(error);
    }
  }

  const agregarActualizarBonoFijo = async (objBonoFijo) => {
    try {
      const index = facturasSeminuevosSistema.value.findIndex(
        (factura) => factura.idFactura === objBonoFijo.idFactura
      );

      const { data } = await api.post("/facturas/unidades/bonoSeminuevos/agregarActualizar", objBonoFijo);

      facturasSeminuevosSistema.value[index] = data;
      notificacion("positive", "Bono fijo agregado correctamente");
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  }

  const obtenerBonoFijo = async (idFactura) => {
    try {
      const { data } = await api.post("/bonos/fijos/obtener", { idFactura });

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const revertirOperacionBonoFijo = async (objBonoFijo) => {
    try {
      const index = facturasSeminuevosSistema.value.findIndex(
        (factura) => factura.idFactura === objBonoFijo.idFactura
      );

      const { data } = await api.post("/facturas/unidades/bonoSeminuevos/revertir", objBonoFijo);

      facturasSeminuevosSistema.value[index] = data;
      notificacion("positive", "Bono fijo eliminado correctamente");
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  }

  return {
    // States
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
    facturasSeminuevosSistema,
    opcionesVendedoresInversa,
    opcionesVendedoresJefes,
    vendedoresAlt,
    // Methods
    obtenerFacturas,
    guardarFacturas,
    obtenerClientes,
    obtenerVendedores,
    actualizarNivelAsesor,
    altaVendedor,
    obtenerVendedoresInversa,
    obtenerVendedoresYJefes,
    obtenerComisionesSuAuto,
    obtenerFacturasSeminuevosSistemas,
    agregarActualizarBonoFijo,
    obtenerBonoFijo,
    revertirOperacionBonoFijo,
  };
});
