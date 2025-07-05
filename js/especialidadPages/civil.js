
(() => {

    const tbodyCivil = document.getElementById("tbody-alumnos-civil");
    const formUpdate = document.getElementById("form-update");
    const formInsert = document.getElementById("form-insert");

    const dibujarTabla = () => {

        fetch(window.SERVICIOURL + `/apiMetodologia/civil.php`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)

                tbodyCivil.innerHTML = "";
                data.map(item => {
                    const fila = `
                        <tr data-id="${item.id}"> 
                            <td>${item.nombre_alumno}</td>
                            <td>${item.tema}</td>
                            <td>
                                <a href="${item.ruta_informe}" target="_blank" download title="Descargar informe">
                                    <i class="bi bi-file-earmark-word-fill fs-5 text-primary"></i>
                                </a>
                            </td>
                            <td>${item.especialidad}</td>
                            <td> <i class="bi bi-pencil icono-editar" title="editar director" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-Update"> </i> </td>
                            <td> <i class="bi bi-x-square icono-eliminar" title="eliminar director"> </i> </td>
                        </tr>
                    `
                    tbodyCivil.innerHTML += fila;
                })

                tbodyCivil.querySelectorAll(".icono-editar").forEach((iconoEditar, index) => {
                    iconoEditar.addEventListener("click", () => {
                        document.getElementById("updateId").value = data[index].id;
                        document.getElementById("updateNombre").value = data[index].nombre_alumno;
                        document.getElementById("updateTema").value = data[index].tema;
                        console.log(data[index].tema)
                    })
                })
            })
    }

    dibujarTabla();

    const insertAlumno = (event) => {
        event.preventDefault();
        const formData = new FormData(formInsert);

        fetch(window.SERVICIOURL + `/apiMetodologia/civil.php`, {
                method: "POST",
                body: formData
            })
            .then((response) => response.json()) // ⚠️ ya que tu PHP devuelve JSON
            .then(data => {
                console.log("Respuesta del servidor:", data);
                if (data.success) {
                    dibujarTabla();
                    formInsert.reset();
                    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasRight'));
                    if (offcanvas) offcanvas.hide();
                } else {
                    alert("Error al guardar: " + (data.mensaje || "Desconocido"));
                }
            })
            .catch(err => {
                console.error("Error en la solicitud:", err);
                alert("No se pudo guardar el alumno.");
            });
    };


    const updateAlumno = (event) => {
        event.preventDefault();
        const formData = new FormData(formUpdate);

        fetch(window.SERVICIOURL + `/apiMetodologia/civil.php`, {
                method: "POST",
                body: formData
            })
            .then((response) => response.text())
            .then(data => {
                console.log(data);
                dibujarTabla();
                formUpdate.reset();
                document.querySelector("#offcanvas-Update .btn-close").click();
            })
    }

    formInsert.addEventListener("submit", (event) =>
        insertAlumno(event)
    );


    formUpdate.addEventListener("submit", (event) =>
        updateAlumno(event)
    );

    const modalHTML = `
            <div class="modal fade" id="modalEliminar" tabindex="-1" aria-labelledby="modalEliminarLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalEliminarLabel">Confirmar Eliminación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ¿Estás seguro de que deseas eliminar este alumno? Su informe también será eliminado del servidor.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="btnConfirmarEliminar">Eliminar</button>
                </div>
                </div>
            </div>
            </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    let idAlumnoAEliminar = null;

    // 3. Delegar el evento de clic en iconos de eliminar
    tbodyCivil.addEventListener("click", (e) => {
        if (e.target.classList.contains("icono-eliminar")) {
            const fila = e.target.closest("tr");
            const index = [...tbodyCivil.rows].indexOf(fila);

            fetch(window.SERVICIOURL + `/apiMetodologia/civil.php`)
                .then(res => res.json())
                .then(data => {
                    idAlumnoAEliminar = data[index].id;
                    const modal = new bootstrap.Modal(document.getElementById("modalEliminar"));
                    modal.show();
                });
        }
    });

    document.getElementById("btnConfirmarEliminar").addEventListener("click", () => {
        if (!idAlumnoAEliminar) return;

        const formData = new FormData();
        formData.append("_method", "DELETE");
        formData.append("id", idAlumnoAEliminar);

        fetch(`${window.SERVICIOURL}/apiMetodologia/civil.php`, {
                method: "POST",
                body: formData
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Eliminado:", data);
                if (data.success) {
                    dibujarTabla();
                    bootstrap.Modal.getInstance(document.getElementById("modalEliminar")).hide();
                    idAlumnoAEliminar = null;
                } else {
                    alert("No se pudo eliminar el alumno.");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Error al eliminar.");
            });
    });


    setTimeout(() => {
        const btn = document.getElementById("btn-volver");
        if (btn) {
            btn.addEventListener("click", () => {
                if (typeof loadPage === "function") {
                    loadPage("pages/navbarPages/home.html", "js/navbarPages/home.js");
                } else {
                    console.error("No se encontró la función loadPage.");
                }
            });
        } else {
            console.warn("No se encontró el botón #btn-volver");
        }
    }, 50); // 50 ms suele ser suficiente

})()