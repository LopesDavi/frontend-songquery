//Acessando o <input/> no documento HTML
const input = document.getElementById("input");
//Acessando o <button/> de busca no documento HTML
const searchButton = document.getElementById("search-button");
//Acessando o <button/> de limpar no documento HTML
const cleanButton = document.getElementById("clean-button");

//Iniciando a interface com o button (clean) escondido
cleanButton.style.display = "none";

//Função responsável por fazer a limpeza do input (caso esteja com algum valor)
function cleanInput(callbackCleanArtistInfo) {
  cleanButton.addEventListener("click", () => {
    input.value = "";

    cleanButton.style.display = "none";

    callbackCleanArtistInfo();
  });
}
cleanInput(
  //Passei essa função como callback
  //Função responsável por limpar todas informações (se caso tiver) exibidas na tela
  function cleanArtistInfo() {
  //Acessando <div> (user-response)
  const userResponse = document.getElementById("user-response");
  //Limpando informações que estavam renderizadas
  userResponse.innerHTML = `
    <img src="../assets/images/logo-name-project.png"/>
   `;
});

//Função responsável por verificar se tem algum valor no input -> Caso tenha, exibe o cleanButton, caso contrário deixa somente o seachButton
function addCleanButton() {
  input.addEventListener("input", () =>
      (cleanButton.style.display =
        input.value.trim() !== "" ? "flex" : "none")
  );
}
addCleanButton();

//Função responsável  pela busca de artista e manipulação de dados
function fetchAndDisplayArtistInfo() {
  //Adicionando evento de click no searchButton - (Passei uma promise como 2º param)
  searchButton.addEventListener("click", async () => {
    //Pegando o valor digitado pelo usuário no input -> (Nome do artita)
    const inputValue = input.value;

    //Emitir erro caso usuário aperte no searchButton sem adicionar valor no input
    if (inputValue === "") {
      //Utilizei a lib Sweetalert2 para emitir os erros
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: false,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "warning",
        title: "Digite o nome do artista desejado",
        iconColor: "#ffbb2f",
        width: "400px",
        showClass: {
          popup: `
            animate__animated
            animate__backInDown
            animate__slower
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__backOutUp
            animate__slower
          `
        }
      }, );
    }

    try {
      //Fazendo fetch (axios.get)
      const response = await axios.get(
        `http://localhost:3000/get-artist?q=${encodeURIComponent(inputValue)}`
      );

      //Acessando data(object)/artists(object)/items[array] -> Disponibilizados pela API (Spotify)
      const data = response.data.artists.items[0];
      // console.log(data);

      //Criando array vazio
      const arr = [];
      //Criando loop para pegar os dados/generos do artista(vindos da API) e adicionando dentro do arr(vazio)
      for (let genre of data.genres) {
        arr.push(genre);
      }

      //Acessando a <div> (user-response)
      const userResponse = document.getElementById("user-response");
      userResponse.innerHTML = `
      <div id="artist-infos-container-1">
        <a href="${data.images[0].url}" target="blank_">
         <img src="${data.images.length === 0 ? "../images/logo-name-project.png" : data.images[0].url}"/>
       </a>
       
        <div id="artist-info-container-2">
          <div>
            <div>
              <p>${data.followers.total}</p>
              <p>Seguidores</p>
            </div>
            <div>
              <p>${data.popularity}</p>
              <p>Popularidade</p>
            </div>
          </div>
          <div>
            <a href="${
              data.external_urls.spotify
            }" target="blank_">Visualizar artista</a>
          </div>
        </div>
      </div>

      <div id="artist-infos-container-3">
        <a href="${data.external_urls.spotify}" target="blank_">
        ${data.name}
        </a>
        <p>${arr.join(", ").toUpperCase()}</p>
      </div>
  `;
    } catch (error) {
      console.log(error);
    }
  });
}
fetchAndDisplayArtistInfo();
