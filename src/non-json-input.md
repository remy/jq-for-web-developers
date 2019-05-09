## Slurping JSON with lines

There will be times when the JSON is a series of of JSON objects - but not particularly valid JSON. If you've ever used JSON as a logging format you might be familiar with this already.

JSON with lines isn't parsable by `jq` by default, and you can't parse it in JavaScript using `JSON.parse`. It looks a bit like this:

```
{"name": "Gilbert", "wins": [["straight", "7♣"], ["one pair", "10♥"]]}
{"name": "Alexa", "wins": [["two pair", "4♠"], ["two pair", "9♠"]]}
{"name": "May", "wins": []}
{"name": "Deloise", "wins": [["three of a kind", "5♣"]]}
```

Example taken from [JSON Lines](http://jsonlines.org/examples/).

If you need to treat this source as an array, then the _slurp_ argument should be used when `jq` is invoked:

```
cat card-hands.json | jq --slurp # also aliased to -s
[
  {"name":"Gilbert", … },
  {"name":"Alexa", … },
  {"name":"May", … }
]
```

## Working with non-JSON

If working with CSV as a source, I find it useful to convert these to JSON first. There's an excellent collection of CSV tools available at [CSV Kit](https://csvkit.readthedocs.io/en/1.0.3/) - in particular the `csvjson` tool.

Alternatively, if the source can't be converted to JSON before it's passed to `jq`, then `jq` can read non-JSON using the `--raw-input/-R` argument, and combined with `--slurp/-s` the input can be manipulated _into_ JSON.

Combining `--raw-input` and `--slurp` (shortened to `-Rs`) converts the source into a single line string.

```
echo "1\n2\n3\n4" | jq -Rs
"1\n2\n3\n4\n"
```

The single line result could then be passed through a split function and filters so to manipulate down to the desired result.

Next I'll show you how to start manipulating JSON with familiar techniques that you might already know from JavaScript.