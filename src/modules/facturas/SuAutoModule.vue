<template>
  <q-layout>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <h2>Carga de contratos de SuAuto</h2>
        <q-separator color="primary" class="q-my-md" />
        <q-table
          :loading="cargando"
          color="primary"
          :columns="columns"
          :filter="buscar"
          :rows="contratos"
          no-data-label="No se encontró información disponible."
          loading-label="Buscando información . . ."
          row-key="idContrato"
          :pagination="pagination"
        >
          <template v-slot:top>
            <div class="fit row q-gutter-md">
              <q-select
                outlined
                :disable="cargando"
                :options="listaAnios"
                v-model="anioSeleccionado"
                @update:model-value="buscarContratos()"
                map-options
                option-value="name"
                class="col"
              />
              <q-select
                outlined
                :disable="cargando"
                :options="listaMeses"
                v-model="mesSeleccionado"
                @update:model-value="buscarContratos()"
                map-options
                option-value="name"
                class="col"
              />
              <div class="col-4">
                <div class="fit row q-gutter-md">
                  <q-btn
                    color="primary"
                    label="Descargar formato"
                    icon="download"
                    @click="descargarFormato"
                    class="col"
                    :disable="cargando"
                    dense
                  />
                  <q-btn
                    color="green"
                    label="Cargar Excel"
                    icon="cloud_upload"
                    @click="cargarExcel"
                    class="col"
                    :disable="cargando"
                    dense
                  />
                </div>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-asesor="props">
            <q-td class="text-center">
              {{ props.row.asesore.nombreEmpleado }}
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <modal-cargar-excel ref="modalCargarExcel" />
  </q-layout>
</template>

<script>
import { storeToRefs } from "pinia";
import { useSuAutoStore } from "src/stores/suAuto";
import { onMounted, ref } from "vue";
import { listaMeses, listaAnios } from "src/helpers/listas";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { formatearMonto } from "src/helpers/formatos";
import ModalCargarExcel from "src/components/ModalCargarExcel.vue";
import { useQuasar } from "quasar";
import { obtenerNumerosDeMes } from "src/constant/constantes";

export default {
  components: {
    ModalCargarExcel,
  },
  setup() {
    const useSuAuto = useSuAutoStore();
    const { obtenerContratosSuAuto, descargarFormatoExcel } = useSuAuto;
    const { contratos } = storeToRefs(useSuAuto);

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const cargando = ref(false);

    const modalCargarExcel = ref(null);

    const notificacionQuasar = useQuasar();

    const columns = [
      {
        name: "idContrato",
        label: "#",
        align: "center",
        field: "idContrato",
      },
      {
        name: "contrato",
        label: "No. Contrato",
        align: "center",
        field: "contrato",
      },
      {
        fechaContrato: "fechaContrato",
        label: "Fecha Contrato",
        align: "center",
        field: "fechaContrato",
      },
      {
        name: "cliente",
        label: "Cliente",
        align: "center",
        field: "cliente",
      },
      {
        name: "fechaPago",
        label: "Fecha Pago",
        align: "center",
        field: "fechaPago",
      },
      {
        name: "asesor",
        label: "Asesor",
        align: "center",
      },
      {
        name: "precioGuia",
        label: "Precio Guía",
        align: "center",
        field: (row) =>
          row.precioGuia ? formatearMonto(row.precioGuia) : formatearMonto(0),
      },
      {
        name: "aPagar",
        label: "A Pagar",
        align: "center",
        field: (row) =>
          row.pago ? formatearMonto(row.pago) : formatearMonto(0),
      },
    ];

    onMounted(async () => {
      cargando.value = true;

      await obtenerContratosSuAuto({
        anio: anioSeleccionado.value,
        mes: Number(obtenerNumerosDeMes(mesSeleccionado.value)),
      });

      cargando.value = false;
    });

    const buscarContratos = async () => {
      cargando.value = true;

      await obtenerContratosSuAuto({
        anio: anioSeleccionado.value,
        mes: Number(obtenerNumerosDeMes(mesSeleccionado.value)),
      });

      cargando.value = false;
    };

    const cargarExcel = () => {
      modalCargarExcel.value.abrir();
    };

    const descargarFormato = () => {
      notificacionQuasar
        .dialog({
          title: "Descargando formato",
          message: "¿Desea descargar el formato de los contratos de Su Auto?",
          cancel: true,
          persistent: true,
          ok: "Descargar",
        })
        .onOk(async () => {
          try {
            const blob = await descargarFormatoExcel();
            if (!blob) {
              throw new Error("No se pudo descargar el formato.");
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "ContratosSuAuto.xlsx");
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Error al descargar el formato:", error);
          }
        })
        .onCancel(() => {});
    };

    return {
      // States
      listaAnios,
      listaMeses,
      contratos,
      cargando,
      anioSeleccionado,
      mesSeleccionado,
      columns,
      buscar: ref(""),
      modalCargarExcel,
      pagination: ref({ rowsPerPage: 15 }),
      // Methods
      buscarContratos,
      cargarExcel,
      descargarFormato,
    };
  },
};
</script>
