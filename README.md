# Suzalle

Responsive storefront redesign for [suzalle.nl](https://www.suzalle.nl), built as a lightweight static site.

## Getting started

No package installation or build step is required. Serve this directory with a local web server, for example:

```sh
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## What is included

- Dutch, responsive storefront with collection browsing, search, filtering, and sorting.
- Client-side favorites and a shopping cart with quantity controls.
- Campaign and collection images in `public/images/`, plus one product image served from Suzalle’s image host.
- Keyboard focus styles and reduced-motion support.

The cart is a frontend demonstration: checkout and order processing are not connected to a commerce backend. Product names, sample prices, and photographs are based on the publicly visible Suzalle catalog and should be reviewed against the current inventory before launch.

Product photos link to their existing catalog pages so visitors can view the live items while the new checkout is being integrated.
