# Common Workflows

This guide provides an overview of common development tasks you can perform with Claude Code.

## Bug Fixing
1.  **Provide the error message**: Paste the error message or a description of the bug into the chat.
2.  **Let Claude explore**: Claude will read the relevant files to understand the context of the bug.
3.  **Approve the plan**: Claude will propose a plan to fix the bug.
4.  **Verify the fix**: After Claude implements the fix, run your tests to ensure the bug is resolved and no new issues have been introduced.

## Refactoring
1.  **Specify the refactoring goal**: For example, "refactor the `Auth` class to use the singleton pattern".
2.  **Review the plan**: Claude will propose a plan for the refactoring.
3.  **Apply the changes**: Claude will apply the refactoring changes.
4.  **Test**: Run your tests to ensure the refactored code still works as expected.

## Writing Tests
1.  **Specify the file to test**: For example, "write unit tests for `src/utils/math.ts`".
2.  **Review the generated tests**: Claude will generate a new test file with test cases.
3.  **Run the tests**: Run the new tests to ensure they pass and accurately test the code.
