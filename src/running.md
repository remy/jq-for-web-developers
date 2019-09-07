---
layout: 'base'
order: 2
title: Running jq
---

# Running jq

There's a number of options to you to run the jq command. I'd say local installation is a must (so that if all else fails), and thereafter I'd recommend using an interface with live feedback to help speed up the process of learning and tweaking your commands.

You should also note that this book includes live jq examples that you can run and modify in the browser when you see the "run code" (as below) and modifying the jq statement you can run the query using the keyboard with <kbd>shift</kbd> + <kbd>enter</kbd> - you can try it out below:

```jq{data-source="#data"}
.a + .b
```

## Installing jq locally

jq is typically installed via the command line, however there are some alternative methods to using jq which I'll come to shortly.

Importantly, the software is available for all platforms: Windows, Mac and Linux.

The latest release of jq can be **[downloaded directly](https://github.com/stedolan/jq/releases/)** from the Github repository.

jq is also available through a number of package managers, for instance installing using a Mac is a matter of using [brew](https://brew.sh) on the command line:

```bash
brew install jq
```

The jq documentation site includes how to install from [other package manages](https://stedolan.github.io/jq/download/).

## Nicer jq interfaces

Though I'd recommend installing the command line regardless, you can also use non-command line based interfaces. I've written one that I use on a weekly basis and has been tuned for offline and performance which is why I recommend it ;-)

- [jqterm.com](https://jqterm.com) - a tool I've written, optimised for large data, with syntax highlighting, autocomplete and real-time live previews
- [jqplay.org](https://jqplay.org/) - "official" web playground, though a little slow as it submits the source content on each request

Finally, I've written a Mac app available that's an enhanced version of the jqTerm web site: [jqTerm.app](https://gum.co/jqterm) (under a _pay what you want_ schema).

![Mac App: jqTerm](/assets/img/jqterm-app.jpg)

The reason I wrote my own interfaces into jq is that it allows me to get real-time feedback on my queries, whereas the command line requires that I run and re-run queries until I get the solution.

## Next steps

- [How to run jq on the command line](/command-line), or
- [How to access and query JSON](/querying)

<script id="data" type="application/json">
{"a": [1,2], "b": [3,4]}
</script>
