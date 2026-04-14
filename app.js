// Configuration
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsqufLsDV09SAsWae264dS2GwVSCmgNSHVLvGyNfy2hL5_AQ70-x-gPg0B0AjsZ3a0y5evFiUmS-7D/pub?output=csv';
const STORAGE_KEY = 'jl_garden';
const SPELLS_CACHE_KEY = 'jl_spells_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// State
let spellsData = {};
let garden = [];
let currentFlowerIndex = null;

// Initialize
async function init() {
  loadGarden();
  await loadSpells();
  renderGarden();
  registerServiceWorker();
}

// Load garden from localStorage
function loadGarden() {
  try {
    garden = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    console.error('Failed to load garden:', e);
    garden = [];
  }
}

// Save garden to localStorage
function saveGarden() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(garden));
  } catch (e) {
    console.error('Failed to save garden:', e);
    showToast('Failed to save. Please check storage.');
  }
}

// Load spells from Google Sheets CSV
async function loadSpells() {
  // Try to load from cache first
  const cached = getCachedSpells();
  if (cached) {
    spellsData = cached;
    return;
  }

  // Fetch from Google Sheets
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch spells');
    
    const csvText = await response.text();
    spellsData = parseCSV(csvText);
    
    // Cache the data
    cacheSpells(spellsData);
  } catch (error) {
    console.error('Failed to load spells:', error);
    showToast('Failed to load spells. Using defaults.');
    spellsData = getDefaultSpells();
  }
}

// Parse CSV to spells object
function parseCSV(csvText) {
  // Remove any BOM and normalize line endings
  csvText = csvText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  const lines = [];
  let currentLine = '';
  let inQuotes = false;
  
  // Handle multi-line fields properly
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if (char === '\n' && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  
  // Add last line
  if (currentLine.trim()) {
    lines.push(currentLine);
  }
  
  const spells = {};
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (handle quoted fields)
    const fields = parseCSVLine(line);
    if (fields.length < 3) continue;
    
    const [spell, flowerLabel, flowerImageUrl, videoTitle] = fields;
    
    if (spell && flowerImageUrl) {
      spells[spell.toLowerCase().trim()] = {
        label: flowerLabel.trim(),
        imageUrl: flowerImageUrl.trim(),
        videoTitle: videoTitle ? videoTitle.trim() : ''
      };
    }
  }
  
  return spells;
}

// Parse a single CSV line (handles quoted fields with commas and newlines)
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  fields.push(current.trim());
  return fields;
}

// Cache spells data
function cacheSpells(data) {
  try {
    const cache = {
      data: data,
      timestamp: Date.now()
    };
    localStorage.setItem(SPELLS_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to cache spells:', e);
  }
}

// Get cached spells if valid
function getCachedSpells() {
  try {
    const cached = localStorage.getItem(SPELLS_CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    if (age < CACHE_DURATION) {
      return data;
    }
  } catch (e) {
    console.error('Failed to read cache:', e);
  }
  
  return null;
}

// Default spells (fallback)
function getDefaultSpells() {
  return {
    "first step taken": {
      label: "first step",
      imageUrl: "https://via.placeholder.com/80/e8c4d4/C8394A?text=🌸",
      videoTitle: "Getting Started with Focus"
    },
    "the spell is cast": {
      label: "spell cast",
      imageUrl: "https://via.placeholder.com/80/c4c4e8/534AB7?text=🌸",
      videoTitle: "Deep Work Session"
    },
    "the night was mine": {
      label: "night owl",
      imageUrl: "https://via.placeholder.com/80/c4d4e8/185FA5?text=🌸",
      videoTitle: "Night Focus Music"
    }
  };
}

// Get spell data
function getSpellData(spell) {
  const key = spell.toLowerCase().trim();
  return spellsData[key] || null;
}

// Get flower image HTML
function getFlowerImage(spell, size = 60) {
  const data = getSpellData(spell);
  if (!data || !data.imageUrl) return '';
  
  return `<img src="${escapeHtml(data.imageUrl)}" alt="${escapeHtml(data.label)}" width="${size}" height="${size}" style="object-fit: contain; border-radius: 4px;" loading="lazy" />`;
}

// Render garden
function renderGarden() {
  const gardenEl = document.getElementById('garden');
  const countBadge = document.getElementById('countBadge');
  
  if (countBadge) {
    countBadge.textContent = garden.length;
  }
  
  const slots = Math.max(8, garden.length + 4);
  let html = '';
  
  for (let i = 0; i < slots; i++) {
    const flower = garden[i];
    
    if (flower) {
      const data = getSpellData(flower.spell);
      const label = data ? data.label : 'bloom';
      
      html += `
        <div class="flower-slot">
          <div class="flower-pot" onclick="openFlowerModal(${i})">
            ${getFlowerImage(flower.spell)}
          </div>
          <div class="flower-name">${escapeHtml(label)}</div>
          <div class="flower-date">${escapeHtml(flower.date)}</div>
        </div>
      `;
    } else {
      html += `
        <div class="flower-slot">
          <div class="empty-slot"></div>
        </div>
      `;
    }
  }
  
  gardenEl.innerHTML = html;
}

// Claim a flower
function claimFlower() {
  const spellInput = document.getElementById('spellInput');
  const bloomBtn = document.getElementById('bloomBtn');
  
  const spell = spellInput.value.trim();
  
  if (!spell) {
    showToast('enter your spell first');
    return;
  }
  
  // Check if already claimed
  const already = garden.find(f => f.spell.toLowerCase() === spell.toLowerCase());
  if (already) {
    showToast('you already have this flower');
    return;
  }
  
  // Check if spell is valid
  const spellData = getSpellData(spell);
  if (!spellData) {
    showToast('this spell is not recognized');
    return;
  }
  
  // Add flower to garden
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  garden.push({
    spell: spell.toLowerCase(),
    memory: '',
    date: date,
    timestamp: now.getTime()
  });
  
  saveGarden();
  
  // Clear input
  spellInput.value = '';
  
  // Show success
  showToast('a new flower bloomed for you ✨');
  
  // Re-render
  renderGarden();
}

// Open flower detail modal
function openFlowerModal(index) {
  currentFlowerIndex = index;
  const flower = garden[index];
  if (!flower) return;
  
  const data = getSpellData(flower.spell);
  if (!data) return;
  
  // Populate modal
  document.getElementById('modalFlower').innerHTML = `<img src="${escapeHtml(data.imageUrl)}" alt="${escapeHtml(data.label)}" />`;
  document.getElementById('modalDate').textContent = `bloomed on ${flower.date}`;
  const videoText = data.videoTitle ? `through「${data.videoTitle}」` : 'through a June Lorian session';
  document.getElementById('modalVideo').textContent = videoText;
  document.getElementById('modalMemoryInput').value = flower.memory || '';
  
  // Show modal
  const overlay = document.getElementById('modalOverlay');
  overlay.style.display = 'flex';
  setTimeout(() => overlay.classList.add('show'), 10);
  
  // Prevent auto-focus on mobile to avoid keyboard covering the modal
  const memoryInput = document.getElementById('modalMemoryInput');
  memoryInput.blur();
}

// Close modal
function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('show');
  setTimeout(() => {
    overlay.style.display = 'none';
    currentFlowerIndex = null;
  }, 300);
}

// Close modal when clicking overlay
function closeModalOnOverlay(event) {
  if (event.target.id === 'modalOverlay') {
    closeModal();
  }
}

// Save memory from modal
function saveMemory() {
  if (currentFlowerIndex === null) return;
  
  const memory = document.getElementById('modalMemoryInput').value.trim();
  garden[currentFlowerIndex].memory = memory;
  
  saveGarden();
  showToast('memory saved ✨');
  closeModal();
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Register service worker for PWA
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  }
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
  const spellInput = document.getElementById('spellInput');
  
  spellInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      claimFlower();
    }
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});

// Start the app
init();
