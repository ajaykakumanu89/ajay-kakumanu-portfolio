# Task API reference

Original synthetic portfolio exercise. This reference describes the accompanying [local demo server](server.py), not a former employer's API.

**Default base URL:** `http://127.0.0.1:8765`

Requests must use the exact paths shown below. Query strings and trailing slashes are not supported. GET and POST responses produced by the routes below use `Content-Type: application/json; charset=utf-8`. Object property order and JSON whitespace are not significant.

## GET /health

Check whether the server responds. No request body is required.

**Success:** `200 OK`

```json
{"status":"ok"}
```

This endpoint checks only that this local server can answer a request. It does not check a database or downstream service.

## GET /tasks

Return all tasks created during the current process lifetime, in creation order. No request body is required.

**Success:** `200 OK`

```json
{"tasks":[{"id":1,"title":"Review the quickstart"}]}
```

`tasks` is an array. If no tasks exist, the response is `{"tasks":[]}`.

## POST /tasks

Create one task.

**Required headers:**

| Header | Value |
| --- | --- |
| `Content-Type` | `application/json` (a charset parameter is accepted) |
| `Content-Length` | Size of the body in bytes; PowerShell's `Invoke-RestMethod` supplies this for the quickstart requests |

**Request body:** a UTF-8 JSON object with exactly one field.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `title` | string | Yes | Remove leading and trailing whitespace, then require 1 to 200 Unicode code points. Internal whitespace is preserved. |

Unknown fields are rejected. The maximum body size is 8,192 bytes, including JSON syntax and whitespace.

```json
{"title":"Review the quickstart"}
```

**Success:** `201 Created`

```json
{"id":1,"title":"Review the quickstart"}
```

| Response field | Type | Meaning |
| --- | --- | --- |
| `id` | integer | Server-assigned identifier, starting at 1 and increasing for each successful creation |
| `title` | string | Validated title with leading and trailing whitespace removed |

IDs reset and tasks are discarded when the process stops. Retrying a successful POST creates another task; there is no duplicate detection or idempotency mechanism.

### POST error responses

Each error body contains one `error` string. For requests with multiple problems, validation stops at the first applicable check in this table's order.

| Status | Condition | Exact `error` value |
| --- | --- | --- |
| `404 Not Found` | Path is not exactly `/tasks` | `Route not found.` |
| `415 Unsupported Media Type` | Missing or unsupported `Content-Type` | `Use Content-Type: application/json.` |
| `411 Length Required` | Missing `Content-Length` | `Content-Length is required.` |
| `400 Bad Request` | `Content-Length` is not an integer | `Content-Length must be an integer.` |
| `400 Bad Request` | Negative `Content-Length` | `Content-Length cannot be negative.` |
| `413 Request Entity Too Large` | Body exceeds 8,192 bytes | `Request body exceeds 8192 bytes.` |
| `400 Bad Request` | Invalid UTF-8, malformed JSON, or empty body | `Body must be valid UTF-8 JSON.` |
| `400 Bad Request` | Body is not an object with exactly the `title` field | `Body must be an object containing only title.` |
| `400 Bad Request` | Title is not a string, is blank after trimming, or exceeds 200 characters after trimming | `title must be a string of 1 to 200 characters after trimming.` |

Example validation failure:

```json
{"error":"title must be a string of 1 to 200 characters after trimming."}
```

## Unknown routes and unsupported methods

Unknown GET or POST routes return `404 Not Found` with `{"error":"Route not found."}`.

Other methods, including PUT, PATCH, DELETE, HEAD, and OPTIONS, are not implemented. Python's HTTP handler returns `501 Not Implemented` with its default HTML error page for those methods; they do not use this demo's JSON error format.

## Limits

This demo binds to `127.0.0.1` and processes requests sequentially. It has no authentication, TLS, persistent storage, CORS support, pagination, or production hardening. The title length limit uses Python string length, so a visible symbol made from several Unicode code points can count as multiple characters. See the [quickstart](README.md) to run the sample locally.
