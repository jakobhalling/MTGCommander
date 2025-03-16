#!/bin/bash

# Set error handling
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Default flags
RUN_BACKEND=true
RUN_FRONTEND=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --backend-only)
      RUN_BACKEND=true
      RUN_FRONTEND=false
      shift
      ;;
    --frontend-only)
      RUN_BACKEND=false
      RUN_FRONTEND=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Usage: ./test.sh [--backend-only] [--frontend-only]"
      exit 1
      ;;
  esac
done

echo -e "${GREEN}=== Running MTG Commander Tests ===${NC}"
echo ""

# Function to handle errors
handle_error() {
  echo -e "${RED}Error: $1 tests failed${NC}"
  exit 1
}

# Run backend tests
if $RUN_BACKEND; then
  echo -e "${YELLOW}=== Running Backend Tests ===${NC}"
  cd backend || handle_error "Failed to change to backend directory"
  
  if ! dotnet build; then
    handle_error "Backend build"
  fi
  
  if ! dotnet test; then
    handle_error "Backend"
  fi
  
  cd ..
  echo -e "${GREEN}Backend tests completed successfully${NC}"
  echo ""
fi

# Run frontend tests
if $RUN_FRONTEND; then
  echo -e "${YELLOW}=== Running Frontend Tests ===${NC}"
  cd frontend || handle_error "Failed to change to frontend directory"
  
  if ! npm test -- --watchAll=false; then
    handle_error "Frontend"
  fi
  
  cd ..
  echo -e "${GREEN}Frontend tests completed successfully${NC}"
  echo ""
fi

echo -e "${GREEN}=== All Tests Completed Successfully ===${NC}" 