import {getFileName} from './plugin_getFileName';

// Define the plugin interface
export interface MyPlugin {
    name: string;
    initialize?(scope: PluginScope): void;
    execute(...args: any[]): Promise<any> | any;
    cleanup?(): void;
  }
  
  // Define the scope utilities available to plugins
  interface PluginScope {
    // Data access utilities
    getData(key: string): Promise<any>;
    setData(key: string, value: any): Promise<void>;
    
    // API utilities
    callApi(endpoint: string, params?: any): Promise<any>;
    
    // Logging
    log(message: string, level?: 'info' | 'warn' | 'error'): void;
    
    // Configuration
    getConfig(): Record<string, any>;
  }
  
  // Plugin Manager Class
  class PluginManager {
    private plugins: Map<string, MyPlugin> = new Map();
    private scope: PluginScope;
  
    constructor(scope: Partial<PluginScope> = {}) {
      // Initialize with default scope implementations
      this.scope = {
        getData: async (key) => {
          throw new Error('getData not implemented');
        },
        setData: async (key, value) => {
          throw new Error('setData not implemented');
        },
        callApi: async (endpoint, params) => {
          throw new Error('callApi not implemented');
        },
        log: (message, level = 'info') => console[level](message),
        getConfig: () => ({}),
        ...scope // Override with custom implementations
      };
    }
  
    // Register a plugin
    register(plugin: MyPlugin): void {
      if (this.plugins.has(plugin.name)) {
        throw new Error(`Plugin ${plugin.name} already registered`);
      }
      
      // Initialize the plugin with scope
      if (plugin.initialize) {
        plugin.initialize(this.scope);
      }
      
      this.plugins.set(plugin.name, plugin);
    }
  
    // Execute a plugin
    async execute(name: string, ...args: any[]): Promise<any> {
      const plugin = this.plugins.get(name);
      if (!plugin) {
        throw new Error(`Plugin ${name} not found`);
      }
      
      return await plugin.execute(...args);
    }
  
    // Get all registered plugins
    getPlugins(): MyPlugin[] {
      return Array.from(this.plugins.values());
    }
  
    // Cleanup all plugins
    async cleanup(): Promise<void> {
      for (const plugin of this.plugins.values()) {
        if (plugin.cleanup) {
          await plugin.cleanup();
        }
      }
      this.plugins.clear();
    }
  }

  // Custom scope implementations
const customScope: Partial<PluginScope> = {
    async getData(key) {
      // Implementation to get data from your storage
      return localStorage.getItem(key);
    },
    
    async setData(key, value) {
      // Implementation to set data in your storage
      localStorage.setItem(key, JSON.stringify(value));
    },
    
    async callApi(endpoint, params) {
      // Implementation to call your API
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(params)
      });
      return response.json();
    },
    
    getConfig() {
      return { environment: 'production' };
    }
  };
  
  // Initialize plugin manager
  const pluginManager = new PluginManager(customScope);
  
  // Register plugins
  pluginManager.register(getFileName);