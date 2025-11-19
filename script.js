// =============== BASE DE DATOS COMPLETA ===============
let db = {
  proyectos: JSON.parse(localStorage.getItem('proyectos_v3')) || [],
  incidentes: JSON.parse(localStorage.getItem('incidentes_v3')) || [],
  cambios: [], riesgos: [], metricas: [], eventos: [], config: { tema: "claro" }
};

// Datos precargados ÉPICOS
if (db.proyectos.length === 0) {
  db.proyectos = [
    { id:1, nombre:"Detección de Fraude Bancario con XGBoost + Explainable AI", cliente:"Banco Nacional del Perú", tipo:"ML Predictivo", complejidad:"Alta", presupuesto:450000, gastado:298000, progreso:66, accuracy:94.8, precision:92.1, recall:89.7, f1:90.9, auc:0.976, estado:"En Progreso", inicio:"2025-01-15", finEstimado:"2025-12-20" },
    { id:2, nombre:"Chatbot Multimodal con Llama 3 + RAG", cliente:"Telefónica Perú", tipo:"NLP + Generative AI", complejidad:"Alta", presupuesto:380000, gastado:142000, progreso:37, accuracy:96.2, estado:"En Progreso", inicio:"2025-03-01", finEstimado:"2025-11-15" },
    { id:3, nombre:"Sistema de Diagnóstico Médico por Imagen (Cáncer de Pulmón)", cliente:"MINSA", tipo:"Deep Learning", complejidad:"Muy Alta", presupuesto:620000, gastado:98000, progreso:16, accuracy:98.4, estado:"Planificación", inicio:"2025-06-01", finEstimado:"2026-06-01" }
  ];
  db.incidentes = [
    {id:"INC-2025-001", titulo:"Caída del 9.2% en Recall tras último deployment", prioridad:"Crítica", categoria:"Modelo", estado:"En Progreso", sla:"4h", creado:"2025-11-18"},
    {id:"INC-2025-002", titulo:"Sesgo detectado en predicciones por región geográfica", prioridad:"Crítica", categoria:"Modelo", estado:"Nuevo", sla:"8h", creado:"2025-11-19"},
    {id:"INC-2025-003", titulo:"GPU Tesla V100 OOM durante entrenamiento batch 4096", prioridad:"Alta", categoria:"Infraestructura", estado:"Resuelto", creado:"2025-11-15"}
  ];
  db.eventos = [
    {fecha:"2025-11-19 10:30", tipo:"alerta", mensaje:"¡Accuracy promedio bajó a 93.1%!"},
    {fecha:"2025-11-19 14:20", tipo:"exito", mensaje:"Proyecto #2 alcanzó hito: MVP del Chatbot listo"}
  ];
  guardarDB();
}

function guardarDB() {
  localStorage.setItem('proyectos_v3', JSON.stringify(db.proyectos));
  localStorage.setItem('incidentes_v3', JSON.stringify(db.incidentes));
  actualizarStatusBar();
}

// =============== NUEVAS FUNCIONES ÉPICAS ===============

// 1. Simulador "¿Qué pasa si...?"
function abrirSimuladorEscenarios() {
  crearVentana("🔮 Simulador de Escenarios - ¿Qué pasa si...?", `
    <h3>Modifica variables y observa el impacto</h3>
    <label><input type="checkbox" onchange="simularEscenario('agregar_devs')"> Agregar 3 desarrolladores (+30% velocidad)</label><br><br>
    <label><input type="checkbox" onchange="simularEscenario('bajar_accuracy')"> Accuracy baja a 88% (riesgo regulatorio)</label><br><br>
    <label><input type="checkbox" onchange="simularEscenario('materializar_riesgo')"> Riesgo crítico se materializa (data drift masivo)</label><br><br>
    <button onclick="aplicarSimulacion()">Aplicar Simulación</button>
    <div id="resultado-simulacion" style="margin-top:20px;padding:15px;background:#f0f0f0;border-radius:8px;"></div>
  `);
}

function simularEscenario(tipo) {
  let resultado = "";
  if (tipo === "agregar_devs") resultado = "¡Progreso +28%! Finalización adelantada 6 semanas. Costo +12%";
  if (tipo === "bajar_accuracy") resultado = "⚠️ Riesgo regulatorio alto. Posible bloqueo de deployment. Recomendación: reentrenar inmediatamente";
  if (tipo === "materializar_riesgo") resultado = "🔴 Data drift masivo. Accuracy -18%. Incidentes x5. Presupuesto +45% necesario";
  document.getElementById('resultado-simulacion').innerHTML = `<strong>${resultado}</strong>`;
}

// 2. Exportar Reporte Semanal REAL
function exportarReporte() {
  const reporte = `
    <!DOCTYPE html>
    <html><head><title>Reporte Semanal - ${new Date().toLocaleDateString('es-PE')}</title></head>
    <body style="font-family:Arial;background:#f4f4f4;padding:40px;">
      <h1 style="color:#0066cc;">Reporte Semanal - Sistema Gestión IA</h1>
      <h2>Resumen Ejecutivo</h2>
      <p>Proyectos activos: ${db.proyectos.length} | Incidentes abiertos: ${db.incidentes.filter(i=>i.estado!=="Resuelto").length}</p>
      <p>Accuracy promedio: ${(db.proyectos.reduce((a,p)=>a+p.accuracy,0)/db.proyectos.length).toFixed(2)}%</p>
      <h2>Recomendaciones del Asistente IA</h2>
      <ul><li>Reentrenar modelo Fraude Bancario (recall bajo)</li><li>Implementar monitoreo de drift en producción</li></ul>
    </body></html>
  `;
  const blob = new Blob([reporte], {type: 'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `Reporte_IA_${new Date().toISOString().slice(0,10)}.html`; a.click();
  toast("✅ Reporte semanal exportado correctamente");
}

// 3. Modo Presentación Fullscreen
function iniciarModoPresentacion() {
  const overlay = document.getElementById('presentacion-overlay');
  overlay.style.display = 'flex';
  overlay.innerHTML = `<div class="presentacion">MODO PRESENTACIÓN<br><small>Rotación automática cada 10s</small></div>`;
  let graficos = ["crearGantt()", "crearCurvaROC()", "crearMatrizRiesgos()", "crearRadarModelos()"];
  let i = 0;
  const intervalo = setInterval(() => {
    overlay.innerHTML = `<div class="presentacion">Cargando gráfico...</div>`;
    setTimeout(() => eval(graficos[i++ % graficos.length])(), 1000);
  }, 10000);
  overlay.onclick = () => { overlay.style.display = 'none'; clearInterval(intervalo); };
}

// =============== CARGA INICIAL ===============
document.addEventListener('DOMContentLoaded', () => {
  actualizarStatusBar();
  abrirDashboard();
  toast("🚀 Sistema Integral de Gestión IA v3.0 cargado - Noviembre 2025");
  setInterval(detectarAlertasAutomaticas, 30000); // Alertas cada 30s
});
