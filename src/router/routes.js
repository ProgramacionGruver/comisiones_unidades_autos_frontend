import { name } from "dayjs/locale/es";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("src/pages/loginPage.vue"),
  },
  {
    path: "/principal",
    name: "principal",
    meta: { auth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        icono: "dashboard",
        label: "Inicio",
        name: "dashboard",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/dashboard/DashBoard.vue"
          ),
      },
      {
        path: "panelFacturas",
        icono: "description",
        label: "Panel de Facturas",
        name: "panelFacturas",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/facturas/PanelFacturas.vue"
          ),
      },
      {
        path: "panelPvas",
        icono: "assignment",
        label: "Panel de PVAS",
        name: "panelPvas",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/pvas/PanelPvas.vue"
          ),
      },
      {
        path: "planPiso",
        icono: "assignment",
        label: "Plan Piso",
        name: "planPiso",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/pvas/PlanPiso.vue"
          ),
      },
      {
        path: "descuentosVentas",
        icono: "payments",
        label: "Descuentos Ventas",
        name: "descuentosVentas",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/descuentos/DescuentosVentas.vue"
          ),
      },
      {
        path: "descuentosVendedores",
        icono: "payments",
        label: "Descuentos/Bonos a Vendedores",
        name: "descuentosVendedores",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/descuentos/DescuentosVendedores.vue"
          ),
      },
      {
        path: "objetivoValorReal",
        icono: "trending_up",
        label: "Valor de objetivo real",
        name: "objetivoValorReal",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/comisiones/ObjetivoReal.vue"
          ),
      },
      {
        path: "comisionesOtroDepartamento",
        icono: "calculate",
        label: "Calculador de Bono de Otro Departamento",
        name: "comisionesOtroDepartamento",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/comisiones/ComisionesOtroDepartamento.vue"
          ),
      },
      {
        path: "calculadorComisiones",
        icono: "calculate",
        label: "Calculador de Comisiones",
        name: "calculadorComisiones",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/comisiones/CalculadorComisiones.vue"
          ),
      },
      {
        path: "autorizaciones",
        icono: "checklist",
        label: "Autorizaciones de comisiones",
        name: "autorizaciones",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/autorizaciones/AutorizacionesComisiones.vue"
          ),
      },
      {
        path: "kpis",
        icono: "checklist",
        label: "Catálogo KPIS",
        name: "kpis",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/catalogos/PanelKpis.vue"
          ),
      },
      {
        path: "catalogoAsesores",
        icono: "group",
        label: "Catálogo de Vendedores",
        name: "catalogoAsesores",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/catalogos/CatalogoAsesores.vue"
          ),
      },
      {
        path: "catalogoAutorizadoresJefes",
        icono: "group",
        label: "Catálogo de Autorizadores",
        name: "catalogoAutorizadoresJefes",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/catalogos/CatalogoAutorizadores.vue"
          ),
      },
      {
        path: "catalogoAseguradoras",
        icono: "shield",
        label: "Catálogo de Aseguradoras",
        name: "catalogoAseguradoras",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/catalogos/CatalogoAseguradoras.vue"
          ),
      },
    ],
  },
  {
    path: "/autorizacion/vendedor/:idAsesor/:mes/:anio/:idAutorizacion",
    name: "autorizacionVendedor",
    component: () =>
      import("src/modules/autorizaciones/AutorizacionVendedor.vue"),
  },
  {
    path: "/autorizacion/jefe/:idAsesor/:mes/:anio/:idAutorizacion",
    name: "autorizacionJefe",
    component: () =>
      import("src/modules/autorizaciones/AutorizacionJefeVentas.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];
export default routes;
