---
layout: 'base'
order: 4
title: Querying data
---

# Querying data

Now that JSON is being fed into `jq`, you were briefly introduced to the query containing only `.`.

This is called the **identity filter** `.` and it will take the input and pass it as output.

I think of the identity operator as akin to `this` in JavaScript. The _current context_.

So that I can work with a nice chunky bit of JSON, I've captured JSON from Github's API, and have [downloaded all the recent commits](https://api.github.com/repos/remy/nodemon/commits) for one of my projects and saved it in commits.json.

Assuming I know the path to the data I'm interested in (sometimes I do, sometimes I don't and we'll look at that later in the chapters), using this path I can extract the data I'm interested in.

The commit data from Github is returned with the most recent commits first. So to get the latest commit author, in JavaScript I use the following code:

```js
commits[0].commit.author
```

In JavaScript I've assigned the commits to a variable called `commits`. This is also the root of the data. So using jq, this is referred to the as the **identify filter**.

To view the latest commit author using jq, I use this command:

```jq{data-source="#commits"}
.[0].commit.author
```

Notice that the result is returned as JSON too. I might want to copy this or store it in a file. There are also times when I might also want to convert from JSON to a raw output (such as strings) - which I'll show you later when we'll look at the `jq` options.

Finding the latest commit was straight forward enough, but what if we want to iterate over _every_ commit?

## The [] iterator

Accessing the commit data used square packets already (I used `[0]`), but I can also iterate over arrays (and objects) using `.[]`.

The result of using `.[]` is "return all the elements of the current identity". You can also think of this as _unrolling_ the array into it's individual elements. For example:

```jq{data-source="#commits"}
.[]
```

Something to bear in mind is that this also means that the result is not valid JSON.

Although a non-JSON result may not be what I want at this point, it does allow me to iterate over arrays and objects and transform them by connecting filters together.

Using the `.[]` syntax, I can use the dot notation to access the commits authors. The result is a raw list of objects, but this result will be transformed later on.

```jq{data-source="#commits"}
.[].commit.author
```

Next I want to reshape the result, so that I limit the result to the name and email address, then finally I'll want the result in valid JSON.

## Connecting filters

To reshape the data, I need to use another filter (remember that `.` is a filter itself).

Filters can be connected using the pipe `|` operator. The result from left side is passed into the filter on the right of the pipe. Exactly like a pipe on the command line.

The query `.[].commit.author` will return a list of author objects. I want run each of these objects through a filter that will reshape the result.

I only want the `.email` and `.name`. Again, being familiar with JavaScript, I could pipe the result into a filter that looks like this:

```jq{data-source="#commits"}
.[].commit.author | { name: .name, email: .email }
```

Remember that the `.` is the identifier of _each_ iterated author object. The above code does indeed work, but I can make use of object shorthand, again similar to JavaScript (certainly JavaScript's ES6):

```jq{data-source="#commits"}
.[].commit.author | { name, email }
```

This will return a raw list of objects with only the name and email.

The final part is that I want the result to be a JSON array, so I'll _wrap the entire_ command in array syntax:

```jq{data-source="#commits"}
[ .[].commit.author | { name, email } ]
```

Now the result is correctly formatted as an array containing all the elements.

We'll see a lot more connecting filters in later chapters.

## Next steps

- [Map, filter, reduce](/mapping)

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
