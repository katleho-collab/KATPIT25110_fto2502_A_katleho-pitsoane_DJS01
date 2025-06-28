/**
 * Get filtered and sorted list of podcasts.
 * @param {Array} podcasts 
 * @param {Array} genres 
 * @param {string} selectedGenre 
 * @param {string} sortOrder 
 * @returns {Array}
 */
export function getFilteredPodcasts(podcasts, genres, selectedGenre, sortOrder) {
  let filtered = [...podcasts];
  if (selectedGenre !== 'all') {
    filtered = filtered.filter(p => p.genres.includes(Number(selectedGenre)));
  }
  filtered.sort((a, b) =>
    sortOrder === 'most-recent'
      ? new Date(b.updated) - new Date(a.updated)
      : new Date(a.updated) - new Date(b.updated)
  );
  return filtered;
}

/**
 * Render podcasts to the DOM
 * @param {Array} podcasts 
 */
export function renderPodcasts(podcasts) {
  const container = document.getElementById('podcast-container');
  container.innerHTML = '';
  podcasts.forEach(podcast => {
    const div = document.createElement('div');
    div.className = 'podcast';
    div.dataset.id = podcast.id;
    const genresText = podcast.genres.map(id => window.genres.find(g => g.id === id).title).join(', ');
    const updated = new Date(podcast.updated).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    div.innerHTML = `
      <img src="${podcast.image}" alt="${podcast.title}">
      <h3>${podcast.title}</h3>
      <p>Seasons: ${podcast.seasons}</p>
      <p>Genres: ${genresText}</p>
      <p>Updated: ${updated}</p>
    `;
    container.appendChild(div);
  });
}
