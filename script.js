const API_KEY = 'b2042e724607b791d9c120196d9853b8'; // Pegue em openweathermap.org
const CIDADE = 'Salvador,BR';

async function buscarClima() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${CIDADE}&appid=${API_KEY}&units=metric&lang=pt_br`);
        const data = await response.json();

        // Dados de Hoje (primeiro item da lista)
        const hoje = data.list[0];
        document.getElementById('data-hoje').innerText = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' });
        document.getElementById('temp-hoje').innerText = `${Math.round(hoje.main.temp)}°`;
        document.getElementById('desc-hoje').innerText = hoje.weather[0].description;
        document.getElementById('chuva-hoje').innerText = Math.round(data.list[0].pop * 100);
        document.getElementById('vento-hoje').innerText = Math.round(hoje.wind.speed * 3.6); // Converte m/s para km/h

        // Dados de Amanhã (item daqui a 24h, aproximadamente índice 8 na lista)
        const amanha = data.list[8];
        document.getElementById('temp-amanha').innerText = `${Math.round(amanha.main.temp_min)} / ${Math.round(amanha.main.temp_max)}`;
        document.getElementById('chuva-amanha').innerText = Math.round(amanha.pop * 100);

    } catch (error) {
        alert('Erro ao buscar dados. Verifique sua conexão e a chave da API.');
        console.error(error);
    }
}

// Iniciar ao carregar a página
window.onload = buscarClima;