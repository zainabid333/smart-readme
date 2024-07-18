const fs = require('fs').promises;
const inquirer = require('inquirer');
const path = require('path');

// License Badge selection for readme files

const licenseInfo = {
    'MIT': {
        badge: '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)',
        link: 'https://opensource.org/licenses/MIT'
    },
    'Apache 2.0': {
        badge: '[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)',
        link: 'https://opensource.org/licenses/Apache-2.0'
    },
    'GPL 3.0': {
        badge: '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)',
        link: 'https://www.gnu.org/licenses/gpl-3.0'
    },
    'BSD 3-Clause': {
        badge: '[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)',
        link: 'https://opensource.org/licenses/BSD-3-Clause'
    },
    'None': {
        badge: '',
        link: ''
    }
};

// async function for awaiting functionality to validate the file path for storing readme files and if not exist then path will be created
async function validateDirectory(dir) {
    try {
        await fs.access(dir);
        return true;
    } catch {
        return 'Directory does not exist. It will be created.';
    }
}

// Getting project information for Readme files

async function getProjectInfo() {
    return inquirer.prompt([
        //Project title
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of your project?',
            validate: input => input.trim() !== '' || 'Title is required'
        },
        //Project description
        {
            type: 'input',
            name: 'description',
            message: 'Please provide a description of your project:',
            validate: input => input.trim() !== '' || 'Description is required'
        },
        //Project installation
        {
            type: 'input',
            name: 'installation',
            message: 'Please provide installation instructions:',
            default: 'npm install'
        },
        //Project usage
        {
            type: 'input',
            name: 'usage',
            message: 'Please provide usage information:'
        },
        //Project contribution
        {
            type: 'input',
            name: 'contribution',
            message: 'Please provide contribution guidelines:'
        },
        //Project tests
        {
            type: 'input',
            name: 'tests',
            message: 'Please provide test instructions:',
            default: 'npm test'
        },
        //Project license
        {
            type: 'list',
            name: 'license',
            message: 'Please choose a license:',
            choices: Object.keys(licenseInfo)
        },
        //Username for github portfolio link
        {
            type: 'input',
            name: 'username',
            message: 'Please provide your GitHub username:',
            validate: input => input.trim() !== '' || 'GitHub username is required'
        },
        //Email for user contact
        {
            type: 'input',
            name: 'email',
            message: 'Please provide your email address:',
            validate: input => /\S+@\S+\.\S+/.test(input) || 'Please enter a valid email address'
        },
        //Directory where user wants to store the Readme file
        {
            type: 'input',
            name: 'outputDir',
            message: 'Where would you like to save the README.md file? (Provide path or press enter for current directory)',
            default: process.cwd(),
            validate: validateDirectory
        }
    ]);
}


async function getScreenshots() {
    const screenshots = [];
    let addMore = true;

    while (addMore) {
        const { screenshot, more } = await inquirer.prompt([
            {
                type: 'input',
                name: 'screenshot',
                message: 'Please provide the path to a screenshot (relative to project root):'
            },
            {
                type: 'confirm',
                name: 'more',
                message: 'Would you like to add another screenshot?',
                default: false
            }
        ]);

        screenshots.push(screenshot);
        addMore = more;

    }

    return screenshots;

}

function generateReadme(info, screenshots) {
    const licenseBadge = licenseInfo[info.license].badge;
    const licenseLink = licenseInfo[info.license].link;


    let screenshotSection = '';
    if (screenshots.length > 0) {
        screenshotSection = '## Screenshots\n\n';
        screenshots.forEach((screenshot, index) => {
            screenshotSection += `![Screenshot ${index + 1}](${screenshot})\n\n`;
        });
    }

    return `
# ${info.title}

${licenseBadge}

## Description
${info.description}

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)
${screenshots.length > 0 ? '- [Screenshots](#screenshots)' : ''}

## Installation
${info.installation}

## Usage
${info.usage}

## License
This project is licensed under the [${info.license}](${licenseLink}) license.

## Contributing
${info.contribution}

## Tests
${info.tests}

## Questions
For any questions or feedback, please contact me at ${info.email} or visit my GitHub profile at [${info.username}](https://github.com/${info.username}).

${screenshotSection}
`;
}

async function main() {
    try {
        const info = await getProjectInfo();
        const screenshots = await getScreenshots();
        const readme = generateReadme(info, screenshots);
        await fs.mkdir(info.outputDir, { recursive: true });
        const outputPath = path.join(info.outputDir, 'README.md');
        await fs.writeFile(outputPath, readme);
        console.log(`Successfully created README.md in ${outputPath}`);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

main();