module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Component generator Next.js',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.tsx',
        templateFile: 'plop-templates/component.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.module.scss',
        templateFile: 'plop-templates/styles.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/index.ts',
        templateFile: 'plop-templates/index.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.constants.ts',
        templateFile: 'plop-templates/constants.hbs',
      },
    ],
  });
};