/* Middleware encargado de hacer autologout segun el estado de su token. SOLO SE DEBE EJECUTAR EN PAGINAS DE FUERA  */
export default function ({
    store,
    redirect
}) {

    // Comprobamos si hay token almacenado en la local storage
    store.dispatch('readToken');

    // Si esta el usuario guardado en la memoria intera lo llevamos a dashboard
    if (store.state.user) {

        return redirect("/");


    }
}