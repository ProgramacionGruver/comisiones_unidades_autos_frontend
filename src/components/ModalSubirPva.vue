<template>
  <q-dialog v-model="modalPva">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Subir PVAS</h2>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form ref="formulario">
          <div>
            <label>Selecciona la sucursal.</label>
          </div>
          <div class="row justify-around" style="width: 100%">
            <q-select
              outlined
              dense
              :options="opcionesSucursales"
              v-model="sucursalSeleccionada"
              style="width: 100%"
            />
          </div>
          <div class="q-mt-md">
            <label>Selecciona el cliente</label>
          </div>
          <div class="row justify-around">
            <q-select
              outlined
              dense
              clearable
              use-input
              input-debounce="0"
              label="Cliente"
              v-model="clienteSeleccionado"
              @filter="parametrosFiltradosClientes"
              :options="opcionesCliente"
              :rules="[(val) => !!val || 'Se requiere llenar este campo']"
              style="width: 100%"
            />
          </div>
          <div>
            <label>Ingrese el número de contrato</label>
          </div>
          <div class="row justify-around">
            <q-input
              outlined
              dense
              label="Número de contrato"
              v-model="objPva.no_contrato"
              :rules="[(val) => !!val || 'Se requiere llenar este campo']"
              style="width: 100%"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>
          <div>
            <label>Ingrese el plan integral</label>
          </div>
          <div class="row justify-around">
            <q-input
              outlined
              dense
              label="Plan Integral"
              v-model="objPva.plan_integral"
              :rules="[(val) => !!val || 'Se requiere llenar este campo']"
              style="width: 100%"
            />
          </div>
          <div
            style="
              width: 100%;
              display: grid;
              grid-template-columns: 1fr 1fr;
              column-gap: 1rem;
              margin-bottom: 0.5rem;
            "
          >
            <div>
              <div>
                <label>Fecha de compra</label>
              </div>
              <div class="row justify-around">
                <q-input
                  outlined
                  dense
                  label="Fecha de compra"
                  v-model="objPva.fecha_compra"
                  type="date"
                  :rules="[(val) => !!val || 'Se requiere llenar este campo']"
                  style="width: 100%"
                >
                  <template v-slot:prepend>
                    <q-icon name="date_range" />
                  </template>
                </q-input>
              </div>
            </div>
            <div>
              <!-- <div>
                <label>Monto financiado</label>
              </div>
              <div class="row justify-around">
                <q-input
                  outlined
                  dense
                  label="Monto financiado"
                  v-model="objPva.monto_financiado"
                  type="number"
                  :rules="[(val) => !!val || 'Se requiere llenar este campo']"
                  style="width: 100%"
                >
                  <template v-slot:prepend>
                    <q-icon name="paid" />
                  </template>
                </q-input>
              </div> -->
            </div>
            <div>
              <div>
                <label>Garantía</label>
              </div>
              <q-checkbox
                v-model="objPva.garantia"
                :label="objPva.garantia ? 'SI' : 'NO'"
                color="primary"
              />
            </div>
            <div></div>
          </div>
          <div>
            <label>On Star / GAP</label>
          </div>
          <div class="row justify-around">
            <q-checkbox
              v-model="gapsSeleccionados"
              val="ON STAR"
              label="ON STAR"
              color="primary"
            />
            <q-checkbox
              v-model="gapsSeleccionados"
              val="GAP"
              label="GAP"
              color="primary"
            />
            <q-checkbox
              v-model="gapsSeleccionados"
              val="MANTENIMIENTOS"
              label="MANTENIMIENTOS"
              color="primary"
            />
            <q-checkbox
              v-model="gapsSeleccionados"
              val="ACCESORIOS"
              label="ACCESORIOS"
              color="primary"
            />
          </div>
          <div>
            <label>Selecciona la aseguradora</label>
          </div>
          <div class="row justify-around">
            <q-select
              outlined
              dense
              clearable
              use-input
              input-debounce="0"
              label="Aseguradora"
              v-model="objPva.aseguradora"
              :options="opcionesAseguradoras"
              :rules="[(val) => !!val || 'Se requiere llenar este campo']"
              style="width: 100%"
            />
          </div>
          <div>
            <label> Selecciona el vendedor y el departamento </label>
          </div>
          <div class="row justify-around q-gutter-sm">
            <div class="col">
              <q-select
                outlined
                dense
                clearable
                use-input
                input-debounce="0"
                label="Vendedor"
                v-model="vendedorSeleccionado"
                @filter="parametrosFiltradosVendedores"
                :options="opcionesEmpleados"
                :rules="[(val) => !!val || 'Se requiere llenar este campo']"
                style="width: 100%"
              />
            </div>
            <div class="col">
              <q-select
                outlined
                dense
                :options="departamentos"
                v-model="departamentoSeleccionado"
                map-options
                option-value="name"
              />
            </div>
          </div>
          <div>
            <label>Selecciona el tipo de pva y la utilidad. </label>
          </div>
          <div class="row justify-between">
            <q-select
              style="min-width: 48%"
              label="Tipo PVA"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              outlined
              dense
              :options="tipoPva"
              v-model="objPva.pva"
              :rules="[(val) => !!val || 'Se requiere llenar este campo']"
            />
            <q-input
              style="min-width: 48%"
              dense
              filled
              label="Monto"
              type="number"
              color="primary"
              v-model="objPva.utilidad_completa"
              :rules="validarDigitos"
            >
              <template v-slot:prepend>
                <q-icon name="paid" />
              </template>
            </q-input>
          </div>
          <q-card-actions class="q-pt-md" align="right">
            <q-btn
              icon-right="save"
              label="Guardar"
              color="primary"
              :loading="cargando"
              @click="guardarPvas()"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { listaQuincenas } from "src/helpers/listas";
import {
  meses,
  anios,
  mes,
  tipoPva,
  obtenerNumeroQuincena,
  obtenerNumerosDeMes,
} from "src/constant/constantes";
import { useSucursalesStore } from "src/stores/catalogos/sucursales";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { usePvaStore } from "src/stores/catalogos/pvas";
import { validarDigitos } from "src/helpers/inputReglas";
import { useAseguradorasStore } from "src/stores/catalogos/aseguradoras";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";

export default {
  setup() {
    const useAutenticacion = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticacion);

    const useFacturas = useFacturasStore();
    const {
      mesSeleccionado,
      anioSeleccionado,
      quincenaSeleccionada,
      opcionesClientes,
      opcionesVendedores,
    } = storeToRefs(useFacturas);

    const useSucursales = useSucursalesStore();
    const { sucursales, sucursalSeleccionada } = storeToRefs(useSucursales);

    const useAseguradoras = useAseguradorasStore();
    const { aseguradoras } = storeToRefs(useAseguradoras);

    const usePva = usePvaStore();
    const { guardarPva } = usePva;

    const useDepartamentos = useDepartamentosStore();
    const { departamentoSeleccionado, departamentos } =
      storeToRefs(useDepartamentos);

    const modalPva = ref(false);
    const formulario = ref(null);
    const opcionesSucursales = ref([]);

    const opcionesEmpleados = ref(opcionesVendedores.value);
    const opcionesCliente = ref(opcionesClientes.value);
    const opcionesAseguradoras = ref(
      aseguradoras.value.map((aseguradora) => {
        return aseguradora.nombre_corto;
      })
    );

    const vendedorSeleccionado = ref(null);
    const clienteSeleccionado = ref(null);

    const objPvaInit = {
      numeroEmpleado: "",
      nombreEmpleado: "",
      utilidad: "",
      pva: "",
      cliente: "",
      fi: "",
      usuario: "",
      quincena: "",
      mes: "",
      anio: "",
      no_contrato: "",
      plan_integral: "",
      fecha_compra: "",
      garantia: false,
      on_star_gap: "",
      aseguradora: "",
      utilidad_completa: "",
      claveDepartamento: "",
    };

    const objPva = ref({ ...objPvaInit });

    const gapsSeleccionados = ref([]);

    const cargando = ref(false);

    const abrir = async () => {
      opcionesSucursales.value = sucursales.value
        .map((sucursal) => {
          return {
            label: `${sucursal.nombreSucursal}`,
            value: { ...sucursal },
          };
        })
        .filter((sucursal) => sucursal.value.claveEmpresa === "CH");

      sucursalSeleccionada.value = opcionesSucursales.value[0];
      departamentoSeleccionado.value = departamentos.value[0];
      objPva.value = { ...objPvaInit };
      vendedorSeleccionado.value = null;
      clienteSeleccionado.value = null;
      modalPva.value = true;
    };

    const parametrosFiltradosVendedores = (val, update) => {
      filtradoBusquedaObj(
        val,
        update,
        opcionesVendedores.value,
        opcionesEmpleados
      );
    };

    const parametrosFiltradosClientes = (val, update) => {
      filtradoBusquedaObj(val, update, opcionesClientes.value, opcionesCliente);
    };

    const guardarPvas = async () => {
      if (!(await formulario.value.validate())) {
        return;
      }
      cargando.value = true;

      if (gapsSeleccionados.value.length === 4) {
        objPva.value.on_star_gap = "TODOS";
      } else {
        objPva.value.on_star_gap = gapsSeleccionados.value.join("/ ");
      }

      objPva.value.nombreEmpleado =
        vendedorSeleccionado.value.value.nombreEmpleado;
      objPva.value.numeroEmpleado =
        vendedorSeleccionado.value.value.numeroEmpleado;
      objPva.value.cliente = clienteSeleccionado.value.value.cliente;
      objPva.value.fi = sucursalSeleccionada.value.value.abreviacion;
      objPva.value.usuario = usuarioAutenticado.value.usuario;
      objPva.value.quincena = obtenerNumeroQuincena(quincenaSeleccionada.value);
      objPva.value.mes = obtenerNumerosDeMes(mesSeleccionado.value);
      objPva.value.anio = anioSeleccionado.value;
      objPva.value.garantia = objPva.value.garantia ? "SI" : "NO";
      objPva.value.claveDepartamento =
        departamentoSeleccionado.value.value.claveDepartamento;

      if (objPva.value.pva === "pi") {
        objPva.value.utilidad = Number(
          (objPva.value.utilidad_completa * 0.025) / 2
        ).toFixed(2);
      } else {
        objPva.value.utilidad = objPva.value.utilidad_completa;
      }

      console.log(objPva.value);

      // await guardarPva(objPva.value);

      cargando.value = false;
      modalPva.value = false;
    };

    return {
      abrir,
      modalPva,
      mesSeleccionado,
      anioSeleccionado,
      anios,
      meses,
      mes,
      sucursalSeleccionada,
      listaQuincenas,
      quincenaSeleccionada,
      opcionesSucursales,
      opcionesClientes,
      opcionesCliente,
      opcionesVendedores,
      opcionesEmpleados,
      vendedorSeleccionado,
      clienteSeleccionado,
      objPvaInit,
      objPva,
      tipoPva,
      formulario,
      parametrosFiltradosVendedores,
      parametrosFiltradosClientes,
      guardarPvas,
      validarDigitos,
      cargando,
      opcionesAseguradoras,
      gapsSeleccionados,
      departamentos,
      departamentoSeleccionado,
    };
  },
};
</script>
