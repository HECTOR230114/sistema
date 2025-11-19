// ===================================
// SCRIPT.JS - Sistema Detección Fraudes IA
// ITIL 4 + PMBOK 7
// ===================================

// ===== VARIABLES GLOBALES =====
let simulationActive = true;
let simulationInterval = null;
let projectDay = 1;
let projectDayInterval = null;
let allData = {
    incidentes: [],
    problemas: [],
    cambios: [],
    riesgos: [],
    hitos: [],
    lecciones: [],
    conocimientos: []
};

// ===== DATOS DE EJEMPLO REALISTAS =====
const sampleIncidents = [
    "Caída del servicio de predicción de fraude en producción",
    "Falsos positivos elevados (15%) en transacciones internacionales",
    "Tiempo de respuesta del modelo > 3 segundos (SLA: 1s)",
    "Error en la integración con API del core bancario",
    "Alertas duplicadas enviadas a clientes legítimos"
];

const sampleProblems = [
    "Degradación progresiva del modelo por data drift",
    "Sesgo algorítmico detectado en transacciones de bajo monto",
    "Falta de datos etiquetados para reentrenamiento",
    "Inconsistencia en features entre entrenamiento y producción"
];

const sampleChanges = [
    "Actualización del modelo de Random Forest v2.3 a v2.4",
    "Implementación de nuevo threshold de scoring (0.7 a 0.65)",
    "Migración de base de datos PostgreSQL 12 a 14",
    "Despliegue de dashboard de monitoreo en tiempo real"
];

const sampleRisks = [
    "Regulación bancaria podría exigir explicabilidad total del modelo",
    "Fuga de talento clave (Data Scientists) a competidores",
    "Ciberataque tipo adversarial attack al modelo de ML",
    "Incompatibilidad con sistemas legacy del banco"
];

const sampleMilestones = [
    "Aprobación del comité ejecutivo para inicio del proyecto",
    "Finalización de la fase de entrenamiento del modelo",
    "Certificación PCI DSS del ambiente productivo",
    "Go-live en producción con 10% del tráfico"
];

const sampleLessons = [
    "Validar calidad de datos ANTES de entrenar modelos",
    "Incluir al área legal desde la fase de diseño",
    "Realizar pruebas de carga con 3x el tráfico esperado",
    "Documentar todas las decisiones del CAB"
];

const sampleKnowledge = [
    {
        title: "Cómo interpretar métricas de un modelo de fraude",
        content: "Precision, Recall, F1-Score y AUC-ROC son métricas clave. En detección de fraudes, preferimos Recall alto para no perder fraudes reales.",
        category: "Machine Learning"
    },
    {
        title: "Proceso de gestión de incidentes en servicios de IA",
        content: "1) Detección automática vía monitoring, 2) Clasificación por severidad, 3) Escalamiento al equipo ML, 4) Resolución y cierre.",
        category: "ITIL 4"
    },
    {
        title: "Mitigación de sesgo algorítmico",
        content: "Aplicar técnicas de fairness (reweighting, threshold optimization), auditar con datasets diversos, implementar monitoring continuo.",
        category: "IA Ética"
    }
];

const responsables = [
    "Juan Pérez - Data Scientist",
    "María García - DevOps Engineer",
    "Carlos López - ML Engineer",
    "Ana Martínez - QA Analyst",
    "Pedro Sánchez - Gestor de Cambios",
    "Laura Torres - Analista de Riesgos",
    "Miguel Ángel - Arquitecto de Soluciones",
    "Sofia Ramírez - Product Owner"
];

const pmbokAreas = [
    "Alcance", "Cronograma", "Costos", "Calidad", "Recursos",
    "Comunicaciones", "Riesgos", "Adquisiciones", "Interesados",
    "Integración", "Métricas", "Adaptabilidad"
];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromStorage();
    initializeCharts();
    startSimulation();
    startProjectDayCounter();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setupEventListeners();
    renderAllTables();
    updateAllCharts();
});

// ===== GESTIÓN DE PESTAÑAS =====
function setupEventListeners() {
    // Pestañas principales
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.tab;
            switchTab(target);
        });
    });

    // Sub-pestañas
    document.querySelectorAll('.sub-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.subtab;
            switchSubTab(target, e.currentTarget.closest('.tab-content').id);
        });
    });

    // Botón de simulación
    document.getElementById('simulationToggle').addEventListener('click', toggleSimulation);

    // Botón de tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function switchSubTab(subtabName, parentTab) {
    const parent = document.getElementById(parentTab);
    parent.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    parent.querySelectorAll('.sub-content').forEach(c => c.classList.remove('active'));
    
    parent.querySelector(`[data-subtab="${subtabName}"]`).classList.add('active');
    parent.getElementById(subtabName).classList.add('active');
}

// ===== SIMULACIÓN AUTOMÁTICA =====
function startSimulation() {
    if (simulationInterval) clearInterval(simulationInterval);
    
    simulationInterval = setInterval(() => {
        if (simulationActive) {
            generateRandomRecord();
        }
    }, 5000); // Cada 5 segundos
}

function toggleSimulation() {
    simulationActive = !simulationActive;
    const btn = document.getElementById('simulationToggle');
    const indicator = document.querySelector('.status-indicator');
    
    if (simulationActive) {
        btn.innerHTML = '<i class="fas fa-pause"></i><span>Pausar Simulación</span>';
        btn.classList.remove('paused');
        indicator.classList.add('active');
    } else {
        btn.innerHTML = '<i class="fas fa-play"></i><span>Reanudar Simulación</span>';
        btn.classList.add('paused');
        indicator.classList.remove('active');
    }
}

function generateRandomRecord() {
    const types = ['incidente', 'problema', 'cambio', 'riesgo', 'hito', 'leccion', 'conocimiento'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const record = createRandomRecord(randomType);
    addRecord(randomType, record, true);
}

function createRandomRecord(type) {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30);
    const date = new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
    
    switch(type) {
        case 'incidente':
            return {
                id: generateId('INC'),
                fecha: formatDate(date),
                descripcion: sampleIncidents[Math.floor(Math.random() * sampleIncidents.length)],
                severidad: ['Crítica', 'Alta', 'Media', 'Baja'][Math.floor(Math.random() * 4)],
                responsable: responsables[Math.floor(Math.random() * responsables.length)],
                estado: ['Abierto', 'En Progreso', 'Resuelto'][Math.floor(Math.random() * 3)]
            };
        
        case 'problema':
            return {
                id: generateId('PRB'),
                fecha: formatDate(date),
                descripcion: sampleProblems[Math.floor(Math.random() * sampleProblems.length)],
                causaRaiz: 'Análisis en progreso mediante técnica 5 Whys',
                responsable: responsables[Math.floor(Math.random() * responsables.length)],
                estado: ['Abierto', 'En Análisis', 'Resuelto'][Math.floor(Math.random() * 3)]
            };
        
        case 'cambio':
            return {
                id: generateId('CHG'),
                fecha: formatDate(date),
                descripcion: sampleChanges[Math.floor(Math.random() * sampleChanges.length)],
                tipo: ['Normal', 'Estándar', 'Emergencia'][Math.floor(Math.random() * 3)],
                impacto: ['Alto', 'Medio', 'Bajo'][Math.floor(Math.random() * 3)],
                estado: ['Pendiente', 'Aprobado', 'Rechazado', 'Implementado'][Math.floor(Math.random() * 4)]
            };
        
        case 'riesgo':
            return {
                id: generateId('RSK'),
                fecha: formatDate(date),
                descripcion: sampleRisks[Math.floor(Math.random() * sampleRisks.length)],
                probabilidad: ['Alta', 'Media', 'Baja'][Math.floor(Math.random() * 3)],
                impacto: ['Alto', 'Medio', 'Bajo'][Math.floor(Math.random() * 3)],
                mitigacion: 'Plan de mitigación definido y en seguimiento'
            };
        
        case 'hito':
            return {
                id: generateId('MLT'),
                fechaPlanificada: formatDate(date),
                descripcion: sampleMilestones[Math.floor(Math.random() * sampleMilestones.length)],
                entregable: 'Documento técnico y aprobación formal',
                responsable: responsables[Math.floor(Math.random() * responsables.length)],
                estado: ['Pendiente', 'En Progreso', 'Completado'][Math.floor(Math.random() * 3)]
            };
        
        case 'leccion':
            return {
                id: generateId('LCN'),
                fecha: formatDate(date),
                situacion: 'Experiencia durante ' + ['desarrollo', 'testing', 'despliegue', 'operación'][Math.floor(Math.random() * 4)],
                leccion: sampleLessons[Math.floor(Math.random() * sampleLessons.length)],
                categoria: pmbokAreas[Math.floor(Math.random() * pmbokAreas.length)]
            };
        
        case 'conocimiento':
            const kb = sampleKnowledge[Math.floor(Math.random() * sampleKnowledge.length)];
            return {
                id: generateId('KB'),
                fecha: formatDate(date),
                titulo: kb.title,
                contenido: kb.content,
                categoria: kb.category,
                autor: responsables[Math.floor(Math.random() * responsables.length)]
            };
    }
}

function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ===== GESTIÓN DE DATOS =====
function addRecord(type, record, isAutomatic = false) {
    const key = type + 's';
    if (!allData[key]) allData[key] = [];
    
    allData[key].push(record);
    saveDataToStorage();
    renderTable(key);
    updateAllCharts();
    updateMetrics();
    updateProjectProgress();
    
    if (isAutomatic) {
        showToast(`Nuevo ${type} generado automáticamente`, 'success');
    } else {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} agregado exitosamente`, 'success');
    }
}

function deleteRecord(type, id) {
    const key = type + 's';
    allData[key] = allData[key].filter(item => item.id !== id);
    saveDataToStorage();
    renderTable(key);
    updateAllCharts();
    updateMetrics();
    updateProjectProgress();
    showToast('Registro eliminado', 'warning');
}

function saveDataToStorage() {
    localStorage.setItem('fraudDetectionData', JSON.stringify(allData));
    localStorage.setItem('projectDay', projectDay.toString());
}

function loadDataFromStorage() {
    const stored = localStorage.getItem('fraudDetectionData');
    if (stored) {
        allData = JSON.parse(stored);
    }
    
    const storedDay = localStorage.getItem('projectDay');
    if (storedDay) {
        projectDay = parseInt(storedDay);
        document.getElementById('projectDay').textContent = projectDay;
    }
}

// ===== RENDERIZADO DE TABLAS =====
function renderAllTables() {
    renderTable('incidentes');
    renderTable('problemas');
    renderTable('cambios');
    renderTable('riesgos');
    renderTable('hitos');
    renderTable('lecciones');
    renderKnowledgeBase();
}

function renderTable(type) {
    const tbody = document.getElementById(type + 'Body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const data = allData[type] || [];
    
    data.forEach(item => {
        const row = tbody.insertRow();
        
        switch(type) {
            case 'incidentes':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.fecha}</td>
                    <td>${item.descripcion}</td>
                    <td><span class="badge badge-${getSeverityClass(item.severidad)}">${item.severidad}</span></td>
                    <td>${item.responsable}</td>
                    <td><span class="badge badge-${getStatusClass(item.estado)}">${item.estado}</span></td>
                    <td>
                        <button class="btn-danger btn-small" onclick="deleteRecord('incidente', '${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
            
            case 'problemas':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.fecha}</td>
                    <td>${item.descripcion}</td>
                    <td>${item.causaRaiz}</td>
                    <td>${item.responsable}</td>
                    <td><span class="badge badge-${getStatusClass(item.estado)}">${item.estado}</span></td>
                    <td>
                        <button class="btn-danger btn-small" onclick="deleteRecord('problema', '${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
            
            case 'cambios':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.fecha}</td>
                    <td>${item.descripcion}</td>
                    <td><span class="badge badge-info">${item.tipo}</span></td>
                    <td><span class="badge badge-${getImpactClass(item.impacto)}">${item.impacto}</span></td>
                    <td><span class="badge badge-${getChangeStatusClass(item.estado)}">${item.estado}</span></td>
                    <td>
                        <button class="btn-danger btn-small" onclick="deleteRecord('cambio', '${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
            
            case 'riesgos':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.fecha}</td>
                    <td>${item.descripcion}</td>
                    <td><span class="badge badge-${getProbabilityClass(item.probabilidad)}">${item.probabilidad}</span></td>
                    <td><span class="badge badge-${getImpactClass(item.impacto)}">${item.impacto}</span></td>
                    <td>${item.mitigacion}</td>
                    <td>
                        <button class="btn-danger btn-small" onclick="deleteRecord('riesgo', '${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
            
            case 'hitos':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.fechaPlanificada}</td>
                    <td>${item.descripcion}</td>
                    <td>${item.entregable}</td>
                    <td>${item.responsable}</td>
                    <td><span class="badge badge-${getStatusClass(item.estado)}">${item.estado}</span></td>
                    <td>
                        <button class="btn-danger btn-small" onclick="deleteRecord('hito', '${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
            
            case 'lecciones':
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.fecha}</td>
                    <td>${item.situacion}</td>
                    <td>${item.leccion}</td>
                    <td><span class="badge badge-primary">${item.categoria}</span></td>
                    <td>
                        <button class="btn-danger btn-small" onclick="deleteRecord('leccion', '${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                break;
        }
    });
}

function renderKnowledgeBase() {
    const container = document.getElementById('knowledgeGrid');
    container.innerHTML = '';
    
    const data = allData.conocimientos || [];
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'knowledge-card';
        card.innerHTML = `
            <h3>${item.titulo}</h3>
            <p>${item.contenido}</p>
            <div class="knowledge-meta">
                <span><i class="fas fa-tag"></i> ${item.categoria}</span>
                <span><i class="fas fa-user"></i> ${item.autor}</span>
            </div>
            <div style="margin-top: 1rem;">
                <button class="btn-danger btn-small" onclick="deleteRecord('conocimiento', '${item.id}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ===== CLASES DE ESTILO =====
function getSeverityClass(severity) {
    const map = { 'Crítica': 'danger', 'Alta': 'danger', 'Media': 'warning', 'Baja': 'info' };
    return map[severity] || 'info';
}

function getStatusClass(status) {
    const map = { 'Resuelto': 'success', 'Completado': 'success', 'En Progreso': 'warning', 'Abierto': 'danger', 'Pendiente': 'info' };
    return map[status] || 'info';
}

function getChangeStatusClass(status) {
    const map = { 'Implementado': 'success', 'Aprobado': 'primary', 'Pendiente': 'warning', 'Rechazado': 'danger' };
    return map[status] || 'info';
}

function getImpactClass(impact) {
    const map = { 'Alto': 'danger', 'Medio': 'warning', 'Bajo': 'success' };
    return map[impact] || 'info';
}

function getProbabilityClass(prob) {
    const map = { 'Alta': 'danger', 'Media': 'warning', 'Baja': 'success' };
    return map[prob] || 'info';
}

// ===== FILTROS Y BÚSQUEDA =====
function filterTable(tableId, searchTerm) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    }
}

function filterKnowledge(searchTerm) {
    const cards = document.querySelectorAll('.knowledge-card');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

// ===== FORMULARIOS MODALES =====
function showAddForm(type) {
    const modal = document.getElementById('formModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Agregar Nuevo ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    let formHTML = '';
    
    switch(type) {
        case 'incidente':
            formHTML = `
                <form onsubmit="submitForm(event, 'incidente')">
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" name="fecha" required>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea name="descripcion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Severidad</label>
                        <select name="severidad" required>
                            <option>Crítica</option>
                            <option>Alta</option>
                            <option>Media</option>
                            <option>Baja</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Responsable</label>
                        <select name="responsable" required>
                            ${responsables.map(r => `<option>${r}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select name="estado" required>
                            <option>Abierto</option>
                            <option>En Progreso</option>
                            <option>Resuelto</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Guardar</button>
                </form>
            `;
            break;
        
        case 'problema':
            formHTML = `
                <form onsubmit="submitForm(event, 'problema')">
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" name="fecha" required>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea name="descripcion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Causa Raíz</label>
                        <textarea name="causaRaiz" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Responsable</label>
                        <select name="responsable" required>
                            ${responsables.map(r => `<option>${r}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select name="estado" required>
                            <option>Abierto</option>
                            <option>En Análisis</option>
                            <option>Resuelto</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Guardar</button>
                </form>
            `;
            break;
        
        case 'cambio':
            formHTML = `
                <form onsubmit="submitForm(event, 'cambio')">
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" name="fecha" required>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea name="descripcion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Tipo</label>
                        <select name="tipo" required>
                            <option>Normal</option>
                            <option>Estándar</option>
                            <option>Emergencia</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Impacto</label>
                        <select name="impacto" required>
                            <option>Alto</option>
                            <option>Medio</option>
                            <option>Bajo</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select name="estado" required>
                            <option>Pendiente</option>
                            <option>Aprobado</option>
                            <option>Rechazado</option>
                            <option>Implementado</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Guardar</button>
                </form>
            `;
            break;
        
        case 'riesgo':
            formHTML = `
                <form onsubmit="submitForm(event, 'riesgo')">
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" name="fecha" required>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea name="descripcion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Probabilidad</label>
                        <select name="probabilidad" required>
                            <option>Alta</option>
                            <option>Media</option>
                            <option>Baja</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Impacto</label>
                        <select name="impacto" required>
                            <option>Alto</option>
                            <option>Medio</option>
                            <option>Bajo</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Mitigación</label>
                        <textarea name="mitigacion" required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Guardar</button>
                </form>
            `;
            break;
        
        case 'hito':
            formHTML = `
                <form onsubmit="submitForm(event, 'hito')">
                    <div class="form-group">
                        <label>Fecha Planificada</label>
                        <input type="date" name="fechaPlanificada" required>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea name="descripcion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Entregable</label>
                        <input type="text" name="entregable" required>
                    </div>
                    <div class="form-group">
                        <label>Responsable</label>
                        <select name="responsable" required>
                            ${responsables.map(r => `<option>${r}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select name="estado" required>
                            <option>Pendiente</option>
                            <option>En Progreso</option>
                            <option>Completado</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Guardar</button>
                </form>
            `;
            break;
        
        case 'leccion':
            formHTML = `
                <form onsubmit="submitForm(event, 'leccion')">
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" name="fecha" required>
                    </div>
                    <div class="form-group">
                        <label>Situación</label>
                        <textarea name="situacion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Lección Aprendida</label>
                        <textarea name="leccion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Categoría PMBOK</label>
                        <select name="categoria" required>
                            ${pmbokAreas.map(a => `<option>${a}</option>`).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Guardar</button>
                </form>
            `;
            break;
        
        case 'conocimiento':
            formHTML = `
                <form onsubmit="submitForm(event, 'conocimiento')">
                    <div class="form-group">
                        <label>Título</label>
                        <input type="text" name="titulo" required>
                    </div>
                    <div class="form-group">
                        <label>Contenido</label>
                        <textarea name="contenido" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Categoría</label>
                        <input type="text" name="categoria" required>
                    </div>
                    <div class="form-group">
                        <label>Autor</label>
                        <select name="autor" required>
                            ${responsables.map(r => `<option>${r}</option>`).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Guardar</button>
                </form>
            `;
            break;
    }
    
    modalBody.innerHTML = formHTML;
    modal.classList.add('active');
}

function submitForm(event, type) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const record = {
        id: generateId(type.substring(0, 3).toUpperCase()),
        fecha: formData.get('fecha') || formatDate(new Date())
    };
    
    for (let [key, value] of formData.entries()) {
        if (key !== 'fecha') record[key] = value;
    }
    
    addRecord(type, record, false);
    closeModal();
}

function closeModal() {
    document.getElementById('formModal').classList.remove('active');
}
// ===== GRÁFICOS CON CHART.JS =====
let charts = {};

function initializeCharts() {
    // Gráfico 1: Incidentes por Severidad
    const ctx1 = document.getElementById('incidentsSeverityChart').getContext('2d');
    charts.incidentsSeverity = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Crítica', 'Alta', 'Media', 'Baja'],
            datasets: [{
                label: 'Cantidad',
                data: [0, 0, 0, 0],
                backgroundColor: ['#dc3545', '#ff6384', '#ffc107', '#17a2b8'],
                borderWidth: 0
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Gráfico 2: Estado de Cambios
    const ctx2 = document.getElementById('changesStatusChart').getContext('2d');
    charts.changesStatus = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['Pendiente', 'Aprobado', 'Rechazado', 'Implementado'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#ffc107', '#0055ff', '#dc3545', '#28a745']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });

    // Gráfico 3: Evolución de Riesgos
    const ctx3 = document.getElementById('risksTimelineChart').getContext('2d');
    charts.risksTimeline = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Riesgos Activos',
                data: [],
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Gráfico 4: Áreas PMBOK
    const ctx4 = document.getElementById('pmbokAreasChart').getContext('2d');
    charts.pmbokAreas = new Chart(ctx4, {
        type: 'doughnut',
        data: {
            labels: pmbokAreas,
            datasets: [{
                data: new Array(12).fill(0),
                backgroundColor: [
                    '#003087', '#0055ff', '#00a3e0', '#28a745', '#ffc107', '#dc3545',
                    '#17a2b8', '#6610f2', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });

    // Gráfico 5: Incidentes Resueltos vs Pendientes
    const ctx5 = document.getElementById('incidentsResolvedChart').getContext('2d');
    charts.incidentsResolved = new Chart(ctx5, {
        type: 'bar',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [
                {
                    label: 'Resueltos',
                    data: [0, 0, 0, 0],
                    backgroundColor: '#28a745'
                },
                {
                    label: 'Pendientes',
                    data: [0, 0, 0, 0],
                    backgroundColor: '#dc3545'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true }
            }
        }
    });

    // Gráfico 6: Madurez ITIL
    const ctx6 = document.getElementById('itilMaturityChart').getContext('2d');
    charts.itilMaturity = new Chart(ctx6, {
        type: 'radar',
        data: {
            labels: ['Incidentes', 'Problemas', 'Cambios', 'Configuración', 'Capacidad', 'Disponibilidad'],
            datasets: [{
                label: 'Nivel de Madurez',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(0, 48, 135, 0.2)',
                borderColor: '#003087',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function updateAllCharts() {
    updateIncidentsSeverityChart();
    updateChangesStatusChart();
    updateRisksTimelineChart();
    updatePmbokAreasChart();
    updateIncidentsResolvedChart();
    updateItilMaturityChart();
}

function updateIncidentsSeverityChart() {
    const data = [0, 0, 0, 0];
    (allData.incidentes || []).forEach(inc => {
        switch(inc.severidad) {
            case 'Crítica': data[0]++; break;
            case 'Alta': data[1]++; break;
            case 'Media': data[2]++; break;
            case 'Baja': data[3]++; break;
        }
    });
    charts.incidentsSeverity.data.datasets[0].data = data;
    charts.incidentsSeverity.update();
}

function updateChangesStatusChart() {
    const data = [0, 0, 0, 0];
    (allData.cambios || []).forEach(chg => {
        switch(chg.estado) {
            case 'Pendiente': data[0]++; break;
            case 'Aprobado': data[1]++; break;
            case 'Rechazado': data[2]++; break;
            case 'Implementado': data[3]++; break;
        }
    });
    charts.changesStatus.data.datasets[0].data = data;
    charts.changesStatus.update();
}

function updateRisksTimelineChart() {
    const risks = allData.riesgos || [];
    const dateCount = {};
    
    risks.forEach(risk => {
        dateCount[risk.fecha] = (dateCount[risk.fecha] || 0) + 1;
    });
    
    const sortedDates = Object.keys(dateCount).sort();
    const labels = sortedDates.map(d => d.substring(5));
    const data = sortedDates.map(d => dateCount[d]);
    
    charts.risksTimeline.data.labels = labels;
    charts.risksTimeline.data.datasets[0].data = data;
    charts.risksTimeline.update();
}

function updatePmbokAreasChart() {
    const data = new Array(12).fill(0);
    (allData.lecciones || []).forEach(lec => {
        const index = pmbokAreas.indexOf(lec.categoria);
        if (index !== -1) data[index]++;
    });
    
    charts.pmbokAreas.data.datasets[0].data = data;
    charts.pmbokAreas.update();
}

function updateIncidentsResolvedChart() {
    const resolved = [0, 0, 0, 0];
    const pending = [0, 0, 0, 0];
    
    (allData.incidentes || []).forEach(inc => {
        const week = Math.floor(Math.random() * 4);
        if (inc.estado === 'Resuelto') {
            resolved[week]++;
        } else {
            pending[week]++;
        }
    });
    
    charts.incidentsResolved.data.datasets[0].data = resolved;
    charts.incidentsResolved.data.datasets[1].data = pending;
    charts.incidentsResolved.update();
}

function updateItilMaturityChart() {
    const incCount = (allData.incidentes || []).length;
    const probCount = (allData.problemas || []).length;
    const chgCount = (allData.cambios || []).length;
    
    const maturity = [
        Math.min(incCount * 5, 100),
        Math.min(probCount * 8, 100),
        Math.min(chgCount * 7, 100),
        Math.min((incCount + probCount) * 3, 100),
        Math.min(chgCount * 6, 100),
        Math.min(incCount * 4, 100)
    ];
    
    charts.itilMaturity.data.datasets[0].data = maturity;
    charts.itilMaturity.update();
}

// ===== MÉTRICAS =====
function updateMetrics() {
    const incidents = allData.incidentes || [];
    const resolved = incidents.filter(i => i.estado === 'Resuelto').length;
    const total = incidents.length;
    
    document.getElementById('avgResolutionTime').textContent = 
        total > 0 ? `${(2 + Math.random() * 2).toFixed(1)} horas` : '0 horas';
    
    document.getElementById('firstContactResolution').textContent = 
        total > 0 ? `${Math.floor(70 + Math.random() * 20)}%` : '0%';
    
    document.getElementById('userSatisfaction').textContent = 
        total > 0 ? `${(4.2 + Math.random() * 0.8).toFixed(1)}/5.0` : '0/5.0';
    
    document.getElementById('activeIncidents').textContent = 
        incidents.filter(i => i.estado !== 'Resuelto').length;
}

function updateProjectProgress() {
    const milestones = allData.hitos || [];
    const completed = milestones.filter(h => h.estado === 'Completado').length;
    const total = milestones.length;
    
    const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;
    const progressBar = document.getElementById('projectProgress');
    
    progressBar.style.width = percentage + '%';
    progressBar.querySelector('.progress-text').textContent = percentage + '%';
}

// ===== CONTADOR DE DÍAS DEL PROYECTO =====
function startProjectDayCounter() {
    projectDayInterval = setInterval(() => {
        projectDay++;
        document.getElementById('projectDay').textContent = projectDay;
        saveDataToStorage();
    }, 10000); // Cada 10 segundos
}

// ===== FECHA Y HORA ACTUAL =====
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('currentDateTime').textContent = 
        now.toLocaleDateString('es-ES', options);
}

// ===== MODO OSCURO =====
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('.theme-toggle i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelector('.theme-toggle i').className = 'fas fa-sun';
}

// ===== NOTIFICACIONES TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'warning' ? 'exclamation-triangle' : 
                 type === 'error' ? 'times-circle' : 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== EXPORTAR/IMPORTAR DATOS =====
function exportJSON() {
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud-detection-data-${Date.now()}.json`;
    a.click();
    showToast('Datos exportados exitosamente', 'success');
}

function exportCSV() {
    let csv = 'Tipo,ID,Fecha,Descripción,Detalles\n';
    
    ['incidentes', 'problemas', 'cambios', 'riesgos', 'hitos', 'lecciones'].forEach(type => {
        (allData[type] || []).forEach(item => {
            const details = Object.values(item).slice(2).join(' | ');
            csv += `${type},${item.id},${item.fecha || item.fechaPlanificada},"${item.descripcion || item.situacion}","${details}"\n`;
        });
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud-detection-data-${Date.now()}.csv`;
    a.click();
    showToast('CSV exportado exitosamente', 'success');
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            allData = imported;
            saveDataToStorage();
            renderAllTables();
            updateAllCharts();
            updateMetrics();
            updateProjectProgress();
            showToast('Datos importados exitosamente', 'success');
        } catch (error) {
            showToast('Error al importar datos: archivo inválido', 'error');
        }
    };
    reader.readAsText(file);
}

// ===== DATOS DE EJEMPLO =====
function loadSampleData() {
    if (!confirm('¿Desea cargar los datos de ejemplo? Esto agregará 12 registros nuevos.')) {
        return;
    }
    
    // Generar 12 registros de ejemplo
    for (let i = 0; i < 12; i++) {
        const types = ['incidente', 'problema', 'cambio', 'riesgo', 'hito', 'leccion'];
        const type = types[i % types.length];
        const record = createRandomRecord(type);
        addRecord(type, record, false);
    }
    
    showToast('12 registros de ejemplo cargados exitosamente', 'success');
}

function clearAllData() {
    if (!confirm('¿Está seguro de eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
        return;
    }
    
    allData = {
        incidentes: [],
        problemas: [],
        cambios: [],
        riesgos: [],
        hitos: [],
        lecciones: [],
        conocimientos: []
    };
    
    projectDay = 1;
    document.getElementById('projectDay').textContent = '1';
    
    saveDataToStorage();
    renderAllTables();
    updateAllCharts();
    updateMetrics();
    updateProjectProgress();
    
    showToast('Todos los datos han sido eliminados', 'warning');
}

// ===== INICIALIZACIÓN ADICIONAL =====
// Cerrar modal al hacer clic fuera
document.getElementById('formModal').addEventListener('click', (e) => {
    if (e.target.id === 'formModal') {
        closeModal();
    }
});

// Prevenir cierre del modal al hacer clic en el contenido
document.querySelector('.modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

console.log('%c🚀 Sistema de Detección de Fraudes con IA - ITIL 4 + PMBOK 7', 'color: #003087; font-size: 20px; font-weight: bold;');
console.log('%c✅ Aplicación inicializada correctamente', 'color: #28a745; font-size: 14px;');
console.log('%c📊 Simulación automática activada (cada 5 segundos)', 'color: #0055ff; font-size: 14px;');


