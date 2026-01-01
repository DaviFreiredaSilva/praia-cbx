const API_KEY = 'b2042e724607b791d9c120196d9853b8'; // Pegue em openweathermap.org
const CIDADE = 'Salvador,BR';

async function buscarClima() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${CIDADE}&appid=${API_KEY}&units=metric&lang=pt_br`);
        const data = await response.json();

        // --- DADOS GERAIS DE HOJE ---
        const hoje = data.list[0];
        document.getElementById('data-hoje').innerText = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' });
        document.getElementById('temp-hoje').innerText = `${Math.round(hoje.main.temp)}°`;
        document.getElementById('sensacao-hoje').innerText = Math.round(hoje.main.feels_like);
        document.getElementById('desc-hoje').innerText = hoje.weather[0].description;
        document.getElementById('chuva-hoje').innerText = Math.round(hoje.pop * 100);
        document.getElementById('vento-hoje').innerText = Math.round(hoje.wind.speed * 3.6);

        // --- LÓGICA DO CARROSSEL POR HORA ---
        const listaHorarios = document.getElementById('lista-horarios');
        listaHorarios.innerHTML = ''; // Limpa antes de preencher

        // Pegamos os primeiros 8 blocos (24 horas)
        data.list.slice(0, 8).forEach(item => {
            const hora = new Date(item.dt * 1000).getHours();
            const temp = Math.round(item.main.temp);
            const desc = item.weather[0].description;
            const probChuva = Math.round(item.pop * 100);

            const htmlHora = `
                <div class="hora-item">
                    <span>${hora}:00</span>
                    <strong>${temp}°</strong>
                    <small>${desc}</small>
                    <small>💧${probChuva}%</small>
                </div>
            `;
            listaHorarios.innerHTML += htmlHora;
        });

        calcularLotacao(temperaturaAtual, descricaoClima);
        
        // --- DADOS DE AMANHÃ (Índice 8) ---
        const amanha = data.list[8];
        document.getElementById('temp-amanha').innerText = `${Math.round(amanha.main.temp)}°`;
        document.getElementById('sensacao-amanha').innerText = Math.round(amanha.main.feels_like);
        document.getElementById('chuva-amanha').innerText = Math.round(amanha.pop * 100);

    } catch (error) {
        console.error('Erro:', error);
    }
}

function calcularLotacao(temp, descClima) {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hora = agora.getHours();
    const statusElemento = document.getElementById('status-praia');
    
    let lotacao = "Vazia";
    let classe = "vazia";

    const ehFimDeSemana = (diaSemana === 0 || diaSemana === 6);
    const ehSegunda = (diaSemana === 1); // Regra da folga do comércio
    const horarioPico = (hora >= 10 && hora <= 16);
    const climaBom = !descClima.includes("chuva") && !descClima.includes("tempestade") && temp > 25;

    // Regra para Finais de Semana (Sol + Horário de Pico)
    if (ehFimDeSemana && horarioPico && climaBom) {
        lotacao = "Muito Cheia";
        classe = "cheia";
    } 
    // NOVA REGRA: Segunda-feira de Sol na CBX
    else if (ehSegunda && horarioPico && climaBom) {
        lotacao = "Movimentada (Folga)";
        classe = "moderada"; // Ou 'cheia' se você achar que fica realmente lotado
    }
    // Regra para Final de Tarde ou FDS Nublado
    else if (ehFimDeSemana || (horarioPico && climaBom) || (hora >= 17 && hora <= 19)) {
        lotacao = "Moderada";
        classe = "moderada";
    }

    statusElemento.innerText = lotacao;
    statusElemento.className = "status-badge " + classe;
}

// No final do script.js, use este ou o window.onload
document.addEventListener('DOMContentLoaded', () => {
    buscarClima();
});


