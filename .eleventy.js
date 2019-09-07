const undefsafe = require('undefsafe');
const format = require('date-fns/format');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');

const options = {
  html: true,
  // breaks: true,
  linkify: true
};

module.exports = function(eleventyConfig) {
  eleventyConfig.addJavaScriptFunction('next', () => {});

  eleventyConfig.addFilter('format', (s, fmt) =>
    format(s, fmt || 'dddd D MMM YYYY')
  );

  eleventyConfig.addFilter('shuffle', a =>
    a.sort(() => (Math.random() < 0.5 ? -1 : 1))
  );

  eleventyConfig.addFilter('sortBy', (source, prop) => {
    let m = 1;
    if (prop.startsWith('-')) {
      prop = prop.slice(1);
      m = -1;
    }
    return Array.from(source).sort((a, b) => {
      return undefsafe(a, prop) < undefsafe(b, prop) ? -m : m;
    });
  });

  eleventyConfig.addFilter('unique', (source, prop) => {
    const res = Array.from(
      new Set(
        source.reduce((acc, curr) => {
          const res = undefsafe(curr, prop);

          if (Array.isArray(res)) {
            return [...res, ...acc];
          }

          return [res, ...acc];
        }, [])
      )
    ).sort();

    return res;
  });

  // static passthroughs
  eleventyConfig.addPassthroughCopy('./src/assets/img');
  eleventyConfig.addPassthroughCopy('./src/assets/js');

  eleventyConfig.addCollection('articles', function(collection) {
    // get unsorted items
    const res = collection
      .getAll()
      .filter(article => {
        return article.data.order != null;
      })
      .sort((a, b) => (a.data.order < b.data.order ? -1 : 1));

    return res;
  });

  const md = markdownIt(options);
  md.use(markdownItAttrs);
  eleventyConfig.setLibrary('md', md);

  return {
    dir: {
      input: 'src',
      output: '_site'
    },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true
  };
};
