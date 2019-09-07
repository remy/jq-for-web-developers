---
layout: 'base'
order: 7
title: Processing CSV & Plain text
---

# Processing CSV & Plain text

As `jq` is a first and foremost a command line tool, if makes sense that converting from one text format to JSON should typically be done using the best tool for the job. For instance, converting CSV is JSON might be done using the csvkit's [csvjson](https://csvkit.readthedocs.io/en/latest/scripts/csvjson.html) tool.

However, you may find yourself in the [web UI](https://jqterm.com) or feeling fickle and decide to convert the text jq itself.

For that, first the source text needs to be slurped up and broken into lines.

## Slurp mode

<script type="text" id="csv">

</script>
