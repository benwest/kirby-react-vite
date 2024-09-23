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
      {
        type: "add",
        path: "src/pages/{{type}}.tsx",
        templateFile: ".plop/page.hbs",
      },
      {
        type: "open",
        path: "src/pages/{{type}}.tsx",
      },
    ],
  })
}
