/* ==========================================================================
    UDESAKEN SYSTEM - Logic & Animations (Luxury Edition)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. SISTEMA DE ANIMAÇÃO AO ROLAR (SCROLL REVEAL)
    // Detecta quando os elementos aparecem na tela para animar
    const observerOptions = {
        threshold: 0.15, // Ativa quando 15% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe que faz o elemento aparecer (definida no CSS novo)
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, observerOptions);

    // Seleciona todas as classes de animação novas
    const animatedElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom, .reveal-zoom, .reveal-fade');
    animatedElements.forEach(el => scrollObserver.observe(el));


    // 2. MENU MOBILE (Gaveta Lateral)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeBtn = document.querySelector('.close-btn-mobile');
    const links = document.querySelectorAll('.nav-links a');

    function toggleMenu() { navLinks.classList.toggle('active'); }
    function closeMenu() { navLinks.classList.remove('active'); }

    if(hamburger) hamburger.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);
    // Fecha o menu ao clicar em qualquer link
    links.forEach(link => link.addEventListener('click', closeMenu));


    // 3. PARTÍCULAS HELLO KITTY (Fundo Animado)
    const container = document.body;
    const particleCount = 20; // Quantidade de partículas

    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('hk-particle');
        
        // 50% de chance de ser um laço (bow), 50% brilho
        if (Math.random() > 0.5) p.classList.add('bow');

        const startX = Math.random() * 100; // Posição horizontal aleatória
        const size = Math.random() * 6 + 4; // Tamanho entre 4px e 10px
        
        p.style.left = `${startX}%`;
        p.style.width = `${size}px`; 
        p.style.height = `${size}px`;
        
        // Duração aleatória para não ficar repetitivo
        const duration = Math.random() * 20 + 10;
        p.style.animation = `floatUp ${duration}s linear infinite`;
        p.style.animationDelay = `-${Math.random() * 20}s`;

        container.appendChild(p);
    }

    // Cria as partículas
    for(let i = 0; i < particleCount; i++) {
        createParticle();
    }


    // 4. LÓGICA DO BANNER DE COOKIES
    const cookieBanner = document.getElementById('cookieBanner');
    const btnAccept = document.getElementById('btnAccept');

    // Se não tiver aceito ainda, mostra o banner após 2 segundos
    if (!localStorage.getItem('udesaken_cookies')) {
        setTimeout(() => { 
            if(cookieBanner) cookieBanner.classList.add('active'); 
        }, 2000);
    }

    if(btnAccept) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem('udesaken_cookies', 'accepted');
            if(cookieBanner) cookieBanner.classList.remove('active');
        });
    }


    // 5. WIDGET DE MÚSICA
    const audio = document.getElementById('bg-audio');
    const btnMusic = document.querySelector('.music-btn');
    const iconMusic = document.getElementById('music-icon');

    // Define volume baixo inicial
    if(audio) audio.volume = 0.05;

    // Função global para ser chamada pelo onclick do HTML
    window.toggleMusic = function() {
        if(!audio) return;
        
        if (audio.paused) {
            audio.play().then(() => {
                // Atualiza visual para "Tocando"
                if(btnMusic) btnMusic.classList.add('playing');
                if(iconMusic) iconMusic.className = ''; // Remove ícone de mudo, mostra ondas
            }).catch(e => console.log("Interação necessária para tocar áudio"));
        } else {
            audio.pause();
            // Atualiza visual para "Pausado"
            if(btnMusic) btnMusic.classList.remove('playing');
            if(iconMusic) iconMusic.className = 'fas fa-volume-mute';
        }
    }
});