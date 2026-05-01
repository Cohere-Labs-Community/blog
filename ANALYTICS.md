# Analytics

Analytics and search verification are configured in `_config.yml`. This document is maintainer-only and is excluded from the generated site.

## Supported Fields

The current layout supports these optional values:

- `google_analytics`: Google Analytics 4 measurement ID, for example `G-XXXXXXXXXX`.
- `cronitor_analytics`: Cronitor RUM site ID.
- `pirsch_analytics`: Pirsch site ID.
- `openpanel_analytics`: Openpanel client ID.
- `google_site_verification`: Google Search Console verification token.
- `bing_site_verification`: Bing Webmaster verification token.

Leave a field blank to disable that service.

## Setup

1. Create the analytics or verification property with the provider.
2. Copy the provider ID into `_config.yml`.
3. Run a production build:

   ```bash
   docker compose run --rm -e JEKYLL_ENV=production jekyll bundle exec jekyll build
   ```

4. Inspect the generated page source or deploy preview to confirm the script or verification tag appears.

## Privacy Notes

Use the least invasive analytics that gives maintainers the signal they need. If using a service that sets cookies or collects personal data, add the appropriate consent and privacy-language work before publishing.
