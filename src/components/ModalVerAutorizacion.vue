<template>
  <q-dialog v-model="modalVerAutorizacion">
    <q-card class="custom-card">
      <q-card-section>
        <q-btn icon="close" flat round dense v-close-popup />
        <div class="text-h4 text-center q-mb-sm">
          Autorizaciones
          <q-separator />
        </div>
      </q-card-section>
      <q-table
        :rows-per-page-options="[100]"
        :rows="autorizacionObj"
        :columns="columns"
        row-key="name"
      >
        <template v-slot:body-cell-idTipoAutorizacion="props">
                      <div class="q-pl-md" style="font-size: small;">
                       {{ estadoRol(props.row.idTipoAutorizacion) }}
                      </div>
        </template>
        <template v-slot:body-cell-idEstatusAutorizacion="props">
                    <div style="padding-top: 1rem;">
                      <q-chip
                        class="q-mx-sm text-white"
                        size="1.2rem"
                        unelevated
                        rounded
                        :color="colorAutorizacion(props.row.idEstatusAutorizacion)"
                        :label="nombreAutorizacion(props.row.idEstatusAutorizacion)"
                      />
                    </div>
          </template>
      </q-table>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const modalVerAutorizacion = ref(false)
    const autorizacionObj = ref([])

    const abrir = (objAutorizacion) => {
      modalVerAutorizacion.value = true
      autorizacionObj.value = objAutorizacion
    }

    const columns = [
          {
            name: 'idTipoAutorizacion',
            label: 'Tipo Autorizacion',
            field: 'idTipoAutorizacion',
            align: 'left',
            sortable: true
          },
          {
            name: 'nombreEmpleadoAutoriza',
            label: 'Nombre',
            field: 'nombreEmpleadoAutoriza',
            align: 'left',
            sortable: true
          },
          {
            name: 'idEstatusAutorizacion',
            label: 'Estatus',
            field: 'idEstatusAutorizacion',
            align: 'left',
            sortable: true
          },
          {
            name: 'comentario',
            label: 'Comentario',
            field: 'comentario',
            align: 'left',
            sortable: true
          }
        ]

    const colorAutorizacion = (estado) => {
      if (estado === 2) {
        return 'green';
      } else if (estado === 3) {
        return 'red';
      } else {
        return 'grey';
      }
    }

    const nombreAutorizacion = (estado) => {
      if (estado === 2) {
        return 'Autorizada';
      } else if (estado === 3) {
        return 'Rechazada';
      } else {
        return 'Pendiente';
      }
    }

    const estadoRol = (estado) => {
      switch (estado) {
        case 1:
          return 'Gerente De Servicio';
        case 2:
          return 'Gerente Administrativo';
      }
    }

    return {
      abrir,
      colorAutorizacion,
      nombreAutorizacion,
      estadoRol,
      modalVerAutorizacion,
      autorizacionObj,
      columns
    }
  }
}
</script>

<style scoped>
.custom-card {
  width: 80%; /* Porcentaje del ancho de la pantalla */
  max-width: 800px; /* Ancho máximo de la tarjeta */
  margin: 0 auto; /* Centra la tarjeta horizontalmente */
}
</style>
