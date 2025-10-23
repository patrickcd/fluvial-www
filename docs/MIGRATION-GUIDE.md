# VitePress to Astro Migration Guide

## ✅ Setup Complete

Your Astro installation is now configured to preserve your exact URL structure from VitePress.

## 📁 File Structure Overview

```
src/
├── content/
│   ├── features/          ← Place /features/* markdown files here
│   │   ├── document-management.md
│   │   ├── integration.md
│   │   ├── questionnaire.md
│   │   ├── the-difference.md
│   │   └── workflow.md
│   └── solutions/         ← Place /solutions/* markdown files here
│       ├── compliance.md
│       ├── healthcare.md
│       ├── legal.md
│       ├── tprm.md
│       └── vendor-assessment.md
└── pages/
    ├── api-examples.astro
    ├── consultants.astro
    ├── contact.astro
    ├── market.astro
    ├── markdown-examples.astro
    ├── thank-you.astro
    ├── features/
    │   ├── index.astro        (lists all features)
    │   └── [...slug].astro    (renders individual features)
    └── solutions/
        ├── index.astro        (lists all solutions)
        └── [...slug].astro    (renders individual solutions)
```

## 🔄 Migration Steps

### Step 1: Migrate Features Content

For each file in your VitePress `/features/` directory:

1. **Copy the file** to `src/content/features/`
2. **Update frontmatter** to match this format:
   ```yaml
   ---
   title: "Your Feature Title"
   description: "Optional description for SEO and listing pages"
   ---
   ```
3. **Keep all markdown content** - it will work as-is!

**File name = URL**: `document-management.md` → `/features/document-management`

### Step 2: Migrate Solutions Content

For each file in your VitePress `/solutions/` directory:

1. **Copy the file** to `src/content/solutions/`
2. **Update frontmatter**:
   ```yaml
   ---
   title: "Your Solution Title"
   description: "Optional description"
   ---
   ```

**File name = URL**: `healthcare.md` → `/solutions/healthcare`

### Step 3: Migrate Standalone Pages

For these VitePress pages, copy the markdown content into the corresponding `.astro` files:

| VitePress File | Astro File | Location |
|---------------|------------|----------|
| `/consultants.md` | `consultants.astro` | `src/pages/` |
| `/contact.md` | `contact.astro` | `src/pages/` |
| `/market.md` | `market.astro` | `src/pages/` |
| `/api-examples.md` | `api-examples.astro` | `src/pages/` |
| `/markdown-examples.md` | `markdown-examples.astro` | `src/pages/` |
| `/thank-you.md` | `thank-you.astro` | `src/pages/` |

**Option A - Simple Content**: Paste your markdown inside the `<div class="prose">` tag
**Option B - Complex Content**: Convert to Astro components or HTML

### Step 4: Update the Homepage

Edit `src/pages/index.astro` with your VitePress homepage content.

## 🎨 Styling Notes

- **Prose styles** are already applied for markdown content
- The theme uses **Tailwind CSS v4** (styles in `src/styles/global.css`)
- Text components use the theme's design system automatically

## 🖼️ Images & Assets

### For markdown content:
```markdown
![Alt text](/images/your-image.jpg)
```
Place images in `public/images/` - they'll be served from the root.

### For Astro imports:
```astro
import { Image } from "astro:assets";
import myImage from "@/images/my-image.jpg";

<Image src={myImage} alt="Description" />
```

## 🔗 Internal Links

In markdown files, use relative paths:
```markdown
[See our features](/features)
[Healthcare solutions](/solutions/healthcare)
```

## 📝 Frontmatter Comparison

### VitePress (before):
```yaml
---
title: My Page
description: Page description
---
```

### Astro Features/Solutions (after):
```yaml
---
title: "My Page"
description: "Page description"
---
```

**Note**: Strings should be quoted in Astro frontmatter.

## ⚙️ Testing Your Migration

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Test each URL** from your sitemap:
   - http://localhost:4321/features/
   - http://localhost:4321/features/document-management
   - http://localhost:4321/solutions/
   - http://localhost:4321/solutions/healthcare
   - http://localhost:4321/consultants
   - etc.

3. **Check for errors** in the terminal

## 🚀 Deployment

Once migration is complete:

```bash
npm run build
```

The static site will be in `dist/` - deploy to any static host (Netlify, Vercel, Cloudflare Pages, etc.)

## 📊 SEO Preservation

✅ **URLs are identical** - no redirects needed
✅ **Sitemap will auto-generate** - configured in `astro.config.mjs`
✅ **Update the site URL** in `astro.config.mjs`:
```javascript
site: 'https://www.fluvialdiligence.com',
```

## 🛠️ Customization

### Adding more fields to collections

Edit `src/content/config.ts`:

```typescript
const features = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),        // Add custom fields
    publishDate: z.date().optional(),
    // ... any other fields
  }),
});
```

### Customizing page templates

Edit the page files in `src/pages/features/` and `src/pages/solutions/` to change layout, styling, or add components.

## 🆘 Troubleshooting

### "Collection not found" error
- Ensure the directory exists: `src/content/features/` or `src/content/solutions/`
- Check that files have `.md` or `.mdx` extension

### Frontmatter validation errors
- Verify frontmatter matches the schema in `src/content/config.ts`
- Title and description should be quoted strings
- Check for typos in field names

### Content not updating
- Restart the dev server: `Ctrl+C` then `npm run dev`
- Clear the cache: `rm -rf .astro` then restart

## 📚 Next Steps

1. Copy your VitePress files to the appropriate directories
2. Update frontmatter as needed
3. Test all URLs
4. Customize styling if desired
5. Update `astro.config.mjs` with your production domain
6. Build and deploy!

## 💡 Pro Tips

- Use MDX (`.mdx` files) if you need to import Astro components into your content
- The `@tailwindcss/typography` plugin makes prose content look great
- Content collections provide TypeScript autocomplete for frontmatter
- Use the `getCollection()` API to create custom listing pages

---

**Questions?** The setup is complete - just start copying your VitePress markdown files!
