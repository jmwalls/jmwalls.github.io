---
title: 'Setting up a site'
date: '2024-01-07'
---

For years, I've wanted to spend more time writing--to practice and to document.
With the new year and recent inspiration from the newly updated
[LitLab](https://litlab.stanford.edu/techne/new-litlab-website/) site, I'm
finally kicking off a personal site in attempt to do so.

I'm not a front-end developer, so this site is set up to be simple to build and
maintain. The static content here is generated with
[11ty](https://www.11ty.dev/) (as used with the LitLab site). 11ty has a low
learning curve, is easy to customize, and has a fairly large user community and
developer support. I found [this
tutorial](https://learneleventyfromscratch.com/) particularly helpful to get
rolling. 11ty also includes many plugins, for example, syntax highlighting (see
below). In the spirit of keeping it simple, styling is vanilla
[Bootstrap](https://getbootstrap.com/) CSS.

11ty is uses PrizmJS under the hood to provide styling for code blocks including
syntax highlighting.

```py
def fibonacci(n):
    """Recursively compute nth element of the Fibonacci sequence.

    @param n: (int) query element
    @returns (int) nth element
    """
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

You can view the site code on my [GitHub]().
