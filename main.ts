import { chave_github } from "./src/config.js";

const bpr: HTMLElement | null = document.getElementById("btn_pegar_repo");
const input_nome: HTMLInputElement | null = document.getElementById("input_nome") as HTMLInputElement;

bpr?.addEventListener("click", async () => {
    if (input_nome == null) return;
    if (input_nome.value== "") return;
    
    var nome_usuario: string = input_nome.value;
    
    console.log(await get_repo_count(nome_usuario));
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

async function get_repo_count(nome: string) {
    const url: string = `https://api.github.com/users/${nome}`;
    const key: string = "public_repos";

    var qtd_projetos: number = (await get(url))[key];

    return qtd_projetos;
}