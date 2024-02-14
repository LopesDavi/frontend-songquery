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
cleanInput(
  //Passei essa função como callback
  //Função responsável por limpar todas informações (se caso tiver) exibidas na tela
  function cleanAlbumInfo() {
  //Acessando a <div> (user-response)
  const userResponse = document.getElementById("user-response");
  //Limpando informções que estavam renderizadas
  userResponse.innerHTML = `
   <img src="../assets/images/logo-name-project.png"/>
  `;
});

//Função responsável por verificar se tem algum valor no input -> Caso tenha, exibe o cleanButton, caso contrário deixa somente o seachButton
function addCleanButton() {
  input.addEventListener("input", () =>
      (cleanButton.style.display = input.value.trim() !== "" ? "flex" : "none")
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
        title: "Digite o nome do álbum desejado",
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
        `http://localhost:3000/get-album?q=${encodeURIComponent(inputValue)}`
      );
      //Acessando data(object)/albums(object)/items[array] -> Disponibilizados pela API (Spotify)
      const data = response.data.albums.items[0];
      // console.log(data);

      //Acessando o array de artistas(criadores) e mapeando os nomes para renderiza-los (Array vindo da API)
      let artist = data.artists.map((names) => names.name).join(", ");

      //Formatando a data para o estilo BR -> (Vem da API ano-mes-dia com a formatação ficará dia/mes/ano)
      const originalDateFormat = data.release_date;
      const day = new Date(originalDateFormat).getDate() + 1;
      const month = new Date(originalDateFormat).getMonth() + 1;
      const year = new Date(originalDateFormat).getFullYear();
      const formattedDate = `${day}/0${month}/${year}`;

      //Acessando a <div> (user-response) no HTML
      const userResponse = document.getElementById("user-response");
      //Adicionando as informações(vindas da API) no HTML
      userResponse.innerHTML = `
          <ul id="main-album-info">
            <li>
             <a href="${data.images[0].url}" target="blank_">
             <img src="${data.images[0].url}" class="hover"/>
             </a>
            </li>
            <li>
             <a>${data.name}</a>
            </li>
            <li>
             <a>${artist}</a> 
            </li>
            <li>
             <p>${formattedDate}</p>
            </li>
          </ul>

        <div id="additional-album-info">
         <ul>
           <li>
             <p>Total de faixas: ${data.total_tracks}</p>
           </li>
           <li>
             <a href="${data.external_urls.spotify}" target="blank_">Visualizar álbum</a>
           </li>
         </ul>
        </div>
      `;
    } catch (error) {
      console.log(error);
    }
  });
}
fetchAndDisplayAlbumInfo();
