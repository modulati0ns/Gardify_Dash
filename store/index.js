// Exportar el estado, que a su vez es una funcion flecha. Funciona como una especie de variable global
export const state = () => ({
    user: null,
    devices: [],
});

/* No se puede modificar directamente los valores del estado
   desde cualquier componente. Han de usarse las mutaciones */

export const mutations = {
    setUser(state, user) {
        state.user = user;
    }
}