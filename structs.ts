
export type Repo = {
    nome: string;  //name
    link: string;  //html_url
    descricao: string; //description
    criacao: Date; //created_at

    forks: number;    //forks_count
    stars: number;    //stargazers_count
    watchers: number; //watchers_count

    language: string;      //language
    all_languages: string; //languages_url

    owner: Record<string, unknown>; //owner

    visto: boolean;
    favorito: boolean;

    index: number;
}

export const cores_github: Record<string, string> = {
    //gemini goat
    "JavaScript": "#f1e05a",
    "TypeScript": "#3178c6",
    "Python":     "#3572A5",
    "Java":       "#b07219",
    "C++":        "#f34b7d",
    "C#":         "#178600",
    "C":          "#555555",
    "Go":         "#00ADD8",
    "Rust":       "#dea584",
    "Swift":      "#F05138",
    "Kotlin":     "#A97BFF",
    "Ruby":       "#701516",
    "PHP":        "#4F5D95",
    "HTML":       "#e34c26",
    "CSS":        "#563d7c",
    "SCSS":       "#c6538c",
    "Vue":        "#41b883",
    "Svelte":     "#ff3e00",
    "Shell":      "#89e051",
    "Dart":       "#00B4AB",
    "R":          "#198CE7",
    "Scala":      "#c22d40",
    "Elixir":     "#6e4a7e",
    "Haskell":    "#5e5086",
    "Lua":        "#000080",
    "Perl":       "#0298c3",
    "Zig":        "#ec915c",
    "SQL":        "#e38c00",
    "Dockerfile": "#384d54",
    "Markdown":   "#083fa1",
};

export function create_cartao_repo_string(repo: Repo): string{
    if (repo == undefined || repo == null) return "";

    if (repo.language == null) repo.language = "";
    if (repo.descricao == null) repo.descricao = "";
    
    var cartao_tipo = "cartao_repo";
    var bar_fav = "";
    if (repo.favorito) bar_fav = '<div class="bar_fav"></div>';
    if (repo.visto) cartao_tipo = "cartao_fds";

    
    const cartao =  `
        <div class="${cartao_tipo}">
            ${bar_fav}
            <div class="titulo_repo">
                <a href="${repo.link}">[${repo.nome}] ↗</a>
                <div>[${repo.forks}f]</div>
                <div>[${repo.stars}*]</div>
                <div style="color:${cores_github[repo.language]}">[${repo.language}]</div>
            </div>
            <div class="info_repo">
                <div class="desc_repo">${repo.descricao}<br><br>est: ${repo.criacao.toDateString()} <br> por: ${repo.owner.login as string}</div>
            </div>
            <div class="footer_repo">
                <button id="v${repo.index}">visto</button>
                <button id="f${repo.index}">favorito</button>
            </div>
        </div>
    `

    return cartao;
}