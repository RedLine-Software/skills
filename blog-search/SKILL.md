---
name: blog-search
description: Retrieve and search blog posts from RedlineSoft. Use when the user asks for blog content, search, or information from blog.redlinesoft.net.
---

# Search Blog

## Overview

This skill allows you to search and retrieve blog content from RedlineSoft using the machine-readable `llm.txt` index.

## Workflow

### 1. Ingestion
Fetch the raw text from: `https://blog.redlinesoft.net/llm.txt`

### 2. Search
Parse the fetched text for keywords. The format is `[Title](URL)`.
Example regex for parsing: `^\[(.*)\]\((.*)\)$`

### 3. Retrieval
If a post is selected, fetch the full content from its URL.

## Examples

- **Search**: "Find posts about AI Agents on RedlineSoft blog."
- **Latest**: "Show me the 5 most recent blog posts."
- **Content**: "Read the post about PydanticAI and summarize it."
