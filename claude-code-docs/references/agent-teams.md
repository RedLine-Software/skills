# Orchestrate teams of Claude Code sessions

Agent Teams are an experimental feature that allows multiple Claude Code sessions to work in parallel and communicate with each other.

## Enabling Agent Teams
Enable the feature with an environment variable:
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

## Team Orchestration
You can act as a team lead, assigning tasks to a team of agents:
```
> Create an agent team to build a new dashboard feature.
> I need a team of 3:
> 1. The first agent should handle the frontend (React).
> 2. The second should build the API and database (Node.js).
> 3. The third should read the code from the other two and write unit tests.
> Start working in parallel.
```

## How it Works
1.  **Shared Task List**: A shared task list is created. You can view it with `Ctrl+T`.
2.  **Parallel Execution**: The agents work on their tasks in parallel.
3.  **Peer-to-peer Messaging**: Agents can send messages to each other to coordinate.
4.  **Final Review**: The main session collects the results for your final review.

## Subagents vs Agent Teams

| | Subagents | Agent Teams |
| :--- | :--- | :--- |
| **Execution** | Sequential | Parallel |
| **Communication** | Reports to main agent only | Peer-to-peer |
| **Best for** | Specialized, isolated tasks | Large, multi-faceted features |
| **Cost** | Lower | Higher |
