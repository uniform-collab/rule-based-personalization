This repo demonstrates how to use Uniform Context to personalize a list of Contentful entries without using Uniform Canvas.

## Getting started

Install the npm packages using the following command:
```sh
npm i
```

### Using Contentful (disconnected mode)

By default, this application loads a test entry 
from the following file. This allows you to run
the app without having to connect a Contentful
space. This entry is the exact JSON that is 
returned by the Contentful Delivery API:

[data/example.json](data/example.json)

1. Run the following command:
    ```sh
    npm run contentful:dev
    ```
1. Open your browser to http://localhost:3001

### Using Contentful (connected mode)

Connected mode involves reading an entry from the Contentful Delivery API (as opposed to disconnected mode, which reads an entry from a JSON file).

Before you get started, make sure you have the following configured:

* Some enrichments are defined in your Uniform project.
* The Uniform app is installed in your Contentful space.

### Content type: Personalization Rule

*Coming soon*

### Content type: Article

*Coming soon*

### Content type: Article List

*Coming soon*

#### App setup
1. Configure `.env` file. See [.env.sample](.env.sample) for more information.
1. Run the following command:
    ```sh
    npm run contentful:dev
    ```
1. Open your browser to http://localhost:3001
