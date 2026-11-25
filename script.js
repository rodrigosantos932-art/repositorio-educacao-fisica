
document.addEventListener("DOMContentLoaded", () => {
    const selecaoTurma = document.getElementById("selecaoTurma");
    const areaTurma = document.getElementById("areaTurma");
    const nomeTurma = document.getElementById("nomeTurma");
    const botaoVoltar = document.getElementById("voltar");

    const botoesTurma = document.querySelectorAll(".turma");
    const botoesUnidade = document.querySelectorAll(".titulo-unidade");

    // Abre a turma escolhida.
    function abrirTurma(idTurma) {
        const turma = atividades[idTurma];

        if (!turma) {
            return;
        }

        nomeTurma.textContent = turma.nome;

        carregarAtividades(turma);

        selecaoTurma.hidden = true;
        areaTurma.hidden = false;

        fecharTodasAsUnidades();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Carrega as três unidades da turma.
    function carregarAtividades(turma) {
        carregarUnidade("unidade1", turma.unidade1);
        carregarUnidade("unidade2", turma.unidade2);
        carregarUnidade("unidade3", turma.unidade3);
    }

    // Monta os materiais de uma unidade.
    function carregarUnidade(id, lista) {
        const container = document.getElementById(id);

        container.replaceChildren();

        if (!Array.isArray(lista) || lista.length === 0) {
            const mensagem = document.createElement("p");
            mensagem.className = "vazio";
            mensagem.textContent = "Nenhuma atividade disponível no momento.";
            container.appendChild(mensagem);
            return;
        }

        lista.forEach((atividade) => {
            container.appendChild(criarCardAtividade(atividade));
        });
    }

    // Cria um cartão de atividade com texto seguro.
    function criarCardAtividade(atividade) {
        const card = document.createElement("article");
        card.className = "card";

        const info = document.createElement("div");
        info.className = "info";

        const titulo = document.createElement("h3");
        const tipo = String(atividade.tipo || "").toLowerCase();

        const icone = tipo === "pdf"
        ? "📄"
        : tipo === "wordwall"
        ? "🎮"
        : "🔗";

        titulo.textContent = `${icone} ${atividade.titulo || "Atividade"}`;

        const descricao = document.createElement("p");
        descricao.textContent = atividade.descricao || "";

        info.append(titulo, descricao);

        const botao = document.createElement("a");
        botao.className = "botao";
        botao.textContent = "Abrir";

        const link = obterLinkSeguro(atividade.link);

        if (link) {
            botao.href = link;
            botao.target = "_blank";
            botao.rel = "noopener noreferrer";
        } else {
            botao.textContent = "Link indisponível";
            botao.setAttribute("aria-disabled", "true");
            botao.classList.add("botao-indisponivel");
        }

        card.append(info, botao);

        return card;
    }

    // Aceita somente endereços HTTP e HTTPS.
    function obterLinkSeguro(valor) {
        try {
            const url = new URL(valor);

            if (url.protocol === "https:" || url.protocol === "http:") {
                return url.href;
            }
        } catch {
            return null;
        }

        return null;
    }

    // Volta à tela de seleção de turmas.
    function voltarParaTurmas() {
        areaTurma.hidden = true;
        selecaoTurma.hidden = false;

        fecharTodasAsUnidades();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Abre ou fecha uma unidade.
    function alternarUnidade(botao) {
        const conteudo = botao.nextElementSibling;
        const seta = botao.querySelector(".seta");
        const estaAberta = !conteudo.hidden;

        conteudo.hidden = estaAberta;

        botao.setAttribute("aria-expanded", String(!estaAberta));
        seta.textContent = estaAberta ? "▼" : "▲";
    }

    // Fecha todas as unidades.
    function fecharTodasAsUnidades() {
        botoesUnidade.forEach((botao) => {
            const conteudo = botao.nextElementSibling;
            const seta = botao.querySelector(".seta");

            conteudo.hidden = true;
            botao.setAttribute("aria-expanded", "false");
            seta.textContent = "▼";
        });
    }

    // Eventos dos botões de turma.
    botoesTurma.forEach((botao) => {
        botao.addEventListener("click", () => {
            abrirTurma(botao.dataset.turma);
        });
    });

    // Evento do botão de voltar.
    botaoVoltar.addEventListener("click", voltarParaTurmas);

    // Eventos dos botões de unidade.
    botoesUnidade.forEach((botao) => {
        botao.addEventListener("click", () => {
            alternarUnidade(botao);
        });
    });
});
