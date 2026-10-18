/**
 * Anburaj & Abinaya Wedding Invitation Interactive Engine
 * Featuring: Live Countdown, Music BGM, Confetti, and Continuous Flower Petals Rain!
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const welcomeGateway = document.getElementById('welcomeGateway');
  const openInvitationBtn = document.getElementById('openInvitationBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioLabel = document.getElementById('audioLabel');
  const weddingBgm = document.getElementById('weddingBgm');
  const sharePageBtn = document.getElementById('sharePageBtn');
  const flowerRainToggleBtn = document.getElementById('flowerRainToggleBtn');

  let isAudioPlaying = false;
  let isFlowerRainActive = true;

  // 1. OPEN INVITATION TRIGGER
  if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', () => {
      // Hide gateway modal with smooth transition
      welcomeGateway.classList.add('hidden');

      // Trigger Celebration Confetti & Shower of Flowers
      triggerCelebrationConfetti();
      burstExtraFlowers(40);

      // Start Background Music
      playAudio();

      // Smooth scroll to top of main invitation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. AUDIO PLAYBACK MANAGEMENT
  function playAudio() {
    if (weddingBgm) {
      weddingBgm.volume = 0.65;
      weddingBgm.play().then(() => {
        isAudioPlaying = true;
        updateAudioButtonUI(true);
      }).catch(err => {
        console.log("Audio autoplay prevented, using Web Audio Synthesizer fallback:", err);
        startSynthAmbient();
        isAudioPlaying = true;
        updateAudioButtonUI(true);
      });
    }
  }

  function pauseAudio() {
    if (weddingBgm) {
      weddingBgm.pause();
    }
    stopSynthAmbient();
    isAudioPlaying = false;
    updateAudioButtonUI(false);
  }

  function updateAudioButtonUI(playing) {
    if (playing) {
      audioToggleBtn.classList.add('playing');
      audioLabel.textContent = "Music: ON";
    } else {
      audioToggleBtn.classList.remove('playing');
      audioLabel.textContent = "Music: OFF";
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // Web Audio API Fallback: Peaceful Flute / Tanpura meditative drone
  let audioCtx = null;
  let synthOscs = [];
  let synthGain = null;

  function startSynthAmbient() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      stopSynthAmbient();

      synthGain = audioCtx.createGain();
      synthGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      synthGain.connect(audioCtx.destination);

      const freqs = [130.81, 196.00, 261.63, 392.00];
      synthOscs = freqs.map((freq, i) => {
        const osc = audioCtx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        const vibrato = audioCtx.createOscillator();
        const vibratoGain = audioCtx.createGain();
        vibrato.frequency.value = 3 + i * 0.5;
        vibratoGain.gain.value = 1.2;
        vibrato.connect(osc.frequency);
        vibrato.start();

        osc.connect(synthGain);
        osc.start();
        return osc;
      });
    } catch (e) {
      console.warn("Synth fallback unavailable", e);
    }
  }

  function stopSynthAmbient() {
    if (synthOscs && synthOscs.length) {
      synthOscs.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      synthOscs = [];
    }
  }

  // 3. LIVE WEDDING COUNTDOWN TIMER
  // Wedding Date: December 10, 2026, 09:00:00 AM (IST)
  const weddingDate = new Date('2026-12-10T09:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById('countdownDays').textContent = String(days).padStart(2, '0');
      document.getElementById('countdownHours').textContent = String(hours).padStart(2, '0');
      document.getElementById('countdownMinutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('countdownSeconds').textContent = String(seconds).padStart(2, '0');
    } else {
      document.getElementById('countdownDays').textContent = '00';
      document.getElementById('countdownHours').textContent = '00';
      document.getElementById('countdownMinutes').textContent = '00';
      document.getElementById('countdownSeconds').textContent = '00';
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. CELEBRATION CONFETTI BURST
  function triggerCelebrationConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#dfb743', '#f7e2a4', '#d84545', '#ffffff']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#dfb743', '#f7e2a4', '#d84545']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#dfb743', '#f7e2a4', '#d84545']
        });
      }, 350);
    }
  }

  // 5. PHOTO GALLERY LIGHTBOX
  const lightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  document.querySelectorAll('.gallery-photo-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      const imgSrc = frame.getAttribute('data-img');
      const caption = frame.getAttribute('data-caption');
      lightboxImg.src = imgSrc;
      lightboxCaption.innerHTML = caption;
      lightbox.classList.add('active');
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // 6. ADD TO CALENDAR (.ICS CREATOR & DOWNLOADER)
  document.querySelectorAll('.add-cal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      const venue = btn.getAttribute('data-venue');
      const startIso = btn.getAttribute('data-start');
      const endIso = btn.getAttribute('data-end');

      const icsData = generateIcsFile(title, desc, venue, startIso, endIso);
      downloadFile(icsData, `${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`, 'text/calendar');
      
      showToast('Event added to Calendar download!');
    });
  });

  function formatIcsDate(dateStr) {
    const d = new Date(dateStr);
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  }

  function generateIcsFile(title, desc, venue, startIso, endIso) {
    const nowIso = new Date().toISOString().replace(/-|:|\.\d+/g, '');
    const startFormatted = formatIcsDate(startIso);
    const endFormatted = formatIcsDate(endIso);

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Anburaj Abinaya Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:wedding-${Date.now()}@weddinginvitation.local`,
      `DTSTAMP:${nowIso}`,
      `DTSTART:${startFormatted}`,
      `DTEND:${endFormatted}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${venue}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 7. SHARE BUTTON HANDLER
  if (sharePageBtn) {
    sharePageBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Anburaj & Abinaya Wedding Invitation',
        text: 'You are cordially invited to celebrate the wedding of Anburaj & Abinaya on December 10, 2026 at Sivan Temple, Thiruvegampet, Sivaganga!',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log('Share canceled or failed', err);
        }
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Invitation link copied to clipboard!');
        }).catch(() => {
          showToast('Copy URL from your browser address bar.');
        });
      }
    });
  }

  // 8. BACKGROUND FLOATING SPARKLES CANVAS
  initSparklesCanvas();

  function initSparklesCanvas() {
    const canvas = document.getElementById('sparklesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 24;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedY: -(Math.random() * 0.45 + 0.2),
        speedX: Math.sin(Math.random() * Math.PI) * 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const opacity = Math.max(0.1, Math.min(0.85, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(223, 183, 67, ${opacity})`;
        ctx.shadowColor = 'rgba(247, 226, 164, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ========================================================
  // 9. LUXURIOUS CONTINUOUS FLOWER RAIN ENGINE
  // ========================================================
  const flowerPetalPalettes = [
    // 1. Velvet Red Rose Petal
    { color1: '#ff2e4c', color2: '#990014', veinColor: '#6b000d' },
    // 2. Soft Pink Rose Petal
    { color1: '#ff758f', color2: '#e63946', veinColor: '#a81d2d' },
    // 3. Golden Saffron Marigold (செவ்வந்தி / சாமந்தி)
    { color1: '#ffb703', color2: '#fb8500', veinColor: '#b45309' },
    // 4. Bright Turmeric Marigold
    { color1: '#ffd166', color2: '#f39c12', veinColor: '#d97706' },
    // 5. Auspicious Jasmine Ivory White (மல்லிகை)
    { color1: '#ffffff', color2: '#fef08a', veinColor: '#eab308' }
  ];

  let flowers = [];
  let flowersCanvas = null;
  let flowersCtx = null;
  let flowerWidth = window.innerWidth;
  let flowerHeight = window.innerHeight;

  function initFlowerRain() {
    flowersCanvas = document.getElementById('flowersCanvas');
    if (!flowersCanvas) return;
    flowersCtx = flowersCanvas.getContext('2d');

    flowerWidth = flowersCanvas.width = window.innerWidth;
    flowerHeight = flowersCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      flowerWidth = flowersCanvas.width = window.innerWidth;
      flowerHeight = flowersCanvas.height = window.innerHeight;
    });

    // Populate initial flower rain
    const count = window.innerWidth < 600 ? 32 : 48;
    for (let i = 0; i < count; i++) {
      flowers.push(createPetal(true));
    }

    animateFlowers();
  }

  function createPetal(randomY = false) {
    const palette = flowerPetalPalettes[Math.floor(Math.random() * flowerPetalPalettes.length)];
    const size = Math.random() * 10 + 10; // width 10-20
    const length = size * (Math.random() * 0.5 + 1.25); // length 13-35

    return {
      x: Math.random() * flowerWidth,
      y: randomY ? Math.random() * flowerHeight : -30 - Math.random() * 40,
      width: size,
      length: length,
      speedY: Math.random() * 1.4 + 1.0,
      speedX: (Math.random() - 0.5) * 0.8,
      swayFreq: Math.random() * 0.02 + 0.015,
      swayAmp: Math.random() * 1.8 + 0.8,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.035,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: Math.random() * 0.03 + 0.02,
      alpha: Math.random() * 0.35 + 0.65,
      palette: palette,
      swayTime: Math.random() * 100
    };
  }

  function burstExtraFlowers(extraCount = 35) {
    for (let i = 0; i < extraCount; i++) {
      const petal = createPetal(false);
      petal.y = -10 - Math.random() * 50;
      petal.speedY = Math.random() * 2.8 + 1.8;
      flowers.push(petal);
    }
  }

  function drawNaturalPetal(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    // 3D flip illusion using scaleX
    const scaleX = Math.cos(p.flipAngle);
    ctx.scale(scaleX, 1);

    ctx.beginPath();
    ctx.moveTo(0, -p.length / 2);
    // Right curve of petal
    ctx.bezierCurveTo(p.width * 0.7, -p.length * 0.25, p.width * 0.65, p.length * 0.3, 0, p.length / 2);
    // Left curve of petal
    ctx.bezierCurveTo(-p.width * 0.65, p.length * 0.3, -p.width * 0.7, -p.length * 0.25, 0, -p.length / 2);

    // Gradient texture
    const grad = ctx.createLinearGradient(0, -p.length / 2, p.width * 0.5, p.length / 2);
    grad.addColorStop(0, p.palette.color1);
    grad.addColorStop(1, p.palette.color2);

    ctx.fillStyle = grad;
    ctx.globalAlpha = p.alpha;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 5;
    ctx.fill();

    // Center delicate vein
    ctx.beginPath();
    ctx.moveTo(0, -p.length * 0.38);
    ctx.quadraticCurveTo(p.width * 0.1, 0, 0, p.length * 0.35);
    ctx.strokeStyle = p.palette.veinColor;
    ctx.lineWidth = 0.7;
    ctx.globalAlpha = p.alpha * 0.45;
    ctx.stroke();

    ctx.restore();
  }

  function animateFlowers() {
    if (!flowersCtx) return;

    flowersCtx.clearRect(0, 0, flowerWidth, flowerHeight);

    if (isFlowerRainActive) {
      for (let i = 0; i < flowers.length; i++) {
        const p = flowers[i];
        p.swayTime += p.swayFreq;
        p.y += p.speedY;
        p.x += Math.sin(p.swayTime) * p.swayAmp + p.speedX;
        p.angle += p.spinSpeed;
        p.flipAngle += p.flipSpeed;

        // Reset when fallen off screen
        if (p.y > flowerHeight + 40) {
          // If we have more than standard, remove extra burst petals
          const standardCount = window.innerWidth < 600 ? 32 : 48;
          if (flowers.length > standardCount) {
            flowers.splice(i, 1);
            i--;
            continue;
          } else {
            p.y = -30;
            p.x = Math.random() * flowerWidth;
          }
        }

        if (p.x < -30) p.x = flowerWidth + 20;
        if (p.x > flowerWidth + 30) p.x = -20;

        drawNaturalPetal(flowersCtx, p);
      }
    }

    requestAnimationFrame(animateFlowers);
  }

  initFlowerRain();

  // Flower Rain Toggle Button
  if (flowerRainToggleBtn) {
    flowerRainToggleBtn.addEventListener('click', () => {
      isFlowerRainActive = !isFlowerRainActive;
      if (isFlowerRainActive) {
        flowerRainToggleBtn.classList.add('active-flower');
        if (flowersCanvas) flowersCanvas.style.opacity = '1';
        showToast('🌸 Flower Rain: ON');
      } else {
        flowerRainToggleBtn.classList.remove('active-flower');
        if (flowersCanvas) {
          flowersCtx.clearRect(0, 0, flowerWidth, flowerHeight);
          flowersCanvas.style.opacity = '0';
        }
        showToast('🌸 Flower Rain: OFF');
      }
    });
  }

  // 10. TOAST NOTIFICATION HELPER
  function showToast(message) {
    let toast = document.getElementById('weddingToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'weddingToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '85px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(28, 12, 7, 0.95)';
      toast.style.border = '1px solid #dfb743';
      toast.style.color = '#f7e2a4';
      toast.style.padding = '8px 18px';
      toast.style.borderRadius = '20px';
      toast.style.fontSize = '0.78rem';
      toast.style.fontFamily = "'Montserrat', sans-serif";
      toast.style.zIndex = '99999';
      toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.8), 0 0 10px rgba(223,183,67,0.3)';
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2800);
  }
});

// 11. WHATSAPP BLESSINGS SENDER (GLOBAL SCOPE)
function sendWhatsAppBlessings() {
  const guestName = document.getElementById('guestName').value.trim();
  const guestMessage = document.getElementById('guestMessage').value.trim();

  if (!guestName || !guestMessage) {
    alert("Please enter your name and wishes.");
    return;
  }

  // Construct message
  const text = `*Wedding Blessings for Anburaj & Abinaya* 💐✨\n\n*From:* ${guestName}\n\n*Blessings & Wishes:*\n"${guestMessage}"\n\nMay you both have a blessed, joyful, and eternal journey of love! 💍❤️`;

  // WhatsApp link (sends directly to +91 9087298150)
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=919087298150&text=${encodedText}`;

  window.open(whatsappUrl, '_blank');
}
