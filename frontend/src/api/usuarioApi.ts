
export async function buscarUsuarios(){

    const response = await fetch("http://localhost:8080/api/usuario"); 

    const dados = await response.json();

    return dados;

}