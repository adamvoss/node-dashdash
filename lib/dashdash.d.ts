// Type definitions for dashdash 1.14
// Project: https://github.com/trentm/node-dashdash#readme

/// <reference types="node" />

export class Parser {
    constructor(config: ParseConfiguration);

    bashCompletion(args: BashCompletionConfiguration): string;

    help(config?: HelpConfiguration): string;

    parse(inputs?: string[]): Results;
}

export function addOptionType(optionType: OptionType): void;

export function bashCompletionFromOptions(args: BashCompletionConfiguration): string;

export function bashCompletionSpecFromOptions(args: BashCompletionSpecConfiguration): string;

export function createParser(config: ParseConfiguration): Parser;

export function getOptionType(name: string): OptionType;

export function parse(config: ParseConfiguration): Results;

export interface Results {
    [key: string]: any;
    _order: Arg[];
    _args: string[];
}

export interface Arg {
    name: string;
    value: any;
    from: string;
}

/**
 * Used by node-cmdln to put together a synopsis of options for a command
 */
export function synopsisFromOpt(o: Option): string;

export type Option = OptionWithoutAliases | OptionWithAliases;

export interface ParseConfiguration {
    /**
     * The argv to parse. Defaults to `process.argv`.
     */
    argv?: string[];

    /**
     * The index into argv at which options/args begin.  Default is 2, as appropriate for `process.argv`.
     */
    slice?: number;

    /**
     * The env to use for 'env' entries in the option specs. Defaults to `process.env`.
     */
    env?: NodeJS.ProcessEnv;

    options?: Array<Option | Group>;
}

export interface OptionWithoutAliases extends OptionBase {
    /**
     * The option name
     */
    name: string;
}

export interface OptionWithAliases extends OptionBase {
    /**
     * The option name and aliases. The first name (if more than one given) is the key for the parsed `opts` object.
     */
    names: string[];
}

export interface OptionBase {
    /**
     * One of: bool, string, number, integer, positiveInteger, arrayOfBool, arrayOfString,
     * arrayOfNumber, arrayOfInteger, arrayOfPositiveInteger, arrayOfDate,
     * date (epoch seconds, e.g. 1396031701, or ISO 8601 format YYYY-MM-DD[THH:MM:SS[.sss][Z]], e.g. "2014-03-28T18:35:01.489Z").
     * You can add your own custom option types with `dashdash.addOptionType`
     * These names attempt to match with asserts on `assert-plus`.
     */
    type: string;

    /**
     * This is used for Bash completion for an option argument.
     * If not specified, then the value of type is used. Any string may be specified, but only the following values have meaning:
     *  - none: Provide no completions.
     *  - file: Bash's default completion (i.e. complete -o default), which includes filenames.
     *  - Any string FOO for which a function complete_FOO Bash function is defined.
     * This is for custom completions for a given tool.
     * Typically these custom functions are provided in the specExtra argument to dashdash.bashCompletionFromOptions().
     */
    completionType?: string;

    /**
     * An environment variable name (or names) that can be used as a fallback for this option.
     * An environment variable is only used as a fallback, i.e. it is ignored if the associated option is given in `argv`.
     */
    env?: string | string[];

    /**
     * Used for parser.help() output.
     */
    help?: string;

    /**
     * Used in help output as the placeholder for the option argument.
     */
    helpArg?: string;

    /**
     * Set this to false to have that option's help not be text wrapped in <parser>.help() output.
     */
    helpWrap?: boolean;

    /**
     * A default value used for this option, if the option isn't specified in argv.
     */
    default?: string;

    /**
     * If true, help output will not include this option.
     */
    hidden?: boolean;
}

export interface Group {
    group: string;
}

export interface OptionType {
    name: string;
    takesArg: boolean;
    helpArg: string;
    parseArg(option: Option, optstr: string, arg: string): any;
    array?: boolean;
    arrayFlatten?: boolean;
    default?: any;
    completionType?: any;
}

export interface BashCompletionConfiguration {
    /**
     * The tool name.
     */
    name: string;

    /**
     * The array of dashdash option specs.
     */
    options?: Array<Option | Group>;

    /**
     * Extra Bash code content to add
     * to the end of the "spec". Typically this is used to append Bash
     * "complete_TYPE" functions for custom option types.
     */
    specExtra?: string;

    /**
     * Array of completion types for positional args (i.e. non-options).
     * If not given, positional args will use Bash's 'default' completion.
     */
    argtypes?: string[];
}

export interface BashCompletionSpecConfiguration {
    /**
     * The array of dashdash option specs.
     */
    options: Array<Option | Group>;

    /**
     * A context string for the "local cmd*"
     * vars in the spec. By default it is the empty string. When used to
     * scope for completion on a *sub-command*.
     */
    context?: string;

    /**
     * By default
     * hidden options and subcmds are "excluded". Here excluded means they
     * won't be offered as a completion, but if used, their argument type
     * will be completed. "Hidden" options and subcmds are ones with the
     * `hidden: true` attribute to exclude them from default help output.
     */
    includeHidden?: boolean;

    /**
     * Array of completion types for positional args (i.e. non-options).
     * If not given, positional args will use Bash's 'default' completion.
     */
    argtypes?: string[];
}

export interface HelpConfiguration {
    /**
     * Set to a number (for that many spaces) or a string for the literal indent.
     * Default: 4
     */
    indent?: number | string;

    /**
     * Set to a number (for that many spaces) or a string for the literal indent.
     * This indent applies to group heading lines, between normal option lines.
     * Default: half length of `indent`
     */
    headingIndent?: number | string;

    /**
     * By default the names are sorted to put the short opts first (i.e. '-h, --help' preferred to '--help, -h').
     * Set to 'none' to not do this sorting.
     * Default: 'length'
     */
    nameSort?: string;

    /**
     * Note that reflow is just done on whitespace so a long token in the option help can overflow maxCol.
     * Default: 80
     */
    maxCol?: number;

    /**
     * If not set a reasonable value will be determined between minHelpCol and maxHelpCol.
     */
    helpCol?: number;

    /**
     * Default: 20
     */
    minHelpCol?: number;

    /**
     * Default: 40
     */
    maxHelpCol?: number;

    /**
     * Set to `false` to have option `help` strings not be textwrapped to the helpCol..maxCol range.
     * Default: true
     */
    helpWrap?: boolean;

    /**
     * If the option has associated environment variables (via the env option spec attribute), then append mentioned of those envvars to the help string.
     * Default: false
     */
    includeEnv?: boolean;

    /**
     * If the option has a default value (via the default option spec attribute, or a default on the option's type), then a "Default: VALUE" string will be appended to the help string.
     * Default: false
     */
    includeDefault?: boolean;
}
