# Viewing JSON

The `jq` command can consume JSON in a number of ways, but the most common is to _pipe_ JSON into the command. On the command line, this is done using a literal pipe character `|`.

Github has a public API that returns JSON, so I'll use that as a source for some testing. From Github's API, I've [downloaded all the recent commits](https://api.github.com/repos/remy/nodemon/commits) for one of my projects and saved it in commits.json.

Now I can use `cat` to pipe the JSON into the `jq` command:

```
cat commits.json | jq
[
  {
    "sha": "b8ff6b42e4ff2493f8fe921f5f0c0df26a926ab1",
    "node_id": "MDY6Q29tbWl0OTU4MzE0OmI4ZmY2YjQyZTRmZj…
…
```

[Demo](https://jqterm.com/5715535c2ec2badeeab6d8576099dccc?query=.)

By default, `jq` is echoing out the content it gets and _not_ applying any filters or manipulation. It will format it nicely (and you can switch this off if you want).

In fact, it's defaulting to the **identity** filter which is simply a `.` character. The `.` filter represents the identity of the current context. By that, I mean you can join filters together and transform the JSON inside a single jq command.

## Passing a filename

Sometimes you might want to pass a filename directly to `jq` because piping isn't viable. If you offer the filename as the last argument to `jq`, it will use the contents of the file as the input.

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