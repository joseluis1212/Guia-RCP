// Al cargar la página, mostrar la intro y ocultar la app principal
window.addEventListener('load', () => {
    const introScreen = document.getElementById('intro-screen');
    const mainApp = document.getElementById('main-app');
    const introStartBtn = document.getElementById('intro-start-btn');

    // Mostrar intro, ocultar app
    introScreen.classList.remove('hidden');
    mainApp.style.display = 'none';

    // Al hacer clic en "Comenzar"
    introStartBtn.addEventListener('click', () => {
        // Ocultar intro con transición
        introScreen.classList.add('hidden');
        // Mostrar app principal
        mainApp.style.display = 'block';
        // Iniciar la app normalmente (el código que ya tenías)
        initApp();
    });
});

function initApp() {
    // Aquí va TODO el código que ya tenías en app.js (el que maneja pasos, guardianes, voz, etc.)
    // ... (copiá y pegá el contenido completo de tu app.js anterior, exactamente igual, 
    // pero sin el window.onload que ya no es necesario porque initApp se llama después de la intro)
}

// El resto del código de app.js permanece idéntico, solo que ahora está encapsulado en initApp()
// y se ejecuta después de que el usuario presiona "Comenzar".
