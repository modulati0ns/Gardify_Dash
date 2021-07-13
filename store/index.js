// Exportar el estado, que a su vez es una funcion flecha. Funciona como una especie de variable global

// Estados = Acciones
export const state = () => ({
    user: null,
    devices: [],
    widgets: [],
});

/* No se puede modificar directamente los valores del estado
   desde cualquier componente. Han de usarse las mutaciones */

// Mutaciones = Setters
// Se llama con commit
export const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    setDevices(state, devices) {
        state.devices = devices;
    },
    setWidgets(state, widgets) {
        state.widgets = widgets;
    },
    setWidget(state, payload) {
        /* Actualizar un indice de un array no es reactivo en Vue, pero mediante la
            funcion Vue.$set, se consigue esta reactividad */
        this._vm.$set(state.widgets, payload.position - 1, payload)
    }

}

export const getters = {
    getUser(state) {
        return state.user;
    },
    getDevices(state) {
        return state.devices;
    },
    getWidgets(state) {
        return state.widgets;
    },

}

// Aciones = Mutaciones + Funciones
// Se llama con dispatch
export const actions = {
    readToken() {

        // Creamos variable usuario
        let user = null;

        // Intentamos recoger el usuario que haya sido guardado en el local storage 
        try {
            user = JSON.parse(localStorage.getItem('user'));

            // Mutacion
            this.commit('setUser', user);
        } catch (error) {
            console.log(error);
        }



    },
    obtenerDispositivos() {
        // La request ha de tener el token del usuario almacenado en el store
        const requestHeader = {
            headers: {
                'token': this.state.user.token
            }
        };
        // Se hace la llamada a la API para obtener la lsita de dispositivos del usuario
        this.$axios
            .get("/gfyapiv1/devices", requestHeader)
            .then((res) => {
                // Si se han recibido los dispositivos correctamente
                if (res.data.status = 'success') {
                    // Almacenemos en la variable devices de la store para que este disponible en toda la pagina
                    this.commit('setDevices', res.data.devices);
                }
            });
    },
    obtenerWidgets() {
        // La request ha de tener el token del usuario almacenado en el store
        const requestHeader = {
            headers: {
                'token': this.state.user.token,
            },
        };
        // Se hace la llamada a la API para obtener el array de plant widgets
        this.$axios.get("/gfyapiv1/plantWidget", requestHeader).then((res) => {
            // Si se ha recibido el array correctamente
            if (res.data.status = 'success') {

                var widgets = [];
                for (var i = 0; i < res.data.widgets.length; i++) {

                    widgets[i] = res.data.widgets[i];

                }

                // Almacenemos en la variable plantStatusWidgets los resultados
                this.commit('setWidgets', widgets);
            }
        });
    },
    guardarWidget(context, widgetOptions) {


        // La request ha de tener el token del usuario almacenado en el store
        const requestHeader = {
            headers: {
                token: this.state.user.token,
            },
        };

        // Se configura el objeto que contiene los datos del nuevo widger
        const newWidget = {
            "deviceId": widgetOptions.deviceFound.deviceId,
            "nombre": widgetOptions.deviceFound.deviceName,
            "plantId": "",
            "position": widgetOptions.position
        }


        // Se añade el objeto a la posicion que le corresponda dentro del array de widgets
        this.commit('setWidget', newWidget);

        // Se forma el cuerpo del request con el nuevo array de widgets formado
        const requestBody = {
            widgets: this.state.widgets,
        };

        // Se ha recebido la señal de guardar los widgets asi que se llama al endpoint para ello
        this.$axios
            .put("/gfyapiv1/plantWidget", requestBody, requestHeader)
            .then((res) => {
                // Si se ha recibido el array correctamente
                if ((res.data.status = "success")) {
                    this._vm.$notify({
                        verticalAlign: "bottom",
                        horizontalAlign: "center",
                        type: "success",
                        icon: "tim-icons icon-check-2",
                        message: "Se ha actualizado el widget correctamente.",
                    });
                } else {
                    this._vm.$notify({
                        verticalAlign: "bottom",
                        horizontalAlign: "center",
                        type: "danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "No se ha podido actualizar el widget. Inténtelo de nuevo.",
                    });
                }
            });



    },
    eliminarWidget(context, widgetOptions) {
        // La request ha de tener el token del usuario almacenado en el store
        const requestHeader = {
            headers: {
                token: this.state.user.token,
            },
        };

        // Se configura el objeto que contiene los datos del nuevo widger
        const newWidget = {
            "deviceId": "",
            "nombre": "",
            "plantId": "",
            "position": widgetOptions.position
        }


        // Se añade el objeto a la posicion que le corresponda dentro del array de widgets
        this.commit('setWidget', newWidget);

        // Se forma el cuerpo del request con el nuevo array de widgets formado
        const requestBody = {
            widgets: this.state.widgets,
        };

        // Se ha recebido la señal de guardar los widgets asi que se llama al endpoint para ello
        this.$axios
            .put("/gfyapiv1/plantWidget", requestBody, requestHeader)
            .then((res) => {
                // Si se ha recibido el array correctamente
                if ((res.data.status = "success")) {
                    this._vm.$notify({
                        verticalAlign: "bottom",
                        horizontalAlign: "center",
                        type: "success",
                        icon: "tim-icons icon-check-2",
                        message: "Se ha eliminado el widget correctamente.",
                    });
                } else {
                    this._vm.$notify({
                        verticalAlign: "bottom",
                        horizontalAlign: "center",
                        type: "danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "No se ha podido eliminar el widget. Inténtelo de nuevo.",
                    });
                }
            });



    }
}