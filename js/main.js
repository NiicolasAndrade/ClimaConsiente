// Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('show');
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('show');
    });
  });

  // Ativar link ativo na navegação
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Inicializar gráfico
  initChart();

  // Inicializar calculadora
  initCalculator();

  // Inicializar fórum
  initForum();

  // Scroll suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Gráfico de Desmatamento
function initChart() {
  const ctx = document.getElementById('grafico-desmatamento');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2020', '2025', '2030', '2035', '2040', '2045'],
      datasets: [{
        label: 'Aumento da Temperatura (°C)',
        data: [0, 0.5, 1.1, 1.8, 2.5, 3.2],
        borderColor: '#2E7D32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}°C`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Aumento de Temperatura (°C)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Ano'
          }
        }
      }
    }
  });

  // Controle do slider
  const slider = document.getElementById('desmatamento-range');
  const valueDisplay = document.getElementById('desmatamento-value');

  slider.addEventListener('input', function() {
    const value = this.value;
    valueDisplay.textContent = value;
    
    // Atualizar dados do gráfico baseado no desmatamento
    const newData = chart.data.datasets[0].data.map((_, index) => {
      return (index * 0.5) * (value / 100);
    });
    
    chart.data.datasets[0].data = newData;
    chart.update();
  });
}

// Calculadora de Pegada Ecológica
function initCalculator() {
  const form = document.getElementById('form-pegada');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transporte = parseFloat(this.transporte.value) || 0;
    const energia = parseFloat(this.energia.value) || 0;
    const alimentacao = parseFloat(this.alimentacao.value) || 0;
    
    const pegadaTransporte = transporte * 0.21;
    const pegadaEnergia = energia * 0.5;
    const pegadaAlimentacao = alimentacao * 2;
    
    const pegadaTotal = pegadaTransporte + pegadaEnergia + pegadaAlimentacao;
    
    const resultadoElement = document.getElementById('resultado-pegada');
    resultadoElement.innerHTML = `
      <div class="result-header">
        <h3>Sua Pegada Ecológica Anual</h3>
        <div class="result-value">${pegadaTotal.toFixed(2)} <span>tCO₂</span></div>
      </div>
      <div class="result-details">
        <div class="detail">
          <span class="label">Transporte:</span>
          <span class="value">${pegadaTransporte.toFixed(2)} tCO₂</span>
        </div>
        <div class="detail">
          <span class="label">Energia:</span>
          <span class="value">${pegadaEnergia.toFixed(2)} tCO₂</span>
        </div>
        <div class="detail">
          <span class="label">Alimentação:</span>
          <span class="value">${pegadaAlimentacao.toFixed(2)} tCO₂</span>
        </div>
      </div>
      <div class="result-comparison">
        <p>Isso equivale a aproximadamente ${Math.round(pegadaTotal * 1000)} km dirigidos em um carro a gasolina.</p>
      </div>
    `;
  });
}

// Sistema de Fórum
function initForum() {
  const form = document.getElementById('form-forum');
  const messageList = document.getElementById('lista-forum');
  if (!form || !messageList) return;

  // Carregar mensagens do localStorage
  let messages = JSON.parse(localStorage.getItem('forumMessages')) || [];
  
  // Função para renderizar mensagens
  function renderMessages() {
    messageList.innerHTML = messages.map((message, index) => `
      <li class="forum-message">
        <div class="message-header">
          <span class="user">Usuário ${index + 1}</span>
          <span class="date">${new Date().toLocaleDateString('pt-BR')}</span>
        </div>
        <div class="message-content">${message}</div>
        <button class="delete-btn" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      </li>
    `).join('');
    
    // Adicionar eventos aos botões de deletar
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        messages.splice(index, 1);
        localStorage.setItem('forumMessages', JSON.stringify(messages));
        renderMessages();
      });
    });
  }
  
  // Renderizar mensagens iniciais
  renderMessages();
  
  // Adicionar nova mensagem
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const messageInput = document.getElementById('msg-forum');
    const message = messageInput.value.trim();
    
    if (message) {
      messages.push(message);
      localStorage.setItem('forumMessages', JSON.stringify(messages));
      messageInput.value = '';
      renderMessages();
    }
  });
}