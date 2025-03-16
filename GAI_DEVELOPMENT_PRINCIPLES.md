# Generative AI Development Principles

## Test-Driven Development Workflow

### 1. Test First Approach
1. Write failing tests that define the expected behavior
2. Implement minimal code to make tests pass
3. Refactor while maintaining test coverage
4. Verify all existing tests still pass
5. Run linting and fix any issues
6. Run build to ensure no compilation errors
7. Only proceed to new features when all checks pass

### 2. Test Coverage Requirements
- Unit tests for all business logic
- Component tests for UI elements
- Integration tests for feature workflows
- Test both success and error scenarios
- Mock external dependencies consistently
- Test edge cases and boundary conditions

## Code Organization

### File Size Limits
- Maximum 200 lines per file
- Maximum 50 lines per function/method
- Maximum 3 levels of nesting
- Split files exceeding limits into logical modules
- Create separate files for complex type definitions

### Component Structure
- One component per file
- Separate logic from presentation
- Extract shared styles to theme files
- Keep component props minimal and focused
- Document component API and usage

## Frontend Architecture

### Component Hierarchy
1. Core Game Components
   - Must work in both single and multiplayer modes
   - Accept mode-specific handlers via props
   - Use dependency injection for state management
   - Maintain consistent styling across modes

2. Shared UI Elements
   - Create reusable atomic components
   - Implement consistent prop patterns
   - Use TypeScript interfaces for prop types
   - Document component variations

3. Layout Components
   - Create flexible, responsive layouts
   - Use CSS Grid or Flexbox consistently
   - Support different screen sizes
   - Maintain accessibility standards

### State Management
- Keep state logic separate from UI
- Use pure functions for state updates
- Implement clear action creators
- Document state shape and updates
- Test state transitions thoroughly

## Code Quality Standards

### Naming Conventions
- Use descriptive, action-based names for functions
- Prefix interface names with 'I'
- Suffix type names with 'Type'
- Use consistent casing (camelCase, PascalCase)
- Avoid abbreviations unless standard

### Function Design
- Single responsibility principle
- Pure functions where possible
- Early returns for guard clauses
- Clear parameter naming
- Document complex logic

### Error Handling
- Use typed error classes
- Implement consistent error boundaries
- Log errors with context
- Provide user-friendly error messages
- Test error scenarios

## Component Development Rules

### 1. Creation Process
1. Define component interface first
2. Write component tests
3. Implement basic functionality
4. Add styling
5. Document usage examples
6. Create storybook stories
7. Test accessibility

### 2. Reusability Guidelines
- Make components mode-agnostic
- Use composition over inheritance
- Implement sensible defaults
- Allow style customization
- Document required context

### 3. State Management
- Keep local state minimal
- Use hooks for complex logic
- Document state dependencies
- Test state interactions
- Handle loading states

## Game-Specific Components

### 1. Card Components
- Separate card logic from presentation
- Support different card states
- Handle interactions consistently
- Maintain aspect ratios
- Support accessibility

### 2. Game Board
- Use grid-based layout
- Support dynamic zones
- Handle responsive scaling
- Maintain consistent spacing
- Document layout system

### 3. Game Actions
- Create reusable action handlers
- Implement consistent animations
- Support keyboard shortcuts
- Provide interaction feedback
- Test action sequences

## Code Review Checklist

### Before Submitting
- [ ] All tests pass
- [ ] Linting shows no errors
- [ ] Build succeeds
- [ ] Documentation updated
- [ ] Components properly typed
- [ ] No hardcoded values
- [ ] Error handling implemented
- [ ] Accessibility verified
- [ ] Performance checked
- [ ] Browser compatibility tested

### Architecture Compliance
- [ ] Components follow single responsibility
- [ ] State management follows patterns
- [ ] UI components are reusable
- [ ] Styling follows theme system
- [ ] File size limits respected
- [ ] Dependencies properly injected
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Types properly defined
- [ ] Constants externalized

## Documentation Requirements

### Component Documentation
- Purpose and usage
- Props interface
- State management
- Example usage
- Edge cases
- Performance considerations
- Accessibility features

### Test Documentation
- Test scenario description
- Edge cases covered
- Mock setup explanation
- State requirements
- Expected outcomes

## Performance Guidelines

### Component Optimization
- Implement proper memoization
- Avoid unnecessary rerenders
- Lazy load when appropriate
- Optimize event handlers
- Monitor bundle size

### State Updates
- Batch related updates
- Use appropriate update strategies
- Implement efficient diffing
- Monitor update frequency
- Test performance impact

## Accessibility Standards

### Implementation Requirements
- Proper ARIA labels
- Keyboard navigation
- Focus management
- Color contrast
- Screen reader support
- Responsive text sizing

## Error Prevention

### Development Safeguards
- Type everything possible
- Validate props with PropTypes
- Use strict TypeScript settings
- Implement error boundaries
- Add runtime checks
- Log potential issues

## Continuous Improvement

### Code Maintenance
- Regular dependency updates
- Performance monitoring
- Bundle size tracking
- Test coverage monitoring
- Accessibility audits
- Browser compatibility checks 