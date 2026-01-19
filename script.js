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
    // Tenta encontrar o contador, se não existir na página, para a função.
    const viewCounter = document.querySelector('.stat h3'); 
    if(!viewCounter) return; 

    const docRef = doc(db, "site_dados", "geral");
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await updateDoc(docRef, { visualizacoes: increment(1) });
            // Atualize aqui a UI se tiver um elemento específico para views
        } else {
            await setDoc(docRef, { visualizacoes: 1200000 });
        }
    } catch (error) {
        console.log("Offline/Erro:", error);
    }
}
carregarEstatisticas();

// --- LÓGICA DE PARTÍCULAS E MÚSICA ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MÚSICA
    const audio = document.getElementById('bg-audio');
    const btn = document.querySelector('.music-btn');
    const icon = document.getElementById('music-icon');

    if(audio) audio.volume = 0.05;

    window.toggleMusic = function() {
        if(!audio) return;
        
        if (audio.paused) {
            audio.play().then(() => {
                atualizarIcone(true);
                localStorage.setItem('udesaken_music_status', 'playing');
            }).catch(e => console.log("Interação necessária para tocar som"));
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

    // Recupera status da música
    if (audio) {
        const savedTime = localStorage.getItem('udesaken_music_time');
        const status = localStorage.getItem('udesaken_music_status');

        if (savedTime) audio.currentTime = parseFloat(savedTime);
        if (status === 'playing') {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => atualizarIcone(true)).catch(() => {});
            }
        }
    }

    // Salva status ao sair
    window.addEventListener('beforeunload', () => {
        if (audio && !audio.paused) {
            localStorage.setItem('udesaken_music_time', audio.currentTime);
            localStorage.setItem('udesaken_music_status', 'playing');
        } else if (audio) {
            localStorage.setItem('udesaken_music_status', 'paused');
        }
    });

    // 2. PARTÍCULAS HELLO KITTY
    const container = document.body;
    const particleCount = 20;

    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('hk-particle');
        
        // 40% chance de ser laço, 60% brilho
        if (Math.random() > 0.6) p.classList.add('bow');

        const startX = Math.random() * 100; 
        const size = Math.random() * 5 + 3;
        
        p.style.left = `${startX}%`;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        
        const duration = Math.random() * 15 + 15;
        p.style.animation = `floatUp ${duration}s linear infinite`;
        p.style.animationDelay = `-${Math.random() * 20}s`;

        container.appendChild(p);
    }

    for(let i = 0; i < particleCount; i++) {
        createParticle();
    }
});