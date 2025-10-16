// Atualiza o ano no footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/**
 * Inicializa um canvas com pontos e linhas animados
 * @param {string} canvasId - ID do <canvas>
 * @param {string} containerSelector - seletor da seção (para medir largura/altura)
 * @param {number} speed - velocidade dos pontos (0.05 a 0.15 = lento, 0.22 = rápido)
 */
function initNetworkCanvas(canvasId, containerSelector, speed = 0.08) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  const ctx = canvas.getContext('2d');

  // Configurações visuais
  const COLORS = {
    dot: 'rgba(255,255,255,0.75)',
    lineBase: 'rgba(255,255,255,',
    glow: 'rgba(255,255,255,0.05)'
  };
  const DENSITY = 0.00010;  // densidade de pontos por px²
  const SPEED = speed;
  const LINK_DIST = 160;
  const DOT_RADIUS = 1.4;

  let dpr = 1, w = 0, h = 0, nodes = [], maxDist = 0, rafId = 0, last = performance.now();

  function sizeFromContainer() {
    const rect = container.getBoundingClientRect();
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.width  = Math.floor(rect.width * dpr);
    h = canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width  = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const target = Math.floor(rect.width * rect.height * DENSITY);
    nodes = spawn(target);
    maxDist = LINK_DIST * dpr;
  }

  function spawn(n) {
    const arr = new Array(n);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (0.4 + Math.random() * 0.6) * SPEED * dpr;
      arr[i] = { x: Math.random() * w, y: Math.random() * h, vx: Math.cos(a) * v, vy: Math.sin(a) * v };
    }
    return arr;
  }

  function step(now) {
    const dt = Math.min(50, now - last);
    last = now;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = COLORS.glow;
    ctx.fillRect(0, 0, w, h);

    // pontos
    ctx.fillStyle = COLORS.dot;
    for (const p of nodes) {
      p.x += p.vx * dt; 
      p.y += p.vy * dt;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, DOT_RADIUS * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    // linhas
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < maxDist) {
          const t = 1 - (d / maxDist);
          const alpha = (0.08 + t * 0.22).toFixed(3); // opacidade conforme distância
          ctx.strokeStyle = COLORS.lineBase + alpha + ')';
          ctx.lineWidth = dpr;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(step);
  }

  function start() {
    sizeFromContainer();
    cancelAnimationFrame(rafId);
    last = performance.now();
    rafId = requestAnimationFrame(step);
  }

  window.addEventListener('resize', start, { passive: true });
  start();
}
// Enviar formulário para WhatsApp
const form = document.getElementById("whatsapp-form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Pega os valores
    const nome = form.querySelector("[name=nome]").value.trim();
    const email = form.querySelector("[name=email]").value.trim();
    const telefone = form.querySelector("[name=telefone]").value.trim();
    const projeto = form.querySelector("[name=projeto]").value.trim();
    const resumo = form.querySelector("[name=resumo]").value.trim();

    // Seu número do WhatsApp (substitua pelo real: DDI+DDD+numero)
    const numero = "5531988072312";

    // Mensagem formatada
    const mensagem = `Olá! Gostaria de inovar meu negócio!

  Nome: ${nome}
  E-mail: ${email}
  Telefone: ${telefone}
  Projeto: ${projeto}
  Resumo: ${resumo}`;

    // Monta URL do WhatsApp
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    // Abre no WhatsApp
    window.open(url, "_blank");
  });
}

// Inicializa para Serviços e Processo
initNetworkCanvas('bg-net', '#services', 0.08);
initNetworkCanvas('bg-net-process', '#process-contact', 0.08);