---
name: create-blog-post
description: Creates an Astro blog post from a given topic or reference, generates content, fetches a cover image from a free stock source like Picsum (with a random-pool fallback when Picsum is unreachable), and sets up frontmatter.
---

# Create Blog Post Skill

This skill automates the creation of a new Astro blog post in the workspace.

## Workflow

1. **Understand Topic & Generate Content**: Write a comprehensive, well-structured blog post in Markdown format based on the user's topic or reference.
2. **Download Image**: 
   - Fetch a random or relevant image from a free source like Picsum (e.g., `https://picsum.photos/1200/630`).
   - Create a filename for the image based on the post title (e.g., `my_post_title.jpg`).
   - Download the image and save it to `public/images/post/<filename>.jpg`.
     - *Command Example*: `curl -L --max-time 30 "https://picsum.photos/1200/630" -o public/images/post/<filename>.jpg`
   - **If Picsum fails, use the fallback below** (Frequently fails in this environment: HTTP 522 or connection timeout).
3. **Write Post Content**:
   - Create a new Markdown file at `src/content/posts/<filename>.md` (use the same filename prefix as the image).
   - Ensure the frontmatter exactly matches the required format.

## Cover Image Fallback: pick from the local pool

When Picsum is unreachable (timeout, 522, or 0 bytes received — verify with a short-timeout request in both PowerShell `Invoke-WebRequest` and `curl.exe` before concluding it's down), **do not leave the post without a cover and do not block**: pick a random existing image from `public/images/post/`.

```powershell
$slug = '<filename>'   # post filename without .md
$slugs = @('<all slugs of posts created in this batch>')  # exclude every new slug file

Add-Type -AssemblyName System.Drawing
$candidates = Get-ChildItem 'public/images/post/*.jpg' | Where-Object {
  $slugs -notcontains $_.BaseName -and $_.Length -ge 10240
}
$good = @()
foreach ($f in $candidates) {
  try {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    # keep cover-like images: >=1100px wide, ~16:9 (height/width between 0.45 and 0.65)
    if ($img.Width -ge 1100 -and ($img.Height / $img.Width) -ge 0.45 -and ($img.Height / $img.Width) -le 0.65) { $good += $f }
    $img.Dispose()
  } catch {}
}

# Single post: draw one image
$picked = $good | Get-Random -Count 1
Copy-Item $picked.FullName "public/images/post/$slug.jpg" -Force

# Whole batch at once: draw N distinct images, assign $picks[$i] to $slugs[$i] in order
$picks = $good | Get-Random -Count $slugs.Count
```

Rules for the fallback:

- **One distinct image per post** — never assign the same source to two posts in a batch (`Get-Random -Count N` already draws without replacement).
- **Exclude the target slug files themselves** from the candidate pool (they are the covers you are about to replace).
- **Copy over `public/images/post/<slug>.jpg`** so the frontmatter `image:` URL stays valid — no frontmatter edits needed.
- **Verify after copying**: file exists, `> 10 KB`, and is `1200x630` (or at least cover-like dimensions). All pre-existing pool images already satisfy this.
- Known trade-off: a picked image may visually duplicate a cover already used by an older post; mention this to the user and offer to re-roll.
- Last-resort option when even the pool is unsuitable: generate a deterministic cover locally with the `render-cover-image` skill (PowerShell + System.Drawing, no network required).

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

After writing the file, notify the user that the blog post and cover image have been created successfully (mention which image source was used: Picsum, local-pool fallback, or the `render-cover-image` skill).
