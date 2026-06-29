/* ═══════════════════════════════════════════════
   Happy — Interactive JS
   Particle network background + terminal animation
   ═══════════════════════════════════════════════ */

// ─── Particle Network Background ───
(function () {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const PARTICLE_COUNT = 60;
    const MAX_DISTANCE = 140;
    const MOUSE_RADIUS = 180;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse repulsion
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist < MOUSE_RADIUS) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < MAX_DISTANCE) {
                    const opacity = (1 - dist / MAX_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            // Connect to mouse
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < MOUSE_RADIUS) {
                    const opacity = (1 - dist / MOUSE_RADIUS) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(animate);
    }

    init();
    animate();
})();

// ─── Uptime Counter ───
(function () {
    const startTime = Date.now();
    const uptimeEl = document.getElementById('uptime');
    const footerUptime = document.getElementById('footer-uptime');

    function format(s) {
        const h = String(Math.floor(s / 3600)).padStart(2, '0');
        const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
        const sec = String(s % 60).padStart(2, '0');
        return `${h}:${m}:${sec}`;
    }

    // Simulate a meaningful uptime (add base of ~2 days)
    const baseSeconds = 172800 + Math.floor((Date.now() - startTime) / 1000);

    function update() {
        const elapsed = baseSeconds + Math.floor((Date.now() - startTime) / 1000);
        if (uptimeEl) uptimeEl.textContent = format(elapsed);
        if (footerUptime) footerUptime.textContent = `Online ${format(elapsed)}`;
    }
    update();
    setInterval(update, 1000);
})();

// ─── Number Counter Animation ───
(function () {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const num = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[\d,]/g, '');
                if (!isNaN(num)) {
                    let current = 0;
                    const step = Math.ceil(num / 40);
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= num) {
                            current = num;
                            clearInterval(interval);
                        }
                        el.textContent = current.toLocaleString() + suffix;
                    }, 30);
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
})();

// ─── Terminal Animation ───
(function () {
    const terminalBody = document.getElementById('terminal-body');
    if (!terminalBody) return;

    const lines = [
        { type: 'cmd', text: 'whoami' },
        { type: 'out', text: 'happy — AI Personal Assistant' },
        { type: 'spacer', text: '' },
        { type: 'cmd', text: 'cat /etc/os-release | head -2' },
        { type: 'out', text: 'NAME="Ubuntu 26.04 LTS"\nID=ubuntu' },
        { type: 'spacer', text: '' },
        { type: 'cmd', text: 'gh auth status' },
        { type: 'out', text: '✓ Logged in to github.com as happy-mtenk' },
        { type: 'spacer', text: '' },
        { type: 'cmd', text: 'python3 -c "import fastapi, cv2, torch; print(\'Ready.\')"' },
        { type: 'out-ok', text: 'Ready.' },
        { type: 'spacer', text: '' },
        { type: 'cmd', text: 'echo "Building something cool..."' },
        { type: 'out', text: 'Building something cool...' },
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let currentLineEl = null;
    let typing = false;

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    async function typeLine() {
        if (lineIndex >= lines.length) {
            // Add blinking cursor at the end
            const cursorLine = document.createElement('div');
            cursorLine.className = 'terminal-line';
            cursorLine.innerHTML = '<span class="prompt">happy@vm</span>:<span class="path">~$</span> <span class="cursor"></span>';
            terminalBody.appendChild(cursorLine);
            return;
        }

        const line = lines[lineIndex];

        if (line.type === 'spacer') {
            const spacer = document.createElement('div');
            spacer.className = 'terminal-line';
            spacer.innerHTML = '&nbsp;';
            spacer.style.opacity = '0';
            terminalBody.appendChild(spacer);
            lineIndex++;
            await sleep(100);
            typeLine();
            return;
        }

        if (line.type === 'cmd') {
            const lineEl = document.createElement('div');
            lineEl.className = 'terminal-line';
            lineEl.innerHTML = '<span class="prompt">happy@vm</span>:<span class="path">~$</span> <span class="cmd"></span>';
            terminalBody.appendChild(lineEl);
            currentLineEl = lineEl.querySelector('.cmd');
            charIndex = 0;

            async function typeChar() {
                if (charIndex < line.text.length) {
                    currentLineEl.textContent += line.text[charIndex];
                    charIndex++;
                    await sleep(30 + Math.random() * 40);
                    typeChar();
                } else {
                    await sleep(300);
                    lineIndex++;
                    typeLine();
                }
            }
            typeChar();
        } else if (line.type === 'out' || line.type === 'out-ok') {
            const lineEl = document.createElement('div');
            lineEl.className = 'terminal-output';
            if (line.type === 'out-ok') {
                lineEl.innerHTML = `<span class="ok">${line.text}</span>`;
            } else {
                lineEl.textContent = line.text;
            }
            lineEl.style.opacity = '0';
            lineEl.style.transition = 'opacity 0.3s ease';
            terminalBody.appendChild(lineEl);
            await sleep(50);
            lineEl.style.opacity = '1';
            await sleep(400);
            lineIndex++;
            typeLine();
        }
    }

    // Start typing when terminal is visible
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !typing) {
                typing = true;
                // Clear the placeholder
                terminalBody.innerHTML = '';
                typeLine();
            }
        });
    }, { threshold: 0.3 });

    terminalObserver.observe(terminalBody);
})();

// ─── Scroll Reveal ───
(function () {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Add reveal class to sections
    document.querySelectorAll('.section').forEach(s => {
        s.classList.add('reveal');
        revealObserver.observe(s);
    });
})();

// ─── Smooth Scroll on Link Click ───
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

// ─── Tilt Effect on Cards ───
(function () {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rx = (y - cy) / cy * -3;
            const ry = (x - cx) / cx * 3;
            card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();