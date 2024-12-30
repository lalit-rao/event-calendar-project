# Dynamic Event Calendar Application

## Overview

The Dynamic Event Calendar Application is a web-based tool built using React.js, designed to help users organize and manage their events seamlessly. It features a calendar view, event management capabilities, and data persistence, making it a reliable tool for everyday planning.

## Features

### 1. Calendar View
- Displays a calendar grid for the current month with days properly aligned.
- Users can switch between months using "Previous" and "Next" buttons to navigate through time.

### 2. Event Management
- Users can add events by clicking on a day.
- Each event contains:
  - Event Name
  - Start time and End time
  - Optional Description
- Events can be edited or deleted from the selected day.

### 3. Event List
- Shows a list of all events for the selected day in a modal or side panel for quick reference.

### 4. Data Persistence
- Events are stored in **localStorage** (or in-memory data store) to persist data between page refreshes.

### 5. UI Design
- Clean and modern UI components styled using **shadcn**.
- Clear separation of weekdays and weekends within the calendar grid.
- Current day and selected day are highlighted visually for easy navigation.

## Requirements

- **React.js** - The core framework used for building the app.
- **shadcn** - For modern UI components and clean styling.
- **localStorage** - Used for event data persistence.
- **Optional**: **CSV/JSON Export** - Allow users to export their event list for a specific month.

## Complex Logic

- **Month Transitions**: The application handles automatic month transitions (e.g., from January 31st to February 1st).
- **Event Overlapping Prevention**: Prevents users from adding two events with the same time slot on a single day.
- **Event Filtering**: Users can filter events by keyword for easy searchability.

## Other Features

1. **Drag-and-Drop**: Allows users to drag and drop events between days to reschedule them.
2. **Color Coding**: Users can assign color codes to events based on category (e.g., Work, Personal, Others).
3. **Export Functionality**: Allows users to export their event list for a selected month as either a **JSON** or **CSV** file.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
