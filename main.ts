import { chave_github } from "./src/config.js";
import type { Repo } from "./structs.js";

const bpr: HTMLButtonElement | null = document.getElementById("btn_pegar_repo") as HTMLButtonElement;
const input_nome: HTMLInputElement | null = document.getElementById("input_nome") as HTMLInputElement;
const div_repos: HTMLElement | null = document.getElementById("div_repos") ;


bpr?.addEventListener("click", async () => {
    if (input_nome == null) return;
    if (input_nome.value== "") return;
    bpr.disabled = true;

    var nome_repo: string = input_nome.value;
    await load_repos(`${nome_repo} in:name`);
    
    limpar_area_repos();
    loaded_repos.forEach(rep => {
        append_repo(rep);
        console.log(rep)
    });
    
    bpr.disabled = false;
});


var loaded_repos: Array<Repo> = new Array<Repo>;
var current_page: number = 1;
async function load_repos(busca: string){
    const query = `?per_page=${20}&page=${current_page}&q=` + encodeURIComponent(busca);
    const url: string = `https://api.github.com/search/repositories${query}`;

    var repos: Array<Record<string, unknown>> = (await get(url)).items;    
    
    
    loaded_repos.length = 0;
    repos.forEach(rep => {
        var nr: Repo = {
            nome: rep["name"] as string,
            link: rep["html_url"] as string,
            criacao: new Date(rep["created_at"] as string),

            forks: rep["forks_count"] as number,
            stars: rep["stargazers_count"] as number,
            watchers: rep["watchers_count"] as number,

            language: rep["language"] as string,
            all_languages: rep["languages_url"] as string,

            owner: rep["owner"] as Record<string, unknown>
        }

        loaded_repos.push(nr);
    });
}



function append_repo(repo: Repo){
    if (div_repos == null) return;
    
    var elemento: HTMLParagraphElement = document.createElement("p");
    elemento.textContent = `${repo.nome} -> ${repo.link}`; 


    div_repos.append(elemento);
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

    return await res.json();
}
