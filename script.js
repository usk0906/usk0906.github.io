/* ==========================================================================
    UDESAKEN SYSTEM 2026 ®
    Apenas Lógica de Banco de Dados (Firebase)
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwtSWC3I0XcfsvnAdzlsMVOiv6n5qkH0Q",
  authDomain: "udesaken-system.firebaseapp.com",
  projectId: "udesaken-system",
  storageBucket: "udesaken-system.firebasestorage.app",
  messagingSenderId: "85407769934",
  appId: "1:85407769934:web:f5152f2785540733662a1f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- CONTADOR DE VISUALIZAÇÕES ---
async function carregarEstatisticas() {
    const viewCounter = document.querySelector('.stat h3[data-target="1200000"]');
    if(!viewCounter) return; 

    const docRef = doc(db, "site_dados", "geral");
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await updateDoc(docRef, { visualizacoes: increment(1) });
            atualizarTela(docSnap.data().visualizacoes + 1);
        } else {
            await setDoc(docRef, { visualizacoes: 1200000 });
            atualizarTela(1200000);
        }
    } catch (error) {
        console.log("Offline/Erro:", error);
    }
}

function atualizarTela(numero) {
    const viewCounter = document.querySelector('.stat h3[data-target="1200000"]');
    if(viewCounter) {
        viewCounter.innerText = "+" + numero.toLocaleString('pt-BR');
    }
}

carregarEstatisticas();

// --- LÓGICA DE MÚSICA CONTÍNUA (RESUME) ---
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-audio');
    const btn = document.querySelector('.music-btn');
    const icon = document.getElementById('music-icon');

    // 1. AJUSTE DE VOLUME (AMBIENTE DE MERCADO)
    if(audio) {
        audio.volume = 0.05; // 5% de volume (bem baixinho)
    }

    // Função global para o botão funcionar
    window.toggleMusic = function() {
        if(!audio) return;
        // Garante que o volume continue baixo ao clicar
        try { audio.volume = 0.05; } catch (e) {} 

        if (audio.paused) {
            audio.play().then(() => {
                atualizarIcone(true);
                localStorage.setItem('udesaken_music_status', 'playing');
            }).catch(e => console.log("Interação necessária"));
        } else {
            audio.pause();
            atualizarIcone(false);
            localStorage.setItem('udesaken_music_status', 'paused');
        }
    }

    function atualizarIcone(tocando) {
        if(!btn || !icon) return;
        if (tocando) {
            btn.classList.add('playing');
            btn.title = "Pausar";
            icon.className = ''; 
        } else {
            btn.classList.remove('playing');
            btn.title = "Tocar";
            icon.className = 'fas fa-volume-mute';
        }
    }

    // 2. RECUPERAR ONDE PAROU
    if (audio) {
        const savedTime = localStorage.getItem('udesaken_music_time');
        const status = localStorage.getItem('udesaken_music_status');

        if (savedTime) audio.currentTime = parseFloat(savedTime);

        if (status === 'playing') {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => atualizarIcone(true))
                .catch(() => console.log("Autoplay bloqueado pelo navegador"));
            }
        }
    }

    // 3. SALVAR ANTES DE SAIR DA PÁGINA
    window.addEventListener('beforeunload', () => {
        if (audio && !audio.paused) {
            localStorage.setItem('udesaken_music_time', audio.currentTime);
            localStorage.setItem('udesaken_music_status', 'playing');
        } else if (audio) {
            localStorage.setItem('udesaken_music_status', 'paused');
        }
    });
});
/* ==========================================================================
   HK INVASION LOGIC (Lightweight)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.body;
    const particleCount = 15; // Baixa contagem para manter performance e elegância
    
    // 1. Gerador de Partículas (Lado Direito)
    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('hk-particle');
        
        // 30% de chance de ser um laço, 70% de ser um brilho
        if (Math.random() > 0.7) {
            p.classList.add('bow');
        }

        // Posição: Focada no lado direito (70% a 100% da largura da tela)
        const startX = Math.random() * 30 + 70; 
        
        // Tamanho aleatório
        const size = Math.random() * 4 + 2; // 2px a 6px
        
        p.style.left = `${startX}%`;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        
        // Duração da animação
        const duration = Math.random() * 10 + 15; // 15s a 25s (bem lento e suave)
        p.style.animation = `floatUp ${duration}s linear infinite`;
        p.style.animationDelay = `-${Math.random() * 20}s`; // Começa em tempos diferentes

        container.appendChild(p);
    }

    // Inicializar partículas
    for(let i = 0; i < particleCount; i++) {
        createParticle();
    }

    // 2. Infecção Visual Suave (Transformar Ouro em Rose Gold)
    // Seleciona aleatoriamente alguns elementos dourados para virarem Rose Gold
    const goldElements = document.querySelectorAll('.text-gold, .gold-border');
    
    const observerHK = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona um delay para parecer que a cor está mudando ao olhar
                setTimeout(() => {
                    entry.target.classList.add('hk-infected');
                    // Se for borda, ajusta o filtro via CSS inline ou classe
                    if(entry.target.classList.contains('gold-border')) {
                        entry.target.style.filter = "drop-shadow(0 0 2px var(--hk-pink)) drop-shadow(0 0 10px var(--hk-pink))";
                    }
                }, 1000); 
            }
        });
    }, { threshold: 0.5 });

    goldElements.forEach(el => observerHK.observe(el));
});