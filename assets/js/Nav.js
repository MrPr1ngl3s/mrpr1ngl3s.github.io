// Función para inyectar el menú en el HTML                 <a href="../" style="font-size: 2.5rem; margin: 5%">&#x2B90;</a>
function createMenu() {
    const menuHTML = `
        <div class="menu">
            <div id="mySidepanel" class="sidepanel">
                <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
                <a href=".." class="bi bi-arrow-return-left"></a>
</a>
                <a href="/">Home</a>
                <a href="https://mrpr1ngl3s.github.io/blog">Blog</a>
            </div>
            <button class="openbtn" onclick="openNav()">☰</button>
        </div>
    `;

    // Insertar el menú en el body o en un contenedor específico
    document.body.insertAdjacentHTML("afterbegin", menuHTML);
}

// Funciones para abrir y cerrar el menú
function openNav() {
    const panel = document.getElementById("mySidepanel");
    if (window.innerWidth <= 1000) {
        panel.style.display = "block";
    } else {
        panel.style.width = "25%";
    }
}

function closeNav() {
    const panel = document.getElementById("mySidepanel");
    if (window.innerWidth <= 1000) {
        panel.style.display = "none";
    } else {
        panel.style.width = "0";
    }
}

// Hacer que las funciones sean accesibles globalmente
window.openNav = openNav;
window.closeNav = closeNav;

// Crear el menú cuando la página haya cargado
document.addEventListener("DOMContentLoaded", createMenu);
