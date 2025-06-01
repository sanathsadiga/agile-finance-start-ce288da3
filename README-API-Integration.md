
# Java Spring API Integration Guide

This frontend has been prepared to work with your Java Spring backend. All Supabase dependencies have been removed and replaced with API service calls.

## API Services Structure

The following service files have been created to handle API calls:

### Core Services
- `src/services/api.ts` - Base API configuration and request handler
- `src/services/authService.ts` - Authentication operations
- `src/services/invoiceService.ts` - Invoice management
- `src/services/expenseService.ts` - Expense management
- `src/services/blogService.ts` - Blog content management

### Configuration
- `src/config/api.ts` - API endpoints and configuration

## Environment Setup

Create a `.env` file in your project root with:
```
REACT_APP_API_URL=http://localhost:8080/api
```

Update this URL to match your Spring Boot server location.

## Required Spring Boot Endpoints

Your Java Spring backend should implement the following REST endpoints:

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - User logout

### Invoices
- `GET /api/invoices` - Get user's invoices
- `GET /api/invoices/{id}` - Get specific invoice
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice
- `POST /api/invoices/{id}/send` - Send invoice via email
- `GET /api/invoices/{id}/pdf` - Generate PDF

### Expenses
- `GET /api/expenses` - Get user's expenses
- `GET /api/expenses/{id}` - Get specific expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Blogs (Public)
- `GET /api/blogs` - Get published blogs
- `GET /api/blogs/{slug}` - Get blog by slug

### Admin Endpoints
- `GET /api/admin/blogs` - Get all blogs (admin)
- `POST /api/admin/blogs` - Create blog (admin)
- `PUT /api/admin/blogs/{id}` - Update blog (admin)
- `DELETE /api/admin/blogs/{id}` - Delete blog (admin)

## Authentication Flow

1. User logs in via `/api/auth/login`
2. Backend returns JWT token and user data
3. Frontend stores token in localStorage
4. All subsequent requests include `Authorization: Bearer {token}` header

## Data Models

Refer to the TypeScript interfaces in the service files for the expected JSON structure:
- `Invoice` interface in `invoiceService.ts`
- `Expense` interface in `expenseService.ts`
- `Blog` interface in `blogService.ts`

## Error Handling

The API service includes error handling that expects your Spring backend to return:
- HTTP status codes (200, 400, 401, 404, 500, etc.)
- JSON error responses with meaningful messages

## CORS Configuration

Make sure your Spring Boot application allows CORS from your frontend domain:

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class YourController {
    // endpoints
}
```

## Next Steps

1. Update `REACT_APP_API_URL` in your environment
2. Implement the required endpoints in your Spring Boot backend
3. Test the integration by running both frontend and backend
4. Update the API service methods if your backend uses different data structures

All UI components and designs remain exactly the same - only the data layer has been changed to use REST APIs instead of Supabase.
