//Acessando o <input/> no documento HTML
const input = document.getElementById("input");
//Acessando o <button/> de busca no documento HTML
const searchButton = document.getElementById("search-button");
//Acessando o <button/> de limpar no documento HTML
const cleanButton = document.getElementById("clean-button");

//Iniciando a interface com o button (clean) escondido
cleanButton.style.display = "none";

//Função responsável por fazer a  limpeza do input (caso esteja com algum valor)
function cleanInput(callbackCleanAlbumInfo) {
  cleanButton.addEventListener("click", () => {
    input.value = "";

    cleanButton.style.display = "none";

    callbackCleanAlbumInfo();
  });
}
cleanInput(function cleanAlbumInfo() {
  //Acessando a <div> (main-album-info)
  const mainAlbumInfo = document.getElementById("main-album-info");
  //Limpando informções que estavam renderizadas
  mainAlbumInfo.innerHTML = `
  <a id="main-album-info"><img id="album-cover" src="../images/logo-name-project.png" style="width: 270px"/></a>
  <a id="album-name"></a>
  <a id="album-creator-name"></a> 
  <p id="release-date"></p>
  `;

  //Acessando a <div> (additionalAlbumInfo)
  const additionalAlbumInfo = document.getElementById("additional-album-info");
  //Limpando informções que estavam renderizadas
  additionalAlbumInfo.innerHTML = `
  <p id="total-tracks"></p>
  <a class="hidden" href="" target="blank_"></a> `;
});

//Função responsável por verificar se tem algum valor no input -> Caso tenha, exibe o cleanButton, caso contrário deixa somente o seachButton
function addCleanButton() {
  input.addEventListener(
    "input",
    () =>
      (cleanButton.style.display =
        input.value.trim() !== "block" ? "" : "none")
  );
}
addCleanButton();

//Função responsável pela busca de álbum e manipulação dos dados
function fetchAndDisplayAlbumInfo() {
  //Adicionando evento de click no searchButton - (Passei uma promise como 2º param)
  searchButton.addEventListener("click", async () => {
    //Pegando valor digitado pelo usuário no input -> (Nome do álbum)
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
        `http://localhost:3000/get-album?q=${encodeURIComponent(inputValue)}`
      );
      //Acessando data(object)/albums(object)/items[array] -> Disponibilizados pela API (Spotify)
      const data = response.data.albums.items[0];
      console.log(data);

      //Acessando o array de artistas(criadores) e mapeando os nomes para renderiza-los (Array vindo da API)
      let artist = data.artists.map((names) => names.name).join(", ");
      console.log(artist);

      //Formatando a data para o estilo BR -> (Vem da API ano-mes-dia com a formatação ficará dia/mes/ano)
      const originalDateFormat = data.release_date;
      const day = new Date(originalDateFormat).getDate() + 1;
      const month = new Date(originalDateFormat).getMonth() + 1;
      const year = new Date(originalDateFormat).getFullYear();
      const formattedDate = `${day}/0${month}/${year}`;

      //Acessando a <div> (main-album-info) no HTML
      const mainAlbumInfo = document.getElementById("main-album-info");
      //Adicionando as informações(vindas da API) no HTML
      mainAlbumInfo.innerHTML = `
         <a id="album-cover-image" href="${data.images[0].url}" target="blank_"><img id="album-cover" src="${data.images[0].url}" class="hover"/></a>
          <a id="album-name">${data.name}</a>
          <a id="album-creator-name">${artist}</a> 
          <p id="release-date">${formattedDate}</p>
      `;

      //Acessando a <div> (additional-album-info) no HTML
      const additionalAlbumInfo = document.getElementById(
        "additional-album-info"
      );
      //Adicionando as informações(vindas da API) no HTML
      additionalAlbumInfo.innerHTML = `
      <p id="total-tracks">Total de faixas: ${data.total_tracks}</p>
      <a id="view-album" href="${data.external_urls.spotify}" target="blank_">Visualizar álbum</a>
      `;
    } catch (error) {
      console.log(error);
    }
  });
}
fetchAndDisplayAlbumInfo();
