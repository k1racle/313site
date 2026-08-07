# Nuxt migration plan

## Goal

Rewrite Studio 313 as a Nuxt 4 application while keeping the current visual direction and making future content maintenance practical.

Main decision: the site is mostly static Nuxt pages, but blog, prices and cases are stored in SQLite and edited through the admin panel.

## Current Project

The current project is a vanilla SPA:

- `index.html` - static shell.
- `styles.css` - all public and admin styles.
- `app.js` - rendering, content defaults, admin, navigation, booking, animations.
- `server.js` - static server and legacy API.
- `content.json` - seed content copied to `data/content.json` on first run.

Legacy parts that should not drive the Nuxt architecture:

- local booking board;
- `bookings.json`;
- `/api/booking/*`;
- Docker-specific assumptions;
- one giant editable `content.json` as the main CMS.

## Architecture Decision

Use Nuxt for the application and SQLite for structured editable content.

### Static in Nuxt

Keep these mostly in Vue pages/components:

- long service explanations;
- page layout;
- hero sections;
- detailed text blocks;
- landing-page narrative;
- most section composition.

This keeps the important marketing pages easy to craft by hand.

### SQLite

Store these in SQLite:

- blog posts;
- price categories;
- price items;
- cases;
- case media;
- case categories/tags;
- optional equipment list;
- optional CRM settings;
- optional contacts/social links.

This avoids releases for small business edits: price changes, old/new price, promo labels, case publication, blog updates.

### JSON

Use JSON only for small configuration if it stays useful:

- global site settings;
- CRM widget settings;
- simple navigation labels;
- simple contacts.

Do not grow JSON into a large content database.

## CRM Booking

Current code has two modes:

### Legacy form mode

`booking.mode = "form"` renders a local booking form and sends data to `/api/booking/submit`. The server writes to `bookings.json` and optionally sends Telegram notifications.

This is legacy.

### CRM widget mode

`booking.mode = "widget"` uses:

- `booking.widgetCode` - HTML/JS snippet inserted into the page;
- `booking.widgetOpen` - JS command used to open the widget.

In Nuxt, implement this as:

- `CrmWidgetMount`;
- `CrmBookingButton`;
- `useCrmWidget`.

Prefer a provider adapter over arbitrary `new Function(widgetOpen)` if the CRM is known.

## Target Structure

```text
app/
  app.vue
  assets/css/
    tokens.css
    base.css
    layout.css
    components.css
    admin.css
  components/
    layout/
    sections/
    crm/
    admin/
    ui/
  composables/
    useCrmWidget.ts
    usePrices.ts
    useCases.ts
    useBlog.ts
  layouts/
    default.vue
    admin.vue
  pages/
    index.vue
    admin.vue
    blog/
      index.vue
      [slug].vue
    cases/
      index.vue
      [slug].vue

server/
  db/
    client.ts
    schema.ts
    migrations/
  api/
    prices.get.ts
    cases.get.ts
    blog.get.ts
    admin/
      login.post.ts
      logout.post.ts
      session.get.ts
      prices/
      cases/
      blog/
      media/
  utils/
    auth.ts
    crm.ts
    media.ts

shared/
  types/
    price.ts
    case.ts
    blog.ts
    crm.ts

public/
  brand/
  icons/
  media/
```

## Database Model

Use SQLite as the source of truth for dynamic structured content.

Recommended stack:

- SQLite database file;
- Drizzle ORM or direct SQL with typed helpers;
- migrations committed to git;
- seed script for initial data.

### Tables

#### `price_categories`

```text
id
slug
title
description
sort_order
is_active
created_at
updated_at
```

#### `price_items`

```text
id
category_id
slug
title
short_description
description
price
old_price
currency
unit
promo_label
includes_json
equipment_json
location_json
sort_order
is_active
created_at
updated_at
```

Notes:

- `old_price` supports promos.
- `includes_json` is fine for simple bullet lists.
- If equipment/location become heavily reused, split them into separate relation tables later.

#### `case_categories`

```text
id
slug
title
description
sort_order
is_active
```

#### `cases`

```text
id
category_id
slug
title
client_name
excerpt
description
cover_image
video_url
published_at
is_published
sort_order
created_at
updated_at
```

#### `case_media`

```text
id
case_id
type
url
alt
caption
sort_order
```

#### `blog_posts`

```text
id
slug
title
excerpt
body
cover_image
seo_title
seo_description
published_at
is_published
created_at
updated_at
```

#### `settings`

```text
key
value_json
updated_at
```

Use this for small global settings, not for large page content.

Possible keys:

- `crm`;
- `contacts`;
- `social_links`;
- `home_stats`;

## Public API

```text
GET /api/prices
GET /api/cases
GET /api/cases/:slug
GET /api/blog
GET /api/blog/:slug
GET /api/settings/public
```

## Admin API

```text
POST /api/admin/login
POST /api/admin/logout
GET  /api/admin/session

GET    /api/admin/prices
POST   /api/admin/prices
PATCH  /api/admin/prices/:id
DELETE /api/admin/prices/:id

GET    /api/admin/cases
POST   /api/admin/cases
PATCH  /api/admin/cases/:id
DELETE /api/admin/cases/:id

GET    /api/admin/blog
POST   /api/admin/blog
PATCH  /api/admin/blog/:id
DELETE /api/admin/blog/:id

GET   /api/admin/settings
PATCH /api/admin/settings/:key

POST /api/admin/media/upload
```

All admin routes require an httpOnly cookie session.

## Admin UI

Admin sections:

- Prices;
- Cases;
- Blog;
- CRM settings;
- Media;
- Site settings.

The admin should be practical and dense, not a copy of the public visual design.

### Prices Admin

Needs:

- category list;
- item list per category;
- create/edit/delete;
- drag or numeric sort order;
- active/inactive toggle;
- `price`;
- `old_price`;
- `promo_label`;
- include bullets;
- short public description.

### Cases Admin

Needs:

- category;
- title;
- slug;
- cover;
- gallery/video;
- excerpt;
- published toggle;
- sort order.

### Blog Admin

Needs:

- title;
- slug;
- excerpt;
- body;
- cover;
- SEO title/description;
- published toggle;
- published date.

## Nuxt Pages

### `/`

Main presentation page. Pulls selected dynamic blocks from SQLite:

- featured prices;
- featured cases;
- latest blog posts;
- public CRM settings.

### `/cases`

List of published cases from SQLite.

### `/cases/[slug]`

Case detail from SQLite.

### `/blog`

List of published posts from SQLite.

### `/blog/[slug]`

Blog post detail from SQLite.

### Static Service Pages

Long service explanations can remain hand-authored in Vue:

- studio rent;
- production;
- audio recording;
- video shooting;
- locations explanation.

These pages can still embed dynamic price tables from SQLite.

## Migration Stages

### Stage 0. Baseline

- Keep current site as visual reference.
- Confirm actual CRM provider and widget code.
- Confirm hosting/runtime constraints for SQLite file storage.
- Decide whether initial Nuxt work happens in this repo or a separate branch.

### Stage 1. Nuxt Skeleton

- Create Nuxt 4 app.
- Move fonts, public assets and base visual tokens.
- Create public layout and admin layout.
- Create empty `/`, `/admin`, `/blog`, `/cases`.

### Stage 2. SQLite Foundation

- Add SQLite client.
- Add migrations.
- Add seed script.
- Create tables for prices, cases, blog, settings.
- Add basic public read APIs.

### Stage 3. Public Site Port

- Port layout: sidebar, mobile dock, ticker, loader, spotlight.
- Port main sections.
- Read prices/cases/blog previews from SQLite.
- Keep long text blocks in Vue components.

### Stage 4. CRM

- Port CRM widget settings.
- Implement `CrmWidgetMount`.
- Implement booking buttons.
- Test real CRM submission.

### Stage 5. Admin

- Implement auth with httpOnly cookie.
- Implement CRUD for prices.
- Implement CRUD for cases.
- Implement CRUD for blog.
- Implement settings editor for CRM and small globals.
- Implement media upload if needed.

### Stage 6. Polish

- Mobile QA.
- Desktop QA.
- Animation QA.
- SEO metadata.
- Smoke tests for public pages and admin CRUD.

## Risks

- SQLite file persistence depends on hosting. Need a stable writable path.
- Arbitrary CRM JS in admin settings is risky unless admin is fully trusted.
- If long marketing content is later moved into admin, the database model will need richer blocks or Markdown.
- Admin CRUD can grow quickly; keep first version focused on blog, prices and cases.
- Current Russian text encoding should be checked before copying old content.

## First Release Definition of Done

- Nuxt app runs locally.
- Public homepage renders with current visual direction.
- Prices are read from SQLite.
- Cases are read from SQLite.
- Blog posts are read from SQLite.
- Admin can create/edit/publish prices.
- Admin can create/edit/publish cases.
- Admin can create/edit/publish blog posts.
- CRM booking button opens the external widget.
- Test CRM submission reaches the external CRM.

