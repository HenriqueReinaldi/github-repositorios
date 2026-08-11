import { chave_github } from "./src/config.js";
import type { Repo } from "./structs.js";
import { create_cartao_repo_string } from "./structs.js";

const btn_buscar: HTMLButtonElement | null = document.getElementById("btn_buscar") as HTMLButtonElement;
const btn_pag_prev: HTMLButtonElement | null = document.getElementById("btn_pag_prev") as HTMLButtonElement;
const btn_prox_pag: HTMLButtonElement | null = document.getElementById("btn_prox_pag") as HTMLButtonElement;

const input_busca: HTMLInputElement | null = document.getElementById("input_busca") as HTMLInputElement;
const div_repos: HTMLElement | null = document.getElementById("div_repos") ;

var ult_busca = ""

btn_buscar?.addEventListener("click", async () => {
    if (input_busca == null) return;
    if (input_busca.value== "") return;
    btn_buscar.disabled = true;

    reset_busca();

    ult_busca = input_busca.value;
    await buscar_mostrar_repos(ult_busca);
    
    update_btn_paginas();
    btn_buscar.disabled = false;
});
btn_pag_prev.addEventListener("click", async () => {
    await prev_pag();
    update_btn_paginas();
});
btn_prox_pag?.addEventListener("click", async () => {
    await prox_pag();
    update_btn_paginas();
});


var page_size: number = 10;
var current_page: number = 1;
var max_visited_page: number = 1;
var max_repos_to_load: number = 0;

function reset_busca(){
    current_page = 1;
    max_visited_page = 1;
    cached_repos.length = 0;
}
function update_btn_paginas(){
    if (btn_prox_pag == null) return;
    if (btn_pag_prev == null) return;

    btn_prox_pag.disabled = true;
    btn_pag_prev.disabled = true;

    if (current_page < Math.trunc((max_repos_to_load+page_size) / page_size)) btn_prox_pag.disabled = false;
    if (current_page > 1) btn_pag_prev.disabled = false;
}
async function prox_pag(){
    if (btn_prox_pag == null) return;
    btn_prox_pag.disabled = true;

    if (current_page < Math.trunc((max_repos_to_load+page_size) / page_size)) {
        current_page++;
        await buscar_mostrar_repos(ult_busca);
    }
    btn_prox_pag.disabled = false;
}
async function prev_pag(){
    if (btn_pag_prev == null) return;
    btn_pag_prev.disabled = true;

    if (current_page > 1) {
        current_page--;
        await buscar_mostrar_repos(ult_busca);
    }
    btn_pag_prev.disabled = false;
}

var cached_repos: Array<Repo> = new Array<Repo>;
var loaded_repos: Array<Repo> = new Array<Repo>;

function mostrar_repos(){
    limpar_area_repos();
    loaded_repos.forEach(rep => {
        append_repo(rep);
    });
}
async function buscar_mostrar_repos(busca: string){
    await load_repos(`${busca} in:name`);
    
    if (max_repos_to_load == 0) return;

    mostrar_repos();
}
async function fetch_novos_repos(busca: string){
    const query = `?per_page=${page_size}&page=${current_page}&q=` + encodeURIComponent(busca);
    const url: string = `https://api.github.com/search/repositories${query}`;

    var res: any = await get(url)
    if (res == null) {
        console.log("rate limit?");
        return;
    }

    var repos: Array<Record<string, unknown>> = res.items;    
    max_repos_to_load = res.total_count as number;

    repos.forEach(rep => {
        var nr: Repo = {
            nome: rep["name"] as string,
            link: rep["html_url"] as string,
            descricao: rep["description"] as string,
            criacao: new Date(rep["created_at"] as string),

            forks: rep["forks_count"] as number,
            stars: rep["stargazers_count"] as number,
            watchers: rep["watchers_count"] as number,

            language: rep["language"] as string,
            all_languages: rep["languages_url"] as string,

            owner: rep["owner"] as Record<string, unknown>,

            visto: false,
            favorito: false
        }
        cached_repos.push(nr);
    });
}
async function load_repos(busca: string){
    if (current_page >= max_visited_page){
        await fetch_novos_repos(busca);
        max_visited_page++;
    }

    loaded_repos.length = 0;

    var cpps: number = current_page*page_size;
    for (var i = cpps-page_size; i < cpps; i++){
        loaded_repos.push(cached_repos[i] as Repo); 
    }
    console.log(loaded_repos);
}



function append_repo(repo: Repo){
    if (div_repos == null) return;
    
    var repo_card_string = create_cartao_repo_string(repo);

    div_repos.insertAdjacentHTML("beforeend", repo_card_string);
}
function limpar_area_repos(){
    if (div_repos == null) return;

    div_repos.innerHTML = "";
}



async function get(url: string): Promise<any>{
    const res: Response = await fetch(url, {
        headers:{
            Authorization: `Bearer ${chave_github}`,
            Accept: "application/vnd.github+json"
        }
    });

    if (!res.ok){
        return null;
    }

    var jaison: Promise<any> = res.json();
    console.log(jaison);
    return await jaison;
}
