"use strict"
window.SERVICIOURL = "https://nexttravel.site/metodologiaInvestigacion";

const logoNavbarBrand = document.getElementById("logo-navbar-brand");
const mainContent = document.getElementById("main-content");
//const menuLeft = document.getElementById("menu-left");
const menuRight = document.getElementById("menu-rigth");

const menuDataLeft = [{
        label: "Inicio",
        url: "pages/navbarPages/home.html",
        script: "js/navbarPages/home.js"
    },
    {
        label: "Curso",
        url: "pages/navbarPages/curso.html",
        script: "js/navbarPages/curso.js"
    },
    {
        label: "Docente",
        url: "pages/navbarPages/docente.html",
        script: "js/navbarPages/docente.js"
    },
    {
        label: "Login",
        url: "pages/navbarPages/login.html",
        script: "js/navbarPages/login.js"
    }
]


menuDataLeft.forEach(item => {
    const li = document.createElement("li");
    li.className = "nav-item";

    const link = document.createElement("a");
    link.className = "nav-link";

    link.href = "#";
    link.innerHTML = `${item.icon ? `<i class="${item.icon}"></i> ` : ""}${item.label}`;

    link.addEventListener("click", (e) => {
        e.preventDefault();
        loadPage(item.url, item.script);
    });

    li.appendChild(link);
    menuRight.appendChild(li);
})


const loadPage = (itemUrl, itemScript) => {
    fetch(itemUrl)
        .then((response) => response.text())
        .then((data) => {
            mainContent.innerHTML = data;
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (itemScript) {
                const existingScript = document.querySelector(`script[src="${itemScript}"]`);
                if (existingScript) existingScript.remove();

                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = itemScript;
                document.body.appendChild(script); // mejor fuera de mainContent
            }
        });
};

const Volver = () => history.back();

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-volver");
    if (btn) btn.addEventListener("click", Volver);
});


logoNavbarBrand.addEventListener("click", () => {
    loadPage("pages/navbarPages/home.html", "js/navbarPages/home.js");
});

logoNavbarBrand.click();