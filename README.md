# Yellow Popcorn website

A static, single-page site (HTML, CSS, vanilla JavaScript). No build step.

The public site presents Yellow Popcorn as a film marketing and PR agency for African filmmakers, with a free YouTube channel further down the page.

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080 --directory .
```

## Brand

Colours sampled from the logo files:

- Maroon `#880122`
- Popcorn yellow `#FFDB56`
- Orange `#FE6603`
- Near-black background `#0A0708`

Headings use [Fredoka](https://fonts.google.com/specimen/Fredoka); body uses [Outfit](https://fonts.google.com/specimen/Outfit).

Page order: Home, About, Community, Services, How we work, Work, Start a project, Contact, Watch. The header nav links are Home, About, Community, Services, Contact, Watch, plus a separate "Plan at a glance" button that goes to the project enquiry.

## Placeholders to fill in

The site is careful not to invent facts. Please replace:

- YouTube URL `https://www.youtube.com/@YellowPopcornTV` (marked to confirm) and, once live, a real video ID for the Watch embed
- Email `hello@yellowpopcorn.example`
- `[subscriber count]`
- `[launch date]`
- Programme titles and the featured-show names in the Watch grid
- Work / case-study cards (clearly marked as placeholders)
- Social handles: Instagram, TikTok, X
- Community event details (screenings, meet-ups and workshops)
- Legal entity name, registered address, and privacy / terms pages if needed
- The subscriber figure in the subscribe motion graphic is a mock-up — swap the clip when you have a live treatment

## Forms

The project enquiry, community sign-up and contact forms are front-end only. See the `TODO` in `js/main.js` — wire them to Formspree or your own endpoint before launch.

## Videos

Web-friendly, muted, H.264 MP4 with `faststart`, plus JPEG posters. Autoplay is muted, looped and `playsinline`.
