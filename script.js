// ===== DATOS INICIALES =====
let proyectos = [
    {
        id: 1,
        nombre: 'Chatbot IA - Atención Cliente',
        fase: 'Ejecución',
        progreso: 65,
        presupuesto: 150000,
        gastado: 97500,
        inicio: '2025-01-15',
        fin: '2025-06-30',
        riesgos: 3,
        incidentes: 2,
        cambios: 1
    },
    {
        id: 2,
        nombre: 'Análisis Predictivo de Churn',
        fase: 'Planificación',
        progreso: 30,
        presupuesto: 200000,
        gastado: 60000,
        inicio: '2025-02-01',
        fin: '2025-08-31',
        riesgos: 5,
        incidentes: 0,
        cambios: 0
    }
];

let incidentes = [
    {
        id: 1,
        titulo: 'Fallo en API de entrenamiento',
        prioridad: 'Alta',
        estado: 'En Progreso',
        proyecto: 'Chatbot IA - Atención Cliente',
        fecha: '2025-11-15'
    },
    {
        id: 2,
        titulo: 'Latencia en respuestas del modelo',
        prioridad: 'Media',
        estado: 'Abierto',
        proyecto: 'Chatbot IA - Atención Cliente',
        fecha: '2025-11-18'
    }
];

let riesgos = [
    {
        id: 1,
        descripcion: 'Datos de entrenamiento insuficientes',
        probabilidad: 'Alta',
        impacto: 'Alto',
        estrategia: 'Mitigar',
        proyecto: 'Chatbot IA - Atención Cliente'
    },
    {
        id: 2,
        descripcion: 'Retrasos en integración con sistemas legacy',
        probabilidad: 'Media',
        impacto: 'Alto',
        estrategia: 'Mitigar',
        proyecto: 'Chatbot IA - Atención Cliente'
    },
    {
        id: 3,
        descripcion: 'Cambios en regulaciones de privacidad',
        probabilidad: 'Media',
        impacto: 'Medio',
        estrategia: 'Aceptar',
        proyecto: 'Análisis Predictivo de Churn'
    }
];

let cambios = [
    {
        id: 1,
        descripcion: 'Actualización arquitectura de microservicios',
        tipo: 'Mayor',
        estado: 'Aprobado',
        proyecto: 'Chatbot IA - Atención Cliente',
        fecha: '2025-11-10'
    }
];

// ===== VARIABLES GLOBALES =====
let chartProgreso, chartPresupuesto, chartIncidentes, chartRiesgos;

// ===== NAVEGACIÓN ENTRE TABS =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tabs
    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remover active de todos los botones
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Remover active de todos los tabs
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Agregar active al botón clickeado
            this.classList.add('active');
            
            // Mostrar tab correspondiente
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });

    // Inicializar eventos de botones
    document.getElementById('btn-agregar-proyecto').addEventListener('click', agregarProyecto);
    document.getElementById('btn-agregar-incidente').addEventListener('click', agregarIncidente);
    document.getElementById('btn-agregar-riesgo').addEventListener('click', agregarRiesgo);
    document.getElementById('btn-agregar-cambio').addEventListener('click', agregarCambio);

    // Renderizar datos iniciales
    actualizarDashboard();
    renderizarProyectos();
    renderizarIncidentes();
    renderizarRiesgos();
    renderizarCambios();
    actualizarSelectoresProyectos();
});

// ===== FUNCIONES DE ACTUALIZACIÓN =====
function actualizarDashboard() {
    // Actualizar KPIs
    document.getElementById('total-proyectos').textContent = proyectos.length;
    document.getElementById('total-incidentes').textContent = incidentes.length;
    document.getElementById('total-riesgos').textContent = riesgos.length;
    document.getElementById('total-cambios').textContent = cambios.length;

    // Calcular totales financieros
    const presupuestoTotal = proyectos.reduce((sum, p) => sum + p.presupuesto, 0);
    const gastadoTotal = proyectos.reduce((sum, p) => sum + p.gastado, 0);
    const disponibleTotal = presupuestoTotal - gastadoTotal;

    document.getElementById('presupuesto-total').textContent = '$' + presupuestoTotal.toLocaleString();
    document.getElementById('gastado-total').textContent = '$' + gastadoTotal.toLocaleString();
    document.getElementById('disponible-total').textContent = '$' + disponibleTotal.toLocaleString();

    // Actualizar gráficos
    actualizarGraficos();
}

function actualizarGraficos() {
    // Gráfico de Progreso
    const ctxProgreso = document.getElementById('chart-progreso').getContext('2d');
    if (chartProgreso) chartProgreso.destroy();
    
    chartProgreso = new Chart(ctxProgreso, {
        type: 'bar',
        data: {
            labels: proyectos.map(p => p.nombre.substring(0, 20)),
            datasets: [{
                label: 'Progreso (%)',
                data: proyectos.map(p => p.progreso),
                backgroundColor: '#3b82f6',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#e2e8f0' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                }
            }
        }
    });

    // Gráfico de Presupuesto
    const ctxPresupuesto = document.getElementById('chart-presupuesto').getContext('2d');
    if (chartPresupuesto) chartPresupuesto.destroy();
    
    chartPresupuesto = new Chart(ctxPresupuesto, {
        type: 'bar',
        data: {
            labels: proyectos.map(p => p.nombre.substring(0, 20)),
            datasets: [
                {
                    label: 'Presupuesto',
                    data: proyectos.map(p => p.presupuesto),
                    backgroundColor: '#10b981',
                    borderRadius: 8
                },
                {
                    label: 'Gastado',
                    data: proyectos.map(p => p.gastado),
                    backgroundColor: '#f59e0b',
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#e2e8f0' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                }
            }
        }
    });

    // Gráfico de Incidentes por Prioridad
    const incidentesPorPrioridad = {
        'Crítica': incidentes.filter(i => i.prioridad === 'Crítica').length,
        'Alta': incidentes.filter(i => i.prioridad === 'Alta').length,
        'Media': incidentes.filter(i => i.prioridad === 'Media').length,
        'Baja': incidentes.filter(i => i.prioridad === 'Baja').length
    };

    const ctxIncidentes = document.getElementById('chart-incidentes').getContext('2d');
    if (chartIncidentes) chartIncidentes.destroy();
    
    chartIncidentes = new Chart(ctxIncidentes, {
        type: 'doughnut',
        data: {
            labels: ['Crítica', 'Alta', 'Media', 'Baja'],
            datasets: [{
                data: Object.values(incidentesPorPrioridad),
                backgroundColor: ['#dc2626', '#ef4444', '#f59e0b', '#10b981']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#e2e8f0' }
                }
            }
        }
    });

    // Gráfico de Riesgos por Impacto
    const riesgosPorImpacto = {
        'Alto': riesgos.filter(r => r.impacto === 'Alto').length,
        'Medio': riesgos.filter(r => r.impacto === 'Medio').length,
        'Bajo': riesgos.filter(r => r.impacto === 'Bajo').length
    };

    const ctxRiesgos = document.getElementById('chart-riesgos').getContext('2d');
    if (chartRiesgos) chartRiesgos.destroy();
    
    chartRiesgos = new Chart(ctxRiesgos, {
        type: 'pie',
        data: {
            labels: ['Alto', 'Medio', 'Bajo'],
            datasets: [{
                data: Object.values(riesgosPorImpacto),
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#e2e8f0' }
                }
            }
        }
    });
}

// ===== PROYECTOS =====
function agregarProyecto() {
    const nombre = document.getElementById('proyecto-nombre').value;
    const fase = document.getElementById('proyecto-fase').value;
    const presupuesto = parseFloat(document.getElementById('proyecto-presupuesto').value);
    const inicio = document.getElementById('proyecto-inicio').value;
    const fin = document.getElementById('proyecto-fin').value;

    if (!nombre || !presupuesto || !inicio || !fin) {
        alert('Por favor complete todos los campos');
        return;
    }

    const nuevoProyecto = {
        id: proyectos.length + 1,
        nombre,
        fase,
        progreso: 0,
        presupuesto,
        gastado: 0,
        inicio,
        fin,
        riesgos: 0,
        incidentes: 0,
        cambios: 0
    };

    proyectos.push(nuevoProyecto);

    // Limpiar formulario
    document.getElementById('proyecto-nombre').value = '';
    document.getElementById('proyecto-presupuesto').value = '';
    document.getElementById('proyecto-inicio').value = '';
    document.getElementById('proyecto-fin').value = '';

    // Actualizar vistas
    renderizarProyectos();
    actualizarDashboard();
    actualizarSelectoresProyectos();
}

function eliminarProyecto(id) {
    if (confirm('¿Está seguro de eliminar este proyecto?')) {
        proyectos = proyectos.filter(p => p.id !== id);
        renderizarProyectos();
        actualizarDashboard();
        actualizarSelectoresProyectos();
    }
}

function renderizarProyectos() {
    const lista = document.getElementById('lista-proyectos');
    lista.innerHTML = '';

    proyectos.forEach(proyecto => {
        const disponible = proyecto.presupuesto - proyecto.gastado;
        
        const html = `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-content">
                        <h4 class="item-title">
                            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            ${proyecto.nombre}
                        </h4>
                        <span class="item-badge badge-blue">${proyecto.fase}</span>
                        
                        <div class="item-stats">
                            <div class="stat-box">
                                <p class="stat-label">Progreso</p>
                                <p class="stat-value stat-value-blue">${proyecto.progreso}%</p>
                            </div>
                            <div class="stat-box">
                                <p class="stat-label">Presupuesto</p>
                                <p class="stat-value stat-value-green">$${proyecto.presupuesto.toLocaleString()}</p>
                            </div>
                            <div class="stat-box">
                                <p class="stat-label">Gastado</p>
                                <p class="stat-value stat-value-orange">$${proyecto.gastado.toLocaleString()}</p>
                            </div>
                            <div class="stat-box">
                                <p class="stat-label">Disponible</p>
                                <p class="stat-value stat-value-blue">$${disponible.toLocaleString()}</p>
                            </div>
                        </div>

                        <div class="item-stats">
                            <div class="stat-box" style="background: rgba(239, 68, 68, 0.1); border-color: #dc2626;">
                                <p class="stat-label" style="color: #fca5a5;">Incidentes</p>
                                <p class="stat-value stat-value-red">${proyecto.incidentes}</p>
                            </div>
                            <div class="stat-box" style="background: rgba(245, 158, 11, 0.1); border-color: #d97706;">
                                <p class="stat-label" style="color: #fcd34d;">Riesgos</p>
                                <p class="stat-value stat-value-yellow">${proyecto.riesgos}</p>
                            </div>
                            <div class="stat-box" style="background: rgba(16, 185, 129, 0.1); border-color: #059669;">
                                <p class="stat-label" style="color: #6ee7b7;">Cambios</p>
                                <p class="stat-value stat-value-green">${proyecto.cambios}</p>
                            </div>
                        </div>

                        <div class="item-progress">
                            <div style="display: flex; justify-content: space-between; color: #94a3b8; font-size: 0.875rem; margin-bottom: 0.5rem;">
                                <span>Inicio: ${proyecto.inicio}</span>
                                <span>Fin: ${proyecto.fin}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${proyecto.progreso}%"></div>
                            </div>
                        </div>
                    </div>
                    <button class="btn-delete" onclick="eliminarProyecto(${proyecto.id})">
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        lista.innerHTML += html;
    });
}

// ===== INCIDENTES =====
function agregarIncidente() {
    const titulo = document.getElementById('incidente-titulo').value;
    const prioridad = document.getElementById('incidente-prioridad').value;
    const proyecto = document.getElementById('incidente-proyecto').value;

    if (!titulo || !proyecto) {
        alert('Por favor complete todos los campos');
        return;
    }

    const nuevoIncidente = {
        id: incidentes.length + 1,
        titulo,
        prioridad,
        estado: 'Abierto',
        proyecto,
        fecha: new Date().toISOString().split('T')[0]
    };

    incidentes.push(nuevoIncidente);

    // Actualizar contador en proyecto
    const proyectoObj = proyectos.find(p => p.nombre === proyecto);
    if (proyectoObj) proyectoObj.incidentes++;

    // Limpiar formulario
    document.getElementById('incidente-titulo').value = '';

    // Actualizar vistas
    renderizarIncidentes();
    renderizarProyectos();
    actualizarDashboard();
}

function eliminarIncidente(id) {
    if (confirm('¿Está seguro de eliminar este incidente?')) {
        const incidente = incidentes.find(i => i.id === id);
        
        // Actualizar contador en proyecto
        const proyectoObj = proyectos.find(p => p.nombre === incidente.proyecto);
        if (proyectoObj) proyectoObj.incidentes = Math.max(0, proyectoObj.incidentes - 1);

        incidentes = incidentes.filter(i => i.id !== id);
        
        renderizarIncidentes();
        renderizarProyectos();
        actualizarDashboard();
    }
}

function renderizarIncidentes() {
    const lista = document.getElementById('lista-incidentes');
    lista.innerHTML = '';

    incidentes.forEach(incidente => {
        const prioridadColor = {
            'Crítica': 'badge-red',
            'Alta': 'badge-red',
            'Media': 'badge-yellow',
            'Baja': 'badge-green'
        }[incidente.prioridad];

        const estadoColor = {
            'Abierto': 'badge-red',
            'En Progreso': 'badge-yellow',
            'Resuelto': 'badge-green'
        }[incidente.estado];

        const html = `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-content">
                        <h4 class="item-title">
                            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                            ${incidente.titulo}
                        </h4>
                        
                        <div class="item-details">
                            <div class="detail-item">
                                <span class="detail-label">Prioridad</span>
                                <span class="item-badge ${prioridadColor}">${incidente.prioridad}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Estado</span>
                                <span class="item-badge ${estadoColor}">${incidente.estado}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Proyecto</span>
                                <span class="detail-value">${incidente.proyecto}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Fecha</span>
                                <span class="detail-value">${incidente.fecha}</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn-delete" onclick="eliminarIncidente(${incidente.id})">
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        lista.innerHTML += html;
    });
}

// ===== RIESGOS =====
function agregarRiesgo() {
    const descripcion = document.getElementById('riesgo-descripcion').value;
    const probabilidad = document.getElementById('riesgo-probabilidad').value;
    const impacto = document.getElementById('riesgo-impacto').value;
    const estrategia = document.getElementById('riesgo-estrategia').value;
    const proyecto = document.getElementById('riesgo-proyecto').value;

    if (!descripcion || !proyecto) {
        alert('Por favor complete todos los campos');
        return;
    }

    const nuevoRiesgo = {
        id: riesgos.length + 1,
        descripcion,
        probabilidad,
        impacto,
        estrategia,
        proyecto
    };

    riesgos.push(nuevoRiesgo);

    // Actualizar contador en proyecto
    const proyectoObj = proyectos.find(p => p.nombre === proyecto);
    if (proyectoObj) proyectoObj.riesgos++;

    // Limpiar formulario
    document.getElementById('riesgo-descripcion').value = '';

    // Actualizar vistas
    renderizarRiesgos();
    renderizarProyectos();
    actualizarDashboard();
}

function eliminarRiesgo(id) {
    if (confirm('¿Está seguro de eliminar este riesgo?')) {
        const riesgo = riesgos.find(r => r.id === id);
        
        // Actualizar contador en proyecto
        const proyectoObj = proyectos.find(p => p.nombre === riesgo.proyecto);
        if (proyectoObj) proyectoObj.riesgos = Math.max(0, proyectoObj.riesgos - 1);

        riesgos = riesgos.filter(r => r.id !== id);
        
        renderizarRiesgos();
        renderizarProyectos();
        actualizarDashboard();
    }
}

function renderizarRiesgos() {
    const lista = document.getElementById('lista-riesgos');
    lista.innerHTML = '';

    riesgos.forEach(riesgo => {
        const probabilidadColor = {
            'Alta': 'badge-red',
            'Media': 'badge-yellow',
            'Baja': 'badge-green'
        }[riesgo.probabilidad];

        const impactoColor = {
            'Alto': 'badge-red',
            'Medio': 'badge-yellow',
            'Bajo': 'badge-green'
        }[riesgo.impacto];

        const html = `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-content">
                        <h4 class="item-title">
                            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                            ${riesgo.descripcion}
                        </h4>
                        
                        <div class="item-details">
                            <div class="detail-item">
                                <span class="detail-label">Probabilidad</span>
                                <span class="item-badge ${probabilidadColor}">${riesgo.probabilidad}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Impacto</span>
                                <span class="item-badge ${impactoColor}">${riesgo.impacto}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Estrategia</span>
                                <span class="item-badge badge-blue">${riesgo.estrategia}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Proyecto</span>
                                <span class="detail-value">${riesgo.proyecto}</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn-delete" onclick="eliminarRiesgo(${riesgo.id})">
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        lista.innerHTML += html;
    });
}

// ===== CAMBIOS =====
function agregarCambio() {
    const descripcion = document.getElementById('cambio-descripcion').value;
    const tipo = document.getElementById('cambio-tipo').value;
    const proyecto = document.getElementById('cambio-proyecto').value;

    if (!descripcion || !proyecto) {
        alert('Por favor complete todos los campos');
        return;
    }

    const nuevoCambio = {
        id: cambios.length + 1,
        descripcion,
        tipo,
        estado: 'Pendiente',
        proyecto,
        fecha: new Date().toISOString().split('T')[0]
    };

    cambios.push(nuevoCambio);

    // Actualizar contador en proyecto
    const proyectoObj = proyectos.find(p => p.nombre === proyecto);
    if (proyectoObj) proyectoObj.cambios++;

    // Limpiar formulario
    document.getElementById('cambio-descripcion').value = '';

    // Actualizar vistas
    renderizarCambios();
    renderizarProyectos();
    actualizarDashboard();
}

function eliminarCambio(id) {
    if (confirm('¿Está seguro de eliminar este cambio?')) {
        const cambio = cambios.find(c => c.id === id);
        
        // Actualizar contador en proyecto
        const proyectoObj = proyectos.find(p => p.nombre === cambio.proyecto);
        if (proyectoObj) proyectoObj.cambios = Math.max(0, proyectoObj.cambios - 1);

        cambios = cambios.filter(c => c.id !== id);
        
        renderizarCambios();
        renderizarProyectos();
        actualizarDashboard();
    }
}

function renderizarCambios() {
    const lista = document.getElementById('lista-cambios');
    lista.innerHTML = '';

    cambios.forEach(cambio => {
        const tipoColor = {
            'Emergencia': 'badge-red',
            'Mayor': 'badge-orange',
            'Normal': 'badge-blue',
            'Menor': 'badge-green'
        }[cambio.tipo];

        const estadoColor = {
            'Pendiente': 'badge-yellow',
            'Aprobado': 'badge-green',
            'En Implementación': 'badge-blue',
            'Rechazado': 'badge-red'
        }[cambio.estado];

        const html = `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-content">
                        <h4 class="item-title">
                            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0118 0z"/>
                            </svg>
                            ${cambio.descripcion}
                        </h4>
                        
                        <div class="item-details">
                            <div class="detail-item">
                                <span class="detail-label">Tipo</span>
                                <span class="item-badge ${tipoColor}">${cambio.tipo}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Estado</span>
                                <span class="item-badge ${estadoColor}">${cambio.estado}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Proyecto</span>
                                <span class="detail-value">${cambio.proyecto}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Fecha</span>
                                <span class="detail-value">${cambio.fecha}</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn-delete" onclick="eliminarCambio(${cambio.id})">
                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        lista.innerHTML += html;
    });
}

// ===== ACTUALIZAR SELECTORES DE PROYECTOS =====
function actualizarSelectoresProyectos() {
    const selectores = [
        document.getElementById('incidente-proyecto'),
        document.getElementById('riesgo-proyecto'),
        document.getElementById('cambio-proyecto')
    ];

    selectores.forEach(select => {
        if (select) {
            const valorActual = select.value;
            select.innerHTML = '<option value="">Seleccionar proyecto</option>';
            
            proyectos.forEach(proyecto => {
                const option = document.createElement('option');
                option.value = proyecto.nombre;
                option.textContent = proyecto.nombre;
                select.appendChild(option);
            });

            if (valorActual) {
                select.value = valorActual;
            }
        }
    });
}
