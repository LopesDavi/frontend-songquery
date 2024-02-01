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
cleanInput(function cleanArtistInfo() {
  //Acessando <div> (artist-infos-1)
  const artistInfos1 = document.getElementById("artist-infos-1");
  //Limpando informações que estavam renderizadas
  artistInfos1.innerHTML = `
       <a id="artist-cover-image">
         <img src="../images/logo-name-project.png" />
       </a>
       <div id="artist-info-container" class="hidden">
         <div id="followers-and-popularity">
           <div id="followers">
             <p></p>
             <p></p>
           </div>
           <div id="popuparity">
             <p></p>
             <p></p>
           </div>
         </div>
         <div id="view-artist">
           <a class="hidden"></a>
         </div>
       </div>
   `;

  //Acessando a <div> (artist-infos-2)
  const artistInfos2 = document.getElementById("artist-infos-2");
  //Adicionando as informações(vindas da API) no HTML
  artistInfos2.innerHTML = `
       <a id="artist-name"></a>
       <p id="artist-genre"></p>
   `;
});

//Função responsável por verificar se tem algum valor no input -> Caso tenha, exibe o cleanButton, caso contrário deixa somente o seachButton
function addCleanButton() {
  input.addEventListener(
    "input",
    () =>
      (cleanButton.style.display =
        input.value.trim() !== "" ? "inline-block" : "none")
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
      Swal.fire({
        icon: "warning",
        iconColor: "#2a2141",
        confirmButtonColor: "#2a2141",
        title:
          "Parece que você esqueceu de informar qual álbum está buscando...",
        text: "Por favor, digite o nome do álbum desejado.",
      });
    }

    try {
      //Fazendo fetch (axios.get)
      const response = await axios.get(
        `http://localhost:3000/get-artist?q=${encodeURIComponent(inputValue)}`
      );

      //Acessando data(object)/artists(object)/items[array] -> Disponibilizados pela API (Spotify)
      const data = response.data.artists.items[0];
      console.log(data);

      //Acessando <div> (artist-infos-1)
      const artistInfos1 = document.getElementById("artist-infos-1");
      //Adicionando as informações(vindas da API) no HTML
      artistInfos1.innerHTML = `
          <a id="artist-cover-image" href="${
            data.images[0].url
          }" target="blank_">
            <img src="${
              data.images.length === 0
                ? "../images/logo-name-project.png"
                : data.images[0].url
            }" style="border-radius: 100%; width: 170px;" class="hover"/>
          </a>
          <div id="artist-info-container">
            <div id="followers-and-popularity">
              <div id="followers">
                <p>${data.followers.total}</p>
                <p>Seguidores</p>
              </div>
              <div id="popuparity">
                <p>${data.popularity}</p>
                <p>Popularidade</p>
              </div>
            </div>
            <div id="view-artist">
              <a href="${
                data.external_urls.spotify
              }" target="blank_">Visualizar artista</a>
            </div>
          </div>
      `;

      //Criando array vazio
      const arr = [];
      //Criando loop para pegar os dados(vindos da API) e adicionando dentro do arr(vazio)
      for (let genre of data.genres) {
        arr.push(genre);
      }

      //Acessando a <div> (artist-infos-2)
      const artistInfos2 = document.getElementById("artist-infos-2");
      //Adicionando as informações(vindas da API) no HTML
      artistInfos2.innerHTML = `
          <a href="${
            data.external_urls.spotify
          }" target="blank_" id="artist-name">${data.name}</a>
          <p id="artist-genre">${arr.join(", ").toUpperCase()}</p>
      `;
    } catch (error) {
      console.log(error);
    }
  });
}
fetchAndDisplayArtistInfo();
