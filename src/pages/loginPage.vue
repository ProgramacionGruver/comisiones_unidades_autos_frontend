<template>
  <div class="contenedor-login">
    <div class="informacion-login contenedor">
      <div class="portada-login">
        <h1> <span>  </span></h1>
      </div>
      <q-form
        class="bg-white formulario-login"
        @submit.prevent="login"
        ref="formulario"
      >
        <div class="q-pa-xl">
          <div class="contenedor-logo-gruver">
            <q-img
              src="../img/logoGruver.png"
              spinner-color="white"
              class="q-mb-xl imagen-gruver"
            />
          </div>
          <div class="q-mb-md">
            <q-input
            autocomplete="username"
              ref="usuarioRef"
              v-model="usuarioObj.usuario"
              label="Ingresa el nombre de usuario"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Debes ingresar un nombre de usuario',
              ]"
            >
              <template v-slot:append>
                <q-icon name="person" />
              </template>
            </q-input>
          </div>
          <div class="q-mb-md">
            <q-input
              autocomplete="current-password"
              ref="contrasenaRef"
              v-model="usuarioObj.contrasena"
              filled
              :type="isPassword ? 'password' : 'text'"
              label="Ingresa la contraseña"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Debes ingresar una contraseña',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPassword = !isPassword"
                />
              </template>
            </q-input>
          </div>
          <div class="btn-login">
            <q-btn color="primary" type="submit" label="Iniciar Sesión" />
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import { useAutenticacionStore } from "../stores/autenticaciones";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ID_SERVIDOR } from "src/constant/servidor";
import { useFacturasStore } from "src/stores/catalogos/facturas";


export default {
  setup() {
    const useAutenticacion = useAutenticacionStore();
    const { iniciarSesion, autenticarUsuario } = useAutenticacion;
    const { isLogin } = storeToRefs(useAutenticacion);

    const useFacturas = useFacturasStore()
    const { obtenerClientes, obtenerVendedores } = useFacturas


    const isPassword = ref(true);
    const formulario = ref(null);
    const router = useRouter();

    const usuarioObj = reactive({
      usuario: "",
      contrasena: "",
      portal: ID_SERVIDOR,
    });

    onMounted(async () => {
      await obtenerClientes()
      await autenticarUsuario();
      if (isLogin.value) {
        router.push("/principal");
      }
    });

    const login = async () => {
      if (await formulario.value.validate()) {
        await iniciarSesion(usuarioObj);
        router.push("/principal");
      }
    };

    return {
      usuarioObj,
      isPassword,
      login,
      formulario,
      iniciarSesion,
    };
  },
};
</script>

<style scoped>
h1 {
  margin-top: 0;
}
.contenedor-login {
  background-color: #f3f4f6;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
