---
layout: 'base'
order: 2
title: Installation
---

# Installing jq

jq is typically installed via the command line, however there are some alternative methods to using jq which I'll come to shortly.

jq is also available for all platforms: Windows, Mac and Linux.

The latest release of jq can be downloaded directly from the Github [release pages](https://github.com/stedolan/jq/releases/).

jq is also available through a number of package managers, for instance installing using a Mac is a matter of using [brew](https://brew.sh) on the command line:

```
brew install jq
```

The jq documentation site also includes how to install from [other package manages](https://stedolan.github.io/jq/download/).

Though I'd recommend installing the command line regardless, you can also use non-command line based interfaces:

- [jqterm.com](https://jqterm.com) - a tool I've written, optimised for large data, with syntax highlighting, autocomplete and real-time live previews
- [jqplay.org](https://jqplay.org/) - "official" web playground, though a little slow as it submits the source content on each request

Finally, I've written a Mac app available that's an enhanced version of the jqTerm web site: [jqTerm.app](https://gum.co/jqterm) (under a _pay what you want_ schema).

![Mac App: jqTerm](/assets/img/jqterm-app.png)

The reason I wrote my own interfaces into jq is that it allows me to get real-time feedback on my queries, whereas the command line requires that I run and re-run queries until I get the solution.

Next steps:

- [How to run jq on the command line](/command-line), or
- [How to access and query JSON](/querying)
