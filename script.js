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