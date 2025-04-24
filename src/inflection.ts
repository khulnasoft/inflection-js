/**
 * Base error class for inflection-js
 */
class InflectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InflectionError';
  }
}

/**
 * Error class for invalid input
 */
class InvalidInputError extends InflectionError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}

/**
 * Error class for invalid function implementation
 */
class InvalidFunctionError extends InflectionError {
  constructor(functionName: string, message: string) {
    super(`Invalid ${functionName} implementation: ${message}`);
    this.name = 'InvalidFunctionError';
  }
}

/**
 * Error class for type mismatches
 */
class TypeMismatchError extends InflectionError {
  constructor(expected: string, actual: string) {
    super(`Type mismatch: expected ${expected}, got ${actual}`);
    this.name = 'TypeMismatchError';
  }
}

/**
 * Error class for invalid parameters
 */
class InvalidParameterError extends InflectionError {
  constructor(paramName: string, message: string) {
    super(`Invalid parameter '${paramName}': ${message}`);
    this.name = 'InvalidParameterError';
  }
}

/**
 * Type definitions for inflection rules
 */
interface InflectionRule {
  pattern: RegExp;
  replacement?: string;
}

/**
 * Base type for all transformation functions
 */
type BaseTransformFunction = (str: string) => string;

/**
 * Type for transformation functions with optional boolean parameter
 */
type BooleanParamTransformFunction = (str: string, param?: boolean) => string;

/**
 * Type for transformation functions with optional string parameter
 */
type StringParamTransformFunction = (str: string, param?: string) => string;

/**
 * Type for transformation functions with optional boolean parameter for ID suffix
 */
type IdSuffixTransformFunction = (str: string, dropIdUbar?: boolean) => string;

/**
 * Union type of all possible transformation function types
 */
type TransformFunction = 
  | BaseTransformFunction
  | BooleanParamTransformFunction
  | StringParamTransformFunction
  | IdSuffixTransformFunction;

/**
 * Configuration for inflection rules
 */
interface InflectionConfig {
  uncountableWords: Set<string>;
  pluralRules: InflectionRule[];
  singularRules: InflectionRule[];
  irregularRules: Map<string, string>;
}

/**
 * Type for transformation function names
 */
type TransformFunctionName = 
  | 'pluralize'
  | 'singularize'
  | 'camelize'
  | 'underscore'
  | 'humanize'
  | 'capitalize'
  | 'dasherize'
  | 'titleize'
  | 'demodulize'
  | 'tableize'
  | 'classify'
  | 'foreignKey'
  | 'ordinalize';

/**
 * Type for transformation function parameters
 */
interface TransformFunctionParams {
  pluralize: StringParamTransformFunction;
  singularize: StringParamTransformFunction;
  camelize: BooleanParamTransformFunction;
  underscore: BooleanParamTransformFunction;
  humanize: BooleanParamTransformFunction;
  capitalize: BaseTransformFunction;
  dasherize: BaseTransformFunction;
  titleize: BaseTransformFunction;
  demodulize: BaseTransformFunction;
  tableize: BaseTransformFunction;
  classify: BaseTransformFunction;
  foreignKey: IdSuffixTransformFunction;
  ordinalize: BaseTransformFunction;
}

/**
 * Type for transformation function return types
 */
type TransformFunctionReturn<T extends TransformFunctionName> = string;

/**
 * Type for the transform function array parameter
 */
type TransformFunctionArray = TransformFunctionName[];

/**
 * Cache for memoized results
 */
const memoCache = new Map<string, string>();

/**
 * Memoization wrapper for transformation functions
 */
function memoize<T extends (...args: any[]) => string>(fn: T): T {
  return function(...args: Parameters<T>): string {
    const key = JSON.stringify(args);
    if (memoCache.has(key)) {
      return memoCache.get(key)!;
    }
    const result = fn(...args);
    memoCache.set(key, result);
    return result;
  } as T;
}

/**
 * @description This is a Set of nouns that use the same form for both singular and plural.
 *              This list should remain entirely in lower case to correctly match Strings.
 */
const uncountableWords = new Set([
    'accommodation',
    'adulthood',
    'advertising',
    'advice',
    'aggression',
    'aid',
    'air',
    'aircraft',
    'alcohol',
    'anger',
    'applause',
    'arithmetic',
    'assistance',
    'athletics',
    'bacon',
    'baggage',
    'beef',
    'biology',
    'blood',
    'botany',
    'bread',
    'butter',
    'carbon',
    'cardboard',
    'cash',
    'chalk',
    'chaos',
    'chess',
    'crossroads',
    'countryside',
    'dancing',
    'deer',
    'dignity',
    'dirt',
    'dust',
    'economics',
    'education',
    'electricity',
    'engineering',
    'enjoyment',
    'envy',
    'equipment',
    'ethics',
    'evidence',
    'evolution',
    'fame',
    'fiction',
    'flour',
    'flu',
    'food',
    'gallows',
    'garbage',
    'garlic',
    'genetics',
    'gold',
    'golf',
    'gossip',
    'gratitude',
    'grief',
    'guilt',
    'gymnastics',
    'happiness',
    'hardware',
    'harm',
    'hate',
    'hatred',
    'health',
    'heat',
    'help',
    'homework',
    'honesty',
    'honey',
    'hospitality',
    'housework',
    'humour',
    'hunger',
    'hydrogen',
    'ice',
    'importance',
    'inflation',
    'information',
    'innocence',
    'iron',
    'irony',
    'jam',
    'jewelry',
    'judo',
    'karate',
    'knowledge',
    'lack',
    'laughter',
    'lava',
    'leather',
    'leisure',
    'lightning',
    'linguine',
    'linguini',
    'linguistics',
    'literature',
    'litter',
    'livestock',
    'logic',
    'loneliness',
    'luck',
    'luggage',
    'macaroni',
    'machinery',
    'magic',
    'management',
    'mankind',
    'marble',
    'mathematics',
    'mayonnaise',
    'measles',
    'meta',
    'methane',
    'milk',
    'minus',
    'money',
    'mud',
    'music',
    'mumps',
    'nature',
    'news',
    'nitrogen',
    'nonsense',
    'nurture',
    'nutrition',
    'obedience',
    'obesity',
    'oxygen',
    'pasta',
    'patience',
    'physics',
    'poetry',
    'pollution',
    'poverty',
    'pride',
    'psychology',
    'publicity',
    'punctuation',
    'quartz',
    'racism',
    'relaxation',
    'reliability',
    'research',
    'respect',
    'revenge',
    'rice',
    'rubbish',
    'rum',
    'safety',
    'scenery',
    'seafood',
    'seaside',
    'series',
    'shame',
    'sheep',
    'shopping',
    'sleep',
    'smoke',
    'smoking',
    'snow',
    'soap',
    'software',
    'soil',
    'spaghetti',
    'steam',
    'stuff',
    'stupidity',
    'sunshine',
    'symmetry',
    'tennis',
    'thirst',
    'thunder',
    'timber',
    'trust',
    'underwear',
    'unemployment',
    'unity',
    'validity',
    'veal',
    'vegetation',
    'vegetarianism',
    'vengeance',
    'violence',
    'vitality',
    'warmth',
    'wealth',
    'weather',
    'welfare',
    'wheat',
    'wisdom',
    'yoga',
    'zinc',
    'zoology',
]);

/**
 * @description These rules translate from the singular form of a noun to its plural form.
 */

const regex = {
  plural: {
    men: new RegExp('^(m|wom)en$', 'gi'),
    people: new RegExp('(pe)ople$', 'gi'),
    children: new RegExp('(child)ren$', 'gi'),
    tia: new RegExp('([ti])a$', 'gi'),
    analyses: new RegExp(
      '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$',
      'gi'
    ),
    databases: new RegExp('(database)s$', 'gi'),
    drives: new RegExp('(drive)s$', 'gi'),
    hives: new RegExp('(hi|ti)ves$', 'gi'),
    curves: new RegExp('(curve)s$', 'gi'),
    lrves: new RegExp('([lr])ves$', 'gi'),
    aves: new RegExp('([a])ves$', 'gi'),
    foves: new RegExp('([^fo])ves$', 'gi'),
    movies: new RegExp('(m)ovies$', 'gi'),
    aeiouyies: new RegExp('([^aeiouy]|qu)ies$', 'gi'),
    series: new RegExp('(s)eries$', 'gi'),
    xes: new RegExp('(x|ch|ss|sh)es$', 'gi'),
    mice: new RegExp('([m|l])ice$', 'gi'),
    buses: new RegExp('(bus)es$', 'gi'),
    oes: new RegExp('(o)es$', 'gi'),
    shoes: new RegExp('(shoe)s$', 'gi'),
    crises: new RegExp('(cris|ax|test)es$', 'gi'),
    octopuses: new RegExp('(octop|vir)uses$', 'gi'),
    aliases: new RegExp('(alias|canvas|status|campus)es$', 'gi'),
    summonses: new RegExp('^(summons|bonus)es$', 'gi'),
    oxen: new RegExp('^(ox)en', 'gi'),
    matrices: new RegExp('(matr)ices$', 'gi'),
    vertices: new RegExp('(vert|ind)ices$', 'gi'),
    feet: new RegExp('^feet$', 'gi'),
    teeth: new RegExp('^teeth$', 'gi'),
    geese: new RegExp('^geese$', 'gi'),
    quizzes: new RegExp('(quiz)zes$', 'gi'),
    whereases: new RegExp('^(whereas)es$', 'gi'),
    criteria: new RegExp('^(criteri)a$', 'gi'),
    genera: new RegExp('^genera$', 'gi'),
    ss: new RegExp('ss$', 'gi'),
    s: new RegExp('s$', 'gi'),
  },

  singular: {
    man: new RegExp('^(m|wom)an$', 'gi'),
    person: new RegExp('(pe)rson$', 'gi'),
    child: new RegExp('(child)$', 'gi'),
    drive: new RegExp('(drive)$', 'gi'),
    ox: new RegExp('^(ox)$', 'gi'),
    axis: new RegExp('(ax|test)is$', 'gi'),
    octopus: new RegExp('(octop|vir)us$', 'gi'),
    alias: new RegExp('(alias|status|canvas|campus)$', 'gi'),
    summons: new RegExp('^(summons|bonus)$', 'gi'),
    bus: new RegExp('(bu)s$', 'gi'),
    buffalo: new RegExp('(buffal|tomat|potat)o$', 'gi'),
    tium: new RegExp('([ti])um$', 'gi'),
    sis: new RegExp('sis$', 'gi'),
    ffe: new RegExp('(?:([^f])fe|([lr])f)$', 'gi'),
    focus: new RegExp('^(focus)$', 'gi'),
    hive: new RegExp('(hi|ti)ve$', 'gi'),
    aeiouyy: new RegExp('([^aeiouy]|qu)y$', 'gi'),
    x: new RegExp('(x|ch|ss|sh)$', 'gi'),
    matrix: new RegExp('(matr)ix$', 'gi'),
    vertex: new RegExp('(vert|ind)ex$', 'gi'),
    mouse: new RegExp('([m|l])ouse$', 'gi'),
    foot: new RegExp('^foot$', 'gi'),
    tooth: new RegExp('^tooth$', 'gi'),
    goose: new RegExp('^goose$', 'gi'),
    quiz: new RegExp('(quiz)$', 'gi'),
    whereas: new RegExp('^(whereas)$', 'gi'),
    criterion: new RegExp('^(criteri)on$', 'gi'),
    genus: new RegExp('^genus$', 'gi'),
    s: new RegExp('s$', 'gi'),
    common: new RegExp('$', 'gi'),
  },
};

const pluralRules: [RegExp, string?][] = [
  // do not replace if its already a plural word
  [regex.plural.men],
  [regex.plural.people],
  [regex.plural.children],
  [regex.plural.tia],
  [regex.plural.analyses],
  [regex.plural.databases],
  [regex.plural.drives],
  [regex.plural.hives],
  [regex.plural.curves],
  [regex.plural.lrves],
  [regex.plural.foves],
  [regex.plural.aeiouyies],
  [regex.plural.series],
  [regex.plural.movies],
  [regex.plural.xes],
  [regex.plural.mice],
  [regex.plural.buses],
  [regex.plural.oes],
  [regex.plural.shoes],
  [regex.plural.crises],
  [regex.plural.octopuses],
  [regex.plural.aliases],
  [regex.plural.summonses],
  [regex.plural.oxen],
  [regex.plural.matrices],
  [regex.plural.feet],
  [regex.plural.teeth],
  [regex.plural.geese],
  [regex.plural.quizzes],
  [regex.plural.whereases],
  [regex.plural.criteria],
  [regex.plural.genera],

  // original rule
  [regex.singular.man, '$1en'],
  [regex.singular.person, '$1ople'],
  [regex.singular.child, '$1ren'],
  [regex.singular.drive, '$1s'],
  [regex.singular.ox, '$1en'],
  [regex.singular.axis, '$1es'],
  [regex.singular.octopus, '$1uses'],
  [regex.singular.alias, '$1es'],
  [regex.singular.summons, '$1es'],
  [regex.singular.bus, '$1ses'],
  [regex.singular.buffalo, '$1oes'],
  [regex.singular.tium, '$1a'],
  [regex.singular.sis, 'ses'],
  [regex.singular.ffe, '$1$2ves'],
  [regex.singular.focus, '$1es'],
  [regex.singular.hive, '$1ves'],
  [regex.singular.aeiouyy, '$1ies'],
  [regex.singular.matrix, '$1ices'],
  [regex.singular.vertex, '$1ices'],
  [regex.singular.x, '$1es'],
  [regex.singular.mouse, '$1ice'],
  [regex.singular.foot, 'feet'],
  [regex.singular.tooth, 'teeth'],
  [regex.singular.goose, 'geese'],
  [regex.singular.quiz, '$1zes'],
  [regex.singular.whereas, '$1es'],
  [regex.singular.criterion, '$1a'],
  [regex.singular.genus, 'genera'],

  [regex.singular.s, 's'],
  [regex.singular.common, 's'],
];

/**
 * @description These rules translate from the plural form of a noun to its singular form.
 */
const singularRules: [RegExp, string?][] = [
  // do not replace if its already a singular word
  [regex.singular.man],
  [regex.singular.person],
  [regex.singular.child],
  [regex.singular.drive],
  [regex.singular.ox],
  [regex.singular.axis],
  [regex.singular.octopus],
  [regex.singular.alias],
  [regex.singular.summons],
  [regex.singular.bus],
  [regex.singular.buffalo],
  [regex.singular.tium],
  [regex.singular.sis],
  [regex.singular.ffe],
  [regex.singular.focus],
  [regex.singular.hive],
  [regex.singular.aeiouyy],
  [regex.singular.x],
  [regex.singular.matrix],
  [regex.singular.mouse],
  [regex.singular.foot],
  [regex.singular.tooth],
  [regex.singular.goose],
  [regex.singular.quiz],
  [regex.singular.whereas],
  [regex.singular.criterion],
  [regex.singular.genus],

  // original rule
  [regex.plural.men, '$1an'],
  [regex.plural.people, '$1rson'],
  [regex.plural.children, '$1'],
  [regex.plural.databases, '$1'],
  [regex.plural.drives, '$1'],
  [regex.plural.genera, 'genus'],
  [regex.plural.criteria, '$1on'],
  [regex.plural.tia, '$1um'],
  [regex.plural.analyses, '$1$2sis'],
  [regex.plural.hives, '$1ve'],
  [regex.plural.curves, '$1'],
  [regex.plural.lrves, '$1f'],
  [regex.plural.aves, '$1ve'],
  [regex.plural.foves, '$1fe'],
  [regex.plural.movies, '$1ovie'],
  [regex.plural.aeiouyies, '$1y'],
  [regex.plural.series, '$1eries'],
  [regex.plural.xes, '$1'],
  [regex.plural.mice, '$1ouse'],
  [regex.plural.buses, '$1'],
  [regex.plural.oes, '$1'],
  [regex.plural.shoes, '$1'],
  [regex.plural.crises, '$1is'],
  [regex.plural.octopuses, '$1us'],
  [regex.plural.aliases, '$1'],
  [regex.plural.summonses, '$1'],
  [regex.plural.oxen, '$1'],
  [regex.plural.matrices, '$1ix'],
  [regex.plural.vertices, '$1ex'],
  [regex.plural.feet, 'foot'],
  [regex.plural.teeth, 'tooth'],
  [regex.plural.geese, 'goose'],
  [regex.plural.quizzes, '$1'],
  [regex.plural.whereases, '$1'],

  // Add rule for 'metas'
  [/metas$/i, 'meta'],

  [regex.plural.ss, 'ss'],
  [regex.plural.s, ''],
];

/**
 * @description This is a list of words that should not be capitalized for title case.
 */
const nonTitlecasedWords = [
  'and',
  'or',
  'nor',
  'a',
  'an',
  'the',
  'so',
  'but',
  'to',
  'of',
  'at',
  'by',
  'from',
  'into',
  'on',
  'onto',
  'off',
  'out',
  'in',
  'over',
  'with',
  'for',
];

/**
 * @description These are regular expressions used for converting between String formats.
 */
const idSuffix = new RegExp('(_ids|_id)$', 'g');
const underbar = new RegExp('_', 'g');
const spaceOrUnderbar = new RegExp('[ _]', 'g');
const uppercase = new RegExp('([A-Z])', 'g');
const underbarPrefix = new RegExp('^_');

/**
 * A helper method that applies rules based replacement to a String.
 * @param str String to modify and return based on the passed rules.
 * @param rules Regexp to match paired with String to use for replacement
 * @param skip Strings to skip if they match
 * @param override String to return as though this method succeeded (used to conform to APIs)
 * @returns Return passed String modified by passed rules.
 * @example
 *
 *     applyRules( 'cows', singular_rules ); // === 'cow'
 */
function applyRules(
  str: string,
  rules: [RegExp, string?][],
  skip: Set<string>,
  override?: string
) {
  if (override) {
    return override;
  }

  if (skip.has(str.toLowerCase())) {
    return str;
  }

  for (const [rule, replacement] of rules) {
    if (rule.test(str)) {
      // Reset lastIndex since we're reusing the regex
      rule.lastIndex = 0;
      return replacement ? str.replace(rule, replacement) : str;
    }
  }

  return str;
}

/**
 * Validates input string
 * @throws {Error} If input is not a string or is empty
 */
function validateInput(str: unknown): asserts str is string {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }
  if (str.length === 0) {
    throw new Error('Input string cannot be empty');
  }
}

/**
 * Type guard for checking if a value is a valid transformation function name
 */
function isTransformFunctionName(value: string): value is TransformFunctionName {
  return value in transformFunctions;
}

/**
 * Type guard for checking if a value is a valid transformation function
 */
function isTransformFunction(value: unknown): value is TransformFunction {
  return typeof value === 'function' && value.length >= 1;
}

/**
 * Type guard for checking if a value is a base transformation function
 */
function isBaseTransformFunction(value: unknown): value is BaseTransformFunction {
  return typeof value === 'function' && value.length === 1;
}

/**
 * Type guard for checking if a value is a boolean parameter transformation function
 */
function isBooleanParamTransformFunction(value: unknown): value is BooleanParamTransformFunction {
  return typeof value === 'function' && value.length <= 2;
}

/**
 * Type guard for checking if a value is a string parameter transformation function
 */
function isStringParamTransformFunction(value: unknown): value is StringParamTransformFunction {
  return typeof value === 'function' && value.length <= 2;
}

/**
 * Type guard for checking if a value is an ID suffix transformation function
 */
function isIdSuffixTransformFunction(value: unknown): value is IdSuffixTransformFunction {
  return typeof value === 'function' && value.length <= 2;
}

/**
 * This function adds pluralization support to every String object.
 * @param str The subject string.
 * @param plural Overrides normal output with said String.(optional)
 * @returns Singular English language nouns are returned in plural form.
 */
export function pluralize(str: string, plural?: string): TransformFunctionReturn<'pluralize'> {
  validateInput(str);
  if (plural) validateInput(plural);
  return applyRules(str, pluralRules, uncountableWords, plural);
}

/**
 * This function adds singularization support to every String object.
 * @param str The subject string.
 * @param singular Overrides normal output with said String.(optional)
 * @returns Plural English language nouns are returned in singular form.
 */
export function singularize(str: string, singular?: string): TransformFunctionReturn<'singularize'> {
  validateInput(str);
  if (singular) validateInput(singular);
  return applyRules(str, singularRules, uncountableWords, singular);
}

/**
 * This function will pluralize or singularlize a String appropriately based on a number value
 * @param str The subject string.
 * @param count The number to base pluralization off of.
 * @param singular Overrides normal output with said String.(optional)
 * @param plural Overrides normal output with said String.(optional)
 * @returns English language nouns are returned in the plural or singular form based on the count.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.inflect( 'people' 1 ); // === 'person'
 *     inflection.inflect( 'octopuses' 1 ); // === 'octopus'
 *     inflection.inflect( 'Hats' 1 ); // === 'Hat'
 *     inflection.inflect( 'guys', 1 , 'person' ); // === 'person'
 *     inflection.inflect( 'inches', 1.5 ); // === 'inches'
 *     inflection.inflect( 'person', 2 ); // === 'people'
 *     inflection.inflect( 'octopus', 2 ); // === 'octopuses'
 *     inflection.inflect( 'Hat', 2 ); // === 'Hats'
 *     inflection.inflect( 'person', 2, null, 'guys' ); // === 'guys'
 */
export function inflect(
  str: string,
  count: number,
  singular?: string,
  plural?: string
) {
  if (isNaN(count)) return str;

  if (count === 1) {
    return applyRules(str, singularRules, uncountableWords, singular);
  } else {
    return applyRules(str, pluralRules, uncountableWords, plural);
  }
}

/**
 * This function adds camelization support to every String object.
 * @param str The subject string.
 * @param lowFirstLetter Default is to capitalize the first letter of the results.(optional)
 *                                 Passing true will lowercase it.
 * @returns Lower case underscored words will be returned in camel case.
 *                  additionally '/' is translated to '::'
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.camelize( 'message_properties' ); // === 'MessageProperties'
 *     inflection.camelize( 'message_properties', true ); // === 'messageProperties'
 */
export function camelize(str: string, lowFirstLetter?: boolean) {
  const strPath = str.split('/');
  const j = strPath.length;
  let strArr: string[], k: number, l: number, first: string;

  for (let i = 0; i < j; i++) {
    strArr = strPath[i].split('_');
    k = 0;
    l = strArr.length;

    for (; k < l; k++) {
      if (k === 0) {
        if (!lowFirstLetter) {
          first = strArr[k].charAt(0).toUpperCase();
          strArr[k] = first + strArr[k].substring(1);
        } else {
          first = strArr[k].charAt(0).toLowerCase();
          strArr[k] = first + strArr[k].substring(1);
        }
      } else {
        first = strArr[k].charAt(0).toUpperCase();
        strArr[k] = first + strArr[k].substring(1).toLowerCase();
      }
    }

    strPath[i] = strArr.join('');
  }

  return strPath.join('::');
}

/**
 * This function adds underscore support to every String object.
 * @param str The subject string.
 * @param allUpperCase Default is to lowercase and add underscore prefix.(optional)
 *                  Passing true will return as entered.
 * @returns Camel cased words are returned as lower cased and underscored.
 *                  additionally '::' is translated to '/'.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.underscore( 'MessageProperties' ); // === 'message_properties'
 *     inflection.underscore( 'messageProperties' ); // === 'message_properties'
 *     inflection.underscore( 'MP', true ); // === 'MP'
 */
export function underscore(str: string, allUpperCase?: boolean) {
  if (allUpperCase && str === str.toUpperCase()) return str;

  const strPath = str.split('::');
  const j = strPath.length;

  for (let i = 0; i < j; i++) {
    strPath[i] = strPath[i].replace(uppercase, '_$1');
    strPath[i] = strPath[i].replace(underbarPrefix, '');
  }

  return strPath.join('/').toLowerCase();
}

/**
 * This function adds humanize support to every String object.
 * @param str The subject string.
 * @param lowFirstLetter Default is to capitalize the first letter of the results.(optional)
 *                                 Passing true will lowercase it.
 * @returns Lower case underscored words will be returned in humanized form.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.humanize( 'message_properties' ); // === 'Message properties'
 *     inflection.humanize( 'message_properties', true ); // === 'message properties'
 */
export function humanize(str: string, lowFirstLetter?: boolean) {
  str = str.toLowerCase();
  str = str.replace(idSuffix, '');
  str = str.replace(underbar, ' ');

  if (!lowFirstLetter) {
    str = capitalize(str);
  }

  return str;
}

/**
 * This function adds capitalization support to every String object.
 * @param str The subject string.
 * @returns All characters will be lower case and the first will be upper.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.capitalize( 'message_properties' ); // === 'Message_properties'
 *     inflection.capitalize( 'message properties', true ); // === 'Message properties'
 */
export function capitalize(str: string) {
  str = str.toLowerCase();

  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

/**
 * This function replaces underscores with dashes in the string.
 * @param str The subject string.
 * @returns Replaces all spaces or underscores with dashes.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.dasherize( 'message_properties' ); // === 'message-properties'
 *     inflection.dasherize( 'Message Properties' ); // === 'Message-Properties'
 */
export function dasherize(str: string) {
  return str.replace(spaceOrUnderbar, '-');
}

/**
 * This function adds titleize support to every String object.
 * @param str The subject string.
 * @returns Capitalizes words as you would for a book title.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.titleize( 'message_properties' ); // === 'Message Properties'
 *     inflection.titleize( 'message properties to keep' ); // === 'Message Properties to Keep'
 */
export function titleize(str: string) {
  str = str.toLowerCase().replace(underbar, ' ');
  const strArr = str.split(' ');
  const j = strArr.length;
  let d: string[], l: number;

  for (let i = 0; i < j; i++) {
    d = strArr[i].split('-');
    l = d.length;

    for (let k = 0; k < l; k++) {
      if (nonTitlecasedWords.indexOf(d[k].toLowerCase()) < 0) {
        d[k] = capitalize(d[k]);
      }
    }

    strArr[i] = d.join('-');
  }

  str = strArr.join(' ');
  str = str.substring(0, 1).toUpperCase() + str.substring(1);

  return str;
}

/**
 * This function adds demodulize support to every String object.
 * @param str The subject string.
 * @returns Removes module names leaving only class names.(Ruby style)
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.demodulize( 'Message::Bus::Properties' ); // === 'Properties'
 */
export function demodulize(str: string) {
  const strArr = str.split('::');

  return strArr[strArr.length - 1];
}

/**
 * This function adds tableize support to every String object.
 * @param str The subject string.
 * @returns Return camel cased words into their underscored plural form.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.tableize( 'MessageBusProperty' ); // === 'message_bus_properties'
 */
export function tableize(str: string) {
  str = underscore(str);
  str = pluralize(str);

  return str;
}

/**
 * This function adds classification support to every String object.
 * @param str The subject string.
 * @returns Underscored plural nouns become the camel cased singular form.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.classify( 'message_bus_properties' ); // === 'MessageBusProperty'
 */
export function classify(str: string) {
  str = camelize(str);
  str = singularize(str);

  return str;
}

/**
 * This function adds foreign key support to every String object.
 * @param str The subject string.
 * @param dropIdUbar Default is to seperate id with an underbar at the end of the class name,
                                   you can pass true to skip it.(optional)
 * @returns Underscored plural nouns become the camel cased singular form.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.foreign_key( 'MessageBusProperty' ); // === 'message_bus_property_id'
 *     inflection.foreign_key( 'MessageBusProperty', true ); // === 'message_bus_propertyid'
 */
export function foreignKey(str: string, dropIdUbar?: boolean) {
  str = demodulize(str);
  str = underscore(str) + (dropIdUbar ? '' : '_') + 'id';

  return str;
}

/**
 * This function adds ordinalize support to every String object.
 * @param str The subject string.
 * @returns Return all found numbers their sequence like '22nd'.
 * @example
 *
 *     const inflection = require( 'inflection' );
 *
 *     inflection.ordinalize( 'the 1 pitch' ); // === 'the 1st pitch'
 */
export function ordinalize(str: string) {
  const strArr = str.split(' ');
  const j = strArr.length;

  for (let i = 0; i < j; i++) {
    const k = parseInt(strArr[i], 10);

    if (!isNaN(k)) {
      const ltd = strArr[i].substring(strArr[i].length - 2);
      const ld = strArr[i].substring(strArr[i].length - 1);
      let suf = 'th';

      if (ltd != '11' && ltd != '12' && ltd != '13') {
        if (ld === '1') {
          suf = 'st';
        } else if (ld === '2') {
          suf = 'nd';
        } else if (ld === '3') {
          suf = 'rd';
        }
      }

      strArr[i] += suf;
    }
  }

  return strArr.join(' ');
}

const transformFunctions: Record<TransformFunctionName, TransformFunction> = {
  pluralize: (str: string, plural?: string): string => {
    if (!isStringParamTransformFunction(pluralize)) {
      throw new Error('Invalid pluralize function implementation');
    }
    return pluralize(str, plural);
  },
  singularize: (str: string, singular?: string): string => {
    if (!isStringParamTransformFunction(singularize)) {
      throw new Error('Invalid singularize function implementation');
    }
    return singularize(str, singular);
  },
  camelize: (str: string, lowFirstLetter?: boolean): string => {
    if (!isBooleanParamTransformFunction(camelize)) {
      throw new Error('Invalid camelize function implementation');
    }
    return camelize(str, lowFirstLetter);
  },
  underscore: (str: string, allUpperCase?: boolean): string => {
    if (!isBooleanParamTransformFunction(underscore)) {
      throw new Error('Invalid underscore function implementation');
    }
    return underscore(str, allUpperCase);
  },
  humanize: (str: string, lowFirstLetter?: boolean): string => {
    if (!isBooleanParamTransformFunction(humanize)) {
      throw new Error('Invalid humanize function implementation');
    }
    return humanize(str, lowFirstLetter);
  },
  capitalize: (str: string): string => {
    if (!isBaseTransformFunction(capitalize)) {
      throw new Error('Invalid capitalize function implementation');
    }
    return capitalize(str);
  },
  dasherize: (str: string): string => {
    if (!isBaseTransformFunction(dasherize)) {
      throw new Error('Invalid dasherize function implementation');
    }
    return dasherize(str);
  },
  titleize: (str: string): string => {
    if (!isBaseTransformFunction(titleize)) {
      throw new Error('Invalid titleize function implementation');
    }
    return titleize(str);
  },
  demodulize: (str: string): string => {
    if (!isBaseTransformFunction(demodulize)) {
      throw new Error('Invalid demodulize function implementation');
    }
    return demodulize(str);
  },
  tableize: (str: string): string => {
    if (!isBaseTransformFunction(tableize)) {
      throw new Error('Invalid tableize function implementation');
    }
    return tableize(str);
  },
  classify: (str: string): string => {
    if (!isBaseTransformFunction(classify)) {
      throw new Error('Invalid classify function implementation');
    }
    return classify(str);
  },
  foreignKey: (str: string, dropIdUbar?: boolean): string => {
    if (!isIdSuffixTransformFunction(foreignKey)) {
      throw new Error('Invalid foreignKey function implementation');
    }
    return foreignKey(str, dropIdUbar);
  },
  ordinalize: (str: string): string => {
    if (!isBaseTransformFunction(ordinalize)) {
      throw new Error('Invalid ordinalize function implementation');
    }
    return ordinalize(str);
  }
} as const;

/**
 * This function performs multiple inflection methods on a string
 * @param str The subject string.
 * @param arr An array of inflection methods.
 * @returns The transformed string
 */
export function transform(
  str: string,
  arr: TransformFunctionArray
): string {
  validateInput(str);
  
  if (!Array.isArray(arr)) {
    throw new Error('Second argument must be an array of transformation function names');
  }

  return arr.reduce((result, method) => {
    if (!isTransformFunctionName(method)) {
      throw new Error(`Invalid transformation function name: ${method}`);
    }
    
    const transformFn = transformFunctions[method];
    if (!isTransformFunction(transformFn)) {
      throw new Error(`Invalid transformation function: ${method}`);
    }
    
    return transformFn(result);
  }, str);
}