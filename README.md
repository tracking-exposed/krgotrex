# Kreuzberg Google Tracking Exposed

Please refer to the [wiki](https://github.com/tracking-exposed/krgotrex/wiki) for additional information.

## a campaing for a cleaner web ecosystem

1. **Education** through visualization: this project display invisible trackers and put name nearby
2. **Replacements**: technical information on which Google-and-simialar replacements you can made use of
3. **Ecosystem**: how much being surveilled play a difference? does it pay you? escape from its protection it involve retribution strike in term of visibility or reachability? it shouldn't happen, we have to watch the backs of website which become **g-free**

## CONTRIBUTION

### Front-end

#### Local development

1. Fork this repo. [Here is a How-to](https://help.github.com/articles/fork-a-repo/)
2. In your bash console, `cd` into the project's `/page` directory like so `cd PATH_TO_YOUR_CODE_PROJECTS/krgotrex/page`
3. Install dependencies with `npm install`
4. Run local development server with `npm start`

Now you can add/edit SCSS or JS files. When adding new files please keep the existing folder structure.

#### Responsive Framework

We use [Foundation for Sites](https://foundation.zurb.com/sites/docs/index.html) as responsive framework. All **editable** files are **SCSS** files. So do not edit CSS files directly.

The `_settings.scss` file in the `/styles` directory sets default values for the stylesheets. So most of the global style assignment values are defined in here. Please feel free to modify this file and the changes will be applied globally across the site.

If you add a new style partial please name them with leading underscores and group them in folders that represent the corresponding components. For example:

```
  page
  |
  ├── styles
  │   ├── _settings.scss
  │   ├── _style.scss
  │   |
  │   ├── globals
  │   |   └── _globals.scss
  │   |   └── _animations.scss
  │   |
  │   ├── header
  │   |   └── _header.scss
  │   |   └── _header-menu.scss
  │   |   └── _header-logo.scss
  │   |
  │   └── hero-section
  │   |   └── _layout.scss
  │   |   └── _form.scss
  .   .
```

**Remember to import new `.scss` files in the `_style.scss` file which is the main output file that is getting compiled to the `style.css` file in the `/page` directory.

Whenever you change a `.js` or `.scss` file the server will detect those changes but you'll have to manually reload the page.
