# Homework 11: Controller Unit Tests and Route Integration Testing

## 🧩 Task Definition

**HW #11** focuses on building **comprehensive controller and route tests** for all main API endpoints.

**Main goals:**

-   Write unit and integration tests for all controllers.
-   Cover `/login` and `/employees` routes using **supertest**.
-   Use **Node’s native test runner** (`node:test`) instead of Jest.
-   Ensure that **all HTTP methods** (`GET`, `POST`, `PATCH`, `DELETE`) are fully tested.
-   Validate correct behavior for authentication, authorization, validation, and error handling.

**Run tests:**

```bash
npm run test-controller
```

Make sure all tests pass ✅

---

## 📝 Description

This project is a **TypeScript + Express.js** backend for managing employees, featuring:

-   **Role-based access control** (Admin / User)
-   **JWT authentication**
-   **Zod-based validation**
-   **Structured logging**
-   **Local file persistence** for employee data
-   **Comprehensive automated testing**

The main purpose of this homework is to test all routes and ensure controllers behave correctly in all scenarios — success, validation errors, missing tokens, and forbidden access.

---

## 🎯 Purpose

To practice **writing unit and integration tests** in a production-style Node.js backend:

-   Understand controller logic and request/response handling.
-   Learn to use **Supertest** for endpoint testing.
-   Verify correct **HTTP status codes** and **response bodies**.
-   Strengthen understanding of Express middleware chains and JWT-based auth.

---

## ✨ Features

-   🔐 **JWT Authentication** for secure access
-   👥 **Role-based Authorization** (`ADMIN` / `USER`)
-   🧾 **Employee CRUD** endpoints with validation
-   🧩 **Controller-level unit tests**
-   🧪 **Integration tests** via Supertest
-   📁 **In-memory + file persistence** (`data/employees.json`)
-   🧠 **TypeScript + Zod** for safe data models
-   🪵 **Winston logger** for structured logs

---

## 🔍 How It Works

1. **Login** (`POST /login`):

    - User sends credentials (`email`, `password`).
    - If valid → returns JWT.
    - If invalid → 400 "Wrong Credentials".

2. **Employees CRUD:**

    - `GET /employees` → available for `USER` & `ADMIN`
    - `POST /employees` → only `ADMIN`
    - `PATCH /employees/:id` → only `ADMIN`
    - `DELETE /employees/:id` → only `ADMIN`

3. **Authentication Middleware:**

    - Checks for `Authorization: Bearer <token>`
    - Decodes token, attaches user role to request.

4. **Authorization Middleware:**

    - Validates if role matches required access.

5. **Validation:**

    - Zod ensures employee data has valid fields (e.g. salary range, correct URL).

6. **Error Handling:**

    - Centralized error handler catches Zod and custom errors.
    - Sends consistent JSON responses.

---

## 📜 Output Example

**✅ Successful Login**

```json
{
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5...",
	"user": {
		"email": "user@tel-ran.com",
		"role": "USER"
	}
}
```

**✅ Employee Created (Admin Only)**

```json
{
	"id": "e123",
	"fullName": "John Doe",
	"department": "QA",
	"salary": 10000,
	"avatar": "https://example.com/avatar.png",
	"birthDate": "2000-01-01"
}
```

**❌ Unauthorized**

```json
{ "error": { "message": "Unauthorized" } }
```

---

## 📦 Usage

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Create `.env` file

```env
PORT=3000
JWT_SECRET=secret_key
```

### 3️⃣ Run development server

```bash
npm run dev
```

### 4️⃣ Run controller tests

```bash
npm run test-controller
```

---

## 🚀 Usage Examples (HTTP)

**Login:**

```bash
curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{"email":"user@tel-ran.com","password":"User12345"}'
```

**Create Employee (ADMIN):**

```bash
curl -X POST http://localhost:3000/employees \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{"fullName":"John Doe","department":"QA","salary":10000,"avatar":"https://example.com/avatar.png","birthDate":"2000-01-01"}'
```

**Get Employees:**

```bash
curl -X GET http://localhost:3000/employees \
-H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 🗂 Project Structure

```
src/
├── config/
│   ├── loadEnv.ts
│   └── storageConfig.ts
├── controller/
│   ├── accountingController.ts
│   └── employeeController.ts
├── middleware/
│   ├── auth/
│   ├── errorHandlers/
│   └── validations/
├── model/
│   ├── dtoTypes/
│   └── errorTypes/
├── route/
│   ├── authRoutes.ts
│   └── employeeRoutes.ts
├── service/
│   ├── accounting/
│   └── employee/
├── utils/
│   ├── logger.ts
│   ├── security/
│   └── fileStorage.ts
└── __tests__/
    ├── employeeRoutesTests/
    ├── loginRoutesTests/
    └── testData/
```

---

## ✅ Dependencies

| Package          | Purpose                     |
| ---------------- | --------------------------- |
| **express**      | Web server                  |
| **dotenv**       | Env variable loader         |
| **jsonwebtoken** | JWT creation & verification |
| **bcrypt**       | Password hashing            |
| **uuid**         | Unique IDs                  |
| **zod**          | Data validation             |
| **morgan**       | HTTP request logger         |
| **winston**      | Custom structured logger    |
| **supertest**    | HTTP request testing        |
| **node:test**    | Built-in test runner        |
| **ts-node**      | TypeScript execution        |

---

## 📄 License

MIT License

---

## 🧮 Conclusion

Homework #11 consolidates all backend testing practices:

-   Writing **controller-level tests**.
-   Using **Supertest** to validate Express routes.
-   Ensuring **authentication, authorization, and validation** logic is correct.
-   Following **clean architecture and logging best practices**.

All tests pass ✅ — the backend is stable, secure, and fully verified.

---

Made with ❤️ and `TypeScript` by **Sam-Shepsl Malikin**
