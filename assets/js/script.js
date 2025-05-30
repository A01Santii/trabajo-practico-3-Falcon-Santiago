// URL base de la API
const BASE_URL = "https://dragonball-api.com/api/characters";

// Elementos del DOM
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const charactersContainer = document.getElementById("charactersContainer");
const messageContainer = document.getElementById("messageContainer");

// Evento al hacer clic en el botón de búsqueda
searchButton.addEventListener("click", () => {
  const name = searchInput.value.trim();
  if (!name) {
    showMessage("Por favor, escribe un nombre para buscar.");
    return;
  }
  fetchCharactersByName(name);
});

// Mostrar mensajes de error o información
function showMessage(message) {
  messageContainer.textContent = message;
}

// Limpiar resultados anteriores
function clearResults() {
  charactersContainer.innerHTML = "";
  messageContainer.textContent = "";
}

// Función principal: buscar personajes por nombre
async function fetchCharactersByName(name) {
  clearResults();
  try {
    const response = await fetch(`${BASE_URL}?name=${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error("Error al consultar la API.");
    
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      showMessage("No se encontraron personajes con ese nombre.");
      return;
    }

    renderCharacters(data.items);
  } catch (error) {
    showMessage("Ocurrió un error: " + error.message);
  }
}

// Renderizar las tarjetas de los personajes
function renderCharacters(characters) {
  characters.forEach(character => {
    // Creamos una columna de Bootstrap
    const col = document.createElement("div");
    col.className = "col-md-4";

    // Tarjeta
    const card = document.createElement("div");
    card.className = "card h-100 shadow";

    // Imagen
    const img = document.createElement("img");
    img.src = character.image;
    img.className = "card-img-top";
    img.alt = character.name;

    // Cuerpo de la tarjeta
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    cardBody.innerHTML = `
      <h5 class="card-title">${character.name}</h5>
      <p class="card-text"><strong>Raza:</strong> ${character.race}</p>
      <p class="card-text"><strong>Género:</strong> ${character.gender}</p>
    `;

    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
    charactersContainer.appendChild(col);
  });
}
