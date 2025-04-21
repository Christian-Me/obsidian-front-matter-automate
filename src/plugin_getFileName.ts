import {MyPlugin} from './plugins.ts'
// Example plugin implementation

export const getFileName: MyPlugin = {
    name: 'getFileName',
    
    initialize(scope) {
      // Can use scope utilities during initialization
      scope.log('Data Processor plugin initialized');
    },
    
    async execute(data: any) {
      // Process data here
      const processed = { ...data, processed: true };
      
      // Example of using scope utilities during execution
      await this.scope.setData('lastProcessed', processed);
      const config = this.scope.getConfig();
      console.log('getFileName Config:',config)
      
      return processed;
    },
    
    cleanup() {
      console.log('Cleaning up getFileNames');
    }
  };