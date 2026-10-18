# AI-assisted documentation: case-study plan

Status: draft brief. No AI session, tested guide, user study, or measured outcome is presented as completed work here.

## Objective and audience

Create a reproducible beginner guide for a public developer tool, then show how editorial judgment and technical verification improve an AI-assisted draft. The intended reader can use a terminal but has not used the chosen tool. A successful guide will let that reader reach one clearly defined result and recover from common errors.

Use an original public demonstration, such as a small local HTTP service. Choose and record the exact tool and version before drafting; do not insert an unverified version or command into the final sample.

## Proposed deliverables

- A short quickstart with prerequisites, tested commands, expected results, and troubleshooting.
- A source ledger linking each technical claim to official documentation, a specification, or a reproducible observation.
- A prompt and revision record containing the actual prompt, relevant model output, human corrections, and reasons for those corrections.
- A verification record listing environment, versions, commands run, actual results, and unresolved limitations.

These are planned deliverables. This brief is the only current artifact for this project.

## Proposed workflow

1. Define one reader task and its acceptance criteria. Record the operating system, shell, tool versions, and assumptions.
2. Gather primary sources and record their URLs, access dates, and supported claims in the ledger below.
3. Write a task outline and ask an AI system for a first draft using only the recorded sources. Save the real prompt and output before editing.
4. Review every technical claim. Correct unsupported commands, missing prerequisites, ambiguous terminology, and unsupported promises.
5. Execute the final instructions in a clean environment. Record the observed output, including failures and the changes they required.
6. Ask a peer to follow the guide if a reviewer is available. Record actual feedback and consent before naming anyone or quoting them.
7. Publish the guide with a concise account of what AI contributed, what the author changed, and what remains unverified.

## Source ledger template

Populate rows with actual evidence during implementation. Blank cells are intentional.

| Claim or instruction | Primary-source URL | Version and access date | Verification method | Status |
| --- | --- | --- | --- | --- |
| To be populated after choosing the tool | — | — | — | Not started |

## Prompt and correction record template

Do not reconstruct a conversation from memory or present this template as a transcript. When a real run exists, record:

| Item | Required evidence |
| --- | --- |
| AI system | Product/model label displayed at the time; run date |
| Input | Exact prompt and relevant source context actually supplied |
| Initial output | Saved excerpt or full output, with any redactions identified |
| Issue | Specific factual, structural, usability, or tone problem found |
| Correction | Exact author change and why it helps the reader |
| Verification | Source or command that supports the corrected wording |

## Verification rubric

| Area | Acceptance criterion |
| --- | --- |
| Technical accuracy | Every command and example is executed in the recorded environment; unsupported claims are removed or marked unresolved. |
| Reproducibility | Prerequisites, versions, inputs, expected output, and cleanup are explicit. |
| Reader success | The guide has one observable end result and a way to confirm it. |
| Troubleshooting | Likely errors explain symptoms, causes, and a tested recovery step. |
| Editorial quality | Headings follow the task, terminology is consistent, and steps contain one clear action. |
| Traceability | Claims, AI contributions, author corrections, and evidence can be distinguished. |
| Responsible sharing | Inputs contain no employer content, credentials, private data, or material lacking sharing permission. |

## Boundaries and evidence gaps

No time savings, quality improvement percentage, successful run, or reader outcome is claimed. The project becomes a finished case study only after the guide, sources, authentic revision record, and verification evidence are added. A polished draft alone is not evidence that instructions work.

For a working automation sample already included in this repository, see the [synthetic documentation validator](../documentation-validator/README.md).
