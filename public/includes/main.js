
document.addEventListener('DOMContentLoaded', function() {
  // Preloader
  window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  });

  // Menú móvil
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#nav');
  const navLinks = document.querySelectorAll('.nav-link');
  
  menuToggle.addEventListener('click', function() {
    nav.classList.toggle('active');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-times');
    icon.classList.toggle('fa-bars');
    
    // Animación del icono
    icon.style.transform = 'scale(1.2)';
    setTimeout(() => {
      icon.style.transform = 'scale(1)';
    }, 200);
  });
  
  // Cerrar menú al hacer clic en enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.querySelector('i').classList.remove('fa-times');
      menuToggle.querySelector('i').classList.add('fa-bars');
    });
  });
  
  // Header scroll effect
  const header = document.querySelector('#header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Animaciones al hacer scroll
  const revealElements = document.querySelectorAll('.reveal');
  
  function checkScroll() {
    const triggerBottom = window.innerHeight / 5 * 4;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < triggerBottom) {
        element.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Ejecutar al cargar
  
  // Contador de estadísticas
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;
  
  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 2000;
      const startTime = Date.now();
      
      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);
        
        stat.textContent = value.toLocaleString();
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Efecto al completar
          stat.style.transform = 'scale(1.1)';
          setTimeout(() => {
            stat.style.transform = 'scale(1)';
          }, 200);
        }
      };
      
      updateCounter();
    });
  }
  
  // Activar contador cuando la sección es visible
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
  }
  
  // Efecto hover en tarjetas de contacto
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(card => {
    const icon = card.querySelector('.contact-icon');
    
    card.addEventListener('mouseenter', () => {
      icon.style.transform = 'rotate(15deg) scale(1.1)';
      icon.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
      icon.style.transform = 'rotate(0) scale(1)';
      icon.style.boxShadow = 'none';
    });
  });
  
  // ... (mantén el código existente y reemplaza solo la parte del formulario)

const contactForm = document.getElementById('form-contacto');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');
    const originalBtnText = btnText.textContent;
    
    try {
      submitBtn.disabled = true;
      btnText.textContent = 'Enviando...';
      btnIcon.classList.add('fa-spin');
      
      const formData = {
        name: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        phone: this.querySelector('input[type="tel"]').value,
        service: this.querySelector('select').value,
        message: this.querySelector('textarea').value
      };
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el formulario');
      }
      
      showAlert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.', 'success');
      
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c']
        });
      }
      
      this.reset();
    } catch (error) {
      showAlert(error.message || 'Error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
      console.error('Error:', error);
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = originalBtnText;
      btnIcon.classList.remove('fa-spin');
    }
  });
}
  
  // Mostrar alertas
  function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    // Animación de entrada
    setTimeout(() => {
      alertDiv.style.opacity = '1';
      alertDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        alertDiv.remove();
      }, 300);
    }, 5000);
  }
  
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('#header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Actualizar URL
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });
  
  // Botón "volver arriba"
  const backToTop = document.querySelector('.back-to-top');
  
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
  
  window.addEventListener('scroll', toggleBackToTop);
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Actualizar año en el footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
});