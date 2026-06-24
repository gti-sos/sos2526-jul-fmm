<svelte:head>
    <title>About - Felipe Morgado (sos2526-jul-fmm)</title>
</svelte:head>

<main>
    <header>
        <h1>Información del Proyecto (sos2526-jul-fmm)</h1>
        <p class="subtitle">Módulo de Superficie Agrícola</p>
    </header>

    <section class="card navigation-card">
        <h2>🧭 Navegación del Frontend</h2>
        <p>Enlaces rápidos para interactuar con todas las vistas de la aplicación:</p>
        <div class="nav-grid">
            <a href="/agriculture-land" class="nav-link data-link">
                <strong>📊 Gestión de Datos</strong>
                <span>Tabla principal, filtros, CRUD y carga inicial.</span>
            </a>
            <a href="/analytics/agriculture-land" class="nav-link analytics-link">
                <strong>📈 Gráfica Analítica</strong>
                <span>Visualización de estadísticas dinámicas con Highcharts.</span>
            </a>
            <a href="/analytics/agriculture-land/map" class="nav-link map-link">
                <strong>🌍 Mapa de Superficie</strong>
                <span>Distribución e indicadores geográficos con Leaflet.</span>
            </a>
            <a href="/integrations" class="nav-link integrations-link">
                <strong>🔌 Integraciones</strong>
                <span>Conexión y monitorización con APIs externas.</span>
            </a>
        </div>
    </section>

    <section class="card">
        <h2>👤 Desarrollador Principal</h2>
        <ul>
            <li>
                <strong>Felipe Morgado Martínez</strong> 
                — <a href="https://github.com/felmormar" target="_blank" rel="noopener noreferrer">Perfil de GitHub</a>
            </li>
        </ul>
    </section>

    <section class="card">
        <h2>📝 Descripción del Módulo</h2>
        <p>
            Este módulo analiza de manera específica la evolución y el impacto del porcentaje de 
            <strong>tierras agrícolas (Agricultural Land)</strong> en diferentes países y periodos temporales, 
            conectando el almacenamiento en base de datos local con representaciones gráficas y mapas interactivos.
        </p>
    </section>

    <section class="card grid-two">
        <div>
            <h2>📦 Repositorio Actual</h2>
            <p><a href="https://github.com/gti-sos/sos2526-jul-fmm" target="_blank" rel="noopener noreferrer">gti-sos/sos2526-jul-fmm</a></p>
        </div>
        <div>
            <h2>🚀 URL en Producción (Render)</h2>
            <p><a href="https://sos2526-jul-fmm-1.onrender.com" target="_blank" rel="noopener noreferrer">sos2526-jul-fmm-1.onrender.com</a></p>
        </div>
    </section>

    <section class="card">
        <h2>⚙️ Recursos del Desarrollador (API & Vídeo)</h2>
        <ul>
            <li>
                <strong>API Rest:</strong> 
                <a href="/api/v1/agriculture-land">Agricultural Land API Base</a> 
                | <a href="/api/v1/agriculture-land/docs">Documentación (Docs)</a>
            </li>
            <li>
                <strong>Defensa del Proyecto:</strong> 
                <a href="https://www.youtube.com/watch?v=rSqIDwWOqgs" target="_blank" rel="noopener noreferrer">Vídeo Explicativo en YouTube</a>
            </li>
        </ul>
    </section>

    <div class="back-row">
        <a href="/" class="back-home">← Volver al Home General</a>
    </div>
</main>

<style>
    main {
        line-height: 1.6;
        max-width: 900px;
        margin: 40px auto;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        padding: 0 20px;
        color: #f1f5f9;
    }

    header {
        text-align: center;
        margin-bottom: 2.5rem;
    }
    header h1 {
        margin: 0;
        font-size: 2.3rem;
        color: #ffffff;
    }
    .subtitle {
        color: #94a3b8;
        font-size: 1.1rem;
        margin-top: 5px;
    }

    h2 {
        color: #cbd5e1;
        font-size: 1.4rem;
        margin-top: 0;
        border-bottom: 1px solid #334155;
        padding-bottom: 8px;
    }

    .card {
        background: #1e293b;
        border: 1px solid #334155;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }

    .grid-two {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    /* ESTILOS DE LA REJILLA DE ENLACES */
    .navigation-card {
        background: #0f172a;
        border-color: #38bdf8;
    }
    .nav-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
    }
    .nav-link {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        background: #1e293b;
        border: 1px solid #475569;
        border-radius: 8px;
        text-decoration: none !important;
        transition: transform 0.2s, border-color 0.2s, background-color 0.2s;
    }
    .nav-link strong {
        font-size: 1rem;
        margin-bottom: 4px;
    }
    .nav-link span {
        font-size: 0.8rem;
        color: #94a3b8;
        line-height: 1.3;
    }
    .nav-link:hover {
        transform: translateY(-2px);
        background: #334155;
    }
    
    .data-link strong { color: #10b981; }
    .analytics-link strong { color: #3b82f6; }
    .map-link strong { color: #eab308; }
    .integrations-link strong { color: #a855f7; }

    a {
        color: #38bdf8;
        text-decoration: none;
        font-weight: 500;
    }
    a:hover {
        text-decoration: underline;
    }

    ul {
        padding-left: 20px;
        margin: 10px 0 0 0;
    }
    li {
        margin-bottom: 8px;
    }

    .back-row {
        margin-top: 40px;
        text-align: center;
    }
    .back-home {
        font-weight: 700;
        color: #94a3b8;
    }
    .back-home:hover {
        color: #ffffff;
    }
</style>