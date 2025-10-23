# Migration Testing Checklist

Test each URL from your original sitemap to ensure they work correctly.

## ✅ Homepage
- [ ] http://localhost:4322/ - Homepage

## ✅ Features Section
- [ ] http://localhost:4322/features/ - Features index page
- [ ] http://localhost:4322/features/document-management
- [ ] http://localhost:4322/features/integration
- [ ] http://localhost:4322/features/questionnaire
- [ ] http://localhost:4322/features/the-difference
- [ ] http://localhost:4322/features/workflow

## ✅ Solutions Section
- [ ] http://localhost:4322/solutions/ - Solutions index page
- [ ] http://localhost:4322/solutions/compliance
- [ ] http://localhost:4322/solutions/healthcare
- [ ] http://localhost:4322/solutions/legal
- [ ] http://localhost:4322/solutions/tprm
- [ ] http://localhost:4322/solutions/vendor-assessment

## ✅ Standalone Pages
- [ ] http://localhost:4322/api-examples
- [ ] http://localhost:4322/consultants
- [ ] http://localhost:4322/contact
- [ ] http://localhost:4322/market
- [ ] http://localhost:4322/markdown-examples
- [ ] http://localhost:4322/thank-you

## 🔍 Things to Check

### Content
- [ ] All headings render correctly
- [ ] Links work properly (especially internal links)
- [ ] Code blocks display with syntax highlighting
- [ ] Images load correctly (if any)
- [ ] Lists and formatting look good

### VitePress-Specific Features to Review
- [ ] **Custom containers** (`::: tip`, `::: warning`, etc.) - These may need conversion to Astro components
- [ ] **Mermaid diagrams** - Check if they render (might need additional setup)
- [ ] **Vue components** (if any) - Will need conversion to Astro components

## 🐛 Common Issues to Watch For

1. **VitePress custom containers** - Lines starting with `:::` won't work in standard markdown
2. **Template syntax** - Any remaining `{{ $frontmatter.* }}` syntax won't work
3. **Relative links** - Make sure `.md` extensions are removed from links
4. **Vue components** - `<script setup>` blocks won't work in markdown

## 📝 Notes

If you find issues, note them here:

---

## Next Steps After Testing

Once all URLs work correctly:

1. Update `src/pages/index.astro` with your actual homepage content
2. Review and customize styling if needed
3. Add any missing SEO metadata
4. Run `npm run build` to test production build
5. Deploy to your hosting platform
