---
name: create-blog-post
description: Creates an Astro blog post from a given topic or reference, generates content, fetches a cover image from a free stock source like Picsum, and sets up frontmatter.
---

# Create Blog Post Skill

This skill automates the creation of a new Astro blog post in the workspace.

## Workflow

1. **Understand Topic & Generate Content**: Write a comprehensive, well-structured blog post in Markdown format based on the user's topic or reference.
2. **Download Image**: 
   - Fetch a random or relevant image from a free source like Picsum (e.g., `https://picsum.photos/1200/630`).
   - Create a filename for the image based on the post title (e.g., `my_post_title.jpg`).
   - Download the image and save it to `public/images/post/<filename>.jpg`.
     - *Command Example*: `curl -L "https://picsum.photos/1200/630" -o public/images/post/<filename>.jpg`
3. **Write Post Content**:
   - Create a new Markdown file at `src/content/posts/<filename>.md` (use the same filename prefix as the image).
   - Ensure the frontmatter exactly matches the required format.

## Frontmatter Format

The generated Markdown file must use the following frontmatter header exactly:

```yaml
---
title: "<The Title of the Post>"
date: "<YYYY-MM-DDTHH:mm:ss+07:00>"
description: "<A concise summary of the post>"
author: "AI Assistant"
image: "https://blog.redlinesoft.net/images/post/<filename>.jpg"
alt: "<A descriptive alt text for the image>"
tags: ['tag1', 'tag2', 'tag3']
---
```

### Important Details
- **Image URL**: Must exactly follow the format `https://blog.redlinesoft.net/images/post/<filename>.jpg` to match the downloaded image.
- **Date**: Must be an ISO 8601 datetime in the Asia/Bangkok timezone (`+07:00`), e.g. `2026-03-03T08:17:17+07:00`. Use the current system datetime.
- **Author**: Must be `'AI Assistant'`.
- **Tags**: Use lower-case, hyphen-separated words.

##

After writing the file, notify the user that the blog post and cover image have been created successfully.
