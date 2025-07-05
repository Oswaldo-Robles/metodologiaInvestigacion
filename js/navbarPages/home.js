document.querySelectorAll(".especialidad-card").forEach(card => {
    card.addEventListener("click", () => {
        const especialidad = card.dataset.especialidad;

        // Define rutas basadas en la especialidad
        const htmlPath = `pages/especialidadPages/${especialidad}.html`;
        const jsPath = `js/especialidadPages/${especialidad}.js`;

        // Carga la página y el script usando tu función global
        if (typeof loadPage === "function") {
            loadPage(htmlPath, jsPath);
        } else {
            console.error("loadPage no está disponible");
        }
    });
});
