Да — вот сейчас концепт начинает складываться **в полноценную систему**, а не просто в набор эффектов.

И я бы даже немного изменил твою исходную идею: **waveform может стать не декоративным элементом, а вторичной навигацией всего сайта.**

## 1. Waveform = timeline сайта

Представь верхнюю или нижнюю часть экрана:

```text
  01        02          03          04          05          06
  INTRO     SPACE       SERVICES    WORK        GEAR        CONTACT
    │         │            │           │           │            │
────┼─────────┼────────────┼───────────┼───────────┼────────────┼────
 ▁▂▃▅▇▅▂▁  ▂▅▇▆▃▂▅▇  ▁▃▅▂▇▇▅▂  ▂▃▇▅▂▁▅  ▁▂▅▇▃▆▂  ▃▅▇▆▂▁▃
             ↑
          ACTIVE
```

При горизонтальном scroll:

* экран физически едет влево;
* waveform тоже движется;
* активная область waveform подсвечивается `#0069FE`;
* соответствующий пункт sidebar меняется;
* в момент остановки секция **snap**-ится на viewport.

Получается ощущение, что ты **моташь timeline записи**.

И тут можно сделать очень красивую деталь:

### waveform не должна быть одинаковой.

У каждой секции своя форма.

Например:

```text
INTRO       ▁▂▃▅▇▅▂▁
SPACE       ▂▅▇▆▃▂▅▇
SERVICES    ▁▃▅▂▇▇▅▂
WORK        ▂▃▇▅▂▁▅
EQUIPMENT   ▁▂▅▇▃▆▂
CONTACT     ▃▅▇▆▂▁▃
```

То есть waveform становится **визуальным оглавлением**.

---

# 2. А REC + fullscreen можно объединить

Я бы вообще сделал так, чтобы каждая главная секция была **отдельным кадром**.

Например:

```text
┌──────────────────────────────────────────────┐
│ REC ●                              CAM 01    │
│                                              │
│                                              │
│                 STUDIO 313                   │
│                                              │
│             RECORD / SHOOT / CREATE          │
│                                              │
│                                              │
│                         00:00:13:24          │
└──────────────────────────────────────────────┘
```

При переходе:

```text
CAM 01
   ↓
CAM 02
```

или:

```text
01 / 06
```

И экран как будто **перематывается на следующий кадр**.

### Особенно красиво будет сделать transition:

Старый экран не просто исчезает.

Он может:

1. чуть приблизиться;
2. waveform пробегает слева направо;
3. появляется `REC ●`;
4. новый кадр «включается»;
5. текст и media появляются с небольшим stagger.

Получается почти как монтаж.

---

# 3. Но я бы не делал fullscreen абсолютно везде

Это важно.

**Главные narrative-секции** — fullscreen:

```text
INTRO
SPACE
SERVICES
WORK
CONTACT
```

А внутри некоторых экранов уже есть собственный горизонтальный carousel.

Например:

```text
MAIN TIMELINE
──────────────────────────────────────>

[ INTRO ] [ SPACE ] [ SERVICES ] [ WORK ] [ GEAR ]
                                  ↓
                           внутренний timeline
```

И вот твой equipment идеально сюда ложится.

---

# 4. Equipment — timeline внутри timeline

Например пользователь находится на:

```text
05 EQUIPMENT
```

Экран:

```text
┌──────────────────────────────────────────────┐
│                                              │
│ EQUIPMENT                                    │
│                                              │
│       SONY FX3                               │
│                                              │
│       [ HUGE IMAGE ]                         │
│                                              │
│       FULL FRAME                             │
│       4K / 120 FPS                           │
│                                              │
│                                              │
│ CAMERA  AUDIO  LIGHT  GRIP  STREAM  OTHER   │
│ ──────●───────────────────────────────────   │
└──────────────────────────────────────────────┘
```

И пользователь **не переходит на новую страницу**, когда выбирает Camera → Audio → Light.

Он перемещается по **внутренней timeline**.

Причём внизу можно оставить маленький waveform / timeline:

```text
CAMERA ━━━━━●━━━━━━━━ AUDIO ━━━━━ LIGHT ━━━━━
```

Очень последовательно.

---

# 5. А теперь самое интересное — SEO

Тут я с тобой **полностью согласен**.

Я бы разделил:

### Experience layer

То, что человек видит на главной:

> immersive / horizontal / fullscreen / waveform / REC / motion

и

### SEO/content layer

Нормальные индексируемые страницы:

```text
/studio
/podcast-recording
/podcast-video
/interview-recording
/video-production
/photo-studio
/streaming
/audio-recording
/post-production
/equipment
/pricing
/projects
/contact
```

И это **не конфликтует** с концепцией.

Наоборот, главная становится красивым входом в систему, а отдельные страницы — полноценными landing pages.

---

# 6. И я бы пошёл ещё дальше: страницы услуг должны быть «эпизодами»

Допустим:

`/podcast-recording`

Это не должна быть просто SEO-страница:

> Запись подкаста в Studio 313
> 1000 слов текста
> цена
> форма

Нет.

Она должна ощущаться как **отдельный эпизод Studio 313**.

Например:

```text
REC ●

PODCAST
RECORDING

Professional podcast
recording in Studio 313.

[ BOOK A SESSION ]
```

↓

```text
THE SETUP

[ HUGE PHOTO / VIDEO ]

2 cameras
4 microphones
controlled lighting
monitoring
```

↓

```text
HOW IT SOUNDS

[ ▶ PLAY ]

Guest:
"..."

Host:
"..."
```

↓

```text
WHAT'S INCLUDED

✓ Studio
✓ 3 cameras
✓ 4 microphones
✓ Lighting
✓ Operator
✓ Raw files
✓ Editing
```

↓

```text
SELECTED PODCASTS

[ PROJECT ]
[ PROJECT ]
[ PROJECT ]
```

↓

```text
YOU MAY ALSO NEED

VIDEO PRODUCTION
INTERVIEW
POST PRODUCTION
```

↓

```text
READY?

BOOK A SESSION →
```

Это одновременно:

**SEO + conversion + portfolio + brand experience.**

---

# 7. Аудио-примеры — вообще золото

Вот это я бы обязательно сделал.

Особенно если реально есть хорошие записи.

На `/podcast-recording`:

```text
HOW WE SOUND

┌─────────────────────────────────────────────┐
│                                             │
│  ▶  ━━━━━━━━━━━━━━━●━━━━━━━━━━  00:42      │
│                                             │
│  Studio 313 / Podcast                       │
│                                             │
└─────────────────────────────────────────────┘
```

Можно показывать:

**Before / After**

```text
RAW
▁▃▅▂▇▆▂▁▅▃▇▂

STUDIO 313
▁▂▅▆▇▆▅▃▅▇▆▃
```

Это намного убедительнее, чем написать:

> «Мы используем профессиональное оборудование и качественную акустику».

Человек **сам слышит результат**.

---

# 8. Между SEO-страницами сделать внутреннюю сеть

Вот здесь я бы построил настоящую **контентную экосистему**.

Например:

```text
                 PODCAST
                /       \
               /         \
          VIDEO           AUDIO
            |               |
            |               |
        INTERVIEW       POST-PRODUCTION
             \             /
              \           /
                EQUIPMENT
                    |
                  STUDIO
```

Каждая страница ссылается на 3–5 релевантных других.

Например Podcast:

```text
PODCAST RECORDING

→ Podcast Video
→ Interview Recording
→ Audio Recording
→ Equipment
→ Selected Podcasts
```

А Equipment:

```text
EQUIPMENT

→ Podcast Recording
→ Video Production
→ Streaming
→ Studio
```

Это уже очень хорошая внутренняя структура.

---

# 9. И тут можно сделать офигенную штуку с Equipment

На SEO-странице оборудования:

```text
OUR
EQUIPMENT

CAMERA
SONY FX3
SONY A7S III
...

AUDIO
SHURE SM7B
SENNHEISER...
...

LIGHT
APUTURE...
```

Каждое оборудование ведёт не только на техническую информацию, но и на:

> **Где это используется**

Например:

**Sony FX3**

```text
USED FOR

→ Podcast Video
→ Interview
→ Commercial Video
→ Studio Production
```

Это создаёт дополнительные связи между страницами.

---

# 10. В результате структура сайта может быть такой

```text
/
│
├── studio
│
├── services
│   ├── podcast-recording
│   ├── podcast-video
│   ├── interview-recording
│   ├── audio-recording
│   ├── video-production
│   ├── photo-studio
│   ├── streaming
│   └── post-production
│
├── projects
│   ├── project-1
│   ├── project-2
│   └── project-3
│
├── equipment
│   ├── cameras
│   ├── microphones
│   ├── lighting
│   └── streaming
│
├── pricing
│
└── contact
```

А **главная `/`** — это твой experimental immersive experience.

SEO-страницы — более рациональные, но всё равно с тем же визуальным языком.

---

# 11. Я бы даже сделал два типа navigation

### Global timeline

```text
01 INTRO
02 SPACE
03 SERVICES
04 WORK
05 EQUIPMENT
06 CONTACT
```

### Local timeline

Например на Equipment:

```text
CAMERA — AUDIO — LIGHT — GRIP — STREAM
```

А на Services:

```text
PODCAST — VIDEO — PHOTO — AUDIO — STREAM
```

И визуально они могут быть **одинаковым компонентом**.

То есть в Nuxt можно сделать условно:

```text
<TimelineNavigation
  :items="sections"
  :active="activeSection"
/>
```

И этот компонент становится одним из главных элементов всей дизайн-системы.

---

## И я бы сформулировал весь UX Studio 313 одной фразой:

> **The website is a recording timeline.**

Пользователь не просто «скроллит сайт».

Он **перематывает Studio 313**.

Waveform показывает, где он находится.
REC показывает, что сейчас «идёт запись».
Fullscreen показывает текущий кадр.
Horizontal scroll — перемещение по timeline.
Внутренние timeline — перемещение внутри конкретного production-направления.
А обычные SEO-страницы — это уже отдельные «эпизоды», куда пользователь может провалиться глубже.

Вот это, на мой взгляд, уже **достаточно уникальная концепция, вокруг которой стоит строить весь Nuxt UI**, а не просто красивый лендинг.


Design a premium immersive website for **Studio 313**, a modern recording, podcast, interview, video production and photography studio.

## CORE CONCEPT

The website should feel like a **digital recording timeline / production control room**, not a conventional agency landing page.

The user should feel like they are moving through a real studio session:

* fullscreen cinematic frames
* recording indicators
* camera frame overlays
* timecodes
* subtle production metadata
* audio waveforms
* timeline navigation
* large editorial typography
* large photography and video
* smooth horizontal movement between scenes

The key idea is:

**THE WEBSITE IS A RECORDING TIMELINE.**

Scrolling horizontally moves between fullscreen scenes.
A waveform timeline at the bottom or top acts as both a visual element and navigation.
Each major section corresponds to a segment of the waveform and becomes highlighted when active.

## BRAND

Studio 313 should feel:

* premium
* cinematic
* modern
* technological
* editorial
* minimal
* confident
* production-focused

Avoid looking like:

* a generic SaaS website
* a startup landing page
* a standard creative agency
* a template
* excessive glassmorphism
* excessive rounded cards
* generic gradient blobs

The design should feel expensive because of **composition, typography, photography, spacing and motion**, not because of decorative effects.

## COLOR SYSTEM

Primary blue:
#0069FE

Dark blue:
#0051C6
#004FC4
#003F9D

Ink:
#07101F

Text:
#1B2433

Muted:
rgba(7, 16, 31, 0.62)

Page background:
#F7F9FC

White:
#FFFFFF

Use blue as a strong functional accent, not as a background everywhere.

Most of the interface should be white / near-white / dark ink.

Use blue strategically for:

* active navigation
* recording indicators
* CTA
* waveform activity
* selected states
* occasional fullscreen CTA sections
* studio status indicators

## TYPOGRAPHY

Use **TT Firs ExtraBold** for:

* huge headlines
* navigation
* section numbers
* large statements
* prices
* important labels

Use **Inter** for:

* body text
* descriptions
* metadata
* forms
* secondary UI

Typography should be oversized and editorial.

Use uppercase typography selectively.

Examples:

NOT JUST A ROOM.

RECORD.
SHOOT.
CREATE.

STUDIO 313

PODCAST
VIDEO
PHOTO
AUDIO

## DESKTOP LAYOUT

Create a fullscreen horizontal experience.

Fixed left sidebar approximately 280–320px wide.

The main content occupies the remaining viewport.

The main sections should snap horizontally so that one major scene occupies the viewport at a time.

Sidebar:

STUDIO 313

01 INTRO
02 SPACE
03 SERVICES
04 WORK
05 EQUIPMENT
06 CONTACT

At the bottom:

● STUDIO ONLINE

BOOK A SESSION

The sidebar should use a deep blue gradient, but remain clean and minimal.

Active navigation item should have a subtle translucent white highlight.

## WAVEFORM NAVIGATION

Create a persistent horizontal waveform near the bottom of the main viewport.

It is not just decoration.

It represents the site's timeline.

Example:

01 INTRO — 02 SPACE — 03 SERVICES — 04 WORK — 05 EQUIPMENT — 06 CONTACT

The waveform should have different shapes for different sections.

The active section should be highlighted with #0069FE.

When the user horizontally scrolls, the waveform position and active section should update.

Visually it should feel like scrubbing through an audio/video timeline.

Keep it subtle and sophisticated.

Do not make it look like a music player.

## RECORDING / CAMERA LANGUAGE

Use small cinematic production details throughout the interface:

REC ●
CAM 01
CAM 02
4K / 25 FPS
00:13:24
STUDIO 01
LIVE SESSION

These should be small, sparse and meaningful.

Do not overload the interface with fake technical information.

Use camera-frame corners or subtle frame markers around selected photography/video.

## SCREEN 01 — INTRO / HERO

Fullscreen cinematic hero.

Large studio photography or video occupying most of the screen.

Overlay:

REC ●
CAM 01

STUDIO 313

RECORD.
SHOOT.
CREATE.

Small supporting copy.

Primary CTA:

BOOK A SESSION →

The hero should immediately communicate that this is a real production studio.

Avoid a conventional centered hero.

Use an asymmetrical editorial composition.

## SCREEN 02 — SPACE

Show a huge cinematic photograph of the studio.

Headline:

NOT JUST A ROOM.

Secondary copy explains the studio space.

Include small production metadata:

STUDIO 01
120 M²
CAMERA READY
PODCAST READY

Use image overlays very sparingly.

The photograph should be the dominant visual element.

## SCREEN 03 — SERVICES

Do not use a grid of generic cards.

Create a large editorial list:

01 PODCAST
02 INTERVIEW
03 VIDEO PRODUCTION
04 AUDIO RECORDING
05 PHOTO
06 STREAMING

Hovering a service should reveal or replace a large image/video preview.

The service list should feel like a magazine contents page or production menu.

## SCREEN 04 — SELECTED WORK

Create an art-directed media wall.

Large and small images/videos should have different sizes.

Avoid a repetitive card grid.

Use large cinematic thumbnails.

Hover state can show:

PLAY
VIEW PROJECT
↗

Include minimal metadata:

PODCAST
VIDEO
INTERVIEW
2026

## SCREEN 05 — EQUIPMENT

Create a smaller internal horizontal navigation inside the equipment section.

Categories:

CAMERA
AUDIO
LIGHT
GRIP
STREAM

The equipment section should feel like a production desk.

Show one large piece of equipment at a time with:

product name
short description
technical specifications
large photograph

Example:

SONY FX3

FULL FRAME
4K / 120 FPS

The bottom of this section should contain a small internal timeline:

CAMERA — AUDIO — LIGHT — GRIP — STREAM

Selecting a category moves through the equipment items horizontally.

## SCREEN 06 — BLUE CTA

Use a strong full-bleed blue section.

Very minimal.

READY?

LET'S MAKE
SOMETHING
GOOD.

BOOK A SESSION →

This should be one of the rare moments where blue dominates the entire screen.

## SCREEN 07 — CONTACT

Large editorial contact section.

CONTACT

phone number
email
address
social links

Make the phone number and booking action very large and clickable.

Include:

● STUDIO ONLINE

Keep the composition spacious and premium.

## INTERACTION LANGUAGE

Motion should feel like film editing and studio equipment, not generic web animation.

Use:

* horizontal section snapping
* smooth image scaling
* subtle parallax
* waveform movement
* text stagger
* camera-frame transitions
* subtle hover elevation
* spotlight following cursor
* smooth modal/lightbox transitions

When transitioning between fullscreen scenes, make it feel like moving to the next frame of a recording timeline.

Avoid excessive animation.

Respect prefers-reduced-motion.

## MOBILE

On mobile, replace the horizontal desktop experience with a vertical narrative.

Use a fixed bottom navigation dock.

Keep the waveform as a compact progress/navigation indicator.

Fullscreen sections can become vertically stacked screens.

Simplify:

* camera overlays
* technical metadata
* parallax
* cursor effects
* heavy animations

The mobile experience should remain premium and cinematic.

## IMPORTANT DESIGN DIRECTION

Think:

**A24 film website × modern recording studio × production control room × editorial magazine**

But do not copy any existing website.

The final result should feel like a unique digital identity for Studio 313.

Prioritize:

1. strong composition
2. huge typography
3. cinematic photography
4. negative space
5. waveform timeline
6. fullscreen scenes
7. restrained blue accent
8. production/camera language
9. premium interaction design

The result should look like a real high-end studio brand, not a UI kit.

хороший сайт allmusic-studio.ru