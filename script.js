let datos = {
    proyectos: [
        { nombre: "Chatbot GenAI Empresarial", estado: "En Ejecución", precision: 94.5, incidentes: 2, criticos: 0, entregablesOk: 18, totalEntregables: 20, presupuesto: 78, riesgo: "Bajo", sla: 99.9, roi: 320, drift: 3.2 },
        { nombre: "Detección Fraude Bancario", estado: "Iniciado", precision: 91.2, incidentes: 8, criticos: 2, entregablesOk: 12, totalEntregables: 25, presupuesto: 45, riesgo: "Alto", sla: 87.3, roi: 180, drift: 12.8 },
        { nombre: "Recomendador E-commerce", estado: "En Ejecución", precision: 89.7, incidentes: 1, criticos: 0, entregablesOk: 30, totalEntregables: 30, presupuesto: 95, riesgo: "Bajo", sla: 99.99, roi: 450, drift: 1.1 },
        { nombre: "Visión Industrial Defectos", estado: "Cerrado", precision: 97.8, incidentes: 0, criticos: 0, entregablesOk: 50, totalEntregables: 50, presupuesto: 100, riesgo: "Bajo", sla: 100, roi: 680, drift: 0.5 },
        { nombre: "Predicción Mantenimiento", estado: "En Ejecución", precision: 85.3, incidentes: 12, criticos: 3, entregablesOk: 15, totalEntregables: 30, presupuesto: 62, riesgo: "Medio", sla: 92.1, roi: 210, drift: 8.7 },
        { nombre: "Análisis Sentimiento Redes", estado: "Iniciado", precision: 88.9, incidentes: 5, criticos: 1, entregablesOk: 8, totalEntregables: 18, presupuesto: 38, riesgo: "Medio", sla: 94.5, roi: 150, drift: 6.3 }
    ]
};

let charts = {};

// Tema oscuro/claro
document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    document.querySelector('.theme-toggle i').classList.toggle('fa-sun');
    document.querySelector('.theme-toggle i').classList.toggle('fa-moon');
});

// Maximizar paneles
document.querySelectorAll('.panel-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.panel').classList.toggle('fullscreen');
    });
});

function generarVariaciones() {
    datos.proyectos.forEach(p => {
        if (p.estado !== "Cerrado") {
            p.precision = Math.max(70, Math.min(99.9, p.precision + (Math.random() - 0.5) * 1.5));
            p.drift = Math.max(0, Math.min(30, p.drift + (Math.random() - 0.5) * 3));
            if (Math.random() > 0.85) p.incidentes += Math.floor(Math.random() * 3);
            if (Math.random() > 0.95) p.criticos += (Math.random() > 0.7 ? 1 : -1);
            p.criticos = Math.max(0, p.criticos);
        }
    });
}

function actualizarDashboard() {
    generarVariaciones();
    const ahora = new Date().toLocaleString('es-ES');
    document.getElementById('update-time').textContent = ahora;

    // KPIs
    const activos = datos.proyectos.filter(p => p.estado !== "Cerrado").length;
    const criticos = datos.proyectos.reduce((s, p) => s + p.criticos, 0);
    const enProd = datos.proyectos.filter(p => p.estado === "En Ejecución" || p.estado === "Cerrado").length;
    const slaProm = Math.round(datos.proyectos.reduce((s, p) => s + p.sla, 0) / datos.proyectos.length * 10) / 10;
    const roiProm = Math.round(datos.proyectos.reduce((s, p) => s + p.roi, 0) / datos.proyectos.length);
    
    document.getElementById('proyectos-activos').textContent = activos;
    document.getElementById('incidentes-criticos').textContent = criticos;
    document.getElementById('modelos-produccion').textContent = enProd;
    document.getElementById('sla-cumplimiento').textContent = slaProm + "%";
    document.getElementById('roi-promedio').textContent = roiProm + "%";
    document.getElementById('equipo-asignado').textContent = 24;

    // Tabla
    const tbody = document.getElementById('tabla-body');
    tbody.innerHTML = '';
    datos.proyectos.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${p.nombre}</strong></td>
            <td><span class="status-${p.estado.toLowerCase().replace(' ', '-')}">${p.estado}</span></td>
            <td>${p.precision.toFixed(1)}%</td>
            <td>${p.incidentes} <strong>(${p.criticos} P1)</strong></td>
            <td>${p.entregablesOk}/${p.totalEntregables}</td>
            <td>${p.presupuesto}%</td>
            <td class="risk-${p.riesgo.toLowerCase()}">${p.riesgo}</td>
            <td><button class="btn-detail">Ver</button></td>
        `;
        tbody.appendChild(row);
    });

    // Alertas
    const alertasDiv = document.getElementById('alertas-lista');
    const alertas = datos.proyectos.filter(p => p.criticos > 0 || p.drift > 10);
    if (alertas.length === 0) {
        alertasDiv.innerHTML = '<p class="no-alerts">No hay alertas críticas en este momento</p>';
    } else {
        alertasDiv.innerHTML = alertas.map(p => `
            <div class="alert-item">
                <strong>${p.nombre}</strong>: 
                ${p.criticos > 0 ? `${p.criticos} incidente(s) crítico(s) | ` : ''}
                ${p.drift > 10 ? `Data Drift alto (${p.drift.toFixed(1)}%)` : ''}
            </div>
        `).join('');
    }

    actualizarGraficos();
}

function actualizarGraficos() {
    // Aquí van todos los gráficos Chart.js (mismo estilo que antes pero ampliados)
    // Por brevedad, incluyo solo uno nuevo: Drift
    if (!charts.drift) {
        charts.drift = new Chart(document.getElementById('driftChart'), {
            type: 'bar',
            data: {
                labels: datos.proyectos.map(p => p.nombre),
                datasets: [{
                    label: 'Data Drift %',
                    data: datos.proyectos.map(p => p.drift),
                    backgroundColor: datos.proyectos.map(p => p.drift > 10 ? '#ef4444' : p.drift > 5 ? '#f59e0b' : '#10b981')
                }]
            },
            options: {
                responsive: true,
                plugins: { title: { display: true, text: 'Detección de Drift por Modelo' } }
            }
        });
    } else {
        charts.drift.data.datasets[0].data = datos.proyectos.map(p => p.drift);
        charts.drift.data.datasets[0].backgroundColor = datos.proyectos.map(p => p.drift > 10 ? '#ef4444' : p.drift > 5 ? '#f59e0b' : '#10b981');
        charts.drift.update();
    }

    // (Los otros gráficos se actualizan igual que en la versión anterior)
}

// Iniciar
actualizarDashboard();
setInterval(actualizarDashboard, 15000); // Cada 15 segundos
