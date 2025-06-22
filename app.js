/* =================== app.js =================== */

import { podcasts, genres, seasons } from './data.js';

/**
 * Get podcasts filtered by selected genre and sorted by selected order.
 * @returns {Array} - Filtered and sorted podcasts array.
 */
function getFilteredPodcasts() {
  let filteredPodcasts = [...podcasts];
  if (selectedGenre !== 'all') {
    filteredPodcasts = filteredPodcasts.filter(podcast => 
      podcast.genres.includes(Number(selectedGenre))
    );
  }
  if (sortOrder === 'most-recent') {
    filteredPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  } else if (sortOrder === 'oldest') {
    filteredPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
  }
  return filteredPodcasts;
}

/**
 * Render podcast previews in the container.
 * @param {Array} podcasts - Array of podcast objects to display.
 */
function renderPodcasts(podcasts) {
  podcastContainer.innerHTML = '';
  podcasts.forEach(podcast => {
    const preview = document.createElement('div');
    preview.classList.add('podcast');
    preview.dataset.id = podcast.id;
    const genreNames = podcast.genres.map(id => genres.find(g => g.id === id).title).join(', ');
    const updatedDate = new Date(podcast.updated).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    preview.innerHTML = `
      <img src="${podcast.image}" alt="${podcast.title}">
      <h3>${podcast.title}</h3>
      <p>Seasons: ${podcast.seasons}</p>
      <p>Genres: ${genreNames}</p>
      <p>Updated: ${updatedDate}</p>
    `;
    podcastContainer.appendChild(preview);
  });
}

/**
 * Render podcasts based on current filters.
 */
function renderFilteredPodcasts() {
  const filtered = getFilteredPodcasts();
  renderPodcasts(filtered);
}

/**
 * Opens the modal and displays full podcast details.
 * @param {string|number} podcastId - ID of the podcast to show.
 */
function openModal(podcastId) {
  const podcast = podcasts.find(p => p.id === podcastId);
  if (!podcast) return;
  const seasonDetails = seasons.find(s => s.id === podcastId).seasonDetails;
  const genreNames = podcast.genres.map(id => genres.find(g => g.id === id).title);

  modalTitle.textContent = podcast.title;
  modalImage.src = podcast.image;
  modalImage.alt = podcast.title;
  modalDescription.textContent = podcast.description;
  modalGenres.innerHTML = genreNames.map(name => `<span class="genre-tag">${name}</span>`).join(' ');
  modalUpdated.textContent = new Date(podcast.updated).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  modalSeasonsList.innerHTML = '';
  seasonDetails.forEach(season => {
    const seasonDiv = document.createElement('div');
    seasonDiv.classList.add('season');
    seasonDiv.innerHTML = `<span>${season.title}</span><span>${season.episodes} episodes</span>`;
    modalSeasonsList.appendChild(seasonDiv);
  });

  modal.classList.remove('hidden');
}

/**
 * Closes the modal.
 */
function closeModal() {
  modal.classList.add('hidden');
}

// DOM Elements
const podcastContainer = document.getElementById('podcast-container');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const modalGenres = document.getElementById('modal-genres');
const modalUpdated = document.getElementById('modal-updated');
const modalSeasonsList = document.getElementById('modal-seasons-list');
const genreFilter = document.getElementById('genre-filter');
const sortFilter = document.getElementById('sort-filter');

// State
let selectedGenre = 'all';
let sortOrder = 'most-recent';

// Initialize genre options
const allGenresOption = document.createElement('option');
allGenresOption.value = 'all';
allGenresOption.textContent = 'ALL GENRES';
genreFilter.appendChild(allGenresOption);

genres.forEach(genre => {
  const option = document.createElement('option');
  option.value = genre.id;
  option.textContent = genre.title;
  genreFilter.appendChild(option);
});

// Filter and sort listeners
genreFilter.addEventListener('change', () => {
  selectedGenre = genreFilter.value;
  renderFilteredPodcasts();
});

sortFilter.addEventListener('change', () => {
  sortOrder = sortFilter.value;
  renderFilteredPodcasts();
});

// Modal listeners
podcastContainer.addEventListener('click', (e) => {
  const preview = e.target.closest('.podcast');
  if (preview) {
    const id = preview.dataset.id;
    openModal(id);
  }
});

closeModalButton.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Initial render
renderFilteredPodcasts();
