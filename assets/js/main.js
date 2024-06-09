document.addEventListener("DOMContentLoaded", function() { new SweetScroll({}); particlesJS("particles-js", {"particles": {"number": {"value":30, "density": {"enable": true, "value_area": 800}}, "color": {"value": "#ff0000"}, "shape": {"type": "circle", "stroke": {"width": 3, "color": "#000000"}, "polygon": {"nb_sides": 3}, "image": {"src": "img/github.svg", "width": 100, "height": 100}}, "opacity": {"value": 0.70, "random": false, "anim": {"enable": false, "speed": 1, "opacity_min": 0.1, "sync": false}}, "size": {"value": 3, "random": true, "anim": {"enable": false, "speed": 40, "size_min": 0.1, "sync": false}}, "line_linked": {"enable": true, "distance": 256.54592973848366, "color": "#ff0000", "opacity": 0.4, "width": 1}, "move": {"enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": {"enable": false, "rotateX": 600, "rotateY": 1200}}}, "interactivity": {"detect_on": "canvas", "events": {"onhover": {"enable": true, "mode": "grab"}, "onclick": {"enable": false, "mode": "repulse"}, "resize": true}, "modes": {"grab": {"distance": 400, "line_linked": {"opacity": 1}}, "bubble": {"distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3}, "repulse": {"distance": 200, "duration": 0.4}, "push": {"particles_nb": 4}, "remove": {"particles_nb": 2}}}, "retina_detect": true}); var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update); });

;
$(function(){
    $('a[href*=#]').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
        && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body').animate({scrollTop: targetOffset}, 800);
                return false;
            }
        }
    });
});
var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `
        @keyframes blink {
            0% { border-color: #960000; }
            50% { border-color: transparent; }
            100% { border-color: #960000; }
        }
        .typewrite > .wrap {
            border-right: 0.08em solid #960000;
            animation: blink 1s infinite; /* Aplicamos la animación de parpadeo */
        }
    `;
    document.body.appendChild(css);
    }
