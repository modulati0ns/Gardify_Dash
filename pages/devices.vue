<template>
  <div class="row">
    <div class="row">
      <!-- Header -->
      <div class="col-12">
        <div slot="header">
          <h2 class="card-title">Dispositivos</h2>
        </div>
      </div>

      <!-- Card con el listado de dispositivos -->
      <div class="col-12">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6">
                <h2 class="card-title">Dispositivos registrados</h2>
              </div>
            </div>
          </template>

          <!-- Tabla de dispositivos -->
          <div class="row" id="tablaDevices">
            <el-table :data="getDevices" id="tabla">
              <el-table-column min-width="20" aling="left" label="#">
                <div slot-scope="{ $index }">
                  {{ $index + 1 }}
                </div>
              </el-table-column>
              <el-table-column
                prop="deviceId"
                min-width="50"
                aling="left"
                label="Numero de Serie"
              ></el-table-column>
              <el-table-column
                prop="deviceName"
                min-width="50"
                label="Nombre"
              ></el-table-column>
              <!-- <el-table-column
                prop="deviceGroup"
                min-width="50"
                label="Grupo"
              ></el-table-column> -->

              <el-table-column min-width="50" label="Activacion">
                <div slot-scope="{ row }">
                  <base-switch
                    @click="updateSaverRuleStatus(row)"
                    v-model="status"
                  ></base-switch>
                </div>
              </el-table-column>

              <el-table-column
                align="center"
                min-width="50"
                label="Eliminar dispositivo"
              >
                <div slot-scope="{ row }">
                  <el-tooltip
                    content="Delete"
                    :open-delay="300"
                    placement="top"
                  >
                    <base-button
                      type="danger"
                      size="sm"
                      icon
                      @click="eliminarDispositivo(row)"
                      style=""
                    >
                      <i class="tim-icons icon-simple-remove"></i>
                    </base-button>
                  </el-tooltip>
                </div>
              </el-table-column>
            </el-table>
          </div>
        </card>
      </div>

      <!-- Card para añadir nuevos dispositivos -->
      <div class="col-12">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6">
                <h2 class="card-title">Nuevo dispositivo</h2>
              </div>
            </div>
          </template>

          <div class="row" id="input">
            <!-- Input de nombre -->
            <div class="col-md-4">
              <base-input
                label="Nombre"
                type="text"
                placeholder="Ej: Geranio, tomates..."
                v-model="nuevoDispositivo.deviceName"
              >
              </base-input>
            </div>

            <!-- Input de numero de serie -->
            <div class="col-md-4">
              <slot name="label">
                <label>Numero de serie</label>
                <base-input
                  type="text"
                  placeholder="Ej: 12345678"
                  v-model="nuevoDispositivo.deviceId"
                >
                </base-input>
              </slot>
            </div>

            <!-- Input de grupo -->
            <!-- <div class="col-md-4">
              <slot name="label">
                <label>Grupo</label>
                <br />
              </slot>
              <el-select label="sdfs" value="1" placeholder="Añadir a grupo">
                <el-option
                  class="text-dark"
                  label="Grupo 1"
                  value="1"
                ></el-option>
                <el-option
                  class="text-dark"
                  label="Grupo 2"
                  value="2"
                ></el-option>
                <el-option
                  class="text-dark"
                  label="Grupo 3"
                  value="3"
                ></el-option>
              </el-select>
            </div> -->

            <!-- Boton de añadir -->
            <div
              class="col-sm-1 text-center"
              id="anadirButton"
              @click="crearDispositivo()"
            >
              <base-button type="primary" class="mb-3" size="md">
                Añadir dispositivo
              </base-button>
            </div>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "~/components/Cards/Card.vue";
import BaseInput from "~/components/Inputs/BaseInput.vue";
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
// import BaseButton from "~/components/BaseButton.vue";
// import BaseSwitch from "~/components/BaseSwitch.vue";
import jaison from "~/components/jaison.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Card,
    // BaseInput,
    // BaseButton,
    // BaseSwitch,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
    jaison,
  },

  data() {
    return {
      nuevoDispositivo: {
        deviceName: "",
        deviceId: "",
      },
      status: true,
    };
  },
  computed: {
    // Getters
    ...mapGetters(["getDevices"]),
  },
  methods: {
    ...mapActions(["obtenerDispositivos"]),
    // Metodo para eliminar dispositivo
    eliminarDispositivo(dispositivo) {
      // La request ha de tener el token del usuario almacenado en el store y id del dispositivo que se ha de eliminar
      const requestHeader = {
        headers: {
          token: this.$store.state.user.token,
        },
        params: {
          deviceId: dispositivo.deviceId,
        },
      };

      this.$axios.delete("/gfyapiv1/devices", requestHeader).then((res) => {
        // Si se ha eliminado correctamente
        if ((res.data.status = "success")) {
          // Mostramos notificacion de registro correcto
          this.$notify({
            verticalAlign: "bottom",
            horizontalAlign: "center",
            type: "success",
            icon: "tim-icons icon-check-2",
            message:
              "Dispositivo " +
              dispositivo.deviceName +
              " eliminado correctamente",
          });

          this.deleteWidgetWhenDelete(dispositivo);

          // Volvemos a obtener los dispositivos del usuario
          this.$store.dispatch("obtenerDispositivos");
        } else {
          // Mostramos notificacion de registro correcto
          this.$notify({
            verticalAlign: "bottom",
            horizontalAlign: "center",
            type: "danger",
            icon: "tim-icons icon-check-2",
            message:
              "No se ha podido eliminar el dispositivo " +
              dispositivo.deviceName,
          });

          // Volvemos a obtener los dispositivos del usuario
          this.$store.dispatch("obtenerDispositivos");
        }
      });
    },
    deleteWidgetWhenDelete(dispositivo) {
      // La request ha de tener el token del usuario almacenado en el store
      const requestHeader = {
        headers: {
          token: this.$store.state.user.token,
        },
      };
      // Se hace la llamada a la API para obtener el array de plant widgets
      this.$axios.get("/gfyapiv1/plantWidget", requestHeader).then((res) => {
        // Si se ha recibido el array correctamente
        if ((res.data.status = "success")) {
          // Se buscan las posiciones de los widgets a eliminar
          const foundWidgetsPositions = this.getAllIndexes(
            res.data.widgets,
            dispositivo
          );

          // En este momento se ha encontrado uno a varios widget activo de un dispositivo que se acaba de borrar
          if (foundWidgetsPositions) {
            // Se elimina el Widget de la base de datos
            const requestHeader = {
              headers: {
                token: this.$store.state.user.token,
              },
              params: {
                positions: foundWidgetsPositions,
                widgets: res.data.widgets,
              },
            };
            console.log(requestHeader);
            this.$axios.delete("/gfyapiv1/plantWidget", requestHeader);
          }
        }
      });
    },
    getAllIndexes(arr, val) {
      var indexes = [],
        i;
      for (i = 0; i < arr.length; i++)
        if (arr[i].deviceId === val.deviceId) {
          indexes.push(i + 1);
        } else {
          indexes.push(0);
        }
      return indexes;
    },
    // Metodo para crear dispositivo
    crearDispositivo() {
      // La request ha de tener el token del usuario almacenado en el store y id del dispositivo que se ha de eliminar
      const requestHeader = {
        headers: {
          token: this.$store.state.user.token,
        },
      };

      const requestBody = {
        nuevoDispositivo: this.nuevoDispositivo,
      };

      this.$axios
        .post("/gfyapiv1/devices", requestBody, requestHeader)
        .then((res) => {
          // Si se ha eliminado correctamente
          if ((res.data.status = "success")) {
            // Mostramos notificacion de registro correcto
            this.$notify({
              verticalAlign: "bottom",
              horizontalAlign: "center",
              type: "success",
              icon: "tim-icons icon-check-2",
              message:
                "Dispositivo " +
                this.nuevoDispositivo.deviceName +
                " creado correctamente",
            });

            // Volvemos a obtener los dispositivos del usuario
            this.$store.dispatch("obtenerDispositivos");
          } else {
            // Mostramos notificacion de registro correcto
            this.$notify({
              verticalAlign: "bottom",
              horizontalAlign: "center",
              type: "danger",
              icon: "tim-icons icon-check-2",
              message:
                "No se ha podido crear el dispositivo " +
                this.nuevoDispositivo.deviceName,
            });

            // Volvemos a obtener los dispositivos del usuario
            this.$store.dispatch("obtenerDispositivos");
          }
        });
    },
    updateSaverRuleStatus(device) {
      console.log(device);
      try {
        // Hacemos una copia de la variable para no depender de la store
        let deviceCopy = JSON.parse(JSON.stringify(device));

        // Invertimos el estado actual del boton
        deviceCopy.saverRule.status = !deviceCopy.saverRule.status;

        let requestBody = {
          newSaverRule: deviceCopy.saverRule,
        };

        let requestHeader = {
          headers: {
            token: this.$store.state.user.token,
          },
        };

        console.log(requestBody);
        // Llamada a API de GFY para actualizar el deviceSaverRule
        this.$axios
          .put("/gfyapiv1/deviceSaverRule", requestBody, requestHeader)
          .then((res) => {
            if (res.data.status == "success") {
              // Si todo ha salido bien se vuelven a obtener los dispositivos
              this.$store.dispatch("obtenerDispositivos");

              // this.$notify({
              //   verticalAlign: "bottom",
              //   horizontalAlign: "center",
              //   type: "success",
              //   icon: "tim-icons icon-check-2",
              //   message: "Se actualizó el estado del dispositivo correctamente",
              // });
            }
          });
      } catch (error) {
        console.log(error);
        // Se muestra un error
        this.$notify({
          verticalAlign: "bottom",
          horizontalAlign: "center",
          type: "fail",
          icon: "tim-icons icon-check-2",
          message:
            "No se pudo actualizar el estado del dispositivo correctamente",
        });
      }
    },
  },
};
</script>

<style>
#tablaDevices {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-block: 20px;
}

#anadirButton {
  padding-top: 1.2rem;
  align-content: center;
  align-self: center;
}

#input {
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: auto;
  width: 100%;
}

.el-select {
  width: 100%;
}

.el-input__inner {
  border-radius: 0.4285rem;
  border-color: rgba(29, 37, 59, 0.5);
  color: #222a42;
  display: block;
  height: calc(2.25rem + 2px);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.42857;
}

.el-select .el-input.is-focus .el-input__inner {
  border-color: #e14eca;
}

.el-select .el-input__inner:focus {
  border-color: #00bf9a;
}
</style>
