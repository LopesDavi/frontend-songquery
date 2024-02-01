//Acessando o <input/> no documento HTML
const input = document.getElementById("input");
//Acessando o <button/> de busca no documento HTML
const searchButton = document.getElementById("search-button");
//Acessando o <button/> de limpar no documento HTML
const cleanButton = document.getElementById("clean-button");

//Iniciando a interface com o button (clean) escondido
cleanButton.style.display = "none";

//Função responsável por fazer a limpeza do input (caso esteja com algum valor)
function cleanInput(callbackCleanTrackInfo) {
  cleanButton.addEventListener("click", () => {
    input.value = "";

    cleanButton.style.display = "none";

    callbackCleanTrackInfo();
  });
}
cleanInput(
  //Passei essa função como callback
  //Função responsável por limpar todas informações (se caso tiver) exibidas na tela
  function cleanTrackInfo() {
    //Acessando a <div> (user-response)
    const userResponse = document.getElementById("user-response");
    //Limpando informções que estavam renderizadas
    userResponse.innerHTML = `
        <a id="track-cover-image">
          <img src="/images/logo-name-project.png" id="track-cover"/>
        </a>
        <a id="track-name"></a>
        <a id="track-artist-name"></a>
        <div id="track-preview"></div>
    `;
  }
);

//Função responsável por verificar se tem algum valor no input -> Caso tenha, exibe o cleanButton, caso não tenha deixa somente o searchButton
function addCleanButton() {
  input.addEventListener("input", () => {
    cleanButton.style.display =
      input.value.trim() !== "" ? "inline-block" : "none";
  });
}
addCleanButton();

//Função responsável por busca de faixa e manipulação dos dados
function fetchAndDisplayTrackInfo() {
  //Adicionando evento de click no searchButton - (Passei uma promise como 2º param)
  searchButton.addEventListener("click", async () => {
    //Pegando valor que o usuário digitou no input -> (Nome da música)
    const inputValue = input.value;

    //Emitir erro caso usuário aperte no searchButton sem adicionar valor ao input
    if (inputValue === "") {
      //Utilizei a lib Sweetalert2 para emitir os erros
      Swal.fire({
        icon: "warning",
        iconColor: "#2a2141",
        confirmButtonColor: "#2a2141",
        title:
          "Parece que você esqueceu de informar qual música está buscando...",
        text: "Por favor, digite o nome da música desejada.",
      });
    }

    try {
      //Fazendo fetch (axios.get)
      const response = await axios.get(
        `http://localhost:3000/get-track?q=${encodeURIComponent(inputValue)}`
      );
      //Acessando data(object)/tracks(object)/items[array] -> Disponibilizados pela API (Spotify)
      const data = response.data.tracks.items[0];
      console.log(data);

      //Acessando o array de artistas/bandas e mapeando os nomes para renderiza-los (Array vindo da API)
      let artist = data.artists.map((names) => names.name).join(", ");
      console.log(artist);

      //Variáveis para facilicar a criação da lógica para renderização do <audio>
      //Fluxo -> Se a prévia da música for DIFERENTE DE nulo ENTÃO adiciona a url na tag SE NÃO emite erro
      const previewUrl = data.preview_url;
      const errorWarning = `<div class="preview-alert">
      <img src="./assets/icons/error-icon.svg" id="error-icon" alt="">
      <p>Prévia não disponível no momento!</p>
      </div>`;

      //Acessando <div> (user-response) no HTML
      const userResponse = document.getElementById("user-response");
      //Adicionando as informações(vindas da API) no HTML
      userResponse.innerHTML = `
        <a id="track-cover-image" href="${
          data.album.images[0].url
        }" target="blank_">
          <img src="${data.album.images[0].url}" id="track-cover" class="hover"/>
        </a>
        <a id="track-name" target="_blank" href="${
          data.external_urls.spotify
        }">${data.name}</a>
        <a id="track-artist-name">${artist}</a>
        <div id="track-preview">
        ${
          previewUrl != null
            ? `<audio src="${previewUrl}" controls></audio>`
            : errorWarning
        }
        </div>
      `;
    } catch (error) {
      console.log(error);
    }
  });
}
fetchAndDisplayTrackInfo();
