---
slug: designing-a-rest-assured-api-automation-framework
title: How to Design a REST Assured API Automation Framework with Cucumber, Java, Maven, and Extent Reports
description: Learn how to design a robust API automation framework using REST Assured, Cucumber, Java, Maven, and Extent Reports. This guide provides a comprehensive approach to building a scalable and maintainable test suite for large-scale backend applications.
author: Gyana prakash Khandual
date: 2026-03-14
tags: [testing, beginner, qa]
coverImage: /images/intro-testing.jpg
---
# REST Assured API Automation Framework
## Integrated with Cucumber, Java, Maven, and Extent Reports

A professional, scalable, and maintainable API test automation framework built for testing large-scale backend applications with 300+ APIs. This guide covers every layer from project setup to CI/CD integration, following industry-tested best practices as of 2026.

---

## Table of Contents

1. [Framework Overview](#1-framework-overview)
2. [Technology Stack](#2-technology-stack)
3. [Prerequisites](#3-prerequisites)
4. [Project Structure](#4-project-structure)
5. [Maven Dependencies (pom.xml)](#5-maven-dependencies-pomxml)
6. [Core Configuration](#6-core-configuration)
7. [Building the Framework Layer by Layer](#7-building-the-framework-layer-by-layer)
   - 7.1 [Base API Client](#71-base-api-client)
   - 7.2 [Configuration Manager](#72-configuration-manager)
   - 7.3 [Authentication Handler](#73-authentication-handler)
   - 7.4 [Request Builder](#74-request-builder)
   - 7.5 [Response Handler](#75-response-handler)
   - 7.6 [Assertion Library](#76-assertion-library)
   - 7.7 [Data Provider and Test Data Management](#77-data-provider-and-test-data-management)
   - 7.8 [Cucumber Feature Files](#78-cucumber-feature-files)
   - 7.9 [Step Definitions](#79-step-definitions)
   - 7.10 [Hooks (Before and After)](#710-hooks-before-and-after)
   - 7.11 [Cucumber Runner](#711-cucumber-runner)
8. [Extent Report Integration](#8-extent-report-integration)
9. [Logging with Log4j2](#9-logging-with-log4j2)
10. [Environment Management](#10-environment-management)
11. [Database Validation Layer](#11-database-validation-layer)
12. [Parallel Execution](#12-parallel-execution)
13. [Retry Mechanism for Flaky Tests](#13-retry-mechanism-for-flaky-tests)
14. [CI/CD Integration](#14-cicd-integration)
15. [Running the Framework](#15-running-the-framework)
16. [Best Practices](#16-best-practices)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. Framework Overview

This framework is designed for teams testing enterprise-grade backend systems at scale. It addresses the following real-world challenges:

- Managing hundreds of API endpoints across multiple modules
- Handling complex authentication flows (OAuth2, JWT, API Keys, Session-based)
- Maintaining test data across multiple environments (DEV, QA, STAGING, PROD)
- Producing readable, stakeholder-friendly test reports
- Supporting parallel test execution to reduce pipeline duration
- Providing clear separation between test logic and business language via Cucumber BDD
- Enabling schema validation, response chaining, and contract testing

The architecture follows a layered approach where each layer has a single responsibility, making it easy to maintain, extend, and debug.

---

## 2. Technology Stack

| Component | Tool | Version (2026) |
|-----------|------|----------------|
| Language | Java | 21 LTS |
| Build Tool | Maven | 3.9.x |
| API Testing | REST Assured | 5.5.0 |
| BDD Layer | Cucumber | 7.20.1 |
| Test Runner | JUnit 5 | 5.11.x |
| Reporting | Extent Reports | 5.1.2 |
| Logging | Log4j2 | 2.23.x |
| Assertions | AssertJ | 3.26.x |
| JSON Parsing | Jackson | 2.18.x |
| Schema Validation | JSON Schema Validator | 5.5.0 |
| Fake Test Data | JavaFaker | 1.0.2 |
| Database | JDBC / Spring JDBC | 6.x |
| Config Management | Owner | 1.0.12 |
| HTTP Client | Apache HttpClient 5 | 5.3.x |

---

## 3. Prerequisites

Ensure the following are installed and configured before starting:

- Java Development Kit (JDK) 21 LTS
- Apache Maven 3.9.x
- Git 2.x or above
- An IDE such as IntelliJ IDEA 2024+ (recommended) or Eclipse
- Access to the target backend application environment (DEV or QA)
- Docker (optional, for spinning up test environments locally)

Verify your Java and Maven installations:

```bash
java -version
mvn -version
```

---

## 4. Project Structure

The structure below is designed for maintainability and scalability across 300+ APIs. Each directory has a clear, single-purpose role.

```
api-automation-framework/
│
├── pom.xml
├── README.md
├── .gitignore
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── yourcompany/
│   │   │           └── framework/
│   │   │               ├── config/
│   │   │               │   ├── ConfigManager.java
│   │   │               │   ├── EnvironmentConfig.java
│   │   │               │   └── AppConfig.java
│   │   │               │
│   │   │               ├── client/
│   │   │               │   ├── BaseApiClient.java
│   │   │               │   ├── RequestBuilder.java
│   │   │               │   └── ResponseHandler.java
│   │   │               │
│   │   │               ├── auth/
│   │   │               │   ├── AuthManager.java
│   │   │               │   ├── OAuth2Handler.java
│   │   │               │   ├── JwtHandler.java
│   │   │               │   └── ApiKeyHandler.java
│   │   │               │
│   │   │               ├── assertions/
│   │   │               │   ├── ResponseAssertions.java
│   │   │               │   ├── SchemaValidator.java
│   │   │               │   └── DatabaseAssertions.java
│   │   │               │
│   │   │               ├── db/
│   │   │               │   ├── DatabaseManager.java
│   │   │               │   └── QueryExecutor.java
│   │   │               │
│   │   │               ├── models/
│   │   │               │   ├── request/
│   │   │               │   │   ├── UserRequest.java
│   │   │               │   │   ├── OrderRequest.java
│   │   │               │   │   └── ProductRequest.java
│   │   │               │   └── response/
│   │   │               │       ├── UserResponse.java
│   │   │               │       ├── OrderResponse.java
│   │   │               │       └── ErrorResponse.java
│   │   │               │
│   │   │               ├── reporting/
│   │   │               │   ├── ExtentReportManager.java
│   │   │               │   └── ReportLogger.java
│   │   │               │
│   │   │               └── utils/
│   │   │                   ├── JsonUtils.java
│   │   │                   ├── DateUtils.java
│   │   │                   ├── RandomDataGenerator.java
│   │   │                   ├── FileUtils.java
│   │   │                   └── RetryAnalyzer.java
│   │   │
│   │   └── resources/
│   │       ├── config/
│   │       │   ├── config-dev.properties
│   │       │   ├── config-qa.properties
│   │       │   ├── config-staging.properties
│   │       │   └── config-prod.properties
│   │       │
│   │       ├── schemas/
│   │       │   ├── user/
│   │       │   │   ├── create-user-response-schema.json
│   │       │   │   └── get-user-response-schema.json
│   │       │   └── order/
│   │       │       └── create-order-response-schema.json
│   │       │
│   │       └── log4j2.xml
│   │
│   └── test/
│       ├── java/
│       │   └── com/
│       │       └── yourcompany/
│       │           └── tests/
│       │               ├── runners/
│       │               │   ├── TestRunner.java
│       │               │   └── ParallelTestRunner.java
│       │               │
│       │               ├── stepdefinitions/
│       │               │   ├── UserSteps.java
│       │               │   ├── AuthSteps.java
│       │               │   ├── OrderSteps.java
│       │               │   ├── ProductSteps.java
│       │               │   └── CommonSteps.java
│       │               │
│       │               ├── hooks/
│       │               │   └── Hooks.java
│       │               │
│       │               └── context/
│       │                   └── ScenarioContext.java
│       │
│       └── resources/
│           ├── features/
│           │   ├── auth/
│           │   │   └── authentication.feature
│           │   ├── user/
│           │   │   ├── create_user.feature
│           │   │   ├── update_user.feature
│           │   │   └── delete_user.feature
│           │   ├── order/
│           │   │   ├── create_order.feature
│           │   │   └── order_lifecycle.feature
│           │   └── product/
│           │       └── product_search.feature
│           │
│           └── testdata/
│               ├── users/
│               │   ├── valid_users.json
│               │   └── invalid_users.json
│               └── orders/
│                   └── order_payloads.json
│
├── reports/
│   └── extent/
│       └── (generated at runtime)
│
└── logs/
    └── (generated at runtime)
```

---

## 5. Maven Dependencies (pom.xml)

This is the complete, production-ready `pom.xml` with all dependencies pinned to stable 2026 versions.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>com.yourcompany</groupId>
    <artifactId>api-automation-framework</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>API Automation Framework</name>
    <description>REST Assured + Cucumber + Maven + Extent Report Framework</description>

    <properties>
        <java.version>21</java.version>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <!-- Core Dependency Versions -->
        <rest-assured.version>5.5.0</rest-assured.version>
        <cucumber.version>7.20.1</cucumber.version>
        <junit5.version>5.11.3</junit5.version>
        <jackson.version>2.18.2</jackson.version>
        <assertj.version>3.26.3</assertj.version>
        <extent-reports.version>5.1.2</extent-reports.version>
        <log4j2.version>2.23.1</log4j2.version>
        <owner.version>1.0.12</owner.version>
        <javafaker.version>1.0.2</javafaker.version>
        <json-schema-validator.version>5.5.0</json-schema-validator.version>
        <allure.version>2.28.0</allure.version>
        <lombok.version>1.18.36</lombok.version>
    </properties>

    <dependencies>

        <!-- =============================== -->
        <!-- REST ASSURED                    -->
        <!-- =============================== -->
        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>rest-assured</artifactId>
            <version>${rest-assured.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>json-path</artifactId>
            <version>${rest-assured.version}</version>
        </dependency>

        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>xml-path</artifactId>
            <version>${rest-assured.version}</version>
        </dependency>

        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>json-schema-validator</artifactId>
            <version>${json-schema-validator.version}</version>
        </dependency>

        <!-- =============================== -->
        <!-- CUCUMBER                        -->
        <!-- =============================== -->
        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-java</artifactId>
            <version>${cucumber.version}</version>
        </dependency>

        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-junit-platform-engine</artifactId>
            <version>${cucumber.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-picocontainer</artifactId>
            <version>${cucumber.version}</version>
            <scope>test</scope>
        </dependency>

        <!-- =============================== -->
        <!-- JUNIT 5                         -->
        <!-- =============================== -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>${junit5.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>${junit5.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.junit.platform</groupId>
            <artifactId>junit-platform-suite</artifactId>
            <version>1.11.3</version>
            <scope>test</scope>
        </dependency>

        <!-- =============================== -->
        <!-- JACKSON (JSON Processing)       -->
        <!-- =============================== -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>${jackson.version}</version>
        </dependency>

        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-annotations</artifactId>
            <version>${jackson.version}</version>
        </dependency>

        <dependency>
            <groupId>com.fasterxml.jackson.datatype</groupId>
            <artifactId>jackson-datatype-jsr310</artifactId>
            <version>${jackson.version}</version>
        </dependency>

        <!-- =============================== -->
        <!-- EXTENT REPORTS                  -->
        <!-- =============================== -->
        <dependency>
            <groupId>com.aventstack</groupId>
            <artifactId>extentreports</artifactId>
            <version>${extent-reports.version}</version>
        </dependency>

        <!-- =============================== -->
        <!-- LOGGING (LOG4J2)               -->
        <!-- =============================== -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>${log4j2.version}</version>
        </dependency>

        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>${log4j2.version}</version>
        </dependency>

        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j2-impl</artifactId>
            <version>${log4j2.version}</version>
        </dependency>

        <!-- =============================== -->
        <!-- ASSERTIONS (ASSERTJ)            -->
        <!-- =============================== -->
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>${assertj.version}</version>
            <scope>test</scope>
        </dependency>

        <!-- =============================== -->
        <!-- CONFIGURATION MANAGEMENT        -->
        <!-- =============================== -->
        <dependency>
            <groupId>org.aeonbits.owner</groupId>
            <artifactId>owner</artifactId>
            <version>${owner.version}</version>
        </dependency>

        <!-- =============================== -->
        <!-- TEST DATA GENERATION            -->
        <!-- =============================== -->
        <dependency>
            <groupId>com.github.javafaker</groupId>
            <artifactId>javafaker</artifactId>
            <version>${javafaker.version}</version>
        </dependency>

        <!-- =============================== -->
        <!-- LOMBOK                          -->
        <!-- =============================== -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
            <scope>provided</scope>
        </dependency>

        <!-- =============================== -->
        <!-- DATABASE (OPTIONAL)             -->
        <!-- =============================== -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>6.1.14</version>
        </dependency>

        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>9.1.0</version>
        </dependency>

        <!-- =============================== -->
        <!-- APACHE HTTP CLIENT 5            -->
        <!-- =============================== -->
        <dependency>
            <groupId>org.apache.httpcomponents.client5</groupId>
            <artifactId>httpclient5</artifactId>
            <version>5.3.1</version>
        </dependency>

        <!-- =============================== -->
        <!-- GOOGLE GSON                     -->
        <!-- =============================== -->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.11.0</version>
        </dependency>

    </dependencies>

    <build>
        <plugins>

            <!-- Maven Compiler Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>

            <!-- Maven Surefire Plugin for JUnit 5 + Cucumber -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.5.1</version>
                <configuration>
                    <includes>
                        <include>**/runners/**Runner.java</include>
                    </includes>
                    <systemPropertyVariables>
                        <env>${env}</env>
                        <cucumber.filter.tags>${cucumber.filter.tags}</cucumber.filter.tags>
                    </systemPropertyVariables>
                    <forkCount>4</forkCount>
                    <reuseForks>true</reuseForks>
                    <parallel>methods</parallel>
                    <threadCount>4</threadCount>
                </configuration>
            </plugin>

            <!-- Maven Resources Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <version>3.3.1</version>
            </plugin>

        </plugins>
    </build>

</project>
```

---

## 6. Core Configuration

### 6.1 Environment Properties

**src/main/resources/config/config-qa.properties**

```properties
# Base URLs
base.url=https://api.qa.yourcompany.com
auth.url=https://auth.qa.yourcompany.com

# Authentication
client.id=your-client-id
client.secret=your-client-secret
api.key=your-api-key

# Database
db.url=jdbc:mysql://qa-db.yourcompany.com:3306/app_db
db.username=qa_user
db.password=qa_password
db.pool.size=10

# Timeouts (milliseconds)
connection.timeout=30000
read.timeout=60000
write.timeout=60000

# Report
report.path=reports/extent/
report.name=API_Test_Report

# Retry
retry.count=2
retry.delay.ms=1000
```

**src/main/resources/config/config-dev.properties**

```properties
base.url=https://api.dev.yourcompany.com
auth.url=https://auth.dev.yourcompany.com
client.id=dev-client-id
client.secret=dev-client-secret
api.key=dev-api-key
db.url=jdbc:mysql://dev-db.yourcompany.com:3306/app_db
db.username=dev_user
db.password=dev_password
db.pool.size=5
connection.timeout=30000
read.timeout=60000
write.timeout=60000
report.path=reports/extent/
report.name=API_Test_Report_DEV
retry.count=1
retry.delay.ms=500
```

---

## 7. Building the Framework Layer by Layer

### 7.1 Base API Client

This is the central class that every test goes through. It configures REST Assured globally, applies default headers, handles SSL, and manages request/response logging.

**src/main/java/com/yourcompany/framework/client/BaseApiClient.java**

```java
package com.yourcompany.framework.client;

import com.yourcompany.framework.auth.AuthManager;
import com.yourcompany.framework.config.ConfigManager;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.config.HttpClientConfig;
import io.restassured.config.RestAssuredConfig;
import io.restassured.config.SSLConfig;
import io.restassured.filter.log.LogDetail;
import io.restassured.filter.log.RequestLoggingFilter;
import io.restassured.filter.log.ResponseLoggingFilter;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.PrintStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

public class BaseApiClient {

    private static final Logger log = LogManager.getLogger(BaseApiClient.class);
    private static RequestSpecification requestSpec;
    private static ResponseSpecification responseSpec;
    private static final ConfigManager config = ConfigManager.getInstance();

    static {
        initialize();
    }

    private static void initialize() {
        RestAssured.baseURI = config.getBaseUrl();

        RestAssured.config = RestAssuredConfig.config()
            .httpClient(HttpClientConfig.httpClientConfig()
                .setParam("http.connection.timeout", config.getConnectionTimeout())
                .setParam("http.socket.timeout", config.getReadTimeout()))
            .sslConfig(SSLConfig.sslConfig().relaxedHTTPSValidation());

        ByteArrayOutputStream requestCapture = new ByteArrayOutputStream();
        ByteArrayOutputStream responseCapture = new ByteArrayOutputStream();

        requestSpec = new RequestSpecBuilder()
            .setBaseUri(config.getBaseUrl())
            .setContentType(ContentType.JSON)
            .setAccept(ContentType.JSON)
            .addHeader("X-Request-Source", "automation-framework")
            .addFilter(new RequestLoggingFilter(
                LogDetail.ALL, true,
                new PrintStream(requestCapture, true, StandardCharsets.UTF_8)))
            .addFilter(new ResponseLoggingFilter(
                LogDetail.ALL, true,
                new PrintStream(responseCapture, true, StandardCharsets.UTF_8)))
            .build();

        responseSpec = new ResponseSpecBuilder()
            .build();

        log.info("BaseApiClient initialized. Base URI: {}", config.getBaseUrl());
    }

    public static RequestSpecification getRequestSpec() {
        return requestSpec;
    }

    public static ResponseSpecification getResponseSpec() {
        return responseSpec;
    }

    public static RequestSpecification getAuthenticatedRequestSpec() {
        String token = AuthManager.getInstance().getValidToken();
        return new RequestSpecBuilder()
            .addRequestSpecification(requestSpec)
            .addHeader("Authorization", "Bearer " + token)
            .build();
    }

    public static RequestSpecification getApiKeyRequestSpec() {
        return new RequestSpecBuilder()
            .addRequestSpecification(requestSpec)
            .addHeader("X-API-Key", config.getApiKey())
            .build();
    }
}
```

---

### 7.2 Configuration Manager

**src/main/java/com/yourcompany/framework/config/ConfigManager.java**

```java
package com.yourcompany.framework.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigManager {

    private static final Logger log = LogManager.getLogger(ConfigManager.class);
    private static ConfigManager instance;
    private final Properties properties;

    private ConfigManager() {
        properties = new Properties();
        String env = System.getProperty("env", "qa");
        String configFile = "config/config-" + env + ".properties";

        try (InputStream input = getClass().getClassLoader().getResourceAsStream(configFile)) {
            if (input == null) {
                throw new RuntimeException("Config file not found: " + configFile);
            }
            properties.load(input);
            log.info("Loaded configuration for environment: {}", env);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load config: " + configFile, e);
        }
    }

    public static synchronized ConfigManager getInstance() {
        if (instance == null) {
            instance = new ConfigManager();
        }
        return instance;
    }

    public String getBaseUrl() {
        return getProperty("base.url");
    }

    public String getAuthUrl() {
        return getProperty("auth.url");
    }

    public String getClientId() {
        return getProperty("client.id");
    }

    public String getClientSecret() {
        return getProperty("client.secret");
    }

    public String getApiKey() {
        return getProperty("api.key");
    }

    public String getDbUrl() {
        return getProperty("db.url");
    }

    public String getDbUsername() {
        return getProperty("db.username");
    }

    public String getDbPassword() {
        return getProperty("db.password");
    }

    public int getConnectionTimeout() {
        return Integer.parseInt(getProperty("connection.timeout", "30000"));
    }

    public int getReadTimeout() {
        return Integer.parseInt(getProperty("read.timeout", "60000"));
    }

    public String getReportPath() {
        return getProperty("report.path", "reports/extent/");
    }

    public String getReportName() {
        return getProperty("report.name", "API_Test_Report");
    }

    public int getRetryCount() {
        return Integer.parseInt(getProperty("retry.count", "1"));
    }

    private String getProperty(String key) {
        String value = System.getProperty(key, properties.getProperty(key));
        if (value == null) {
            throw new RuntimeException("Property not found: " + key);
        }
        return value.trim();
    }

    private String getProperty(String key, String defaultValue) {
        return System.getProperty(key, properties.getProperty(key, defaultValue)).trim();
    }
}
```

---

### 7.3 Authentication Handler

**src/main/java/com/yourcompany/framework/auth/AuthManager.java**

```java
package com.yourcompany.framework.auth;

import com.yourcompany.framework.config.ConfigManager;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.Instant;

public class AuthManager {

    private static final Logger log = LogManager.getLogger(AuthManager.class);
    private static AuthManager instance;
    private final ConfigManager config;

    private String accessToken;
    private Instant tokenExpiry;

    private AuthManager() {
        this.config = ConfigManager.getInstance();
    }

    public static synchronized AuthManager getInstance() {
        if (instance == null) {
            instance = new AuthManager();
        }
        return instance;
    }

    public String getValidToken() {
        if (isTokenExpired()) {
            refreshToken();
        }
        return accessToken;
    }

    private boolean isTokenExpired() {
        return accessToken == null || tokenExpiry == null
            || Instant.now().isAfter(tokenExpiry.minusSeconds(60));
    }

    private void refreshToken() {
        log.info("Refreshing authentication token...");

        var response = RestAssured
            .given()
                .baseUri(config.getAuthUrl())
                .contentType(ContentType.URLENC)
                .formParam("grant_type", "client_credentials")
                .formParam("client_id", config.getClientId())
                .formParam("client_secret", config.getClientSecret())
            .when()
                .post("/oauth2/token")
            .then()
                .statusCode(200)
                .extract().response();

        this.accessToken = response.jsonPath().getString("access_token");
        int expiresIn = response.jsonPath().getInt("expires_in");
        this.tokenExpiry = Instant.now().plusSeconds(expiresIn);

        log.info("Token refreshed successfully. Expires in {} seconds.", expiresIn);
    }

    public void invalidateToken() {
        this.accessToken = null;
        this.tokenExpiry = null;
    }
}
```

---

### 7.4 Request Builder

The RequestBuilder provides a fluent API to construct complex requests in a clean and readable way.

**src/main/java/com/yourcompany/framework/client/RequestBuilder.java**

```java
package com.yourcompany.framework.client;

import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import io.restassured.RestAssured;

import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;

public class RequestBuilder {

    private RequestSpecification spec;
    private final Map<String, String> pathParams = new HashMap<>();
    private final Map<String, String> queryParams = new HashMap<>();
    private final Map<String, String> headers = new HashMap<>();
    private Object body;
    private boolean useAuth = true;

    public RequestBuilder() {
        this.spec = BaseApiClient.getAuthenticatedRequestSpec();
    }

    public RequestBuilder withBody(Object body) {
        this.body = body;
        return this;
    }

    public RequestBuilder withPathParam(String key, String value) {
        this.pathParams.put(key, value);
        return this;
    }

    public RequestBuilder withQueryParam(String key, String value) {
        this.queryParams.put(key, value);
        return this;
    }

    public RequestBuilder withHeader(String key, String value) {
        this.headers.put(key, value);
        return this;
    }

    public RequestBuilder withoutAuth() {
        this.spec = BaseApiClient.getRequestSpec();
        this.useAuth = false;
        return this;
    }

    public Response get(String endpoint) {
        return buildRequest().get(endpoint);
    }

    public Response post(String endpoint) {
        return buildRequest().post(endpoint);
    }

    public Response put(String endpoint) {
        return buildRequest().put(endpoint);
    }

    public Response patch(String endpoint) {
        return buildRequest().patch(endpoint);
    }

    public Response delete(String endpoint) {
        return buildRequest().delete(endpoint);
    }

    private RequestSpecification buildRequest() {
        RequestSpecification req = given().spec(spec);

        if (!pathParams.isEmpty()) req = req.pathParams(pathParams);
        if (!queryParams.isEmpty()) req = req.queryParams(queryParams);
        if (!headers.isEmpty()) req = req.headers(headers);
        if (body != null) req = req.body(body);

        return req;
    }
}
```

---

### 7.5 Response Handler

**src/main/java/com/yourcompany/framework/client/ResponseHandler.java**

```java
package com.yourcompany.framework.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.response.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class ResponseHandler {

    private static final Logger log = LogManager.getLogger(ResponseHandler.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private final Response response;

    public ResponseHandler(Response response) {
        this.response = response;
    }

    public int getStatusCode() {
        return response.getStatusCode();
    }

    public String getBody() {
        return response.getBody().asString();
    }

    public String getJsonPath(String path) {
        return response.jsonPath().getString(path);
    }

    public int getJsonPathAsInt(String path) {
        return response.jsonPath().getInt(path);
    }

    public <T> T deserialize(Class<T> clazz) {
        try {
            return objectMapper.readValue(response.asString(), clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize response to " + clazz.getSimpleName(), e);
        }
    }

    public String getHeader(String headerName) {
        return response.getHeader(headerName);
    }

    public long getResponseTime() {
        return response.getTime();
    }

    public Response getRawResponse() {
        return response;
    }

    public void logResponse() {
        log.info("Status Code: {}", response.getStatusCode());
        log.info("Response Time: {} ms", response.getTime());
        log.debug("Response Body: {}", response.getBody().asPrettyString());
    }
}
```

---

### 7.6 Assertion Library

**src/main/java/com/yourcompany/framework/assertions/ResponseAssertions.java**

```java
package com.yourcompany.framework.assertions;

import io.restassured.response.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import static org.assertj.core.api.Assertions.assertThat;

public class ResponseAssertions {

    private static final Logger log = LogManager.getLogger(ResponseAssertions.class);
    private final Response response;

    public ResponseAssertions(Response response) {
        this.response = response;
    }

    public ResponseAssertions hasStatusCode(int expectedStatusCode) {
        int actual = response.getStatusCode();
        log.info("Asserting status code: expected={}, actual={}", expectedStatusCode, actual);
        assertThat(actual)
            .as("Expected status code %d but got %d. Body: %s",
                expectedStatusCode, actual, response.getBody().asPrettyString())
            .isEqualTo(expectedStatusCode);
        return this;
    }

    public ResponseAssertions hasJsonField(String jsonPath) {
        Object value = response.jsonPath().get(jsonPath);
        assertThat(value)
            .as("Expected JSON path '%s' to exist in response", jsonPath)
            .isNotNull();
        return this;
    }

    public ResponseAssertions hasJsonFieldValue(String jsonPath, Object expectedValue) {
        Object actualValue = response.jsonPath().get(jsonPath);
        assertThat(actualValue)
            .as("JSON path '%s' mismatch", jsonPath)
            .isEqualTo(expectedValue);
        return this;
    }

    public ResponseAssertions hasNonEmptyBody() {
        assertThat(response.getBody().asString())
            .as("Response body should not be empty")
            .isNotEmpty();
        return this;
    }

    public ResponseAssertions hasResponseTimeLessThan(long maxMilliseconds) {
        long actualTime = response.getTime();
        assertThat(actualTime)
            .as("Response time %d ms exceeds threshold of %d ms", actualTime, maxMilliseconds)
            .isLessThan(maxMilliseconds);
        return this;
    }

    public ResponseAssertions hasHeader(String headerName, String expectedValue) {
        String actualValue = response.getHeader(headerName);
        assertThat(actualValue)
            .as("Header '%s' mismatch", headerName)
            .isEqualTo(expectedValue);
        return this;
    }

    public ResponseAssertions hasContentType(String contentType) {
        assertThat(response.getContentType())
            .as("Content-Type mismatch")
            .contains(contentType);
        return this;
    }
}
```

---

### 7.7 Data Provider and Test Data Management

**src/main/java/com/yourcompany/framework/utils/JsonUtils.java**

```java
package com.yourcompany.framework.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

public class JsonUtils {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    private JsonUtils() {}

    public static <T> T readFromFile(String filePath, Class<T> clazz) {
        try (InputStream is = JsonUtils.class.getClassLoader().getResourceAsStream(filePath)) {
            if (is == null) throw new RuntimeException("File not found: " + filePath);
            return objectMapper.readValue(is, clazz);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read JSON from file: " + filePath, e);
        }
    }

    public static List<Map<String, Object>> readListFromFile(String filePath) {
        try (InputStream is = JsonUtils.class.getClassLoader().getResourceAsStream(filePath)) {
            if (is == null) throw new RuntimeException("File not found: " + filePath);
            return objectMapper.readValue(is, new TypeReference<>() {});
        } catch (IOException e) {
            throw new RuntimeException("Failed to read JSON list from file: " + filePath, e);
        }
    }

    public static String toJson(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize object to JSON", e);
        }
    }

    public static String toPrettyJson(Object object) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(object);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize object to pretty JSON", e);
        }
    }

    public static JsonNode parseJson(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON string", e);
        }
    }
}
```

**src/main/java/com/yourcompany/framework/utils/RandomDataGenerator.java**

```java
package com.yourcompany.framework.utils;

import com.github.javafaker.Faker;

import java.util.Locale;

public class RandomDataGenerator {

    private static final Faker faker = new Faker(new Locale("en-US"));

    private RandomDataGenerator() {}

    public static String randomFirstName() { return faker.name().firstName(); }
    public static String randomLastName() { return faker.name().lastName(); }
    public static String randomEmail() { return faker.internet().emailAddress(); }
    public static String randomPhone() { return faker.phoneNumber().cellPhone(); }
    public static String randomUUID() { return java.util.UUID.randomUUID().toString(); }
    public static String randomAlphanumeric(int length) { return faker.regexify("[a-z0-9]{" + length + "}"); }
    public static int randomInt(int min, int max) { return faker.number().numberBetween(min, max); }
    public static double randomPrice() { return faker.number().randomDouble(2, 1, 10000); }
    public static String randomAddress() { return faker.address().streetAddress(); }
    public static String randomCity() { return faker.address().city(); }
    public static String randomCountry() { return faker.address().country(); }
    public static String randomCompanyName() { return faker.company().name(); }
    public static String randomProductName() { return faker.commerce().productName(); }
}
```

---

### 7.8 Cucumber Feature Files

Feature files live in `src/test/resources/features/`. They are written in plain English and represent complete business scenarios.

**src/test/resources/features/user/create_user.feature**

```gherkin
@smoke @user
Feature: User Management API

  Background:
    Given the API is accessible and the user is authenticated

  @positive
  Scenario: Successfully create a new user with valid data
    Given I have a valid user creation payload
    When I send a POST request to "/api/v1/users"
    Then the response status code should be 201
    And the response body should contain field "id"
    And the response body should contain field "email"
    And the response should match the "create-user" JSON schema
    And the response time should be less than 3000 milliseconds

  @positive @data-driven
  Scenario Outline: Create users with multiple valid roles
    Given I have a user payload with role "<role>" and email "<email>"
    When I send a POST request to "/api/v1/users"
    Then the response status code should be 201
    And the "role" field in the response should equal "<role>"

    Examples:
      | role      | email                         |
      | ADMIN     | admin.test@yourcompany.com    |
      | VIEWER    | viewer.test@yourcompany.com   |
      | EDITOR    | editor.test@yourcompany.com   |

  @negative
  Scenario: Reject user creation with missing required email
    Given I have a user payload without an email address
    When I send a POST request to "/api/v1/users"
    Then the response status code should be 400
    And the "error.code" field in the response should equal "VALIDATION_ERROR"
    And the "error.message" field in the response should contain "email"

  @negative
  Scenario: Reject user creation with duplicate email
    Given a user already exists with email "existing@yourcompany.com"
    When I attempt to create another user with the same email
    Then the response status code should be 409
    And the "error.code" field in the response should equal "EMAIL_ALREADY_EXISTS"
```

**src/test/resources/features/order/order_lifecycle.feature**

```gherkin
@regression @order
Feature: Order Lifecycle API

  Background:
    Given the API is accessible and the user is authenticated

  @e2e
  Scenario: Complete end-to-end order lifecycle
    Given a product exists with ID stored in context as "productId"
    When I create an order using the product stored as "productId"
    Then the response status code should be 201
    And I store the response field "id" as "orderId"

    When I send a GET request to "/api/v1/orders/{orderId}"
    Then the response status code should be 200
    And the "status" field in the response should equal "PENDING"

    When I send a PATCH request to "/api/v1/orders/{orderId}/confirm"
    Then the response status code should be 200
    And the "status" field in the response should equal "CONFIRMED"

    When I send a DELETE request to "/api/v1/orders/{orderId}"
    Then the response status code should be 204

  @negative
  Scenario: Reject order with out-of-stock product
    Given a product exists with stock quantity 0
    When I attempt to create an order for that product
    Then the response status code should be 422
    And the "error.code" field in the response should equal "OUT_OF_STOCK"
```

---

### 7.9 Step Definitions

Step definitions bind Cucumber Gherkin steps to actual REST Assured API calls.

**src/test/java/com/yourcompany/tests/stepdefinitions/UserSteps.java**

```java
package com.yourcompany.tests.stepdefinitions;

import com.yourcompany.framework.assertions.ResponseAssertions;
import com.yourcompany.framework.client.RequestBuilder;
import com.yourcompany.framework.utils.RandomDataGenerator;
import com.yourcompany.tests.context.ScenarioContext;
import io.cucumber.java.en.*;
import io.restassured.response.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class UserSteps {

    private static final Logger log = LogManager.getLogger(UserSteps.class);
    private final ScenarioContext context;
    private Response response;

    public UserSteps(ScenarioContext context) {
        this.context = context;
    }

    @Given("I have a valid user creation payload")
    public void iHaveAValidUserCreationPayload() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("firstName", RandomDataGenerator.randomFirstName());
        payload.put("lastName", RandomDataGenerator.randomLastName());
        payload.put("email", RandomDataGenerator.randomEmail());
        payload.put("role", "VIEWER");
        context.set("userPayload", payload);
        log.info("Generated user payload: {}", payload);
    }

    @Given("I have a user payload with role {string} and email {string}")
    public void iHaveAUserPayloadWithRoleAndEmail(String role, String email) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("firstName", RandomDataGenerator.randomFirstName());
        payload.put("lastName", RandomDataGenerator.randomLastName());
        payload.put("email", email);
        payload.put("role", role);
        context.set("userPayload", payload);
    }

    @Given("I have a user payload without an email address")
    public void iHaveAUserPayloadWithoutEmail() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("firstName", RandomDataGenerator.randomFirstName());
        payload.put("lastName", RandomDataGenerator.randomLastName());
        context.set("userPayload", payload);
    }

    @When("I send a POST request to {string}")
    public void iSendAPostRequestTo(String endpoint) {
        Object payload = context.get("userPayload");
        response = new RequestBuilder()
            .withBody(payload)
            .post(endpoint);
        context.set("response", response);
        log.info("POST {} => Status {}", endpoint, response.getStatusCode());
    }

    @When("I send a GET request to {string}")
    public void iSendAGetRequestTo(String endpoint) {
        String resolvedEndpoint = context.resolvePlaceholders(endpoint);
        response = new RequestBuilder().get(resolvedEndpoint);
        context.set("response", response);
        log.info("GET {} => Status {}", resolvedEndpoint, response.getStatusCode());
    }

    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(int expectedStatus) {
        Response res = context.get("response");
        new ResponseAssertions(res).hasStatusCode(expectedStatus);
    }

    @Then("the response body should contain field {string}")
    public void theResponseBodyShouldContainField(String jsonPath) {
        Response res = context.get("response");
        new ResponseAssertions(res).hasJsonField(jsonPath);
    }

    @Then("the {string} field in the response should equal {string}")
    public void theFieldInTheResponseShouldEqual(String jsonPath, String expectedValue) {
        Response res = context.get("response");
        new ResponseAssertions(res).hasJsonFieldValue(jsonPath, expectedValue);
    }

    @Then("the response time should be less than {int} milliseconds")
    public void theResponseTimeShouldBeLessThan(int maxMs) {
        Response res = context.get("response");
        new ResponseAssertions(res).hasResponseTimeLessThan(maxMs);
    }

    @Then("I store the response field {string} as {string}")
    public void iStoreTheResponseFieldAs(String jsonPath, String contextKey) {
        Response res = context.get("response");
        String value = res.jsonPath().getString(jsonPath);
        assertThat(value).as("Field '%s' was null in response", jsonPath).isNotNull();
        context.set(contextKey, value);
        log.info("Stored '{}' = '{}' in context", contextKey, value);
    }
}
```

---

### 7.10 Hooks (Before and After)

**src/test/java/com/yourcompany/tests/hooks/Hooks.java**

```java
package com.yourcompany.tests.hooks;

import com.yourcompany.framework.reporting.ExtentReportManager;
import com.yourcompany.tests.context.ScenarioContext;
import io.cucumber.java.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Hooks {

    private static final Logger log = LogManager.getLogger(Hooks.class);
    private final ScenarioContext context;

    public Hooks(ScenarioContext context) {
        this.context = context;
    }

    @BeforeAll
    public static void globalSetup() {
        ExtentReportManager.initReport();
        log.info("=== Global Test Suite Started ===");
    }

    @Before
    public void beforeScenario(Scenario scenario) {
        log.info("Starting scenario: {}", scenario.getName());
        ExtentReportManager.createTest(scenario.getName(), scenario.getSourceTagNames().toString());
        context.setCurrentScenario(scenario);
    }

    @After
    public void afterScenario(Scenario scenario) {
        if (scenario.isFailed()) {
            log.error("Scenario FAILED: {}", scenario.getName());
            ExtentReportManager.failTest(scenario.getName());
        } else {
            log.info("Scenario PASSED: {}", scenario.getName());
            ExtentReportManager.passTest(scenario.getName());
        }
        context.reset();
    }

    @AfterAll
    public static void globalTearDown() {
        ExtentReportManager.flushReport();
        log.info("=== Global Test Suite Completed ===");
    }
}
```

**src/test/java/com/yourcompany/tests/context/ScenarioContext.java**

```java
package com.yourcompany.tests.context;

import io.cucumber.java.Scenario;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ScenarioContext {

    private static final Logger log = LogManager.getLogger(ScenarioContext.class);
    private final Map<String, Object> context = new HashMap<>();
    private Scenario currentScenario;

    public void set(String key, Object value) {
        context.put(key, value);
    }

    @SuppressWarnings("unchecked")
    public <T> T get(String key) {
        return (T) context.get(key);
    }

    public boolean contains(String key) {
        return context.containsKey(key);
    }

    public void reset() {
        context.clear();
    }

    public void setCurrentScenario(Scenario scenario) {
        this.currentScenario = scenario;
    }

    public Scenario getCurrentScenario() {
        return currentScenario;
    }

    /**
     * Resolves placeholders like {orderId} using values stored in context.
     * Example: "/api/v1/orders/{orderId}" becomes "/api/v1/orders/abc-123"
     */
    public String resolvePlaceholders(String input) {
        Pattern pattern = Pattern.compile("\\{(\\w+)}");
        Matcher matcher = pattern.matcher(input);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String key = matcher.group(1);
            Object value = context.get(key);
            if (value == null) {
                throw new RuntimeException("Context key not found for placeholder: " + key);
            }
            matcher.appendReplacement(result, value.toString());
        }
        matcher.appendTail(result);
        return result.toString();
    }
}
```

---

### 7.11 Cucumber Runner

**src/test/java/com/yourcompany/tests/runners/TestRunner.java**

```java
package com.yourcompany.tests.runners;

import org.junit.platform.suite.api.*;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(
    key = "cucumber.glue",
    value = "com.yourcompany.tests.stepdefinitions, com.yourcompany.tests.hooks"
)
@ConfigurationParameter(
    key = "cucumber.plugin",
    value = "pretty, " +
            "html:reports/cucumber/cucumber-report.html, " +
            "json:reports/cucumber/cucumber-report.json, " +
            "junit:reports/cucumber/cucumber-report.xml"
)
@ConfigurationParameter(
    key = "cucumber.filter.tags",
    value = "@smoke"
)
@ConfigurationParameter(
    key = "cucumber.publish.quiet",
    value = "true"
)
public class TestRunner {
    // Entry point for Cucumber execution via JUnit Platform
}
```

---

## 8. Extent Report Integration

**src/main/java/com/yourcompany/framework/reporting/ExtentReportManager.java**

```java
package com.yourcompany.framework.reporting;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import com.yourcompany.framework.config.ConfigManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class ExtentReportManager {

    private static final Logger log = LogManager.getLogger(ExtentReportManager.class);
    private static ExtentReports extentReports;
    private static final Map<String, ExtentTest> testMap = new ConcurrentHashMap<>();
    private static final ConfigManager config = ConfigManager.getInstance();

    private ExtentReportManager() {}

    public static synchronized void initReport() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
        String reportPath = config.getReportPath() + "Report_" + timestamp + ".html";

        ExtentSparkReporter sparkReporter = new ExtentSparkReporter(reportPath);
        sparkReporter.config().setTheme(Theme.DARK);
        sparkReporter.config().setDocumentTitle("API Automation Test Report");
        sparkReporter.config().setReportName(config.getReportName());
        sparkReporter.config().setEncoding("utf-8");
        sparkReporter.config().setTimeStampFormat("MMM dd, yyyy HH:mm:ss");
        sparkReporter.config().setCss(
            ".badge-primary { background-color: #4a90e2; } "
        );

        extentReports = new ExtentReports();
        extentReports.attachReporter(sparkReporter);
        extentReports.setSystemInfo("Framework", "REST Assured + Cucumber + Extent Reports");
        extentReports.setSystemInfo("Java Version", System.getProperty("java.version"));
        extentReports.setSystemInfo("Environment", System.getProperty("env", "qa").toUpperCase());
        extentReports.setSystemInfo("Base URL", config.getBaseUrl());
        extentReports.setSystemInfo("Executed By", System.getProperty("user.name", "CI/CD"));
        extentReports.setSystemInfo("Build Number", System.getProperty("build.number", "LOCAL"));

        log.info("Extent Report initialized at: {}", reportPath);
    }

    public static synchronized void createTest(String testName, String tags) {
        ExtentTest test = extentReports.createTest(testName)
            .assignCategory(tags);
        testMap.put(getThreadKey(), test);
    }

    public static void passTest(String message) {
        ExtentTest test = testMap.get(getThreadKey());
        if (test != null) test.pass(message);
    }

    public static void failTest(String message) {
        ExtentTest test = testMap.get(getThreadKey());
        if (test != null) test.fail(message);
    }

    public static void skipTest(String message) {
        ExtentTest test = testMap.get(getThreadKey());
        if (test != null) test.skip(message);
    }

    public static void logInfo(String message) {
        ExtentTest test = testMap.get(getThreadKey());
        if (test != null) test.info(message);
    }

    public static void logRequest(String requestDetails) {
        ExtentTest test = testMap.get(getThreadKey());
        if (test != null) {
            test.info("<details><summary>Request Details</summary><pre>" + requestDetails + "</pre></details>");
        }
    }

    public static void logResponse(String responseDetails) {
        ExtentTest test = testMap.get(getThreadKey());
        if (test != null) {
            test.info("<details><summary>Response Details</summary><pre>" + responseDetails + "</pre></details>");
        }
    }

    public static synchronized void flushReport() {
        if (extentReports != null) {
            extentReports.flush();
            log.info("Extent Report flushed successfully.");
        }
    }

    private static String getThreadKey() {
        return String.valueOf(Thread.currentThread().getId());
    }
}
```

---

## 9. Logging with Log4j2

**src/main/resources/log4j2.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN" monitorInterval="30">

    <Properties>
        <Property name="LOG_PATTERN">
            %d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n
        </Property>
        <Property name="LOG_DIR">logs</Property>
    </Properties>

    <Appenders>

        <Console name="ConsoleAppender" target="SYSTEM_OUT">
            <PatternLayout pattern="${LOG_PATTERN}"/>
            <ThresholdFilter level="INFO" onMatch="ACCEPT" onMismatch="DENY"/>
        </Console>

        <RollingFile name="FileAppender"
                     fileName="${LOG_DIR}/automation.log"
                     filePattern="${LOG_DIR}/automation-%d{yyyy-MM-dd}-%i.log.gz">
            <PatternLayout pattern="${LOG_PATTERN}"/>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
                <SizeBasedTriggeringPolicy size="50MB"/>
            </Policies>
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>

        <RollingFile name="ErrorAppender"
                     fileName="${LOG_DIR}/errors.log"
                     filePattern="${LOG_DIR}/errors-%d{yyyy-MM-dd}-%i.log.gz">
            <PatternLayout pattern="${LOG_PATTERN}"/>
            <ThresholdFilter level="ERROR" onMatch="ACCEPT" onMismatch="DENY"/>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
                <SizeBasedTriggeringPolicy size="20MB"/>
            </Policies>
        </RollingFile>

    </Appenders>

    <Loggers>
        <Logger name="com.yourcompany" level="DEBUG" additivity="false">
            <AppenderRef ref="ConsoleAppender"/>
            <AppenderRef ref="FileAppender"/>
            <AppenderRef ref="ErrorAppender"/>
        </Logger>

        <Logger name="io.restassured" level="WARN" additivity="false">
            <AppenderRef ref="FileAppender"/>
        </Logger>

        <Root level="INFO">
            <AppenderRef ref="ConsoleAppender"/>
            <AppenderRef ref="FileAppender"/>
        </Root>
    </Loggers>

</Configuration>
```

---

## 10. Environment Management

Environment switching is entirely driven by a Maven system property. No code changes are needed to run against different environments.

```bash
# Run against DEV
mvn test -Denv=dev

# Run against QA
mvn test -Denv=qa

# Run against STAGING
mvn test -Denv=staging
```

To override any individual property without changing the properties file:

```bash
mvn test -Denv=qa -Dbase.url=https://custom.api.yourcompany.com
```

---

## 11. Database Validation Layer

Database validation is used to confirm that API operations correctly persisted data in the backend store.

**src/main/java/com/yourcompany/framework/db/DatabaseManager.java**

```java
package com.yourcompany.framework.db;

import com.yourcompany.framework.config.ConfigManager;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

public class DatabaseManager {

    private static final Logger log = LogManager.getLogger(DatabaseManager.class);
    private static DatabaseManager instance;
    private HikariDataSource dataSource;

    private DatabaseManager() {
        ConfigManager config = ConfigManager.getInstance();
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(config.getDbUrl());
        hikariConfig.setUsername(config.getDbUsername());
        hikariConfig.setPassword(config.getDbPassword());
        hikariConfig.setMaximumPoolSize(10);
        hikariConfig.setConnectionTimeout(30000);
        hikariConfig.setIdleTimeout(600000);
        hikariConfig.setMaxLifetime(1800000);
        this.dataSource = new HikariDataSource(hikariConfig);
        log.info("Database connection pool initialized.");
    }

    public static synchronized DatabaseManager getInstance() {
        if (instance == null) instance = new DatabaseManager();
        return instance;
    }

    public List<Map<String, Object>> executeQuery(String sql, Object... params) {
        List<Map<String, Object>> results = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            for (int i = 0; i < params.length; i++) {
                ps.setObject(i + 1, params[i]);
            }

            try (ResultSet rs = ps.executeQuery()) {
                ResultSetMetaData meta = rs.getMetaData();
                int columnCount = meta.getColumnCount();
                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    for (int i = 1; i <= columnCount; i++) {
                        row.put(meta.getColumnLabel(i), rs.getObject(i));
                    }
                    results.add(row);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Database query failed: " + sql, e);
        }
        return results;
    }

    public int executeUpdate(String sql, Object... params) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            for (int i = 0; i < params.length; i++) {
                ps.setObject(i + 1, params[i]);
            }
            return ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Database update failed: " + sql, e);
        }
    }

    public void closePool() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}
```

---

## 12. Parallel Execution

Parallel execution significantly reduces overall test suite run time for large suites with 300+ APIs.

**src/test/java/com/yourcompany/tests/runners/ParallelTestRunner.java**

```java
package com.yourcompany.tests.runners;

import org.junit.platform.suite.api.*;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(
    key = "cucumber.glue",
    value = "com.yourcompany.tests.stepdefinitions, com.yourcompany.tests.hooks"
)
@ConfigurationParameter(
    key = "cucumber.plugin",
    value = "pretty, " +
            "html:reports/cucumber/parallel-report.html, " +
            "json:reports/cucumber/parallel-report.json"
)
@ConfigurationParameter(
    key = "cucumber.execution.parallel.enabled",
    value = "true"
)
@ConfigurationParameter(
    key = "cucumber.execution.parallel.config.strategy",
    value = "fixed"
)
@ConfigurationParameter(
    key = "cucumber.execution.parallel.config.fixed.parallelism",
    value = "4"
)
public class ParallelTestRunner {}
```

Key rules for parallel-safe test design:

- Always use `ScenarioContext` (a Cucumber PicoContainer-injected class) for sharing state between step definitions. Never use static fields for per-test data.
- Never share mutable state across scenarios. Each scenario must be fully self-contained.
- Use unique test data per scenario. The `RandomDataGenerator` class ensures this by default.
- Ensure the database and backend support concurrent requests.

---

## 13. Retry Mechanism for Flaky Tests

**src/main/java/com/yourcompany/framework/utils/RetryAnalyzer.java**

```java
package com.yourcompany.framework.utils;

import com.yourcompany.framework.config.ConfigManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.extension.*;

public class RetryAnalyzer implements TestExecutionExceptionHandler {

    private static final Logger log = LogManager.getLogger(RetryAnalyzer.class);
    private static final int MAX_RETRIES = ConfigManager.getInstance().getRetryCount();
    private int retryCount = 0;

    @Override
    public void handleTestExecutionException(ExtensionContext context, Throwable throwable) throws Throwable {
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            log.warn("Test '{}' failed. Retry attempt {}/{}",
                context.getDisplayName(), retryCount, MAX_RETRIES);
        } else {
            throw throwable;
        }
    }
}
```

---

## 14. CI/CD Integration

### GitHub Actions Workflow

**.github/workflows/api-tests.yml**

```yaml
name: API Automation Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 */6 * * *'    # Run every 6 hours
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment (dev/qa/staging)'
        required: true
        default: 'qa'
      tags:
        description: 'Cucumber tags to run (e.g. @smoke)'
        required: false
        default: '@smoke'

jobs:
  api-tests:
    name: Run API Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Java 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: 'maven'

      - name: Cache Maven packages
        uses: actions/cache@v4
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
          restore-keys: ${{ runner.os }}-m2

      - name: Run API Tests
        run: |
          mvn test \
            -Denv=${{ github.event.inputs.environment || 'qa' }} \
            -Dcucumber.filter.tags="${{ github.event.inputs.tags || '@smoke' }}" \
            -Dbuild.number=${{ github.run_number }} \
        env:
          API_CLIENT_ID: ${{ secrets.API_CLIENT_ID }}
          API_CLIENT_SECRET: ${{ secrets.API_CLIENT_SECRET }}

      - name: Publish Test Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-reports-${{ github.run_number }}
          path: |
            reports/
            logs/
          retention-days: 30

      - name: Publish Cucumber Report
        uses: deblockt/cucumber-report-annotations-action@v1.7
        if: always()
        with:
          access-token: ${{ secrets.GITHUB_TOKEN }}
          path: reports/cucumber/parallel-report.json
```

### Jenkins Pipeline (Jenkinsfile)

```groovy
pipeline {
    agent any

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['qa', 'dev', 'staging'], description: 'Target environment')
        string(name: 'TAGS', defaultValue: '@smoke', description: 'Cucumber tags')
        string(name: 'THREAD_COUNT', defaultValue: '4', description: 'Parallel thread count')
    }

    environment {
        JAVA_HOME = '/usr/lib/jvm/java-21-openjdk'
        MAVEN_HOME = '/usr/local/maven'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/yourcompany/api-automation-framework.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean compile -q'
            }
        }

        stage('Run API Tests') {
            steps {
                withCredentials([
                    string(credentialsId: 'API_CLIENT_ID', variable: 'CLIENT_ID'),
                    string(credentialsId: 'API_CLIENT_SECRET', variable: 'CLIENT_SECRET')
                ]) {
                    sh """
                        mvn test \
                          -Denv=${params.ENVIRONMENT} \
                          -Dcucumber.filter.tags="${params.TAGS}" \
                          -Dbuild.number=${BUILD_NUMBER} \
                          -Dclient.id=${CLIENT_ID} \
                          -Dclient.secret=${CLIENT_SECRET}
                    """
                }
            }
        }

        stage('Publish Reports') {
            steps {
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/extent',
                    reportFiles: '*.html',
                    reportName: 'Extent API Test Report'
                ])
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/**/*', fingerprint: true
            junit 'reports/cucumber/cucumber-report.xml'
        }
        failure {
            emailext(
                subject: "FAILED: API Test Build #${BUILD_NUMBER} on ${params.ENVIRONMENT}",
                body: "Build ${BUILD_NUMBER} failed. See ${BUILD_URL} for details.",
                to: 'qa-team@yourcompany.com'
            )
        }
    }
}
```

---

## 15. Running the Framework

### Run all smoke tests

```bash
mvn test -Denv=qa -Dcucumber.filter.tags="@smoke"
```

### Run all regression tests in parallel

```bash
mvn test -Denv=qa -Dcucumber.filter.tags="@regression" -DforkCount=4 -DreuseForks=true
```

### Run a specific feature file

```bash
mvn test -Denv=qa -Dcucumber.features="src/test/resources/features/user/create_user.feature"
```

### Run by combining multiple tags

```bash
# Run scenarios tagged @smoke AND @user
mvn test -Dcucumber.filter.tags="@smoke and @user"

# Run scenarios tagged @regression but NOT @slow
mvn test -Dcucumber.filter.tags="@regression and not @slow"
```

### Run against a custom base URL

```bash
mvn test -Denv=qa -Dbase.url=https://custom-endpoint.yourcompany.com
```

### Generate only the Extent Report without rerunning tests

```bash
mvn surefire-report:report-only
```

---

## 16. Best Practices

### Test Design

- Write one scenario per business rule. Avoid testing multiple unrelated behaviors in a single scenario.
- Use the Background block only for steps that apply to every scenario in the feature file. Never put assertions in Background.
- Use Scenario Outline and Examples tables only when the test logic is genuinely the same and only data varies.
- Keep step definitions thin. All business logic, HTTP calls, and assertions belong in helper classes and page/API objects, not in step definitions.
- Never hard-code test data in step definitions or feature files. Use `RandomDataGenerator` or JSON test data files.

### API Testing Patterns

- Always validate the status code first before asserting on the response body.
- Always validate the response JSON schema for critical POST/PUT endpoints using `json-schema-validator`.
- Chain API calls through `ScenarioContext` to represent real-world user flows (create, read, update, delete).
- Assert on response time for all critical APIs using `hasResponseTimeLessThan()`.
- Use a dedicated negative testing feature file for each module to test 4xx and 5xx responses systematically.

### Framework Maintenance

- Group feature files by domain module, not by HTTP method. For example, use `user/`, `order/`, `product/` directories.
- Add a `@skip` tag to temporarily disable a flaky or broken test rather than deleting it.
- Rotate and clean log files using the rolling policy defined in `log4j2.xml`.
- Add `HikariCP` to the `pom.xml` if using the database layer, as it provides a production-grade connection pool.
- Run `mvn dependency:analyze` periodically to remove unused dependencies from the POM.

### Security

- Never commit credentials, API keys, or database passwords to the repository.
- Use environment variables or a secrets manager (AWS Secrets Manager, HashiCorp Vault, GitHub Secrets) to inject credentials at runtime.
- Apply `@prod` tag to all production-safe readonly tests and use CI rules to prevent destructive tests from running against production.

### Code Quality

- Enforce code style using the `maven-checkstyle-plugin` or a shared `.editorconfig` file.
- Set up `SpotBugs` or `PMD` in the Maven lifecycle for static analysis.
- Review Extent Reports after every CI run to detect trends in flakiness or slowness.

---

## 17. Troubleshooting

**Issue: `java.lang.ClassNotFoundException` for Cucumber runner**

Ensure `cucumber-junit-platform-engine` and `junit-platform-suite` are in scope `test` in the POM. Also confirm the `@Suite` and `@IncludeEngines("cucumber")` annotations are correct.

**Issue: Tests pass locally but fail in CI**

- Check that environment-specific credentials are injected as environment variables or system properties in the CI configuration.
- Confirm the CI agent has network access to the target API environment.
- Verify that CI is using JDK 21, not an older version.

**Issue: Extent Report is empty or not generated**

- Confirm `ExtentReportManager.initReport()` is called in `@BeforeAll`.
- Confirm `ExtentReportManager.flushReport()` is called in `@AfterAll`.
- Check write permissions on the `reports/extent/` directory.

**Issue: Parallel tests fail with shared state errors**

- Ensure that `ScenarioContext` is injected via PicoContainer, not instantiated statically.
- Verify that `AuthManager` is thread-safe (it uses `synchronized` blocks).
- Do not use static class-level variables to hold response objects in step definition classes.

**Issue: Token refresh happens too frequently**

- Check the `expires_in` field returned from your auth server.
- Adjust the buffer in `AuthManager.isTokenExpired()` from 60 seconds to a value appropriate for your token lifespan.

**Issue: REST Assured SSL errors in environments with self-signed certificates**

- The `BaseApiClient` already applies `relaxedHTTPSValidation()`. If errors persist, verify that the `rest-assured` version in the POM matches the `json-schema-validator` version.

---

## License

This framework template is intended for internal use and customization. Adapt it to fit your organization's architecture, naming conventions, and infrastructure.

---

*Last updated: 2026. Maintained by the Backend QA Automation Team.*