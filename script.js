/* ==========================================================
   CONVITE DE FORMATURA – LETRAS
   ✏️  EDITE SOMENTE O BLOCO "CONFIG" ABAIXO
   ========================================================== */
const CONFIG = {
  nome: "ERLON DUTRA",
  iniciais: "EDC",
  curso: "Licenciatura em Letras – Língua Portuguesa",
  instituicao: "UEPA - UNIVERSIDADE DO ESTADO DO PARÁ",
  chamada: "Você é convidado(a) para a colação de grau de",

  // Nomes exibidos abaixo da frase (deixe [] para ocultar)
  familia: [
    { titulo: "Meus pais", nome: "Edglema Marinho & Ednaldo Costa" }
  ],

  // Datas no formato AAAA-MM-DDTHH:MM:SS-03:00 (fuso de Brasília)
  cerimonia: {
    inicio: "2026-10-07T16:00:00-03:00",
    duracaoHoras: 2,
    local: "Casa Bela - Espaço de Eventos - Monte Alegre - PA",
    mapa: "https://www.google.com/maps/place/Casa+Bela+-+Espa%C3%A7o+de+Eventos+-+Monte+Alegre+-+PA/@-1.9738836,-54.0861426,17z/data=!3m1!4b1!4m6!3m5!1s0x928601b869a0ef95:0x97e11d2771ffa0fc!8m2!3d-1.9738836!4d-54.0861426!16s%2Fg%2F11xn5bkjzl?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D"
  },

  // WhatsApp com DDI + DDD + número, só dígitos (ex.: 5599912345678)
  whatsapp: "5593991068559",
  mensagemWhats: "Olá! Confirmo minha presença na sua formatura. 🎓"
};

/* ==========================================================
   A PARTIR DAQUI É A LÓGICA (não precisa mexer)
   ========================================================== */
const $ = (sel) => document.querySelector(sel);
const fuso = "America/Sao_Paulo";
const fmtData = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: fuso });
const fmtHora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: fuso });

function preencherTextos() {
  document.title = `Formatura de ${CONFIG.nome}`;
  $("#iniciais").textContent = CONFIG.iniciais;
  document.querySelectorAll("[data-txt]").forEach((el) => (el.textContent = CONFIG[el.dataset.txt]));

  const dataCerimonia = new Date(CONFIG.cerimonia.inicio);
  $('[data-data="cerimonia"]').textContent = fmtData.format(dataCerimonia);
  $('[data-hora="cerimonia"]').textContent = fmtHora.format(dataCerimonia).replace(":", "h");
  $('[data-local="cerimonia"]').textContent = CONFIG.cerimonia.local;

  $("#familia").innerHTML = CONFIG.familia
    .map((f) => `<p><strong>${f.titulo}</strong>${f.nome}</p>`)
    .join("");

  $("#btn-rsvp").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagemWhats)}`;
  $("#btn-mapa").href = CONFIG.cerimonia.mapa;
}

/* Exibe o nome completo na chamada */
function montarNome() {
  const el = $("#nome");
  el.setAttribute("aria-label", CONFIG.nome);
  el.textContent = CONFIG.nome;
}

/* Contagem regressiva */
function iniciarContagem() {
  const alvo = new Date(CONFIG.cerimonia.inicio).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    let s = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
    $("#cd-dias").textContent = Math.floor(s / 86400);
    $("#cd-horas").textContent = pad(Math.floor((s % 86400) / 3600));
    $("#cd-min").textContent = pad(Math.floor((s % 3600) / 60));
    $("#cd-seg").textContent = pad(s % 60);
  };
  tick();
  setInterval(tick, 1000);
}

/* Salvar na agenda (.ics) */
function salvarAgenda() {
  const ini = new Date(CONFIG.cerimonia.inicio);
  const fim = new Date(ini.getTime() + CONFIG.cerimonia.duracaoHoras * 3600 * 1000);
  const f = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Convite Formatura//PT",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@convite-formatura`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(ini)}`, `DTEND:${f(fim)}`,
    `SUMMARY:Colação de grau – ${CONFIG.nome}`,
    `LOCATION:${CONFIG.cerimonia.local}`,
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "formatura.ics";
  a.click();
  URL.revokeObjectURL(a.href);
}

/* Abrir o convite ao clicar no selo */
function abrirConvite() {
  const capa = $("#capa");
  if (capa.classList.contains("aberta")) return;
  capa.classList.add("aberta");
  document.body.classList.add("convite-aberto");
  setTimeout(() => {
    document.body.classList.remove("fechado");
    capa.classList.add("fim");
  }, 1900);
}

document.addEventListener("DOMContentLoaded", () => {
  preencherTextos();
  montarNome();
  iniciarContagem();
  $("#selo").addEventListener("click", abrirConvite);
  $("#btn-agenda").addEventListener("click", salvarAgenda);
});
