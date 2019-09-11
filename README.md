# gatsby-transformer-pages-json

Transforms JSON objects into `Page` and `Menu` data to be used in `gatsby-theme-lodge`

**WIP ALERT:** I'm still building this architecture and it **will** change overtime. The page creation is stil being done in the theme side but we will probably overcome this issue.

## Install

`yarn add gatsby-transformer-json-key-value-to-array`

## How to use

In your `gatsby-config.js`:

```javascript
module.exports = {
  plugins: [
    `gatsby-transformer-pages-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./i/data/`,
      },
    },
  ],
}
```
