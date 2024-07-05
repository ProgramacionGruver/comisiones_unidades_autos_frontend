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
            factura.descuentos.gasolina -
            factura.descuentos.bonoub;

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
            factura.descuentos.cortesias;

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

      if (comisionVendedor.value.infoVendedor.claveDepartamento === "NUE") {
        facturas.push({
          folioFactura: "",
          fechaFactura: "",
          tasaCredito: "",
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
          utilidad: comisionVendedor.value.facturas
            .reduce((acc, utilidad) => acc + utilidad.utilidad, 0)
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
          cortesias: comisionVendedor.value.facturas
            .reduce((acc, cortesias) => acc + cortesias.descuentos.cortesias, 0)
            .toFixed(2),
          bono: comisionVendedor.value.facturas
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

      if (comisionVendedor.value.infoVendedor.claveDepartamento === "SEM") {
        totalUtilidadBruta.push({
          totalBaseComision,
          totalPvas,
          totalPlanPiso: comisionVendedor.value.planPiso.monto,
          totalUtilidadBruta:
            totalBaseComision +
            totalPvas -
            comisionVendedor.value.planPiso.monto,
        });
      } else {
        totalUtilidadBruta.push({
          totalBaseComision,
          totalPvas,
          totalUtilidadBruta: totalBaseComision + totalPvas,
        });
      }

      let kpis = [];

      for (const kpi of comisionVendedor.value.kpis) {
        let porcentajeUB = kpi.objetivosKpi.porcentajeub;
        let totalFacturas = facturas.filter(
          (factura) => factura.utilidad > 0 && factura.serie !== "Total"
        ).length;

        if (kpi.objetivosKpi.nombreKpi.includes("Penetracion")) {
          const numero =
            totalFacturas * (kpi.objetivosKpi.objetivoCumplimiento / 100);

          kpi.objetivosKpi.objetivo = redondear(numero);
        }

        if (kpi.objetivosKpi.nombreKpi.includes("entregas")) {
          const numero = totalFacturas * 0.9;

          kpi.objetivosKpi.objetivo = Math.floor(numero);
        }

        let desempenio = Math.floor(
          (kpi.valorReal * kpi.objetivosKpi.objetivoCumplimiento) /
            kpi.objetivosKpi.objetivo
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
        });
      }

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
          const seminuevos =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 6
            )[0].valor;
          const totalAPagar =
            kpis.reduce((acc, kpi) => acc + Number(kpi.montoAPagar), 0) +
            Number(bono) -
            Number(descuento) -
            Number(inCredit) -
            Number(suAuto) -
            Number(accesorios) +
            Number(seminuevos);

          descuentosVendedor.push({
            bono,
            descuento,
            inCredit,
            suAuto,
            accesorios,
            seminuevos,
            totalAPagar,
          });
        } else {
          const totalAPagar = kpis.reduce(
            (acc, kpi) => acc + Number(kpi.montoAPagar),
            0
          );

          descuentosVendedor.push({
            bono: 0,
            descuento: 0,
            inCredit: 0,
            suAuto: 0,
            accesorios: 0,
            seminuevos: 0,
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

          const nuevos =
            comisionVendedor.value.descuentosVendedor.descuentosVendedoresDetalles.filter(
              (descuento) => descuento.idCatalogoFormularioDescuentos === 10
            )[0].valor;

          const totalAPagar =
            kpis.reduce((acc, kpi) => acc + Number(kpi.montoAPagar), 0) +
            Number(bono) -
            Number(descuento) -
            Number(accesorios) +
            Number(nuevos);

          descuentosVendedor.push({
            bono,
            descuento,
            accesorios,
            nuevos,
            totalAPagar,
          });
        } else {
          const totalAPagar = kpis.reduce(
            (acc, kpi) => acc + Number(kpi.montoAPagar),
            0
          );

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
      const { data } = await api.get("/bono/vendedor", objBusqueda);
      comisionBonoVendedor.value = data;

      await configurarTablaComisionBono();
    } catch (error) {
      if (error.response.status === 404) {
        notificacion("negative", "No se encontraron registros");
        comisionBonoVendedor.value = null;
      } else {
        notificacion("negative", error.response.data.message);
        comisionBonoVendedor.value = null;
      }
    }
  };

  const configurarTablaComisionBono = async () => {
    try {
      let facturas = [];

      for (const factura of comisionBonoVendedor.value.facturas) {
        if (
          comisionBonoVendedor.value.infoVendedor.claveDepartamento === "NUE"
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
            factura.descuentos.cortesias;

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

      if (comisionBonoVendedor.value.infoVendedor.claveDepartamento === "NUE") {
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

      if (comisionBonoVendedor.value.infoVendedor.claveDepartamento === "SEM") {
        totalUtilidadBruta.push({
          totalBaseComision,
          totalPvas,
          totalPlanPiso: comisionBonoVendedor.value.planPiso.monto,
          totalBonos,
          totalUtilidadBruta:
            (totalBaseComision +
              totalPvas -
              comisionBonoVendedor.value.planPiso.monto) *
              Number(
                comisionBonoVendedor.value.infoVendedor.porcentajeUB / 100
              ) +
            totalBonos,
        });
      } else {
        totalUtilidadBruta.push({
          totalBaseComision,
          totalPvas,
          totalUtilidadBruta: totalBaseComision + totalPvas,
        });
      }

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
      notificacion("negative", error.response.data.message);
    }
  };

  const obtenerBonoAprobado = async (objBusqueda) => {
    try {
      const { data } = await api.get("/bono/vendedor/aprobado", objBusqueda);
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
  };
});
