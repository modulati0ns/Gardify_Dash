/* Middleware encargado de hacer autologout segun el estado de su token. SOLO SE DEBE EJECUTAR EN PAGINAS DE DENTRO  */
export default function ({
    store,
    redirect
}) {

    // Comprobamos si hay token almacenado en la local storage
    store.dispatch('readToken');

    // Si el usuario no está guardado en el local storage, lo llevamos a login.
    if (!store.state.user) {

        return redirect("/login");


    }
}