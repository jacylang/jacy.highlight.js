/**
 * @param {string} value
 * @returns {RegExp}
 * */

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
 function source(re) {
    if (!re) return null;
    if (typeof re === "string") return re;

    return re.source;
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function lookahead(re) {
    return concat('(?=', re, ')');
}

/**
 * @param {...(RegExp | string) } args
 * @returns {string}
 */
function concat(...args) {
    const joined = args.map((x) => source(x)).join("");
    return joined;
}

/** @type LanguageFn */
function jacy(hljs) {
    const FUNCTION_INVOKE = {
        className: "title.function.invoke",
        relevance: 0,
        begin: concat(
            /\b/,
            /(?!let\b)/,
            hljs.IDENT_RE,
            lookahead(/\s*\(/))
    };
    const NUMBER_SUFFIX = '([ui](8|16|32|64|128)?|f(32|64))\?';
    const KEYWORDS = [
        "as",
        "break",
        "const",
        "continue",
        "else",
        "enum",
        "false",
        "func",
        "for",
        "if",
        "impl",
        "in",
        "let",
        "loop",
        "match",
        "mod",
        "move",
        "mut",
        "party",
        "priv",
        "pub",
        "ref",
        "return",
        "self",
        "Self",
        "static",
        "struct",
        "super",
        "trait",
        "true",
        "type",
        "use",
        "where",
        "while",
    ];
    const LITERALS = [
        "true",
        "false",
        "Some",
        "None",
        "Ok",
        "Err"
    ];
    const BUILTINS = [

    ];
    const TYPES = [
        "i8",
        "i16",
        "i32",
        "i64",
        "i128",
        "int",
        "u8",
        "u16",
        "u32",
        "u64",
        "u128",
        "uint",
        "f32",
        "f64",
        "str",
        "char",
        "bool",
        "Option",
        "Result",
        "String",
        "Vec",
    ];

    const OPS_RE = [
        '=',
        '+=',
        '-=',
        '*=',
        '/=',
        '%=',
        '**=',
        '<<=',
        '>>=',
        '&=',
        '|=',
        '^=',
        '+',
        '-',
        '*',
        '/',
        '%',
        '**',
        'not',
        'or',
        'and',
        '<<',
        '>>',
        '&',
        '|',
        '^',
        '~',
        '==',
        '!=',
        '<',
        '>',
        '<=',
        '>=',
        '<=>',
        '===',
        '!==',
        '..',
        '..=',
        '.',
        '::',
        '...',
        '|>',
        '$',
        '@',
    ]
    // ].map(op => op.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')).join('|');

    return {
        name: 'Jacy',
        aliases: ['jc'],
        keywords: {
            $pattern: hljs.IDENT_RE + '!?',
            type: TYPES,
            keyword: KEYWORDS,
            literal: LITERALS,
            built_in: BUILTINS,
            operator: OPS_RE,
        },
        illegal: '</',
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.COMMENT('/\\*', '\\*/', {
                contains: ['self']
            }),
            hljs.inherit(hljs.QUOTE_STRING_MODE, {
                begin: /b?"/,
                illegal: null,
            }),
            {
                className: 'string',
                variants: [
                    {
                        begin: /b?r(#*)"(.|\n)*?"\1(?!#)/
                    },
                    {
                        begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/
                    }
                ]
            },
            {
                className: 'symbol',
                begin: /'[a-zA-Z_][a-zA-Z0-9_]*/
            },
            {
                className: 'number',
                variants: [
                    {
                        begin: '\\b0b([01_]+)' + NUMBER_SUFFIX
                    },
                    {
                        begin: '\\b0o([0-7_]+)' + NUMBER_SUFFIX
                    },
                    {
                        begin: '\\b0x([A-Fa-f0-9_]+)' + NUMBER_SUFFIX
                    },
                    {
                        begin: '\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)' +
                            NUMBER_SUFFIX
                    }
                ],
                relevance: 0
            },
            {
                begin: [
                    /func/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "title.function"
                }
            },
            {
                className: 'meta',
                begin: '#!?\\[',
                end: '\\]',
                contains: [
                    {
                        className: 'string',
                        begin: /"/,
                        end: /"/
                    }
                ]
            },
            {
                begin: [
                    /let/, /\s+/,
                    /(?:mut\s+)?/,
                    hljs.UNDERSCORE_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "keyword",
                    4: "variable"
                }
            },
            // must come before impl/for rule later
            {
                begin: [
                    /for/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE,
                    /\s+/,
                    /in/
                ],
                className: {
                    1: "keyword",
                    3: "variable",
                    5: "keyword"
                }
            },
            {
                begin: [
                    /type/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "title.class"
                }
            },
            {
                begin: [
                    /(?:trait|enum|struct|union|impl|for|mod)/,
                    /\s+/,
                    hljs.UNDERSCORE_IDENT_RE
                ],
                className: {
                    1: "keyword",
                    3: "title.class"
                }
            },
            {
                begin: hljs.IDENT_RE + '::',
                keywords: {
                    keyword: "Self",
                    built_in: BUILTINS
                }
            },
            {
                className: "punctuation",
                begin: '->'
            },
            FUNCTION_INVOKE
        ]
    };
}

module.exports = jacy;
