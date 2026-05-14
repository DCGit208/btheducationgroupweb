# Workforce Infrastructure — Local Image Assets

This folder is the target location for **localized** image assets used by
`workforce-infrastructure.html`. Currently the page still references remote
Pexels URLs for three images. The intention is to migrate them to local files
so the page is fully self-hosted (no third-party CDN dependency, controlled
licensing, faster first paint).

## Images to localize

Replace each Pexels URL in the HTML / CSS with the corresponding local file
listed below. Keep the alt text and `width` / `height` attributes intact.

| Slot                | Used in                                    | Suggested filename             | Notes                                          |
| ------------------- | ------------------------------------------ | ------------------------------ | ---------------------------------------------- |
| Hero parallax photo | `.hero-photo-layer` (CSS background-image) | `hero-parallax.jpg`            | 1920×1080, dim global / urban infrastructure   |
| Problem-section img | `.problem-photo-half > img`                | `problem-executives.jpg`       | 1400×934, executives meeting / strategic       |
| Lifecycle team img  | `.lc-team-photo > img`                     | `lifecycle-team.jpg`           | 1400×788, multi-disciplinary deployed team     |

## How to swap

1. Drop the local JPGs (or AVIF/WebP variants) into this folder.
2. In `workforce-infrastructure.html`, replace each Pexels URL with the
   corresponding `assets/images/workforce/<filename>` path.
3. For the hero parallax (CSS background), update the `background-image: url(...)`
   declaration in `assets/css/workforce-infrastructure.css` (selector
   `.hero-photo-layer`).
4. Verify each `<img>` keeps explicit `width` / `height` attributes so layout
   does not jump (CLS).

## Licensing

Use only assets you have a license to redistribute. Pexels images are usable
under the Pexels License but moving to in-house photography or a licensed
stock photo is preferred for a positioning page of this kind.
