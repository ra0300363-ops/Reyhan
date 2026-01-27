document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. BACKGROUND FLUID ANIMATION (PARTICLES)
       ========================================= */
    const canvas = document.getElementById('fluid-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // Mouse Tracking
    let mouse = { x: width / 2, y: height / 2 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 5 + 1; // Ukuran bervariasi
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            // Warna Cyan ke Ungu (HSL)
            this.hue = Math.random() * 60 + 180; 
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Memantul jika kena pinggir layar
            if (this.x > width || this.x < 0) this.speedX *= -1;
            if (this.y > height || this.y < 0) this.speedY *= -1;

            // Interaksi Mouse (Partikel menjauh sedikit jika mouse mendekat)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * 1;
                this.y -= Math.sin(angle) * 1;
            }
        }

        draw() {
            ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 0.8)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Efek Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 1)`;
        }
    }

    // Buat 40 partikel
    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height); // Hapus frame lama
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();


    /* =========================================
       2. NAVIGASI MAGIC LINE (GARIS BERGERAK)
       ========================================= */
    const marker = document.getElementById('nav-marker');
    const navItems = document.querySelectorAll('.nav-item');

    function moveMarker(element) {
        if(element) {
            marker.style.width = element.offsetWidth + 'px';
            marker.style.left = element.offsetLeft + 'px';
        }
    }

    navItems.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            moveMarker(e.target);
        });
    });

    const navContainer = document.querySelector('.nav-links');
    navContainer.addEventListener('mouseleave', () => {
        const active = document.querySelector('.nav-item.active');
        moveMarker(active);
    });

    // Set posisi awal marker
    window.onload = () => {
        const active = document.querySelector('.nav-item.active');
        moveMarker(active);
    };

    // Update active class saat scroll (ScrollSpy)
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
                // Pindahkan marker ke menu yang sedang aktif
                if (!navContainer.matches(':hover')) {
                    moveMarker(link);
                }
            }
        });
    });


    /* =========================================
       3. UTILS: SCROLL REVEAL & MOBILE MENU
       ========================================= */
    
    // Scroll Reveal (Muncul pelan-pelan)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        // Ganti icon burger ke silang
        const icon = menuToggle.querySelector('i');
        if(mobileMenu.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Tutup menu mobile jika link diklik
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });
});
