---
layout: 'base'
order: 4
title: Map, Filter, Reduce
---

# Map, Filter, Reduce

These three functions are my got to methods in JavaScript for data manipulation. They all revolve around arrays, and in later chapters I'll show you object manipulation too.

The functions also increase in complexity, and I'd say exponentially (reduce being a bit tricky!). So let's dig in.

## Mapping

A map iterates over each element in its input, and returns a new array. I'd argue that the map function is a core building block of all data transformations.

In JavaScript, `map` functions are attached to arrays, and if the commit data were to be mapped to return just the email address, it would look like this:

```
const emails = commits.map(data => {
  return data.commit.author.email
})
```

The iterator is the `data => { return data.commit.author }` part. Since `jq` pipes data in and out of filters, the same filter in `jq` looks like this:

```
map(.commit.author.email)
```

Remember that the `.` is the identifier (which I called `data` in JavaScript). Since the source data is an array, `map` works without any preceding code, and returns an array of email strings.

I can also add filters _inside_ of my map function (and any function for that matter). To transform to an array of objects with the email address, I would use the following:

```
map(.commit.author | { email })
```

This code will map over the array, for each element get the `.commit.author` object, and pass that object into another filter that returns an object with the email property. The result is an array of email objects.

## Filters

An array filter iterates over a collection, and if the precondition is met, then the current element is included in the result.

There is no "native" filter method in `jq` directly akin to JavaScript, but it is fairly straight forward to replicate. Remember that nearly everything in `jq` is a filter!

To create an array filter, I will compose two functions. The first is `map`. The second is `select`. The `select` function returns the identifier if it's condition is true.

In a way, `select` is like guts of a JavaScript `filter` method.

To filter every commit that includes my email address, in JavaScript my code would look something like this:

```
const res = commits.filter(data => {
  return data.commit.author.email.includes("remy@remysharp.com")
})
```

Composing the `map` and `select` it looks very similar (I've broken it down into multiple lines for readability):

```
map(
  select(
    .commit.author.email | contains("remy@remysharp.com")
  )
)
```

The result is the top level commit object but filtered down to only those that match email address. I'd like to combine this further and return all the commit messages that I wrote:

```
cat commits.json | jq 'map(
  select(
    .commit.author.email | contains("remy@remysharp.com")
  )
) | map(.commit.message)'
[
  "fix: revert stdin handling\n\nFixes #1389\nFi…",
  "docs: faq typo fix (#1388)\n\n[skip ci]",
  "fix: send proper quit signal on ctrl-c (#1387…",
  "feat: support ctrl+l to clear\n\nA…"
]
```

**An import note:** the quotations I'm using _inside_ my `jq` query are double-quotes. Using single quotes will result in an error from `jq`. So as a rule of thumb, always use double-quotes.

## Reducing

A reduce in JavaScript is rather powerful, and typically my goto for most data manipulation. It's also fair to say that it's not immediately obvious how it works, and that goes doubly for the `jq` syntax.

The reduce function allows you to iterate over an array, but the result can be any type and not limited to an array (whereas `map` will always return an array).

There's a few parts to a reduce function:

- The source array that will be iterated
- The initial value used by the reducer
- The actual reducing function (that typically modifies the initial value)

The final output is the last value returned from reduce function.

_For example:_

To count the number of words in all the commit data written by me, Remy, in JavaScript my code would join a `filter` to a `map` and store the array of commit messages in `messages` variable. Then run that array through a reduce as so:

```
const count = messages.reduce((count, message) => {
  // count the spaces + 1
  count += message.match(/\s+/g).length + 1;

  // return the accumulated count
  return count;
}, 0); // 0 is the initial value first passed to `count`
```

For my `jq` code, for brevity, let's assume I already have the array of commit messages:

```
reduce .[] as $message (
  0; # initial value
  # now add to initial value:
  . += ($message | split(" ") | length) + 1
)
```

Note that this a far from perfect way to count words! The reduce syntax has a few gotchas that catch me out every time.

Firstly, the reduce function applies to the whole input, and doesn't automatically iterate over the results as `map` does.

Second is the syntax:

```
reduce <capture-some-vars> (<initial value of identifier>; <logic>)
```

In my earlier example, the initial value is `0` which is the identifier `.` in the logic part of the reducer. Also, the result from the logic is then assigned to the identifier and eventually this is the returned value.

So importantly: `.` does not refer to the current iterated element. Which is also why I capture the identifier using `as $message`.

---

So that's map, filter and reduce. I've found from experience I need `map` and `select` a lot, and only on the few occasions do I need `reduce` (and sometimes I can get a reduced result, without a reducer).

Next we'll look at slicing and dicing data.
