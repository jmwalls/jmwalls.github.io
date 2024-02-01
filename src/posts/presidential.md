---
title: 'Text Embeddings and Presidential Addresses'
date: '2024-02-04'
head:
    - <script src="https://d3js.org/d3.v7.js"></script>
---

With the recent explosion of retrieval augmented generation
([RAG](https://aws.amazon.com/what-is/retrieval-augmented-generation/))
applications, vector databases have been the talk of the town. With 'documents'
represented as embedding vectors, vector databases enable efficient, low latency
document retrieval used to modify user prompts that are fed to large language
models. Let's look at representing some of our political leaders' formal
addresses as embedding vectors and see if, under the microscope of computation,
anything interesting sticks out.

The objective of this post is to have some fun scraping web data, playing around
with the OpenAI API, and gaining a little more experience with visualization
utilities ([d3](https://d3js.org/)). Code and data are available on
[Github](https://github.com/jmwalls/presidential). While I hope this (fairly
superficial) analysis is interesting, it is fairly superficial. There should
probably be a disclaimer about what's _not_ below. So let's start there.

<div class="container-sm text-center pb-3" style="max-width: 720px">
  <div class="row row-cols-1">
    <div class="col bg-warning">
      Disclaimer:
    </div>
    <div class="col bg-warning-subtle text-start">
      The analysis presented herein is purely for fun; any correlation,
      causation, or coincidence displayed below should be viewed with an
      appropriate level of skepticism.
    </div>
  </div>
</div>

## What are we looking at here?

Document or text embeddings are vector representations of sequences of
words--they are a means of representing a variable length array of words as a
fixed length set of numbers suitable for computational analyses. Depending on
the desired analysis, a _good_ embedding should adequately represent the salient
attributes of the text. Within this post, we'll look at three general purpose
document embeddings representing the old guard and OpenAI's
[latest](https://platform.openai.com/docs/models/embeddings) offerings.

* Term frequency-inverse document frequency
  ([`tf-idf`](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)): Tried and true.
  This 'hand engineered' approach essentially captures how often vocabulary
  words are present in a document weighted by how rare a particular vocabulary
  word is across the entire corpus.
* OpenAI `text-embedding-ada-002`: Released in 2022, the `ada-002` model is
  trained to summarize text for search, similarity, and classification tasks.
* OpenAI `text-embedding-3-small`: Latest and greatest, apparently.

Article II, Section 3 of the US Constitution stipulates that the president must
provide updates on the "State of the Union" from time to time... Lucky for us,
this means that since 1790, US presidents have supplied an annual State of the
Union ([SOTU](https://en.wikipedia.org/wiki/State_of_the_Union)) address.
Addresses were submitted as written reports from Thomas Jefferson (1801) through
Woodrow Wilson (1913) and otherwise orally presented directly to Congress. In
the age of information, we have ready
[access](https://en.wikisource.org/wiki/Portal:State_of_the_Union_Speeches_by_United_States_Presidents)
to these addresses.

We'll download all the addresses, compute the embeddings for each, and see how
they compare.

Note that embedding models typically include a limit on the number of input
tokens (related to the length of the document). The length of most SOTU
addresses exceeds this limit. So, we'll compute the embedding vector for an
address as the normalized weighted sum of the embeddings over all its
constituent paragraphs.

## What'd we find?

Some interesting stuff! (But, maybe not so surprising...)

#### Low-dimensional embedding space representation

You can think of any of the embedding types here as representing a point in a
1536-dimensional space. But, what does a 1536-dimensional space look like? We
can use dimensionality reduction techniques to view our embeddings in a lower
2-dimensional feature space that we can readily visualize.

We'll use principal components analysis (PCA) and t-distributed stochastic
neighborhood embedding (t-SNE) to build two different low dimensional feature
spaces. PCA finds the principal directions (eigenvectors) that explain the
greatest variation in the samples. t-SNE is a nonlinear method that transforms
samples to a lower-dimensional space such that samples that are near each other
in the embedding space should be near each other in the transformed space.

Each circle in the plot below represents a SOTU address in one of these
low-dimensional feature space (mouse over the circle to see the president and
year of the address). With the buttons, you can select different embedding
types, dimensionality-reduction methods, and coloring schemes.

<div class="container-fluid text-center pb-2" id="features"></div>

<div class="container-fluid button-toolbar text-center pb-3" role="toolbar">
  <div class="btn-group" id="embedding-select" role="group">
    <input type="radio" class="btn-check" name="embradio" id="tfidf" autocomplete="off" checked>
    <label class="btn btn-outline-secondary" for="tfidf">tf-idf</label>
    <input type="radio" class="btn-check" name="embradio" id="ada002" autocomplete="off">
    <label class="btn btn-outline-secondary" for="ada002">OpenAI ada-002</label>
    <input type="radio" class="btn-check" name="embradio" id="3small" autocomplete="off">
    <label class="btn btn-outline-secondary" for="3small">OpenAI 3-small</label>
  </div>
  <div class="btn-group" id="dimension-select" role="group">
    <input type="radio" class="btn-check" name="dimradio" id="pca" autocomplete="off" checked>
    <label class="btn btn-outline-secondary" for="pca">PCA</label>
    <input type="radio" class="btn-check" name="dimradio" id="tsne" autocomplete="off">
    <label class="btn btn-outline-secondary" for="tsne">t-SNE</label>
  </div>
  <div class="btn-group" id="color-select" role="group">
    <input type="radio" class="btn-check" name="colradio" id="year" autocomplete="off" checked>
    <label class="btn btn-outline-secondary" for="year">Year</label>
    <input type="radio" class="btn-check" name="colradio" id="auth" autocomplete="off">
    <label class="btn btn-outline-secondary" for="auth">Author</label>
  </div>
</div>

You can see embeddings from any one president (select 'Author' coloring)
typically cluster nearby each other, which follows intuition. Some presidents
(and depending on the embedding type and low-dimensional representation) cluster
better together than others.

But across all embedding types and low-dimensional transforms, it's clear that
temporal trends dominate. You can see how samples colored by year make their way
from one side of the feature space to the other. I'd venture to guess that this
evolution we see in embedding space is more likely due to changes in vocabulary,
grammar, and syntax as opposed to ideology and policy.

#### Nearest queries

It's a little surprising above how well `tf-idf` appears to stack up to the
state-of-the-art--at least as far as demonstrating similar trends. `tf-idf` just
looks at word frequencies. The following sentences have drastically different
semantic meanings, but exactly the same `tf-idf` representation: "Roger walked
Pongo" and "Pongo walked Roger".

Since we computed embeddings for each paragraph, we can make nearest queries at
the paragraph level. Consider the following remark from Biden's 2023 address:
"We must be the nation we have always been at our best. Optimistic. Hopeful.
Forward-looking." The nearest paragraph in other addresses for each embedding
type are:
* `tf-idf `: (Eisenhower, 1958) "We must be forward-looking in our research and
  development to anticipate and achieve the unimagined weapons of the future."
* `ada-002`: (Bush, 1991) "We are a nation of rock-solid realism and clear-eyed
  idealism. We are Americans. We are the nation that believes in the future. We
  are the nation that can shape the future."
* `3-small`: (Bush, 1991) "We are a nation of rock-solid realism and clear-eyed
  idealism. We are Americans. We are the nation that believes in the future. We
  are the nation that can shape the future."

Both OpenAI nearest seem to capture the sentiment of the original statement;
looking positively into the future. The nearest `tf-idf` does indeed look into
the future, but a future where we have access to _unimagined_ weaponry--a
decidedly different message.

But at the full address level, even `tf-idf` embeddings appears to capture
similarity between presidents. Below, you can select a particular query SOTU
address with the drop down menu and see the ten most similar addresses for each
of the different embedding types. We applied cosine distance here, which in our
case is equivalent to L2 distance since all embedding types are unit norm.

<div class="container-fluid pb-3">
  <div class="row align-items-start">
    <div class="col pb-3">
      <div class="dropdown">
        <button class="btn w-100 btn-secondary dropdown-toggle" type="button"
            data-bs-toggle="dropdown" id="similarity-button"></button>
        <ul class="dropdown-menu w-100" id="similarity-selector-list"
            style="max-height:300px;overflow-y:scroll;"></ul>
      </div>
    </div>
  </div>
  <div class="row align-items-start">
    <div class="col">
      <h6>tf-idf</h6>
    </div>
    <div class="col">
      <h6>OpenAI ada-002</h6>
    </div>
    <div class="col">
      <h6>OpenAI 3-small</h6>
    </div>
  </div>
  <div class="row align-items-start">
    <div class="col" style="font-size:85%;">
      <ul class="list-group" id="nearest-tfidf"></ul>
    </div>
    <div class="col" style="font-size:85%;">
      <ul class="list-group" id="nearest-openai-ada-002"></ul>
    </div>
    <div class="col" style="font-size:85%;">
      <ul class="list-group" id="nearest-openai-3-small"></ul>
    </div>
  </div>
</div>

Many of the nearest addresses follow intuition, for example, only former
addresses by Obama and Clinton are included in the top ten for Biden-2021, but
not other recent presidents. But this isn't the case across the board; there are
a few surprises in the nearest queries (e.g., Biden and LBJ?) and a fair bit of
variation amongst the different embedding types.

It's also interesting to see the variation in the distance magnitude between
embedding types and different presidents. For example, `ada-002` seems to
produce very small distances across the board.

## So what?

Within this toy project, it's been fun to see the inferred similarity and
dissimilarity between SOTU addresses based on their corresponding vector space
embeddings. It would be really interesting to try to root cause some of these
similarities and differences. Or, approached from the other direction, see how
two presidents with known similar policies compare. I wonder what insights
actual scholars out there have unearthed already...

On the tech side, just a few days ago, Nomic AI
[launched](https://blog.nomic.ai/posts/nomic-embed-text-v1) their text
embeddings, which, in addition to being open source, outperform OpenAI `ada-002`
and `3-small` embeddings on a variety of benchmarks. Incidentally, another Nomic
product, Atlas, is, apparently, a better version of t-SNE as far as providing
providing a low-dimensional glimpse into your feature space. It would be fun to
compare, but let's call it a day here.

<script src="/assets/presidential_1.js"></script>
<script src="/assets/presidential_2.js"></script>
