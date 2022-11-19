const { resolve } = require('path')
const { readFileSync } = require('fs')

const docsStructure = {
  Introduction: {
    'Welcome to the Docs': ['Introduction', 'Welcome to the Docs.md'],
    'What is Mulyankan?': ['Introduction', 'What is Mulyankan.md'],
    "What Mulyankan isn't": ['Introduction', 'What Mulyankan isnt.md'],
    Purpose: ['Introduction', 'Purpose.md']
  },
  'Getting Started': {
    'First Steps': ['Getting Started', 'First Steps.md'],
    'Uploading Files': ['Getting Started', 'Uploading Files.md'],
    'The Interface': ['Getting Started', 'The Interface.md']
  },
  'Basic Usage': {
    'Adding Symbols': ['Basic Usage', 'Adding Symbols.md'],
    'Removing Symbols': ['Basic Usage', 'Removing Symbols.md'],
    'Changing Colors': ['Basic Usage', 'Changing Colors.md'],
    'Zooming In/Out': ['Basic Usage', 'Zooming In and Out.md'],
    'Copy and Paste': ['Basic Usage', 'Copy and Paste.md']
  },
  'Text and Marks': {
    'The Difference': ['Text and Marks', 'The Difference.md'],
    'Quick Marking': ['Text and Marks', 'Quick Marking.md'],
    'Styling the Text': ['Text and Marks', 'Styling the Text.md']
  },
  Clipboard: {
    'What is the Clipboard?': ['Clipboard', 'What is the Clipboard.md'],
    'Using the Clipboard': ['Clipboard', 'Using the Clipboard.md']
  },
  Downloading: {
    'How to Download': ['Downloading', 'How to Download.md'],
    'A Note of Caution': ['Downloading', 'A Note of Caution.md'],
    'A Note of Hope': ['Downloading', 'A Note of Hope.md']
  },
  'Cloud Saving': {
    'Why to use the Cloud?': ['Cloud Saving', 'Why to use the Cloud.md'],
    'Saving to the Cloud': ['Cloud Saving', 'Saving to the Cloud.md'],
    'Opening Projects from the Cloud': [
      'Cloud Saving',
      'Opening Projects from the Cloud.md'
    ]
  },
  Features: {
    'Mulyankans Current Features': [
      'Features',
      'Mulyankans Current Features.md'
    ],
    'Under Development': ['Features', 'Under Development.md'],
    'Maybe in the Future??': ['Features', 'Maybe in the Future.md']
  },
  FAQ: {
    'What about the privacy of my projects?': [
      'FAQ',
      'What about the privacy of my projects.md'
    ],
    'Will multiple users be able to work on the same project?': [
      'FAQ',
      'Will multiple users be able to work on the same project.md'
    ],
    'How can I get new features': ['FAQ', 'How can I get new features.md'],
    "I'm facing a problem that I can't solve!": [
      'FAQ',
      "I'm facing a problem that I can't solve!.md"
    ],
    "My question isn't answered here...": [
      'FAQ',
      "My question isn't answered here...md"
    ]
  }
}

const getDocs = () => {
  let temp = {}
  for (const category in docsStructure) {
    temp[category] = {}
  }
  for (const category in docsStructure) {
    for (const subcategory in docsStructure[category]) {
      temp[category][subcategory] = readFileSync(
        resolve(
          __dirname,
          '..',
          'docs',
          ...docsStructure[category][subcategory]
        ),
        'utf-8'
      )
    }
  }
  return temp
}

module.exports = { getDocs, docsStructure }
