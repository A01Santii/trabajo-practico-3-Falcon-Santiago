
// Variables globales
let currentPage = 1;
let isLoading = false;

// URL base
const BASE_URL = "https://dragonball-api.com/api/characters";

// Elementos del DOM
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const charactersContainer = document.getElementById("charactersContainer");
const messageContainer = document.getElementById("messageContainer");

// Función para mostrar mensajes
function showMessage(message) {
  messageContainer.textContent = message;
}

// Spinner
function toggleLoader(show) {
  const loader = document.getElementById("loaderContainer");
  if (loader) {
    loader.classList.toggle("d-none", !show);
  }
}

// Limpiar resultados
function clearResults() {
  messageContainer.textContent = "";
  charactersContainer.innerHTML = "";
  currentPage = 1;
}

// Renderizar tarjetas de personajes
function renderCharacters(characters) {
  characters.forEach(character => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    const card = document.createElement("div");
    card.className = "card h-100 shadow";

    const img = document.createElement("img");
    img.src = character.image;
    img.alt = character.name;
    img.className = "card-img-top";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerHTML = `
      <h5 class="card-title">${character.name}</h5>
      <p class="card-text"><strong>Raza:</strong> ${character.race}</p>
      <p class="card-text"><strong>Género:</strong> ${character.gender}</p>
    `;

    // Mostrar modal con más detalles
    card.addEventListener("click", () => {
      showCharacterModal(character);
    });

    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
    charactersContainer.appendChild(col);
  });
}

// Modal de detalles
function showCharacterModal(character) {
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  modalTitle.textContent = character.name;
  modalBody.innerHTML = `
    <img src="${character.image}" class="img-fluid mb-3" alt="${character.name}">
    <p><strong>Raza:</strong> ${character.race}</p>
    <p><strong>Género:</strong> ${character.gender}</p>
    <p><strong>Ki:</strong> ${character.ki}</p>
    <p><strong>Descripción:</strong> ${character.description || "No disponible"}</p>
  `;

  const modal = new bootstrap.Modal(document.getElementById("characterModal"));
  modal.show();
}

// Buscar personajes por nombre
async function fetchCharactersByName(name) {
  clearResults();
  toggleLoader(true);
  isLoading = true;

  try {
    const response = await fetch(`${BASE_URL}?name=${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error("Error al buscar en la API");

    const data = await response.json();

    // NOTA: búsqueda devuelve directamente un array, no tiene "items"
    if (!data || data.length === 0) {
      showMessage("❌ No se encontraron personajes.");
    } else {
      renderCharacters(data);
    }
  } catch (error) {
    showMessage("❌ Error: " + error.message);
  }

  toggleLoader(false);
  isLoading = false;
}

// Cargar personajes por página (scroll infinito)
async function loadCharactersByPage(page) {
  if (isLoading) return;
  isLoading = true;
  toggleLoader(true);

  try {
    const response = await fetch(`${BASE_URL}?page=${page}`);
    if (!response.ok) throw new Error("Error al cargar personajes");

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      renderCharacters(data.items);
      currentPage++;
    } else {
      showMessage("No hay más personajes.");
    }
  } catch (error) {
    showMessage("❌ Error al cargar personajes.");
  }

  toggleLoader(false);
  isLoading = false;
}

// Evento al buscar
searchButton.addEventListener("click", () => {
  const name = searchInput.value.trim();
  if (!name) {
    showMessage("⚠️ Escribí un nombre para buscar.");
    return;
  }
  fetchCharactersByName(name);
});

// Cargar personajes al inicio
window.addEventListener("load", () => {
  loadCharactersByPage(currentPage);
});

// Scroll infinito
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadCharactersByPage(currentPage);
  }
});


//Profe, le juro que con la compu que tengo ahora voy a ponerme a la par de todo, o sino nos vemos el año que viene :D