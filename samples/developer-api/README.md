# Task API: developer quickstart

An original, synthetic portfolio sample for Ajay Kakumanu. This small API and its documentation were created as a portfolio exercise; they are not a product or deliverable from a previous employer.

**Audience:** a developer making their first HTTP requests from Windows PowerShell.

**Goal:** start the local server, create a task, and retrieve it in about five minutes.

## Before you begin

- Install Python 3.9 or later and make `python` available in your terminal.
- Use Windows PowerShell 5.1 or PowerShell 7.
- Open a terminal at the root of this repository. No additional Python packages, API key, or account is needed.

Check Python:

```powershell
python --version
```

Expected: `Python 3.9` or a newer version. If Windows uses the Python launcher instead, replace `python` with `py -3` in the commands below.

## 1. Start the server

In your first terminal:

```powershell
Set-Location .\samples\developer-api
python .\server.py
```

Expected startup message:

```text
Task API listening at http://127.0.0.1:8765 (Ctrl+C to stop)
```

Leave this terminal running. The server listens only on the local loopback address.

## 2. Check the server

Open a second PowerShell terminal. It can use any working directory.

```powershell
$baseUrl = 'http://127.0.0.1:8765'
Invoke-RestMethod -Uri "$baseUrl/health" | ConvertTo-Json -Compress
```

Expected JSON:

```json
{"status":"ok"}
```

## 3. Create a task

```powershell
$body = @{ title = 'Review the quickstart' } | ConvertTo-Json
$task = Invoke-RestMethod -Method Post -Uri "$baseUrl/tasks" -ContentType 'application/json' -Body $body
$task | ConvertTo-Json -Compress
```

Expected JSON on a newly started server:

```json
{"id":1,"title":"Review the quickstart"}
```

The response uses HTTP status `201 Created`. Each successful request gets the next integer ID. Repeating this request creates a second task; it does not replace the first one.

## 4. Retrieve tasks

```powershell
Invoke-RestMethod -Uri "$baseUrl/tasks" | ConvertTo-Json -Compress
```

Expected JSON after creating exactly one task:

```json
{"tasks":[{"id":1,"title":"Review the quickstart"}]}
```

A fresh server returns `{"tasks":[]}`. Tasks exist only in memory and disappear when you stop the process.

## 5. Check an invalid request

This request deliberately uses a blank title:

```powershell
try {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/tasks" -ContentType 'application/json' -Body '{"title":"   "}' -ErrorAction Stop
} catch {
    [int]$_.Exception.Response.StatusCode
}
```

Expected output:

```text
400
```

The response body is:

```json
{"error":"title must be a string of 1 to 200 characters after trimming."}
```

PowerShell throws an exception for non-success HTTP responses. The `catch` block above prints the status; it does not print the response body. See the [API reference](api-reference.md) for all documented errors.

## 6. Stop the server

Return to the first terminal and press **Ctrl+C**. Restarting the server starts an empty task list with the next ID reset to `1`.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `python` is not recognized, or opens the Microsoft Store | Confirm Python is installed and on PATH. Try `py -3 --version` and then `py -3 .\server.py`. |
| The client cannot connect | Keep the first terminal running. Confirm the startup message and use `http`, address `127.0.0.1`, and the same port in both terminals. |
| Startup reports that the address is already in use | Run `python .\server.py --port 8766`, then set `$baseUrl = 'http://127.0.0.1:8766'` in the client terminal. |
| HTTP `400` | Send a JSON object with only a `title` field. Use a string containing 1 to 200 characters after surrounding whitespace is removed. |
| HTTP `404` | Use the exact route `/health` or `/tasks`. Trailing slashes and query strings are not supported. |
| HTTP `415` | Add `-ContentType 'application/json'` to the POST request. |
| Your task list is empty after a restart | This demo does not save tasks to disk. Create the task again. |

## Writing decisions and scope

The quickstart separates server and client terminals, shows the result after each action, and includes a failed request so readers can recognize validation errors. The reference records exact behavior rather than implying features that the sample does not implement.

This is a learning demo using Python's standard-library HTTP server. It has no authentication, TLS, persistence, task editing, task deletion, pagination, or production deployment configuration. It is intended for a single local learner. Do not use it as a hosted service or enter confidential information into sample tasks.

For implementation details, read [server.py](server.py). For the request contract, read [api-reference.md](api-reference.md).

## Verification record

On October 18, 2026, the sample was run locally with Python 3.12.14 and PowerShell 7.6.5. Live HTTP checks passed for the health response, an initially empty task list, creation and retrieval of the quickstart task, HTTP `201`, increasing IDs, and title trimming. Negative checks passed for a blank title (`400`), malformed JSON (`400`), an unknown field (`400`), an unsupported content type (`415`), and a trailing-slash route (`404`). The temporary server process was stopped after verification.

Windows PowerShell 5.1 compatibility is based on the commands used; that version was not executed in this verification. These local functional checks do not establish production readiness or performance.
