<template>
  <div class="row">
    <div class="row">
      <!-- Header -->
      <div class="col-12">
        <div slot="header">
          <h2 class="card-title">Alertas</h2>
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
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Card,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
  },

  data() {
    return {};
  },
  computed: {
    // Getters
    ...mapGetters(["getDevices"]),
  },
  methods: {
    ...mapActions(["obtenerDispositivos"]),
    // Metodo para eliminar dispositivo
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
