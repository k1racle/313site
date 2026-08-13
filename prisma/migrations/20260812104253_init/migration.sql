-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER,
    "defaultAlt" TEXT NOT NULL DEFAULT '',
    "storage" TEXT NOT NULL DEFAULT 'upload',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "about_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "about_sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "about_sections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "about_pages" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "about_sections_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "home_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "introText" TEXT NOT NULL,
    "marqueeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "marqueeText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "navigation_items" (
    "path" TEXT NOT NULL PRIMARY KEY,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "videoUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "featured_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timelineLabel" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "actionLabel" TEXT NOT NULL,
    "imageId" TEXT,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "featured_services_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_waveform_bars" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "service_waveform_bars_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "featured_services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_features" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "service_features_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "featured_services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "data_migrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "media_path_key" ON "media"("path");

-- CreateIndex
CREATE INDEX "about_sections_pageId_sortOrder_idx" ON "about_sections"("pageId", "sortOrder");

-- CreateIndex
CREATE INDEX "about_sections_mediaId_idx" ON "about_sections"("mediaId");

-- CreateIndex
CREATE INDEX "reviews_sortOrder_idx" ON "reviews"("sortOrder");

-- CreateIndex
CREATE INDEX "featured_services_sortOrder_idx" ON "featured_services"("sortOrder");

-- CreateIndex
CREATE INDEX "featured_services_imageId_idx" ON "featured_services"("imageId");

-- CreateIndex
CREATE INDEX "service_waveform_bars_serviceId_sortOrder_idx" ON "service_waveform_bars"("serviceId", "sortOrder");

-- CreateIndex
CREATE INDEX "service_features_serviceId_sortOrder_idx" ON "service_features"("serviceId", "sortOrder");

-- CreateTable
CREATE TABLE "price_list_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "price_list_sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "price_list_sections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "price_list_pages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "price_list_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "price_list_items_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "price_list_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "price_list_variations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "price_list_variations_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "price_list_items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "price_list_sections_pageId_sortOrder_idx" ON "price_list_sections"("pageId", "sortOrder");

-- CreateIndex
CREATE INDEX "price_list_items_sectionId_sortOrder_idx" ON "price_list_items"("sectionId", "sortOrder");

-- CreateIndex
CREATE INDEX "price_list_variations_itemId_sortOrder_idx" ON "price_list_variations"("itemId", "sortOrder");

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "coverId" TEXT NOT NULL,
    "coverAlt" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "seoTitle" TEXT NOT NULL DEFAULT '',
    "seoDescription" TEXT NOT NULL DEFAULT '',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "blog_posts_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blog_sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "mediaId" TEXT,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "caption" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "blog_sections_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "blog_sections_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contact_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneHref" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_publishedAt_idx" ON "blog_posts"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "blog_posts_coverId_idx" ON "blog_posts"("coverId");

-- CreateIndex
CREATE INDEX "blog_sections_postId_sortOrder_idx" ON "blog_sections"("postId", "sortOrder");

-- CreateIndex
CREATE INDEX "blog_sections_mediaId_idx" ON "blog_sections"("mediaId");

-- CreateTable
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "faq_sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "faq_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "faq_items_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "faq_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "social_links_visible_sortOrder_idx" ON "social_links"("visible", "sortOrder");

-- CreateIndex
CREATE INDEX "faq_sections_visible_sortOrder_idx" ON "faq_sections"("visible", "sortOrder");

-- CreateIndex
CREATE INDEX "faq_items_sectionId_visible_sortOrder_idx" ON "faq_items"("sectionId", "visible", "sortOrder");

-- Seed the content currently shown by the site. Administrators can change it later.
INSERT INTO "social_links" ("id", "label", "href", "icon", "visible", "sortOrder", "updatedAt") VALUES
    ('telegram', 'Telegram', '#', 'telegram', true, 0, CURRENT_TIMESTAMP),
    ('whatsapp', 'WhatsApp', '#', 'whatsapp', true, 1, CURRENT_TIMESTAMP),
    ('vk', 'VK', '#', 'vk', true, 2, CURRENT_TIMESTAMP),
    ('youtube', 'YouTube', '#', 'youtube', true, 3, CURRENT_TIMESTAMP);

INSERT INTO "faq_sections" ("id", "title", "visible", "sortOrder", "updatedAt") VALUES
    ('before-booking', 'Перед записью', true, 0, CURRENT_TIMESTAMP);

INSERT INTO "faq_items" ("id", "sectionId", "question", "answer", "visible", "sortOrder", "updatedAt") VALUES
    ('shoot-duration', 'before-booking', 'Сколько длится съёмка?', 'Обычно съёмка занимает 1-2 часа. Время зависит от формата и сложности проекта.', true, 0, CURRENT_TIMESTAMP),
    ('studio-tour', 'before-booking', 'Можно ли приехать на рекогносцировку?', 'Да, мы проводим бесплатные экскурсии по студии. Запишитесь заранее.', true, 1, CURRENT_TIMESTAMP),
    ('rental-includes', 'before-booking', 'Что входит в стоимость аренды?', 'В стоимость включены студийные помещения, базовый свет, звук и помощь ассистента.', true, 2, CURRENT_TIMESTAMP);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingWidgetCode" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
