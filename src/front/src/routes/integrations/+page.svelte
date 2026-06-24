<script>
    import { onMount } from 'svelte';

    // Instancia global de Highcharts protegida contra fallos de ejecución en servidor (SSR)
    let Highcharts = $state(null);

    const integrations = [
        // 1. MI API PROPIA (Base para las mixtas)
        {
            id: 'agriculture-self',
            title: 'Mi API: Agriculture Land',
            type: 'SOS G17',
            fetchUrl: '/api/v1/agriculture-land?limit=5',
            apiUrl: '/api/v1/agriculture-land',
            columns: ['country', 'year', 'land_agriculture', 'index'],
            accent: '#84a59d'
        },
        // 2. SOS G23 (Gráfica de Líneas)
        {
            id: 'g23-stock',
            title: 'API G23: Stock Market',
            type: 'Externa SOS',
            fetchUrl: 'https://sos2526-23.onrender.com/api/v1/daily-global-stock-market-indicators?limit=5',
            apiUrl: 'https://sos2526-23.onrender.com/api/v1/daily-global-stock-market-indicators',
            columns: ['region', 'date', 'open', 'high'], 
            accent: '#6c5ce7'
        },
        // 3. SOS G25 (Tabla)
        {
            id: 'g25-tourists',
            title: 'API G25: Tourist Arrivals',
            type: 'Externa SOS',
            fetchUrl: 'https://sos2526-25.onrender.com/api/v1/international-tourist-arrivals?limit=5',
            apiUrl: 'https://sos2526-25.onrender.com/api/v1/international-tourist-arrivals',
            columns: ['country', 'year', 'air_arrival', 'water_arrival'],
            accent: '#d4a373'
        },
        // 4. POKEMON (Gráfica de Tarta)
        {
            id: 'ext-pokemon',
            title: 'PokeAPI (Directa - Prueba)',
            type: 'Prueba sin proxy',
            fetchUrl: 'https://pokeapi.co/api/v2/pokemon?limit=5', 
            apiUrl: 'https://pokeapi.co/api/v2/pokemon',
            columns: ['name', 'url'],
            accent: '#ff7675'
        },
        // 5. PAÍSES (Tabla)
        {
            id: 'ext-paises',
            title: 'Datos de Países',
            type: 'Externa No SOS',
            fetchUrl: 'https://restcountries.com/v3.1/all?fields=name,capital,region',
            apiUrl: 'https://restcountries.com/v3.1/all',
            columns: ['name', 'capital', 'region'],
            accent: '#fdcb6e'
        },
        // 6. UNIVERSIDADES (Tabla)
        {
            id: 'ext-universities',
            title: 'Universidades España',
            type: 'Externa No SOS',
            fetchUrl: 'http://universities.hipolabs.com/search?country=Spain&limit=5',
            apiUrl: 'http://universities.hipolabs.com/search?country=Spain',
            columns: ['name', 'domains'], 
            accent: '#55efc4'
        },
        // 7. RICK & MORTY (Tabla)
        {
            id: 'ext-rickmorty',
            title: 'Rick & Morty: Personajes',
            type: 'Externa No SOS',
            fetchUrl: 'https://rickandmortyapi.com/api/character',
            apiUrl: 'https://rickandmortyapi.com/api/character',
            columns: ['name', 'status', 'species'],
            accent: '#e84393'
        },
        // 8. JSONPLACEHOLDER POSTS (Tabla)
        {
            id: 'ext-posts',
            title: 'JSONPlaceholder: Publicaciones',
            type: 'Externa No SOS',
            fetchUrl: 'https://jsonplaceholder.typicode.com/posts?_limit=5',
            apiUrl: 'https://jsonplaceholder.typicode.com/posts',
            columns: ['id', 'title', 'body'],
            accent: '#00cec9'
        },
        // 9. FAKESTORE PRODUCTS (Tabla)
        {
            id: 'ext-products',
            title: 'FakeStore: Productos Ecommerce',
            type: 'Externa No SOS',
            fetchUrl: 'https://fakestoreapi.com/products?limit=5',
            apiUrl: 'https://fakestoreapi.com/products',
            columns: ['id', 'title', 'price', 'category'],
            accent: '#ffb8b8'
        },
        //  10
        {
            id: 'mixed-currency',
            title: 'Gráfica Mixta: Moneda USD vs  Tierras',
            type: 'Cruce de Datos (Mixto)',
            fetchUrl: 'https://open.er-api.com/v6/latest/USD',
            apiUrl: 'https://open.er-api.com/v6/latest/USD',
            columns: ['currency', 'rate'],
            accent: '#0984e3'
        },
        //  NUEVA 11: MIXTA 
        {
            id: 'mixed-users',
            title: 'Gráfica Mixta: Volumen Usuarios vs  Tierras',
            type: 'Cruce de Datos (Mixto)',
            fetchUrl: 'https://jsonplaceholder.typicode.com/users',
            apiUrl: 'https://jsonplaceholder.typicode.com/users',
            columns: ['id', 'name', 'username'],
            accent: '#2ecc71'
        },
        //  NUEVA 12: MIXTA 
        {
            id: 'mixed-todos',
            title: 'Gráfica Mixta: Tareas Externas vs  Índice',
            type: 'Cruce de Datos (Mixto)',
            fetchUrl: 'https://jsonplaceholder.typicode.com/todos?_limit=5',
            apiUrl: 'https://jsonplaceholder.typicode.com/todos',
            columns: ['id', 'title', 'completed'],
            accent: '#e67e22'
        }
    ];

    let cards = $state(integrations.map(config => ({
        ...config,
        loading: true,
        error: '',
        rows: [],
        fetchedAt: '-'
    })));

    async function loadAll() {
        cards = cards.map(c => ({ ...c, loading: true, error: '' }));
        
        const fetchWithRetry = async (url, retries = 4, delay = 3000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const res = await fetch(url);
                    if (res.ok) return await res.json();
                    if (res.status === 404) throw new Error("Error 404: La ruta no existe");
                    if (res.status >= 500) throw new Error("Servidor arrancando...");
                } catch (e) {
                    if (e.message.includes("404") || i === retries - 1) throw e;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        };

        for (let i = 0; i < cards.length; i++) {
            try {
                const data = await fetchWithRetry(cards[i].fetchUrl);
                let finalRows = [];
                
                if (Array.isArray(data)) {
                    finalRows = data;
                } else if (data && data.rates) {
                    // Adaptador para la API de monedas que devuelve un objeto plano
                    finalRows = Object.entries(data.rates).slice(0, 5).map(([key, val]) => ({ currency: key, rate: val }));
                } else if (data && data.results && Array.isArray(data.results)) {
                    finalRows = data.results; 
                } else if (data && data.data && Array.isArray(data.data)) {
                    finalRows = data.data; 
                }

                cards[i] = {
                    ...cards[i],
                    loading: false,
                    rows: finalRows.slice(0, 5),
                    fetchedAt: new Date().toLocaleTimeString('es-ES'),
                    error: finalRows.length === 0 ? 'Sin datos en la API' : ''
                };
            } catch (e) {
                cards[i] = { 
                    ...cards[i], 
                    loading: false, 
                    error: 'Error de carga en el recurso.' 
                };
            }
        }
    }

    // Constructor dinámico de gráficos en cliente
    function initChart(node, card) {
        if (!Highcharts || !card.rows || card.rows.length === 0) return;

        // Extraemos los datos cargados en la primera tarjeta (Tu API propia)
        const myApiData = cards[0]?.rows || [];
        const categoriesCountries = myApiData.map(r => r.country || 'País');

        if (card.id === 'agriculture-self') {
            Highcharts.chart(node, {
                chart: { type: 'column', backgroundColor: 'transparent' },
                title: { text: null },
                xAxis: { categories: categoriesCountries, labels: { style: { color: '#1f2a24' } } },
                yAxis: { title: { text: 'Superficie %', style: { color: '#35594a' } } },
                legend: { enabled: false },
                credits: { enabled: false },
                series: [{
                    name: 'Tierras Agrícolas',
                    data: card.rows.map(r => parseFloat(r.land_agriculture || 0)),
                    color: card.accent
                }]
            });
        } 
        else if (card.id === 'g23-stock') {
            Highcharts.chart(node, {
                chart: { type: 'spline', backgroundColor: 'transparent' },
                title: { text: null },
                xAxis: { categories: card.rows.map(r => r.region || r.date || 'Stock') },
                yAxis: { title: { text: 'Valor Cotización' } },
                credits: { enabled: false },
                series: [
                    { name: 'Open', data: card.rows.map(r => parseFloat(r.open || 0)), color: card.accent },
                    { name: 'High', data: card.rows.map(r => parseFloat(r.high || 0)), color: '#ef4444' }
                ]
            });
        } 
        else if (card.id === 'ext-pokemon') {
            Highcharts.chart(node, {
                chart: { type: 'pie', backgroundColor: 'transparent' },
                title: { text: null },
                credits: { enabled: false },
                series: [{
                    name: 'Longitud del nombre',
                    colorByPoint: true,
                    data: card.rows.map(r => ({
                        name: r.name,
                        y: r.name ? r.name.length : 5
                    }))
                }]
            });
        }
        // 🔄 GRÁFICA MIXTA 10
        else if (card.id === 'mixed-currency') {
            Highcharts.chart(node, {
                chart: { backgroundColor: 'transparent' },
                title: { text: null },
                xAxis: { categories: categoriesCountries },
                yAxis: [
                    { title: { text: 'Mi API: Sup. Agrícola %', style: { color: '#84a59d' } } },
                    { title: { text: 'Ext API: Tasa Cambios', style: { color: card.accent } }, opposite: true }
                ],
                credits: { enabled: false },
                series: [
                    { type: 'column', name: 'Mi API: Sup. Agrícola', data: myApiData.map(r => parseFloat(r.land_agriculture || 0)), color: '#84a59d' },
                    { type: 'spline', name: 'Ext API: Valor Divisa', yAxis: 1, data: card.rows.map(r => parseFloat(r.rate || 0)), color: card.accent }
                ]
            });
        }
        // 🔄 GRÁFICA MIXTA 11
        else if (card.id === 'mixed-users') {
            Highcharts.chart(node, {
                chart: { backgroundColor: 'transparent' },
                title: { text: null },
                xAxis: { categories: categoriesCountries },
                yAxis: [
                    { title: { text: 'Mi API: Sup. Agrícola %' } },
                    { title: { text: 'Ext API: ID Mapeado' }, opposite: true }
                ],
                credits: { enabled: false },
                series: [
                    { type: 'area', name: 'Mi API: Sup. Agrícola', data: myApiData.map(r => parseFloat(r.land_agriculture || 0)), color: 'rgba(132, 165, 157, 0.4)' },
                    { type: 'line', name: 'Ext API: Índice Usuario', yAxis: 1, data: card.rows.map((r, i) => (i + 1) * 20), color: card.accent }
                ]
            });
        }
        // 🔄 GRÁFICA MIXTA 12
        else if (card.id === 'mixed-todos') {
            Highcharts.chart(node, {
                chart: { backgroundColor: 'transparent' },
                title: { text: null },
                xAxis: { categories: categoriesCountries },
                yAxis: { title: { text: 'Escala de Rendimiento Compuesto' } },
                credits: { enabled: false },
                series: [
                    { type: 'bar', name: 'Mi API: Tu Index', data: myApiData.map(r => parseFloat(r.index || 0)), color: '#fdcb6e' },
                    { type: 'line', name: 'Ext API: Task Status', data: card.rows.map(r => r.completed ? 1.5 : 0.4), color: card.accent }
                ]
            });
        }
    }

    onMount(async () => {
        const hcModule = await import('highcharts');
        Highcharts = hcModule.default;
        loadAll();
    });
</script>

<main>
    <header class="main-header">
        <div class="header-content">
            <h1>Data Hub <span class="group-tag">Grupo 17</span></h1>
            <p>Panel Avanzado: APIs independientes y Gráficas de datos cruzados en Svelte 5</p>
        </div>
        <div class="nav-buttons">
            <button class="refresh-btn" onclick={loadAll}>
                <span class="icon">🔄</span> Sincronizar Todo
            </button>
            <a href="/" class="home-link">Volver</a>
        </div>
    </header>

    <section class="grid-layout">
        {#each cards as card}
            <article class="glass-card" style="--accent: {card.accent}">
                <div class="card-header">
                    <span class="badge">{card.type}</span>
                    <h2>{card.title}</h2>
                </div>

                <div class="card-body">
                    <p class="api-path"><code>{card.apiUrl}</code></p>
                    
                    {#if card.loading}
                        <div class="loader">Conectando con el endpoint...</div>
                    {:else if card.error}
                        <div class="error-box">{card.error}</div>
                    {:else}
                        {#if ['agriculture-self', 'g23-stock', 'ext-pokemon', 'mixed-currency', 'mixed-users', 'mixed-todos'].includes(card.id)}
                            <div class="chart-box" use:initChart={card}></div>
                        {:else}
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            {#each card.columns as col}
                                                <th>{col.replace('_', ' ')}</th>
                                            {/each}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each card.rows as row}
                                            <tr>
                                                {#each card.columns as col}
                                                    <td class="truncate-cell">
                                                        {#if col === 'name' && typeof row[col] === 'object' && row[col] !== null}
                                                            {row[col].common || 'N/A'}
                                                        {:else if col === 'domains' && Array.isArray(row[col])}
                                                            {row[col][0] || 'N/A'}
                                                        {:else}
                                                            {row[col] ?? '-'}
                                                        {/if}
                                                    </td>
                                                {/each}
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        {/if}
                    {/if}
                </div>
                
                <div class="card-footer">
                    <span>Sincronizado: {card.fetchedAt}</span>
                </div>
            </article>
        {/each}
    </section>
</main>

<style>
    main {
        max-width: 1340px;
        margin: 0 auto;
        padding: 40px 20px;
        font-family: system-ui, -apple-system, sans-serif;
    }

    .main-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
    }

    h1 {
        font-size: 2rem;
        margin: 0;
        color: #1f2a24;
    }

    .main-header p {
        color: #5b665f;
        margin-top: 8px;
    }

    .group-tag {
        font-size: 0.9rem;
        background: #e7efe9;
        color: #35594a;
        padding: 4px 12px;
        border-radius: 6px;
        vertical-align: middle;
        margin-left: 10px;
    }

    .nav-buttons {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .refresh-btn {
        background: #35594a;
        color: white;
        border: 1px solid #35594a;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.2s ease;
    }

    .refresh-btn:hover { 
        background: #294639;
    }

    .home-link {
        text-decoration: none;
        color: #35594a;
        font-weight: 600;
    }

    .grid-layout {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(390px, 1fr));
        gap: 25px;
    }

    .glass-card {
        background: #ffffff;
        border-radius: 14px;
        border: 1px solid #d6dcd3;
        padding: 22px;
        box-shadow: 0 10px 24px rgba(31, 42, 36, 0.05);
        display: flex;
        flex-direction: column;
        border-top: 5px solid var(--accent);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .glass-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 14px 28px rgba(31, 42, 36, 0.1);
    }

    .badge {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #35594a;
        letter-spacing: 0.04em;
    }

    h2 {
        margin: 5px 0 15px;
        font-size: 1.15rem;
        color: #1f2a24;
    }

    .api-path {
        font-size: 0.75rem;
        background: #f7f7f3;
        padding: 8px;
        border-radius: 8px;
        margin-bottom: 18px;
        color: #44504a;
        word-break: break-all;
        border: 1px solid #d6dcd3;
    }

    .chart-box {
        width: 100%;
        height: 240px;
        margin: 0 auto;
    }

    .table-container {
        overflow-x: auto;
        border-radius: 10px;
        background: #ffffff;
        border: 1px solid #d6dcd3;
        max-height: 240px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.82rem;
    }

    th {
        background: #f7f7f3;
        padding: 10px 12px;
        text-align: left;
        color: #35594a;
        border-bottom: 1px solid #d6dcd3;
        position: sticky;
        top: 0;
    }

    td {
        padding: 9px 12px;
        border-bottom: 1px solid #e6ebe3;
        color: #1f2a24;
    }

    .truncate-cell {
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .card-footer {
        margin-top: auto;
        padding-top: 15px;
        font-size: 0.72rem;
        color: #7c8a81;
        text-align: right;
    }

    .error-box {
        color: #8a3e3e;
        background: #f8eded;
        border: 1px solid #e4c6c6;
        padding: 12px;
        border-radius: 8px;
        font-size: 0.82rem;
    }

    .loader {
        text-align: center;
        padding: 35px;
        color: #6b7770;
        background: #f7f7f3;
        border: 1px solid #d6dcd3;
        border-radius: 8px;
        font-size: 0.85rem;
    }
</style>