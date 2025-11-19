const releases = [
    {
      version: "v1.0 - MVP",
      date: "15 Marzo 2025",
      status: "Completado",
      description: "Lanzamiento del producto mínimo viable con funcionalidades core"
    },
    {
      version: "v1.5 - Módulo IA",
      date: "20 Junio 2025",
      status: "Completado",
      description: "Integración del motor de IA para diagnóstico asistido"
    },
    {
      version: "v2.0 - Integración Total",
      date: "15 Septiembre 2025",
      status: "En Progreso",
      description: "Integración completa con sistemas hospitalarios existentes"
    },
    {
      version: "v2.5 - Mobile App",
      date: "30 Noviembre 2025",
      status: "Planificado",
      description: "Aplicación móvil para médicos y pacientes"
    }
  ];

  container.innerHTML = `
    <div class="timeline-line"></div>
    ${releases.map((release, index) => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h4 class="timeline-title">${release.version}</h4>
          <p class="timeline-date"><i class="fas fa-calendar"></i> ${release.date}</p>
          <p class="timeline-desc">${release.description}</p>
          <span class="status-badge status-${release.status.toLowerCase().replace(/ /g, '-')}">${release.status}</span>
        </div>
      </div>
    `).join('')}
  `;
}

// ==================== CHARTS ====================
function createAllCharts() {
  createIncidentsPriorityChart();
  createProjectProgressChart();
  createRiskMatrixChart();
  createSLAChart();
  createEVMChart();
  createCostDistributionChart();
  createQualityChart();
}

function createIncidentsPriorityChart() {
  const ctx = document.getElementById('chart-incidents-priority').getContext('2d');
  
  const priorityCount = ITIL.priorities.map(p => 
    STATE.incidents.filter(i => i.priority === p).length
  );

  STATE.charts.incidentsPriority = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ITIL.priorities,
      datasets: [{
        data: priorityCount,
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#cbd5e1', font: { size: 12 } }
        }
      }
    }
  });
}

function createProjectProgressChart() {
  const ctx = document.getElementById('chart-project-progress').getContext('2d');
  
  STATE.charts.projectProgress = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Iniciación', 'Planificación', 'Ejecución', 'M&C', 'Cierre'],
      datasets: [{
        label: 'Progreso %',
        data: [100, 100, 65, 60, 0],
        backgroundColor: '#28a745',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { 
          ticks: { color: '#64748b' }, 
          grid: { color: 'rgba(100, 116, 139, 0.1)' },
          max: 100
        },
        x: { 
          ticks: { color: '#64748b' }, 
          grid: { display: false } 
        }
      }
    }
  });
}

function createRiskMatrixChart() {
  const ctx = document.getElementById('chart-risk-matrix').getContext('2d');
  
  // Scatter chart for risk matrix
  const riskPoints = STATE.risks.map(risk => {
    const probValues = { "Muy Baja": 1, "Baja": 2, "Media": 3, "Alta": 4, "Muy Alta": 5 };
    const impactValues = { "Muy Bajo": 1, "Bajo": 2, "Medio": 3, "Alto": 4, "Muy Alto": 5 };
    return {
      x: impactValues[risk.impact],
      y: probValues[risk.probability],
      r: 15
    };
  });

  STATE.charts.riskMatrix = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Riesgos',
        data: riskPoints,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: '#ef4444',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#cbd5e1' } }
      },
      scales: {
        y: { 
          title: { display: true, text: 'Probabilidad', color: '#cbd5e1' },
          ticks: { color: '#64748b' }, 
          grid: { color: 'rgba(100, 116, 139, 0.1)' },
          min: 0,
          max: 6
        },
        x: { 
          title: { display: true, text: 'Impacto', color: '#cbd5e1' },
          ticks: { color: '#64748b' }, 
          grid: { color: 'rgba(100, 116, 139, 0.1)' },
          min: 0,
          max: 6
        }
      }
    }
  });
}

function createSLAChart() {
  const ctx = document.getElementById('chart-sla').getContext('2d');
  
  const slaCompliance = ITIL.categories.map(cat => {
    const catIncidents = STATE.incidents.filter(i => i.category === cat);
    const compliant = catIncidents.filter(i => i.sla).length;
    return catIncidents.length > 0 ? ((compliant / catIncidents.length) * 100).toFixed(1) : 0;
  });

  STATE.charts.sla = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ITIL.categories,
      datasets: [{
        label: 'SLA Compliance %',
        data: slaCompliance,
        backgroundColor: '#10b981',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { 
          ticks: { color: '#64748b' }, 
          grid: { color: 'rgba(100, 116, 139, 0.1)' },
          max: 100
        },
        x: { 
          ticks: { color: '#64748b' }, 
          grid: { display: false } 
        }
      }
    }
  });
}

function createEVMChart() {
  const ctx = document.getElementById('chart-evm').getContext('2d');
  
  // Curva S - Earned Value Management
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'];
  
  STATE.charts.evm = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'PV (Planned Value)',
          data: [50, 120, 210, 320, 450, 590, 730, 850, 970, 1070, 1150],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3
        },
        {
          label: 'EV (Earned Value)',
          data: [48, 115, 205, 310, 435, 570, 700, 816, 920, 1020, 1100],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3
        },
        {
          label: 'AC (Actual Cost)',
          data: [52, 110, 195, 295, 415, 540, 665, 755, 850, 945, 1030],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#cbd5e1' } }
      },
      scales: {
        y: { 
          ticks: { color: '#64748b', callback: value => '// ==================== NEXUS PRO - ITIL + PMBOK INTEGRATION ====================
// Sistema Integrado de Gestión ITIL v4 y PMBOK 7

// ==================== GLOBAL STATE ====================
const STATE = {
  incidents: [],
  problems: [],
  changes: [],
  releases: [],
  risks: [],
  stakeholders: [],
  projectData: {
    name: "Implementación Sistema Hospitalario IA",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    budget: 1200000,
    pv: 850000,
    ev: 816000,
    ac: 755000,
    cpi: 1.08,
    spi: 0.96
  },
  charts: {},
  notificationCount: 0
};

// ITIL Categories
const ITIL = {
  categories: ["Hardware", "Software", "Network", "Database", "Application", "Security"],
  impacts: ["Alto", "Medio", "Bajo"],
  urgencies: ["Alta", "Media", "Baja"],
  priorities: ["Crítica", "Alta", "Media", "Baja"],
  statuses: ["Abierta", "En Progreso", "Resuelta", "Cerrada"],
  supportGroups: ["Service Desk", "Infrastructure", "Application Support", "Database Team", "Security Team"],
  changeTypes: ["Standard", "Normal", "Emergency"],
  changeCategories: ["Infrastructure", "Application", "Data", "Security"]
};

// PMBOK Areas
const PMBOK = {
  knowledgeAreas: [
    "Integración", "Alcance", "Cronograma", "Costos", 
    "Calidad", "Recursos", "Comunicaciones", "Riesgos", 
    "Adquisiciones", "Interesados"
  ],
  phases: ["Inicio", "Planificación", "Ejecución", "Monitoreo y Control", "Cierre"],
  riskCategories: ["Técnico", "Organizacional", "Externo", "Gerencia de Proyecto"],
  riskProbabilities: ["Muy Baja", "Baja", "Media", "Alta", "Muy Alta"],
  riskImpacts: ["Muy Bajo", "Bajo", "Medio", "Alto", "Muy Alto"]
};

// ==================== INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', () => {
  initializeSystem();
  setupNavigation();
  setupEventListeners();
  createAllCharts();
  startAutoUpdates();
});

function initializeSystem() {
  console.log('🚀 NEXUS Pro - Inicializando Sistema ITIL + PMBOK...');
  
  // Generar datos iniciales
  generateInitialIncidents();
  generateInitialProblems();
  generateInitialChanges();
  generateInitialRisks();
  generateInitialStakeholders();
  
  // Renderizar todo
  updateDashboard();
  renderIncidentsTable();
  renderProblemsGrid();
  renderChangesTable();
  renderRisksTable();
  renderStakeholdersTable();
  renderWBS();
  renderGanttChart();
  renderIntegrationMatrix();
  renderKPIDashboard();
  renderReleasesTimeline();
  
  addToLiveFeed('✅ Sistema NEXUS Pro iniciado correctamente', false);
  addToLiveFeed('🔄 ITIL Service Management activado', false);
  addToLiveFeed('📊 PMBOK Project Management activado', false);
}

// ==================== DATA GENERATION ====================
function generateInitialIncidents() {
  for (let i = 0; i < 50; i++) {
    generateAutoIncident(true);
  }
}

function generateAutoIncident(silent = false) {
  const category = ITIL.categories[Math.floor(Math.random() * ITIL.categories.length)];
  const impact = ITIL.impacts[Math.floor(Math.random() * ITIL.impacts.length)];
  const urgency = ITIL.urgencies[Math.floor(Math.random() * ITIL.urgencies.length)];
  
  // Calcular prioridad según matriz ITIL (Impacto x Urgencia)
  const priority = calculatePriority(impact, urgency);
  
  const incident = {
    id: `INC-${String(STATE.incidents.length + 10001).padStart(6, '0')}`,
    title: priority === "Crítica" 
      ? `FALLO CRÍTICO - ${category} sin respuesta` 
      : `Degradación de rendimiento en ${category}`,
    category,
    impact,
    urgency,
    priority,
    status: Math.random() < 0.7 ? "Abierta" : ITIL.statuses[Math.floor(Math.random() * ITIL.statuses.length)],
    assignedGroup: ITIL.supportGroups[Math.floor(Math.random() * ITIL.supportGroups.length)],
    assignedTo: `Técnico ${Math.floor(Math.random() * 20) + 1}`,
    date: new Date().toLocaleDateString('es-ES'),
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().getTime(),
    sla: Math.random() < 0.92,
    slaTarget: priority === "Crítica" ? 2 : priority === "Alta" ? 4 : 8,
    mttr: priority === "Crítica" ? (Math.random() * 3 + 0.5).toFixed(1) : (Math.random() * 12 + 2).toFixed(1),
    description: `Incidencia detectada en ${category}. Usuario reporta problemas de ${impact.toLowerCase()} impacto. Se requiere investigación y resolución inmediata según procedimientos ITIL.`,
    rootCause: null,
    resolution: null,
    relatedProblem: null
  };

  STATE.incidents.unshift(incident);

  if (!silent) {
    if (priority === "Crítica") {
      playAlert();
      showNotification("¡Incidencia CRÍTICA detectada!");
      addToLiveFeed(`🚨 CRÍTICA → ${incident.id} | ${incident.title}`, true);
    } else {
      addToLiveFeed(`📌 NUEVA → ${incident.id} | ${incident.title}`, false);
    }
    detectRecurrentProblems();
  }

  return incident;
}

function calculatePriority(impact, urgency) {
  // Matriz ITIL de Prioridad (Impacto x Urgencia)
  const matrix = {
    'Alto': { 'Alta': 'Crítica', 'Media': 'Alta', 'Baja': 'Media' },
    'Medio': { 'Alta': 'Alta', 'Media': 'Media', 'Baja': 'Baja' },
    'Bajo': { 'Alta': 'Media', 'Media': 'Baja', 'Baja': 'Baja' }
  };
  return matrix[impact][urgency];
}

function detectRecurrentProblems() {
  ITIL.categories.forEach(category => {
    const openIncidents = STATE.incidents.filter(
      i => i.category === category && i.status === "Abierta"
    ).length;
    
    if (openIncidents >= 5 && !STATE.problems.some(p => p.category === category && p.status === "Activo")) {
      const problem = {
        id: `PRB-${String(STATE.problems.length + 3001).padStart(6, '0')}`,
        title: `Problema Recurrente en ${category}`,
        category,
        incidentCount: openIncidents,
        status: "Activo",
        priority: "Alta",
        rootCause: "Análisis en progreso - IA detectó patrón recurrente",
        workaround: "Reinicio programado cada 6 horas como medida temporal",
        knownError: true,
        createdDate: new Date().toLocaleDateString('es-ES'),
        assignedTo: "Problem Manager",
        relatedIncidents: STATE.incidents
          .filter(i => i.category === category && i.status === "Abierta")
          .map(i => i.id),
        pmImpact: "Alto - Afecta cronograma del proyecto y disponibilidad del servicio"
      };
      
      STATE.problems.push(problem);
      addToLiveFeed(`🔍 PROBLEMA → Detectado en ${category} (${openIncidents} incidencias)`, true);
      showNotification("Nuevo problema identificado");
    }
  });
  
  renderProblemsGrid();
}

function generateInitialProblems() {
  // Los problemas se generan dinámicamente por detectRecurrentProblems()
}

function generateInitialChanges() {
  const changeTypes = ITIL.changeTypes;
  const changeData = [
    {
      title: "Actualización sistema operativo servidores producción",
      type: "Normal",
      category: "Infrastructure",
      risk: "Medio",
      cabStatus: "Aprobado",
      implementationDate: "2025-11-25 22:00",
      pmImpact: "Medio - Requiere ventana de mantenimiento"
    },
    {
      title: "Migración base de datos a nueva versión",
      type: "Normal",
      category: "Data",
      risk: "Alto",
      cabStatus: "En Revisión",
      implementationDate: "2025-12-01 20:00",
      pmImpact: "Alto - Riesgo en ruta crítica del proyecto"
    },
    {
      title: "Parche de seguridad crítico",
      type: "Emergency",
      category: "Security",
      risk: "Alto",
      cabStatus: "Fast-Track",
      implementationDate: "2025-11-19 18:00",
      pmImpact: "Crítico - Requiere implementación inmediata"
    },
    {
      title: "Actualización antivirus corporativo",
      type: "Standard",
      category: "Security",
      risk: "Bajo",
      cabStatus: "Pre-Aprobado",
      implementationDate: "2025-11-20 02:00",
      pmImpact: "Bajo - Cambio estándar"
    }
  ];

  changeData.forEach((change, index) => {
    STATE.changes.push({
      id: `RFC-${String(2001 + index).padStart(6, '0')}`,
      ...change,
      status: change.cabStatus,
      requestedBy: "Change Manager",
      requestDate: new Date().toLocaleDateString('es-ES'),
      approvers: ["CAB Chair", "Technical Lead", "Security Officer"]
    });
  });
}

function generateInitialRisks() {
  const riskData = [
    {
      description: "Retraso en entrega de hardware por proveedor",
      category: "Externo",
      probability: "Alta",
      impact: "Alto",
      strategy: "Mitigar",
      responsible: "PM - Compras"
    },
    {
      description: "Falta de recursos especializados en IA",
      category: "Organizacional",
      probability: "Media",
      impact: "Alto",
      strategy: "Transferir",
      responsible: "PM - RRHH"
    },
    {
      description: "Incompatibilidad con sistemas legacy",
      category: "Técnico",
      probability: "Alta",
      impact: "Medio",
      strategy: "Mitigar",
      responsible: "Arquitecto de Soluciones"
    },
    {
      description: "Cambios en normativas de salud digital",
      category: "Externo",
      probability: "Baja",
      impact: "Muy Alto",
      strategy: "Aceptar",
      responsible: "Legal"
    },
    {
      description: "Sobrecarga del equipo de desarrollo",
      category: "Gerencia de Proyecto",
      probability: "Media",
      impact: "Medio",
      strategy: "Mitigar",
      responsible: "Project Manager"
    }
  ];

  riskData.forEach((risk, index) => {
    const exposure = calculateRiskExposure(risk.probability, risk.impact);
    STATE.risks.push({
      id: `RSK-${String(4001 + index).padStart(6, '0')}`,
      ...risk,
      exposure,
      status: "Activo",
      createdDate: new Date().toLocaleDateString('es-ES'),
      lastReview: new Date().toLocaleDateString('es-ES')
    });
  });
}

function calculateRiskExposure(probability, impact) {
  const probValues = { "Muy Baja": 1, "Baja": 2, "Media": 3, "Alta": 4, "Muy Alta": 5 };
  const impactValues = { "Muy Bajo": 1, "Bajo": 2, "Medio": 3, "Alto": 4, "Muy Alto": 5 };
  const score = probValues[probability] * impactValues[impact];
  
  if (score >= 16) return "Crítica";
  if (score >= 9) return "Alta";
  if (score >= 4) return "Media";
  return "Baja";
}

function generateInitialStakeholders() {
  const stakeholderData = [
    {
      name: "Director General Hospital",
      role: "Sponsor",
      power: "Alto",
      interest: "Alto",
      strategy: "Gestionar Activamente",
      frequency: "Semanal",
      channel: "Reunión Ejecutiva"
    },
    {
      name: "Jefe de Sistemas",
      role: "Cliente",
      power: "Alto",
      interest: "Alto",
      strategy: "Gestionar Activamente",
      frequency: "Diaria",
      channel: "Email / Teams"
    },
    {
      name: "Usuario Final - Médicos",
      role: "Usuario",
      power: "Bajo",
      interest: "Alto",
      strategy: "Mantener Informado",
      frequency: "Mensual",
      channel: "Newsletter"
    },
    {
      name: "Proveedor de Hardware",
      role: "Proveedor",
      power: "Medio",
      interest: "Medio",
      strategy: "Mantener Satisfecho",
      frequency: "Quincenal",
      channel: "Email"
    },
    {
      name: "Regulador de Salud",
      role: "Regulador",
      power: "Alto",
      interest: "Medio",
      strategy: "Mantener Satisfecho",
      frequency: "Trimestral",
      channel: "Reporte Formal"
    }
  ];

  STATE.stakeholders = stakeholderData;
}

// ==================== DASHBOARD UPDATE ====================
function updateDashboard() {
  // ITIL Metrics
  const activeIncidents = STATE.incidents.filter(
    i => i.status === "Abierta" || i.status === "En Progreso"
  ).length;
  const criticalIncidents = STATE.incidents.filter(
    i => i.priority === "Crítica" && i.status !== "Resuelta"
  ).length;
  const avgMttr = (STATE.incidents.reduce((sum, i) => sum + parseFloat(i.mttr), 0) / STATE.incidents.length).toFixed(1);

  document.getElementById('stat-incidents').textContent = activeIncidents;
  document.getElementById('stat-critical').textContent = criticalIncidents;
  document.getElementById('stat-mttr').textContent = avgMttr + 'h';
  document.getElementById('incidents-badge').textContent = activeIncidents;
  document.getElementById('problems-badge').textContent = STATE.problems.filter(p => p.status === "Activo").length;

  // PMBOK Metrics
  const cpi = STATE.projectData.cpi.toFixed(2);
  const spi = STATE.projectData.spi.toFixed(2);
  
  document.getElementById('stat-cpi').textContent = cpi;
  document.getElementById('stat-spi').textContent = spi;
}

// ==================== RENDER FUNCTIONS ====================
function renderIncidentsTable() {
  const tbody = document.getElementById('incidents-tbody');
  const displayIncidents = STATE.incidents.slice(0, 30);
  
  tbody.innerHTML = displayIncidents.map(inc => `
    <tr onclick="showIncidentDetail('${inc.id}')">
      <td><strong>${inc.id}</strong></td>
      <td>${inc.date}<br><small style="color: #64748b;">${inc.time}</small></td>
      <td>${inc.title}</td>
      <td>${inc.category}</td>
      <td><span class="priority-badge priority-${inc.priority.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}">${inc.priority}</span></td>
      <td><span class="status-badge status-${inc.status.toLowerCase().replace(/ /g, '-')}">${inc.status}</span></td>
      <td>${inc.assignedGroup}</td>
      <td><span style="color: ${inc.sla ? '#10b981' : '#ef4444'}; font-weight: 600;">${inc.sla ? '✓ OK' : '✗ Incumplido'}</span></td>
      <td><button class="action-btn">Ver</button></td>
    </tr>
  `).join('');
  
  addToLiveFeed(`🔍 Filtro aplicado: ${filter}`, false);
}

// ==================== LIVE FEED ====================
function addToLiveFeed(message, isCritical = false) {
  const feed = document.getElementById('live-feed');
  if (!feed) return;
  
  const item = document.createElement('div');
  item.className = `feed-item ${isCritical ? 'critical' : ''}`;
  item.innerHTML = `
    <div class="feed-time">[${new Date().toLocaleTimeString('es-ES')}]</div>
    <div class="feed-message">${message}</div>
  `;
  
  feed.insertBefore(item, feed.firstChild);
  
  // Limitar a 100 items
  while (feed.children.length > 100) {
    feed.removeChild(feed.lastChild);
  }
}

function showNotification(message) {
  STATE.notificationCount++;
  const dot = document.getElementById('notification-dot');
  if (dot) dot.style.display = 'block';
  addToLiveFeed(`🔔 ${message}`, false);
}

function playAlert() {
  const audio = document.getElementById('alert-sound');
  if (audio) {
    audio.play().catch(() => {
      console.log('Audio playback prevented by browser');
    });
  }
}

// ==================== AUTO UPDATES ====================
function startAutoUpdates() {
  // Generar nueva incidencia cada 8 segundos
  setInterval(() => {
    if (Math.random() < 0.3) { // 30% de probabilidad
      generateAutoIncident(false);
    }
  }, 8000);

  // Actualizar dashboard cada 5 segundos
  setInterval(() => {
    updateDashboard();
  }, 5000);

  // Actualizar gráficos cada 15 segundos
  setInterval(() => {
    updateCharts();
  }, 15000);

  // Detectar problemas cada 10 segundos
  setInterval(() => {
    detectRecurrentProblems();
  }, 10000);
}

function updateCharts() {
  // Actualizar gráfico de prioridades
  if (STATE.charts.incidentsPriority) {
    STATE.charts.incidentsPriority.data.datasets[0].data = ITIL.priorities.map(p => 
      STATE.incidents.filter(i => i.priority === p).length
    );
    STATE.charts.incidentsPriority.update('none');
  }

  // Actualizar gráfico SLA
  if (STATE.charts.sla) {
    STATE.charts.sla.data.datasets[0].data = ITIL.categories.map(cat => {
      const catIncidents = STATE.incidents.filter(i => i.category === cat);
      const compliant = catIncidents.filter(i => i.sla).length;
      return catIncidents.length > 0 ? ((compliant / catIncidents.length) * 100).toFixed(1) : 0;
    });
    STATE.charts.sla.update('none');
  }
}

// ==================== RISK MATRIX RENDERING ====================
function renderRiskMatrix() {
  const container = document.getElementById('risk-matrix');
  if (!container) return;

  const matrix = [];
  for (let prob = 5; prob >= 1; prob--) {
    for (let impact = 1; impact <= 5; impact++) {
      const score = prob * impact;
      let level = 'low';
      if (score >= 16) level = 'high';
      else if (score >= 9) level = 'medium';
      else if (score >= 4) level = 'medium';
      
      const riskCount = STATE.risks.filter(r => {
        const probValues = { "Muy Baja": 1, "Baja": 2, "Media": 3, "Alta": 4, "Muy Alta": 5 };
        const impactValues = { "Muy Bajo": 1, "Bajo": 2, "Medio": 3, "Alto": 4, "Muy Alto": 5 };
        return probValues[r.probability] === prob && impactValues[r.impact] === impact;
      }).length;
      
      matrix.push(`
        <div class="risk-cell ${level}" title="P:${prob} I:${impact}">
          ${riskCount > 0 ? riskCount : ''}
        </div>
      `);
    }
  }

  container.innerHTML = matrix.join('');
}

// ==================== STAKEHOLDER MATRIX RENDERING ====================
function renderStakeholderMatrix() {
  const container = document.getElementById('stakeholder-matrix');
  if (!container) return;

  const powerInterestMap = {
    'Alto-Alto': { x: 75, y: 75 },
    'Alto-Medio': { x: 75, y: 50 },
    'Alto-Bajo': { x: 75, y: 25 },
    'Medio-Alto': { x: 50, y: 75 },
    'Medio-Medio': { x: 50, y: 50 },
    'Medio-Bajo': { x: 50, y: 25 },
    'Bajo-Alto': { x: 25, y: 75 },
    'Bajo-Medio': { x: 25, y: 50 },
    'Bajo-Bajo': { x: 25, y: 25 }
  };

  container.innerHTML = `
    <div class="stakeholder-axis x">→ Interés</div>
    <div class="stakeholder-axis y">↑ Poder</div>
    ${STATE.stakeholders.map((sh, index) => {
      const key = `${sh.power}-${sh.interest}`;
      const pos = powerInterestMap[key] || { x: 50, y: 50 };
      return `
        <div class="stakeholder-point" 
             style="left: ${pos.x}%; top: ${100 - pos.y}%;"
             title="${sh.name} - ${sh.role}">
          ${sh.name.split(' ').map(w => w[0]).join('')}
        </div>
      `;
    }).join('')}
  `;
}

// ==================== UTILITY FUNCTIONS ====================
function formatCurrency(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function calculatePercentage(value, total) {
  return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
}

// ==================== EXPORT FUNCTIONS ====================
function exportToPDF() {
  addToLiveFeed('📄 Generando reporte PDF...', false);
  showNotification('Reporte PDF en generación');
  
  setTimeout(() => {
    addToLiveFeed('✅ Reporte PDF generado exitosamente', false);
  }, 2000);
}

function exportToExcel() {
  addToLiveFeed('📊 Exportando datos a Excel...', false);
  showNotification('Exportación Excel en proceso');
  
  setTimeout(() => {
    addToLiveFeed('✅ Datos exportados a Excel exitosamente', false);
  }, 1500);
}

// ==================== ITIL SERVICE VALUE CHAIN INTERACTIONS ====================
document.querySelectorAll('.chain-item').forEach(item => {
  item.addEventListener('click', () => {
    const stage = item.getAttribute('data-stage');
    const stageNames = {
      'plan': 'Plan',
      'design': 'Design & Transition',
      'obtain': 'Obtain/Build',
      'deliver': 'Deliver & Support',
      'improve': 'Improve'
    };
    
    addToLiveFeed(`🔄 ITIL Service Value Chain: Accediendo a ${stageNames[stage]}`, false);
    showNotification(`Etapa ${stageNames[stage]} seleccionada`);
  });
});

// ==================== REPORT GENERATION ====================
document.querySelectorAll('.btn-report').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const reportType = e.target.closest('.report-card').querySelector('h3').textContent;
    addToLiveFeed(`📋 Generando: ${reportType}`, false);
    showNotification(`Reporte "${reportType}" en proceso`);
    
    setTimeout(() => {
      addToLiveFeed(`✅ ${reportType} generado exitosamente`, false);
    }, 2000);
  });
});

// ==================== INTEGRATION MATRIX INTERACTIONS ====================
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('integration-cell')) {
    const level = e.target.className.split(' ')[1];
    const levelNames = {
      'strong': 'Fuerte',
      'medium': 'Media',
      'weak': 'Débil',
      'none': 'Ninguna'
    };
    
    addToLiveFeed(`🔗 Integración ${levelNames[level]} detectada`, false);
  }
});

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + N = Nueva incidencia
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    document.getElementById('modal-new-incident')?.classList.add('active');
    addToLiveFeed('⌨️ Atajo de teclado: Nueva Incidencia', false);
  }
  
  // Escape = Cerrar modal
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }
});

// ==================== PERFORMANCE MONITORING ====================
function monitorPerformance() {
  const metrics = {
    incidentResolutionRate: (STATE.incidents.filter(i => i.status === 'Resuelta').length / STATE.incidents.length * 100).toFixed(1),
    averageMTTR: (STATE.incidents.reduce((sum, i) => sum + parseFloat(i.mttr), 0) / STATE.incidents.length).toFixed(1),
    slaCompliance: (STATE.incidents.filter(i => i.sla).length / STATE.incidents.length * 100).toFixed(1),
    activeProblems: STATE.problems.filter(p => p.status === 'Activo').length,
    activeRisks: STATE.risks.filter(r => r.status === 'Activo').length,
    projectCPI: STATE.projectData.cpi,
    projectSPI: STATE.projectData.spi
  };
  
  return metrics;
}

// ==================== CONSOLE LOGGING ====================
console.log('%c🚀 NEXUS Pro - Sistema Integrado ITIL + PMBOK', 'color: #0066cc; font-size: 20px; font-weight: bold;');
console.log('%c📊 Sistema inicializado correctamente', 'color: #28a745; font-size: 14px;');
console.log('%cITIL v4 Service Management ✓', 'color: #0066cc;');
console.log('%cPMBOK 7 Project Management ✓', 'color: #28a745;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #64748b;');

// ==================== FINAL INITIALIZATION ====================
// Renderizar matrices adicionales
setTimeout(() => {
  renderRiskMatrix();
  renderStakeholderMatrix();
}, 1000);

// Mensaje de bienvenida en feed
setTimeout(() => {
  addToLiveFeed('👋 Bienvenido al Sistema NEXUS Pro', false);
  addToLiveFeed('🔄 Integración ITIL v4 + PMBOK 7 activa', false);
  addToLiveFeed('📡 Monitoreo en tiempo real habilitado', false);
  addToLiveFeed('🤖 Motor de IA para detección de patrones activado', false);
}, 500);

// ==================== ADVANCED ANALYTICS ====================
function generateAdvancedAnalytics() {
  const analytics = {
    itil: {
      incidentTrend: calculateTrend(STATE.incidents),
      problemRecurrence: calculateProblemRecurrence(),
      changeSuccessRate: calculateChangeSuccessRate(),
      slaPerformance: calculateSLAPerformance()
    },
    pmbok: {
      scheduleVariance: STATE.projectData.ev - STATE.projectData.pv,
      costVariance: STATE.projectData.ev - STATE.projectData.ac,
      estimateAtCompletion: calculateEAC(),
      varianceAtCompletion: calculateVAC(),
      toCompletePerformanceIndex: calculateTCPI()
    },
    integration: {
      itilImpactOnSchedule: assessITILImpactOnSchedule(),
      riskCorrelation: assessRiskCorrelation(),
      qualityMetrics: assessQualityMetrics()
    }
  };
  
  return analytics;
}

function calculateTrend(data) {
  // Calcular tendencia de incidencias en los últimos 7 días
  const last7Days = data.filter(i => {
    const days = Math.floor((new Date().getTime() - i.timestamp) / (1000 * 60 * 60 * 24));
    return days <= 7;
  });
  
  return {
    total: last7Days.length,
    critical: last7Days.filter(i => i.priority === 'Crítica').length,
    trend: last7Days.length > data.length * 0.2 ? 'Ascendente' : 'Estable'
  };
}

function calculateProblemRecurrence() {
  return {
    total: STATE.problems.length,
    active: STATE.problems.filter(p => p.status === 'Activo').length,
    resolved: STATE.problems.filter(p => p.status === 'Resuelto').length
  };
}

function calculateChangeSuccessRate() {
  const successful = STATE.changes.filter(c => c.status === 'Aprobado').length;
  return (successful / STATE.changes.length * 100).toFixed(1);
}

function calculateSLAPerformance() {
  const compliant = STATE.incidents.filter(i => i.sla).length;
  return (compliant / STATE.incidents.length * 100).toFixed(1);
}

function calculateEAC() {
  // Estimate at Completion = BAC / CPI
  return (STATE.projectData.budget / STATE.projectData.cpi).toFixed(0);
}

function calculateVAC() {
  // Variance at Completion = BAC - EAC
  const eac = calculateEAC();
  return (STATE.projectData.budget - eac).toFixed(0);
}

function calculateTCPI() {
  // To Complete Performance Index
  const workRemaining = STATE.projectData.budget - STATE.projectData.ev;
  const fundsRemaining = STATE.projectData.budget - STATE.projectData.ac;
  return (workRemaining / fundsRemaining).toFixed(2);
}

function assessITILImpactOnSchedule() {
  const criticalIncidents = STATE.incidents.filter(i => i.priority === 'Crítica').length;
  if (criticalIncidents > 5) return 'Alto - Múltiples incidencias críticas afectan el cronograma';
  if (criticalIncidents > 2) return 'Medio - Algunas incidencias impactan actividades';
  return 'Bajo - Incidencias bajo control';
}

function assessRiskCorrelation() {
  const highRisks = STATE.risks.filter(r => r.exposure === 'Crítica' || r.exposure === 'Alta').length;
  const criticalIncidents = STATE.incidents.filter(i => i.priority === 'Crítica').length;
  
  if (highRisks > 3 && criticalIncidents > 5) {
    return 'Alta correlación - Riesgos materializándose en incidencias';
  }
  return 'Correlación moderada - Gestión de riesgos efectiva';
}

function assessQualityMetrics() {
  return {
    defectDensity: (23 / 1000).toFixed(3), // defectos por línea de código
    testCoverage: 94.2,
    codeReviewCompletion: 100,
    automatedTestPass: 96.8
  };
}

// ==================== DASHBOARD REFRESH ====================
function refreshDashboard() {
  updateDashboard();
  renderIncidentsTable();
  renderProblemsGrid();
  renderChangesTable();
  renderRisksTable();
  renderStakeholdersTable();
  updateCharts();
  
  addToLiveFeed('🔄 Dashboard actualizado', false);
}

// Exponer funciones globales necesarias
window.showIncidentDetail = showIncidentDetail;
window.createNewIncident = createNewIncident;
window.resolveCurrentIncident = resolveCurrentIncident;
window.escalateToProblem = escalateToProblem;
window.exportToPDF = exportToPDF;
window.exportToExcel = exportToExcel;
window.refreshDashboard = refreshDashboard;
window.generateAdvancedAnalytics = generateAdvancedAnalytics;

// ==================== END OF SCRIPT ====================
console.log('%c✅ Todos los módulos cargados correctamente', 'color: #10b981; font-weight: bold;');
console.log('%c💡 Tip: Usa Ctrl+N para crear una nueva incidencia rápidamente', 'color: #3b82f6;');
console.log('%c📊 Usa generateAdvancedAnalytics() en consola para ver analíticas avanzadas', 'color: #f59e0b;'); priority-${inc.impact.toLowerCase()}">${inc.impact}</span></td>
      <td><span class="priority-badge priority-${inc.urgency.toLowerCase()}">${inc.urgency}</span></td>
      <td><span class="priority-badge priority-${inc.priority.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}">${inc.priority}</span></td>
      <td><span class="status-badge status-${inc.status.toLowerCase().replace(/ /g, '-')}">${inc.status}</span></td>
      <td>${inc.assignedGroup}</td>
      <td><span style="color: ${inc.sla ? '#10b981' : '#ef4444'}; font-weight: 600;">${inc.sla ? '✓ OK' : '✗ Incumplido'}</span></td>
      <td><button class="action-btn">Ver</button></td>
    </tr>
  `).join('');
}

function renderProblemsGrid() {
  const container = document.getElementById('problems-list');
  
  if (STATE.problems.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px; color: #64748b;">
        <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 20px; color: #10b981;"></i>
        <h3 style="color: #cbd5e1;">No hay problemas recurrentes detectados</h3>
        <p>El sistema IA está monitoreando continuamente patrones de incidencias</p>
      </div>
    `;
    return;
  }

  container.innerHTML = STATE.problems.map(prob => `
    <div class="problem-card">
      <div class="problem-header">
        <h3 class="problem-title">${prob.id} - ${prob.title}</h3>
        <span class="status-badge status-${prob.status.toLowerCase()}">${prob.status}</span>
      </div>
      <div class="problem-info">
        <div class="problem-info-item">
          <span class="problem-label">Categoría ITIL</span>
          <span class="problem-value">${prob.category}</span>
        </div>
        <div class="problem-info-item">
          <span class="problem-label">Incidencias Relacionadas</span>
          <span class="problem-value">${prob.incidentCount}</span>
        </div>
        <div class="problem-info-item">
          <span class="problem-label">Prioridad</span>
          <span class="problem-value">${prob.priority}</span>
        </div>
        <div class="problem-info-item">
          <span class="problem-label">Known Error</span>
          <span class="problem-value">${prob.knownError ? 'Sí' : 'No'}</span>
        </div>
      </div>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(100, 116, 139, 0.2);">
        <p style="color: #cbd5e1; margin-bottom: 8px;"><strong>Causa Raíz:</strong> ${prob.rootCause}</p>
        <p style="color: #cbd5e1; margin-bottom: 8px;"><strong>Workaround:</strong> ${prob.workaround}</p>
        <p style="color: #f59e0b;"><strong>Impacto en Proyecto (PMBOK):</strong> ${prob.pmImpact}</p>
      </div>
    </div>
  `).join('');
}

function renderChangesTable() {
  const tbody = document.getElementById('changes-tbody');
  
  tbody.innerHTML = STATE.changes.map(chg => `
    <tr>
      <td><strong>${chg.id}</strong></td>
      <td>${chg.title}</td>
      <td><span class="priority-badge priority-${chg.type.toLowerCase()}">${chg.type}</span></td>
      <td>${chg.category}</td>
      <td><span class="priority-badge priority-${chg.risk.toLowerCase()}">${chg.risk}</span></td>
      <td><span class="status-badge">${chg.cabStatus}</span></td>
      <td>${chg.implementationDate}</td>
      <td style="color: ${chg.pmImpact.startsWith('Crítico') ? '#ef4444' : chg.pmImpact.startsWith('Alto') ? '#f59e0b' : '#3b82f6'};">${chg.pmImpact}</td>
      <td><button class="action-btn">Gestionar</button></td>
    </tr>
  `).join('');
}

function renderRisksTable() {
  const tbody = document.getElementById('risks-tbody');
  
  tbody.innerHTML = STATE.risks.map(risk => `
    <tr>
      <td><strong>${risk.id}</strong></td>
      <td>${risk.description}</td>
      <td>${risk.category}</td>
      <td><span class="priority-badge">${risk.probability}</span></td>
      <td><span class="priority-badge">${risk.impact}</span></td>
      <td><span class="priority-badge priority-${risk.exposure.toLowerCase()}">${risk.exposure}</span></td>
      <td>${risk.strategy}</td>
      <td>${risk.responsible}</td>
      <td><span class="status-badge status-${risk.status.toLowerCase()}">${risk.status}</span></td>
    </tr>
  `).join('');
}

function renderStakeholdersTable() {
  const tbody = document.getElementById('stakeholders-tbody');
  
  tbody.innerHTML = STATE.stakeholders.map(sh => `
    <tr>
      <td><strong>${sh.name}</strong></td>
      <td>${sh.role}</td>
      <td><span class="priority-badge priority-${sh.power.toLowerCase()}">${sh.power}</span></td>
      <td><span class="priority-badge priority-${sh.interest.toLowerCase()}">${sh.interest}</span></td>
      <td>${sh.strategy}</td>
      <td>${sh.frequency}</td>
      <td>${sh.channel}</td>
    </tr>
  `).join('');
}

function renderWBS() {
  const wbsContainer = document.getElementById('wbs-container');
  
  const wbsData = [
    { level: 0, name: "1.0 Proyecto Sistema Hospitalario IA", progress: 67 },
    { level: 1, name: "1.1 Iniciación", progress: 100 },
    { level: 1, name: "1.2 Planificación", progress: 100 },
    { level: 1, name: "1.3 Ejecución", progress: 65 },
    { level: 2, name: "1.3.1 Desarrollo Backend", progress: 80 },
    { level: 2, name: "1.3.2 Desarrollo Frontend", progress: 70 },
    { level: 2, name: "1.3.3 Integración IA", progress: 45 },
    { level: 1, name: "1.4 Monitoreo y Control", progress: 60 },
    { level: 1, name: "1.5 Cierre", progress: 0 }
  ];

  wbsContainer.innerHTML = wbsData.map(item => `
    <div class="wbs-item" style="margin-left: ${item.level * 30}px;">
      <span class="wbs-name">${item.name}</span>
      <div class="wbs-progress">
        <div class="wbs-progress-bar">
          <div class="wbs-progress-fill" style="width: ${item.progress}%"></div>
        </div>
        <span class="wbs-percent">${item.progress}%</span>
      </div>
    </div>
  `).join('');
}

function renderGanttChart() {
  const ganttContainer = document.getElementById('gantt-chart');
  
  const tasks = [
    { name: "Análisis de Requisitos", start: 0, duration: 15, critical: false },
    { name: "Diseño de Arquitectura", start: 15, duration: 20, critical: true },
    { name: "Desarrollo Backend", start: 35, duration: 60, critical: true },
    { name: "Desarrollo Frontend", start: 35, duration: 50, critical: false },
    { name: "Integración IA", start: 95, duration: 40, critical: true },
    { name: "Testing y QA", start: 135, duration: 30, critical: true },
    { name: "Capacitación", start: 150, duration: 20, critical: false },
    { name: "Despliegue", start: 165, duration: 10, critical: true }
  ];

  ganttContainer.innerHTML = tasks.map(task => `
    <div class="gantt-row">
      <div class="gantt-task-name">${task.name}</div>
      <div class="gantt-timeline">
        <div class="gantt-bar ${task.critical ? 'critical' : ''}" 
             style="left: ${(task.start / 180) * 100}%; width: ${(task.duration / 180) * 100}%;">
          ${task.duration}d
        </div>
      </div>
    </div>
  `).join('');
}

function renderIntegrationMatrix() {
  const container = document.getElementById('integration-matrix');
  
  const itilProcesses = [
    "Incident Management",
    "Problem Management",
    "Change Management",
    "Release Management"
  ];

  const pmbokAreas = [
    "Alcance", "Cronograma", "Costos", "Calidad", "Riesgos"
  ];

  // Matriz de integración (strong, medium, weak, none)
  const matrix = [
    ["medium", "strong", "weak", "medium", "strong"],    // Incident
    ["strong", "strong", "medium", "strong", "strong"],  // Problem
    ["strong", "strong", "strong", "medium", "strong"],  // Change
    ["strong", "strong", "medium", "strong", "medium"]   // Release
  ];

  let html = '<table class="integration-table"><thead><tr><th>ITIL \\ PMBOK</th>';
  pmbokAreas.forEach(area => {
    html += `<th>${area}</th>`;
  });
  html += '</tr></thead><tbody>';

  itilProcesses.forEach((process, i) => {
    html += `<tr><th>${process}</th>`;
    matrix[i].forEach(level => {
      html += `<td><div class="integration-cell ${level}" title="${level}"></div></td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderKPIDashboard() {
  const container = document.getElementById('kpi-dashboard');
  
  const kpis = [
    {
      name: "Incident Resolution Rate",
      category: "ITIL",
      value: "94.2%",
      trend: "+2.1%",
      positive: true,
      target: "95%"
    },
    {
      name: "MTTR (Mean Time To Repair)",
      category: "ITIL",
      value: "2.4h",
      trend: "-15%",
      positive: true,
      target: "< 3h"
    },
    {
      name: "CPI (Cost Performance Index)",
      category: "PMBOK",
      value: "1.08",
      trend: "+0.03",
      positive: true,
      target: "> 1.0"
    },
    {
      name: "SPI (Schedule Performance Index)",
      category: "PMBOK",
      value: "0.96",
      trend: "-0.02",
      positive: false,
      target: "> 1.0"
    },
    {
      name: "Change Success Rate",
      category: "ITIL",
      value: "98.5%",
      trend: "+1.2%",
      positive: true,
      target: "> 95%"
    },
    {
      name: "Risk Mitigation Rate",
      category: "PMBOK",
      value: "87%",
      trend: "+5%",
      positive: true,
      target: "> 80%"
    }
  ];

  container.innerHTML = kpis.map(kpi => `
    <div class="kpi-card ${kpi.category.toLowerCase()}">
      <div class="kpi-header">
        <span class="kpi-name">${kpi.name}</span>
        <span class="kpi-category ${kpi.category.toLowerCase()}-badge">${kpi.category}</span>
      </div>
      <div class="kpi-body">
        <div class="kpi-value-large">${kpi.value}</div>
        <div class="kpi-trend ${kpi.positive ? 'positive' : 'negative'}">
          <i class="fas fa-arrow-${kpi.positive ? 'up' : 'down'}"></i>
          <span>${kpi.trend} vs mes anterior</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span>Target: ${kpi.target}</span>
        <span>${kpi.positive ? '✓ On Track' : '⚠ At Risk'}</span>
      </div>
    </div>
  `).join('');
}

function renderReleasesTimeline() {
  const container = document.getElementById('releases-timeline');
  
  const releases = [
    {
      version: "v1.0 - MVP",
      date: "15 Marzo 2025",
      status: "Completado",
      description: " + value + 'K' }, 
          grid: { color: 'rgba(100, 116, 139, 0.1)' }
        },
        x: { 
          ticks: { color: '#64748b' }, 
          grid: { display: false } 
        }
      }
    }
  });
}

function createCostDistributionChart() {
  const ctx = document.getElementById('chart-cost-distribution').getContext('2d');
  
  STATE.charts.costDistribution = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Personal', 'Hardware', 'Software', 'Servicios', 'Capacitación', 'Otros'],
      datasets: [{
        data: [450, 280, 195, 150, 85, 40],
        backgroundColor: [
          '#0066cc',
          '#28a745',
          '#f59e0b',
          '#3b82f6',
          '#8b5cf6',
          '#64748b'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#cbd5e1', font: { size: 12 } }
        }
      }
    }
  });
}

function createQualityChart() {
  const ctx = document.getElementById('chart-quality').getContext('2d');
  
  STATE.charts.quality = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6'],
      datasets: [
        {
          label: 'Tests Aprobados %',
          data: [88, 90, 92, 93, 94, 94.2],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3
        },
        {
          label: 'Defectos Abiertos',
          data: [45, 38, 32, 28, 25, 23],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#cbd5e1' } }
      },
      scales: {
        y: { 
          ticks: { color: '#64748b' }, 
          grid: { color: 'rgba(100, 116, 139, 0.1)' }
        },
        x: { 
          ticks: { color: '#64748b' }, 
          grid: { display: false } 
        }
      }
    }
  });
}

// ==================== NAVIGATION ====================
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.view-section');
  const pageTitle = document.getElementById('page-title');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      const viewId = item.getAttribute('data-view');
      sections.forEach(section => section.classList.remove('active'));
      document.getElementById(viewId).classList.add('active');

      const titles = {
        'dashboard': 'Dashboard Ejecutivo',
        'incidents': 'ITIL Incident Management',
        'problems': 'ITIL Problem Management',
        'changes': 'ITIL Change Management',
        'releases': 'ITIL Release Management',
        'scope': 'Gestión del Alcance - PMBOK',
        'schedule': 'Gestión del Cronograma - PMBOK',
        'costs': 'Gestión de Costos - PMBOK',
        'quality': 'Gestión de Calidad - PMBOK',
        'risks': 'Gestión de Riesgos - PMBOK',
        'stakeholders': 'Gestión de Interesados - PMBOK',
        'integration': 'Matriz de Integración ITIL + PMBOK',
        'kpis': 'KPIs y Métricas Integradas',
        'reports': 'Reportes Ejecutivos'
      };
      
      pageTitle.textContent = titles[viewId] || 'NEXUS Pro';
      
      addToLiveFeed(`📊 Navegando a: ${titles[viewId]}`, false);
    });
  });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Modal handlers
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      document.getElementById(modalId).classList.remove('active');
    });
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      document.getElementById(modalId).classList.remove('active');
    });
  });

  // Close modal on outside click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // New incident button
  const btnNewIncident = document.getElementById('btn-new-incident');
  if (btnNewIncident) {
    btnNewIncident.addEventListener('click', () => {
      document.getElementById('modal-new-incident').classList.add('active');
    });
  }

  // Submit new incident
  const btnSubmitIncident = document.getElementById('btn-submit-incident');
  if (btnSubmitIncident) {
    btnSubmitIncident.addEventListener('click', () => {
      createNewIncident();
    });
  }

  // Resolve incident button
  const btnResolveIncident = document.getElementById('btn-resolve-incident');
  if (btnResolveIncident) {
    btnResolveIncident.addEventListener('click', () => {
      resolveCurrentIncident();
    });
  }

  // Escalate to problem button
  const btnEscalateProblem = document.getElementById('btn-escalate-problem');
  if (btnEscalateProblem) {
    btnEscalateProblem.addEventListener('click', () => {
      escalateToProblem();
    });
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(b => 
        b.classList.remove('active')
      );
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      filterIncidents(filter);
    });
  });

  // Search functionality
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length > 2) {
        addToLiveFeed(`🔍 Búsqueda: "${query}"`, false);
      }
    });
  }

  // Notification button
  const notifBtn = document.getElementById('notification-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      STATE.notificationCount = 0;
      const dot = document.getElementById('notification-dot');
      if (dot) dot.style.display = 'none';
      addToLiveFeed('✅ Notificaciones marcadas como leídas', false);
    });
  }
}

// ==================== INCIDENT MANAGEMENT ====================
let currentIncidentId = null;

function showIncidentDetail(incidentId) {
  const incident = STATE.incidents.find(i => i.id === incidentId);
  if (!incident) return;

  currentIncidentId = incidentId;
  const modal = document.getElementById('modal-incident');
  const modalBody = document.getElementById('modal-incident-body');
  
  modalBody.innerHTML = `
    <div style="background: rgba(15, 23, 42, 0.5); padding: 25px; border-radius: 16px; margin-bottom: 20px;">
      <h3 style="color: #fff; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
        <i class="fas fa-ticket-alt" style="color: #0066cc;"></i>
        ${incident.id} - ${incident.title}
      </h3>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
        <div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 5px; font-weight: 600;">CATEGORÍA ITIL</p>
          <p style="color: #cbd5e1; font-weight: 600; font-size: 15px;">${incident.category}</p>
        </div>
        <div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 5px; font-weight: 600;">FECHA Y HORA</p>
          <p style="color: #cbd5e1; font-weight: 600; font-size: 15px;">${incident.date} ${incident.time}</p>
        </div>
        <div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 5px; font-weight: 600;">IMPACTO</p>
          <span class="priority-badge priority-${incident.impact.toLowerCase()}">${incident.impact}</span>
        </div>
        <div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 5px; font-weight: 600;">URGENCIA</p>
          <span class="priority-badge priority-${incident.urgency.toLowerCase()}">${incident.urgency}</span>
        </div>
        <div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 5px; font-weight: 600;">PRIORIDAD CALCULADA</p>
          <span class="priority-badge priority-${incident.priority.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}">${incident.priority}</span>
        </div>
        <div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 5px; font-weight: 600;">ESTADO ACTUAL</p>
          <span class="status-badge status-${incident.status.toLowerCase().replace(/ /g, '-')}">${incident.status}</span>
        </div>
        <div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 5px; font-weight: 600;">GRUPO ASIGNADO</p>
          <p style="color: #cbd5e1; font-weight: 600; font-size: 15px;">${incident.assignedGroup}</p>
        </div>
        <div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 5px; font-weight: 600;">TÉCNICO</p>
          <p style="color: #cbd5e1; font-weight: 600; font-size: 15px;">${incident.assignedTo}</p>
        </div>
      </div>

      <div style="padding: 20px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; margin-bottom: 20px;">
        <h4 style="color: #cbd5e1; margin-bottom: 10px; font-size: 14px; font-weight: 700;">
          <i class="fas fa-clock"></i> MÉTRICAS SLA
        </h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
          <div>
            <p style="color: #64748b; font-size: 11px; margin-bottom: 5px;">SLA TARGET</p>
            <p style="color: #cbd5e1; font-weight: 700;">${incident.slaTarget}h</p>
          </div>
          <div>
            <p style="color: #64748b; font-size: 11px; margin-bottom: 5px;">MTTR ACTUAL</p>
            <p style="color: #cbd5e1; font-weight: 700;">${incident.mttr}h</p>
          </div>
          <div>
            <p style="color: #64748b; font-size: 11px; margin-bottom: 5px;">CUMPLIMIENTO</p>
            <p style="color: ${incident.sla ? '#10b981' : '#ef4444'}; font-weight: 700;">
              ${incident.sla ? '✓ Cumplido' : '✗ Incumplido'}
            </p>
          </div>
        </div>
      </div>

      <div style="padding: 20px; background: rgba(30, 41, 59, 0.5); border-radius: 12px;">
        <h4 style="color: #cbd5e1; margin-bottom: 10px; font-size: 14px; font-weight: 700;">
          <i class="fas fa-info-circle"></i> DESCRIPCIÓN
        </h4>
        <p style="color: #94a3b8; line-height: 1.6;">${incident.description}</p>
      </div>

      ${incident.relatedProblem ? `
        <div style="padding: 20px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; margin-top: 15px;">
          <h4 style="color: #ef4444; margin-bottom: 10px; font-size: 14px; font-weight: 700;">
            <i class="fas fa-link"></i> PROBLEMA RELACIONADO
          </h4>
          <p style="color: #cbd5e1;">${incident.relatedProblem}</p>
        </div>
      ` : ''}
    </div>

    <div style="padding: 20px; background: rgba(40, 167, 69, 0.1); border: 1px solid rgba(40, 167, 69, 0.3); border-radius: 16px;">
      <h4 style="color: #28a745; margin-bottom: 12px; font-size: 14px; font-weight: 700;">
        <i class="fas fa-project-diagram"></i> IMPACTO EN PROYECTO (PMBOK)
      </h4>
      <p style="color: #cbd5e1; margin-bottom: 10px;">
        <strong>Área de Conocimiento Afectada:</strong> ${incident.priority === 'Crítica' ? 'Cronograma, Calidad, Riesgos' : 'Calidad'}
      </p>
      <p style="color: #cbd5e1; margin-bottom: 10px;">
        <strong>Impacto en CPI:</strong> ${incident.priority === 'Crítica' ? 'Alto - Requiere recursos adicionales' : 'Bajo'}
      </p>
      <p style="color: #cbd5e1;">
        <strong>Impacto en SPI:</strong> ${incident.priority === 'Crítica' ? 'Alto - Posible retraso en entregables' : 'Bajo - No afecta ruta crítica'}
      </p>
    </div>
  `;
  
  modal.classList.add('active');
}

function createNewIncident() {
  const title = document.getElementById('incident-title').value;
  const category = document.getElementById('incident-category').value;
  const impact = document.getElementById('incident-impact').value;
  const urgency = document.getElementById('incident-urgency').value;
  const group = document.getElementById('incident-group').value;
  const description = document.getElementById('incident-description').value;

  if (!title) {
    alert('Por favor ingrese un título para la incidencia');
    return;
  }

  const priority = calculatePriority(impact, urgency);

  const incident = {
    id: `INC-${String(STATE.incidents.length + 10001).padStart(6, '0')}`,
    title,
    category,
    impact,
    urgency,
    priority,
    status: "Abierta",
    assignedGroup: group,
    assignedTo: `Técnico ${Math.floor(Math.random() * 20) + 1}`,
    date: new Date().toLocaleDateString('es-ES'),
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().getTime(),
    sla: true,
    slaTarget: priority === "Crítica" ? 2 : priority === "Alta" ? 4 : 8,
    mttr: 0,
    description: description || `Incidencia registrada manualmente en ${category}`,
    rootCause: null,
    resolution: null,
    relatedProblem: null
  };

  STATE.incidents.unshift(incident);
  
  addToLiveFeed(`✅ Nueva incidencia creada: ${incident.id}`, false);
  showNotification("Incidencia creada exitosamente");
  
  document.getElementById('modal-new-incident').classList.remove('active');
  document.getElementById('form-new-incident').reset();
  
  renderIncidentsTable();
  updateDashboard();
  updateCharts();
}

function resolveCurrentIncident() {
  if (!currentIncidentId) return;
  
  const incident = STATE.incidents.find(i => i.id === currentIncidentId);
  if (incident) {
    incident.status = "Resuelta";
    incident.resolution = "Incidencia resuelta exitosamente";
    
    addToLiveFeed(`✅ Incidencia resuelta: ${incident.id}`, false);
    showNotification("Incidencia resuelta");
    
    document.getElementById('modal-incident').classList.remove('active');
    renderIncidentsTable();
    updateDashboard();
    updateCharts();
  }
}

function escalateToProblem() {
  if (!currentIncidentId) return;
  
  const incident = STATE.incidents.find(i => i.id === currentIncidentId);
  if (incident) {
    const problem = {
      id: `PRB-${String(STATE.problems.length + 3001).padStart(6, '0')}`,
      title: `Problema escalado desde ${incident.id}`,
      category: incident.category,
      incidentCount: 1,
      status: "Activo",
      priority: incident.priority,
      rootCause: "En investigación - Escalado desde incidencia",
      workaround: "Por definir",
      knownError: false,
      createdDate: new Date().toLocaleDateString('es-ES'),
      assignedTo: "Problem Manager",
      relatedIncidents: [incident.id],
      pmImpact: "Requiere análisis de impacto en proyecto"
    };
    
    STATE.problems.push(problem);
    incident.relatedProblem = problem.id;
    
    addToLiveFeed(`🔍 Problema creado desde incidencia: ${problem.id}`, true);
    showNotification("Problema creado exitosamente");
    
    document.getElementById('modal-incident').classList.remove('active');
    renderProblemsGrid();
    updateDashboard();
  }
}

function filterIncidents(filter) {
  const tbody = document.getElementById('incidents-tbody');
  let filtered = STATE.incidents;

  switch(filter) {
    case 'critical':
      filtered = STATE.incidents.filter(i => i.priority === 'Crítica');
      break;
    case 'open':
      filtered = STATE.incidents.filter(i => i.status === 'Abierta');
      break;
    case 'resolved':
      filtered = STATE.incidents.filter(i => i.status === 'Resuelta');
      break;
  }

  tbody.innerHTML = filtered.slice(0, 30).map(inc => `
    <tr onclick="showIncidentDetail('${inc.id}')">
      <td><strong>${inc.id}</strong></td>
      <td>${inc.date}<br><small style="color: #64748b;">${inc.time}</small></td>
      <td>${inc.title}</td>
      <td>${inc.category}</td>
      <td><span class="priority-badge priority-${inc.impact.toLowerCase()}">${inc.impact}</span></td>
      <td><span class="priority-badge priority-${inc.urgency.toLowerCase()}">${inc.urgency}</span></td>
      <td><span class="priority-badge// ==================== NEXUS PRO - ITIL + PMBOK INTEGRATION ====================
// Sistema Integrado de Gestión ITIL v4 y PMBOK 7

// ==================== GLOBAL STATE ====================
const STATE = {
  incidents: [],
  problems: [],
  changes: [],
  releases: [],
  risks: [],
  stakeholders: [],
  projectData: {
    name: "Implementación Sistema Hospitalario IA",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    budget: 1200000,
    pv: 850000,
    ev: 816000,
    ac: 755000,
    cpi: 1.08,
    spi: 0.96
  },
  charts: {},
  notificationCount: 0
};

// ITIL Categories
const ITIL = {
  categories: ["Hardware", "Software", "Network", "Database", "Application", "Security"],
  impacts: ["Alto", "Medio", "Bajo"],
  urgencies: ["Alta", "Media", "Baja"],
  priorities: ["Crítica", "Alta", "Media", "Baja"],
  statuses: ["Abierta", "En Progreso", "Resuelta", "Cerrada"],
  supportGroups: ["Service Desk", "Infrastructure", "Application Support", "Database Team", "Security Team"],
  changeTypes: ["Standard", "Normal", "Emergency"],
  changeCategories: ["Infrastructure", "Application", "Data", "Security"]
};

// PMBOK Areas
const PMBOK = {
  knowledgeAreas: [
    "Integración", "Alcance", "Cronograma", "Costos", 
    "Calidad", "Recursos", "Comunicaciones", "Riesgos", 
    "Adquisiciones", "Interesados"
  ],
  phases: ["Inicio", "Planificación", "Ejecución", "Monitoreo y Control", "Cierre"],
  riskCategories: ["Técnico", "Organizacional", "Externo", "Gerencia de Proyecto"],
  riskProbabilities: ["Muy Baja", "Baja", "Media", "Alta", "Muy Alta"],
  riskImpacts: ["Muy Bajo", "Bajo", "Medio", "Alto", "Muy Alto"]
};

// ==================== INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', () => {
  initializeSystem();
  setupNavigation();
  setupEventListeners();
  createAllCharts();
  startAutoUpdates();
});

function initializeSystem() {
  console.log('🚀 NEXUS Pro - Inicializando Sistema ITIL + PMBOK...');
  
  // Generar datos iniciales
  generateInitialIncidents();
  generateInitialProblems();
  generateInitialChanges();
  generateInitialRisks();
  generateInitialStakeholders();
  
  // Renderizar todo
  updateDashboard();
  renderIncidentsTable();
  renderProblemsGrid();
  renderChangesTable();
  renderRisksTable();
  renderStakeholdersTable();
  renderWBS();
  renderGanttChart();
  renderIntegrationMatrix();
  renderKPIDashboard();
  renderReleasesTimeline();
  
  addToLiveFeed('✅ Sistema NEXUS Pro iniciado correctamente', false);
  addToLiveFeed('🔄 ITIL Service Management activado', false);
  addToLiveFeed('📊 PMBOK Project Management activado', false);
}

// ==================== DATA GENERATION ====================
function generateInitialIncidents() {
  for (let i = 0; i < 50; i++) {
    generateAutoIncident(true);
  }
}

function generateAutoIncident(silent = false) {
  const category = ITIL.categories[Math.floor(Math.random() * ITIL.categories.length)];
  const impact = ITIL.impacts[Math.floor(Math.random() * ITIL.impacts.length)];
  const urgency = ITIL.urgencies[Math.floor(Math.random() * ITIL.urgencies.length)];
  
  // Calcular prioridad según matriz ITIL (Impacto x Urgencia)
  const priority = calculatePriority(impact, urgency);
  
  const incident = {
    id: `INC-${String(STATE.incidents.length + 10001).padStart(6, '0')}`,
    title: priority === "Crítica" 
      ? `FALLO CRÍTICO - ${category} sin respuesta` 
      : `Degradación de rendimiento en ${category}`,
    category,
    impact,
    urgency,
    priority,
    status: Math.random() < 0.7 ? "Abierta" : ITIL.statuses[Math.floor(Math.random() * ITIL.statuses.length)],
    assignedGroup: ITIL.supportGroups[Math.floor(Math.random() * ITIL.supportGroups.length)],
    assignedTo: `Técnico ${Math.floor(Math.random() * 20) + 1}`,
    date: new Date().toLocaleDateString('es-ES'),
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().getTime(),
    sla: Math.random() < 0.92,
    slaTarget: priority === "Crítica" ? 2 : priority === "Alta" ? 4 : 8,
    mttr: priority === "Crítica" ? (Math.random() * 3 + 0.5).toFixed(1) : (Math.random() * 12 + 2).toFixed(1),
    description: `Incidencia detectada en ${category}. Usuario reporta problemas de ${impact.toLowerCase()} impacto. Se requiere investigación y resolución inmediata según procedimientos ITIL.`,
    rootCause: null,
    resolution: null,
    relatedProblem: null
  };

  STATE.incidents.unshift(incident);

  if (!silent) {
    if (priority === "Crítica") {
      playAlert();
      showNotification("¡Incidencia CRÍTICA detectada!");
      addToLiveFeed(`🚨 CRÍTICA → ${incident.id} | ${incident.title}`, true);
    } else {
      addToLiveFeed(`📌 NUEVA → ${incident.id} | ${incident.title}`, false);
    }
    detectRecurrentProblems();
  }

  return incident;
}

function calculatePriority(impact, urgency) {
  // Matriz ITIL de Prioridad (Impacto x Urgencia)
  const matrix = {
    'Alto': { 'Alta': 'Crítica', 'Media': 'Alta', 'Baja': 'Media' },
    'Medio': { 'Alta': 'Alta', 'Media': 'Media', 'Baja': 'Baja' },
    'Bajo': { 'Alta': 'Media', 'Media': 'Baja', 'Baja': 'Baja' }
  };
  return matrix[impact][urgency];
}

function detectRecurrentProblems() {
  ITIL.categories.forEach(category => {
    const openIncidents = STATE.incidents.filter(
      i => i.category === category && i.status === "Abierta"
    ).length;
    
    if (openIncidents >= 5 && !STATE.problems.some(p => p.category === category && p.status === "Activo")) {
      const problem = {
        id: `PRB-${String(STATE.problems.length + 3001).padStart(6, '0')}`,
        title: `Problema Recurrente en ${category}`,
        category,
        incidentCount: openIncidents,
        status: "Activo",
        priority: "Alta",
        rootCause: "Análisis en progreso - IA detectó patrón recurrente",
        workaround: "Reinicio programado cada 6 horas como medida temporal",
        knownError: true,
        createdDate: new Date().toLocaleDateString('es-ES'),
        assignedTo: "Problem Manager",
        relatedIncidents: STATE.incidents
          .filter(i => i.category === category && i.status === "Abierta")
          .map(i => i.id),
        pmImpact: "Alto - Afecta cronograma del proyecto y disponibilidad del servicio"
      };
      
      STATE.problems.push(problem);
      addToLiveFeed(`🔍 PROBLEMA → Detectado en ${category} (${openIncidents} incidencias)`, true);
      showNotification("Nuevo problema identificado");
    }
  });
  
  renderProblemsGrid();
}

function generateInitialProblems() {
  // Los problemas se generan dinámicamente por detectRecurrentProblems()
}

function generateInitialChanges() {
  const changeTypes = ITIL.changeTypes;
  const changeData = [
    {
      title: "Actualización sistema operativo servidores producción",
      type: "Normal",
      category: "Infrastructure",
      risk: "Medio",
      cabStatus: "Aprobado",
      implementationDate: "2025-11-25 22:00",
      pmImpact: "Medio - Requiere ventana de mantenimiento"
    },
    {
      title: "Migración base de datos a nueva versión",
      type: "Normal",
      category: "Data",
      risk: "Alto",
      cabStatus: "En Revisión",
      implementationDate: "2025-12-01 20:00",
      pmImpact: "Alto - Riesgo en ruta crítica del proyecto"
    },
    {
      title: "Parche de seguridad crítico",
      type: "Emergency",
      category: "Security",
      risk: "Alto",
      cabStatus: "Fast-Track",
      implementationDate: "2025-11-19 18:00",
      pmImpact: "Crítico - Requiere implementación inmediata"
    },
    {
      title: "Actualización antivirus corporativo",
      type: "Standard",
      category: "Security",
      risk: "Bajo",
      cabStatus: "Pre-Aprobado",
      implementationDate: "2025-11-20 02:00",
      pmImpact: "Bajo - Cambio estándar"
    }
  ];

  changeData.forEach((change, index) => {
    STATE.changes.push({
      id: `RFC-${String(2001 + index).padStart(6, '0')}`,
      ...change,
      status: change.cabStatus,
      requestedBy: "Change Manager",
      requestDate: new Date().toLocaleDateString('es-ES'),
      approvers: ["CAB Chair", "Technical Lead", "Security Officer"]
    });
  });
}

function generateInitialRisks() {
  const riskData = [
    {
      description: "Retraso en entrega de hardware por proveedor",
      category: "Externo",
      probability: "Alta",
      impact: "Alto",
      strategy: "Mitigar",
      responsible: "PM - Compras"
    },
    {
      description: "Falta de recursos especializados en IA",
      category: "Organizacional",
      probability: "Media",
      impact: "Alto",
      strategy: "Transferir",
      responsible: "PM - RRHH"
    },
    {
      description: "Incompatibilidad con sistemas legacy",
      category: "Técnico",
      probability: "Alta",
      impact: "Medio",
      strategy: "Mitigar",
      responsible: "Arquitecto de Soluciones"
    },
    {
      description: "Cambios en normativas de salud digital",
      category: "Externo",
      probability: "Baja",
      impact: "Muy Alto",
      strategy: "Aceptar",
      responsible: "Legal"
    },
    {
      description: "Sobrecarga del equipo de desarrollo",
      category: "Gerencia de Proyecto",
      probability: "Media",
      impact: "Medio",
      strategy: "Mitigar",
      responsible: "Project Manager"
    }
  ];

  riskData.forEach((risk, index) => {
    const exposure = calculateRiskExposure(risk.probability, risk.impact);
    STATE.risks.push({
      id: `RSK-${String(4001 + index).padStart(6, '0')}`,
      ...risk,
      exposure,
      status: "Activo",
      createdDate: new Date().toLocaleDateString('es-ES'),
      lastReview: new Date().toLocaleDateString('es-ES')
    });
  });
}

function calculateRiskExposure(probability, impact) {
  const probValues = { "Muy Baja": 1, "Baja": 2, "Media": 3, "Alta": 4, "Muy Alta": 5 };
  const impactValues = { "Muy Bajo": 1, "Bajo": 2, "Medio": 3, "Alto": 4, "Muy Alto": 5 };
  const score = probValues[probability] * impactValues[impact];
  
  if (score >= 16) return "Crítica";
  if (score >= 9) return "Alta";
  if (score >= 4) return "Media";
  return "Baja";
}

function generateInitialStakeholders() {
  const stakeholderData = [
    {
      name: "Director General Hospital",
      role: "Sponsor",
      power: "Alto",
      interest: "Alto",
      strategy: "Gestionar Activamente",
      frequency: "Semanal",
      channel: "Reunión Ejecutiva"
    },
    {
      name: "Jefe de Sistemas",
      role: "Cliente",
      power: "Alto",
      interest: "Alto",
      strategy: "Gestionar Activamente",
      frequency: "Diaria",
      channel: "Email / Teams"
    },
    {
      name: "Usuario Final - Médicos",
      role: "Usuario",
      power: "Bajo",
      interest: "Alto",
      strategy: "Mantener Informado",
      frequency: "Mensual",
      channel: "Newsletter"
    },
    {
      name: "Proveedor de Hardware",
      role: "Proveedor",
      power: "Medio",
      interest: "Medio",
      strategy: "Mantener Satisfecho",
      frequency: "Quincenal",
      channel: "Email"
    },
    {
      name: "Regulador de Salud",
      role: "Regulador",
      power: "Alto",
      interest: "Medio",
      strategy: "Mantener Satisfecho",
      frequency: "Trimestral",
      channel: "Reporte Formal"
    }
  ];

  STATE.stakeholders = stakeholderData;
}

// ==================== DASHBOARD UPDATE ====================
function updateDashboard() {
  // ITIL Metrics
  const activeIncidents = STATE.incidents.filter(
    i => i.status === "Abierta" || i.status === "En Progreso"
  ).length;
  const criticalIncidents = STATE.incidents.filter(
    i => i.priority === "Crítica" && i.status !== "Resuelta"
  ).length;
  const avgMttr = (STATE.incidents.reduce((sum, i) => sum + parseFloat(i.mttr), 0) / STATE.incidents.length).toFixed(1);

  document.getElementById('stat-incidents').textContent = activeIncidents;
  document.getElementById('stat-critical').textContent = criticalIncidents;
  document.getElementById('stat-mttr').textContent = avgMttr + 'h';
  document.getElementById('incidents-badge').textContent = activeIncidents;
  document.getElementById('problems-badge').textContent = STATE.problems.filter(p => p.status === "Activo").length;

  // PMBOK Metrics
  const cpi = STATE.projectData.cpi.toFixed(2);
  const spi = STATE.projectData.spi.toFixed(2);
  
  document.getElementById('stat-cpi').textContent = cpi;
  document.getElementById('stat-spi').textContent = spi;
}

// ==================== RENDER FUNCTIONS ====================
function renderIncidentsTable() {
  const tbody = document.getElementById('incidents-tbody');
  const displayIncidents = STATE.incidents.slice(0, 30);
  
  tbody.innerHTML = displayIncidents.map(inc => `
    <tr onclick="showIncidentDetail('${inc.id}')">
      <td><strong>${inc.id}</strong></td>
      <td>${inc.date}<br><small style="color: #64748b;">${inc.time}</small></td>
      <td>${inc.title}</td>
      <td>${inc.category}</td>
      <td><span class="priority-badge priority-${inc.impact.toLowerCase()}">${inc.impact}</span></td>
      <td><span class="priority-badge priority-${inc.urgency.toLowerCase()}">${inc.urgency}</span></td>
      <td><span class="priority-badge priority-${inc.priority.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}">${inc.priority}</span></td>
      <td><span class="status-badge status-${inc.status.toLowerCase().replace(/ /g, '-')}">${inc.status}</span></td>
      <td>${inc.assignedGroup}</td>
      <td><span style="color: ${inc.sla ? '#10b981' : '#ef4444'}; font-weight: 600;">${inc.sla ? '✓ OK' : '✗ Incumplido'}</span></td>
      <td><button class="action-btn">Ver</button></td>
    </tr>
  `).join('');
}

function renderProblemsGrid() {
  const container = document.getElementById('problems-list');
  
  if (STATE.problems.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px; color: #64748b;">
        <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 20px; color: #10b981;"></i>
        <h3 style="color: #cbd5e1;">No hay problemas recurrentes detectados</h3>
        <p>El sistema IA está monitoreando continuamente patrones de incidencias</p>
      </div>
    `;
    return;
  }

  container.innerHTML = STATE.problems.map(prob => `
    <div class="problem-card">
      <div class="problem-header">
        <h3 class="problem-title">${prob.id} - ${prob.title}</h3>
        <span class="status-badge status-${prob.status.toLowerCase()}">${prob.status}</span>
      </div>
      <div class="problem-info">
        <div class="problem-info-item">
          <span class="problem-label">Categoría ITIL</span>
          <span class="problem-value">${prob.category}</span>
        </div>
        <div class="problem-info-item">
          <span class="problem-label">Incidencias Relacionadas</span>
          <span class="problem-value">${prob.incidentCount}</span>
        </div>
        <div class="problem-info-item">
          <span class="problem-label">Prioridad</span>
          <span class="problem-value">${prob.priority}</span>
        </div>
        <div class="problem-info-item">
          <span class="problem-label">Known Error</span>
          <span class="problem-value">${prob.knownError ? 'Sí' : 'No'}</span>
        </div>
      </div>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(100, 116, 139, 0.2);">
        <p style="color: #cbd5e1; margin-bottom: 8px;"><strong>Causa Raíz:</strong> ${prob.rootCause}</p>
        <p style="color: #cbd5e1; margin-bottom: 8px;"><strong>Workaround:</strong> ${prob.workaround}</p>
        <p style="color: #f59e0b;"><strong>Impacto en Proyecto (PMBOK):</strong> ${prob.pmImpact}</p>
      </div>
    </div>
  `).join('');
}

function renderChangesTable() {
  const tbody = document.getElementById('changes-tbody');
  
  tbody.innerHTML = STATE.changes.map(chg => `
    <tr>
      <td><strong>${chg.id}</strong></td>
      <td>${chg.title}</td>
      <td><span class="priority-badge priority-${chg.type.toLowerCase()}">${chg.type}</span></td>
      <td>${chg.category}</td>
      <td><span class="priority-badge priority-${chg.risk.toLowerCase()}">${chg.risk}</span></td>
      <td><span class="status-badge">${chg.cabStatus}</span></td>
      <td>${chg.implementationDate}</td>
      <td style="color: ${chg.pmImpact.startsWith('Crítico') ? '#ef4444' : chg.pmImpact.startsWith('Alto') ? '#f59e0b' : '#3b82f6'};">${chg.pmImpact}</td>
      <td><button class="action-btn">Gestionar</button></td>
    </tr>
  `).join('');
}

function renderRisksTable() {
  const tbody = document.getElementById('risks-tbody');
  
  tbody.innerHTML = STATE.risks.map(risk => `
    <tr>
      <td><strong>${risk.id}</strong></td>
      <td>${risk.description}</td>
      <td>${risk.category}</td>
      <td><span class="priority-badge">${risk.probability}</span></td>
      <td><span class="priority-badge">${risk.impact}</span></td>
      <td><span class="priority-badge priority-${risk.exposure.toLowerCase()}">${risk.exposure}</span></td>
      <td>${risk.strategy}</td>
      <td>${risk.responsible}</td>
      <td><span class="status-badge status-${risk.status.toLowerCase()}">${risk.status}</span></td>
    </tr>
  `).join('');
}

function renderStakeholdersTable() {
  const tbody = document.getElementById('stakeholders-tbody');
  
  tbody.innerHTML = STATE.stakeholders.map(sh => `
    <tr>
      <td><strong>${sh.name}</strong></td>
      <td>${sh.role}</td>
      <td><span class="priority-badge priority-${sh.power.toLowerCase()}">${sh.power}</span></td>
      <td><span class="priority-badge priority-${sh.interest.toLowerCase()}">${sh.interest}</span></td>
      <td>${sh.strategy}</td>
      <td>${sh.frequency}</td>
      <td>${sh.channel}</td>
    </tr>
  `).join('');
}

function renderWBS() {
  const wbsContainer = document.getElementById('wbs-container');
  
  const wbsData = [
    { level: 0, name: "1.0 Proyecto Sistema Hospitalario IA", progress: 67 },
    { level: 1, name: "1.1 Iniciación", progress: 100 },
    { level: 1, name: "1.2 Planificación", progress: 100 },
    { level: 1, name: "1.3 Ejecución", progress: 65 },
    { level: 2, name: "1.3.1 Desarrollo Backend", progress: 80 },
    { level: 2, name: "1.3.2 Desarrollo Frontend", progress: 70 },
    { level: 2, name: "1.3.3 Integración IA", progress: 45 },
    { level: 1, name: "1.4 Monitoreo y Control", progress: 60 },
    { level: 1, name: "1.5 Cierre", progress: 0 }
  ];

  wbsContainer.innerHTML = wbsData.map(item => `
    <div class="wbs-item" style="margin-left: ${item.level * 30}px;">
      <span class="wbs-name">${item.name}</span>
      <div class="wbs-progress">
        <div class="wbs-progress-bar">
          <div class="wbs-progress-fill" style="width: ${item.progress}%"></div>
        </div>
        <span class="wbs-percent">${item.progress}%</span>
      </div>
    </div>
  `).join('');
}

function renderGanttChart() {
  const ganttContainer = document.getElementById('gantt-chart');
  
  const tasks = [
    { name: "Análisis de Requisitos", start: 0, duration: 15, critical: false },
    { name: "Diseño de Arquitectura", start: 15, duration: 20, critical: true },
    { name: "Desarrollo Backend", start: 35, duration: 60, critical: true },
    { name: "Desarrollo Frontend", start: 35, duration: 50, critical: false },
    { name: "Integración IA", start: 95, duration: 40, critical: true },
    { name: "Testing y QA", start: 135, duration: 30, critical: true },
    { name: "Capacitación", start: 150, duration: 20, critical: false },
    { name: "Despliegue", start: 165, duration: 10, critical: true }
  ];

  ganttContainer.innerHTML = tasks.map(task => `
    <div class="gantt-row">
      <div class="gantt-task-name">${task.name}</div>
      <div class="gantt-timeline">
        <div class="gantt-bar ${task.critical ? 'critical' : ''}" 
             style="left: ${(task.start / 180) * 100}%; width: ${(task.duration / 180) * 100}%;">
          ${task.duration}d
        </div>
      </div>
    </div>
  `).join('');
}

function renderIntegrationMatrix() {
  const container = document.getElementById('integration-matrix');
  
  const itilProcesses = [
    "Incident Management",
    "Problem Management",
    "Change Management",
    "Release Management"
  ];

  const pmbokAreas = [
    "Alcance", "Cronograma", "Costos", "Calidad", "Riesgos"
  ];

  // Matriz de integración (strong, medium, weak, none)
  const matrix = [
    ["medium", "strong", "weak", "medium", "strong"],    // Incident
    ["strong", "strong", "medium", "strong", "strong"],  // Problem
    ["strong", "strong", "strong", "medium", "strong"],  // Change
    ["strong", "strong", "medium", "strong", "medium"]   // Release
  ];

  let html = '<table class="integration-table"><thead><tr><th>ITIL \\ PMBOK</th>';
  pmbokAreas.forEach(area => {
    html += `<th>${area}</th>`;
  });
  html += '</tr></thead><tbody>';

  itilProcesses.forEach((process, i) => {
    html += `<tr><th>${process}</th>`;
    matrix[i].forEach(level => {
      html += `<td><div class="integration-cell ${level}" title="${level}"></div></td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderKPIDashboard() {
  const container = document.getElementById('kpi-dashboard');
  
  const kpis = [
    {
      name: "Incident Resolution Rate",
      category: "ITIL",
      value: "94.2%",
      trend: "+2.1%",
      positive: true,
      target: "95%"
    },
    {
      name: "MTTR (Mean Time To Repair)",
      category: "ITIL",
      value: "2.4h",
      trend: "-15%",
      positive: true,
      target: "< 3h"
    },
    {
      name: "CPI (Cost Performance Index)",
      category: "PMBOK",
      value: "1.08",
      trend: "+0.03",
      positive: true,
      target: "> 1.0"
    },
    {
      name: "SPI (Schedule Performance Index)",
      category: "PMBOK",
      value: "0.96",
      trend: "-0.02",
      positive: false,
      target: "> 1.0"
    },
    {
      name: "Change Success Rate",
      category: "ITIL",
      value: "98.5%",
      trend: "+1.2%",
      positive: true,
      target: "> 95%"
    },
    {
      name: "Risk Mitigation Rate",
      category: "PMBOK",
      value: "87%",
      trend: "+5%",
      positive: true,
      target: "> 80%"
    }
  ];

  container.innerHTML = kpis.map(kpi => `
    <div class="kpi-card ${kpi.category.toLowerCase()}">
      <div class="kpi-header">
        <span class="kpi-name">${kpi.name}</span>
        <span class="kpi-category ${kpi.category.toLowerCase()}-badge">${kpi.category}</span>
      </div>
      <div class="kpi-body">
        <div class="kpi-value-large">${kpi.value}</div>
        <div class="kpi-trend ${kpi.positive ? 'positive' : 'negative'}">
          <i class="fas fa-arrow-${kpi.positive ? 'up' : 'down'}"></i>
          <span>${kpi.trend} vs mes anterior</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span>Target: ${kpi.target}</span>
        <span>${kpi.positive ? '✓ On Track' : '⚠ At Risk'}</span>
      </div>
    </div>
  `).join('');
}

function renderReleasesTimeline() {
  const container = document.getElementById('releases-timeline');
  
  const releases = [
    {
      version: "v1.0 - MVP",
      date: "15 Marzo 2025",
      status: "Completado",
      description: "
