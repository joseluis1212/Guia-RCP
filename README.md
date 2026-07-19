# 🫀 Guardianes de la Vida — Asistente Virtual de RCP

**Guía interactiva de reanimación cardiopulmonar (RCP) para toda la familia.**

[![Abrir app](https://img.shields.io/badge/🚀%20Abrir%20aplicación-Guardianes%20de%20la%20Vida-ff4757?style=for-the-badge)](https://joseluis1212.github.io/Guia-RCP/)

---

## 📖 ¿Qué es Guardianes de la Vida?

Es una **aplicación web progresiva (PWA)** que te guía **paso a paso** durante una emergencia cardíaca, con instrucciones claras, metrónomo integrado y el acompañamiento de cuatro personajes virtuales que te hablan y te animan.

Está basada en las **guías oficiales de RCP de Argentina (2025‑2026)** y adapta los protocolos para **adultos, niños y bebés**.

---

## ✨ Características

- 🧑👦👶 **Tres protocolos**: adulto, niño (1‑8 años) y bebé (< 1 año).
- 🐰🩶🚀🎧 **Cuatro guardianes animados**: Bunny, Hoodie, Astro y Pulse, cada uno con su propia voz y personalidad.
- 🔊 **Síntesis de voz** en español argentino para leer cada paso.
- 🎵 **Metrónomo visual y sonoro** a 110 compresiones por minuto.
- 📴 **Funciona sin internet** después de la primera carga.
- 📲 **Instalable** como una app en la pantalla de inicio de tu teléfono (PWA).
- ♿ **Interfaz accesible**, diseñada para funcionar incluso bajo estrés.
- 🆓 **Código abierto** y gratuito, alojado en GitHub Pages.

---

## 🚀 Uso rápido

1. Escaneá el código QR que acompaña a la aplicación (por ejemplo, pegado en la heladera o el botiquín).
2. Se abrirá la página web.
3. Elegí el guardián que más te guste (o simplemente presioná **INICIAR GUÍA** con el predeterminado).
4. Seleccioná el tipo de víctima: adulto, niño o bebé.
5. Seguí las instrucciones de voz y los indicadores visuales.
6. Si tenés un DEA, la guía te indicará cuándo usarlo.
7. No olvides **llamar al 107** (el botón está siempre visible).

---

## 🧑‍⚕️ Protocolo de RCP implementado

La secuencia de pasos sigue las recomendaciones de **Argentina.gob.ar** y está actualizada a agosto de 2025:

1. Verificar la escena.
2. Verificar respuesta.
3. Pedir ayuda (llamar al 107 o 911).
4. Verificar respiración.
5. Posicionar las manos correctamente.
6. Postura de compresión.
7. Compresión activa (5‑6 cm en adultos, ~5 cm en niños, 4 cm en bebés).
8. Retroceso completo del pecho.
9. Ventilación de rescate (solo si estás entrenado y con protección).
10. Uso del DEA y continuación de ciclos hasta que llegue ayuda.

---

## 🗂️ Estructura del repositorio

```

Guia-RCP/
├── index.html          # Estructura principal de la aplicación
├── style.css           # Estilos visuales (oscuro, neón, responsive)
├── app.js              # Lógica de la guía, voces, metrónomo y navegación
├── sw.js               # Service Worker para funcionamiento offline
├── manifest.json       # Configuración de PWA
├── icon-192.png        # Ícono pequeño
├── icon-512.png        # Ícono grande
├── hoodie.png          # Imagen del guardián Hoodie
├── pulse.png           # Imagen del guardián Pulse
├── astro.png           # Imagen del guardián Astro
├── bunny.png           # Imagen del guardián Bunny
├── assets/guardians/   # (Opcional) Carpetas para futuras poses/imágenes
└── README.md           # Este archivo

```

---

## 🔧 Tecnologías utilizadas

- **HTML5 + CSS3 + JavaScript (ES6)**
- **Web Speech API** (síntesis de voz)
- **Web Audio API** (metrónomo)
- **Service Worker** (offline)
- **Manifesto PWA** (instalación)

No se utilizan frameworks externos, por lo que la aplicación es extremadamente ligera y rápida.

---

## 📲 Instalación en el teléfono

### Android (Chrome)
1. Abrí la aplicación en Chrome.
2. Tocá los tres puntos (⋮) → "Añadir a pantalla de inicio".
3. Confirmá y la app aparecerá como un ícono más.

### iOS (Safari)
1. Abrí la aplicación en Safari.
2. Tocá el ícono de compartir (⬆) → "Añadir a pantalla de inicio".
3. Poné un nombre y listo.

---

## 🤝 Cómo contribuir

¡Las contribuciones son bienvenidas! Podés:

- Reportar errores o sugerir mejoras en la sección [Issues](https://github.com/joseluis1212/Guia-RCP/issues).
- Hacer un fork del repositorio y enviar un Pull Request con tus cambios.
- Compartir el proyecto para que más personas conozcan esta herramienta.

---

## ⚠️ Aviso importante

**Esta aplicación es una ayuda educativa. No reemplaza la formación profesional en RCP ni a los servicios de emergencia.**  
Ante una emergencia real, llamá inmediatamente al **107** (SAME) o al **911**.  
La información médica contenida sigue las guías oficiales argentinas disponibles hasta la fecha de actualización, pero puede variar según nuevas recomendaciones.

---

## 📞 Emergencias

| Servicio | Número |
|----------|--------|
| SAME (Emergencias médicas) | 107 |
| Policía | 911 |

---

## ✨ Créditos

Desarrollado por José Luis 🧑‍💻  
Personajes diseñados con ❤️ usando CSS e imágenes propias.  
Basado en las guías de [Argentina.gob.ar](https://www.argentina.gob.ar/salud/rcp).

---

**Guardianes de la Vida** — Porque en una emergencia, no estás solo.
```

---
