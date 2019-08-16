---
layout: 'base'
order: 5
title: Map, Filter, Reduce
---

# Map, Filter, Reduce

These three functions are my got to methods in JavaScript for data manipulation. They all revolve around arrays, and in later chapters I'll show you object manipulation too.

The functions also increase in complexity, and I'd say exponentially (reduce being a bit tricky!). So let's dig in.

## Mapping

A map iterates over each element in its input, and returns a new array. I'd argue that the map function is a core building block of all data transformations.

In JavaScript, `map` functions are attached to arrays, and if the commit data were to be mapped to return just the email address, it would look like this:

```js
const emails = commits.map(data => {
  return data.commit.author.email
})
```

The iterator is the `data => { return data.commit.author }` part. Since `jq` pipes data in and out of filters, the same filter in `jq` looks like this:

```jq{data-source="#commits"}
map(.commit.author.email)
```

Remember that the `.` is the identifier (which I called `data` in JavaScript). Since the source data is an array, `map` works without any preceding code, and returns an array of email strings.

I can also add filters _inside_ of my map function (and any function for that matter). To transform to an array of objects with the email address, I would use the following:

```jq{data-source="#commits"}
map(.commit.author | { email })
```

This code will map over the array, for each element get the `.commit.author` object, and pass that object into another filter that returns an object with the email property. The result is an array of email objects.

## Filters

An array filter iterates over a collection, and if the precondition is met, then the current element is included in the result.

There is no "native" filter method in `jq` directly akin to JavaScript, but it is fairly straight forward to replicate. Remember that nearly everything in `jq` is a filter!

To create an array filter, I will compose two functions. The first is `map`. The second is `select`. The `select` function returns the identifier if it's condition is true.

In a way, `select` is like guts of a JavaScript `filter` method.

To filter every commit that includes my email address, in JavaScript my code would look something like this:

```js
const res = commits.filter(data => {
  return data.commit.author.email.includes("remy@remysharp.com")
})
```

Composing the `map` and `select` it looks very similar (I've broken it down into multiple lines for readability):

```jq{data-source="#commits"}
map(
  select(
    .commit.author.email | contains("remy@remysharp.com")
  )
)
```

The result is the top level commit object but filtered down to only those that match email address. I'd like to combine this further and return all the commit messages that I wrote:

```jq{data-source="#commits"}
map(
  select(
    .commit.author.email | contains("remy@remysharp.com")
  )
) | map(.commit.message)
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

```jq
const count = commits.map(_ => _.messages).reduce((count, message) => {
  // count the spaces + 1
  count += message.match(/\s+/g).length + 1;

  // return the accumulated count
  return count;
}, 0); // 0 is the initial value first passed to `count`
```

For my `jq` code, I need to reduce on the messages, so using the selector `.[].commits.messages` I can use the following expression:

```jq{data-source="#commits"}
reduce .[].commit.message as $message (
  0; # initial value
  # now add to initial value:
  . += ($message | split(" ") | length) + 1
)
```

Note that this a far from perfect way to count words! The reduce syntax has a few gotchas that catch me out every time.

Firstly, the reduce function applies to the whole input, and doesn't automatically iterate over the results as `map` does.

Second is the syntax:

```jq
reduce <capture-some-vars> (<initial value of identifier>; <logic>)
```

In my earlier example, the initial value is `0` which is the identifier `.` in the logic part of the reducer. Also, the result from the logic is then assigned to the identifier and eventually this is the returned value.

So importantly: `.` does not refer to the current iterated element. Which is also why I capture the identifier using `as $message`.

---

So that's map, filter and reduce. I've found from experience I need `map` and `select` a lot, and only on the few occasions do I need `reduce` (and sometimes I can get a reduced result, without a reducer).

## Next steps

- [slicing and dicing data](/slicing)

<script type="json" id="commits">
[
  {
    "sha": "d088cb6e66855bbed04511c15fa12de0f8829237",
    "commit": {
      "author": {
        "name": "Remy Sharp",
        "email": "remy@remysharp.com",
        "date": "2019-05-08T10:12:13Z"
      },
      "message": "chore: update stalebot\n\n[skip ci]"
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/d088cb6e66855bbed04511c15fa12de0f8829237",
    "author": {
      "login": "remy",
      "id": 13700
    },
    "committer": {
      "login": "web-flow",
      "id": 19864447
    }
  },
  {
    "sha": "20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb",
    "commit": {
      "author": {
        "name": "Emily Marigold Klassen",
        "email": "forivall@gmail.com",
        "date": "2019-04-23T19:49:54Z"
      },
      "message": "feat: add message event\n\nadd event to listen to messages coming from the child's ipc events, partially implementing #1519"
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb",
    "author": {
      "login": "forivall",
      "id": 760204
    },
    "committer": {
      "login": "remy",
      "id": 13700
    }
  },
  {
    "sha": "886527f1f0a9249e1a044fd652b7519d1c0dc50e",
    "commit": {
      "author": {
        "name": "Emily Marigold Klassen",
        "email": "forivall@gmail.com",
        "date": "2019-04-23T19:38:28Z"
      },
      "message": "fix: disable fork only if string starts with dash\n\nfixes #1554"
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/886527f1f0a9249e1a044fd652b7519d1c0dc50e",
    "author": {
      "login": "forivall",
      "id": 760204
    },
    "committer": {
      "login": "remy",
      "id": 13700
    }
  },
  {
    "sha": "d088cb6e66855bbed04511c15aa12de0f8829237",
    "commit": {
      "author": {
        "name": "Remy Sharp",
        "email": "remy@remysharp.com",
        "date": "2019-05-08T13:12:13Z"
      },
      "message": "fix: added more things\n\nfixes lack of things"
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/d088cb6e66855bbed04511c15aa12de0f8829237",
    "author": {
      "login": "remy",
      "id": 13700
    }
  },
  {
    "sha": "64b474e9f3c24cd4c1f360a73da3d675559b3b3e",
    "commit": {
      "author": {
        "name": "Leonardo Dino",
        "email": "leonardodino@users.noreply.github.com",
        "date": "2019-05-01T07:04:44Z"
      },
      "message": "feat: add TypeScript to default execPath (#1552)\n\n`ts-node` is the standard for running typescript node programs on development mode.\r\n\r\nAdding this line will enable everyone with a `tsconfig.json` to have a full-refresh server watching experience. (:"
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/64b474e9f3c24cd4c1f360a73da3d675559b3b3e",
    "author": {
      "login": "leonardodino",
      "id": 8649362
    },
    "committer": {
      "login": "remy",
      "id": 13700
    }
  },
  {
    "sha": "2973afbd26e2c9a9f9676fed8ab63999022ea7ca",
    "commit": {
      "author": {
        "name": "Emily Marigold Klassen",
        "email": "forivall@gmail.com",
        "date": "2019-05-01T07:04:25Z"
      },
      "message": "fix: Quote zero-length strings in arguments (#1551)\n\nIf a zero-length string is passed, it does not get properly quoted, and then it is not properly passed to the child process"
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/2973afbd26e2c9a9f9676fed8ab63999022ea7ca",
    "author": {
      "login": "forivall",
      "id": 760204
    },
    "committer": {
      "login": "remy",
      "id": 13700
    }
  }
]
</script>
