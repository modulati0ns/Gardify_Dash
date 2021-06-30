<template>
  <card class="plantStatus">
    <template v-if="false">
      <div class="warnText">
        <fa class="icon-status normal" :icon="['fas', 'plus']" />
        <h4 class="">Añade una planta</h4>
      </div>
    </template>
    <template v-else>
      <div slot="header">
        <h2 class="card-title">{{ config.nombre }}</h2>
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
        <h2 class="valueTemperatura">{{ config.temperatura }}ºC</h2>
      </div>
      <div class="data">
        <h4>Humedad:</h4>
        <h2 class="valueHumedad">{{ config.humedad }}%</h2>
      </div>
    </template>
  </card>
</template>

<script>
import Card from "../Cards/Card.vue";
export default {
  components: { Card },
  //   Propiedades que han de entrar al objeto
  props: ["config"],
  data() {
    return {};
  },
  mounted() {
    // Topico al que nos vamos a subscribir
    const topic =
      "gardify" +
      "/" +
      this.config.idUsuario +
      "/" +
      "hash" +
      "/" +
      this.config.idDispositivo +
      "/" +
      this.config.idPlanta;

    this.$nuxt.$on(topic, this.updateValues);
  },
  beforeDestroy() {
    const topic =
      "gardify" +
      "/" +
      this.config.idUsuario +
      "/" +
      "hash" +
      "/" +
      this.config.idDispositivo +
      "/" +
      this.config.idPlanta;
    // Desubscripcion a topico
    this.$nuxt.$off(topic, this.updateValues);
  },
  methods: {
    updateValues(data) {
      console.log(data);
      this.config.temperatura = data.temperatura;
      this.config.humedad = data.humedad;
    },
    faceColorAndIcon() {
      if (this.config.temperatura <= 20) {
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
