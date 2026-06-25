<script>
    import { onMount } from 'svelte';

    let API = '/api/v1/agriculture-land';

    let data = $state([]);
    let message = $state('');
    let messageType = $state('');

    let searchCountry = $state('');
    let searchYear = $state('');
    let searchFrom = $state(''); 
    let searchTo = $state('');

    let newEntry = $state({
        "country ": '',
        year: '',
        country_code: '',
        land_agriculture: '',
        types_land: '',
        index: ''
    });

    function handleResponseError(status, action) {
        messageType = 'error';
        if (status === 404) message = 'No se ha encontrado el recurso solicitado.';
        else if (status === 409)
            message = `El registro de ${newEntry["country "]} para el año ${newEntry.year} ya existe.`;
        else if (status === 400) message = 'Error: Faltan datos o el formato es incorrecto.';
        else message = `Error ${status} al intentar ${action}.`;
        setTimeout(() => message = "", 5000);
    }

    async function getData() {
        let url = API;
        const queryParams = new URLSearchParams();

        if (searchCountry) queryParams.append('country', searchCountry.trim());
        if (searchYear) queryParams.append('year', searchYear);
        if (searchFrom) queryParams.append('from', searchFrom);
        if (searchTo) queryParams.append('to', searchTo);

        if (queryParams.toString()) url += '?' + queryParams.toString();

        try {
            const res = await fetch(url);
            if (res.ok) {
                data = await res.json();
                if (searchCountry || searchYear || searchFrom || searchTo) {
                    message = data.length > 0 ? 'Búsqueda finalizada.' : 'No hay resultados.';
                    messageType = data.length > 0 ? 'info' : 'error';
                }
            } else {
                handleResponseError(res.status, 'obtener los datos');
            }
        } catch (e) {
            message = 'Error: No se puede conectar con el servidor.';
            messageType = 'error';
        }
    }

    async function loadInitialData() {
        const res = await fetch(`${API}/loadInitialData`);
        if (res.ok) {
            message = '✅ Datos de agricultura cargados con éxito.';
            messageType = 'success';
            getData();
        } else {
            message = 'Error al cargar datos iniciales.';
            messageType = 'error';
        }
        setTimeout(() => message = "", 5000);
    }

    async function addEntry() {
        const res = await fetch(API, {
            method: 'POST',
            body: JSON.stringify({
                country: newEntry["country "].trim(),
                year: parseInt(newEntry.year),
                country_code: newEntry.country_code,
                land_agriculture: parseFloat(newEntry.land_agriculture),
                types_land: parseInt(newEntry.types_land),
                index: parseInt(newEntry.index)
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.status === 201) {
            message = `✅ ¡Hecho! Se ha añadido ${newEntry["country "]} correctamente.`;
            messageType = 'success';
            newEntry = { "country ": '', year: '', country_code: '', land_agriculture: '', types_land: '', index: '' };
            getData();
        } else {
            handleResponseError(res.status, 'crear el registro');
        }
    }

    async function deleteEntry(country, year) {
        const p = String(country).trim(); 
        
        if (!confirm(`¿Seguro que quieres eliminar ${p} (${year})?`)) return;
        
        const res = await fetch(`${API}/${p}/${year}`, { method: 'DELETE' });
        
        if (res.ok) {
            message = '✅ Registro eliminado correctamente.';
            messageType = 'success';
            getData();
        } else {
            handleResponseError(res.status, 'borrar el registro');
        }
    }

    async function deleteAll() {
        if (confirm('🚨 ¿Seguro que quieres borrar todos los datos de agricultura?')) {
            const res = await fetch(`${API}?admin=true`, { method: 'DELETE' });
            if (res.ok) {
                message = 'Base de datos vaciada con éxito.';
                messageType = 'success';
                data = [];
            }
        }
    }

    onMount(getData);
</script>

<main>
    <header>
        <h1>🌍 Agriculture Land</h1>
        <p>Administración de recursos de tierras agrícolas (SOS2526-17)</p>
    </header>

    {#if message}
        <div class="alert {messageType}">
            {message}
        </div>
    {/if}

    <section class="card shadow search-box">
        <h4>🔍 Búsqueda Avanzada</h4>
        <div class="filter-row">
            <input bind:value={searchCountry} placeholder="País (ej: Spain)" />
            <input type="number" bind:value={searchYear} placeholder="Año exacto" />
            <div class="range-group">
                <input type="number" bind:value={searchFrom} placeholder="Desde año" />
                <input type="number" bind:value={searchTo} placeholder="Hasta año" />
            </div>
            <div class="btn-group">
                <button class="btn-search" onclick={getData}>Filtrar</button>
                <button class="btn-clear" onclick={() => { searchCountry=''; searchYear=''; searchFrom=''; searchTo=''; getData(); }}>Limpiar</button>
            </div>
        </div>
    </section>

    <div class="main-layout">
        <aside class="card shadow form-sidebar">
            <h4>➕ Nuevo Registro</h4>
            <div class="vertical-form">
                <label>País <input bind:value={newEntry["country "]} placeholder="Nombre de país" /></label>
                <label>Año <input type="number" bind:value={newEntry.year} placeholder="Ej: 2024" /></label>
                <label>Código <input bind:value={newEntry.country_code} placeholder="Ej: ESP" /></label>
                <label>Superficie % <input type="number" step="0.01" bind:value={newEntry.land_agriculture} placeholder="Ej: 45.2" /></label>
                <label>Tipo Tierra <input type="number" bind:value={newEntry.types_land} placeholder="Ej: 1" /></label>
                <label>Índice <input type="number" bind:value={newEntry.index} placeholder="Ej: 12" /></label>
                <button class="btn-add" onclick={addEntry}>Guardar Registro</button>
            </div>
        </aside>

        <div class="table-wrapper">
            <div class="table-toolbar card">
                <h4>📊 Listado de Tierras</h4>
                <div class="table-actions">
                    <button class="btn-load" onclick={loadInitialData}>📥 Cargar Iniciales</button>
                    <button class="btn-danger" onclick={deleteAll}>🗑️ Borrar Todo</button>
                </div>
            </div>
            <div class="table-container shadow">
                <table>
                    <thead>
                        <tr>
                            <th>País</th>
                            <th>Año</th>
                            <th>Código</th>
                            <th>Sup. %</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data as entry}
                            <tr>
                                <td class="bold">{entry["country "] || entry.country}</td>
                                <td><span class="badge-year">{entry.year}</span></td>
                                <td><span class="badge-code">{entry.country_code}</span></td>
                                <td class="text-green">{entry.land_agriculture}%</td>
                                <td class="actions-cell">
                                    <a href="/agriculture-land/{String(entry['country '] || entry.country).trim()}/{entry.year}" class="btn-edit">Editar</a>
                                    <button class="btn-del" onclick={() => deleteEntry(entry["country "] || entry.country, entry.year)}>Borrar</button>
                                </td>
                            </tr>
                        {:else}
                            <tr><td colspan="5" class="empty">No hay datos disponibles. Prueba a cargar los iniciales.</td></tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</main>

<style>
    :global(body) {
        background-color: #0f172a;
        color: #f1f5f9;
        margin: 0;
        font-family: 'Inter', system-ui, sans-serif;
    }

    main {
        max-width: 1340px;
        margin: 2rem auto;
        padding: 0 1.5rem;
    }

    header { text-align: center; margin-bottom: 2.5rem; }
    header h1 { color: #ffffff; font-size: 2.5rem; margin: 0; }
    header p { color: #94a3b8; margin-top: 8px; }

    .alert {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        font-weight: bold;
        text-align: center;
        border: 1px solid;
    }
    .success { background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: #065f46; }
    .error { background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: #7f1d1d; }
    .info { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border-color: #1e3a8a; }

    .card {
        background: #1e293b;
        border: 1px solid #334155;
        padding: 1.5rem;
        border-radius: 12px;
    }
    .shadow { box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }

    h4 {
        margin: 0 0 1rem 0;
        color: #e2e8f0;
        border-bottom: 1px solid #334155;
        padding-bottom: 8px;
        font-size: 1.1rem;
    }

    .filter-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .range-group { display: flex; gap: 8px; }
    .btn-group { display: flex; gap: 10px; }

    .main-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        margin-top: 1.5rem;
    }

    .vertical-form { display: flex; flex-direction: column; gap: 14px; }
    .vertical-form label { display: flex; flex-direction: column; gap: 6px; font-size: 0.8rem; color: #94a3b8; font-weight: bold; }

    .table-wrapper { display: flex; flex-direction: column; }
    .table-toolbar { display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0; border-bottom: none; padding: 1.2rem 1.5rem; }
    .table-toolbar h4 { border: none; margin: 0; padding: 0; }
    .table-actions { display: flex; gap: 10px; }
    .table-container { background: #1e293b; border-radius: 0 0 12px 12px; overflow: hidden; border: 1px solid #334155; }

    table { width: 100%; border-collapse: collapse; }
    th { background: #0f172a; color: #94a3b8; padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; border-bottom: 2px solid #334155; letter-spacing: 0.05em; }
    td { padding: 16px; border-bottom: 1px solid #334155; font-size: 0.9rem; color: #e2e8f0; vertical-align: middle; }
    tr:hover { background: rgba(255, 255, 255, 0.02); }
    
    tbody td:first-child { 
        color: #ffffff; 
        background: transparent; 
        font-weight: 700; 
    }

    .bold { font-weight: 600; color: #ffffff; }
    .badge-year { background: #1e3a8a; color: #93c5fa; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 0.8rem; }
    .badge-code { background: #334155; color: #e2e8f0; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; }
    .text-green { color: #34d399; font-weight: bold; }

    input {
        background: #0f172a;
        border: 1px solid #475569;
        color: #ffffff;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 0.9rem;
    }
    input:focus { border-color: #38bdf8; outline: none; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15); }
    input::placeholder { color: #475569; }

    button, .btn-edit {
        cursor: pointer;
        border-radius: 8px;
        border: none;
        padding: 10px 18px;
        font-weight: 600;
        transition: background-color 0.2s, transform 0.1s;
        text-decoration: none;
        font-size: 0.85rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .btn-search { background: #0284c7; color: white; }
    .btn-search:hover { background: #0369a1; }
    .btn-clear { background: #475569; color: #e2e8f0; }
    .btn-clear:hover { background: #334155; }
    .btn-add { background: #059669; color: white; margin-top: 8px; padding: 12px; }
    .btn-add:hover { background: #047857; }
    .btn-load { background: #4f46e5; color: white; }
    .btn-load:hover { background: #4338ca; }
    .btn-danger { background: #b91c1c; color: white; }
    .btn-danger:hover { background: #991b1b; }
    
    .btn-del { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
    .btn-del:hover { background: #ef4444; color: white; }
    .btn-edit { background: rgba(245, 158, 11, 0.1); color: #fbbf24; margin-right: 8px; border: 1px solid rgba(245, 158, 11, 0.2); }
    .btn-edit:hover { background: #f59e0b; color: white; }

    button:active { transform: scale(0.98); }
    .empty { text-align: center; padding: 4rem; color: #475569; font-style: italic; background: #1e293b; }
</style>