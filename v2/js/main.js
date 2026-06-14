document.addEventListener('DOMContentLoaded', function () {

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1800);
    window.addEventListener('load', function () {
      setTimeout(() => loader.classList.add('hidden'), 500);
    });
  }

  // ===== SCROLL PROGRESS =====
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = Math.min(progress, 100) + '%';
    });
  }

  // ===== HERO PARTICLES =====
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
      particle.style.opacity = 0.1 + Math.random() * 0.3;
      particle.style.animation = `floatParticle ${8 + Math.random() * 12}s ease-in-out ${Math.random() * 5}s infinite`;
      particlesContainer.appendChild(particle);
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translate(0, 0); opacity: 0.2; }
        25% { transform: translate(${10 + Math.random() * 30}px, ${-20 - Math.random() * 20}px); opacity: 0.5; }
        50% { transform: translate(${20 + Math.random() * 40}px, ${10 + Math.random() * 20}px); opacity: 0.3; }
        75% { transform: translate(${-10 - Math.random() * 20}px, ${-10 - Math.random() * 30}px); opacity: 0.4; }
      }
    `;
    particlesContainer.appendChild(style);
  }

  // ===== RADAR CHART =====
  const radarCanvas = document.getElementById('radar-chart');
  if (radarCanvas) {
    const ctx = radarCanvas.getContext('2d');
    const labels = ['PHP', 'MySQL', 'Livewire', 'JavaScript', 'Flask', 'FastAPI'];
    const values = [90, 85, 80, 75, 60, 70];
    const cx = 200, cy = 200, r = 150;
    const levels = 5;

    function drawRadar(progress) {
      ctx.clearRect(0, 0, 400, 400);

      for (let level = 1; level <= levels; level++) {
        const ratio = level / levels;
        ctx.beginPath();
        for (let i = 0; i < labels.length; i++) {
          const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
          const x = cx + r * ratio * Math.cos(angle);
          const y = cy + r * ratio * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(37,99,235,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < labels.length; i++) {
        const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
        const x = cx + (r + 20) * Math.cos(angle);
        const y = cy + (r + 20) * Math.sin(angle);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted').trim() || '#71717A';
        ctx.font = '12px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[i], x, y);
      }

      const p = progress == null ? 1 : Math.min(progress, 1);
      const easeProgress = 1 - Math.pow(1 - p, 3);

      ctx.beginPath();
      for (let i = 0; i < labels.length; i++) {
        const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
        const val = (values[i] / 100) * r * easeProgress;
        const x = cx + val * Math.cos(angle);
        const y = cy + val * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(37,99,235,0.2)';
      ctx.fill();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2;
      ctx.stroke();

      for (let i = 0; i < labels.length; i++) {
        const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
        const val = (values[i] / 100) * r * easeProgress;
        const x = cx + val * Math.cos(angle);
        const y = cy + val * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#2563EB';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let start = null;
            function animRadar(timestamp) {
              if (!start) start = timestamp;
              const elapsed = timestamp - start;
              const progress = Math.min(elapsed / 1500, 1);
              drawRadar(progress);
              if (progress < 1) requestAnimationFrame(animRadar);
            }
            requestAnimationFrame(animRadar);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(radarCanvas);
    } else {
      drawRadar(1);
    }

    window.addEventListener('resize', () => drawRadar(1));
  }

  // ===== GSAP FALLBACK — show all reveal elements if GSAP fails =====
  setTimeout(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }, 3000);

  // ===== SCROLL ANIMATIONS (GSAP) =====
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

    gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
      gsap.from(bar, {
        scrollTrigger: {
          trigger: bar.closest('.skill-bar-label'),
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        width: '0%',
        duration: 1.2,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.counter').forEach(counter => {
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        onEnter: function () {
          const target = parseInt(counter.dataset.target);
          let current = 0;
          const step = Math.ceil(target / 30);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            counter.textContent = current;
          }, 40);
        }
      });
    });
  }

  // ===== PROJECT FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;

        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category.includes(filter)) {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.transition = 'opacity 300ms ease';
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.transition = 'opacity 300ms ease';
            card.style.opacity = '0';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // ===== LUCIDE ICONS =====
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
