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

[data/282uRmMSQnXISWKSNXCh4T.json](data/282uRmMSQnXISWKSNXCh4T.json)

> Running in disconnected mode means you have to make
> no changes to Contentful, Uniform, or this app.

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

#### Contentful setup

##### Content type setup
You need the following content types. In some cases, you can reuse existing content types, but for simplicity, these instructions have to create entirely new content types.

###### Content type 1: Personalization Rule
This content type represents a personalization rule that allows you to boost or hide entries in a list.

1. Create a new content type named `Personalization Rule`.
1. Add the following fields:

    | Field Name | Field ID  | Field Type | Notes |
    | -----------| --------- | ---------- | ----- |
    | Name                        | `name`                       | Short text | |
    | Action                      | `action`                     | Short text | |
    | Content Criteria Match Type | `contentCriteriaMatchType`   | Short text | Allow only the following values: `boost`, `add` |

1. Open the Uniform app in Contentful.
1. Enable enrichment tagging on the content type.
1. Enable personalization criteria on the content type.
1. Save your changes.
1. Open the content type.
1. Rename the following fields:

    | Current field name       | New field name   |
    | ------------------------ | ---------------- |
    | Enrichment Tags          | Content Criteria |
    | Personalization Criteria | Visitor Criteria |

1. Change the order of the fields to the following:
    * Name
    * Action
    * Visitor Criteria
    * Content Criteria Match Type
    * Content Criteria
1. Save your changes.

###### Content type 2: Location
This content type represents an entry in a personalized list.

1. Create a new content type named `Location`.
1. Add the following fields:

    | Field Name | Field ID  | Field Type | Notes |
    | -----------| ----------| ---------- | ----- |
    | Title      | `title`   | Short text | |
    | Content    | `content` | Rich text  | |

1. Open the Uniform app in Contentful.
1. Enable enrichment tagging on the content type.
1. Save your changes.
1. Open the content type.
1. Rename the following fields:

    | Current field name       | New field name   |
    | ------------------------ | ---------------- |
    | Enrichment Tags          | Tags             |

1. Change the order of the fields to the following:
    * Title
    * Tags
    * Content
1. Save your changes.

###### Content type 3: Curated Locations
This content type represents a list of locations that can be personalized based on the rules that are assigned.

1. Create a new content type named `Curated Locations`.
1. Add the following fields:

    | Field Name | Field ID  | Field Type | Notes |
    | -----------| ----------| ---------- | ----- |
    | Title                 | `title`                | Short text        | |
    | Personalization Rules | `personalizationRules` | References, many | Only allow *Personalization Rule* entries to be selected. |
    | Locations             | `locations`            | References, many  | Only allow *Location* entries to be selected. |

1. Save your changes.

##### Content entry setup
1. Create a new `Curated Locations` entry.
1. Add a new `Personalization Rule` entry to the personalization rules field.
1. Add a new `Location` entry to the locations fields.
1. Publish your entries.

#### App setup
1. Configure `.env` file. See [./.env.sample](.env.sample) for more information.
1. If you named all of the fields as described above, you don't need to make any changes to the application. However, if your field names are different, you must update the configuration in [./src/pages/_app.tsx](src/pages/_app.tsx) to match the the fields you created in Contentful. Specifically, look at the following objects: `contentfulPzConfigs` and `contentfulPzRuleConfigs`.
1. Run the following command to download your Uniform manifest:
    ```sh
    npm run download:manifest
    ```
1. Run the following command to start the Next.js application on port `3001`:
    ```sh
    npm run contentful:dev
    ```
1. Open your browser to http://localhost:3001
