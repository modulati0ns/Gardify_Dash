<template>
  <div class="container">
    <!-- Si no se encuentra un deviceId asociado al widget se muestra la vista de añadir planta -->
    <template v-if="!configWidget.deviceId">
      <div class="plantStatus">
        <div class="card-container" :position="configWidget.position">
          <!-- Aqui dentro se hace el flip de la card -->
          <card class="plantStatus-front">
            <div class="warnText">
              <fa
                class="icon-status normal"
                @click="selectPlant()"
                :icon="['fas', 'plus']"
              />
            </div>
          </card>
          <card class="plantStatus-back">
            <div class="card-container">
              <fa
                class="close"
                :icon="['fas', 'times']"
                @click="selectPlant()"
              />
              <!-- <fa
                class="icon-status normal"
                :icon="['fas', 'leaf']"
                @click="updatePlant()"
              /> -->
              <h4 class="warnText" style="padding: 2em">
                Selecciona el dispositivo que deseas mostrar
              </h4>
              <el-select
                class="devicesSelector"
                v-model="selectedDeviceId"
                placeholder="Seleccione su dispositivo"
              >
                <el-option
                  class="text-dark"
                  v-for="device in getDevices"
                  :key="device.deviceId"
                  :label="device.deviceName"
                  :value="device.deviceId"
                ></el-option>
              </el-select>
              <!-- Boton de añadir -->
              <div class="text-center" id="anadirButton">
                <base-button
                  type="primary"
                  class="mb-3"
                  size="md"
                  @click="updatePlant()"
                >
                  Seleccionar dispositivo
                </base-button>
              </div>
            </div>
          </card>
        </div>
      </div>
    </template>
    <template v-else>
      <card class="plantStatus">
        <fa class="close" :icon="['fas', 'times']" @click="deletePlant()" />
        <div slot="header">
          <h2 class="card-title">{{ configWidget.nombre }}</h2>
        </div>
        <div class="iconStatus">
          <!-- <i class="tim-icons icon-satisfied icon-status"></i> -->
          <!-- <span class="mdi emoticon-happy-outline"></span> -->
          <fa
            class="icon-status "
            :class="faceColorAndIcon()['color']"
            :icon="['far', faceColorAndIcon()['icon']]"
          />
        </div>
        <div class="data">
          <h4>Temperatura:</h4>
          <h2 class="valueTemperatura">{{ temperatura }}ºC</h2>
        </div>
        <div class="data">
          <h4>Humedad:</h4>
          <h2 class="valueHumedad">{{ humedad }}%</h2>
        </div>
      </card>
    </template>
  </div>
</template>

<script>
import Card from "../Cards/Card.vue";

import BaseInput from "~/components/Inputs/BaseInput.vue";
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
import BaseButton from "~/components/BaseButton.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  components: {
    Card,
    BaseInput,
    BaseButton,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  //   Propiedades que han de entrar al objeto
  props: ["config"],
  data() {
    return {
      temperatura: 0,
      humedad: 0,
      selectedDeviceId: "",
    };
  },
  mounted() {
    // Topico al que nos vamos a subscribir
    const topic =
      "gardify" +
      "/" +
      this.$store.state.user.userId +
      "/" +
      "hash" +
      "/" +
      this.config.deviceId +
      "/" +
      this.config.plantId;

    this.$nuxt.$on(topic, this.updateValues);
  },
  computed: {
    // Getters
    ...mapGetters(["getDevices", "getWidgets"]),
    // ...mapActions(["guardarWidget"]),
    ...mapMutations(["setConfig"]),

    configWidget() {
      return this.$store.state.widgets[this.config.position - 1];
    },
  },
  beforeDestroy() {
    const topic =
      "gardify" +
      "/" +
      this.config.userId +
      "/" +
      "hash" +
      "/" +
      this.config.deviceId +
      "/" +
      this.config.plantId;
    // Desubscripcion a topico
    this.$nuxt.$off(topic, this.updateValues);
  },
  methods: {
    // Metodo para hacer flip al card
    selectPlant() {
      const selectedCard = document.querySelectorAll(
        'div[position="' + this.config.position + '"]'
      );
      // console.log(selectedCard[0]);
      selectedCard[0].classList.toggle("is-flipped");
    },
    // Metodo para actualizar el dispositivo asociado al widget
    updatePlant() {
      // A partir del Id seleccionado en el widget, se busca el dispositicvo completo en el state del store
      const deviceFound = this.getDevices.find(
        (device) => device.deviceId == this.selectedDeviceId
      );

      // Se rellena el objeto de config con los valores correctos
      // this.config.nombre = deviceFound.deviceName;
      // this.config.deviceId = deviceFound.deviceId;
      var widgetOptions = {
        position: this.config.position,
        deviceFound: deviceFound,
      };
      console.log(widgetOptions);
      this.$store.commit("setConfig", widgetOptions);

      /* ME HE QUEDADO AQUI. HAY QUE:
    1º HACER QUE LA REQUEST POR AXIOS DE ABAJO EN LA QUE SE ACTUALIZA SEA MAS LIMPIA (MIDDLEWARE O ACTIONS)
    2º CONSEGUIR QUE SE ACTUALICE AUTOMATICAMENTE EÑ CMPONENTE CUANDO SE SELECCIONA EL DISPOSITIVO
    */
      // La request ha de tener el token del usuario almacenado en el store
      const requestHeader = {
        headers: {
          token: this.$store.state.user.token,
        },
      };

      const requestBody = {
        widgets: this.$store.state.widgets,
      };

      // Se ha recebido la señal de guardar los widgets asi que se llama al endpoint para ello
      this.$axios
        .put("/gfyapiv1/plantWidget", requestBody, requestHeader)
        .then((res) => {
          // Si se ha recibido el array correctamente
          if ((res.data.status = "success")) {
            this.$notify({
              verticalAlign: "bottom",
              horizontalAlign: "center",
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Se ha actualizado el widget correctamente.",
            });
          } else {
            this.$notify({
              verticalAlign: "bottom",
              horizontalAlign: "center",
              type: "danger",
              icon: "tim-icons icon-alert-circle-exc",
              message:
                "No se ha podido actualizar el widget. Inténtelo de nuevo.",
            });
          }
        });

      this.$store.dispatch("obtenerDispositivos");
      this.getWidgets;
      // this.config.plantId = deviceFound.deviceId; //TODO: Posible implementacion futura de PlantId
      // this.$store.getters.getDevices;
      // this.guardarWidget({ mensaje: "hola" });
      // this.$store.dispatch("guardarWidget", this.config);
      // Se emite el mensaje al index de que se han de guardar todos los datos
      // this.$nuxt.$emit("gardify/widgetsHasBeenConfigured");
    },
    deletePlant() {
      // Se borran las variables del config y se manda la orden de actualizar la bbdd
      this.config.nombre = "";
      this.config.deviceId = "";
      this.config.plantId = "";
      this.$nuxt.$emit("gardify/widgetsHasBeenConfigured");
    },
    // Metodo para actualizar los valores del widget
    updateValues(data) {
      // console.log(data);
      this.temperatura = data.temperatura;
      this.humedad = data.humedad;
    },
    // Seleccion del color del icono de la cara segun la temperatura etc
    faceColorAndIcon() {
      if (this.temperatura <= 20) {
        return { status: "false", color: "green", icon: "smile-wink" };

        // let color = "#fd5d93";
      } else {
        return { status: "false", color: "red", icon: "frown" };
      }
    },
  },
};
</script>

<style lang="scss">
.el-select-dropdown.el-popper {
  width: 30px;
}

.card-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: all 0.5s ease;
}

// .card-container flipped {
//   transform: rotateY(180deg);
// }

.card-container.is-flipped {
  transform: rotateY(180deg);
}

.plantStatus-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: black;
  color: white;
  display: flex;
  flex-direction: column;
}

.plantStatus-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: white;
  color: black;
  transform: rotateY(180deg);
}

.devicesSelector {
  padding-bottom: 1em;
  padding-left: 2em;
  padding-right: 2em;
}

.valueTemperatura {
  color: var(--primary) !important;
}
.valueHumedad {
  color: var(--purple) !important;
}
.icon-status {
  font-size: 9rem;
}

.icon-status.red {
  color: #fd5d93;
}

.icon-status.green {
  color: #2dce89;
}

.icon-status.normal {
  color: var(--primary);
  cursor: pointer;
}

.close {
  color: var(--red);
  cursor: pointer;
}

.plantStatus {
  text-align: center;
  height: 20rem;
}

.data {
  margin-bottom: -20px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: baseline;
  padding: 1rem;
  height: 4rem;
}

.warnText {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
}
</style>
