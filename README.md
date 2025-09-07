# Finisterre Gardenz

A modern, comprehensive cemetery management system designed to streamline record-keeping, plot management, and historical data access. This project uses a web-based interface for administrative tasks and provides a mobile-friendly version for on-the-go access.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
  - [Development Server](#development-server)
  - [Building for Production](#building-for-production)
  - [Running Tests](#running-tests)
- [Contribution Guidelines](#contribution-guidelines)
- [Troubleshooting](#troubleshooting)

## Project Overview

Finisterre Gardenz is a digital solution for managing cemetery operations. Key features include:

- **Plot Management:** Track the status, ownership, and occupancy of each plot.
- **Deceased Records:** Maintain a detailed database of individuals interred.
- **Lot Owner Information:** Manage contact and ownership details for lot owners.
- **Interactive Map:** A visual, interactive map of the cemetery grounds (powered by Leaflet).
- **Mobile Access:** A Capacitor-based build for Android provides access to essential features on mobile devices.

## Tech Stack

This project is built with a modern, robust tech stack:

| Category      | Technology                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**  | [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)                               |
| **Styling**   | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)                  |
| **State Mgt** | [TanStack Query](https://tanstack.com/query/latest)                                                                                   |
| **Routing**   | [React Router](https://reactrouter.com/)                                                                                              |
| **Mobile**    | [Capacitor](https://capacitorjs.com/)                                                                                                 |
| **Mapping**   | [React Leaflet](https://react-leaflet.js.org/)                                                                                        |
| **Backend**   | A separate REST API (consumed via [Axios](https://axios-http.com/))                                                                   |
| **Tooling**   | [pnpm](https://pnpm.io/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/) |
| **Testing**   | [Vitest](https://vitest.dev/)                                                                                                         |

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/installation)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/finisterre.git
    cd finisterre
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Environment Configuration

The project requires a set of environment variables to connect to the backend API and configure application settings.

1.  Create a `.env` file in the root directory by copying the example file:

    ```bash
    copy .env.example .env
    ```

2.  Update the `.env` file with your specific configuration. The most important variable is the API endpoint:
    ```env
    VITE_API_BASE_URL=http://your-api-endpoint.com
    ```

## Running the Project

### Development Server

To run the application in development mode with hot-reloading:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build of the web application:

```bash
pnpm build
```

The optimized files will be generated in the `dist/` directory.

### Running Tests

To run the test suite:

```bash
pnpm test
```

## Contribution Guidelines

We welcome contributions! Please follow these steps to contribute:

1.  **Fork the repository** and create a new branch for your feature or bug fix.
2.  **Write clean, readable code** that follows the existing code style.
3.  **Ensure all tests pass** before submitting a pull request.
4.  **Use conventional commit messages** for your commits.
5.  **Run the linter and formatter** to maintain code quality:
    ```bash
    pnpm lint
    pnpm write
    ```

## Troubleshooting

- **`pnpm install` fails:**
  - Ensure you have the correct Node.js and pnpm versions installed.
  - Try clearing the pnpm cache: `pnpm store prune`.

- **Application doesn't connect to the API:**
  - Double-check that your `VITE_API_BASE_URL` in the `.env` file is correct and that the API server is running.

- **Linting or formatting errors on commit:**
  - The project uses a pre-commit hook with Husky. Run `pnpm lint` and `pnpm write` to fix any issues before committing.
