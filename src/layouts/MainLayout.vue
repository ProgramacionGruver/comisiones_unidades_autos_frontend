<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar class="logo-inicio bg-white">
            <img src="../img/logog.png" class="q-pa-xs" />
          </q-avatar>
          Portal Comisiones Unidades (Autos)
        </q-toolbar-title>
        <q-btn flat @click="logout"> Cerrar sesión</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="270"
    >
      <div class="contenedor-perfil">
        <div
          style="background-color: rgba(0, 0, 0, 0.5)"
          class="q-px-md q-py-sm"
        >
          <div style="display: flex; justify-content: center">
            <q-avatar size="7rem">
              <q-img
                :src="calcularURLFoto(usuarioAutenticado?.numero_empleado)"
                spinner-color="white"
              />
            </q-avatar>
          </div>
          <div style="display: flex; justify-content: center">
            {{ usuarioAutenticado?.nombre }}
          </div>
        </div>
      </div>
      <NavBar></NavBar>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAutenticacionStore } from "../stores/autenticaciones";
import { useRouter } from "vue-router";
import { useSucursalesStore } from "src/stores/catalogos/sucursales";
import { useEmpresasStore } from "src/stores/catalogos/empresas";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { useAseguradorasStore } from "src/stores/catalogos/aseguradoras";

import NavBar from "../components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const useUsuario = useAutenticacionStore();
    const router = useRouter();

    const { usuarioAutenticado } = storeToRefs(useUsuario);
    const { cerrarSesion } = useUsuario;

    const useEmpresas = useEmpresasStore();
    const { obtenerEmpresas } = useEmpresas;

    const useSucursales = useSucursalesStore();
    const { obtenerSucursales } = useSucursales;

    const useDepartamentos = useDepartamentosStore();
    const { obtenerDepartamentos } = useDepartamentos;

    const useFacturas = useFacturasStore();
    const { obtenerVendedores, obtenerClientes } = useFacturas;

    const useAseguradoras = useAseguradorasStore();
    const { obtenerCatalogoAseguradoras } = useAseguradoras;

    onMounted(async () => {
      await obtenerEmpresas();
      await obtenerSucursales();
      await obtenerDepartamentos();
      await obtenerVendedores();
      await obtenerCatalogoAseguradoras();
    });

    const logout = () => {
      router.push("/");
      cerrarSesion();
    };

    const calcularURLFoto = (numeroEmpleado) => {
      const idFormateado = String(numeroEmpleado).padStart(7, "0");
      const url = `https://backend.gruver.com.mx/rh/api/fotos/${idFormateado}.jpg`;
      return url;
    };

    return {
      leftDrawerOpen,
      usuarioAutenticado,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      calcularURLFoto,
    };
  },
};
</script>
<style scoped>
.logo-inicio {
  background-color: white;
}
.logo-inicio img {
  padding: 0.3rem;
}
.contenedor-menu {
  margin-bottom: 1rem;
}
</style>
