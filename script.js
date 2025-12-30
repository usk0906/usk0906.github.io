/* ==========================================================================
    UDESAKEN SYSTEM 2026 ®
    Lógica Principal do Site
   ========================================================================== */

// --- FORÇAR ROLAGEM AO TOPO AO CARREGAR ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
    checkCookies(); // Verifica cookies ao carregar
}

// --- IMPORTAÇÕES DO FIREBASE (MANTENDO AS SUAS) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- SUA CONFIGURAÇÃO (NÃO ALTERADA) ---
const firebaseConfig = {
  apiKey: "AIzaSyDwtSWC3I0XcfsvnAdzlsMVOiv6n5qkH0Q",
  authDomain: "udesaken-system.firebaseapp.com",
  projectId: "udesaken-system",
  storageBucket: "udesaken-system.firebasestorage.app",
  messagingSenderId: "85407769934",
  appId: "1:85407769934:web:f5152f2785540733662a1f"
};

// INICIALIZANDO O SISTEMA
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- 1. CONTADOR DE VISUALIZAÇÕES (FIREBASE) ---
async function carregarEstatisticas() {
    // Tenta atualizar a view APENAS se estiver na página inicial para economizar leituras
    // ou se tiver um elemento contador na tela
    const viewCounter = document.querySelector('.stat h3[data-target="1200000"]');
    
    if(!viewCounter) return; // Se não tem contador na tela, não faz nada

    const docRef = doc(db, "site_dados", "geral");
    
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, { visualizacoes: increment(1) });
            const dadosAtualizados = (await getDoc(docRef)).data();
            atualizarTela(dadosAtualizados.visualizacoes);
        } else {
            await setDoc(docRef, { visualizacoes: 1200000 });
            atualizarTela(1200000);
        }
    } catch (error) {
        console.log("Modo offline ou erro no banco:", error);
    }
}

function atualizarTela(numero) {
    const viewCounter = document.querySelector('.stat h3[data-target="1200000"]');
    if(viewCounter) {
        viewCounter.innerText = "+" + numero.toLocaleString('pt-BR');
        viewCounter.removeAttribute('data-target');
    }
}

// Executa stats
carregarEstatisticas();


// --- 2. LÓGICA DE INTERFACE (UI) ---

// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const closeBtn = document.querySelector('.close-btn-mobile');
const icon = hamburger ? hamburger.querySelector('i') : null;

if(hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if(icon) icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
}

if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if(icon) icon.className = 'fas fa-bars';
    });
}

// Fechar menu ao clicar num link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if(icon) icon.className = 'fas fa-bars';
    });
});

// Animação de Scroll (Fade In)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
});
document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));


// --- 3. SISTEMA DE ÁUDIO ---
window.toggleMusic = function() {
    const audio = document.getElementById('bg-audio');
    const btn = document.querySelector('.music-btn');
    const icon = document.getElementById('music-icon');

    try { audio.volume = 0.1; } catch (e) {}

    if (audio.paused) {
        audio.play().then(() => {
            btn.classList.add('playing');
            btn.title = "Pausar";
            if(icon) icon.className = ''; // Remove ícone se quiser, ou muda pra 'fa-pause'
        }).catch(error => {
            console.log("Erro áudio:", error);
            alert("Toque na tela para permitir o áudio!");
        });
    } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.title = "Tocar";
        if(icon) icon.className = 'fas fa-volume-mute';
    }
}

// Pausa inteligente ao sair da aba
document.addEventListener("visibilitychange", function() {
    const audio = document.getElementById('bg-audio');
    const btn = document.querySelector('.music-btn');
    if (document.hidden && !audio.paused) {
        audio.pause();
    } else if (!document.hidden && btn && btn.classList.contains('playing')) {
        audio.play().catch(e => {});
    }
});


// --- 4. SISTEMA DE COOKIES ---
function checkCookies() {
    if (!localStorage.getItem('udesaken_cookies')) {
        setTimeout(() => {
            const banner = document.getElementById('cookie-banner');
            if(banner) banner.classList.add('show-cookie');
        }, 2000);
    }
}

window.aceitarCookies = function() {
    localStorage.setItem('udesaken_cookies', 'true');
    const banner = document.getElementById('cookie-banner');
    if(banner) banner.classList.remove('show-cookie');
}


// --- 5. LÓGICA DE ABAS (TABS) ---
// Usada na página principal antiga se ainda existir, ou em seções futuras
window.switchTab = function(tabName) {
    // Remove active de tudo
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    // Ativa o clicado
    event.currentTarget.classList.add('active');
    
    const target = document.getElementById('tab-' + tabName);
    if(target) {
        target.style.display = 'flex';
        // Pequeno delay para o CSS transition pegar o opacity
        setTimeout(() => target.classList.add('active'), 10);
    }
}


// --- 6. PROTEÇÃO DE MARCA ---
const estiloTitulo = "color: #8a2be2; font-size: 30px; font-weight: bold; text-shadow: 0 0 10px #8a2be2;";
console.log("%c UDESAKEN 2026 ", estiloTitulo);
console.log("Sistema carregado. Versão: 4.0 (Gold Edition)");