document.addEventListener('DOMContentLoaded', function () {

  // ===================== CODE RAIN CANVAS =====================
  const canvas = document.getElementById('code-rain');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;

    const chars = ['0', '1', '{', '}', '<', '>', '/', '/', '=', '>', 'f', 'n', '(', ')', '[', ']', ':', ':'];

    function resizeCanvas() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      columns = Math.floor(width / 20);
      drops = Array(columns).fill(1);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    function drawCodeRain(timestamp) {
      const delta = timestamp - lastTime;
      if (delta >= frameInterval) {
        lastTime = timestamp - (delta % frameInterval);
        ctx.fillStyle = 'rgba(10, 10, 15, 0.06)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '13px JetBrains Mono, monospace';

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * 20;
          const y = drops[i] * 20;
          const opacity = Math.min(1, (height - y) / height * 0.6);
          ctx.fillStyle = `rgba(108, 99, 255, ${opacity})`;
          ctx.fillText(char, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += 1.5;
        }
      }
      requestAnimationFrame(drawCodeRain);
    }

    requestAnimationFrame(drawCodeRain);
  }

  // ===================== TYPEWRITER =====================
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const strings = [
      'Full-Stack Web Developer',
      'Laravel Ecosystem Specialist',
      'ICT Engineering Student @ GEC Bhavnagar'
    ];
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function typeEffect() {
      const currentString = strings[stringIndex];

      if (!isDeleting && !isPaused) {
        typewriterEl.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentString.length) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            typeEffect();
          }, 2000);
          return;
        }
        setTimeout(typeEffect, 50);
      } else if (isDeleting) {
        typewriterEl.textContent = currentString.substring(0, charIndex);
        charIndex--;

        if (charIndex < 0) {
          isDeleting = false;
          stringIndex = (stringIndex + 1) % strings.length;
          setTimeout(typeEffect, 300);
          return;
        }
        setTimeout(typeEffect, 25);
      }
    }

    setTimeout(typeEffect, 600);
  }

  // ===================== NAVBAR SCROLL EFFECT =====================
  const navbar = document.getElementById('navbar');
  let scrolled = false;

  function handleNavScroll() {
    const shouldBeScrolled = window.scrollY > 80;
    if (shouldBeScrolled !== scrolled) {
      scrolled = shouldBeScrolled;
      if (scrolled) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // ===================== INTERSECTION OBSERVER — ACTIVE NAV LINK =====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // ===================== GSAP SCROLLTRIGGER ANIMATIONS =====================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.skill-chip').forEach((chip, i) => {
      gsap.from(chip, {
        scrollTrigger: {
          trigger: chip.closest('.skill-category'),
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        x: -20,
        opacity: 0,
        duration: 0.4,
        delay: i * 0.05,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.progress-fill').forEach(bar => {
      gsap.from(bar, {
        scrollTrigger: {
          trigger: bar.closest('.progress-bar-wrapper'),
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        width: '0%',
        duration: 1.2,
        ease: 'power2.out'
      });
    });

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
      .from('.hero-label', { y: -20, opacity: 0, duration: 0.5 }, 0.2)
      .from('.hero-title', { y: 30, opacity: 0, duration: 0.6 }, 0.35)
      .from('.typewriter-container', { opacity: 0, duration: 0.3 }, 0.6)
      .from('.hero-description', { y: 20, opacity: 0, duration: 0.5 }, 0.7)
      .from('.btn-primary, .btn-secondary', { y: 20, opacity: 0, duration: 0.4, stagger: 0.1 }, 0.85)
      .from('.social-icon', { y: 15, opacity: 0, duration: 0.4, stagger: 0.08 }, 1.0);

    gsap.utils.toArray('.timeline-entry').forEach((entry, i) => {
      const fromVars = {
        scrollTrigger: {
          trigger: entry,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      };
      if (entry.dataset.side === 'left') {
        fromVars.x = -40;
      } else {
        fromVars.x = 40;
      }
      gsap.from(entry.querySelector('.timeline-card'), fromVars);
    });
  }

  // ===================== BACK TO TOP =====================
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===================== ALPINE.JS CONTACT FORM =====================
  if (typeof Alpine !== 'undefined') {
    Alpine.data('contactForm', () => ({
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      submitting: false,
      submitted: false,
      submitForm() {
        if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
          return;
        }
        this.submitting = true;
        setTimeout(() => {
          this.submitting = false;
          this.submitted = true;
          this.form = { name: '', email: '', subject: '', message: '' };
        }, 1500);
      }
    }));
  }

  // ===================== LUCIDE ICONS =====================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
