---
layout: 'base'
order: 1
title: Introduction
---

# Welcome

As a web developer I find that I'm constantly using JSON files either ones that I've generated from my own software, or from APIs from services I use.

Most of the time I want to peek inside that JSON, look at a particular set of properties or more often, manipulate the JSON into a new structure to suit my requirements.

Previously to finding jq, I would do this in a number of inconsistent ways. Sometimes I'd write programs to slurp up my JSON and code a transform using JavaScript. Other times I might work inside the browser's developer console until I'd massaged the JSON into what I needed.

A lot of the time I _just_ wanted to look at a value on a particular path in the JSON.

There were also times when I'd have raw lines of data, perhaps from some logging, and I'd want to reformat it into JSON so that I could then perform a transformation or aggregation.

Each time I coded up a bespoke solution to digging out the data I wanted, it felt like I was doing a lot of repetitive work so that for what I felt should be a quick action.

Then along came jq to solve all (well…most!) of my problems.

# Introducing jq

For those familiar with the command line, `jq` is to JSON, what `sed` is to text.

If you're not familiar with the command line (or `sed` for that matter), `jq` is a utility for viewing, filtering and importantly, manipulating JSON.

`jq` comes with it's own language to process JSON which can make it incredibly flexible and powerful when it comes to data manipulation and data science.

These days I find that I'm constantly reaching for `jq` either to quickly pick out parts of a `package.json` file, or perhaps modify the output of an API without having to write too much code.

This series of posts is designed primarily for web developers with some familiarity with JavaScript, to learn how to manipulate JSON using `jq`.

First things first: let's get `jq` installed.
