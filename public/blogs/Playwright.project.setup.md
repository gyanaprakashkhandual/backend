---

slug: designing-a-playwright-automation-framework-for-enterprise-applications
title: How to Design a Playwright Automation Framework for Enterprise Applications
description: Learn how to design a robust UI automation framework using Playwright, TypeScript, and Cucumber (BDD). This guide provides a comprehensive approach to building a scalable and maintainable test suite for large-scale enterprise applications.
author: Gyana prakash Khandual
date: 2026-03-14
tags: [testing, beginner, qa]
coverImage: /images/intro-testing.jpg

---
# Enterprise Playwright Automation Framework

A production-grade test automation framework built with Playwright, TypeScript, Cucumber (BDD), and Allure Reporting. Designed to support large-scale enterprise applications with 300+ APIs and complex UI frontend workflows.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Project Setup from Scratch](#project-setup-from-scratch)
5. [Dependency Installation](#dependency-installation)
6. [Project Folder Structure](#project-folder-structure)
7. [Folder and File Explanation](#folder-and-file-explanation)
8. [Configuration Files](#configuration-files)
9. [Playwright and Cucumber Integration](#playwright-and-cucumber-integration)
10. [Page Object Model (POM) Design](#page-object-model-pom-design)
11. [API Service Layer Design](#api-service-layer-design)
12. [Utility and Helper Modules](#utility-and-helper-modules)
13. [Environment Configuration](#environment-configuration)
14. [Test Data Management](#test-data-management)
15. [Authentication Flows](#authentication-flows)
16. [Parallel Execution](#parallel-execution)
17. [Test Retries and Stability](#test-retries-and-stability)
18. [Logging](#logging)
19. [Reporting](#reporting)
20. [Running Tests Locally](#running-tests-locally)
21. [Running Tests in CI/CD](#running-tests-in-cicd)
22. [Scaling for Enterprise Projects](#scaling-for-enterprise-projects)
23. [Best Practices](#best-practices)

---

## Introduction

This framework is designed to solve a real and common problem in enterprise QA engineering: testing a large-scale application that exposes hundreds of REST or GraphQL APIs alongside a complex, dynamic frontend UI, across multiple environments, and with multiple teams contributing tests simultaneously.

The framework achieves this through a clear separation of concerns. API tests and UI tests share common utilities, helpers, environment configuration, and reporting infrastructure, but maintain independent layers for their specific concerns. BDD with Cucumber is used so that non-technical stakeholders can read and contribute to test scenarios. The Page Object Model (POM) is used for all UI interactions to ensure that UI changes require minimal test updates. API service classes abstract HTTP communication so that endpoint changes are isolated to a single location.

The framework is not opinionated about what application it tests. It provides patterns, structure, and conventions. Teams add their own feature files, page objects, and API service classes on top of this foundation.

---

## Technology Stack

| Tool                   | Version              | Purpose                                    |
| ---------------------- | -------------------- | ------------------------------------------ |
| Node.js                | 20.x LTS or 22.x LTS | Runtime                                    |
| TypeScript             | 5.x                  | Language                                   |
| Playwright             | 1.44.x or later      | Browser automation and API request context |
| Playwright Test        | 1.44.x or later      | Test runner                                |
| Cucumber (cucumber-js) | 10.x or later        | BDD framework                              |
| Allure Playwright      | 2.x                  | Rich test reporting                        |
| dotenv                 | 16.x                 | Environment variable management            |
| Winston                | 3.x                  | Logging                                    |
| faker-js               | 8.x                  | Test data generation                       |
| ts-node                | 10.x                 | TypeScript execution                       |
| eslint                 | 9.x                  | Code quality                               |
| prettier               | 3.x                  | Code formatting                            |

---

## Prerequisites

Before starting, ensure the following are installed on your machine.

- Node.js version 20 LTS or 22 LTS. Download from https://nodejs.org
- npm version 9 or later (bundled with Node.js) or yarn version 4
- Git
- A terminal with bash or zsh support (Linux, macOS, or WSL2 on Windows)

Verify your environment:

```bash
node --version
npm --version
git --version
```

---

## Project Setup from Scratch

### Step 1: Initialize the project

```bash
mkdir enterprise-playwright-framework
cd enterprise-playwright-framework
git init
npm init -y
```

### Step 2: Install TypeScript

```bash
npm install --save-dev typescript ts-node @types/node
npx tsc --init
```

### Step 3: Install Playwright and its browsers

```bash
npm install --save-dev @playwright/test
npx playwright install
npx playwright install-deps
```

### Step 4: Install Cucumber and its TypeScript bindings

```bash
npm install --save-dev @cucumber/cucumber @cucumber/html-formatter
npm install --save-dev @types/cucumber
```

### Step 5: Install Allure reporting

```bash
npm install --save-dev allure-playwright allure-commandline
```

### Step 6: Install supporting libraries

```bash
npm install --save-dev dotenv winston @faker-js/faker
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier
```

### Step 7: Create the .gitignore file

```
node_modules/
dist/
test-results/
allure-results/
allure-report/
reports/
.env
.env.local
.env.staging
.env.production
*.log
coverage/
.DS_Store
```

---

## Dependency Installation

The complete installation can be performed with the following single block of commands for a fresh setup.

```bash
npm install --save-dev \
  typescript \
  ts-node \
  @types/node \
  @playwright/test \
  @cucumber/cucumber \
  @cucumber/html-formatter \
  allure-playwright \
  allure-commandline \
  dotenv \
  winston \
  @faker-js/faker \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  prettier \
  eslint-config-prettier \
  cross-env
```

After installation, install Playwright browsers:

```bash
npx playwright install --with-deps chromium firefox webkit
```

---

## Project Folder Structure

The following structure is designed for a large enterprise project. Every folder has a clear, single responsibility. Teams working on different domains can operate independently without conflicts.

```
enterprise-playwright-framework/
│
├── src/
│   │
│   ├── api/
│   │   ├── services/
│   │   │   ├── auth/
│   │   │   │   └── AuthService.ts
│   │   │   ├── users/
│   │   │   │   └── UserService.ts
│   │   │   ├── orders/
│   │   │   │   └── OrderService.ts
│   │   │   └── payments/
│   │   │       └── PaymentService.ts
│   │   │
│   │   ├── models/
│   │   │   ├── request/
│   │   │   │   ├── CreateUserRequest.ts
│   │   │   │   └── CreateOrderRequest.ts
│   │   │   └── response/
│   │   │       ├── UserResponse.ts
│   │   │       └── OrderResponse.ts
│   │   │
│   │   └── client/
│   │       └── ApiClient.ts
│   │
│   ├── ui/
│   │   ├── pages/
│   │   │   ├── common/
│   │   │   │   ├── BasePage.ts
│   │   │   │   └── NavigationComponent.ts
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.ts
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.ts
│   │   │   └── orders/
│   │   │       ├── OrderListPage.ts
│   │   │       └── OrderDetailPage.ts
│   │   │
│   │   └── components/
│   │       ├── ModalComponent.ts
│   │       ├── TableComponent.ts
│   │       └── FormComponent.ts
│   │
│   ├── hooks/
│   │   ├── api/
│   │   │   └── apiHooks.ts
│   │   └── ui/
│   │       └── uiHooks.ts
│   │
│   ├── support/
│   │   ├── world/
│   │   │   └── CustomWorld.ts
│   │   └── assertions/
│   │       ├── ApiAssertions.ts
│   │       └── UiAssertions.ts
│   │
│   └── utils/
│       ├── config/
│       │   ├── ConfigManager.ts
│       │   └── EnvironmentValidator.ts
│       ├── logger/
│       │   └── Logger.ts
│       ├── helpers/
│       │   ├── DataHelper.ts
│       │   ├── DateHelper.ts
│       │   ├── StringHelper.ts
│       │   └── RetryHelper.ts
│       └── fixtures/
│           └── PlaywrightFixtures.ts
│
├── tests/
│   │
│   ├── features/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── login.feature
│   │   │   ├── users/
│   │   │   │   ├── create-user.feature
│   │   │   │   └── get-user.feature
│   │   │   └── orders/
│   │   │       └── create-order.feature
│   │   │
│   │   └── ui/
│   │       ├── auth/
│   │       │   └── login.feature
│   │       ├── dashboard/
│   │       │   └── dashboard-navigation.feature
│   │       └── orders/
│   │           └── order-management.feature
│   │
│   ├── step-definitions/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── loginSteps.ts
│   │   │   ├── users/
│   │   │   │   └── userSteps.ts
│   │   │   └── orders/
│   │   │       └── orderSteps.ts
│   │   │
│   │   └── ui/
│   │       ├── auth/
│   │       │   └── loginSteps.ts
│   │       ├── dashboard/
│   │       │   └── dashboardSteps.ts
│   │       └── orders/
│   │           └── orderSteps.ts
│   │
│   └── playwright/
│       ├── api/
│       │   └── users.spec.ts
│       └── ui/
│           └── login.spec.ts
│
├── config/
│   ├── environments/
│   │   ├── .env.development
│   │   ├── .env.staging
│   │   └── .env.production
│   └── testdata/
│       ├── users.json
│       └── orders.json
│
├── reports/
│   ├── allure-results/
│   └── cucumber-report/
│
├── .github/
│   └── workflows/
│       └── test-pipeline.yml
│
├── playwright.config.ts
├── cucumber.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── package.json
└── README.md
```

---

## Folder and File Explanation

### src/api/services/

Each subdirectory maps to a domain or resource group in the application. For example, `users/UserService.ts` contains all HTTP operations related to the Users API domain. This mirrors the domain structure of the backend application, making it easy to locate and maintain service classes as the API surface grows.

### src/api/models/

TypeScript interfaces and types that define the shape of API request bodies and response payloads. Separating these from the service classes ensures that if an API contract changes, you update only the model and any compilation errors will indicate which tests are affected.

### src/api/client/

The `ApiClient.ts` is the single wrapper around Playwright's `APIRequestContext`. It provides base methods such as `get`, `post`, `put`, `patch`, and `delete` with shared behaviors like setting authorization headers, base URL, logging, and response validation.

### src/ui/pages/

Contains Page Object classes. Each class represents one screen or significant section of the UI. The `BasePage.ts` provides shared methods used across all pages. Domain-specific subdirectories keep related pages together.

### src/ui/components/

Reusable UI component wrappers for elements that appear across multiple pages, such as modals, tables, date pickers, and forms. Instead of duplicating interaction logic, components are composed into page objects.

### src/hooks/

Cucumber Before and After hooks. The `apiHooks.ts` file initializes the API request context before API test scenarios and cleans up after. The `uiHooks.ts` file initializes the browser and page context for UI scenarios.

### src/support/world/

Cucumber's World object is extended in `CustomWorld.ts`. This is the shared context object injected into every step definition. It holds the browser page, API request context, response data, authentication tokens, and any state that needs to be shared between steps within a scenario.

### src/utils/

All framework-level utilities. `ConfigManager.ts` reads environment variables and exposes a typed configuration object. `Logger.ts` provides a Winston logger configured with appropriate transports and log levels. The `helpers/` directory contains stateless utility functions for data generation, date manipulation, string formatting, and controlled retry logic.

### tests/features/

Gherkin feature files organized by domain and test type (API vs UI). Each feature file describes one capability from a business perspective. Keeping API and UI features in separate subdirectories allows running them independently.

### tests/step-definitions/

TypeScript step definition files that implement the Given, When, and Then steps declared in feature files. Step definitions should contain no direct Playwright interactions. They delegate to service classes or page objects and use the CustomWorld to share state.

### tests/playwright/

Standard Playwright Test spec files for tests that do not require BDD syntax. These are appropriate for low-level integration tests, regression checks, and cases where the overhead of Cucumber is unnecessary.

### config/environments/

One `.env` file per environment. These files are never committed to source control. The `.env.example` file (which is committed) documents all required variables without sensitive values.

---

## Configuration Files

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./",
    "baseUrl": ".",
    "paths": {
      "@api/*": ["src/api/*"],
      "@ui/*": ["src/ui/*"],
      "@utils/*": ["src/utils/*"],
      "@support/*": ["src/support/*"],
      "@hooks/*": ["src/hooks/*"],
      "@config/*": ["config/*"]
    },
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*",
    "tests/**/*",
    "playwright.config.ts",
    "cucumber.config.ts"
  ],
  "exclude": ["node_modules", "dist", "reports"]
}
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

const environment = process.env.TEST_ENV || "development";
dotenv.config({
  path: path.resolve(__dirname, `config/environments/.env.${environment}`),
});

export default defineConfig({
  testDir: "./tests/playwright",
  outputDir: "./reports/test-results",
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  reporter: [
    ["html", { outputFolder: "./reports/playwright-html", open: "never" }],
    [
      "allure-playwright",
      { outputFolder: "./reports/allure-results", detail: true },
    ],
    ["list"],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: process.env.HEADLESS !== "false",
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
    extraHTTPHeaders: {
      "x-test-run": "playwright-automation",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "api-tests",
      testMatch: /.*\/api\/.*\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL,
      },
    },
  ],
});
```

### cucumber.config.ts

```typescript
import * as dotenv from "dotenv";
import * as path from "path";

const environment = process.env.TEST_ENV || "development";
dotenv.config({
  path: path.resolve(__dirname, `config/environments/.env.${environment}`),
});

const config = {
  default: {
    requireModule: ["ts-node/register"],
    require: [
      "src/hooks/**/*.ts",
      "src/support/**/*.ts",
      "tests/step-definitions/**/*.ts",
    ],
    paths: ["tests/features/**/*.feature"],
    format: [
      "progress-bar",
      `allure-cucumberjs/reporter`,
      `html:reports/cucumber-report/index.html`,
      `json:reports/cucumber-report/results.json`,
    ],
    formatOptions: {
      snippetInterface: "async-await",
    },
    worldParameters: {
      environment: environment,
    },
    parallel: 4,
    retry: 1,
    tags: process.env.TAGS || "",
  },
  api: {
    paths: ["tests/features/api/**/*.feature"],
    tags: "@api",
  },
  ui: {
    paths: ["tests/features/ui/**/*.feature"],
    tags: "@ui",
  },
  smoke: {
    tags: "@smoke",
  },
  regression: {
    tags: "@regression",
  },
};

module.exports = config;
```

### package.json (scripts section)

```json
{
  "name": "enterprise-playwright-framework",
  "version": "1.0.0",
  "description": "Enterprise-grade Playwright automation framework with Cucumber BDD",
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --project=chromium",
    "test:api": "playwright test --project=api-tests",
    "test:firefox": "playwright test --project=firefox",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "cucumber": "cucumber-js --config cucumber.config.ts",
    "cucumber:api": "cucumber-js --config cucumber.config.ts --profile api",
    "cucumber:ui": "cucumber-js --config cucumber.config.ts --profile ui",
    "cucumber:smoke": "cucumber-js --config cucumber.config.ts --profile smoke",
    "cucumber:regression": "cucumber-js --config cucumber.config.ts --profile regression",
    "cucumber:tags": "cucumber-js --config cucumber.config.ts --tags",
    "report:allure:generate": "allure generate reports/allure-results --clean -o reports/allure-report",
    "report:allure:open": "allure open reports/allure-report",
    "report:allure": "npm run report:allure:generate && npm run report:allure:open",
    "report:playwright": "playwright show-report reports/playwright-html",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"**/*.ts\"",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist reports/allure-results reports/allure-report reports/cucumber-report reports/test-results"
  }
}
```

### .env.development (example structure)

```
BASE_URL=https://app.development.example.com
API_BASE_URL=https://api.development.example.com
API_VERSION=v1
TEST_ENV=development
HEADLESS=true
DEFAULT_TIMEOUT=60000
AUTH_USERNAME=dev_test_user@example.com
AUTH_PASSWORD=dev_test_password_123
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=admin_password_456
DB_CONNECTION_STRING=postgresql://user:password@localhost:5432/testdb
```

---

## Playwright and Cucumber Integration

Playwright provides its `APIRequestContext` and `Browser` objects. Cucumber provides the `World` context and lifecycle hooks. Integration is achieved through the `CustomWorld` class and the Cucumber hooks.

### CustomWorld.ts

```typescript
import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
import {
  Browser,
  BrowserContext,
  Page,
  APIRequestContext,
  request,
} from "@playwright/test";
import { chromium } from "@playwright/test";
import { ConfigManager } from "@utils/config/ConfigManager";
import { Logger } from "@utils/logger/Logger";

const config = ConfigManager.getInstance();
const logger = Logger.getInstance();

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  apiRequest!: APIRequestContext;
  authToken?: string;
  lastResponse?: any;
  testData: Record<string, any> = {};

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initBrowser(): Promise<void> {
    this.browser = await chromium.launch({ headless: config.headless });
    this.context = await this.browser.newContext({
      baseURL: config.baseUrl,
      ignoreHTTPSErrors: true,
    });
    this.page = await this.context.newPage();
    logger.info("Browser initialized");
  }

  async closeBrowser(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
    logger.info("Browser closed");
  }

  async initApiContext(): Promise<void> {
    this.apiRequest = await request.newContext({
      baseURL: config.apiBaseUrl,
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-test-run": "cucumber-automation",
      },
    });
    logger.info("API request context initialized");
  }

  async closeApiContext(): Promise<void> {
    await this.apiRequest?.dispose();
    logger.info("API request context disposed");
  }

  setAuthToken(token: string): void {
    this.authToken = token;
    logger.debug("Auth token set in world context");
  }

  setTestData(key: string, value: any): void {
    this.testData[key] = value;
  }

  getTestData(key: string): any {
    return this.testData[key];
  }
}

setWorldConstructor(CustomWorld);
```

### apiHooks.ts

```typescript
import { Before, After, BeforeAll, AfterAll } from "@cucumber/cucumber";
import { CustomWorld } from "@support/world/CustomWorld";

BeforeAll(async function () {
  // Global setup: seed test database, warm up caches, etc.
});

Before({ tags: "@api" }, async function (this: CustomWorld) {
  await this.initApiContext();
});

After({ tags: "@api" }, async function (this: CustomWorld) {
  await this.closeApiContext();
});

AfterAll(async function () {
  // Global teardown
});
```

### uiHooks.ts

```typescript
import { Before, After, Status } from "@cucumber/cucumber";
import { CustomWorld } from "@support/world/CustomWorld";

Before({ tags: "@ui" }, async function (this: CustomWorld) {
  await this.initBrowser();
});

After({ tags: "@ui" }, async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page?.screenshot({ fullPage: true });
    if (screenshot) {
      this.attach(screenshot, "image/png");
    }
  }
  await this.closeBrowser();
});
```

---

## Page Object Model (POM) Design

Page objects encapsulate UI interactions. They expose high-level business methods rather than low-level Playwright locator operations. Each page object accepts the Playwright `Page` object, either through the constructor or through the CustomWorld.

### BasePage.ts

```typescript
import { Page, Locator, expect } from "@playwright/test";
import { Logger } from "@utils/logger/Logger";

const logger = Logger.getInstance();

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string): Promise<void> {
    logger.info(`Navigating to ${path}`);
    await this.page.goto(path, { waitUntil: "networkidle" });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  protected async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  protected async fillField(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.clear();
    await locator.fill(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });
    return locator.innerText();
  }

  protected async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  protected async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout: 15000 });
  }
}
```

### LoginPage.ts

```typescript
import { Page } from "@playwright/test";
import { BasePage } from "@ui/pages/common/BasePage";
import { Logger } from "@utils/logger/Logger";

const logger = Logger.getInstance();

export class LoginPage extends BasePage {
  private readonly emailInput = () =>
    this.page.locator('[data-testid="email-input"]');
  private readonly passwordInput = () =>
    this.page.locator('[data-testid="password-input"]');
  private readonly submitButton = () =>
    this.page.locator('[data-testid="login-submit"]');
  private readonly errorMessage = () =>
    this.page.locator('[data-testid="login-error"]');
  private readonly rememberMeCheckbox = () =>
    this.page.locator('[data-testid="remember-me"]');

  constructor(page: Page) {
    super(page);
  }

  async navigateToLogin(): Promise<void> {
    await this.navigateTo("/login");
    await this.emailInput().waitFor({ state: "visible" });
  }

  async login(email: string, password: string): Promise<void> {
    logger.info(`Logging in as ${email}`);
    await this.fillField(this.emailInput(), email);
    await this.fillField(this.passwordInput(), password);
    await this.clickElement(this.submitButton());
    await this.waitForUrl(/\/dashboard/);
  }

  async loginAndExpectFailure(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput(), email);
    await this.fillField(this.passwordInput(), password);
    await this.clickElement(this.submitButton());
    await this.errorMessage().waitFor({ state: "visible" });
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage());
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage());
  }
}
```

---

## API Service Layer Design

API service classes wrap Playwright's `APIRequestContext`. Each class corresponds to a backend domain or resource group. The `ApiClient` base class provides request/response logging, error handling, and header injection.

### ApiClient.ts

```typescript
import { APIRequestContext, APIResponse } from "@playwright/test";
import { Logger } from "@utils/logger/Logger";
import { ConfigManager } from "@utils/config/ConfigManager";

const logger = Logger.getInstance();
const config = ConfigManager.getInstance();

export class ApiClient {
  protected request: APIRequestContext;
  protected authToken?: string;
  protected baseUrl: string;

  constructor(request: APIRequestContext, authToken?: string) {
    this.request = request;
    this.authToken = authToken;
    this.baseUrl = config.apiBaseUrl;
  }

  protected buildHeaders(
    additionalHeaders?: Record<string, string>,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    return { ...headers, ...additionalHeaders };
  }

  protected async get(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<APIResponse> {
    logger.info(`GET ${this.baseUrl}${endpoint}`);
    const response = await this.request.get(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(),
      params,
    });
    await this.logResponse(response, endpoint);
    return response;
  }

  protected async post(endpoint: string, body: unknown): Promise<APIResponse> {
    logger.info(`POST ${this.baseUrl}${endpoint}`);
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(),
      data: body,
    });
    await this.logResponse(response, endpoint);
    return response;
  }

  protected async put(endpoint: string, body: unknown): Promise<APIResponse> {
    logger.info(`PUT ${this.baseUrl}${endpoint}`);
    const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(),
      data: body,
    });
    await this.logResponse(response, endpoint);
    return response;
  }

  protected async patch(endpoint: string, body: unknown): Promise<APIResponse> {
    logger.info(`PATCH ${this.baseUrl}${endpoint}`);
    const response = await this.request.patch(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(),
      data: body,
    });
    await this.logResponse(response, endpoint);
    return response;
  }

  protected async delete(endpoint: string): Promise<APIResponse> {
    logger.info(`DELETE ${this.baseUrl}${endpoint}`);
    const response = await this.request.delete(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(),
    });
    await this.logResponse(response, endpoint);
    return response;
  }

  private async logResponse(
    response: APIResponse,
    endpoint: string,
  ): Promise<void> {
    const status = response.status();
    const ok = response.ok();
    if (!ok) {
      const body = await response.text();
      logger.error(`[${status}] ${endpoint} failed: ${body}`);
    } else {
      logger.debug(`[${status}] ${endpoint} succeeded`);
    }
  }
}
```

### UserService.ts

```typescript
import { APIResponse } from "@playwright/test";
import { ApiClient } from "@api/client/ApiClient";
import { CreateUserRequest } from "@api/models/request/CreateUserRequest";
import { UserResponse } from "@api/models/response/UserResponse";

const USERS_ENDPOINT = "/api/v1/users";

export class UserService extends ApiClient {
  async createUser(payload: CreateUserRequest): Promise<APIResponse> {
    return this.post(USERS_ENDPOINT, payload);
  }

  async getUserById(userId: string): Promise<APIResponse> {
    return this.get(`${USERS_ENDPOINT}/${userId}`);
  }

  async getAllUsers(page?: number, limit?: number): Promise<APIResponse> {
    const params: Record<string, string> = {};
    if (page !== undefined) params["page"] = String(page);
    if (limit !== undefined) params["limit"] = String(limit);
    return this.get(USERS_ENDPOINT, params);
  }

  async updateUser(
    userId: string,
    payload: Partial<CreateUserRequest>,
  ): Promise<APIResponse> {
    return this.put(`${USERS_ENDPOINT}/${userId}`, payload);
  }

  async deleteUser(userId: string): Promise<APIResponse> {
    return this.delete(`${USERS_ENDPOINT}/${userId}`);
  }

  async getUserByEmail(email: string): Promise<APIResponse> {
    return this.get(USERS_ENDPOINT, { email });
  }
}
```

---

## Utility and Helper Modules

### ConfigManager.ts

```typescript
import * as dotenv from "dotenv";
import * as path from "path";

interface AppConfig {
  baseUrl: string;
  apiBaseUrl: string;
  apiVersion: string;
  environment: string;
  headless: boolean;
  defaultTimeout: number;
  authUsername: string;
  authPassword: string;
  adminUsername: string;
  adminPassword: string;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    const env = process.env.TEST_ENV || "development";
    dotenv.config({
      path: path.resolve(process.cwd(), `config/environments/.env.${env}`),
    });

    this.config = {
      baseUrl: this.require("BASE_URL"),
      apiBaseUrl: this.require("API_BASE_URL"),
      apiVersion: process.env.API_VERSION || "v1",
      environment: env,
      headless: process.env.HEADLESS !== "false",
      defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || "60000", 10),
      authUsername: this.require("AUTH_USERNAME"),
      authPassword: this.require("AUTH_PASSWORD"),
      adminUsername: this.require("ADMIN_USERNAME"),
      adminPassword: this.require("ADMIN_PASSWORD"),
    };
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  get baseUrl(): string {
    return this.config.baseUrl;
  }
  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }
  get apiVersion(): string {
    return this.config.apiVersion;
  }
  get environment(): string {
    return this.config.environment;
  }
  get headless(): boolean {
    return this.config.headless;
  }
  get defaultTimeout(): number {
    return this.config.defaultTimeout;
  }
  get authUsername(): string {
    return this.config.authUsername;
  }
  get authPassword(): string {
    return this.config.authPassword;
  }
  get adminUsername(): string {
    return this.config.adminUsername;
  }
  get adminPassword(): string {
    return this.config.adminPassword;
  }

  private require(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(
        `Required environment variable "${key}" is not set. Check your .env file.`,
      );
    }
    return value;
  }
}
```

### Logger.ts

```typescript
import * as winston from "winston";
import * as path from "path";

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    const logLevel = process.env.LOG_LEVEL || "info";
    const logDir = path.resolve(process.cwd(), "reports/logs");

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp }) => {
              return `[${timestamp}] ${level}: ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: path.join(logDir, "error.log"),
          level: "error",
        }),
        new winston.transports.File({
          filename: path.join(logDir, "combined.log"),
        }),
      ],
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string): void {
    this.logger.info(message);
  }
  debug(message: string): void {
    this.logger.debug(message);
  }
  warn(message: string): void {
    this.logger.warn(message);
  }
  error(message: string, error?: Error): void {
    if (error) {
      this.logger.error(message, { error: error.message, stack: error.stack });
    } else {
      this.logger.error(message);
    }
  }
}
```

### DataHelper.ts

```typescript
import { faker } from "@faker-js/faker";

export class DataHelper {
  static generateUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.countryCode(),
      },
    };
  }

  static generateOrder() {
    return {
      productId: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 100 }),
      price: parseFloat(faker.commerce.price()),
      currency: "USD",
    };
  }

  static generateEmail(): string {
    return faker.internet.email();
  }

  static generateUUID(): string {
    return faker.string.uuid();
  }

  static generatePassword(): string {
    return faker.internet.password({ length: 16, memorable: false });
  }

  static randomInteger(min: number, max: number): number {
    return faker.number.int({ min, max });
  }

  static randomElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }
}
```

### RetryHelper.ts

```typescript
import { Logger } from "@utils/logger/Logger";

const logger = Logger.getInstance();

export class RetryHelper {
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 1000,
    backoffMultiplier: number = 2,
  ): Promise<T> {
    let lastError: Error | undefined;
    let delay = delayMs;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        logger.warn(
          `Attempt ${attempt}/${maxAttempts} failed: ${lastError.message}`,
        );
        if (attempt < maxAttempts) {
          await RetryHelper.sleep(delay);
          delay *= backoffMultiplier;
        }
      }
    }

    throw new Error(
      `All ${maxAttempts} attempts failed. Last error: ${lastError?.message}`,
    );
  }

  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

---

## Environment Configuration

The framework supports multiple environments through named `.env` files. The active environment is selected via the `TEST_ENV` environment variable at runtime.

Never hardcode credentials or URLs in test code. All external configuration must come from environment variables. Sensitive values must never be committed to source control.

Provide a `.env.example` file that documents all required variables:

```
BASE_URL=
API_BASE_URL=
API_VERSION=v1
TEST_ENV=development
HEADLESS=true
DEFAULT_TIMEOUT=60000
LOG_LEVEL=info
AUTH_USERNAME=
AUTH_PASSWORD=
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

Switching environments at runtime:

```bash
TEST_ENV=staging npm run cucumber
TEST_ENV=production npm run test
```

---

## Test Data Management

Test data is managed at three levels.

**Static test data** is stored in `config/testdata/` as JSON files. This data is stable, pre-existing in all environments (seeded), and referenced by ID or key. Use this for lookup data like product catalogs, country codes, or role definitions.

**Dynamic test data** is generated at runtime using `DataHelper.ts` and `faker-js`. Use this for user accounts, orders, and any data that must be unique per test run. Generated data is stored in the CustomWorld's `testData` map so it can be shared between steps.

**Environment-specific credentials** are stored in environment files and accessed through `ConfigManager`. Never generate credentials at runtime for accounts that require specific backend state.

After each test, created resources should be cleaned up. Define a teardown strategy using Cucumber's After hooks to delete records created during the scenario.

---

## Authentication Flows

Authentication state should be initialized once per test suite run where possible to avoid the overhead of logging in before every test.

### AuthService.ts

```typescript
import { ApiClient } from "@api/client/ApiClient";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService extends ApiClient {
  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await this.post("/api/v1/auth/login", { email, password });
    if (!response.ok()) {
      throw new Error(`Login failed with status ${response.status()}`);
    }
    const body = await response.json();
    return {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      expiresIn: body.expires_in,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await this.post("/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    });
    if (!response.ok()) {
      throw new Error(`Token refresh failed with status ${response.status()}`);
    }
    return response.json();
  }

  async logout(token: string): Promise<void> {
    await this.post("/api/v1/auth/logout", { token });
  }
}
```

For UI tests, use Playwright's `storageState` to save and restore authentication cookies and localStorage, avoiding full login sequences on every test.

```typescript
// Save auth state after successful login
await page.context().storageState({ path: 'config/auth/storageState.json' });

// Reuse auth state in playwright.config.ts
use: {
  storageState: 'config/auth/storageState.json',
}
```

---

## Parallel Execution

Playwright Test runs test files in parallel by default. Configure the degree of parallelism with the `workers` option in `playwright.config.ts`. Cucumber runs scenarios in parallel with the `parallel` option in `cucumber.config.ts`.

For parallel safety, every test must be fully independent. Tests must not share state, write to the same files, use the same static user accounts, or depend on execution order.

Key principles for parallel-safe tests:

Each test creates its own test data. Each API test scenario uses its own `APIRequestContext` instance. Each UI test scenario runs in its own `BrowserContext`. Tests that share a database should use unique identifiers generated at runtime. Cleanup is always scoped to data created within the current test.

For CI pipelines with large test suites, split tests across multiple workers or machines using test sharding:

```bash
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

---

## Test Retries and Stability

Configure retries in `playwright.config.ts` for CI environments where transient failures from network latency or environment instability are expected.

```typescript
retries: process.env.CI ? 2 : 0,
```

For Cucumber, configure retries in `cucumber.config.ts`:

```typescript
retry: process.env.CI ? 1 : 0,
```

For individual flaky steps, use `RetryHelper.retry()` to wrap unstable operations with exponential backoff. Do not use retries to mask genuine bugs. Investigate and fix any test that fails consistently.

Tag flaky tests with `@flaky` and monitor them separately until the root cause is resolved.

---

## Logging

All test activity is logged through the central `Logger` class. Do not use `console.log` in framework code.

Log levels from most verbose to least:

- `debug`: Detailed internal state, request/response bodies, locator resolutions
- `info`: Test step start, navigation events, API calls initiated
- `warn`: Non-fatal issues, retry attempts, unexpected but recoverable states
- `error`: Test failures, assertion errors, unrecoverable states

In CI environments, set `LOG_LEVEL=info` to reduce noise. Locally during debugging, set `LOG_LEVEL=debug`.

Logs are written to `reports/logs/combined.log` and `reports/logs/error.log`.

---

## Reporting

The framework generates three types of reports.

**Allure Report** is the primary report for enterprise use. It provides a rich dashboard with test execution history, trends, failure categories, attached screenshots, and step-level details.

Generate and open Allure report:

```bash
npm run report:allure:generate
npm run report:allure:open
```

**Playwright HTML Report** is built into the Playwright Test runner and requires no additional setup. It shows a visual trace viewer for failed tests.

```bash
npm run report:playwright
```

**Cucumber HTML Report** is generated by the Cucumber runner for BDD scenarios. It maps test results directly to Gherkin feature files so stakeholders can read results in business language.

Generated automatically when running Cucumber tests. Located at `reports/cucumber-report/index.html`.

---

## Running Tests Locally

### Run all Playwright tests

```bash
npm test
```

### Run tests against a specific environment

```bash
TEST_ENV=staging npm test
```

### Run only UI tests on Chromium

```bash
npm run test:ui
```

### Run API tests only

```bash
npm run test:api
```

### Run all Cucumber BDD scenarios

```bash
npm run cucumber
```

### Run Cucumber API scenarios only

```bash
npm run cucumber:api
```

### Run Cucumber UI scenarios only

```bash
npm run cucumber:ui
```

### Run smoke tests only

```bash
npm run cucumber:smoke
```

### Run scenarios with a specific tag

```bash
npm run cucumber:tags -- "@users and not @skip"
```

### Run a specific feature file

```bash
npx cucumber-js tests/features/api/users/create-user.feature --config cucumber.config.ts
```

### Run Playwright tests in debug mode (headed with inspector)

```bash
npm run test:debug
```

### Run Playwright tests headed (visible browser)

```bash
npm run test:headed
```

---

## Running Tests in CI/CD

### GitHub Actions example

```yaml
name: Automation Test Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 2 * * *"

jobs:
  test-api:
    name: API Tests
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      - name: Run API tests
        env:
          TEST_ENV: staging
          BASE_URL: ${{ secrets.STAGING_BASE_URL }}
          API_BASE_URL: ${{ secrets.STAGING_API_BASE_URL }}
          AUTH_USERNAME: ${{ secrets.STAGING_AUTH_USERNAME }}
          AUTH_PASSWORD: ${{ secrets.STAGING_AUTH_PASSWORD }}
          ADMIN_USERNAME: ${{ secrets.STAGING_ADMIN_USERNAME }}
          ADMIN_PASSWORD: ${{ secrets.STAGING_ADMIN_PASSWORD }}
        run: npm run cucumber:api
      - name: Generate Allure report
        if: always()
        run: npm run report:allure:generate
      - name: Upload Allure report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-report-api
          path: reports/allure-report/

  test-ui:
    name: UI Tests
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium firefox
      - name: Run UI tests
        env:
          TEST_ENV: staging
          CI: true
          BASE_URL: ${{ secrets.STAGING_BASE_URL }}
          API_BASE_URL: ${{ secrets.STAGING_API_BASE_URL }}
          AUTH_USERNAME: ${{ secrets.STAGING_AUTH_USERNAME }}
          AUTH_PASSWORD: ${{ secrets.STAGING_AUTH_PASSWORD }}
          ADMIN_USERNAME: ${{ secrets.STAGING_ADMIN_USERNAME }}
          ADMIN_PASSWORD: ${{ secrets.STAGING_ADMIN_PASSWORD }}
        run: npm run test:ui
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-ui
          path: reports/playwright-html/
```

---

## Generating and Viewing Reports

### Generate Allure report from existing results

```bash
npm run report:allure:generate
```

### Open Allure report in browser

```bash
npm run report:allure:open
```

### View Playwright HTML report

```bash
npm run report:playwright
```

### View Cucumber HTML report

Open `reports/cucumber-report/index.html` directly in a browser.

### Clean all report artifacts before a fresh run

```bash
npm run clean
```

---

## Scaling for Enterprise Projects

### Organizing 300+ APIs

Group API services by bounded context or domain rather than by HTTP method. Each domain directory in `src/api/services/` becomes the responsibility of the team that owns that domain. Define a clear naming convention for service classes and maintain a service registry document listing all available service classes and the APIs they cover.

Introduce interface contracts for all request and response models. When an API contract changes, TypeScript compilation will surface all affected locations automatically.

### Managing large test suites

Tag every test with at least a suite tag (`@api` or `@ui`), a domain tag (`@users`, `@orders`, `@payments`), and an execution tier tag (`@smoke`, `@regression`, `@sanity`). This allows selective execution at any granularity.

Use Playwright's `testProject` configuration to split tests by domain and assign different worker counts based on the stability and runtime of each domain.

### Shared step definitions

Avoid duplicating step definitions. Maintain a `shared/` directory under `tests/step-definitions/` for steps that are used across multiple feature domains. Document shared steps in a central glossary for feature file authors.

### Test isolation and database state

For API tests that create data, implement a teardown registry pattern. Each test registers cleanup callbacks that execute in the After hook regardless of whether the test passed or failed. This prevents test data accumulation in shared environments.

For read-only API tests, use dedicated read-only test accounts with minimal permissions so that these tests can run without affecting state.

### Modular fixture system

For Playwright Test spec files, build a layered fixture system using `test.extend()`. Create base fixtures for API context and authentication, then extend them with domain-specific fixtures for commonly needed objects like authenticated user sessions or pre-created order records.

### Performance and flakiness monitoring

Track test execution time per test file over multiple runs. Tests that consistently exceed three times the average execution time are candidates for optimization. Track the flakiness rate (failure rate on retry) per test. Tests with a flakiness rate above two percent should be investigated before being promoted to the smoke suite.

---

## Best Practices

### Writing step definitions

Step definitions should be thin. They read the step parameters, call a service class or page object method, and store the result in the World context. Assertions belong in the Then steps and should use the World context data, not call APIs directly.

### Naming conventions

Feature files use lowercase kebab-case: `create-user.feature`. Step definition files match their feature file names. Page object classes use PascalCase suffixed with the page type: `LoginPage`, `OrderListPage`. API service classes use PascalCase suffixed with `Service`: `UserService`, `PaymentService`.

### Locator strategy for UI tests

Prefer `data-testid` attributes over CSS selectors, XPath, or text-based locators. Work with the development team to establish a `data-testid` naming convention that is consistently applied to all interactive and observable elements. This eliminates test breakage from styling or layout changes.

### Assertions

Use Playwright's `expect` with web-first assertions that automatically wait and retry: `expect(locator).toBeVisible()`, `expect(locator).toHaveText()`. For API tests, assert both the HTTP status code and the response body schema before asserting individual field values.

### Test independence

Every test must be able to run in isolation and in any order. Never rely on a previous test having run. Never depend on state left over from a previous test. Each test is responsible for arranging its own preconditions.

### Code review standards

All new feature files must have corresponding step definitions that compile without errors. All new page objects must extend `BasePage`. All new API service classes must extend `ApiClient`. No hardcoded URLs, credentials, or environment-specific values in source code. Every pull request adding new tests must include tag annotations.

### Version control practices

Feature files and step definitions are committed together. Model changes and service class changes are committed together. Environment example files are updated whenever a new environment variable is introduced. Test configuration changes are documented in the pull request description.

---

## Framework Maintenance

Review and update Playwright, Cucumber, and Allure versions on a quarterly basis. Playwright in particular releases frequently with performance improvements and new capabilities. Maintain a changelog for the framework itself, separate from the application changelog. Assign a framework maintainer role within the QA team to own dependency updates, architectural decisions, and onboarding documentation.

---

_Framework version: 1.0.0. Maintained by the QA Engineering team._
