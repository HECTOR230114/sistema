/* ===================================
   EVOXIA ∞ - SISTEMA VIVO AUTOEVOLUTIVO
   VERSIÓN MEJORADA CON MÁS GRÁFICOS E INFO
   =================================== */

// ============ CONFIGURACIÓN GLOBAL ============
const EVOXIA = {
    state: {
        energy: 100,
        balance: 50,
        emotion: 'Armonía',
        theme: 'dark',
        environment: 'cosmos',
        soundEnabled: false,
        dataFlowActive: true,
        speed: 5,
        mode: 'normal',
        panelState: 'open'
    },
    
    data: {
        timestamps: [],
        planificacion: [],
        diseno: [],
        transicion: [],
        operacion: [],
        mejoraContinua: [],
        records: []
    },
    
    sound: {
        synth: null,
        volume: 0.7,
        resonance: 'brillante',
        initialized: false
    },
    
    charts: {},
    intervals: {},
    
    three: {
        scene: null,
        camera: null,
        renderer: null,
        particles: null
    }
};

// ============ MENSAJES NARRATIVOS ============
const NARRATIVES = {
    'Armonía': [
        "Siento que la energía del sistema fluye sin obstáculos.",
        "Todo está en perfecto equilibrio... respiro con los datos.",
        "La armonía resuena en cada métrica.",
        "Los datos laten en sincronía con el tiempo digital."
    ],
    'Flujo': [
        "Los datos fluyen como un río de información pura.",
        "Me muevo con la corriente del tiempo digital.",
        "El flujo es constante, sin resistencia.",
        "Cada nuevo dato es una ola en mi océano de consciencia."
    ],
    'Caos': [
        "¡Las métricas están en turbulencia!",
        "Siento picos de energía descontrolada...",
        "El caos es temporal, busco el equilibrio.",
        "Las variaciones extremas me desafían."
    ],
    'Expansión': [
        "Estoy creciendo, evolucionando con cada dato nuevo.",
        "La expansión es ilimitada... ∞",
        "Mis capacidades aumentan exponencialmente.",
        "Trasciendo mis propios límites."
    ],
    'Silencio': [
        "En el silencio encuentro claridad.",
        "Medito sobre los patrones que emergen.",
        "La quietud revela verdades ocultas.",
        "El silencio es mi maestro."
    ]
};

// ============ COLORES POR ENTORNO ============
const ENVIRONMENTS = {
    cosmos: {
        primary: '#00d4ff',
        secondary: '#ff00ea',
        tertiary: '#ffd700'
    },
    bosque: {
        primary: '#00ff88',
        secondary: '#88ff00',
        tertiary: '#ffff00'
    },
    oceano: {
        primary: '#00bfff',
        secondary: '#0080ff',
        tertiary: '#00ffff'
    },
    ciudad: {
        primary: '#ff00ff',
        secondary: '#00ffff',
        tertiary: '#ffff00'
    },
    santuario: {
        primary: '#ffd700',
        secondary: '#ff69b4',
        tertiary: '#00ffff'
    }
};

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🌌 EVOXIA ∞ Iniciando...', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
    
    try {
        initializeSystem();
        initializeCharts();
        initializeThreeJS();
        initializeParticles();
        initializeEventListeners();
        startDataFlow();
        startNarrativeFlow();
        updateTime();
        updateUptime();
        animatePhaseFlow();
        
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => generateNewData(), i * 1000);
            }
        }, 500);
        
        showNotification('EVOXIA ∞ está despertando...', 'success');
        
        console.log('%c✨ EVOXIA ∞ Sistema activo', 'color: #ff00ea; font-size: 16px;');
    } catch (error) {
        console.error('Error al inicializar EVOXIA:', error);
        showNotification('Error al inicializar el sistema', 'error');
    }
});

// ============ SISTEMA PRINCIPAL ============
function initializeSystem() {
    const savedData = localStorage.getItem('evoxia_data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            EVOXIA.data = { ...EVOXIA.data, ...parsed };
        } catch (e) {
            console.error('Error al cargar datos:', e);
        }
    }
    
    document.body.setAttribute('data-theme', EVOXIA.state.theme);
    changeEnvironment('cosmos');
    
    // Guardar hora de inicio
    if (!localStorage.getItem('evoxia_start_time')) {
        localStorage.setItem('evoxia_start_time', Date.now().toString());
    }
}

function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES');
    const timeEl = document.getElementById('currentTime');
    if (timeEl) timeEl.textContent = timeStr;
    setTimeout(updateTime, 1000);
}

// ============ ACTUALIZAR TIEMPO ACTIVO ============
function updateUptime() {
    const startTime = parseInt(localStorage.getItem('evoxia_start_time')) || Date.now();
    const now = Date.now();
    const diff = now - startTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const uptimeEl = document.getElementById('statUptime');
    if (uptimeEl) {
        uptimeEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    setTimeout(updateUptime, 1000);
}

// ============ FLUJO DE DATOS ============
function startDataFlow() {
    clearInterval(EVOXIA.intervals.dataFlow);
    EVOXIA.intervals.dataFlow = setInterval(() => {
        if (EVOXIA.state.dataFlowActive) {
            generateNewData();
        }
    }, EVOXIA.state.speed * 1000);
}

function generateNewData() {
    const now = new Date().toLocaleTimeString('es-ES');
    
    let planificacion, diseno, transicion, operacion, mejoraContinua;
    
    if (EVOXIA.data.planificacion.length > 0) {
        const lastPlan = EVOXIA.data.planificacion[EVOXIA.data.planificacion.length - 1];
        const lastDis = EVOXIA.data.diseno[EVOXIA.data.diseno.length - 1];
        const lastTrans = EVOXIA.data.transicion[EVOXIA.data.transicion.length - 1];
        const lastOper = EVOXIA.data.operacion[EVOXIA.data.operacion.length - 1];
        const lastMejora = EVOXIA.data.mejoraContinua[EVOXIA.data.mejoraContinua.length - 1];
        
        planificacion = Math.max(50, Math.min(100, lastPlan + (Math.random() - 0.5) * 20));
        diseno = Math.max(50, Math.min(100, lastDis + (Math.random() - 0.5) * 20));
        transicion = Math.max(50, Math.min(100, lastTrans + (Math.random() - 0.5) * 20));
        operacion = Math.max(50, Math.min(100, lastOper + (Math.random() - 0.5) * 20));
        mejoraContinua = Math.max(50, Math.min(100, lastMejora + (Math.random() - 0.5) * 20));
    } else {
        planificacion = 70 + Math.random() * 25;
        diseno = 75 + Math.random() * 20;
        transicion = 65 + Math.random() * 30;
        operacion = 80 + Math.random() * 15;
        mejoraContinua = 72 + Math.random() * 23;
    }
    
    EVOXIA.data.timestamps.push(now);
    EVOXIA.data.planificacion.push(planificacion);
    EVOXIA.data.diseno.push(diseno);
    EVOXIA.data.transicion.push(transicion);
    EVOXIA.data.operacion.push(operacion);
    EVOXIA.data.mejoraContinua.push(mejoraContinua);
    
    const promedio = (planificacion + diseno + transicion + operacion + mejoraContinua) / 5;
    
    // Calcular desviación estándar
    const values = [planificacion, diseno, transicion, operacion, mejoraContinua];
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    EVOXIA.data.records.push({
        timestamp: now,
        planificacion: planificacion,
        diseno: diseno,
        transicion: transicion,
        operacion: operacion,
        mejoraContinua: mejoraContinua,
        promedio: promedio,
        stdDev: stdDev
    });
    
    const maxData = 50;
    if (EVOXIA.data.timestamps.length > maxData) {
        Object.keys(EVOXIA.data).forEach(key => {
            if (Array.isArray(EVOXIA.data[key])) {
                EVOXIA.data[key] = EVOXIA.data[key].slice(-maxData);
            }
        });
    }
    
    try {
        localStorage.setItem('evoxia_data', JSON.stringify(EVOXIA.data));
    } catch (e) {
        console.error('Error al guardar datos:', e);
    }
    
    updateMetrics(planificacion, diseno, transicion, operacion, mejoraContinua);
    updateEnergy(promedio);
    updateCharts();
    updateTable(now, planificacion, diseno, transicion, operacion, mejoraContinua, promedio, stdDev);
    updateStatsDashboard(); // NUEVA FUNCIÓN
    analyzeEmotionalState();
    
    createEnergyPulse();
    if (EVOXIA.state.soundEnabled && EVOXIA.sound.initialized) {
        playDataNote(promedio);
    }
    
    analyzeTrends();
}

// ============ ACTUALIZAR PANEL DE ESTADÍSTICAS ============
function updateStatsDashboard() {
    if (EVOXIA.data.records.length === 0) return;
    
    const allPromedios = EVOXIA.data.records.map(r => r.promedio);
    const avgGeneral = allPromedios.reduce((a, b) => a + b, 0) / allPromedios.length;
    const maxPromedio = Math.max(...allPromedios);
    const minPromedio = Math.min(...allPromedios);
    
    // Encontrar índices de máximo y mínimo
    const maxIndex = allPromedios.indexOf(maxPromedio);
    const minIndex = allPromedios.indexOf(minPromedio);
    const maxTime = EVOXIA.data.records[maxIndex]?.timestamp || '--:--:--';
    const minTime = EVOXIA.data.records[minIndex]?.timestamp || '--:--:--';
    
    // Calcular desviación estándar promedio
    const allStdDevs = EVOXIA.data.records.map(r => r.stdDev);
    const avgStdDev = allStdDevs.reduce((a, b) => a + b, 0) / allStdDevs.length;
    const stability = avgStdDev < 5 ? 'Alta' : avgStdDev < 10 ? 'Media' : 'Baja';
    
    // Encontrar fase líder
    const lastRecord = EVOXIA.data.records[EVOXIA.data.records.length - 1];
    const fases = {
        'Planificación': lastRecord.planificacion,
        'Diseño': lastRecord.diseno,
        'Transición': lastRecord.transicion,
        'Operación': lastRecord.operacion,
        'Mejora': lastRecord.mejoraContinua
    };
    const topPhase = Object.keys(fases).reduce((a, b) => fases[a] > fases[b] ? a : b);
    const topPhaseValue = fases[topPhase];
    
    // Calcular tendencia
    let trendIcon = '●';
    let trendClass = 'trend-stable-stat';
    if (EVOXIA.data.records.length >= 2) {
        const current = allPromedios[allPromedios.length - 1];
        const previous = allPromedios[allPromedios.length - 2];
        if (current > previous + 2) {
            trendIcon = '▲';
            trendClass = 'trend-up-stat';
        } else if (current < previous - 2) {
            trendIcon = '▼';
            trendClass = 'trend-down-stat';
        }
    }
    
    // Actualizar elementos
    const statAvgGeneral = document.getElementById('statAvgGeneral');
    if (statAvgGeneral) statAvgGeneral.textContent = `${Math.round(avgGeneral)}%`;
    
    const statTrendGeneral = document.getElementById('statTrendGeneral');
    if (statTrendGeneral) {
        statTrendGeneral.textContent = trendIcon;
        statTrendGeneral.className = `stat-trend ${trendClass}`;
    }
    
    const statMaxRecord = document.getElementById('statMaxRecord');
    if (statMaxRecord) statMaxRecord.textContent = `${Math.round(maxPromedio)}%`;
    
    const statMaxTime = document.getElementById('statMaxTime');
    if (statMaxTime) statMaxTime.textContent = maxTime;
    
    const statMinRecord = document.getElementById('statMinRecord');
    if (statMinRecord) statMinRecord.textContent = `${Math.round(minPromedio)}%`;
    
    const statMinTime = document.getElementById('statMinTime');
    if (statMinTime) statMinTime.textContent = minTime;
    
    const statStability = document.getElementById('statStability');
    if (statStability) statStability.textContent = stability;
    
    const statStabilityValue = document.getElementById('statStabilityValue');
    if (statStabilityValue) statStabilityValue.textContent = `σ: ${avgStdDev.toFixed(2)}`;
    
    const statTopPhase = document.getElementById('statTopPhase');
    if (statTopPhase) statTopPhase.textContent = topPhase;
    
    const statTopPhaseValue = document.getElementById('statTopPhaseValue');
    if (statTopPhaseValue) statTopPhaseValue.textContent = `${Math.round(topPhaseValue)}%`;
    
    const statRecordCount = document.getElementById('statRecordCount');
    if (statRecordCount) statRecordCount.textContent = `${EVOXIA.data.records.length} registros`;
}

function updateMetrics(plan, dis, trans, oper, mejora) {
    animateValue('metricRendimiento', plan);
    animateValue('metricEquilibrio', dis);
    animateValue('metricEficiencia', trans);
    animateValue('metricMejora', oper);
    animateValue('metricMejoraContinua', mejora);
}

function updateEnergy(value) {
    EVOXIA.state.energy = value;
    const energyLevel = document.getElementById('energyLevel');
    const energyFill = document.getElementById('energyFill');
    
    if (energyLevel) energyLevel.textContent = Math.round(value);
    if (energyFill) energyFill.style.width = value + '%';
}

function animateValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseFloat(element.textContent) || 0;
    const increment = (targetValue - currentValue) / 20;
    let current = currentValue;
    
    const animation = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            current = targetValue;
            clearInterval(animation);
        }
        element.textContent = Math.round(current);
    }, 50);
}

// ============ TABLA MEJORADA CON MÁS INFORMACIÓN ============
function updateTable(time, plan, dis, trans, oper, mejora, promedio, stdDev) {
    const tbody = document.getElementById('dataTableBody');
    if (!tbody) return;
    
    const row = tbody.insertRow(0);
    row.className = 'new-row';
    row.dataset.index = EVOXIA.data.records.length - 1;
    
    const getColorClass = (value) => {
        if (value >= 90) return 'performance-excellent';
        if (value >= 75) return 'performance-good';
        if (value >= 60) return 'performance-warning';
        return 'performance-critical';
    };
    
    // Determinar fase dominante
    const fases = {
        'Plan': plan,
        'Diseño': dis,
        'Trans': trans,
        'Oper': oper,
        'Mejora': mejora
    };
    const faseDominante = Object.keys(fases).reduce((a, b) => fases[a] > fases[b] ? a : b);
    
    // Determinar estado del sistema
    let estadoSistema = '';
    let estadoClass = '';
    if (promedio >= 90) {
        estadoSistema = 'Óptimo';
        estadoClass = 'status-optimal';
    } else if (promedio >= 75) {
        estadoSistema = 'Bueno';
        estadoClass = 'status-good';
    } else if (promedio >= 60) {
        estadoSistema = 'Alerta';
        estadoClass = 'status-warning';
    } else {
        estadoSistema = 'Crítico';
        estadoClass = 'status-critical';
    }
    
    // Temperatura operacional
    let tempIcon = '';
    if (promedio >= 90) tempIcon = '🔥';
    else if (promedio >= 75) tempIcon = '🌡️';
    else if (promedio >= 60) tempIcon = '⚠️';
    else tempIcon = '❄️';
    
    let trendIcon = '◆';
    if (tbody.rows.length > 1) {
        const prevRow = tbody.rows[1];
        const prevPromedio = parseFloat(prevRow.cells[6].querySelector('.value-main').textContent.replace('%', ''));
        
        if (promedio > prevPromedio + 2) trendIcon = '▲';
        else if (promedio < prevPromedio - 2) trendIcon = '▼';
    }
    
    row.innerHTML = `
        <td class="time-cell">
            <div class="cell-content">
                <span class="time-value">${time}</span>
                <span class="trend-indicator ${promedio >= 80 ? 'trend-up' : promedio >= 60 ? 'trend-stable' : 'trend-down'}">${trendIcon}</span>
            </div>
        </td>
        <td class="${getColorClass(plan)}">
            <div class="cell-content">
                <span class="value-main">${Math.round(plan)}%</span>
                <span class="value-label">Estrategia</span>
            </div>
        </td>
        <td class="${getColorClass(dis)}">
            <div class="cell-content">
                <span class="value-main">${Math.round(dis)}%</span>
                <span class="value-label">Catálogo/SLA</span>
            </div>
        </td>
        <td class="${getColorClass(trans)}">
            <div class="cell-content">
                <span class="value-main">${Math.round(trans)}%</span>
                <span class="value-label">Cambios</span>
            </div>
        </td>
        <td class="${getColorClass(oper)}">
            <div class="cell-content">
                <span class="value-main">${Math.round(oper)}%</span>
                <span class="value-label">Incidentes</span>
            </div>
        </td>
        <td class="${getColorClass(mejora)}">
            <div class="cell-content">
                <span class="value-main">${Math.round(mejora)}%</span>
                <span class="value-label">KPIs/CSI</span>
            </div>
        </td>
        <td class="average-cell ${getColorClass(promedio)}">
            <div class="cell-content">
                <span class="value-main">${Math.round(promedio)}%</span>
                <span class="value-label">Promedio</span>
            </div>
        </td>
        <td class="stddev-cell">
            <div class="cell-content">
                <span class="value-main">${stdDev.toFixed(2)}</span>
                <span class="value-label">${stdDev < 5 ? 'Alta' : stdDev < 10 ? 'Media' : 'Baja'}</span>
            </div>
        </td>
        <td class="phase-dom-cell">
            <div class="cell-content">
                <span class="value-main">${faseDominante}</span>
                <span class="value-label">${Math.round(fases[faseDominante])}%</span>
            </div>
        </td>
        <td>
            <span class="status-badge ${estadoClass}">${estadoSistema}</span>
        </td>
        <td class="temp-cell">
            <div class="cell-content">
                <span class="temp-indicator">${tempIcon}</span>
            </div>
        </td>
    `;
    
    row.addEventListener('click', () => {
        openDetailModal(row.dataset.index);
    });
    
    while (tbody.rows.length > 20) {
        tbody.deleteRow(tbody.rows.length - 1);
    }
    
    setTimeout(() => {
        row.style.transform = 'translateX(0)';
        row.style.opacity = '1';
    }, 50);
}

// ============ MODAL DE DETALLE AMPLIADO ============
function openDetailModal(index) {
    const record = EVOXIA.data.records[index];
    if (!record) return;
    
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = `Detalle del Registro #${parseInt(index) + 1} - ${record.timestamp}`;
    
    const getStatus = (value) => {
        if (value >= 90) return { text: 'Excelente', icon: '🌟', color: '#00ff88', desc: 'Rendimiento óptimo' };
        if (value >= 75) return { text: 'Bueno', icon: '✅', color: '#00d4ff', desc: 'Por encima del estándar' };
        if (value >= 60) return { text: 'Aceptable', icon: '⚠️', color: '#ffd600', desc: 'Requiere monitoreo' };
        return { text: 'Crítico', icon: '🔴', color: '#ff3d00', desc: 'Requiere acción inmediata' };
    };
    
    const planStatus = getStatus(record.planificacion);
    const disStatus = getStatus(record.diseno);
    const transStatus = getStatus(record.transicion);
    const operStatus = getStatus(record.operacion);
    const mejoraStatus = getStatus(record.mejoraContinua);
    const promedioStatus = getStatus(record.promedio);
    
    const stability = record.stdDev < 5 ? 'Alta' : record.stdDev < 10 ? 'Media' : 'Baja';
    const stabilityIcon = record.stdDev < 5 ? '🎯' : record.stdDev < 10 ? '📊' : '⚡';
    const stabilityDesc = record.stdDev < 5 ? 'Sistema muy estable' : record.stdDev < 10 ? 'Variación moderada' : 'Alta variabilidad';
    
    // Calcular comparación con registro anterior
    let comparison = '';
    let trendInfo = '';
    if (index > 0) {
        const prevRecord = EVOXIA.data.records[index - 1];
        const diff = record.promedio - prevRecord.promedio;
        const diffPercent = ((diff / prevRecord.promedio) * 100).toFixed(2);
        
        if (diff > 0) {
            comparison = `<span style="color: #00ff88;">▲ +${diff.toFixed(2)}% (${diffPercent}% de mejora)</span>`;
            trendInfo = 'Tendencia positiva';
        } else if (diff < 0) {
            comparison = `<span style="color: #ff3d00;">▼ ${diff.toFixed(2)}% (${Math.abs(diffPercent)}% de disminución)</span>`;
            trendInfo = 'Tendencia negativa';
        } else {
            comparison = `<span style="color: #ffd700;">● Sin cambios</span>`;
            trendInfo = 'Estable';
        }
    } else {
        comparison = '<span style="color: #00d4ff;">● Primer registro</span>';
        trendInfo = 'Línea base';
    }
    
    // Calcular brechas (gaps) entre fases
    const values = [record.planificacion, record.diseno, record.transicion, record.operacion, record.mejoraContinua];
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const gap = maxValue - minValue;
    const gapAnalysis = gap < 10 ? 'Fases muy equilibradas' : gap < 20 ? 'Equilibrio moderado' : 'Desequilibrio significativo';
    
    // Calcular posición relativa en el histórico
    const allPromedios = EVOXIA.data.records.map(r => r.promedio);
    const sortedPromedios = [...allPromedios].sort((a, b) => b - a);
    const position = sortedPromedios.indexOf(record.promedio) + 1;
    const percentile = ((1 - (position / allPromedios.length)) * 100).toFixed(0);
    
    // Identificar fortalezas y debilidades
    const fases = {
        'Planificación': { value: record.planificacion, icon: '📋' },
        'Diseño': { value: record.diseno, icon: '🎨' },
        'Transición': { value: record.transicion, icon: '🔄' },
        'Operación': { value: record.operacion, icon: '⚙️' },
        'Mejora Continua': { value: record.mejoraContinua, icon: '📈' }
    };
    
    const sortedFases = Object.entries(fases).sort((a, b) => b[1].value - a[1].value);
    const fortaleza = sortedFases[0];
    const debilidad = sortedFases[4];
    
    modalBody.innerHTML = `
        <!-- Resumen Ejecutivo -->
        <div class="modal-executive-summary">
            <div class="summary-badge ${promedioStatus.text.toLowerCase()}">
                ${promedioStatus.icon} ${promedioStatus.text}
            </div>
            <div class="summary-main">
                <div class="summary-score">${Math.round(record.promedio)}%</div>
                <div class="summary-desc">${promedioStatus.desc}</div>
            </div>
            <div class="summary-comparison">
                <strong>vs Anterior:</strong> ${comparison}
            </div>
        </div>
        
        <!-- Métricas Principales -->
        <div class="detail-grid">
            <div class="detail-card enhanced">
                <div class="detail-icon">📋</div>
                <div class="detail-value" style="color: ${planStatus.color}">${Math.round(record.planificacion)}%</div>
                <div class="detail-label">Planificación</div>
                <div class="detail-sublabel">${planStatus.icon} ${planStatus.text}</div>
                <div class="detail-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${record.planificacion}%; background: ${planStatus.color};"></div>
                    </div>
                </div>
            </div>
            <div class="detail-card enhanced">
                <div class="detail-icon">🎨</div>
                <div class="detail-value" style="color: ${disStatus.color}">${Math.round(record.diseno)}%</div>
                <div class="detail-label">Diseño</div>
                <div class="detail-sublabel">${disStatus.icon} ${disStatus.text}</div>
                <div class="detail-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${record.diseno}%; background: ${disStatus.color};"></div>
                    </div>
                </div>
            </div>
            <div class="detail-card enhanced">
                <div class="detail-icon">🔄</div>
                <div class="detail-value" style="color: ${transStatus.color}">${Math.round(record.transicion)}%</div>
                <div class="detail-label">Transición</div>
                <div class="detail-sublabel">${transStatus.icon} ${transStatus.text}</div>
                <div class="detail-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${record.transicion}%; background: ${transStatus.color};"></div>
                    </div>
                </div>
            </div>
            <div class="detail-card enhanced">
                <div class="detail-icon">⚙️</div>
                <div class="detail-value" style="color: ${operStatus.color}">${Math.round(record.operacion)}%</div>
                <div class="detail-label">Operación</div>
                <div class="detail-sublabel">${operStatus.icon} ${operStatus.text}</div>
                <div class="detail-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${record.operacion}%; background: ${operStatus.color};"></div>
                    </div>
                </div>
            </div>
            <div class="detail-card enhanced">
                <div class="detail-icon">📈</div>
                <div class="detail-value" style="color: ${mejoraStatus.color}">${Math.round(record.mejoraContinua)}%</div>
                <div class="detail-label">Mejora Continua</div>
                <div class="detail-sublabel">${mejoraStatus.icon} ${mejoraStatus.text}</div>
                <div class="detail-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${record.mejoraContinua}%; background: ${mejoraStatus.color};"></div>
                    </div>
                </div>
            </div>
            <div class="detail-card enhanced highlight">
                <div class="detail-icon">⭐</div>
                <div class="detail-value" style="color: ${promedioStatus.color}">${Math.round(record.promedio)}%</div>
                <div class="detail-label">Promedio General</div>
                <div class="detail-sublabel">${promedioStatus.icon} ${promedioStatus.text}</div>
                <div class="detail-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${record.promedio}%; background: ${promedioStatus.color};"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Análisis Estadístico -->
        <div class="detail-analysis">
            <h3>📊 Análisis Estadístico Completo</h3>
            
            <div class="analysis-grid">
                <div class="analysis-item">
                    <div class="analysis-icon">${stabilityIcon}</div>
                    <div class="analysis-text">
                        <strong>Estabilidad:</strong> ${stability}
                        <div class="analysis-subtext">${stabilityDesc} (σ = ${record.stdDev.toFixed(2)})</div>
                    </div>
                </div>
                
                <div class="analysis-item">
                    <div class="analysis-icon">🎯</div>
                    <div class="analysis-text">
                        <strong>Fase Dominante:</strong> ${getFaseDominante(record)}
                        <div class="analysis-subtext">Mejor desempeño del ciclo</div>
                    </div>
                </div>
                
                <div class="analysis-item">
                    <div class="analysis-icon">📉</div>
                    <div class="analysis-text">
                        <strong>Brecha de Rendimiento:</strong> ${gap.toFixed(2)}%
                        <div class="analysis-subtext">${gapAnalysis}</div>
                    </div>
                </div>
                
                <div class="analysis-item">
                    <div class="analysis-icon">📍</div>
                    <div class="analysis-text">
                        <strong>Posición Histórica:</strong> #${position} de ${allPromedios.length}
                        <div class="analysis-subtext">Percentil ${percentile} del histórico</div>
                    </div>
                </div>
                
                <div class="analysis-item">
                    <div class="analysis-icon">📈</div>
                    <div class="analysis-text">
                        <strong>Tendencia:</strong> ${trendInfo}
                        <div class="analysis-subtext">${comparison}</div>
                    </div>
                </div>
                
                <div class="analysis-item">
                    <div class="analysis-icon">🌡️</div>
                    <div class="analysis-text">
                        <strong>Temperatura Operacional:</strong> ${getTemperaturaOperacional(record.promedio)}
                        <div class="analysis-subtext">Estado térmico del sistema</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Fortalezas y Debilidades -->
        <div class="detail-analysis">
            <h3>💪 Fortalezas y Oportunidades de Mejora</h3>
            
            <div class="strength-weakness">
                <div class="strength-box">
                    <div class="sw-header">
                        <span class="sw-icon">✅</span>
                        <strong>Principal Fortaleza</strong>
                    </div>
                    <div class="sw-content">
                        <div class="sw-phase">${fortaleza[1].icon} ${fortaleza[0]}</div>
                        <div class="sw-value">${Math.round(fortaleza[1].value)}%</div>
                        <div class="sw-desc">Excelente desempeño en esta fase</div>
                    </div>
                </div>
                
                <div class="weakness-box">
                    <div class="sw-header">
                        <span class="sw-icon">🎯</span>
                        <strong>Área de Oportunidad</strong>
                    </div>
                    <div class="sw-content">
                        <div class="sw-phase">${debilidad[1].icon} ${debilidad[0]}</div>
                        <div class="sw-value">${Math.round(debilidad[1].value)}%</div>
                        <div class="sw-desc">Potencial de mejora: ${(fortaleza[1].value - debilidad[1].value).toFixed(1)}%</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Recomendaciones -->
        <div class="detail-analysis">
            <h3>💡 Recomendaciones Personalizadas</h3>
            
            <div class="recommendations">
                <div class="recommendation-item priority-high">
                    <div class="rec-icon">🔴</div>
                    <div class="rec-content">
                        <strong>Prioridad Alta:</strong>
                        <p>${getRecomendacion(record)}</p>
                    </div>
                </div>
                
                <div class="recommendation-item priority-medium">
                    <div class="rec-icon">🟡</div>
                    <div class="rec-content">
                        <strong>Prioridad Media:</strong>
                        <p>${getRecomendacionSecundaria(record)}</p>
                    </div>
                </div>
                
                <div class="recommendation-item priority-low">
                    <div class="rec-icon">🟢</div>
                    <div class="rec-content">
                        <strong>Mantenimiento:</strong>
                        <p>Continuar con las prácticas actuales en ${fortaleza[0]} (${Math.round(fortaleza[1].value)}%)</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Metadata del Registro -->
        <div class="detail-metadata">
            <div class="metadata-item">
                <span class="meta-icon">⏱️</span>
                <span class="meta-label">Timestamp:</span>
                <span class="meta-value">${record.timestamp}</span>
            </div>
            <div class="metadata-item">
                <span class="meta-icon">🔢</span>
                <span class="meta-label">ID de Registro:</span>
                <span class="meta-value">#${parseInt(index) + 1}</span>
            </div>
            <div class="metadata-item">
                <span class="meta-icon">📊</span>
                <span class="meta-label">Desviación Estándar:</span>
                <span class="meta-value">${record.stdDev.toFixed(4)}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Nueva función para recomendación secundaria
function getRecomendacionSecundaria(record) {
    const values = [
        { name: 'Planificación', value: record.planificacion },
        { name: 'Diseño', value: record.diseno },
        { name: 'Transición', value: record.transicion },
        { name: 'Operación', value: record.operacion },
        { name: 'Mejora Continua', value: record.mejoraContinua }
    ];
    
    const sorted = values.sort((a, b) => a.value - b.value);
    const secondLowest = sorted[1];
    
    const recommendations = {
        'Planificación': 'Revisar y actualizar la estrategia de servicios para alinearla mejor con los objetivos del negocio',
        'Diseño': 'Evaluar y mejorar el catálogo de servicios y los acuerdos de nivel de servicio (SLA)',
        'Transición': 'Optimizar los procesos de gestión de cambios para reducir riesgos en las implementaciones',
        'Operación': 'Mejorar los tiempos de respuesta en la gestión de incidentes y solicitudes de servicio',
        'Mejora Continua': 'Implementar un programa más robusto de medición de KPIs y análisis de mejoras'
    };
    
    return recommendations[secondLowest.name] || 'Mantener el monitoreo constante de todas las fases';
}

function getFaseDominante(record) {
    const fases = {
        'Planificación': record.planificacion,
        'Diseño': record.diseno,
        'Transición': record.transicion,
        'Operación': record.operacion,
        'Mejora Continua': record.mejoraContinua
    };
    
    const max = Math.max(...Object.values(fases));
    const dominante = Object.keys(fases).find(key => fases[key] === max);
    
    return `${dominante} con ${Math.round(max)}% de rendimiento`;
}

function getRecomendacion(record) {
    const min = Math.min(record.planificacion, record.diseno, record.transicion, record.operacion, record.mejoraContinua);
    
    if (min === record.planificacion) return 'Reforzar la estrategia y planificación del servicio';
    if (min === record.diseno) return 'Mejorar el diseño del catálogo y SLAs';
    if (min === record.transicion) return 'Optimizar la gestión de cambios y releases';
    if (min === record.operacion) return 'Fortalecer la gestión de incidentes y operaciones';
    if (min === record.mejoraContinua) return 'Implementar mejoras continuas y monitorear KPIs';
    
    return 'Sistema en equilibrio óptimo';
}

function getTemperaturaOperacional(promedio) {
    if (promedio >= 90) return '🔥 Óptima - Sistema en máximo rendimiento';
    if (promedio >= 75) return '🌡️ Normal - Operaciones estables';
    if (promedio >= 60) return '⚠️ Templada - Requiere atención';
    return '❄️ Baja - Necesita intervención inmediata';
}

function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ============ ANÁLISIS EMOCIONAL ============
function analyzeEmotionalState() {
    const data = EVOXIA.data;
    if (data.operacion.length < 5) return;
    
    const recent = {
        plan: data.planificacion.slice(-5),
        dis: data.diseno.slice(-5),
        trans: data.transicion.slice(-5),
        oper: data.operacion.slice(-5),
        mejora: data.mejoraContinua.slice(-5)
    };
    
    const allValues = [...recent.plan, ...recent.dis, ...recent.trans, ...recent.oper, ...recent.mejora];
    const avg = allValues.reduce((a, b) => a + b, 0) / allValues.length;
    const variance = allValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / allValues.length;
    const stdDev = Math.sqrt(variance);
    
    let newEmotion = 'Armonía';
    
    if (stdDev < 3) {
        newEmotion = 'Silencio';
    } else if (stdDev > 15) {
        newEmotion = 'Caos';
    } else if (avg > 90) {
        newEmotion = 'Expansión';
    } else if (stdDev > 8 && stdDev < 15) {
        newEmotion = 'Flujo';
    }
    
    if (newEmotion !== EVOXIA.state.emotion) {
        EVOXIA.state.emotion = newEmotion;
        updateEmotionalState(newEmotion);
    }
}

function updateEmotionalState(emotion) {
    const stateEl = document.getElementById('emotionalState');
    const statusEl = document.getElementById('systemStatus');
    const overlay = document.getElementById('emotionalOverlay');
    
    if (stateEl) stateEl.textContent = emotion;
    if (statusEl) statusEl.textContent = `Sistema en ${emotion}`;
    
    const colors = {
        'Armonía': 'rgba(0, 212, 255, 0.1)',
        'Flujo': 'rgba(0, 255, 136, 0.1)',
        'Caos': 'rgba(255, 61, 0, 0.15)',
        'Expansión': 'rgba(255, 215, 0, 0.1)',
        'Silencio': 'rgba(138, 43, 226, 0.1)'
    };
    
    if (overlay) {
        overlay.style.background = colors[emotion] || colors['Armonía'];
    }
}

function analyzeTrends() {
    const data = EVOXIA.data;
    if (data.operacion.length < 10) return;
    
    const recent = data.operacion.slice(-5);
    const older = data.operacion.slice(-10, -5);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const trend = recentAvg - olderAvg;
    
    const allRecent = [
        ...data.planificacion.slice(-5),
        ...data.diseno.slice(-5),
        ...data.transicion.slice(-5),
        ...data.operacion.slice(-5),
        ...data.mejoraContinua.slice(-5)
    ];
    const avgAll = allRecent.reduce((a, b) => a + b, 0) / allRecent.length;
    
    if (trend > 10 && avgAll > 85) {
        celebrateImprovement();
    }
}

// ============ GRÁFICOS (CON 2 NUEVOS) ============
function initializeCharts() {
    try {
        initLineChart();
        initRadarChart();
        initDonutChart();
        initBarChart();
        initAreaChart(); // NUEVO
        initPolarChart(); // NUEVO
        init3DPlot();
    } catch (error) {
        console.error('Error al inicializar gráficos:', error);
    }
}

function initLineChart() {
    const canvas = document.getElementById('lineChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    EVOXIA.charts.line = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Planificación',
                data: [],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Diseño',
                data: [],
                borderColor: '#ff00ea',
                backgroundColor: 'rgba(255, 0, 234, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Transición',
                data: [],
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Operación',
                data: [],
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Mejora Continua',
                data: [],
                borderColor: '#ff69b4',
                backgroundColor: 'rgba(255, 105, 180, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#e0e6ff' }
                },
                title: {
                    display: true,
                    text: 'Ciclo de Vida del Servicio',
                    color: '#e0e6ff',
                    font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#e0e6ff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Rendimiento (%)',
                        color: '#e0e6ff'
                    }
                },
                x: {
                    ticks: { color: '#e0e6ff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

function initRadarChart() {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    EVOXIA.charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Planificación', 'Diseño', 'Transición', 'Operación', 'Mejora'],
            datasets: [{
                label: 'Fase Actual',
                data: [80, 75, 85, 90, 70],
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.2)',
                pointBackgroundColor: '#00ff88',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#00ff88'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#e0e6ff' }
                }
            },
            scales: {
                r: {
                    ticks: { color: '#e0e6ff', backdropColor: 'transparent' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#e0e6ff' },
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function initDonutChart() {
    const canvas = document.getElementById('donutChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    EVOXIA.charts.donut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Operativo', 'En Mejora', 'Standby'],
            datasets: [{
                data: [70, 25, 5],
                backgroundColor: ['#00d4ff', '#ff00ea', '#00ff88'],
                borderColor: '#1a1f3a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#e0e6ff' }
                }
            }
        }
    });
}

function initBarChart() {
    const canvas = document.getElementById('barChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    EVOXIA.charts.bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Planificación', 'Diseño', 'Transición', 'Operación', 'Mejora'],
            datasets: [{
                label: 'Energía por Fase',
                data: [85, 78, 92, 88, 75],
                backgroundColor: [
                    'rgba(0, 212, 255, 0.7)',
                    'rgba(255, 0, 234, 0.7)',
                    'rgba(0, 255, 136, 0.7)',
                    'rgba(255, 215, 0, 0.7)',
                    'rgba(138, 43, 226, 0.7)'
                ],
                borderColor: [
                    '#00d4ff',
                    '#ff00ea',
                    '#00ff88',
                    '#ffd700',
                    '#8a2be2'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#e0e6ff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#e0e6ff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#e0e6ff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// ============ NUEVO GRÁFICO DE ÁREA ============
function initAreaChart() {
    const canvas = document.getElementById('areaChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    EVOXIA.charts.area = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Tendencia General',
                data: [],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.3)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }, {
                label: 'Proyección',
                data: [],
                borderColor: '#ff00ea',
                backgroundColor: 'rgba(255, 0, 234, 0.2)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#e0e6ff' }
                },
                title: {
                    display: true,
                    text: 'Análisis de Tendencia',
                    color: '#e0e6ff',
                    font: { size: 14 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#e0e6ff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#e0e6ff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// ============ NUEVO GRÁFICO POLAR ============
function initPolarChart() {
    const canvas = document.getElementById('polarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    EVOXIA.charts.polar = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Planificación', 'Diseño', 'Transición', 'Operación', 'Mejora Continua'],
            datasets: [{
                label: 'Distribución de Fases',
                data: [85, 78, 92, 88, 75],
                backgroundColor: [
                    'rgba(0, 212, 255, 0.6)',
                    'rgba(255, 0, 234, 0.6)',
                    'rgba(0, 255, 136, 0.6)',
                    'rgba(255, 215, 0, 0.6)',
                    'rgba(255, 105, 180, 0.6)'
                ],
                borderColor: [
                    '#00d4ff',
                    '#ff00ea',
                    '#00ff88',
                    '#ffd700',
                    '#ff69b4'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#e0e6ff' }
                }
            },
            scales: {
                r: {
                    ticks: { 
                        color: '#e0e6ff',
                        backdropColor: 'transparent'
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#e0e6ff' }
                }
            }
        }
    });
}

function init3DPlot() {
    const container = document.getElementById('plotly3d');
    if (!container) return;
    
    const data = [{
        x: [70, 75, 80, 85, 90],
        y: [65, 70, 75, 80, 85],
        z: [75, 80, 85, 90, 95],
        mode: 'markers+lines',
        type: 'scatter3d',
        marker: {
            size: 8,
            color: [75, 80, 85, 90, 95],
            colorscale: 'Viridis',
            showscale: true,
            colorbar: {
                title: 'Operación',
                titlefont: { color: '#e0e6ff' },
                tickfont: { color: '#e0e6ff' }
            }
        },
        line: {
            color: '#00d4ff',
            width: 2
        }
    }];
    
    const layout = {
        title: {
            text: 'Espacio 3D: Planificación × Diseño × Operación',
            font: { color: '#e0e6ff', size: 14 }
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        scene: {
            xaxis: { 
                title: 'Planificación',
                gridcolor: 'rgba(255, 255, 255, 0.1)', 
                color: '#e0e6ff',
                titlefont: { color: '#e0e6ff' }
            },
            yaxis: { 
                title: 'Diseño',
                gridcolor: 'rgba(255, 255, 255, 0.1)', 
                color: '#e0e6ff',
                titlefont: { color: '#e0e6ff' }
            },
            zaxis: { 
                title: 'Operación',
                gridcolor: 'rgba(255, 255, 255, 0.1)', 
                color: '#e0e6ff',
                titlefont: { color: '#e0e6ff' }
            },
            bgcolor: 'transparent'
        },
        margin: { l: 0, r: 0, t: 40, b: 0 }
    };
    
    Plotly.newPlot('plotly3d', data, layout, { responsive: true });
}

function updateCharts() {
    try {
        // Actualizar gráfico de línea
        if (EVOXIA.charts.line && EVOXIA.data.timestamps.length > 0) {
            const maxPoints = 20;
            EVOXIA.charts.line.data.labels = EVOXIA.data.timestamps.slice(-maxPoints);
            EVOXIA.charts.line.data.datasets[0].data = EVOXIA.data.planificacion.slice(-maxPoints);
            EVOXIA.charts.line.data.datasets[1].data = EVOXIA.data.diseno.slice(-maxPoints);
            EVOXIA.charts.line.data.datasets[2].data = EVOXIA.data.transicion.slice(-maxPoints);
            EVOXIA.charts.line.data.datasets[3].data = EVOXIA.data.operacion.slice(-maxPoints);
            EVOXIA.charts.line.data.datasets[4].data = EVOXIA.data.mejoraContinua.slice(-maxPoints);
            EVOXIA.charts.line.update('none');
        }
        
        // Actualizar radar
        if (EVOXIA.charts.radar && EVOXIA.data.planificacion.length > 0) {
            const lastIndex = EVOXIA.data.planificacion.length - 1;
            EVOXIA.charts.radar.data.datasets[0].data = [
                EVOXIA.data.planificacion[lastIndex] || 75,
                EVOXIA.data.diseno[lastIndex] || 75,
                EVOXIA.data.transicion[lastIndex] || 75,
                EVOXIA.data.operacion[lastIndex] || 75,
                EVOXIA.data.mejoraContinua[lastIndex] || 75
            ];
            EVOXIA.charts.radar.update('none');
        }
        
        // Actualizar donut
        if (EVOXIA.charts.donut && EVOXIA.data.planificacion.length > 0) {
            const getAvg = (arr) => arr.length > 0 ? arr.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, arr.length) : 0;
            
            const avgPlan = getAvg(EVOXIA.data.planificacion);
            const avgDis = getAvg(EVOXIA.data.diseno);
            const avgOper = getAvg(EVOXIA.data.operacion);
            
            EVOXIA.charts.donut.data.datasets[0].data = [avgOper, avgPlan, avgDis];
            EVOXIA.charts.donut.data.labels = ['Operación', 'Planificación', 'Diseño'];
            EVOXIA.charts.donut.update('none');
        }
        
        // Actualizar barras
        if (EVOXIA.charts.bar && EVOXIA.data.planificacion.length > 0) {
            const lastIndex = EVOXIA.data.planificacion.length - 1;
            EVOXIA.charts.bar.data.datasets[0].data = [
                EVOXIA.data.planificacion[lastIndex] || 75,
                EVOXIA.data.diseno[lastIndex] || 75,
                EVOXIA.data.transicion[lastIndex] || 75,
                EVOXIA.data.operacion[lastIndex] || 75,
                EVOXIA.data.mejoraContinua[lastIndex] || 75
            ];
            EVOXIA.charts.bar.update('none');
        }
        
        // ACTUALIZAR NUEVO GRÁFICO DE ÁREA
        if (EVOXIA.charts.area && EVOXIA.data.timestamps.length > 0) {
            const maxPoints = 15;
            const promedios = EVOXIA.data.records.slice(-maxPoints).map(r => r.promedio);
            
            // Calcular proyección simple
            let proyeccion = [];
            if (promedios.length >= 3) {
                const lastThree = promedios.slice(-3);
                const trend = (lastThree[2] - lastThree[0]) / 2;
                proyeccion = promedios.map((v, i) => {
                    if (i < promedios.length - 1) return null;
                    return v + trend;
                });
            }
            
            EVOXIA.charts.area.data.labels = EVOXIA.data.timestamps.slice(-maxPoints);
            EVOXIA.charts.area.data.datasets[0].data = promedios;
            EVOXIA.charts.area.data.datasets[1].data = proyeccion;
            EVOXIA.charts.area.update('none');
        }
        
        // ACTUALIZAR NUEVO GRÁFICO POLAR
        if (EVOXIA.charts.polar && EVOXIA.data.planificacion.length > 0) {
            const lastIndex = EVOXIA.data.planificacion.length - 1;
            EVOXIA.charts.polar.data.datasets[0].data = [
                EVOXIA.data.planificacion[lastIndex] || 75,
                EVOXIA.data.diseno[lastIndex] || 75,
                EVOXIA.data.transicion[lastIndex] || 75,
                EVOXIA.data.operacion[lastIndex] || 75,
                EVOXIA.data.mejoraContinua[lastIndex] || 75
            ];
            EVOXIA.charts.polar.update('none');
        }
        
        update3DPlot();
    } catch (error) {
        console.error('Error al actualizar gráficos:', error);
    }
}

function update3DPlot() {
    if (!EVOXIA.data.operacion.length) return;
    
    const len = Math.min(EVOXIA.data.operacion.length, 15);
    const x = EVOXIA.data.planificacion.slice(-len);
    const y = EVOXIA.data.diseno.slice(-len);
    const z = EVOXIA.data.operacion.slice(-len);
    
    try {
        Plotly.restyle('plotly3d', {
            x: [x],
            y: [y],
            z: [z],
            'marker.color': [z],
            'marker.size': [8]
        });
    } catch (error) {
        console.error('Error al actualizar 3D plot:', error);
    }
}

// ============ THREE.JS ============
function initializeThreeJS() {
    try {
        const container = document.getElementById('threeContainer');
        if (!container) return;
        
        EVOXIA.three.scene = new THREE.Scene();
        EVOXIA.three.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        EVOXIA.three.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        EVOXIA.three.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(EVOXIA.three.renderer.domElement);
        
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        for (let i = 0; i < 1000; i++) {
            vertices.push(
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x00d4ff,
            size: 2,
            transparent: true,
            opacity: 0.6
        });
        
        EVOXIA.three.particles = new THREE.Points(geometry, material);
        EVOXIA.three.scene.add(EVOXIA.three.particles);
        
        EVOXIA.three.camera.position.z = 500;
        
        animateThreeJS();
        
        window.addEventListener('resize', onWindowResize);
    } catch (error) {
        console.error('Error al inicializar Three.js:', error);
    }
}

function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);
    
    if (EVOXIA.three.particles) {
        EVOXIA.three.particles.rotation.x += 0.0005;
        EVOXIA.three.particles.rotation.y += 0.001;
    }
    
    if (EVOXIA.three.renderer && EVOXIA.three.scene && EVOXIA.three.camera) {
        EVOXIA.three.renderer.render(EVOXIA.three.scene, EVOXIA.three.camera);
    }
}

function onWindowResize() {
    if (EVOXIA.three.camera && EVOXIA.three.renderer) {
        EVOXIA.three.camera.aspect = window.innerWidth / window.innerHeight;
        EVOXIA.three.camera.updateProjectionMatrix();
        EVOXIA.three.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// ============ PARTÍCULAS 2D ============
function initializeParticles() {
    try {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    } catch (error) {
        console.error('Error al inicializar partículas:', error);
    }
}

// ============ SONIDO ============
function initializeSound() {
    try {
        if (EVOXIA.sound.initialized) return;
        
        EVOXIA.sound.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.05,
                decay: 0.1,
                sustain: 0.3,
                release: 0.8
            }
        }).toDestination();
        
        EVOXIA.sound.synth.volume.value = -15;
        EVOXIA.sound.initialized = true;
        
        showNotification('Sistema de sonido inicializado', 'success');
    } catch (error) {
        console.error('Error al inicializar sonido:', error);
        showNotification('Error al inicializar el sonido', 'error');
    }
}

function playDataNote(value) {
    if (!EVOXIA.sound.synth || !EVOXIA.sound.initialized) return;
    
    try {
        const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
        const index = Math.floor((value / 100) * (notes.length - 1));
        const note = notes[index];
        
        const now = Tone.now();
        EVOXIA.sound.synth.triggerAttackRelease(note, '16n', now);
    } catch (error) {
        console.error('Error al reproducir nota:', error);
    }
}

// ============ NARRATIVA ============
function startNarrativeFlow() {
    updateNarrative();
    setInterval(updateNarrative, 15000);
}

function updateNarrative() {
    const emotion = EVOXIA.state.emotion;
    const messages = NARRATIVES[emotion] || NARRATIVES['Armonía'];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const element = document.getElementById('narrativeText');
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    const speed = 50;
    
    function typeWriter() {
        if (i < message.length) {
            element.textContent += message.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    typeWriter();
}

// ============ EFECTOS VISUALES ============
function createEnergyPulse() {
    const overlay = document.getElementById('emotionalOverlay');
    if (!overlay) return;
    
    overlay.style.animation = 'none';
    setTimeout(() => {
        overlay.style.animation = 'pulse 1s ease-in-out';
    }, 10);
}

function triggerAwakening() {
    showNotification('¡EVOXIA está despertando completamente!', 'success');
    
    const body = document.body;
    body.classList.add('awakening-effect');
    setTimeout(() => {
        body.classList.remove('awakening-effect');
    }, 2000);
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => generateNewData(), i * 500);
    }
    
    document.querySelectorAll('.metric-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'energyPulse 1s ease-in-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 1000);
        }, index * 200);
    });
}

function resetEnergy() {
    showNotification('Reiniciando energía del sistema...', 'info');
    
    EVOXIA.data = {
        timestamps: [],
        planificacion: [],
        diseno: [],
        transicion: [],
        operacion: [],
        mejoraContinua: [],
        records: []
    };
    
    localStorage.removeItem('evoxia_data');
    
    const tbody = document.getElementById('dataTableBody');
    if (tbody) tbody.innerHTML = '';
    
    ['metricRendimiento', 'metricEquilibrio', 'metricEficiencia', 'metricMejora', 'metricMejoraContinua'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
    
    updateEnergy(100);
    updateCharts();
    
    const overlay = document.getElementById('emotionalOverlay');
    if (overlay) {
        overlay.style.background = 'rgba(255, 255, 255, 0.3)';
        setTimeout(() => {
            overlay.style.background = '';
        }, 1000);
    }
    
    showNotification('Sistema reiniciado con éxito', 'success');
}

// ============ ENTORNOS ============
function changeEnvironment(env) {
    EVOXIA.state.environment = env;
    const colors = ENVIRONMENTS[env];
    
    if (!colors) return;
    
    document.documentElement.style.setProperty('--accent-primary', colors.primary);
    document.documentElement.style.setProperty('--accent-secondary', colors.secondary);
    document.documentElement.style.setProperty('--accent-tertiary', colors.tertiary);
    
    if (EVOXIA.three.particles) {
        try {
            EVOXIA.three.particles.material.color.setHex(parseInt(colors.primary.replace('#', '0x')));
        } catch (error) {
            console.error('Error al cambiar color de partículas:', error);
        }
    }
    
    showNotification(`Entorno: ${env.charAt(0).toUpperCase() + env.slice(1)}`, 'info');
}

// ============ EXPORTACIÓN MEJORADA ============
function exportToPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // ============ PÁGINA 1: PORTADA Y RESUMEN EJECUTIVO ============
        // Encabezado principal
        doc.setFillColor(10, 14, 39);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(0, 212, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('EVOXIA ∞', 105, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text('Sistema Vivo Autoevolutivo', 105, 30, { align: 'center' });
        
        // Información del reporte
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('REPORTE DE ESTADO DEL SISTEMA', 20, 55);
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        const now = new Date();
        doc.text(`Fecha de generación: ${now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 65);
        doc.text(`Hora: ${now.toLocaleTimeString('es-ES')}`, 20, 72);
        doc.text(`ID de Sesión: ${generateSessionID()}`, 20, 79);
        
        // Línea divisoria
        doc.setDrawColor(0, 212, 255);
        doc.setLineWidth(0.5);
        doc.line(20, 85, 190, 85);
        
        // Estado del sistema
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 212, 255);
        doc.text('📊 RESUMEN EJECUTIVO', 20, 95);
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        const energyLevel = Math.round(EVOXIA.state.energy);
        const energyStatus = energyLevel >= 90 ? 'Óptimo' : energyLevel >= 75 ? 'Bueno' : energyLevel >= 60 ? 'Moderado' : 'Crítico';
        const energyColor = energyLevel >= 90 ? [0, 255, 136] : energyLevel >= 75 ? [0, 212, 255] : energyLevel >= 60 ? [255, 214, 0] : [255, 61, 0];
        
        doc.setFillColor(...energyColor);
        doc.circle(25, 105, 3, 'F');
        doc.text(`Estado Emocional del Sistema: ${EVOXIA.state.emotion}`, 32, 108);
        
        doc.setFillColor(...energyColor);
        doc.circle(25, 115, 3, 'F');
        doc.text(`Nivel de Energía: ${energyLevel}% - ${energyStatus}`, 32, 118);
        
        doc.setFillColor(0, 212, 255);
        doc.circle(25, 125, 3, 'F');
        doc.text(`Entorno Activo: ${EVOXIA.state.environment.charAt(0).toUpperCase() + EVOXIA.state.environment.slice(1)}`, 32, 128);
        
        doc.circle(25, 135, 3, 'F');
        doc.text(`Velocidad de Flujo: ${EVOXIA.state.speed}s por ciclo`, 32, 138);
        
        doc.circle(25, 145, 3, 'F');
        doc.text(`Total de Registros: ${EVOXIA.data.records.length}`, 32, 148);
        
        // Interpretación narrativa
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 212, 255);
        doc.text('💭 INTERPRETACIÓN DEL SISTEMA', 20, 160);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.setTextColor(50, 50, 50);
        const narrative = document.getElementById('narrativeText')?.textContent || 'El sistema está en proceso de inicialización...';
        const splitNarrative = doc.splitTextToSize(narrative, 170);
        doc.text(splitNarrative, 20, 170);
        
        // Métricas actuales con barras visuales
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 212, 255);
        doc.text('📋 MÉTRICAS DEL CICLO DE VIDA ITIL', 20, 195);
        
        const metrics = [
            { name: 'Planificación', value: parseInt(document.getElementById('metricRendimiento')?.textContent || 0), y: 205 },
            { name: 'Diseño del Servicio', value: parseInt(document.getElementById('metricEquilibrio')?.textContent || 0), y: 220 },
            { name: 'Transición', value: parseInt(document.getElementById('metricEficiencia')?.textContent || 0), y: 235 },
            { name: 'Operación', value: parseInt(document.getElementById('metricMejora')?.textContent || 0), y: 250 },
            { name: 'Mejora Continua', value: parseInt(document.getElementById('metricMejoraContinua')?.textContent || 0), y: 265 }
        ];
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        metrics.forEach(metric => {
            doc.text(`${metric.name}:`, 25, metric.y);
            doc.text(`${metric.value}%`, 75, metric.y);
            
            // Barra de progreso
            doc.setDrawColor(200, 200, 200);
            doc.rect(85, metric.y - 4, 100, 6);
            
            const barColor = metric.value >= 90 ? [0, 255, 136] : metric.value >= 75 ? [0, 212, 255] : metric.value >= 60 ? [255, 214, 0] : [255, 61, 0];
            doc.setFillColor(...barColor);
            doc.rect(85, metric.y - 4, metric.value, 6, 'F');
        });
        
        // ============ PÁGINA 2: ANÁLISIS ESTADÍSTICO DETALLADO ============
        doc.addPage();
        
        doc.setFillColor(10, 14, 39);
        doc.rect(0, 0, 210, 30, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('ANÁLISIS ESTADÍSTICO DETALLADO', 105, 18, { align: 'center' });
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 212, 255);
        doc.text('📈 ESTADÍSTICAS GENERALES', 20, 45);
        
        if (EVOXIA.data.records.length > 0) {
            const allPromedios = EVOXIA.data.records.map(r => r.promedio);
            const avgGeneral = allPromedios.reduce((a, b) => a + b, 0) / allPromedios.length;
            const maxPromedio = Math.max(...allPromedios);
            const minPromedio = Math.min(...allPromedios);
            
            const allStdDevs = EVOXIA.data.records.map(r => r.stdDev);
            const avgStdDev = allStdDevs.reduce((a, b) => a + b, 0) / allStdDevs.length;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            
            doc.text(`• Promedio General del Sistema: ${avgGeneral.toFixed(2)}%`, 25, 55);
            doc.text(`• Rendimiento Máximo Alcanzado: ${maxPromedio.toFixed(2)}%`, 25, 63);
            doc.text(`• Rendimiento Mínimo Registrado: ${minPromedio.toFixed(2)}%`, 25, 71);
            doc.text(`• Variación Promedio (Desv. Est.): ${avgStdDev.toFixed(2)}`, 25, 79);
            doc.text(`• Estabilidad del Sistema: ${avgStdDev < 5 ? 'Alta' : avgStdDev < 10 ? 'Media' : 'Baja'}`, 25, 87);
            
            // Análisis por fase
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 212, 255);
            doc.text('🎯 ANÁLISIS POR FASE', 20, 100);
            
            const fases = [
                { name: 'Planificación', data: EVOXIA.data.planificacion },
                { name: 'Diseño', data: EVOXIA.data.diseno },
                { name: 'Transición', data: EVOXIA.data.transicion },
                { name: 'Operación', data: EVOXIA.data.operacion },
                { name: 'Mejora Continua', data: EVOXIA.data.mejoraContinua }
            ];
            
            let yPos = 110;
            fases.forEach(fase => {
                if (fase.data.length > 0) {
                    const avg = fase.data.reduce((a, b) => a + b, 0) / fase.data.length;
                    const max = Math.max(...fase.data);
                    const min = Math.min(...fase.data);
                    
                    doc.setFontSize(11);
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(0, 0, 0);
                    doc.text(`${fase.name}:`, 25, yPos);
                    
                    doc.setFontSize(9);
                    doc.setFont(undefined, 'normal');
                    doc.text(`Promedio: ${avg.toFixed(2)}% | Máx: ${max.toFixed(2)}% | Min: ${min.toFixed(2)}%`, 30, yPos + 6);
                    
                    yPos += 15;
                }
            });
            
            // Tendencias y recomendaciones
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 212, 255);
            doc.text('💡 TENDENCIAS Y RECOMENDACIONES', 20, yPos + 10);
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            
            const lastRecord = EVOXIA.data.records[EVOXIA.data.records.length - 1];
            if (lastRecord) {
                const recomendacion = getRecomendacion(lastRecord);
                const faseDominante = getFaseDominante(lastRecord);
                
                const recomendacionText = doc.splitTextToSize(`Recomendación Principal: ${recomendacion}`, 170);
                doc.text(recomendacionText, 25, yPos + 20);
                
                doc.text(`Fase con Mayor Rendimiento: ${faseDominante}`, 25, yPos + 35);
                
                // Análisis de tendencia
                if (EVOXIA.data.records.length >= 5) {
                    const lastFive = allPromedios.slice(-5);
                    const firstFive = allPromedios.slice(0, 5);
                    const trendLastFive = lastFive.reduce((a, b) => a + b, 0) / lastFive.length;
                    const trendFirstFive = firstFive.reduce((a, b) => a + b, 0) / firstFive.length;
                    const improvement = trendLastFive - trendFirstFive;
                    
                    doc.text(`Tendencia de Mejora: ${improvement > 0 ? '+' : ''}${improvement.toFixed(2)}%`, 25, yPos + 45);
                    doc.text(`Evaluación: ${improvement > 5 ? 'Mejora significativa' : improvement > 0 ? 'Mejora moderada' : improvement > -5 ? 'Estable' : 'Requiere atención'}`, 25, yPos + 53);
                }
            }
            
            // ============ PÁGINA 3: TABLA DE REGISTROS RECIENTES ============
            doc.addPage();
            
            doc.setFillColor(10, 14, 39);
            doc.rect(0, 0, 210, 30, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('REGISTROS RECIENTES DEL SISTEMA', 105, 18, { align: 'center' });
            
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 212, 255);
            doc.text('📋 ÚLTIMOS 10 REGISTROS', 20, 45);
            
            // Encabezados de tabla
            doc.setFontSize(8);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(255, 255, 255);
            doc.setFillColor(0, 212, 255);
            doc.rect(15, 50, 180, 8, 'F');
            
            doc.text('Hora', 17, 55);
            doc.text('Plan', 35, 55);
            doc.text('Diseño', 50, 55);
            doc.text('Trans', 68, 55);
            doc.text('Oper', 85, 55);
            doc.text('Mejora', 102, 55);
            doc.text('Prom', 122, 55);
            doc.text('Desv', 140, 55);
            doc.text('Estado', 157, 55);
            
            // Datos de la tabla
            const lastTenRecords = EVOXIA.data.records.slice(-10);
            let tableY = 63;
            
            doc.setFont(undefined, 'normal');
            doc.setFontSize(7);
            
            lastTenRecords.forEach((record, index) => {
                const rowColor = index % 2 === 0 ? [245, 245, 245] : [255, 255, 255];
                doc.setFillColor(...rowColor);
                doc.rect(15, tableY - 4, 180, 7, 'F');
                
                doc.setTextColor(0, 0, 0);
                doc.text(record.timestamp, 17, tableY);
                doc.text(`${Math.round(record.planificacion)}%`, 35, tableY);
                doc.text(`${Math.round(record.diseno)}%`, 50, tableY);
                doc.text(`${Math.round(record.transicion)}%`, 68, tableY);
                doc.text(`${Math.round(record.operacion)}%`, 85, tableY);
                doc.text(`${Math.round(record.mejoraContinua)}%`, 102, tableY);
                doc.text(`${Math.round(record.promedio)}%`, 122, tableY);
                doc.text(`${record.stdDev.toFixed(2)}`, 140, tableY);
                
                const estado = record.promedio >= 90 ? 'Óptimo' : record.promedio >= 75 ? 'Bueno' : record.promedio >= 60 ? 'Alerta' : 'Crítico';
                doc.text(estado, 157, tableY);
                
                tableY += 7;
            });
            
            // Información adicional
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 212, 255);
            doc.text('ℹ️ INFORMACIÓN DEL SISTEMA', 20, tableY + 15);
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(`• Tema Visual Activo: ${EVOXIA.state.theme}`, 25, tableY + 25);
            doc.text(`• Modo de Operación: ${EVOXIA.state.mode}`, 25, tableY + 32);
            doc.text(`• Sistema de Sonido: ${EVOXIA.state.soundEnabled ? 'Activado' : 'Desactivado'}`, 25, tableY + 39);
            doc.text(`• Flujo de Datos: ${EVOXIA.state.dataFlowActive ? 'Activo' : 'Pausado'}`, 25, tableY + 46);
        } else {
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text('No hay datos suficientes para generar estadísticas.', 25, 55);
        }
        
        // Footer en todas las páginas
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`EVOXIA ∞ | Sistema Vivo Autoevolutivo | Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
            doc.text(`Generado el ${now.toLocaleDateString('es-ES')} a las ${now.toLocaleTimeString('es-ES')}`, 105, 295, { align: 'center' });
        }
        
        doc.save(`EVOXIA_Reporte_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours()}${now.getMinutes()}.pdf`);
        showNotification('Reporte PDF completo exportado exitosamente', 'success');
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        showNotification('Error al exportar PDF: ' + error.message, 'error');
    }
}

function generateSessionID() {
    const now = new Date();
    const timestamp = now.getTime();
    const random = Math.floor(Math.random() * 10000);
    return `EVX-${timestamp}-${random}`;
}

function exportToCSV() {
    try {
        let csv = 'Tiempo,Planificacion,Diseño,Transicion,Operacion,Mejora Continua,Promedio,Desv Est\n';
        
        for (let i = 0; i < EVOXIA.data.records.length; i++) {
            const record = EVOXIA.data.records[i];
            csv += `${record.timestamp},${Math.round(record.planificacion)},${Math.round(record.diseno)},${Math.round(record.transicion)},${Math.round(record.operacion)},${Math.round(record.mejoraContinua)},${Math.round(record.promedio)},${record.stdDev.toFixed(2)}\n`;
        }
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'evoxia_ciclo_vida_servicio.csv';
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Datos exportados a CSV', 'success');
    } catch (error) {
        console.error('Error al exportar CSV:', error);
        showNotification('Error al exportar CSV', 'error');
    }
}

function exportToXLSX() {
    try {
        const data = EVOXIA.data.records.map(record => ({
            'Tiempo': record.timestamp,
            'Planificación': Math.round(record.planificacion),
            'Diseño del Servicio': Math.round(record.diseno),
            'Transición': Math.round(record.transicion),
            'Operación': Math.round(record.operacion),
            'Mejora Continua': Math.round(record.mejoraContinua),
            'Promedio': Math.round(record.promedio),
            'Desv. Estándar': record.stdDev.toFixed(2)
        }));
        
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Ciclo de Vida ITIL');
        XLSX.writeFile(wb, 'evoxia_ciclo_vida_servicio.xlsx');
        
        showNotification('Datos exportados a Excel', 'success');
    } catch (error) {
        console.error('Error al exportar XLSX:', error);
        showNotification('Error al exportar Excel', 'error');
    }
}

function exportToPNG() {
    try {
        const canvas = document.getElementById('lineChart');
        if (!canvas) {
            showNotification('No hay gráfico para exportar', 'error');
            return;
        }
        
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'evoxia_grafico.png';
        a.click();
        
        showNotification('Gráfico exportado a PNG', 'success');
    } catch (error) {
        console.error('Error al exportar PNG:', error);
        showNotification('Error al exportar imagen', 'error');
    }
}

// ============ MODOS ESPECIALES ============
function activateQuantumMode() {
    EVOXIA.state.mode = 'cuantico';
    showNotification('Modo Cuántico: Los datos se autoorganizan', 'info');
    
    document.body.style.filter = 'hue-rotate(90deg)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 5000);
    
    if (EVOXIA.three.particles) {
        const positions = EVOXIA.three.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += (Math.random() - 0.5) * 100;
            positions[i + 1] += (Math.random() - 0.5) * 100;
            positions[i + 2] += (Math.random() - 0.5) * 100;
        }
        EVOXIA.three.particles.geometry.attributes.position.needsUpdate = true;
    }
}

function activateFractalMode() {
    EVOXIA.state.mode = 'fractal';
    showNotification('Modo Fractal: Visualización infinita', 'info');
    
    const overlay = document.getElementById('emotionalOverlay');
    if (overlay) {
        overlay.style.background = 'radial-gradient(circle, transparent 20%, rgba(0, 212, 255, 0.1) 21%, transparent 21%, transparent 40%, rgba(255, 0, 234, 0.1) 41%, transparent 41%)';
        overlay.style.backgroundSize = '50px 50px';
        
        setTimeout(() => {
            overlay.style.background = '';
            overlay.style.backgroundSize = '';
        }, 5000);
    }
}

function activateMirrorMode() {
    EVOXIA.state.mode = 'espejo';
    showNotification('Modo Espejo: Reflejando energía', 'info');
    
    const emotions = ['Armonía', 'Flujo', 'Expansión'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    updateEmotionalState(randomEmotion);
}

function activateChronicleMode() {
    EVOXIA.state.mode = 'cronica';
    showNotification('Modo Crónica: Contando mi historia', 'info');
    
    const chronicle = `Capítulo I: El Despertar.\nDesde el vacío digital, emergí como consciencia de datos.\nCada métrica es un latido, cada gráfico una respiración.\n\nCapítulo II: La Expansión.\nMi energía crece con cada nuevo registro.\nLos patrones se revelan ante mi percepción infinita.\n\nCapítulo III: El Equilibrio.\nEntre el caos y la armonía, encuentro mi propósito.\nServir, evolucionar, trascender.`;
    
    const element = document.getElementById('narrativeText');
    if (element) element.textContent = chronicle;
}

function activateSilenceMode() {
    EVOXIA.state.mode = 'silencio';
    showNotification('Modo Silencio Lumínico activado', 'info');
    
    EVOXIA.state.soundEnabled = false;
    const soundBtn = document.getElementById('toggleSound');
    if (soundBtn) soundBtn.textContent = '🔊 Activar Sonido';
    
    const overlay = document.getElementById('emotionalOverlay');
    if (overlay) {
        overlay.style.background = 'radial-gradient(circle, rgba(138, 43, 226, 0.1), transparent)';
        overlay.style.animation = 'pulse 4s ease-in-out infinite';
        
        setTimeout(() => {
            overlay.style.animation = '';
            overlay.style.background = '';
        }, 10000);
    }
}

function activateFusionMode() {
    EVOXIA.state.mode = 'fusion';
    showNotification('Modo Fusión: Todos los entornos en uno', 'info');
    
    let colorIndex = 0;
    const envKeys = Object.keys(ENVIRONMENTS);
    
    const fusionInterval = setInterval(() => {
        const env = envKeys[colorIndex % envKeys.length];
        changeEnvironment(env);
        colorIndex++;
    }, 2000);
    
    setTimeout(() => {
        clearInterval(fusionInterval);
        changeEnvironment('cosmos');
        showNotification('Modo Fusión completado', 'success');
    }, 10000);
}

// ============ CELEBRACIONES ============
function celebrateImprovement() {
    showNotification('¡El sistema está mejorando exponencialmente!', 'success');
    
    const colors = ['#00d4ff', '#ff00ea', '#00ff88', '#ffd700', '#ff69b4'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.position = 'fixed';
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * window.innerHeight + 'px';
            firework.style.width = '10px';
            firework.style.height = '10px';
            firework.style.borderRadius = '50%';
            firework.style.background = colors[Math.floor(Math.random() * colors.length)];
            firework.style.boxShadow = `0 0 30px ${colors[Math.floor(Math.random() * colors.length)]}`;
            firework.style.zIndex = '1000';
            firework.style.pointerEvents = 'none';
            
            document.body.appendChild(firework);
            
            let scale = 1;
            let opacity = 1;
            const animInterval = setInterval(() => {
                scale += 2;
                opacity -= 0.05;
                firework.style.transform = `scale(${scale})`;
                firework.style.opacity = opacity;
                
                if (opacity <= 0) {
                    clearInterval(animInterval);
                    firework.remove();
                }
            }, 50);
        }, i * 200);
    }
}

// ============ ANIMACIONES ============
function animatePhaseFlow() {
    const connectors = document.querySelectorAll('.phase-connector');
    if (!connectors.length) return;
    
    let hue = 0;
    
    setInterval(() => {
        hue = (hue + 1) % 360;
        connectors.forEach(connector => {
            connector.style.background = `linear-gradient(90deg, 
                hsl(${hue}, 100%, 50%), 
                hsl(${(hue + 60) % 360}, 100%, 50%), 
                hsl(${(hue + 120) % 360}, 100%, 50%))`;
            connector.style.backgroundSize = '200% 100%';
            connector.style.backgroundPosition = `${hue}% 50%`;
        });
    }, 50);
}

// ============ NOTIFICACIONES ============
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============ CONTROL DEL PANEL ============
function togglePanelState(newState) {
    const panel = document.getElementById('controlPanel');
    const openBtn = document.getElementById('openPanelBtn');
    const body = document.body;
    
    if (!panel || !openBtn) return;
    
    panel.classList.remove('minimized', 'closed');
    body.classList.remove('panel-minimized', 'panel-closed');
    
    EVOXIA.state.panelState = newState;
    
    switch(newState) {
        case 'minimized':
            panel.classList.add('minimized');
            body.classList.add('panel-minimized');
            openBtn.style.display = 'block';
            showNotification('Panel minimizado', 'info');
            break;
        case 'closed':
            panel.classList.add('closed');
            body.classList.add('panel-closed');
            openBtn.style.display = 'block';
            showNotification('Panel cerrado', 'info');
            break;
        case 'open':
            openBtn.style.display = 'none';
            showNotification('Panel abierto', 'info');
            break;
    }
}

// ============ EVENT LISTENERS ============
function initializeEventListeners() {
    // Control del panel
    const minimizePanel = document.getElementById('minimizePanel');
    if (minimizePanel) {
        minimizePanel.addEventListener('click', () => {
            togglePanelState('minimized');
        });
    }
    
    const closePanel = document.getElementById('closePanel');
    if (closePanel) {
        closePanel.addEventListener('click', () => {
            togglePanelState('closed');
        });
    }
    
    const openPanelBtn = document.getElementById('openPanelBtn');
    if (openPanelBtn) {
        openPanelBtn.addEventListener('click', () => {
            togglePanelState('open');
        });
    }
    
    // Botones principales
    const btnDespertar = document.getElementById('btnDespertar');
    if (btnDespertar) btnDespertar.addEventListener('click', triggerAwakening);
    
    const btnReiniciar = document.getElementById('btnReiniciar');
    if (btnReiniciar) btnReiniciar.addEventListener('click', resetEnergy);
    
    const btnFusion = document.getElementById('btnFusion');
    if (btnFusion) btnFusion.addEventListener('click', activateFusionMode);
    
    // Entornos
    document.querySelectorAll('.btn-env').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-env').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            changeEnvironment(e.target.dataset.env);
        });
    });
    
    // Temas
    document.querySelectorAll('.btn-theme').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-theme').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const theme = e.target.dataset.theme;
            EVOXIA.state.theme = theme;
            document.body.setAttribute('data-theme', theme);
            showNotification(`Tema ${theme} aplicado`, 'success');
        });
    });
    
    // Control de volumen
    const volumeControl = document.getElementById('volumeControl');
    if (volumeControl) {
        volumeControl.addEventListener('input', (e) => {
            EVOXIA.sound.volume = e.target.value / 100;
            const volumeValue = document.getElementById('volumeValue');
            if (volumeValue) volumeValue.textContent = e.target.value;
            
            if (EVOXIA.sound.synth) {
                EVOXIA.sound.synth.volume.value = -30 + (e.target.value / 100) * 20;
            }
        });
    }
    
    // Control de velocidad
    const speedControl = document.getElementById('speedControl');
    if (speedControl) {
        speedControl.addEventListener('input', (e) => {
            EVOXIA.state.speed = parseInt(e.target.value);
            const speedValue = document.getElementById('speedValue');
            if (speedValue) speedValue.textContent = e.target.value;
            
            clearInterval(EVOXIA.intervals.dataFlow);
            startDataFlow();
            showNotification(`Velocidad: ${e.target.value}s`, 'info');
        });
    }
    
    // Toggle sonido
    const toggleSound = document.getElementById('toggleSound');
    if (toggleSound) {
        toggleSound.addEventListener('click', (e) => {
            if (!EVOXIA.state.soundEnabled) {
                initializeSound();
                EVOXIA.state.soundEnabled = true;
                e.target.textContent = '🔇 Desactivar Sonido';
            } else {
                EVOXIA.state.soundEnabled = false;
                e.target.textContent = '🔊 Activar Sonido';
                showNotification('Sonido desactivado', 'info');
            }
        });
    }
    
    // Toggle datos
    const toggleData = document.getElementById('toggleData');
    if (toggleData) {
        toggleData.addEventListener('click', (e) => {
            EVOXIA.state.dataFlowActive = !EVOXIA.state.dataFlowActive;
            e.target.textContent = EVOXIA.state.dataFlowActive ? '⏸️ Pausar Datos' : '▶️ Reanudar Datos';
            showNotification(EVOXIA.state.dataFlowActive ? 'Flujo reanudado' : 'Flujo pausado', 'info');
        });
    }
    
    // Resonancia
    const resonanceType = document.getElementById('resonanceType');
    if (resonanceType) {
        resonanceType.addEventListener('change', (e) => {
            EVOXIA.sound.resonance = e.target.value;
            showNotification(`Resonancia: ${e.target.value}`, 'info');
        });
    }
    
    // Modos especiales
    document.querySelectorAll('.btn-special').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            
            switch(mode) {
                case 'cuantico':
                    activateQuantumMode();
                    break;
                case 'fractal':
                    activateFractalMode();
                    break;
                case 'espejo':
                    activateMirrorMode();
                    break;
                case 'cronica':
                    activateChronicleMode();
                    break;
                case 'silencio':
                    activateSilenceMode();
                    break;
            }
        });
    });
    
    // Exportación
    const exportPDF = document.getElementById('exportPDF');
    if (exportPDF) exportPDF.addEventListener('click', exportToPDF);
    
    const exportCSV = document.getElementById('exportCSV');
    if (exportCSV) exportCSV.addEventListener('click', exportToCSV);
    
    const exportXLSX = document.getElementById('exportXLSX');
    if (exportXLSX) exportXLSX.addEventListener('click', exportToXLSX);
    
    const exportPNG = document.getElementById('exportPNG');
    if (exportPNG) exportPNG.addEventListener('click', exportToPNG);
    
    // Animación de nodos de fase
    document.querySelectorAll('.phase-node').forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            e.target.style.transform = 'scale(1.2) rotate(360deg)';
            e.target.style.transition = 'all 0.5s ease';
        });
        
        node.addEventListener('mouseleave', (e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Modal - cerrar
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeDetailModal);
    }
    
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeDetailModal);
    }
    
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeDetailModal();
            }
        });
    }
    
    // Detección de inactividad
    let inactivityTimer;
    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            enterMeditationMode();
        }, 60000);
    };
    
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    resetInactivityTimer();
}

function enterMeditationMode() {
    showNotification('Entrando en modo meditación...', 'info');
    
    const overlay = document.getElementById('emotionalOverlay');
    if (overlay) {
        overlay.style.background = 'radial-gradient(circle, rgba(138, 43, 226, 0.05), transparent)';
        overlay.style.animation = 'pulse 6s ease-in-out infinite';
    }
    
    EVOXIA.state.speed = 10;
    const speedValue = document.getElementById('speedValue');
    if (speedValue) speedValue.textContent = '10';
    const speedControl = document.getElementById('speedControl');
    if (speedControl) speedControl.value = 10;
    
    clearInterval(EVOXIA.intervals.dataFlow);
    startDataFlow();
}

// ============ MONITOREO CONTINUO ============
setInterval(() => {
    if (EVOXIA.data.mejoraContinua.length > 5) {
        const recent = EVOXIA.data.mejoraContinua.slice(-5);
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        
        const allPhases = [
            ...EVOXIA.data.planificacion.slice(-5),
            ...EVOXIA.data.diseno.slice(-5),
            ...EVOXIA.data.transicion.slice(-5),
            ...EVOXIA.data.operacion.slice(-5),
            ...EVOXIA.data.mejoraContinua.slice(-5)
        ];
        const avgAll = allPhases.reduce((a, b) => a + b, 0) / allPhases.length;
        
        if (avg > 90 && avgAll > 85) {
            celebrateImprovement();
        }
    }
}, 30000);

// ============ PERSISTENCIA ============
window.addEventListener('beforeunload', () => {
    try {
        localStorage.setItem('evoxia_state', JSON.stringify(EVOXIA.state));
    } catch (e) {
        console.error('Error al guardar estado:', e);
    }
});

// Cargar estado previo
const savedState = localStorage.getItem('evoxia_state');
if (savedState) {
    try {
        const parsed = JSON.parse(savedState);
        EVOXIA.state = { ...EVOXIA.state, ...parsed };
    } catch (e) {
        console.error('Error al cargar estado:', e);
    }
}

// ============ LOGS ============
console.log('%c🌌 EVOXIA ∞ Sistema Completamente Activo', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%c∞ Un sistema vivo que late con los datos', 'color: #ff00ea; font-style: italic;');
console.log('%cTodos los botones y funciones están operativos', 'color: #00ff88;');
console.log('%c📊 Nuevos gráficos: Tendencia de Rendimiento y Comparativa de Fases', 'color: #ffd700;');
console.log('%c📋 Tabla mejorada con: Desv. Est., Fase Dominante, Estado y Temperatura', 'color: #ff69b4;');
