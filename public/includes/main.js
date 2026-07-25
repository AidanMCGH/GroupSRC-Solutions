/* Grupo SRC Solutions — interacciones mínimas
   Sin librerías. Solo lo necesario: menú, animaciones de aparición y formulario. */

document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------- Menú móvil */
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');

  if (toggle && navList) {
    const setOpen = (open) => {
      navList.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    toggle.addEventListener('click', () => setOpen(!navList.classList.contains('open')));
    navList.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  /* -------------------------------- Header: transparente en el hero, sólido al salir */
  const header = document.querySelector('.site-header');
  const hero = document.getElementById('inicio');
  if (header && hero && 'IntersectionObserver' in window) {
    const headerObs = new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '-64px 0px 0px 0px', threshold: 0 });
    headerObs.observe(hero);
  } else if (header) {
    // Reserva sin IntersectionObserver
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------- Animaciones de aparición */
  const reveals = document.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  /* ------------------------------ Videos de demostración (play solo en pantalla) */
  const videos = document.querySelectorAll('.obra-video');
  if (videos.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      // Sin autoplay: el usuario decide reproducir
      videos.forEach((v) => { v.controls = true; v.preload = 'metadata'; });
    } else {
      const vio = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting) {
            v.play().catch(() => { v.controls = true; }); // si el navegador bloquea el autoplay, mostramos controles
          } else {
            v.pause();
          }
        });
      }, { threshold: 0.4 });
      videos.forEach((v) => vio.observe(v));
    }
  }

  /* ----------------------------------------------------------- Formulario */
  const form = document.getElementById('form-contacto');
  if (form) {
    const estado = form.querySelector('.form-estado');
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');

    const campos = {
      nombre:  { el: form.querySelector('#nombre'),  err: form.querySelector('#err-nombre') },
      correo:  { el: form.querySelector('#correo'),  err: form.querySelector('#err-correo') },
      mensaje: { el: form.querySelector('#mensaje'), err: form.querySelector('#err-mensaje') },
    };
    const empresa = form.querySelector('#empresa');

    const setError = (campo, msg) => {
      campo.err.textContent = msg || '';
      campo.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };

    const validar = () => {
      let primerError = null;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!campos.nombre.el.value.trim()) {
        setError(campos.nombre, 'Escriba su nombre.');
        primerError = primerError || campos.nombre.el;
      } else setError(campos.nombre, '');

      const correo = campos.correo.el.value.trim();
      if (!correo) {
        setError(campos.correo, 'Escriba su correo.');
        primerError = primerError || campos.correo.el;
      } else if (!emailOk.test(correo)) {
        setError(campos.correo, 'Revise el formato del correo.');
        primerError = primerError || campos.correo.el;
      } else setError(campos.correo, '');

      if (!campos.mensaje.el.value.trim()) {
        setError(campos.mensaje, 'Cuéntenos brevemente qué necesita.');
        primerError = primerError || campos.mensaje.el;
      } else setError(campos.mensaje, '');

      return primerError;
    };

    // Limpia el error de un campo mientras el usuario lo corrige
    Object.values(campos).forEach((c) => {
      c.el.addEventListener('input', () => { if (c.el.getAttribute('aria-invalid') === 'true') setError(c, ''); });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      estado.textContent = '';
      estado.removeAttribute('data-tipo');

      const primerError = validar();
      if (primerError) { primerError.focus(); return; }

      // El backend espera { name, email, phone, service, message }.
      // Mantenemos ese contrato intacto: "empresa" se antepone al mensaje
      // y "service" lleva un valor fijo para no modificar la API.
      const mensajeUsuario = campos.mensaje.el.value.trim();
      const nombreEmpresa = empresa && empresa.value.trim();
      const payload = {
        name: campos.nombre.el.value.trim(),
        email: campos.correo.el.value.trim(),
        phone: '',
        service: 'Consulta general',
        message: nombreEmpresa ? `Empresa: ${nombreEmpresa}\n\n${mensajeUsuario}` : mensajeUsuario,
      };

      const textoOriginal = btnText.textContent;
      btn.disabled = true;
      btnText.textContent = 'Enviando…';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'No pudimos enviar el mensaje.');

        form.reset();
        estado.setAttribute('data-tipo', 'ok');
        estado.textContent = 'Mensaje enviado. Le responderemos pronto.';
      } catch (err) {
        estado.setAttribute('data-tipo', 'error');
        estado.textContent = (err && err.message) || 'Ocurrió un error. Intente de nuevo o escríbanos por correo.';
      } finally {
        btn.disabled = false;
        btnText.textContent = textoOriginal;
      }
    });
  }

  /* ------------------------------------------------------- Año del footer */
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
});
