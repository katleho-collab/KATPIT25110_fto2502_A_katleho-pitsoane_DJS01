/**
 * Open modal with podcast details
 * @param {string|number} podcastId 
 * @param {Array} podcasts 
 * @param {Array} genres 
 * @param {Array} seasons 
 */
export function openModal(podcastId, podcasts, genres, seasons) {
  const modal = document.getElementById('modal');
  const podcast = podcasts.find(p => p.id === podcastId);
  const seasonInfo = seasons.find(s => s.id === podcastId);
  if (!podcast || !seasonInfo) return;

  document.getElementById('modal-title').textContent = podcast.title;
  document.getElementById('modal-image').src = podcast.image;
  document.getElementById('modal-description').textContent = podcast.description;

  const genreTags = podcast.genres.map(id => genres.find(g => g.id === id).title)
    .map(name => `<span class="genre-tag">${name}</span>`).join(' ');
  document.getElementById('modal-genres').innerHTML = genreTags;

  document.getElementById('modal-updated').textContent = new Date(podcast.updated).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const list = document.getElementById('modal-seasons-list');
  list.innerHTML = '';
  seasonInfo.seasonDetails.forEach((season, index) => {
    const div = document.createElement('div');
    div.className = 'season';
    div.innerHTML = `<span>Season ${index + 1}: ${season.title}</span><span>${season.episodes} episodes</span>`;
    list.appendChild(div);
  });

  modal.classList.remove('hidden');
}

/** Close modal */
export function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}
