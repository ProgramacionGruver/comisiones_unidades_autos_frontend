<template>
  <q-dialog
    v-model="abrirModal"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card style="max-width: 60vw !important; min-width: 30vw !important">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>{{ titulo }}</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-select
          class="q-pb-none"
          outlined
          clearable
          use-input
          input-debounce="0"
          label="Seleccione un asesor"
          v-model="vendedorSeleccionado"
          @filter="parametrosFiltradosVendedores"
          :options="opcionesEmpleados"
          lazy-rules
          :rules="[(val) => !!val || 'Se requiere llenar este campo']"
          @update:model-value="obtenerFormulario"
          :disable="buscando"
        />
      </q-card-section>
      <q-card-section>
        <div v-if="buscando" class="fit column justify-center items-center">
          <q-spinner-ios color="primary" size="7rem" class="q-mb-md" />
          <p>Buscando formulario...</p>
        </div>
        <div v-else-if="formularioFormateado.length > 0" class="fit">
          <template
            v-for="form in formularioFormateado"
            :key="form.idFormularioDescuentos"
          >
            <span>{{ form.nombreDescuento }}</span>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col">
                <q-input
                  v-model="form.monto"
                  outlined
                  label="Valor"
                  type="number"
                >
                  <template v-slot:append>
                    <q-icon name="attach_money" />
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input
                  v-model="form.descripcion"
                  outlined
                  label="Descripción"
                />
              </div>
            </div>
          </template>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          icon="close"
          flat
          color="negative"
          label="Cancelar"
          v-close-popup
        />
        <q-btn
          color="primary"
          label="Guardar"
          icon="save"
          :disable="
            cargando ||
            buscando ||
            !vendedorSeleccionado ||
            formularioFormateado.length === 0
          "
          @click="guardarDescuento"
          :loading="cargando"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { useDescuentosStore } from "src/stores/descuentos";
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj";
import { formatearFechaGuiones } from "src/helpers/formatearFecha";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { obtenerNumeroMes } from "src/constant/constantes";

export default {
  setup() {
    const useAutenticacion = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticacion);

    const abrirModal = ref(false);

    const useDescuentos = useDescuentosStore();
    const {
      guardarNuevoDescuentoVendedor,
      obtenerFormularioByDepartamento,
      obtenerFormularioDescuento,
    } = useDescuentos;
    const { formulario } = storeToRefs(useDescuentos);

    const useFacturas = useFacturasStore();
    const { opcionesVendedores, mesSeleccionado, anioSeleccionado } =
      storeToRefs(useFacturas);

    const useDepartamentos = useDepartamentosStore();
    const { departamentos, departamentoSeleccionado } =
      storeToRefs(useDepartamentos);

    const vendedorSeleccionado = ref(null);
    const opcionesEmpleados = ref(opcionesVendedores.value);

    const fechaDescuento = ref("");
    const cargando = ref(false);

    const modalDescuentosVendedor = ref(null);

    const esEdicion = ref(false);

    const formularioFormateado = ref([]);

    const buscando = ref(false);

    const titulo = ref("");

    const abrir = (descuento) => {
      if (descuento) {
        vendedorSeleccionado.value = {
          label: descuento.nombreEmpleado,
          value: {
            numeroEmpleado: descuento.numeroEmpleado,
            nombreEmpleado: descuento.nombreEmpleado,
            claveDepartamento: descuento.claveDepartamento,
          },
        };

        formularioFormateado.value = descuento.descuentos_vendedores.map(
          (desc) => ({
            idFormularioDescuentos: desc.idFormularioDescuentos,
            nombreDescuento: desc.catalogoFormularioDescuento.nombreDescuento,
            monto: desc.monto,
            descripcion: desc.descripcion,
          })
        );

        titulo.value = `Editar descuento de ${descuento.nombreEmpleado}`;
        esEdicion.value = true;
      } else {
        titulo.value = "Nuevo descuento";
        esEdicion.value = false;
      }

      abrirModal.value = true;
    };

    const parametrosFiltradosVendedores = (val, update) => {
      filtradoBusquedaObj(
        val,
        update,
        opcionesVendedores.value,
        opcionesEmpleados
      );
    };

    const guardarDescuento = async () => {
      cargando.value = true;

      const dataDescuento = {
        numeroEmpleado: vendedorSeleccionado.value.value.numeroEmpleado,
        mes: obtenerNumeroMes(mesSeleccionado.value),
        anio: anioSeleccionado.value,
        usuario: usuarioAutenticado.value.usuario,
        descuentos: formularioFormateado.value.map((form) => ({
          idFormularioDescuentos: form.idFormularioDescuentos,
          monto: form.monto,
          descripcion: form.descripcion,
        })),
      };

      await guardarNuevoDescuentoVendedor(dataDescuento);

      vendedorSeleccionado.value = null;
      formularioFormateado.value = [];
      cargando.value = false;
      abrirModal.value = false;
    };

    const obtenerFormulario = async () => {
      if (vendedorSeleccionado.value) {
        buscando.value = true;

        const claveDepartamento =
          vendedorSeleccionado.value.value.claveDepartamento;

        await obtenerFormularioByDepartamento(claveDepartamento);

        formularioFormateado.value = formulario.value;

        buscando.value = false;
      }
    };

    return {
      // States / Vars
      abrirModal,
      vendedorSeleccionado,
      opcionesEmpleados,
      opcionesVendedores,
      fechaDescuento,
      cargando,
      modalDescuentosVendedor,
      departamentos,
      departamentoSeleccionado,
      buscando,
      titulo,
      formularioFormateado,
      // Methods
      abrir,
      parametrosFiltradosVendedores,
      guardarDescuento,
      obtenerFormulario,
    };
  },
};
</script>
