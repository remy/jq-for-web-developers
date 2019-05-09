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

<script type="json" id="commits">
[
  {
    "sha": "d088cb6e66855bbed04511c15fa12de0f8829237",
    "node_id": "MDY6Q29tbWl0OTU4MzE0OmQwODhjYjZlNjY4NTViYmVkMDQ1MTFjMTVmYTEyZGUwZjg4MjkyMzc=",
    "commit": {
      "author": {
        "name": "Remy Sharp",
        "email": "remy@remysharp.com",
        "date": "2019-05-08T10:12:13Z"
      },
      "committer": {
        "name": "GitHub",
        "email": "noreply@github.com",
        "date": "2019-05-08T10:12:13Z"
      },
      "message": "chore: update stalebot\n\n[skip ci]",
      "tree": {
        "sha": "d6afe2afea488290fbad21a92bed2dd56b5e8e90",
        "url": "https://api.github.com/repos/remy/nodemon/git/trees/d6afe2afea488290fbad21a92bed2dd56b5e8e90"
      },
      "url": "https://api.github.com/repos/remy/nodemon/git/commits/d088cb6e66855bbed04511c15fa12de0f8829237",
      "comment_count": 0,
      "verification": {
        "verified": true,
        "reason": "valid",
        "signature": "-----BEGIN PGP SIGNATURE-----\n\nwsBcBAABCAAQBQJc0qt9CRBK7hj4Ov3rIwAAdHIIABbHEv62Kukshw9kcW1SVY2L\nRa2r1Sxy3xV6lPXneNXRyv1yxoTyRSEc5v6I69RhP+mjAV7f1mJRAOJ9tvFltku9\nXG7qbqMUsAszNQdCPIfKvvzQexp0iAnFTO4OzQn7chfyB3UzTAkEZfpHTtMg/Io4\nANPws8VaF7hvxyEdIVdww2iZj7fr3okq57dIF19ZplI5/H6BXuqyV2/r9J+UD7T3\nadbrQJsnKKDdNZno+J+bAO0oKzc9eq9pxwxHezwbHqxddXEYLnsA/Zbz9Y8Ba9Fk\nOUKoi9lNbqnk/aNBMQqQanbfuywMn/xaq4lg9bRdruxm4jXYsZZK4beAynvIU5I=\n=O7X8\n-----END PGP SIGNATURE-----\n",
        "payload": "tree d6afe2afea488290fbad21a92bed2dd56b5e8e90\nparent 20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb\nauthor Remy Sharp <remy@remysharp.com> 1557310333 +0100\ncommitter GitHub <noreply@github.com> 1557310333 +0100\n\nchore: update stalebot\n\n[skip ci]"
      }
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/d088cb6e66855bbed04511c15fa12de0f8829237",
    "html_url": "https://github.com/remy/nodemon/commit/d088cb6e66855bbed04511c15fa12de0f8829237",
    "comments_url": "https://api.github.com/repos/remy/nodemon/commits/d088cb6e66855bbed04511c15fa12de0f8829237/comments",
    "author": {
      "login": "remy",
      "id": 13700,
      "node_id": "MDQ6VXNlcjEzNzAw",
      "avatar_url": "https://avatars0.githubusercontent.com/u/13700?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/remy",
      "html_url": "https://github.com/remy",
      "followers_url": "https://api.github.com/users/remy/followers",
      "following_url": "https://api.github.com/users/remy/following{/other_user}",
      "gists_url": "https://api.github.com/users/remy/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/remy/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/remy/subscriptions",
      "organizations_url": "https://api.github.com/users/remy/orgs",
      "repos_url": "https://api.github.com/users/remy/repos",
      "events_url": "https://api.github.com/users/remy/events{/privacy}",
      "received_events_url": "https://api.github.com/users/remy/received_events",
      "type": "User",
      "site_admin": false
    },
    "committer": {
      "login": "web-flow",
      "id": 19864447,
      "node_id": "MDQ6VXNlcjE5ODY0NDQ3",
      "avatar_url": "https://avatars3.githubusercontent.com/u/19864447?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/web-flow",
      "html_url": "https://github.com/web-flow",
      "followers_url": "https://api.github.com/users/web-flow/followers",
      "following_url": "https://api.github.com/users/web-flow/following{/other_user}",
      "gists_url": "https://api.github.com/users/web-flow/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/web-flow/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/web-flow/subscriptions",
      "organizations_url": "https://api.github.com/users/web-flow/orgs",
      "repos_url": "https://api.github.com/users/web-flow/repos",
      "events_url": "https://api.github.com/users/web-flow/events{/privacy}",
      "received_events_url": "https://api.github.com/users/web-flow/received_events",
      "type": "User",
      "site_admin": false
    },
    "parents": [
      {
        "sha": "20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb",
        "url": "https://api.github.com/repos/remy/nodemon/commits/20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb",
        "html_url": "https://github.com/remy/nodemon/commit/20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb"
      }
    ]
  },
  {
    "sha": "20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb",
    "node_id": "MDY6Q29tbWl0OTU4MzE0OjIwY2NiNjIzYzRkYmRiYzk0NDUwODViYTcyY2E3YWI5MGY1YmZmY2I=",
    "commit": {
      "author": {
        "name": "Emily Marigold Klassen",
        "email": "forivall@gmail.com",
        "date": "2019-04-23T19:49:54Z"
      },
      "committer": {
        "name": "Remy Sharp",
        "email": "remy@remysharp.com",
        "date": "2019-05-01T07:05:47Z"
      },
      "message": "feat: add message event\n\nadd event to listen to messages coming from the child's ipc events, partially implementing #1519",
      "tree": {
        "sha": "19cd06833ac60746f558e4220b4cbaacbc7febc9",
        "url": "https://api.github.com/repos/remy/nodemon/git/trees/19cd06833ac60746f558e4220b4cbaacbc7febc9"
      },
      "url": "https://api.github.com/repos/remy/nodemon/git/commits/20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb",
      "comment_count": 0,
      "verification": {
        "verified": false,
        "reason": "unsigned",
        "signature": null,
        "payload": null
      }
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb",
    "html_url": "https://github.com/remy/nodemon/commit/20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb",
    "comments_url": "https://api.github.com/repos/remy/nodemon/commits/20ccb623c4dbdbc9445085ba72ca7ab90f5bffcb/comments",
    "author": {
      "login": "forivall",
      "id": 760204,
      "node_id": "MDQ6VXNlcjc2MDIwNA==",
      "avatar_url": "https://avatars1.githubusercontent.com/u/760204?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/forivall",
      "html_url": "https://github.com/forivall",
      "followers_url": "https://api.github.com/users/forivall/followers",
      "following_url": "https://api.github.com/users/forivall/following{/other_user}",
      "gists_url": "https://api.github.com/users/forivall/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/forivall/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/forivall/subscriptions",
      "organizations_url": "https://api.github.com/users/forivall/orgs",
      "repos_url": "https://api.github.com/users/forivall/repos",
      "events_url": "https://api.github.com/users/forivall/events{/privacy}",
      "received_events_url": "https://api.github.com/users/forivall/received_events",
      "type": "User",
      "site_admin": false
    },
    "committer": {
      "login": "remy",
      "id": 13700,
      "node_id": "MDQ6VXNlcjEzNzAw",
      "avatar_url": "https://avatars0.githubusercontent.com/u/13700?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/remy",
      "html_url": "https://github.com/remy",
      "followers_url": "https://api.github.com/users/remy/followers",
      "following_url": "https://api.github.com/users/remy/following{/other_user}",
      "gists_url": "https://api.github.com/users/remy/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/remy/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/remy/subscriptions",
      "organizations_url": "https://api.github.com/users/remy/orgs",
      "repos_url": "https://api.github.com/users/remy/repos",
      "events_url": "https://api.github.com/users/remy/events{/privacy}",
      "received_events_url": "https://api.github.com/users/remy/received_events",
      "type": "User",
      "site_admin": false
    },
    "parents": [
      {
        "sha": "886527f1f0a9249e1a044fd652b7519d1c0dc50e",
        "url": "https://api.github.com/repos/remy/nodemon/commits/886527f1f0a9249e1a044fd652b7519d1c0dc50e",
        "html_url": "https://github.com/remy/nodemon/commit/886527f1f0a9249e1a044fd652b7519d1c0dc50e"
      }
    ]
  },
  {
    "sha": "886527f1f0a9249e1a044fd652b7519d1c0dc50e",
    "node_id": "MDY6Q29tbWl0OTU4MzE0Ojg4NjUyN2YxZjBhOTI0OWUxYTA0NGZkNjUyYjc1MTlkMWMwZGM1MGU=",
    "commit": {
      "author": {
        "name": "Emily Marigold Klassen",
        "email": "forivall@gmail.com",
        "date": "2019-04-23T19:38:28Z"
      },
      "committer": {
        "name": "Remy Sharp",
        "email": "remy@remysharp.com",
        "date": "2019-05-01T07:05:18Z"
      },
      "message": "fix: disable fork only if string starts with dash\n\nfixes #1554",
      "tree": {
        "sha": "5462f83be59aff01cb0783fa24a8061f0c1f8b84",
        "url": "https://api.github.com/repos/remy/nodemon/git/trees/5462f83be59aff01cb0783fa24a8061f0c1f8b84"
      },
      "url": "https://api.github.com/repos/remy/nodemon/git/commits/886527f1f0a9249e1a044fd652b7519d1c0dc50e",
      "comment_count": 0,
      "verification": {
        "verified": false,
        "reason": "unsigned",
        "signature": null,
        "payload": null
      }
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/886527f1f0a9249e1a044fd652b7519d1c0dc50e",
    "html_url": "https://github.com/remy/nodemon/commit/886527f1f0a9249e1a044fd652b7519d1c0dc50e",
    "comments_url": "https://api.github.com/repos/remy/nodemon/commits/886527f1f0a9249e1a044fd652b7519d1c0dc50e/comments",
    "author": {
      "login": "forivall",
      "id": 760204,
      "node_id": "MDQ6VXNlcjc2MDIwNA==",
      "avatar_url": "https://avatars1.githubusercontent.com/u/760204?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/forivall",
      "html_url": "https://github.com/forivall",
      "followers_url": "https://api.github.com/users/forivall/followers",
      "following_url": "https://api.github.com/users/forivall/following{/other_user}",
      "gists_url": "https://api.github.com/users/forivall/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/forivall/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/forivall/subscriptions",
      "organizations_url": "https://api.github.com/users/forivall/orgs",
      "repos_url": "https://api.github.com/users/forivall/repos",
      "events_url": "https://api.github.com/users/forivall/events{/privacy}",
      "received_events_url": "https://api.github.com/users/forivall/received_events",
      "type": "User",
      "site_admin": false
    },
    "committer": {
      "login": "remy",
      "id": 13700,
      "node_id": "MDQ6VXNlcjEzNzAw",
      "avatar_url": "https://avatars0.githubusercontent.com/u/13700?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/remy",
      "html_url": "https://github.com/remy",
      "followers_url": "https://api.github.com/users/remy/followers",
      "following_url": "https://api.github.com/users/remy/following{/other_user}",
      "gists_url": "https://api.github.com/users/remy/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/remy/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/remy/subscriptions",
      "organizations_url": "https://api.github.com/users/remy/orgs",
      "repos_url": "https://api.github.com/users/remy/repos",
      "events_url": "https://api.github.com/users/remy/events{/privacy}",
      "received_events_url": "https://api.github.com/users/remy/received_events",
      "type": "User",
      "site_admin": false
    },
    "parents": [
      {
        "sha": "64b474e9f3c24cd4c1f360a73da3d675559b3b3e",
        "url": "https://api.github.com/repos/remy/nodemon/commits/64b474e9f3c24cd4c1f360a73da3d675559b3b3e",
        "html_url": "https://github.com/remy/nodemon/commit/64b474e9f3c24cd4c1f360a73da3d675559b3b3e"
      }
    ]
  },
  {
    "sha": "64b474e9f3c24cd4c1f360a73da3d675559b3b3e",
    "node_id": "MDY6Q29tbWl0OTU4MzE0OjY0YjQ3NGU5ZjNjMjRjZDRjMWYzNjBhNzNkYTNkNjc1NTU5YjNiM2U=",
    "commit": {
      "author": {
        "name": "Leonardo Dino",
        "email": "leonardodino@users.noreply.github.com",
        "date": "2019-05-01T07:04:44Z"
      },
      "committer": {
        "name": "Remy Sharp",
        "email": "remy@remysharp.com",
        "date": "2019-05-01T07:04:44Z"
      },
      "message": "feat: add TypeScript to default execPath (#1552)\n\n`ts-node` is the standard for running typescript node programs on development mode.\r\n\r\nAdding this line will enable everyone with a `tsconfig.json` to have a full-refresh server watching experience. (:",
      "tree": {
        "sha": "37643473f3f13648cf5a6d17721cbd047521bc34",
        "url": "https://api.github.com/repos/remy/nodemon/git/trees/37643473f3f13648cf5a6d17721cbd047521bc34"
      },
      "url": "https://api.github.com/repos/remy/nodemon/git/commits/64b474e9f3c24cd4c1f360a73da3d675559b3b3e",
      "comment_count": 0,
      "verification": {
        "verified": false,
        "reason": "unsigned",
        "signature": null,
        "payload": null
      }
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/64b474e9f3c24cd4c1f360a73da3d675559b3b3e",
    "html_url": "https://github.com/remy/nodemon/commit/64b474e9f3c24cd4c1f360a73da3d675559b3b3e",
    "comments_url": "https://api.github.com/repos/remy/nodemon/commits/64b474e9f3c24cd4c1f360a73da3d675559b3b3e/comments",
    "author": {
      "login": "leonardodino",
      "id": 8649362,
      "node_id": "MDQ6VXNlcjg2NDkzNjI=",
      "avatar_url": "https://avatars2.githubusercontent.com/u/8649362?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/leonardodino",
      "html_url": "https://github.com/leonardodino",
      "followers_url": "https://api.github.com/users/leonardodino/followers",
      "following_url": "https://api.github.com/users/leonardodino/following{/other_user}",
      "gists_url": "https://api.github.com/users/leonardodino/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/leonardodino/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/leonardodino/subscriptions",
      "organizations_url": "https://api.github.com/users/leonardodino/orgs",
      "repos_url": "https://api.github.com/users/leonardodino/repos",
      "events_url": "https://api.github.com/users/leonardodino/events{/privacy}",
      "received_events_url": "https://api.github.com/users/leonardodino/received_events",
      "type": "User",
      "site_admin": false
    },
    "committer": {
      "login": "remy",
      "id": 13700,
      "node_id": "MDQ6VXNlcjEzNzAw",
      "avatar_url": "https://avatars0.githubusercontent.com/u/13700?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/remy",
      "html_url": "https://github.com/remy",
      "followers_url": "https://api.github.com/users/remy/followers",
      "following_url": "https://api.github.com/users/remy/following{/other_user}",
      "gists_url": "https://api.github.com/users/remy/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/remy/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/remy/subscriptions",
      "organizations_url": "https://api.github.com/users/remy/orgs",
      "repos_url": "https://api.github.com/users/remy/repos",
      "events_url": "https://api.github.com/users/remy/events{/privacy}",
      "received_events_url": "https://api.github.com/users/remy/received_events",
      "type": "User",
      "site_admin": false
    },
    "parents": [
      {
        "sha": "2973afbd26e2c9a9f9676fed8ab63999022ea7ca",
        "url": "https://api.github.com/repos/remy/nodemon/commits/2973afbd26e2c9a9f9676fed8ab63999022ea7ca",
        "html_url": "https://github.com/remy/nodemon/commit/2973afbd26e2c9a9f9676fed8ab63999022ea7ca"
      }
    ]
  },
  {
    "sha": "2973afbd26e2c9a9f9676fed8ab63999022ea7ca",
    "node_id": "MDY6Q29tbWl0OTU4MzE0OjI5NzNhZmJkMjZlMmM5YTlmOTY3NmZlZDhhYjYzOTk5MDIyZWE3Y2E=",
    "commit": {
      "author": {
        "name": "Emily Marigold Klassen",
        "email": "forivall@gmail.com",
        "date": "2019-05-01T07:04:25Z"
      },
      "committer": {
        "name": "Remy Sharp",
        "email": "remy@remysharp.com",
        "date": "2019-05-01T07:04:25Z"
      },
      "message": "fix: Quote zero-length strings in arguments (#1551)\n\nIf a zero-length string is passed, it does not get properly quoted, and then it is not properly passed to the child process",
      "tree": {
        "sha": "e2eac19bcfadbc07a3969b837264210f06d90b53",
        "url": "https://api.github.com/repos/remy/nodemon/git/trees/e2eac19bcfadbc07a3969b837264210f06d90b53"
      },
      "url": "https://api.github.com/repos/remy/nodemon/git/commits/2973afbd26e2c9a9f9676fed8ab63999022ea7ca",
      "comment_count": 0,
      "verification": {
        "verified": false,
        "reason": "unsigned",
        "signature": null,
        "payload": null
      }
    },
    "url": "https://api.github.com/repos/remy/nodemon/commits/2973afbd26e2c9a9f9676fed8ab63999022ea7ca",
    "html_url": "https://github.com/remy/nodemon/commit/2973afbd26e2c9a9f9676fed8ab63999022ea7ca",
    "comments_url": "https://api.github.com/repos/remy/nodemon/commits/2973afbd26e2c9a9f9676fed8ab63999022ea7ca/comments",
    "author": {
      "login": "forivall",
      "id": 760204,
      "node_id": "MDQ6VXNlcjc2MDIwNA==",
      "avatar_url": "https://avatars1.githubusercontent.com/u/760204?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/forivall",
      "html_url": "https://github.com/forivall",
      "followers_url": "https://api.github.com/users/forivall/followers",
      "following_url": "https://api.github.com/users/forivall/following{/other_user}",
      "gists_url": "https://api.github.com/users/forivall/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/forivall/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/forivall/subscriptions",
      "organizations_url": "https://api.github.com/users/forivall/orgs",
      "repos_url": "https://api.github.com/users/forivall/repos",
      "events_url": "https://api.github.com/users/forivall/events{/privacy}",
      "received_events_url": "https://api.github.com/users/forivall/received_events",
      "type": "User",
      "site_admin": false
    },
    "committer": {
      "login": "remy",
      "id": 13700,
      "node_id": "MDQ6VXNlcjEzNzAw",
      "avatar_url": "https://avatars0.githubusercontent.com/u/13700?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/remy",
      "html_url": "https://github.com/remy",
      "followers_url": "https://api.github.com/users/remy/followers",
      "following_url": "https://api.github.com/users/remy/following{/other_user}",
      "gists_url": "https://api.github.com/users/remy/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/remy/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/remy/subscriptions",
      "organizations_url": "https://api.github.com/users/remy/orgs",
      "repos_url": "https://api.github.com/users/remy/repos",
      "events_url": "https://api.github.com/users/remy/events{/privacy}",
      "received_events_url": "https://api.github.com/users/remy/received_events",
      "type": "User",
      "site_admin": false
    },
    "parents": [
      {
        "sha": "aa41ab2124679306000351bef3e9a4366636f72a",
        "url": "https://api.github.com/repos/remy/nodemon/commits/aa41ab2124679306000351bef3e9a4366636f72a",
        "html_url": "https://github.com/remy/nodemon/commit/aa41ab2124679306000351bef3e9a4366636f72a"
      }
    ]
  }
]
</script>
