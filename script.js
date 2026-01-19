/* ==========================================================================
    UDESAKEN SYSTEM - Lógica de Animação e Interação
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. ANIMAÇÃO DE SCROLL (Entrada suave dos elementos)
    const scrollOptions = {
        threshold: 0.15, // Dispara quando 15% do elemento aparece
        rootMargin: "0px 0px -50px 0px" // Começa a animar um pouco antes
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Para de observar depois que anima
            }
        });
    }, scrollOptions);

    // Seleciona todos os blocos que devem animar
    document.querySelectorAll('.animate-block').forEach(el => {
        scrollObserver.observe(el);
    });


    // 2. MENU MOBILE
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeBtn = document.querySelector('.close-btn-mobile');
    const links = document.querySelectorAll('.nav-links a');

    function toggleMenu() { navLinks.classList.toggle('active'); }
    function closeMenu() { navLinks.classList.remove('active'); }

    if(hamburger) hamburger.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));


    // 3. PARTÍCULAS (Fundo animado)
    const container = document.body;
    const particleCount = 25; // Mais partículas

    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('hk-particle');
        if (Math.random() > 0.5) p.classList.add('bow'); // 50% chance de ser laço

        const startX = Math.random() * 100; 
        const size = Math.random() * 6 + 4; // Partículas um pouco maiores
        
        p.style.left = `${startX}%`;
        p.style.width = `${size}px`; p.style.height = `${size}px`;
        
        // Animação mais dinâmica
        const duration = Math.random() * 20 + 10;
        p.style.animation = `floatUp ${duration}s linear infinite`;
        p.style.animationDelay = `-${Math.random() * 20}s`;

        container.appendChild(p);
    }

    for(let i = 0; i < particleCount; i++) createParticle();
});