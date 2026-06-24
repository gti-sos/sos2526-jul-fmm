<svelte:head>
    <title>Home - Módulo de Superficie Agrícola</title>
</svelte:head>

<main>
    <div class="hero">
        <div class="logo">🌍</div>
        <h1>Módulo de Superficie Agrícola</h1>
        <p class="subtitle">Análisis de la evolución de tierras agrícolas — Proyecto sos2526-jul-fmm</p>
        
        <div class="actions">
            <a href="/about" class="btn btn-primary">ℹ️ Ir al Panel About / Info</a>
            <a href="/agriculture-land" class="btn btn-secondary">📊 Ver Gestión de Datos</a>
        </div>
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        background-color: #0f172a;
        color: #f1f5f9;
        font-family: system-ui, -apple-system, sans-serif;
    }

    main {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 85vh;
        padding: 20px;
    }

    .hero {
        text-align: center;
        background: #1e293b;
        border: 1px solid #334155;
        padding: 3.5rem 2rem;
        border-radius: 16px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        max-width: 600px;
        width: 100%;
    }

    .logo {
        font-size: 4.5rem;
        margin-bottom: 1rem;
    }

    h1 {
        font-size: 2.2rem;
        margin: 0 0 10px 0;
        color: #ffffff;
    }

    .subtitle {
        color: #94a3b8;
        font-size: 1.1rem;
        margin: 0 0 2.5rem 0;
        line-height: 1.5;
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
    }

    @media (min-width: 480px) {
        .actions {
            flex-direction: row;
        }
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.9rem 1.8rem;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: transform 0.2s, background-color 0.2s;
    }

    .btn:hover {
        transform: translateY(-2px);
    }

    .btn-primary {
        background-color: #38bdf8;
        color: #0f172a;
    }

    .btn-primary:hover {
        background-color: #7dd3fc;
    }

    .btn-secondary {
        background-color: #334155;
        color: #f1f5f9;
        border: 1px solid #475569;
    }

    .btn-secondary:hover {
        background-color: #475569;
    }
</style>