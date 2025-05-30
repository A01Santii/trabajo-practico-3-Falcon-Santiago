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

// Evento para buscar
searchButton.addEventListener("click", () => {
    const name = searchInput.value.trim();

    if (!name) {
    showMessage("⚠️ Escribí un nombre para buscar.");
    return;
    }

    fetchCharactersByName(name);
});

// Mostrar mensajes
function showMessage(message) {
    messageContainer.textContent = message;
}

// Limpiar resultados
function clearResults() {
    messageContainer.textContent = "";
    charactersContainer.innerHTML = "";
}

// Buscar personaje por nombre
async function fetchCharactersByName(name) {
    clearResults();

    try {
    const response = await fetch(`${BASE_URL}?name=${encodeURIComponent(name)}`);

    if (!response.ok) throw new Error("Error al consultar la API");

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        showMessage("❌ No se encontraron personajes.");
        return;
    }

    renderCharacters(data.items);
    } catch (error) {
    showMessage("❌ Error: " + error.message);
    }
}

// Mostrar tarjetas
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

    // Al hacer clic, mostrar modal
    card.addEventListener("click", () => {
        showCharacterModal(character);
    });

    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
    charactersContainer.appendChild(col);
    });
}

// Mostrar modal
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

// Mostrar u ocultar el spinner
function toggleLoader(show) {
    const loader = document.getElementById("loaderContainer");
    loader.classList.toggle("d-none", !show);
}

// Cargar personajes de una página
async function loadCharactersByPage(page) {
    if (isLoading) return;
    isLoading = true;
    toggleLoader(true);

    try {
    const response = await fetch(`${BASE_URL}?page=${page}`);
    if (!response.ok) throw new Error("No se pudo cargar la página.");

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
