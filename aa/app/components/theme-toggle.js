// Theme Toggle Component
class ThemeToggle {
  constructor() {
    this.themes = [
      { name: 'light', icon: 'fisun', label: 'Light' },
      { name: 'dark', icon: 'fimoon', label: 'Dark' },
      { name: 'sepia', icon: 'fibook', label: 'Sepia' }
    ];
    
    this.currentTheme = this.getInitialTheme();
    this.init();
  }
  
  getInitialTheme() {
    // Check localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'sepia'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }
  
  init() {
    // Apply initial theme
    this.applyTheme(this.currentTheme);
    
    // Create toggle elements
    this.createToggle();
    
    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(this.currentTheme);
          this.updateToggleIcon();
        }
      });
    }
  }
  
  applyTheme(theme) {
    document.documentElement.classList.remove('light', 'dark', 'sepia');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
  }
  
  createToggle() {
    // Find all theme toggle containers
    const toggleContainers = document.querySelectorAll('.theme-toggle');
    
    toggleContainers.forEach(container => {
      // Clear any existing content
      container.innerHTML = '';
      
      // Create button
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('aria-label', 'Toggle theme');
      button.className = 'bg-muted text-muted-foreground rounded-full p-2 flex items-center justify-center';
      
      // Add current theme icon
      const currentTheme = this.themes.find(t => t.name === this.currentTheme) || this.themes[0];
      button.innerHTML = `<span class="icon ${currentTheme.icon} h-5 w-5"></span>`;
      
      // Create dropdown
      const dropdown = document.createElement('div');
      dropdown.className = 'absolute right-0 mt-2 w-36 rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 hidden';
      dropdown.setAttribute('role', 'menu');
      dropdown.setAttribute('aria-orientation', 'vertical');
      dropdown.setAttribute('aria-labelledby', 'theme-menu-button');
      
      // Create dropdown items
      const dropdownItems = document.createElement('div');
      dropdownItems.className = 'py-1';
      
      this.themes.forEach(theme => {
        const item = document.createElement('button');
        item.className = `w-full text-left px-4 py-2 text-sm ${this.currentTheme === theme.name ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`;
        item.setAttribute('role', 'menuitem');
        item.innerHTML = `
          <div class="flex items-center">
            <span class="icon ${theme.icon} mr-2"></span>
            <span>${theme.label}</span>
          </div>
        `;
        
        item.addEventListener('click', () => {
          this.applyTheme(theme.name);
          this.updateToggleIcon();
          dropdown.classList.add('hidden');
        });
        
        dropdownItems.appendChild(item);
      });
      
      dropdown.appendChild(dropdownItems);
      
      // Toggle dropdown on button click
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
      });
      
      // Add elements to container
      container.appendChild(button);
      container.appendChild(dropdown);
    });
  }
  
  updateToggleIcon() {
    const buttons = document.querySelectorAll('.theme-toggle button');
    const currentTheme = this.themes.find(t => t.name === this.currentTheme) || this.themes[0];
    
    buttons.forEach(button => {
      button.innerHTML = `<span class="icon ${currentTheme.icon} h-5 w-5"></span>`;
    });
    
    // Update dropdown items
    const dropdownItems = document.querySelectorAll('.theme-toggle [role="menuitem"]');
    dropdownItems.forEach((item, index) => {
      if (this.themes[index].name === this.currentTheme) {
        item.classList.add('bg-primary', 'text-primary-foreground');
        item.classList.remove('text-foreground', 'hover:bg-muted');
      } else {
        item.classList.remove('bg-primary', 'text-primary-foreground');
        item.classList.add('text-foreground', 'hover:bg-muted');
      }
    });
  }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeToggle = new ThemeToggle();
}); 