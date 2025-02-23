let tiltElements = document.querySelectorAll(".rounded");

// Verificar si la pantalla es lo suficientemente grande para aplicar el efecto
if (!window.matchMedia("(max-width: 768px)").matches) {
  // Solo inicializar VanillaTilt si la pantalla no es móvil (ancho máximo de 768px)
  VanillaTilt.init(tiltElements, {
    max: 3,
    speed: 500,
    scale: 1.05,
    glare: true,
    "max-glare": 0.3,
  });
}