# How to contribute

I'm really glad you're reading this, because this project is fully open source and free to use, we will be more efficient together

Feel free to contact me if you hava a question about the process of the contribution : kdanezis at prot*n .me

## Submitting new idea

Please create a [new issue](https://github.com/besstiolle/Timeline/issues/new) with the label `enhancement` and with a full description about your idea. We'll take time to discusse about the technical solution.

After been approved by enough people, we'll add this idea on our public [RoadMap](./README.md)

## Installing

See the installing tuto on the [README](./README.md) section

My current setup is 
 * Win 
 * VScode 1.71.1
 * NVM 1.1.9
 * Node 16.17.0

But other Node's versions are tested to ensure a large compatibility

## Testing

We have a handful of tests which are located in /src/\__test\__ directory. They are made with [jest](https://jestjs.io/fr/). Please take time to run all the tests before pushing your code.

[Learn more about the commandes](./README.md)

## Submitting changes

Please send a [GitHub Pull Request to Timeline](https://github.com/besstiolle/Timeline/pull/new/main) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)). When you send a pull request please ensure you that the test coverage are still ok (don't degrade them). Please follow our coding conventions (below) and make sure all of your commits are atomic (one feature per commit).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    $ git commit -m "A brief summary of the commit
    > 
    > A paragraph describing what changed and its impact."

## Contributions and version update

Add yourself at the bottom of the [contributions section of the README.md](README.md#contributions) file:

```text
## Contributions

* [Kevin Danezis](https://github.com/besstiolle)
* ...
* [Your Full Name](https://github.com/yourgithubname)
```


## Coding conventions

Start reading our code and you'll get the hang of it. We optimize for readability:

  * We indent using four space characters
  * We ALWAYS put spaces after list items and method parameters (`[1, 2, 3]`, not `[1,2,3]`), around operators (`x += 1`, not `x+=1`), and around hash arrows.
  * This is open source software. Consider the people who will read your code, and make it look nice for them. It's sort of like driving a car: Perhaps you love doing donuts when you're alone, but with passengers the goal is to make the ride as smooth as possible.

Thanks,
Kevin Danezis.

(this file CONTRIBUTING.md is based on [this one](https://github.com/lucsorel/py2puml/blob/main/CONTRIBUTING.md) and [this one](https://github.com/lucsorel/py2puml/blob/main/CONTRIBUTING.md))