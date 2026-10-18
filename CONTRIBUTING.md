# Maintaining the portfolio

Keep this repository accurate, useful, and easy to review. Prefer a small change that improves one reader task at a time.

## Update a sample

1. State the intended audience and the outcome the reader should achieve.
2. Identify the product version or source used to verify the instructions.
3. Run every documented command and compare the result with the expected output.
4. Include a useful error case and a recovery step where appropriate.
5. Record limitations and distinguish measured results from expectations.
6. Run `python scripts/check_portfolio.py` from the repository root.
7. Review `git diff --check` and the actual diff before committing.

## Attribution and ownership

Describe Ajay's contribution precisely. Identify other contributors when applicable. Use only material that may be shared, and do not place proprietary code, internal documents, customer information, or credentials in this repository.

Any AI-assisted sample should explain what the human author verified and corrected. Do not manufacture prompts, reviewer feedback, test results, or user research.

## Sample status

Use an accurate status such as `Brief`, `Draft`, `Tested portfolio demonstration`, or `Published work shared with permission`. Change the status when the supporting work is complete.

See the [content review](docs/content-review.md) for the remaining publication checks.
