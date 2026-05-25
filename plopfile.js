import { exec } from "node:child_process"

export default function plopfile(plop) {
  plop.setActionType("open", (answers, config, plop) => {
    const path = plop.handlebars.compile(config.path)(answers)
    exec(`code ${path}`)
  })

  plop.setGenerator("component", {
    prompts: [
      {
        type: "input",
        name: "name",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{properCase name}}/index.ts",
        template: `export * from "./{{properCase name}}"`,
      },
      {
        type: "add",
        path: "src/components/{{properCase name}}/{{properCase name}}.tsx",
        templateFile: ".plop/component.hbs",
      },
      {
        type: "open",
        path: "src/components/{{properCase name}}/{{properCase name}}.tsx",
      },
    ],
  })

  plop.setGenerator("page", {
    prompts: [
      {
        type: "input",
        name: "type",
      },
    ],
    actions: [
      // React page component
      {
        type: "add",
        path: "src/pages/{{dashCase type}}.tsx",
        templateFile: ".plop/page.hbs",
      },
      // Zod type schema
      {
        type: "add",
        path: "src/types/pages/{{dashCase type}}.ts",
        templateFile: ".plop/page-type.hbs",
      },
      // Kirby JSON template
      {
        type: "add",
        path: "www/site/json/pages/{{dashCase type}}.php",
        templateFile: ".plop/page-json.hbs",
      },
      // Kirby blueprint
      {
        type: "add",
        path: "www/site/blueprints/pages/{{dashCase type}}.yml",
        templateFile: ".plop/page-blueprint.hbs",
      },
      // Patch src/types/pages/index.ts — add import
      {
        type: "modify",
        path: "src/types/pages/index.ts",
        pattern: /\/\/ plop:imports/,
        template:
          'import { {{properCase type}}PageContent } from "./{{dashCase type}}"\n// plop:imports',
      },
      // Patch src/types/pages/index.ts — add to discriminated union
      {
        type: "modify",
        path: "src/types/pages/index.ts",
        pattern: /\/\/ plop:union/,
        template: "{{properCase type}}PageContent,\n  // plop:union",
      },
      {
        type: "open",
        path: "src/pages/{{dashCase type}}.tsx",
      },
      {
        type: "open",
        path: "src/types/pages/{{dashCase type}}.ts",
      },
      {
        type: "open",
        path: "www/site/json/pages/{{dashCase type}}.php",
      },
      {
        type: "open",
        path: "www/site/blueprints/pages/{{dashCase type}}.yml",
      },
    ],
  })
}
