# Rule-based personalization for Uniform

This repo demonstrates how to enable rule-based personalization with Uniform. This provides a more scalable approach to personalization.

## Examples

### Headless CMSes

The following examples demonstrate rule-based personalization when Uniform Context is used with a headless CMS (i.e. Uniform Canvas is not used):

* [Next.js + Contentful](apps/nextjs-contentful/README.md)

## Developer info

### Deploying new packages to npm

```
npm run version:minor
```

```
npm run build:force
```

```
cd packages/rule-based-personalization
npm run npm:publish
```

```
cd ../rule-based-personalization-contentful
npm run npm:publish
```

```
cd ../rule-based-personalization-react
npm run npm:publish
```

```
cd ../rule-based-personalization-react-contentful
npm run npm:publish
```