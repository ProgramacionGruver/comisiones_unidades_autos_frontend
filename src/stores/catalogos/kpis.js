import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { notificacion } from "src/helpers/mensajes";
import { api } from "src/boot/axios";
import { formatearFecha } from "src/helpers/formatearFecha";

export const useKpiStore = defineStore("kpi", () => {
  const kpis = ref([]);
  const objetivosKpis = ref([]);
  const valoresRealesKpis = ref([]);
  const obtjetivosFormulario = ref([]);
  const comisionVendedor = ref(null);
  const configuracionTablaComision = ref(null);
  const comisionBonoVendedor = ref(null);
  const bonoAprobado = ref(null);

  const informacionVendedor = ref(null);

  const obtenerObjetivosKpis = async (objKpi, nivel) => {
    try {
      const { data } = await api.post("/objetivos/kpis/autos", objKpi);

      if (nivel === "TODOS") {
        objetivosKpis.value = [...data];
      } else {
        objetivosKpis.value = data.filter(
          (objetivo) => objetivo.nivel === nivel.toLowerCase()
        );
      }
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  const guardarObjetivosKpis = async (objKpi) => {
    try {
      const { data } = await api.post("/objetivo/kpis/autos", objKpi);
      objetivosKpis.value = [...objetivosKpis.value, data];
      notificacion("positive", "Objetivo Agregado", data);
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  const actualizarObjetivosKpis = async (objKpi) => {
    try {
      const { data } = await api.put("/objetivo/kpis/autos", objKpi);
      const index = objetivosKpis.value.findIndex(
        (objetivo) => objetivo.idObjetivoKpi === objKpi.idObjetivoKpi
      );
      objetivosKpis.value[index] = data;
      notificacion("positive", "Objetivo Actualizado", data);
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  const obtenerValoresRealesKpis = async (objKpi) => {
    try {
      const { data } = await api.post("/objetivos/kpis/reales/autos", objKpi);
      valoresRealesKpis.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerObjetivosFormulario = async (objKpi) => {
    try {
      const { data } = await api.post("/objetivos/kpis/nivel/autos", objKpi);
      obtjetivosFormulario.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerComisionVendedor = async (objKpi) => {
    try {
      const { data } = await api.post("/comision/vendedor", objKpi);
      comisionVendedor.value = data;
      await configurarTablaComision();
    } catch (error) {
      notificacion("negative", error.response.data.message);
    }
  };

  const configurarTablaComision = async () => {
    try {
      let facturas = [];

      for (const factura of comisionVendedor.value.facturas) {
        if (comisionVendedor.value.infoVendedor.claveDepartamento === "NUE") {
          let baseComision =
            factura.utilidad -
            factura.descuentos.previa -
            factura.descuentos.traslado -
            factura.descuentos.descVentas -
            factura.descuentos.cortesia -
            factura.descuentos.gasolina +
            factura.descuentos.bonoub -
            factura.descuentos.garantia_extendida -
            factura.descuentos.acondicionamiento -
            factura.descuentos.gestorias -
            factura.descuentos.toma_unidad;

          facturas.push({
            folioFactura: factura.factura,
            fechaFactura: formatearFecha(factura.fecha_facturacion),
            tasaCredito: factura.tipo_venta,
            condicion: factura.condicion,
            modelo: factura.modelo,
            serie: factura.vin,
            utilidad: factura.utilidad,
            previa: factura.descuentos.previa,
            traslado: factura.descuentos.traslado,
            descuentoVentas: factura.descuentos.descVentas,
            cortesias: factura.descuentos.cortesia,
            gasolina: factura.descuentos.gasolina,
            bono: factura.descuentos.bonoub,
            garantia_extendida: factura.descuentos.garantia_extendida,
            acondicionamiento: factura.descuentos.acondicionamiento,
            gestorias: factura.descuentos.gestorias,
            toma_unidad: factura.descuentos.toma_unidad,
            baseComision: baseComision,
            tipoRenglon: "dato",
          });
        } else {
          let baseComision =
            factura.utilidad -
            factura.descuentos.previa -
            factura.descuentos.traslado -
            factura.descuentos.descVentas -
            factura.descuentos.cortesia -
            factura.descuentos.gasolina +
            factura.descuentos.bonoub -
            factura.descuentos.garantia_extendida -
            factura.descuentos.acondicionamiento -
            factura.descuentos.gestorias -
            factura.descuentos.toma_unidad;

          facturas.push({
            folioFactura: factura.factura,
            fechaFactura: formatearFecha(factura.fecha_facturacion),
            tasaCredito: factura.tipo_venta,
            condicion: factura.condicion,
            modelo: factura.modelo,
            serie: factura.vin,
            utilidad: factura.utilidad,
            previa: factura.descuentos.previa,
            traslado: factura.descuentos.traslado,
            descuentoVentas: factura.descuentos.descVentas,
            cortesias: factura.descuentos.cortesia,
            gasolina: factura.descuentos.gasolina,
            bono: factura.descuentos.bonoub,
            garantia_extendida: factura.descuentos.garantia_extendida,
            acondicionamiento: factura.descuentos.acondicionamiento,
            gestorias: factura.descuentos.gestorias,
            toma_unidad: factura.descuentos.toma_unidad,
            baseComision: baseComision,
            tipoRenglon: "dato",
          });
        }
      }

      facturas.push({
        folioFactura: "",
        fechaFactura: "",
        tasaCredito: "",
        condicion: "",
        modelo: "",
        serie: "Total",
        utilidad: comisionVendedor.value.facturas
          .reduce((acc, utilidad) => acc + utilidad.utilidad, 0)
          .toFixed(2),
        previa: comisionVendedor.value.facturas
          .reduce((acc, previa) => acc + previa.descuentos.previa, 0)
          .toFixed(2),
        traslado: comisionVendedor.value.facturas
          .reduce((acc, traslado) => acc + traslado.descuentos.traslado, 0)
          .toFixed(2),
        descuentoVentas: comisionVendedor.value.facturas
          .reduce(
            (acc, descVentas) => acc + descVentas.descuentos.descVentas,
            0
          )
          .toFixed(2),
        cortesias: comisionVendedor.value.facturas
          .reduce((acc, cortesia) => acc + cortesia.descuentos.cortesia, 0)
          .toFixed(2),
        gasolina: comisionVendedor.value.facturas
          .reduce((acc, gasolina) => acc + gasolina.descuentos.gasolina, 0)
          .toFixed(2),
        bono: comisionVendedor.value.facturas
          .reduce((acc, bono) => acc + bono.descuentos.bonoub, 0)
          .toFixed(2),
        garantia_extendida: comisionVendedor.value.facturas
          .reduce(
            (acc, garantia) => acc + garantia.descuentos.garantia_extendida,
            0
          )
          .toFixed(2),
        acondicionamiento: comisionVendedor.value.facturas
          .reduce(
            (acc, acondicionamiento) =>
              acc + acondicionamiento.descuentos.acondicionamiento,
            0
          )
          .toFixed(2),
        gestorias: comisionVendedor.value.facturas
          .reduce((acc, gestorias) => acc + gestorias.descuentos.gestorias, 0)
          .toFixed(2),
        toma_unidad: comisionVendedor.value.facturas
          .reduce(
            (acc, tomaUnidad) => acc + tomaUnidad.descuentos.toma_unidad,
            0
          )
          .toFixed(2),
        baseComision: facturas
          .filter((factura) => factura.tipoRenglon === "dato")
          .reduce((acc, baseComision) => acc + baseComision.baseComision, 0)
          .toFixed(2),
        tipoRenglon: "total",
      });

      let pvas = [];

      if (comisionVendedor.value.pvas.length > 0) {
        for (const pva of comisionVendedor.value.pvas) {
          pvas.push({
            nombreCliente: pva.cliente,
            utilidad: pva.utilidad,
            pva: pva.pva,
            fi: pva.fi,
            tipoRenglon: "dato",
          });
        }
      } else {
        pvas.push({
          nombreCliente: "Sin PVA",
          utilidad: 0,
          pva: "N/A",
          fi: "N/A",
          tipoRenglon: "dato",
        });
      }

      if (comisionVendedor.value.pvas.length > 0) {
        pvas.push({
          nombreCliente: "Totales",
          utilidad: comisionVendedor.value.pvas
            .reduce((acc, utilidad) => acc + utilidad.utilidad, 0)
            .toFixed(2),
          pva: "",
          fi: "",
          tipoRenglon: "total",
        });
      } else {
        pvas.push({
          nombreCliente: "Totales",
          utilidad: 0,
          pva: "",
          fi: "",
          tipoRenglon: "total",
        });
      }

      let totalUtilidadBruta = [];

      const totalBaseComision = Number(
        facturas[facturas.length - 1].baseComision
      );
      const totalPvas = Number(pvas[pvas.length - 1].utilidad);

      totalUtilidadBruta.push({
        totalBaseComision,
        totalPvas,
        totalUtilidadBruta: totalBaseComision + totalPvas,
      });

      let kpis = [];

      let totalFacturas = comisionVendedor.value.kpis.find((kpi) =>
        kpi.objetivosKpi.nombreKpi.includes("objetivo de ventas")
      ).valorReal;

      for (const kpi of comisionVendedor.value.kpis) {
        let porcentajeUB = kpi.objetivosKpi.porcentajeub;

        if (kpi.objetivosKpi.nombreKpi.includes("Penetracion")) {
          const numero = totalFacturas * 0.7;

          const objetivo = redondear(numero);
          kpi.objetivosKpi.objetivo = objetivo === 0 ? 1 : objetivo;
        }

        // if (kpi.objetivosKpi.nombreKpi.includes("entregas")) {
        //   if (
        //     comisionVendedor.value.infoVendedor.claveSucursal == "CHDM" ||
        //     comisionVendedor.value.infoVendedor.claveSucursal == "CHMO"
        //   ) {
        //     kpi.objetivosKpi.objetivo = kpi.objetivosKpi.objetivo;
        //   } else {
        //     const objetivo = totalFacturas - 1 <= 0 ? 1 : totalFacturas - 1;

        //     kpi.objetivosKpi.objetivo = objetivo;
        //   }
        // }

        let desempenio = Math.floor(
          (kpi.valorReal * 100) / kpi.objetivosKpi.objetivo
        );

        let pagoCompleto =
          (totalBaseComision + totalPvas) *
          (porcentajeUB / 100) *
          (kpi.objetivosKpi.peso / 100);
        let montoAPagar = 0;
        let porcentajeDeComision = 0;

        if (desempenio < 10) {
          porcentajeDeComision = 0;
        } else if (desempenio >= 10 && desempenio <= 49) {
          porcentajeDeComision = 40;
        } else if (desempenio >= 50 && desempenio <= 65) {
          porcentajeDeComision = 50;
        } else if (desempenio >= 66 && desempenio <= 79) {
          porcentajeDeComision = 65;
        } else if (desempenio >= 80 && desempenio <= 95) {
          porcentajeDeComision = 80;
        } else if (desempenio >= 96) {
          porcentajeDeComision = 100;
        }

        montoAPagar = pagoCompleto * (porcentajeDeComision / 100);

        kpis.push({
          kpi: kpi.objetivosKpi.nombreKpi,
          porcentajeUB: porcentajeUB,
          objetivo: kpi.objetivosKpi.objetivo,
          objetivoCumplimiento: kpi.objetivosKpi.objetivoCumplimiento,
          objetivoValorReal: kpi.valorReal,
          desempenio: desempenio,
          peso: kpi.objetivosKpi.peso,
          utilidadBruta: totalBaseComision + totalPvas,
          pagoCompleto: pagoCompleto.toFixed(2),
          porcentajeDeComision: porcentajeDeComision,
          montoAPagar: montoAPagar.toFixed(2),
          tipoRenglon: "dato",
        });
      }

      kpis.push({
        kpi: "",
        porcentajeUB: "",
        objetivo: "",
        objetivoCumplimiento: "",
        objetivoValorReal: "",
        desempenio: "",
        peso: "",
        utilidadBruta: "",
        pagoCompleto: "Total a pagar de comisión",
        porcentajeDeComision: "",
        montoAPagar: kpis.reduce(
          (acc, kpi) => acc + Number(kpi.montoAPagar),
          0
        ),
        tipoRenglon: "total",
      });

      let descuentosVendedor = [];

      if (comisionVendedor.value.infoVendedor.claveDepartamento === "NUE") {
        if (
          comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles
            .length > 0
        ) {
          const bono =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 2
            )[0].valor;
          const descuento =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 1
            )[0].valor;
          const inCredit =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 4
            )[0].valor;
          const suAuto =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 3
            )[0].valor;
          const accesorios =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 5
            )[0].valor;
          const totalAPagar =
            Number(bono) -
            Number(descuento) +
            Number(inCredit) +
            Number(suAuto) +
            Number(accesorios);

          descuentosVendedor.push({
            bono,
            descuento,
            inCredit,
            suAuto,
            accesorios,
            totalAPagar,
          });
        } else {
          const totalAPagar = 0;

          descuentosVendedor.push({
            bono: 0,
            descuento: 0,
            inCredit: 0,
            suAuto: 0,
            accesorios: 0,
            totalAPagar,
          });
        }
      } else if (
        comisionVendedor.value.infoVendedor.claveDepartamento === "SEM"
      ) {
        if (
          comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles
            .length > 0
        ) {
          const bono =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 8
            )[0].valor;

          const descuento =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 7
            )[0].valor;

          const accesorios =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 9
            )[0].valor;

          const totalAPagar =
            Number(bono) - Number(descuento) + Number(accesorios);

          descuentosVendedor.push({
            bono,
            descuento,
            accesorios,
            totalAPagar,
          });
        } else {
          const totalAPagar = 0;

          descuentosVendedor.push({
            bono: 0,
            descuento: 0,
            accesorios: 0,
            nuevos: 0,
            totalAPagar,
          });
        }
      }

      comisionVendedor.value.facturas = facturas;
      comisionVendedor.value.pvas = pvas;
      comisionVendedor.value.totalUtilidadBruta = totalUtilidadBruta;
      comisionVendedor.value.kpis = kpis;
      comisionVendedor.value.descuentosVendedor = descuentosVendedor;
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const insertarValoresReales = async (objKpi) => {
    try {
      const { data } = await api.post(
        "/objetivos/kpis/valor/real/autos",
        objKpi
      );

      valoresRealesKpis.value = [...valoresRealesKpis.value, data];
      notificacion("positive", "Valores reales insertados");
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerComisionBonoVendedor = async (objBusqueda) => {
    try {
      const { data } = await api.post("/bono/vendedor", objBusqueda);
      comisionBonoVendedor.value = data;

      await configurarTablaComisionBono();
    } catch (error) {
      if (error.response.status === 404) {
        if (!objBusqueda.desdeCalculador) {
          notificacion("warning", "No se encontraron registros");
        }
        comisionBonoVendedor.value = null;
      } else {
        if (!objBusqueda.desdeCalculador) {
          notificacion("warning", error.response.data.message);
        }
        comisionBonoVendedor.value = null;
      }
    }
  };

  const configurarTablaComisionBono = async () => {
    try {
      let facturas = [];

      for (const factura of comisionBonoVendedor.value.facturas) {
        if (
          comisionBonoVendedor.value.infoVendedor.claveDepartamento === "SEM"
        ) {
          let baseComision =
            factura.utilidad -
            factura.descuentos.previa -
            factura.descuentos.traslado -
            factura.descuentos.descVentas -
            factura.descuentos.cortesia -
            factura.descuentos.gasolina;

          facturas.push({
            folioFactura: factura.factura,
            fechaFactura: formatearFecha(factura.fecha_facturacion),
            tasaCredito: factura.tipo_venta,
            modelo: factura.modelo,
            serie: factura.vin,
            utilidad: factura.utilidad,
            previa: factura.descuentos.previa,
            traslado: factura.descuentos.traslado,
            descuentoVentas: factura.descuentos.descVentas,
            cortesias: factura.descuentos.cortesia,
            gasolina: factura.descuentos.gasolina,
            bono: factura.descuentos.bonoub,
            baseComision: baseComision,
            tipoRenglon: "dato",
          });
        } else {
          let baseComision =
            factura.utilidad -
            factura.descuentos.garantia_extendida -
            factura.descuentos.acondicionamiento -
            factura.descuentos.gestorias -
            factura.descuentos.toma_unidad -
            factura.descuentos.cortesias +
            factura.descuentos.bonoub;

          facturas.push({
            folioFactura: factura.factura,
            fechaFactura: formatearFecha(factura.fecha_facturacion),
            tasaCredito: factura.tipo_venta,
            modelo: factura.modelo,
            serie: factura.vin,
            utilidad: factura.utilidad,
            garantia_extendida: factura.descuentos.garantia_extendida,
            toma_unidad: factura.descuentos.toma_unidad,
            acondicionamiento: factura.descuentos.acondicionamiento,
            gestorias: factura.descuentos.gestorias,
            cortesias: factura.descuentos.cortesias,
            bono: factura.descuentos.bonoub,
            baseComision: baseComision,
            tipoRenglon: "dato",
          });
        }
      }

      if (comisionBonoVendedor.value.infoVendedor.claveDepartamento === "SEM") {
        facturas.push({
          folioFactura: "",
          fechaFactura: "",
          tasaCredito: "",
          modelo: "",
          serie: "Total",
          utilidad: comisionBonoVendedor.value.facturas
            .reduce((acc, utilidad) => acc + utilidad.utilidad, 0)
            .toFixed(2),
          previa: comisionBonoVendedor.value.facturas
            .reduce((acc, previa) => acc + previa.descuentos.previa, 0)
            .toFixed(2),
          traslado: comisionBonoVendedor.value.facturas
            .reduce((acc, traslado) => acc + traslado.descuentos.traslado, 0)
            .toFixed(2),
          descuentoVentas: comisionBonoVendedor.value.facturas
            .reduce(
              (acc, descVentas) => acc + descVentas.descuentos.descVentas,
              0
            )
            .toFixed(2),
          cortesias: comisionBonoVendedor.value.facturas
            .reduce((acc, cortesia) => acc + cortesia.descuentos.cortesia, 0)
            .toFixed(2),
          gasolina: comisionBonoVendedor.value.facturas
            .reduce((acc, gasolina) => acc + gasolina.descuentos.gasolina, 0)
            .toFixed(2),
          bono: comisionBonoVendedor.value.facturas
            .reduce((acc, bono) => acc + bono.descuentos.bonoub, 0)
            .toFixed(2),
          baseComision: facturas
            .filter((factura) => factura.tipoRenglon === "dato")
            .reduce((acc, baseComision) => acc + baseComision.baseComision, 0)
            .toFixed(2),
          tipoRenglon: "total",
        });
      } else {
        facturas.push({
          folioFactura: "",
          fechaFactura: "",
          tasaCredito: "",
          modelo: "",
          serie: "Total",
          utilidad: comisionBonoVendedor.value.facturas
            .reduce((acc, utilidad) => acc + utilidad.utilidad, 0)
            .toFixed(2),
          garantia_extendida: comisionBonoVendedor.value.facturas
            .reduce(
              (acc, garantia) => acc + garantia.descuentos.garantia_extendida,
              0
            )
            .toFixed(2),
          acondicionamiento: comisionBonoVendedor.value.facturas
            .reduce(
              (acc, acondicionamiento) =>
                acc + acondicionamiento.descuentos.acondicionamiento,
              0
            )
            .toFixed(2),
          gestorias: comisionBonoVendedor.value.facturas
            .reduce((acc, gestorias) => acc + gestorias.descuentos.gestorias, 0)
            .toFixed(2),
          toma_unidad: comisionBonoVendedor.value.facturas
            .reduce(
              (acc, tomaUnidad) => acc + tomaUnidad.descuentos.toma_unidad,
              0
            )
            .toFixed(2),
          cortesias: comisionBonoVendedor.value.facturas
            .reduce((acc, cortesias) => acc + cortesias.descuentos.cortesias, 0)
            .toFixed(2),
          bono: comisionBonoVendedor.value.facturas
            .reduce((acc, bono) => acc + bono.descuentos.bonoub, 0)
            .toFixed(2),
          baseComision: facturas
            .filter((factura) => factura.tipoRenglon === "dato")
            .reduce((acc, baseComision) => acc + baseComision.baseComision, 0)
            .toFixed(2),
          tipoRenglon: "total",
        });
      }

      let pvas = [];

      if (comisionBonoVendedor.value.pvas.length > 0) {
        for (const pva of comisionBonoVendedor.value.pvas) {
          pvas.push({
            nombreCliente: pva.cliente,
            utilidad: pva.utilidad,
            pva: pva.pva,
            fi: pva.fi,
            tipoRenglon: "dato",
          });
        }
      } else {
        pvas.push({
          nombreCliente: "Sin PVA",
          utilidad: 0,
          pva: "N/A",
          fi: "N/A",
          tipoRenglon: "dato",
        });
      }

      if (comisionBonoVendedor.value.pvas.length > 0) {
        pvas.push({
          nombreCliente: "Totales",
          utilidad: comisionBonoVendedor.value.pvas
            .reduce((acc, utilidad) => acc + utilidad.utilidad, 0)
            .toFixed(2),
          pva: "",
          fi: "",
          tipoRenglon: "total",
        });
      } else {
        pvas.push({
          nombreCliente: "Totales",
          utilidad: 0,
          pva: "",
          fi: "",
          tipoRenglon: "total",
        });
      }

      let totalUtilidadBruta = [];

      const totalBaseComision = Number(
        facturas[facturas.length - 1].baseComision
      );

      const totalPvas = Number(pvas[pvas.length - 1].utilidad);
      const totalBonos = Number(facturas[facturas.length - 1].bono);

      let descuentosVendedor = [];
      if (comisionBonoVendedor.value.infoVendedor.claveDepartamento === "SEM") {
        if (
          comisionBonoVendedor.value.descuentosVendedor
            .descuentosVendedoresDetalles.length > 0
        ) {
          const bono =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 2
            )[0].valor;
          const descuento =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 1
            )[0].valor;
          const inCredit =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 4
            )[0].valor;
          const suAuto =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 3
            )[0].valor;
          const accesorios =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 5
            )[0].valor;
          const seminuevos =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 6
            )[0].valor;

          descuentosVendedor.push({
            bono,
            descuento,
            inCredit,
            suAuto,
            accesorios,
            seminuevos,
          });
        } else {
          descuentosVendedor.push({
            bono: 0,
            descuento: 0,
            inCredit: 0,
            suAuto: 0,
            accesorios: 0,
            seminuevos: 0,
          });
        }
      } else if (
        comisionBonoVendedor.value.infoVendedor.claveDepartamento === "NUE"
      ) {
        if (
          comisionBonoVendedor.value.descuentosVendedor
            .descuentosVendedoresDetalles.length > 0
        ) {
          const bono =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 8
            )[0].valor;

          const descuento =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 7
            )[0].valor;

          const accesorios =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 9
            )[0].valor;

          const nuevos =
            comisionBonoVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 10
            )[0].valor;

          descuentosVendedor.push({
            bono,
            descuento,
            accesorios,
            nuevos,
          });
        } else {
          descuentosVendedor.push({
            bono: 0,
            descuento: 0,
            accesorios: 0,
            nuevos: 0,
          });
        }
      }

      if (comisionBonoVendedor.value.infoVendedor.claveDepartamento === "NUE") {
        const bono = descuentosVendedor[0].bono
          ? descuentosVendedor[0].bono
          : 0;
        const descuento = descuentosVendedor[0].descuento
          ? descuentosVendedor[0].descuento
          : 0;
        const accesorios = descuentosVendedor[0].accesorios
          ? descuentosVendedor[0].accesorios
          : 0;

        const totalAPagar =
          (totalBaseComision +
            totalPvas -
            comisionBonoVendedor.value.planPiso.monto) *
            Number(comisionBonoVendedor.value.infoVendedor.porcentajeUB / 100) +
          totalBonos +
          bono -
          descuento +
          accesorios;

        totalUtilidadBruta.push({
          bono: bono,
          descuento: descuento,
          accesorios: accesorios,
          totalBaseComision,
          totalPvas,
          totalPlanPiso: comisionBonoVendedor.value.planPiso.monto,
          totalBonos,
          totalUtilidadBruta: totalAPagar,
        });
      } else {
        const bono = descuentosVendedor[0].bono
          ? descuentosVendedor[0].bono
          : 0;
        const descuento = descuentosVendedor[0].descuento
          ? descuentosVendedor[0].descuento
          : 0;
        const inCredit = descuentosVendedor[0].inCredit
          ? descuentosVendedor[0].inCredit
          : 0;
        const suAuto = descuentosVendedor[0].suAuto
          ? descuentosVendedor[0].suAuto
          : 0;
        const accesorios = descuentosVendedor[0].accesorios
          ? descuentosVendedor[0].accesorios
          : 0;

        const totalAPagar =
          totalBaseComision +
          totalPvas +
          bono -
          descuento +
          inCredit +
          suAuto +
          accesorios;

        totalUtilidadBruta.push({
          bono: bono,
          descuento: descuento,
          inCredit: inCredit,
          suAuto: suAuto,
          accesorios: accesorios,
          totalBaseComision,
          totalPvas,
          totalUtilidadBruta: totalAPagar,
        });
      }

      comisionBonoVendedor.value.facturas = facturas;
      comisionBonoVendedor.value.pvas = pvas;
      comisionBonoVendedor.value.totalUtilidadBruta = totalUtilidadBruta;

      console.log(comisionBonoVendedor.value);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const aprobarBono = async (objBono) => {
    try {
      await api.put("/bono/vendedor", objBono);
      notificacion("positive", "Bono Aprobado");
    } catch (error) {
      notificacion("warning", error.response.data.message);
    }
  };

  const obtenerBonoAprobado = async (objBusqueda) => {
    try {
      const { data } = await api.post("/bono/vendedor/aprobado", objBusqueda);
      bonoAprobado.value = data;
    } catch (error) {
      if (error.response.status === 404) {
        notificacion(
          "negative",
          "No se ha aprobado el bono del otro departamento"
        );
        bonoAprobado.value = null;
      } else {
        notificacion("negative", error.response.data.message);
        bonoAprobado.value = null;
      }
    }
  };

  const redondear = (numero) => {
    const integerPart = Math.floor(numero);
    const decimalPart = numero - integerPart;

    if (decimalPart >= 0.5) {
      return integerPart + 1;
    } else {
      return integerPart;
    }
  };

  const obtenerInfoVendedor = async (idAsesor) => {
    try {
      const { data } = await api.get(`/asesor/autos/${idAsesor}`);

      informacionVendedor.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    objetivosKpis,
    valoresRealesKpis,
    obtenerObjetivosKpis,
    guardarObjetivosKpis,
    actualizarObjetivosKpis,
    obtenerValoresRealesKpis,
    obtjetivosFormulario,
    obtenerObjetivosFormulario,
    comisionVendedor,
    obtenerComisionVendedor,
    configuracionTablaComision,
    insertarValoresReales,
    comisionBonoVendedor,
    obtenerComisionBonoVendedor,
    configurarTablaComisionBono,
    aprobarBono,
    bonoAprobado,
    obtenerBonoAprobado,
    informacionVendedor,
    obtenerInfoVendedor,
  };
});
