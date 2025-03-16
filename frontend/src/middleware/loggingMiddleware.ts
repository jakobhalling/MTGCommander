import { Middleware } from 'redux';

/**
 * Middleware that logs all dispatched actions and the resulting state
 */
const loggingMiddleware: Middleware = store => next => action => {
  if (action.type) {
    console.group(`Action: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    
    const result = next(action);
    
    console.log('Next State:', store.getState());
    console.groupEnd();
    
    return result;
  }
  
  return next(action);
};

export default loggingMiddleware; 