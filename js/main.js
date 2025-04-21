// Configurações (preencha com sua chave)
const API_KEY_OWM = 'SUA_CHAVE_OPENWEATHER';
const CIDADE = 'Fortaleza,BR';

// Menu mobile
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => navLinks.classList.toggle('active'));

// Delay em seções
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section').forEach((sec,i) => sec.style.animationDelay = `${i*0.15}s`);
  initMonitoring();
  loadNews();
  loadForum();
});

// Scroll suave
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  navLinks.classList.remove('active');
}));

// Simulação: Desmatamento vs Temp
const ctx = document.getElementById('grafico-desmatamento').getContext('2d');
const chart = new Chart(ctx, { type:'line', data:{ labels:[0,20,40,60,80,100], datasets:[{ label:'Δ Temp (°C)', data:[0,0.2,0.5,0.9,1.4,2], fill:false }] }, options:{ responsive:true, scales:{ y:{ beginAtZero:true } } } });
document.getElementById('desmatamento-range').addEventListener('input', e => {
  const v= +e.target.value; document.getElementById('desmatamento-value').textContent=v;
  chart.data.datasets[0].data = [0,v*0.002,v*0.005,v*0.009,v*0.014,v*0.02]; chart.update();
});

// Calculadora de Pegada
document.getElementById('form-pegada').addEventListener('submit', e => {
  e.preventDefault(); const f=new FormData(e.target);
  const res=(+f.get('transporte')*0.21 + +f.get('energia')*0.5 + +f.get('alimentacao')*2).toFixed(2);
  document.getElementById('resultado-pegada').textContent = `Sua pegada anual: ${res} tCO₂`;
});

// Monitoramento: OpenWeather + OpenAQ
async function initMonitoring() {
  try {
    const w = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CIDADE)}&units=metric&appid=${API_KEY_OWM}`).then(r=>r.json());
    document.getElementById('temp').textContent = Math.round(w.main.temp);
    const aq = await fetch(`https://api.openaq.org/v2/latest?city=Fortaleza`).then(r=>r.json());
    document.getElementById('aqi').textContent = aq.results[0].measurements[0].value;
    // CO₂ atmosfera não disponível OpenAQ; valor estático
    document.getElementById('co2').textContent = '415';
  } catch (err) { console.error(err); }
}

// Notícias estáticas (exemplo)
function loadNews() {
  const list = document.getElementById('feed-noticias');
  const news = [
    { title:'Materiais educativos para clima em escolas', url:'https://lunetas.com.br/materiais-educativos-clima-criancas/' },
    { title:'Eventos extremos e saúde', url:'https://climaesaude.icict.fiocruz.br/eventos-extremos-0' }
  ];
  list.innerHTML = news.map(n=>`<li><a href="${n.url}" target="_blank">${n.title}</a></li>`).join('');
}

// Fórum simples no localStorage
function loadForum() {
  const msgs = JSON.parse(localStorage.getItem('forum-msgs')||'[]');
  renderForum(msgs);
  document.getElementById('form-forum').addEventListener('submit', e => {
    e.preventDefault();
    const txt = document.getElementById('msg-forum').value.trim();
    if(txt) {
      msgs.push(txt);
      localStorage.setItem('forum-msgs', JSON.stringify(msgs));
      renderForum(msgs);
      e.target.reset();
    }
  });
}
function renderForum(msgs) {
  document.getElementById('lista-forum').innerHTML = msgs.map(m=>`<li>${m}</li>`).join('');
}
