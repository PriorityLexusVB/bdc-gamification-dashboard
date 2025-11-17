/**
 * GRIDLOCK - BDC Gamification Dashboard
 * Main Application Logic
 * 
 * NOTE: This is a minimal implementation to make the UI interactive.
 * A full implementation would require:
 * - Backend API integration
 * - Database for persistence
 * - Authentication system
 * - Real-time updates
 * - WebSocket connections
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  currentUser: null,
  currentScreen: 'main-garage',
  currentShopTab: 'cars',
  points: 0,
  multiplier: 1.0,
  inventory: [],
  achievements: [],
  leaderboard: [],
  activityFeed: [],
  shopItems: {
    cars: [],
    performance: [],
    visuals: [],
    garage: []
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🏁 GRIDLOCK initializing...');
  initializeParticles();
  loadMockData();
  console.log('✅ GRIDLOCK ready (mock mode)');
});

// ============================================================================
// AUTHENTICATION
// ============================================================================

window.handleLogin = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!email || !password) {
    showNotification('Please enter email and password', 'error');
    return;
  }
  
  // Mock authentication - in real app, this would call an API
  console.log('🔐 Authenticating:', email);
  
  // Show loading
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('loading-view').classList.remove('hidden');
  
  // Simulate API call
  setTimeout(() => {
    // Create or load user
    state.currentUser = {
      email: email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      avatar: `https://i.pravatar.cc/80?u=${email}`,
      joinedDate: new Date().toISOString()
    };
    
    // Initialize user data
    state.points = Math.floor(Math.random() * 5000);
    state.multiplier = 1.0 + (Math.random() * 2);
    
    // Hide login overlay
    document.getElementById('login-overlay').classList.remove('active');
    
    // Show main garage
    switchScreen('main-garage');
    
    // Update UI
    updateUserProfile();
    generateLeaderboard();
    generateActivityFeed();
    loadShopItems();
    loadAchievements();
    
    showNotification('Welcome to GRIDLOCK! 🏁', 'success');
  }, 1500);
};

window.handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    state.currentUser = null;
    state.points = 0;
    state.multiplier = 1.0;
    state.inventory = [];
    
    // Show login overlay
    document.getElementById('login-overlay').classList.add('active');
    document.getElementById('login-view').classList.remove('hidden');
    document.getElementById('loading-view').classList.add('hidden');
    
    // Clear inputs
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    
    showNotification('Logged out successfully', 'info');
  }
};

// ============================================================================
// SCREEN NAVIGATION
// ============================================================================

window.switchScreen = (screenName) => {
  console.log('📱 Switching to screen:', screenName);
  
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenName);
  if (targetScreen) {
    targetScreen.classList.add('active');
    state.currentScreen = screenName;
  }
};

// ============================================================================
// SHOP SYSTEM
// ============================================================================

window.switchShopTab = (tabName) => {
  console.log('🛒 Switching to shop tab:', tabName);
  
  // Update tab buttons
  document.querySelectorAll('.shop-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update content sections
  document.querySelectorAll('.shop-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const targetContent = document.getElementById(`shop-content-${tabName}`);
  if (targetContent) {
    targetContent.classList.add('active');
    state.currentShopTab = tabName;
  }
};

function loadShopItems() {
  // Mock shop items
  const categories = ['cars', 'performance', 'visuals', 'garage'];
  
  categories.forEach(category => {
    const container = document.getElementById(`shop-content-${category}`);
    if (!container) return;
    
    const items = generateMockShopItems(category);
    container.innerHTML = items.map(item => createShopItemCard(item)).join('');
  });
}

function generateMockShopItems(category) {
  const itemsByCategory = {
    cars: [
      { name: 'Lexus IS 350', price: 0, owned: true, active: true, locked: false, rarity: 'common' },
      { name: 'Lexus RC F', price: 5000, owned: false, active: false, locked: false, rarity: 'rare' },
      { name: 'Lexus LC 500', price: 10000, owned: false, active: false, locked: false, rarity: 'epic' },
      { name: 'Lexus LFA', price: 50000, owned: false, active: false, locked: true, rarity: 'legendary' }
    ],
    performance: [
      { name: '2x Points Boost', price: 2000, owned: false, active: false, locked: false, rarity: 'rare' },
      { name: '3x Weekend Multiplier', price: 5000, owned: false, active: false, locked: false, rarity: 'epic' },
      { name: 'Auto-Pilot (Passive Points)', price: 10000, owned: false, active: false, locked: true, rarity: 'legendary' }
    ],
    visuals: [
      { name: 'Neon Underglow', price: 500, owned: true, active: true, locked: false, rarity: 'common' },
      { name: 'Chrome Wrap', price: 2000, owned: false, active: false, locked: false, rarity: 'rare' },
      { name: 'Holographic Paint', price: 5000, owned: false, active: false, locked: false, rarity: 'epic' },
      { name: 'Animated Particles', price: 8000, owned: false, active: false, locked: false, rarity: 'legendary' }
    ],
    garage: [
      { name: 'Basic Garage', price: 0, owned: true, active: true, locked: false, rarity: 'common' },
      { name: 'Neon Showroom', price: 3000, owned: false, active: false, locked: false, rarity: 'rare' },
      { name: 'Cyberpunk Theme', price: 7000, owned: false, active: false, locked: false, rarity: 'epic' },
      { name: 'Space Station', price: 15000, owned: false, active: false, locked: true, rarity: 'legendary' }
    ]
  };
  
  return itemsByCategory[category] || [];
}

function createShopItemCard(item) {
  const rarityColors = {
    common: 'gray-500',
    rare: 'blue-500',
    epic: 'purple-500',
    legendary: 'yellow-500'
  };
  
  const statusClasses = `${item.locked ? 'locked' : ''} ${item.owned ? 'owned' : ''} ${item.active ? 'active-item' : ''}`;
  const borderColor = rarityColors[item.rarity] || 'gray-500';
  
  return `
    <div class="item-card glass-ui rounded-lg p-4 border-2 border-${borderColor} ${statusClasses} hover:scale-105 transition-transform">
      <h3 class="text-lg font-bold mb-2">${item.name}</h3>
      <div class="flex items-center justify-between">
        <span class="text-${rarityColors[item.rarity]} uppercase text-xs font-bold">${item.rarity}</span>
        <span class="text-yellow-400 font-bold">⭐ ${item.price}</span>
      </div>
      ${item.owned ? '<p class="text-green-400 text-xs mt-2">✓ Owned</p>' : ''}
      ${item.active ? '<p class="text-purple-400 text-xs mt-2">★ Active</p>' : ''}
      ${item.locked ? '<p class="text-red-400 text-xs mt-2">🔒 Locked</p>' : ''}
      ${!item.owned && !item.locked ? `<button class="mt-3 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm" onclick="purchaseItem('${item.name}', ${item.price})">Purchase</button>` : ''}
    </div>
  `;
}

window.purchaseItem = (itemName, price) => {
  if (state.points >= price) {
    state.points -= price;
    updateUserProfile();
    showNotification(`Purchased ${itemName}! 🎉`, 'success');
    loadShopItems(); // Refresh shop
  } else {
    showNotification(`Not enough points! Need ${price - state.points} more.`, 'error');
  }
};

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

function loadAchievements() {
  const achievements = [
    { name: 'First Login', description: 'Log in for the first time', unlocked: true, icon: '🎯', rarity: 'common' },
    { name: 'Century Club', description: 'Earn 100 points', unlocked: state.points >= 100, icon: '💯', rarity: 'rare' },
    { name: 'Millionaire', description: 'Earn 1,000 points', unlocked: state.points >= 1000, icon: '💰', rarity: 'epic' },
    { name: 'Legend', description: 'Reach #1 on leaderboard', unlocked: false, icon: '👑', rarity: 'legendary' },
    { name: 'Speed Demon', description: 'Complete 10 tasks in one day', unlocked: false, icon: '⚡', rarity: 'epic' },
    { name: 'Team Player', description: 'Help 5 colleagues', unlocked: false, icon: '🤝', rarity: 'rare' }
  ];
  
  const container = document.getElementById('achievement-grid');
  if (!container) return;
  
  container.innerHTML = achievements.map(achievement => `
    <div class="achievement-card glass-ui rounded-lg p-6 border-2 ${achievement.unlocked ? 'unlocked border-yellow-400' : 'locked border-gray-700'}">
      <div class="text-4xl mb-3">${achievement.icon}</div>
      <h3 class="text-lg font-bold mb-2">${achievement.name}</h3>
      <p class="text-sm text-gray-400">${achievement.description}</p>
      <span class="inline-block mt-3 px-3 py-1 rounded-full text-xs badge-${achievement.rarity === 'legendary' ? 'holographic' : achievement.rarity === 'epic' ? 'gold' : 'silver'}">
        ${achievement.rarity.toUpperCase()}
      </span>
    </div>
  `).join('');
}

// ============================================================================
// LEADERBOARD
// ============================================================================

function generateLeaderboard() {
  const mockUsers = [
    { name: state.currentUser?.name || 'You', points: state.points, avatar: state.currentUser?.avatar },
    { name: 'Sarah Chen', points: 4750, avatar: 'https://i.pravatar.cc/80?u=sarah' },
    { name: 'Mike Johnson', points: 4200, avatar: 'https://i.pravatar.cc/80?u=mike' },
    { name: 'Emma Davis', points: 3890, avatar: 'https://i.pravatar.cc/80?u=emma' },
    { name: 'James Wilson', points: 3456, avatar: 'https://i.pravatar.cc/80?u=james' }
  ].sort((a, b) => b.points - a.points);
  
  const container = document.getElementById('leaderboard');
  if (!container) return;
  
  container.innerHTML = mockUsers.map((user, index) => `
    <li class="flex items-center space-x-3 p-3 glass-ui rounded-lg hover:bg-purple-500/20 transition-all cursor-pointer" onclick="inspectPlayer('${user.name}')">
      <span class="text-2xl font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-500'}">#${index + 1}</span>
      <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full">
      <div class="flex-1">
        <p class="font-semibold text-sm">${user.name}</p>
        <p class="text-xs text-gray-400">${user.points.toLocaleString()} pts</p>
      </div>
    </li>
  `).join('');
}

// ============================================================================
// ACTIVITY FEED
// ============================================================================

function generateActivityFeed() {
  const activities = [
    { user: 'Sarah Chen', action: 'unlocked', item: 'Lexus RC F', icon: '🚗', time: '2m ago' },
    { user: 'Mike Johnson', action: 'earned', item: '500 points', icon: '⭐', time: '5m ago' },
    { user: state.currentUser?.name || 'You', action: 'achieved', item: 'First Login', icon: '🏆', time: 'Just now' },
    { user: 'Emma Davis', action: 'purchased', item: 'Chrome Wrap', icon: '🎨', time: '12m ago' },
    { user: 'James Wilson', action: 'reached', item: '#3 on leaderboard', icon: '📊', time: '15m ago' }
  ];
  
  const container = document.getElementById('live-feed');
  if (!container) return;
  
  container.innerHTML = activities.map(activity => `
    <div class="feed-item glass-ui p-3 rounded-lg text-sm">
      <div class="flex items-start space-x-2">
        <span class="text-xl">${activity.icon}</span>
        <div>
          <p><span class="font-semibold text-purple-400">${activity.user}</span> ${activity.action} <span class="text-cyan-400">${activity.item}</span></p>
          <p class="text-xs text-gray-500 mt-1">${activity.time}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================================================
// PLAYER INSPECTOR
// ============================================================================

window.inspectPlayer = (playerName) => {
  const modal = document.getElementById('player-inspector-modal');
  const content = document.getElementById('inspector-content');
  
  content.innerHTML = `
    <h2 class="text-3xl font-bold text-glow-purple mb-6">${playerName}</h2>
    <div class="space-y-4">
      <div class="flex justify-between">
        <span class="text-gray-400">Total Points:</span>
        <span class="font-bold text-yellow-400">${Math.floor(Math.random() * 5000)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Rank:</span>
        <span class="font-bold">#${Math.floor(Math.random() * 10) + 1}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Achievements:</span>
        <span class="font-bold">${Math.floor(Math.random() * 15)} / 50</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Current Streak:</span>
        <span class="font-bold text-cyan-400">${Math.floor(Math.random() * 30)} days</span>
      </div>
      <div class="mt-6 pt-6 border-t border-gray-700">
        <h3 class="font-semibold mb-3">Recent Achievements</h3>
        <div class="space-y-2">
          <div class="text-sm">🏆 Century Club</div>
          <div class="text-sm">⚡ Speed Demon</div>
          <div class="text-sm">🤝 Team Player</div>
        </div>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
};

window.closeInspector = () => {
  document.getElementById('player-inspector-modal').classList.remove('active');
};

// ============================================================================
// UI UPDATES
// ============================================================================

function updateUserProfile() {
  document.getElementById('user-name').textContent = state.currentUser?.name || 'Guest';
  document.getElementById('user-avatar').src = state.currentUser?.avatar || 'https://i.pravatar.cc/80?u=guest';
  document.getElementById('points-counter').textContent = state.points.toLocaleString();
  document.getElementById('multiplier-display').textContent = `${state.multiplier.toFixed(1)}x Multiplier`;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  const text = document.getElementById('notification-text');
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };
  
  text.textContent = `${icons[type] || icons.info} ${message}`;
  notification.style.opacity = '1';
  notification.style.visibility = 'visible';
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.visibility = 'hidden';
  }, 3000);
}

// ============================================================================
// PARTICLE ANIMATION
// ============================================================================

function initializeParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ============================================================================
// MOCK DATA LOADER
// ============================================================================

function loadMockData() {
  console.log('📦 Loading mock data...');
  // In a real app, this would fetch from an API
  // For now, data is generated on-demand
}

// ============================================================================
// CONSOLE GREETING
// ============================================================================

console.log(`
%c🏁 GRIDLOCK - BDC Gamification Dashboard
%cVersion: 0.1.0 (Mock Mode)
%c
⚠️  This is a demo version with mock data.
📝 For production use, implement:
   - Real authentication system
   - Backend API integration  
   - Database persistence
   - Real-time updates
   - WebSocket connections
`,
'color: #a855f7; font-size: 20px; font-weight: bold;',
'color: #22d3ee; font-size: 12px;',
'color: #fde047; font-size: 11px;'
);
