
export type Repo = {
    nome: string;  //name
    link: string;  //html_url
    criacao: Date; //created_at

    forks: number;    //forks_count
    stars: number;    //stargazers_count
    watchers: number; //watchers_count

    language: string;      //language
    all_languages: string; //languages_url

    owner: Record<string, unknown>; //owner
}