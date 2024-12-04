<template>
  <q-layout>
    <div class="q-pa-md">
      <h2>Panel de control</h2>
      <q-separator color="primary" class="q-my-md" inset />
      <div class="contenedor-card-acceso">
        <div>
          <div class="text-h4 q-mb-sm">Lista de modulos</div>
          <q-input
            outlined
            dense
            v-model="filterModulo"
            label="Buscar modulo"
            class="q-mb-sm"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-list bordered class="rounded-borders text-primary">
            <q-item
              v-for="module in listaModulos"
              :key="module"
              clickable
              v-ripple
              :active="link === module.name"
              @click="toggleLink(module.name)"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon :name="module.icono" />
              </q-item-section>

              <q-item-section
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                "
              >
                <div>
                  <span>{{ module.label }}</span>
                </div>
                <div style="position: relative; padding-right: 6rem">
                  <q-avatar
                    v-for="(n, index) in usuariosModulos[module.name]?.slice(
                      0,
                      3
                    )"
                    :key="n"
                    size="3rem"
                    :style="{
                      position: 'absolute',
                      left: `${(index - 1) * 20}px`,
                    }"
                  >
                    <img :src="obtenerURLImage(n.numero_empleado)" />
                  </q-avatar>

                  <q-avatar
                    v-if="usuariosModulos[module.name]?.length > 3"
                    size="3rem"
                    color="primary"
                    :style="{
                      position: 'absolute',
                      left: `40px`, // Ajusta el valor para el espaciado horizontal
                    }"
                    class="text-white"
                  >
                    <span style="font-size: 1.2rem">
                      +{{ usuariosModulos[module.name]?.length - 3 }}
                    </span>
                  </q-avatar>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div>
          <q-table
            grid
            flat
            bordered
            :rows="usuariosAcceso"
            :columns="columns"
            row-key="name"
            :filter="buscar"
            hide-header
            :rows-per-page-options="[0]"
          >
            <template v-slot:top-right>
              <q-input outlined dense v-model="buscar" label="Buscar usuarios">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-btn
                class="q-ml-md"
                color="primary"
                label="Editar accesos"
                @click="modalEditarAccesos"
              ></q-btn>
            </template>

            <template v-slot:item="props">
              <div class="q-pa-md col-md-4">
                <q-card>
                  <q-card-section class="text-center">
                    <q-avatar size="5rem">
                      <img :src="obtenerURLImage(props.row.numero_empleado)" />
                    </q-avatar>
                    <div style="min-height: 6rem; font-size: small">
                      <p style="font-size: small; margin-bottom: 0">
                        {{ props.row.nombre }}
                      </p>
                      <span>
                        <strong>{{ props.row.usuario }}</strong>
                      </span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-layout>
  <modal-permisos-usuario ref="modalAccesos"></modal-permisos-usuario>
</template>

<script>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import ModalPermisosUsuario from "src/components/ModalPermisosUsuario.vue";
import { useModulosStore } from "src/stores/permisosModulos";
import { obtenerURLImage } from "src/helpers/abrirURL.js";

export default {
  components: {
    ModalPermisosUsuario,
  },
  setup() {
    const useModulos = useModulosStore();
    const {
      usuariosModulos,
      usuariosAcceso,
      filtroUsuariosAcceso,
      listaModulos,
    } = storeToRefs(useModulos);

    const router = useRouter();
    const modalAccesos = ref(null);

    const filterModulo = ref("");
    const link = ref("");

    onMounted(() => {
      listaModulos.value = router.options.routes.find((r) => {
        return r.name === "principal";
      }).children;
    });

    const columns = [
      {
        name: "nombre",
        label: "nombre",
        field: "nombre",
      },
      {
        name: "usuario",
        label: "usuario",
        field: "usuario",
      },
    ];

    const toggleLink = (moduleName) => {
      if (link.value === moduleName) {
        link.value = "";
        usuariosAcceso.value = [...filtroUsuariosAcceso.value];
        return;
      }
      link.value = moduleName;
      usuariosAcceso.value = usuariosModulos.value[moduleName];
    };

    const modalEditarAccesos = () => {
      modalAccesos.value.abrir(listaModulos.value);
    };

    return {
      // state
      usuariosAcceso,
      listaModulos,
      buscar: ref(""),
      filterModulo,
      columns,
      usuariosModulos,
      link,
      modalAccesos,

      // metodos
      obtenerURLImage,
      toggleLink,
      modalEditarAccesos,
    };
  },
};
</script>

<style lang="sass" scoped>
.overlapping
  border: 2px solid white
  position: absolute
</style>
