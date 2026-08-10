import { chave_github } from "./src/config.js";
const bpr = document.getElementById("btn_pegar_repo");
const input_nome = document.getElementById("input_nome");
const div_repos = document.getElementById("div_repos");
bpr?.addEventListener("click", async () => {
    bpr.disabled = true;
    if (input_nome == null)
        return;
    if (input_nome.value == "")
        return;
    var nome_usuario = input_nome.value;
    console.log(await get_repos(nome_usuario));
    bpr.disabled = false;
    var repo = {
        nome: "teste",
        link: "wow"
    };
    limpar_area_repos();
    append_repo(repo);
});
async function get(url) {
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${chave_github}`,
            Accept: "application/vnd.github+json"
        }
    });
    if (!res.ok) {
        return null;
    }
    return await res.json();
}
async function get_repos(nome) {
    const query = `?per_page=${20}&page=${1}&q=` + encodeURIComponent(`${nome} in:name`);
    const url = `https://api.github.com/search/repositories${query}`;
    var repositorios = (await get(url)).items;
    return repositorios;
}
function append_repo(repo) {
    if (div_repos == null)
        return;
    var elemento = document.createElement("p");
    elemento.textContent = `${repo.nome} -> ${repo.link}`;
    div_repos.append(elemento);
}
function limpar_area_repos() {
    if (div_repos == null)
        return;
    div_repos.innerHTML = "";
}
//# sourceMappingURL=main.js.map