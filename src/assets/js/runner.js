/* eslint-env browser */
/* global jq: true */

const escaped = new Map([['<', '&lt;'], ['>', '&gt;']]);

function ready() {
  console.log('jq loaded');

  const $ = s => document.getElementById(s.substr(1));
  Array.from(document.querySelectorAll('.language-jq'))
    .filter(_ => _.dataset.source)
    .map(_ => {
      const container = _.parentNode;
      const opts = (_.dataset.options || '').split(' ').filter(Boolean);

      let source = [];

      if (_.dataset.source.indexOf('#') === 0) {
        source = $(_.dataset.source).textContent;
      } else {
        source = _.dataset.source;
      }

      const input = document.createElement('textarea');
      input.className = 'input';
      input.value = _.innerText.trim();
      // container.replaceChild(input, _);
      container.prepend(input);
      _.hidden = true;

      input.oninput = () => {
        input.rows = input.value.split('\n').length;
      };
      input.oninput();

      input.onkeypress = e => {
        if (e && e.which === 13) {
          if (e.metaKey || e.ctrlKey || e.shiftKey) {
            button.onclick();
            e.preventDefault();
          }
        }
      };

      const output = document.createElement('code');
      output.className = 'result';
      container.append(output);

      const button = document.createElement('button');
      button.innerHTML = 'Run code';
      button.className = 'run';
      button.onclick = () => {
        output.innerHTML = '';
        const query = input.value;
        console.log({ source, query, opts });

        jq(source, query, opts).then(res => {
          output.innerHTML = res.replace(/<>/g, m => escaped.get(m));
        });
      };

      container.append(button);
    });
}

async function main() {
  var script = document.createElement('script');
  script.src = '/assets/js/workerize.js';
  document.head.appendChild(script);
  script.onload = () => {
    jq.onInitialized = ready;
  };
}

main();
