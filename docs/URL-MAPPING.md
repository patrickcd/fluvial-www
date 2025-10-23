# URL Mapping Reference

## Your VitePress → Astro Migration Map

### Features Section
| Original URL | Astro File Location | Type |
|-------------|-------------------|------|
| `/features/` | `src/pages/features/index.astro` | Index page (auto-generated) |
| `/features/document-management` | `src/content/features/document-management.md` | Content file |
| `/features/integration` | `src/content/features/integration.md` | Content file |
| `/features/questionnaire` | `src/content/features/questionnaire.md` | Content file |
| `/features/the-difference` | `src/content/features/the-difference.md` | Content file |
| `/features/workflow` | `src/content/features/workflow.md` | Content file |

### Solutions Section
| Original URL | Astro File Location | Type |
|-------------|-------------------|------|
| `/solutions/` | `src/pages/solutions/index.astro` | Index page (auto-generated) |
| `/solutions/compliance` | `src/content/solutions/compliance.md` | Content file |
| `/solutions/healthcare` | `src/content/solutions/healthcare.md` | Content file |
| `/solutions/legal` | `src/content/solutions/legal.md` | Content file |
| `/solutions/tprm` | `src/content/solutions/tprm.md` | Content file |
| `/solutions/vendor-assessment` | `src/content/solutions/vendor-assessment.md` | Content file |

### Standalone Pages
| Original URL | Astro File Location | Type |
|-------------|-------------------|------|
| `/` | `src/pages/index.astro` | Homepage (edit existing) |
| `/api-examples` | `src/pages/api-examples.astro` | Page file |
| `/consultants` | `src/pages/consultants.astro` | Page file |
| `/contact` | `src/pages/contact.astro` | Page file |
| `/market` | `src/pages/market.astro` | Page file |
| `/markdown-examples` | `src/pages/markdown-examples.astro` | Page file |
| `/thank-you` | `src/pages/thank-you.astro` | Page file |

## Quick Migration Checklist

- [ ] Copy VitePress `/features/*.md` files → `src/content/features/`
- [ ] Copy VitePress `/solutions/*.md` files → `src/content/solutions/`
- [ ] Update frontmatter in all content files (add `title` and `description`)
- [ ] Migrate standalone page content to `.astro` files in `src/pages/`
- [ ] Update homepage (`src/pages/index.astro`)
- [ ] Copy images to `public/images/` directory
- [ ] Test all URLs with `npm run dev`
- [ ] Build for production with `npm run build`
- [ ] Deploy `dist/` folder to hosting

## Frontmatter Template

Use this for all `.md` files in `features/` and `solutions/`:

```yaml
---
title: "Your Page Title"
description: "Optional SEO description for listing pages"
---

Your markdown content here...
```

## Testing Commands

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Your URLs will work at: http://localhost:4321/
