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
    setConfig(state, widgetOptions) {
        console.log(widgetOptions)

        var postion = widgetOptions.position
        var widget = {
            'nombre': widgetOptions.deviceFound.deviceName,
            'deviceId': widgetOptions.deviceFound.deviceId,
            'position': widgetOptions.position,
            'plantId': ""
        }
        state.widgets[postion - 1] = widget;
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

                console.log(widgets)
                // Almacenemos en la variable plantStatusWidgets los resultados
                this.commit('setWidgets', widgets);
            }
        });
    },
    guardarWidget(context, payload) {
        // A esta funcion le llegara un config de un widget concreto. 
        // Desde aqui lo meteremos en el widget global.

        const widgets = this.getters.getWidgets
        console.log(widgets)
        // this.state.widgets[payload.position-1] = payload
        // commit('')

    }

}