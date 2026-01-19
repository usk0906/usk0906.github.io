/* ==========================================================================
    UDESAKEN SYSTEM 2026 ®
    Lógica Geral + Tema HK Dark
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- LÓGICA DE MÚSICA CONTÍNUA ---
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-audio');
    const btn = document.querySelector('.music-btn');
    const icon = document.getElementById('music-icon');
    const links = document.querySelectorAll('.nav-links a');
const navLinks = document.querySelector('.nav-links');

// Fecha o menu ao clicar em qualquer link
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

    if(audio) {
        audio.volume = 0.05; 
    }

    window.toggleMusic = function() {
        if(!audio) return;
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

    window.addEventListener('beforeunload', () => {
        if (audio && !audio.paused) {
            localStorage.setItem('udesaken_music_time', audio.currentTime);
            localStorage.setItem('udesaken_music_status', 'playing');
        } else if (audio) {
            localStorage.setItem('udesaken_music_status', 'paused');
        }
    });

    // --- ATMOSFERA HELLO KITTY (Partículas Permanentes) ---
    const container = document.body;
    const particleCount = 20; // Quantidade de partículas para preencher a tela

    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('hk-particle');
        
        // 40% chance de ser laço, 60% brilho
        if (Math.random() > 0.6) {
            p.classList.add('bow');
        }

        // Posição aleatória em toda a largura (0 a 100%)
        const startX = Math.random() * 100; 
        const size = Math.random() * 5 + 3; // Tamanho variável
        
        p.style.left = `${startX}%`;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        
        // Animação muito lenta e elegante
        const duration = Math.random() * 15 + 15; // 15s a 30s
        p.style.animation = `floatUp ${duration}s linear infinite`;
        p.style.animationDelay = `-${Math.random() * 20}s`;

        container.appendChild(p);
    }

    // Cria as partículas
    for(let i = 0; i < particleCount; i++) {
        createParticle();
    }
});