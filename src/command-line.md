---
layout: 'base'
order: 3
title: Command line usage
---

# Command line usage

Personally I tend to use jq on the command line for short and quick queries. For more complex queries (usually requiring more thought), I'll turn to [jqTerm]. Then in some cases, my query will be run on the command line (perhaps part of a larger workflow).

Using the command line there's a couple of options to feed into the `jq` command, as well as options to handle how the output is represented.

If the command line isn't your thing, I have [an online course](https://terminal.training) (use "jq" for a 50% discount) and move on to [querying](/querying) as you can still achieve a lot in the apps I've written.

## Sending JSON to jq

The `jq` command can consume JSON in a number of ways, but the most common is to _pipe_ JSON into the command. This is also my preferred method.

On the command line, this is done using a literal pipe character `|`. So I will use the `cat` command to send the contents of my JSON file and then connect it to `jq` using the `|`:

![Screenshot of jq being piped](/assets/img/command-line-pipe.png)

By default, if `jq` receives JSON in this manner (via `stdin`), then jq will automatically echo out the nicely formatted JSON and if your terminal supports it, the output will be colourised too.

## Alternatively: filename as an argument

Like many commands in the terminal you can pass the filename to the `jq` command.

In the example below, my file is called `package.json` and my query is simply `.` (I'll explain what this means in the next chapter):

```
jq . package.json
{
  "name": "jqTerm",
  "version": "1.6.3",
  "description": "A jq service",
  "main": "app",
  "scripts": {
    "start": "node server.js",
  }
}
```

I'm personally not keen on this way of calling `jq`. The reason is that I **have** to provide a query when using a filename. If I forget to pass in the query, calling `jq` with a JSON file throws slightly odd errors:

```
jq package.json
jq: error: package/0 is not defined at <top-level>, line 1:
package.json
jq: 1 compile error
```

## How I run jq

For small queries, like looking at the `scripts` property inside a `package.json` file, I'll use the command line tool.

If I need to build up a more complex query, or work with a JSON structure that I'm not familiar with (i.e. if it comes from an API), I'll use the jqTerm app - usually the desktop version as there's a very very low latency between writing a query and seeing the result.

Next I'll show you how to navigate JSON and move on to manipulating results.

[jqTerm]: https://jqterm.com/app
