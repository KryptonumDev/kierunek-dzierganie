const generator = function (plop) {
  plop.setGenerator('component', {
    description: 'Component generator for Next.js',
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
        templateFile: 'templates/component.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.module.scss',
        templateFile: 'templates/styles.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/index.ts',
        templateFile: 'templates/index.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.types.ts',
        templateFile: 'templates/types.hbs',
      },
    ],
  });
};

export default generator;