/* eslint-env browser */
/* global jq: true */

const escaped = new Map([['<', '&lt;'], ['>', '&gt;']]);
const $$ = s => Array.from(document.querySelectorAll(s));
const $ = s => document.querySelector(s);
let jqLoaded = false;

const container = $('main > .content');
const links = $$('nav a');
const root = document.documentElement;

$('#toggle-theme').onclick = () => {
  root.classList.toggle('dark');
  root.classList.toggle('light');

  localStorage.setItem('theme', root.className);
};

window.onpopstate = () => {
  loadContent(location.pathname);
};

function loadContent(pathname) {
  links.forEach(navLink => {
    navLink.parentNode.classList.remove('selected');

    if (navLink.pathname === pathname) {
      navLink.parentNode.classList.add('selected');
    }
  });

  container.classList.add('loading');

  fetch(pathname + 'index.json')
    .then(res => res.json())
    // .then(res => new Promise(resolve => setTimeout(() => resolve(res), 5000)))
    .then(data => {
      container.innerHTML = data.content;
      document.title = data.title;
      container.classList.remove('loading'); // potential for "cool" effects
      window.scrollTo(0, 0);
      container.parentNode.scrollTo(0, 0);

      liveCodeRunner();
      hookLinks();
    });
}

function hookLinks() {
  $$('a').forEach(link => {
    if (link.origin !== window.location.origin) {
      return;
    }

    if (link.dataset.hooked) {
      return;
    }

    link.dataset.hooked = true;

    link.addEventListener(
      'click',
      event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          return; // let the browser deal with the click natively
        }

        event.preventDefault();

        let { pathname } = link;

        if (!pathname.endsWith('/')) {
          pathname += '/';
        }

        // don't follow links that are loaded
        if (pathname === window.location.pathname) {
          return;
        }

        window.history.pushState(null, null, pathname);

        loadContent(pathname);
      },
      false
    );
  });
}

function liveCodeRunner() {
  if (!jqLoaded) return;

  $$('pre code').map(_ => (_.textContent = _.textContent.trim()));

  $$('.language-jq')
    .filter(_ => _.dataset.source)
    .map(_ => {
      console.log(_);

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
      _.classList.add('hidden');
      _.hidden = true;

      input.oninput = () => {
        _.hidden = false;
        _.innerHTML = input.value.replace(/\n/g, '\n&nbsp;');
        input.style.height = _.offsetHeight + 'px';
        _.hidden = true;
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
    jqLoaded = true;
    jq.onInitialized = liveCodeRunner;
  };
}

main();
hookLinks();
