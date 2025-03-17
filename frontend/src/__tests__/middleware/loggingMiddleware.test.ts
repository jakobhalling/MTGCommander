import loggingMiddleware from '../../middleware/loggingMiddleware';

describe('Logging Middleware', () => {
  let store: any;
  let next: jest.Mock;
  let action: any;
  let consoleGroupSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleGroupEndSpy: jest.SpyInstance;

  beforeEach(() => {
    store = {
      getState: jest.fn(() => ({ test: 'state' }))
    };
    next = jest.fn(action => action);
    action = { type: 'TEST_ACTION', payload: 'test' };
    
    consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();
  });

  afterEach(() => {
    consoleGroupSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
  });

  it('should pass the action to the next middleware', () => {
    const middleware = loggingMiddleware(store)(next);
    const result = middleware(action);
    
    expect(next).toHaveBeenCalledWith(action);
    expect(result).toEqual(action);
  });

  it('should log the action and state', () => {
    const middleware = loggingMiddleware(store)(next);
    middleware(action);
    
    expect(consoleGroupSpy).toHaveBeenCalledWith('Action: TEST_ACTION');
    expect(consoleLogSpy).toHaveBeenCalledWith('Previous State:', { test: 'state' });
    expect(consoleLogSpy).toHaveBeenCalledWith('Action:', action);
    expect(consoleLogSpy).toHaveBeenCalledWith('Next State:', { test: 'state' });
    expect(consoleGroupEndSpy).toHaveBeenCalled();
  });

  it('should handle actions without a type property', () => {
    const actionWithoutType = { payload: 'test' };
    const middleware = loggingMiddleware(store)(next);
    const result = middleware(actionWithoutType);
    
    expect(next).toHaveBeenCalledWith(actionWithoutType);
    expect(result).toEqual(actionWithoutType);
    expect(consoleGroupSpy).not.toHaveBeenCalled();
  });
}); 