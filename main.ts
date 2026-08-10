import { chave_github } from "./src/config.js";
import type { Repo } from "./structs.js";

const bpr: HTMLButtonElement | null = document.getElementById("btn_pegar_repo") as HTMLButtonElement;
const input_nome: HTMLInputElement | null = document.getElementById("input_nome") as HTMLInputElement;

const div_repos: HTMLElement | null = document.getElementById("div_repos") ;

bpr?.addEventListener("click", async () => {
    bpr.disabled = true;

    if (input_nome == null) return;
    if (input_nome.value== "") return;
    
    var nome_usuario: string = input_nome.value;
    
    console.log(await get_repos(nome_usuario));
    bpr.disabled = false;
});

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

async function get_repos(nome: string): Promise<Response> {
    const query = `?per_page=${20}&page=${1}&q=` + encodeURIComponent(`${nome} in:name`);
    const url: string = `https://api.github.com/search/repositories${query}`;

    var repositorios: Response = (await get(url)).items;    
    return repositorios;
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

