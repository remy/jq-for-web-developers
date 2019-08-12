---
layout: 'base'
order: 6
title: String interpolation
---

# String interpolation

Printing out strings comprised of values from your data is a fairly common requirement. Interpolation allows us to include placeholders in our strings for the values to populate.

JavaScript has [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (or template strings), which performs the same function.

So using JavaScript as our common base of knowledge, let's take the following JSON and transform it into a human readable string:

```json{id="source"}
{
  "input": {
    "size": 395047,
    "type": "image/png"
  },
  "output": {
    "size": 90318,
    "type": "image/png",
    "width": 1582,
    "height": 988,
    "ratio": 0.2286
  }
}
```

The final result I would like is the size of the file before and after the compression, and the compression saving (calculated by `(1 - ratio) * 100`).

Using JavaScript, the function could be:

```js
function format(object) {
  const before = Math.floor(object.input.size  / 1024);
  const after = Math.floor(object.output.size  / 1024);
  const amount = Math.floor((1 - object.output.ratio) * 100);
  return `${before}Kb > ${after}kb, saving ${amount}%`;
}

console.log(format(compression));
// 385Kb > 88Kb, saving 77%
```

jq offers string interpolation in a very similar way to how it works in JavaScript.

Remember that strings _must_ use double quote, and the "root" object is represented by the period character `.`. To perform interpolation, the syntax is `\( … )` (compared to JavaScript's `${ … }`).

Inside this placeholder, any valid jq command can run, so we can access object properties and even perform the formatting inline.

Assuming the source data is stored in compression.json, we can print the sizes using the following:

```jq{data-source="#source"}
"\(.input.size / 1024) > \(.output.size / 1024)"
```

Before we add the compression saving, I can see two problems with the output: the floating points and the result is quoted - which we don't want.

## A touch of math

jq provides a number of builtin math functions, but these are limited based on your own operating system's support. That's to say: your milage may vary. The full details can be found on the [jq manual math section](https://stedolan.github.io/jq/manual/#Math).

Originally I had wanted to _round_ the result, but my own version of jq throws an error when I used `round`:

```
jq: error: round/0 is not defined at <top-level>
```

A reasonable workaround was to use `floor` (as I did in the JavaScript example). The `floor` function would be used as any other function in jq. If I pass in the value `10.55` to jq:

```jq{data-source="10.55"}
floor # aka `echo "10.55" | jq '. | floor'`
```

So adding `floor` to the original example, it goes _inside_ the placeholder:

```jq{data-source="#source"}
"\(.input.size / 1024 | floor) > \(.output.size / 1024 | floor)"
```

Better. Now to remove those pesky quotes marks.

## "Raw" output

The default output for jq is JSON, so it stands to reason that a string would be quoted as JSON compatible string. That's why we see double quotes in the result.

To remove these, it's an argument to jq itself, using the `-r` or `--raw-output` option:

```jq{data-source="#source" data-options="-r"}
"\(.input.size / 1024 | floor) > \(.output.size / 1024 | floor)"
```

## Final interpolation

The final result needs the compression saving, so we add that with another string interpolation:

```jq{data-source="#source" data-options="-r"}
"\(.input.size / 1024 | floor)Kb > \(.output.size / 1024 | floor)Kb, saving \((1 - .output.ratio) * 100 | floor)%"
```

An alternative solution:

```jq{data-source="#source" data-options="-r"}
. + { saving: ((1 - .output.ratio) * 100 | floor) } |
    "\(.input.size / 1024 | floor)Kb > \(.output.size / 1024 | floor)Kb saving \(.saving)%"
```
