const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the title of your project?',
            name: 'title',
        },
        {
            type: 'input',
            message: 'Please provide a description of your project.',
            name: 'description',
        },
        {
            type: 'input',
            message: 'Please provide installation instructions.',
            name: 'installation',
        },
        {
            type: 'input',
            message: 'Please provide usage information.',
            name: 'usage',
        },
        {
            type: 'input',
            message: 'Please provide contribution guidelines.',
            name: 'contribution',
        },
        {
            type: 'input',
            message: 'Please provide test instructions.',
            name: 'tests',
        },
        {
            type: 'list',
            message: 'Please choose a license.',
            choices: ['MIT', 'Apache', 'GPL', 'BSD', 'None'],
            name: 'license',
        },
        {
            type: 'input',
            message: 'Please provide your GitHub username.',
            name: 'username',
        },
        {
            type: 'input',
            message: 'Please provide your email address.',
            name: 'email',
        },
    ])
    .then((response) => {
        const readme = `
# ${response.title}

## Description
${response.description}

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation
${response.installation}

## Usage
${response.usage}

## License
This project is licensed under the ${response.license} license.

## Contributing
${response.contribution}

## Tests
${response.tests}

## Questions
For any questions or feedback, please contact me at ${response.email} or visit my GitHub profile at [${response.username}](github.com/${response.username}).
`;

        fs.writeFile('README.md', readme, (err) =>
            err ? console.log(err) : console.log('Successfully created README.md!')
        );
    });

