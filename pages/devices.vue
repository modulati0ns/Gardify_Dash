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
          <el-table :data="devices" id="tabla">
            <el-table-column min-width="20" aling="left" label="#">
              <div slot-scope="{row, $index}">
                {{$index}}
                </div>
                </el-table-column>
            <el-table-column prop="id" min-width="50" aling="left" label="Numero de Serie"></el-table-column>
            <el-table-column prop="deviceName" min-width="50" label="Nombre"></el-table-column>
            <el-table-column prop="deviceGroup" min-width="50"  label="Grupo"></el-table-column>
            <el-table-column align="center" min-width="50" label="Eliminar dispositivo">
              <div slot-scope="{row, $index}">
              <el-tooltip content="Delete"
                  :open-delay="300"
                  placement="top">
                <base-button type="danger" size="sm" icon @click="eliminarDispositivo(row)" style=""> 
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
            >
            </base-input>
          </div>

          <!-- Input de numero de serie -->
          <div class="col-md-4">
            <slot name="label">
              <label>Numero de serie</label>
              <base-input type="text" placeholder="Ej: 12345678"> </base-input>
            </slot>
          </div>

          <!-- Input de label -->
          <div class="col-md-4">
            <slot name="label">
              <label>Grupo</label>
              </br>
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
          </div>

            <!-- Boton de añadir -->
            <div class="col-sm-1 text-center" id="anadirButton" >
              <base-button type="primary" class="mb-3" size="md">
                Añadir dispositivo
              </base-button>
            </div>
            
        </div>
      </card>
    </div>

    <jaison :value="devices">
    </jaison>
  </div>
  
  </div>
</template>

<script>
import Card from "~/components/Cards/Card.vue";
import BaseInput from "~/components/Inputs/BaseInput.vue";
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
import BaseButton from "~/components/BaseButton.vue";
import jaison from "~/components/jaison.vue";

export default {
  components: {
    Card,
    BaseInput,
    BaseButton,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
    jaison
  },

  data(){
    return{
      devices: [
        {
          id: 234234,
          deviceName: "Geranio",
          deviceGroup: "Grupo 1"
        },
        {
          id: 23334,
          deviceName: "Girasol",
          deviceGroup: "Grupo 2"
        },
        {
          id: 2344,
          deviceName: "Albahaca",
          deviceGroup: "Grupo 1"
        },
      ]
    }
  },
  methods: {
    // Metodo para eliminar dispositivo
    eliminarDispositivo(dispositivo){
      console.log("Eliminando dispositivo " + dispositivo.id);
    }
  }
};
</script>

<style>
#tabla{
  /* margin-right: 5%;
  margin-left: 5%; */
}

#tablaDevices{
  padding-left: 2rem;
  padding-right: 2rem;
  padding-block: 20px;
}

#anadirButton{
  padding-top:  1.2rem;
  align-content: center;
  align-self: center;
}



#input {
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  justify-content:auto;
  width: 100%

}

.el-select{
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
