# inflection-js

A JavaScript port of the popular Ruby inflection library. This library provides a comprehensive set of string transformation functions for handling word inflections, case conversions, and more.

## Installation

```bash
npm install inflection-js
```

## Features

- Pluralize and singularize words
- Convert between different case styles (camelCase, snake_case, etc.)
- Humanize strings
- Titleize strings
- And much more!

## Usage

```javascript
import {
  pluralize,
  singularize,
  camelize,
  underscore,
  humanize,
  capitalize,
  dasherize,
  titleize,
  demodulize,
  tableize,
  classify,
  foreignKey,
  ordinalize
} from 'inflection-js';

// Pluralization
pluralize('person'); // => 'people'
pluralize('octopus'); // => 'octopuses'

// Singularization
singularize('people'); // => 'person'
singularize('octopuses'); // => 'octopus'

// Case conversion
camelize('hello_world'); // => 'helloWorld'
camelize('hello_world', true); // => 'helloWorld'
underscore('helloWorld'); // => 'hello_world'

// Humanization
humanize('hello_world'); // => 'Hello world'
humanize('hello_world', true); // => 'hello world'

// Capitalization
capitalize('hello'); // => 'Hello'

// Dasherization
dasherize('hello_world'); // => 'hello-world'

// Titleization
titleize('hello world'); // => 'Hello World'

// Module handling
demodulize('MyModule::MyClass'); // => 'MyClass'

// Table/class name conversion
tableize('MyClass'); // => 'my_classes'
classify('my_classes'); // => 'MyClass'

// Foreign key generation
foreignKey('MyClass'); // => 'my_class_id'

// Ordinalization
ordinalize('1'); // => '1st'
ordinalize('2'); // => '2nd'
ordinalize('3'); // => '3rd'
ordinalize('4'); // => '4th'
```

## API Reference

### pluralize(str: string, plural?: string): string
Converts a singular word to its plural form.

### singularize(str: string, singular?: string): string
Converts a plural word to its singular form.

### camelize(str: string, lowFirstLetter?: boolean): string
Converts an underscored string to camelCase.

### underscore(str: string, allUpperCase?: boolean): string
Converts a camelCase string to underscore format.

### humanize(str: string, lowFirstLetter?: boolean): string
Converts an underscored string to a human-readable format.

### capitalize(str: string): string
Capitalizes the first letter of a string.

### dasherize(str: string): string
Converts underscores to dashes in a string.

### titleize(str: string): string
Converts a string to title case.

### demodulize(str: string): string
Removes module names from a string, leaving only the class name.

### tableize(str: string): string
Converts a class name to a table name.

### classify(str: string): string
Converts a table name to a class name.

### foreignKey(str: string, dropIdUbar?: boolean): string
Creates a foreign key name from a class name.

### ordinalize(str: string): string
Converts a number to its ordinal form.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
