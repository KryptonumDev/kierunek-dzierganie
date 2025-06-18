const generator = function (plop) {
  plop.setGenerator('component', {
    description: 'Component generator Next.js',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
      {
        type: 'input',
        name: 'parent',
        message: 'Parent component (optional):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{parent}}/{{name}}/{{name}}.tsx',
        templateFile: 'templates/component.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{parent}}/{{name}}/{{name}}.module.scss',
        templateFile: 'templates/styles.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{parent}}/{{name}}/index.ts',
        templateFile: 'templates/index.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{parent}}/{{name}}/{{name}}.types.ts',
        templateFile: 'templates/types.hbs',
      },
    ],
  });
};

export default generator;