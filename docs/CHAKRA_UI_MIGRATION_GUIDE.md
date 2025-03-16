# Chakra UI Migration Guide

This document provides a comprehensive guide for migrating the MTG Commander frontend from its current styling approach to Chakra UI.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Migration Strategy](#migration-strategy)
4. [Component Migration Examples](#component-migration-examples)
5. [Testing Strategy](#testing-strategy)
6. [Common Challenges](#common-challenges)
7. [Resources](#resources)

## Introduction

Chakra UI is a simple, modular, and accessible component library that provides the building blocks needed to create a modern React application. This migration will help us achieve:

- Consistent design language across the application
- Improved accessibility
- Responsive design with minimal effort
- Dark/light mode support
- Faster development with pre-built components

## Prerequisites

Before starting the migration, ensure the following dependencies are installed:

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

These packages have been added to the `package.json` file.

## Migration Strategy

We'll follow a phased approach to migrate to Chakra UI:

### Phase 1: Setup and Theme Configuration

1. ✅ Create a theme configuration file (`frontend/src/theme/index.ts`)
2. ✅ Set up the ChakraProvider in the application
3. ✅ Define color schemes, typography, and component variants

### Phase 2: Component Migration

1. Create Chakra UI versions of core components:
   - ✅ Card component
   - ✅ Zone component
   - ✅ ActionButton component
   - ✅ ActionPanel component
   - ✅ PlayerInfo component
   - ⬜ Header component
   - ⬜ Layout components

2. Test each component in isolation

### Phase 3: Integration

1. ⬜ Replace existing components with Chakra UI components
2. ⬜ Update container components to use Chakra UI layout components
3. ⬜ Implement responsive design using Chakra UI's responsive syntax

### Phase 4: Refinement

1. ⬜ Ensure dark/light mode works correctly
2. ⬜ Verify accessibility
3. ⬜ Optimize performance
4. ⬜ Update documentation

## Component Migration Examples

### Example 1: Card Component

**Before:**
```tsx
// Original Card component
const Card = ({ card, isTapped, isSelected, onClick }) => {
  return (
    <div 
      className={`card ${isTapped ? 'tapped' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(card)}
    >
      <img src={card.imageUrl} alt={card.name} />
      <div className="card-details">
        <h3>{card.name}</h3>
        <p>{card.type}</p>
      </div>
    </div>
  );
};
```

**After:**
```tsx
// Chakra UI Card component
import { Box, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react';

const ChakraCard = ({ card, isTapped, isSelected, onClick }) => {
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');
  
  return (
    <Box
      borderWidth="1px"
      borderColor={isSelected ? selectedBorderColor : borderColor}
      borderRadius="md"
      overflow="hidden"
      transform={isTapped ? 'rotate(90deg)' : 'none'}
      transition="all 0.2s"
      onClick={() => onClick(card)}
      data-testid={`card-${card.id}`}
    >
      <Image src={card.imageUrl} alt={card.name} />
      <VStack p={2} align="start">
        <Text fontWeight="bold" fontSize="sm">{card.name}</Text>
        <Text fontSize="xs">{card.type}</Text>
      </VStack>
    </Box>
  );
};
```

## Testing Strategy

1. Create unit tests for each migrated component
2. Test both light and dark mode
3. Test responsive behavior
4. Test accessibility using tools like axe-core
5. Perform integration tests to ensure components work together

## Common Challenges

### 1. Styling Differences

Chakra UI uses a prop-based styling approach instead of CSS classes. Convert class-based styles to Chakra's style props.

**Example:**
```tsx
// Before
<div className="container large-padding">

// After
<Box p={8}>
```

### 2. Layout Changes

Chakra UI provides layout components like `Flex`, `Grid`, and `Stack` that replace CSS flexbox and grid.

**Example:**
```tsx
// Before
<div className="flex-container">
  <div className="sidebar">...</div>
  <div className="main-content">...</div>
</div>

// After
<Flex>
  <Box flex="1" maxW="250px">...</Box>
  <Box flex="3">...</Box>
</Flex>
```

### 3. Responsive Design

Use Chakra UI's responsive array syntax or object syntax for responsive values.

**Example:**
```tsx
// Responsive array syntax (mobile-first)
<Box width={["100%", "50%", "25%"]}>

// Responsive object syntax
<Box width={{ base: "100%", md: "50%", lg: "25%" }}>
```

## Resources

- [Chakra UI Documentation](https://chakra-ui.com/docs/getting-started)
- [Chakra UI GitHub Repository](https://github.com/chakra-ui/chakra-ui)
- [Chakra UI Theme Documentation](https://chakra-ui.com/docs/styled-system/theming/theme)
- [Chakra UI Component Documentation](https://chakra-ui.com/docs/components)
- [Chakra UI Style Props](https://chakra-ui.com/docs/styled-system/style-props) 