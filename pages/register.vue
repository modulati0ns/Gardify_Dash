<template>
  <div>
    <div class="page-wrapper bg-gra-01 p-t-180 p-b-100 font-poppins">
      <div class="wrapper wrapper--w780">
        <div class="bloque">
          <div class="card card-3">
            <div class="card-heading"></div>
            <div class="card-body">
              <h2 class="title">Registro</h2>
              <form method="POST">
                <div class="input-group">
                  <input
                    class="input--style-3"
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    v-model="user.nombre"
                  />
                </div>
                <div class="input-group">
                  <input
                    class="input--style-3 js-datepicker"
                    type="text"
                    placeholder="Apellido"
                    name="apellido"
                    v-model="user.apellidos"
                  />
                </div>

                <div class="input-group">
                  <input
                    class="input--style-3"
                    type="email"
                    placeholder="Email"
                    name="email"
                    v-model="user.email"
                  />
                </div>
                <div class="input-group">
                  <input
                    class="input--style-3"
                    type="text"
                    placeholder="Contraseña"
                    name="password"
                    v-model="user.password"
                  />
                </div>
                <div class="p-t-10">
                  <base-button
                    class="btn btn--pill"
                    type="button"
                    @click="register()"
                    block
                  >
                    Registro
                  </base-button>
                </div>
              </form>
            </div>
          </div>
          <div class="copyright">
            2021. Gardify. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "~/components/BaseButton.vue";
export default {
  layout: "blank",
  data() {
    return {
      user: {
        nombre: "",
        apellido: "",
        email: "",
        password: "",
      },
    };
  },
  head: {
    script: [
      {
        src: "/register/vendor/jquery/jquery.min.js",
        src: "/register/vendor/select2/select2.min.js",
        src: "/register/vendor/datepicker/moment.min.js",
        src: "/register/vendor/datepicker/daterangepicker.js",
        src: "/register/js/global.js",
      },
    ],
  },
  methods: {
    // Funcion llamada cuando se pulsa el boton de registro
    register() {
      // LLamada a la API de registro enviando los datos obtenidos en el formulario
      this.$axios
        .post("/gfyapiv1/register", this.user)
        .then((res) => {
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    },
  },
};
</script>

<style>
/* ==========================================================================
   #FONT
   ========================================================================== */
.font-robo {
  font-family: "Roboto", "Arial", "Helvetica Neue", sans-serif;
}

.font-poppins {
  font-family: "Poppins", "Arial", "Helvetica Neue", sans-serif;
}

/* ==========================================================================
   #GRID
   ========================================================================== */
.row {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.row-space {
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -moz-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.col-2 {
  width: -webkit-calc((100% - 60px) / 2);
  width: -moz-calc((100% - 60px) / 2);
  width: calc((100% - 60px) / 2);
}

@media (max-width: 767px) {
  .col-2 {
    width: 100%;
  }
}

/* ==========================================================================
   #BOX-SIZING
   ========================================================================== */
/**
 * More sensible default box-sizing:
 * css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice
 */
html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

* {
  padding: 0;
  margin: 0;
}

*,
*:before,
*:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}

/* ==========================================================================
   #RESET
   ========================================================================== */
/**
 * A very simple reset that sits on top of Normalize.css.
 */
body,
h1,
h2,
h3,
h4,
h5,
h6,
blockquote,
p,
pre,
dl,
dd,
ol,
ul,
figure,
hr,
fieldset,
legend {
  margin: 0;
  padding: 0;
}

/**
 * Remove trailing margins from nested lists.
 */
li > ol,
li > ul {
  margin-bottom: 0;
}

/**
 * Remove default table spacing.
 */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/**
 * 1. Reset Chrome and Firefox behaviour which sets a `min-width: min-content;`
 *    on fieldsets.
 */
fieldset {
  min-width: 0;
  /* [1] */
  border: 0;
}

button {
  outline: none;
  background: none;
  border: none;
  align-items: right;
}

/* ==========================================================================
   #PAGE WRAPPER
   ========================================================================== */
.page-wrapper {
  height: 100%;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  max-height: 100vh;
}

body {
  font-family: "Poppins", "Arial", "Helvetica Neue", sans-serif;
  font-weight: 400;
  font-size: 14px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 400;
}

h1 {
  font-size: 36px;
}

h2 {
  font-size: 30px;
}

h3 {
  font-size: 24px;
}

h4 {
  font-size: 18px;
}

h5 {
  font-size: 15px;
}

h6 {
  font-size: 13px;
}

/* ==========================================================================
   #BACKGROUND
   ========================================================================== */
.bg-blue {
  background: #2c6ed5;
}

.bg-red {
  background: #fa4251;
}

.bg-gra-01 {
  /* background: -webkit-gradient(
    linear,
    right bottom,
    left top,
    from(#f5f6fa),
    to(#a7b385)
  ); */
  /* background: -webkit-linear-gradient(bottom, var(--primary) 0%, #a18cd1 100%);
  background: -moz-linear-gradient(bottom, var(--primary) 0%, #a18cd1 100%);
  background: -o-linear-gradient(bottom, var(--primary) 0%, #a18cd1 100%);
  background: linear-gradient(to top, var(--primary) 0%, #a18cd1 100%); */
  background: linear-gradient(
    180deg,
    rgba(245, 246, 250, 1) 50%,
    rgba(135, 208, 47, 0.3449754901960784) 100%
  );
}

/* ==========================================================================
   #SPACING
   ========================================================================== */

.p-t-20 {
  padding-top: 20px;
}

.p-t-10 {
  padding-top: 10px;
}

.p-t-30 {
  padding-top: 30px;
}

.p-b-100 {
  margin-bottom: -100px;
}

/* ==========================================================================
   #WRAPPER
   ========================================================================== */
.wrapper {
  margin: 0 auto;
}

.wrapper--w960 {
  max-width: 960px;
}

.wrapper--w780 {
  max-width: 780px;
}

.wrapper--w680 {
  max-width: 680px;
}

/* ==========================================================================
   #BUTTON
   ========================================================================== */
.btn {
  display: inline-block;
  line-height: 40px;
  padding: 0 33px;
  font-family: Poppins, Arial, "Helvetica Neue", sans-serif;
  cursor: pointer;
  color: #fff;
  -webkit-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  -moz-transition: all 0.4s ease;
  transition: all 0.4s ease;
  font-size: 18px;
  background: var(--primary);
}

.btn--radius {
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}

.btn--pill {
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}

.btn--green {
  background: #57b846;
}

.btn--green:hover {
  background: #4dae3c;
}

/* ==========================================================================
   #FORM
   ========================================================================== */
input {
  outline: none;
  margin: 0;
  border: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  width: 100%;
  font-size: 14px;
  font-family: inherit;
}

.input-icon {
  position: absolute;
  font-size: 18px;
  color: #ccc;
  right: 8px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: pointer;
}

.input-group {
  position: relative;
  margin-bottom: 33px;
  border-bottom: 1px solid rgba(43, 42, 42, 0.062);
}

.input--style-3 {
  padding: 5px 0;
  font-size: 16px;
  color: var(--primary) !important;
  background: transparent;
}

.input--style-3::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: rgb(68, 68, 68);
  opacity: 0.5;
}

.input--style-3:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgb(68, 68, 68);
  opacity: 0.8;
}

.input--style-3::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgb(68, 68, 68);
  opacity: 0.8;
}

.input--style-3:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgb(68, 68, 68);
  opacity: 0.8;
}

.input--style-3:-ms-input-placeholder {
  /* Microsoft Edge */
  color: rgb(68, 68, 68);
  opacity: 0.8;
}

/* ==========================================================================
   #SELECT2
   ========================================================================== */
.select--no-search .select2-search {
  display: none !important;
}

.rs-select2 .select2-container {
  width: 100% !important;
  outline: none;
}

.rs-select2 .select2-container .select2-selection--single {
  outline: none;
  border: none;
  height: 36px;
  background: transparent;
}

.rs-select2
  .select2-container
  .select2-selection--single
  .select2-selection__rendered {
  line-height: 36px;
  padding-left: 0;
  color: #ccc;
  font-size: 16px;
  font-family: inherit;
}

.rs-select2
  .select2-container
  .select2-selection--single
  .select2-selection__arrow {
  height: 34px;
  right: 4px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -moz-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.rs-select2
  .select2-container
  .select2-selection--single
  .select2-selection__arrow
  b {
  display: none;
}

.rs-select2
  .select2-container
  .select2-selection--single
  .select2-selection__arrow:after {
  font-family: "Material-Design-Iconic-Font";
  content: "\f2f9";
  font-size: 18px;
  color: #ccc;
  -webkit-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  -moz-transition: all 0.4s ease;
  transition: all 0.4s ease;
}

.rs-select2
  .select2-container.select2-container--open
  .select2-selection--single
  .select2-selection__arrow::after {
  -webkit-transform: rotate(-180deg);
  -moz-transform: rotate(-180deg);
  -ms-transform: rotate(-180deg);
  -o-transform: rotate(-180deg);
  transform: rotate(-180deg);
}

.select2-container--open .select2-dropdown--below {
  border: none;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  margin-top: 5px;
  overflow: hidden;
}

/* ==========================================================================
   #TITLE
   ========================================================================== */
.title {
  font-size: 30px;
  color: #fff;
  font-weight: 400;
  margin-bottom: 36px;
}

/* ==========================================================================
   #CARD
   ========================================================================== */
.card {
  overflow: hidden;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background: #fff;
}

.card-3 {
  background: #000;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  width: 100%;
  display: table;
}

.card-3 .card-heading {
  background: url("../util/register/images/plant.jpg") top left/cover no-repeat;
  display: table-cell;
  width: 50%;
}

.card-3 .card-body {
  padding: 57px 65px;
  padding-bottom: 65px;
  display: table-cell;
  background-color: #fdfeff;
}

.copyright {
  margin-top: -20px;
  text-align: center;
  color: #000;
  opacity: 0.4;
  font-size: 0.75rem;
}

.bloque {
  margin-top: 190px;
}

@media (max-width: 767px) {
  .card-3 {
    display: block;
  }
  .card-3 .card-heading {
    display: block;
    width: 100%;
    padding-top: 400px;
    background-position: center center;
  }
  .card-3 .card-body {
    display: block;
    width: 100%;
    padding: 37px 30px;
    padding-bottom: 45px;
  }
}
</style>
