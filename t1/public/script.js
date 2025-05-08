
async function fetchMembros() {
  const res = await fetch('/api/membros');
  return await res.json();
}

async function salvarMembros(membros) {
  await fetch('/api/membros', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(membros)
  });
}

function getCategoria(cargo) {
  if (cargo.includes("OBS")) return "fun-permissao";
  if (cargo.includes("OLH") || cargo.includes("FOG")) return "fun-vigia";
  if (["END", "CRIA", "AVI", "VAP", "INF", "RAD", "TRA", "BAN"].some(c => cargo.includes(c))) return "fun-assistente";
  return "fun-especial";
}

function atualizarCargo(membro) {
  const cargos = [
    { nome: "PILOTO DE FUGA", sigla: "PFG", horas: 60 },
    { nome: "SERIAL KILLER", sigla: "SKL", horas: 54 },
    { nome: "MARGINAL", sigla: "MAR", horas: 48 },
    { nome: "NEGOCIADOR", sigla: "NEG", horas: 45 },
    { nome: "MATADOR", sigla: "MAT", horas: 42 },
    { nome: "HOMICIDA", sigla: "HOM", horas: 40 },
    { nome: "ASSALTANTE", sigla: "ASS", horas: 36 },
    { nome: "ATIRADOR", sigla: "ATI", horas: 34 },
    { nome: "SOLDADO", sigla: "SOL", horas: 32 },
    { nome: "BANDIDO", sigla: "BAN", horas: 30 },
    { nome: "TRAFICANTE", sigla: "TRA", horas: 27 },
    { nome: "RADINHO", sigla: "RAD", horas: 25 },
    { nome: "INFORMANTE", sigla: "INF", horas: 22 },
    { nome: "VAPOR", sigla: "VAP", horas: 20 },
    { nome: "AVIÃOZINHO", sigla: "AVI", horas: 14 },
    { nome: "CRIA", sigla: "CRIA", horas: 10 },
    { nome: "ENDOLADOR", sigla: "END", horas: 6 },
    { nome: "FOGUETEIRO", sigla: "FOG", horas: 4 },
    { nome: "OLHEIRO", sigla: "OLH", horas: 2 },
    { nome: "OBSERVAÇÃO", sigla: "OBS", horas: 0 }
  ];

  for (let cargo of cargos) {
    if (membro.horas >= cargo.horas) {
      membro.cargo = `${cargo.nome} (${cargo.sigla})`;
      break;
    }
  }
}

let membros = [];

async function renderizar() {
  membros = await fetchMembros();
  membros.sort((a, b) => b.horas - a.horas).reverse();
  const div = document.getElementById("listaMembros");
  div.innerHTML = "";
  membros.forEach((membro, index) => {
    atualizarCargo(membro);
    const categoria = getCategoria(membro.cargo);
    div.innerHTML += `
      <div class="membro ${categoria}">
        <strong>#${index + 1} - ${membro.nome}</strong><br>
        Cargo: ${membro.cargo}<br>
        Horas: ${membro.horas}h <br>
        <button onclick="alterarHoras('${membro.nome}', 1)">+1h</button>
        <button onclick="alterarHoras('${membro.nome}', -1)">-1h</button>
      </div>
    `;
  });
}

async function adicionarMembro() {
  const nome = document.getElementById("nomeMembro").value.trim();
  if (!nome) return alert("Digite um nome válido.");
  if (membros.some(m => m.nome.toLowerCase() === nome.toLowerCase()))
    return alert("Membro já adicionado.");
  const novo = { nome, horas: 0, cargo: "OBSERVAÇÃO (OBS)" };
  await fetch('/api/membros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novo)
  });
  renderizar();
  document.getElementById("nomeMembro").value = "";
}

async function alterarHoras(nome, delta) {
  const membro = membros.find(m => m.nome === nome);
  if (!membro) return;
  membro.horas = Math.max(0, membro.horas + delta);
  atualizarCargo(membro);
  await salvarMembros(membros);
  renderizar();
}

async function resetarHoras() {
  const senha = document.getElementById("senhaAdmin").value;
  if (senha !== "admin123") return alert("Senha incorreta.");
  membros.forEach(m => m.horas = 0);
  await salvarMembros(membros);
  renderizar();
  alert("Horas resetadas com sucesso.");
}

renderizar();
