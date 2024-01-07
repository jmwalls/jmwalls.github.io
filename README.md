## Personal site

### Setup

* [11ty](https://www.11ty.dev/)
* [11ty sytax highlighting](https://www.11ty.dev/docs/plugins/syntaxhighlight/)
* [Bootstrap](https://getbootstrap.com/) Note that we're really just using CSS,
  but JS is also compiled to provide a responsive hamburger menu.

On push to main events, a GH action builds the site and pushes the output
artifacts to a branch `gh-pages`. The repo page settings must be configured to
deploy from this branch.

### Editing

To add a new post, simply create a new markdown file in the
[`posts`](src/posts/) directory with a header section including the title and
date.

### TODOs

* Add title bar icon
* Add a badge icon to the navbar
* Add next/previous links to posts
* Add footer--include github and RSS feed links
* Use cards to present posts?
* Add tags to posts?
