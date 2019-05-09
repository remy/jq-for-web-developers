/* eslint-env browser */
/* global jq: true */

var STDOUT = [],
  STDERR = [],
  FILE_DATA = '/tmp/data.json',

var Module = {
  // Don't run main on page load
  noInitialRun: true,

  // Print functions
  print: stdout => STDOUT.push(stdout),
  printErr: stderr => STDERR.push(stderr),

  // When the module is ready
  onRuntimeInitialized: function() {
    ready();
  },
};

// Utility function to run jq
function jq(jsonStr, query, options) {
  // Custom jq options.
  // Default = -M = disable colors
  var mainOptions = ['-M'];
  if (options != null && options.length > 0)
    mainOptions = mainOptions.concat(options);

  // Create file from object
  FS.writeFile(FILE_DATA, jsonStr);

  // Clear previous stdout/stderr before launching jq
  STDOUT = [];
  STDERR = [];

  // Launch jq's main() function
  mainOptions = mainOptions.concat([query, FILE_DATA]);
  Module.callMain(mainOptions);

  // Re-open stdout/stderr after jq closes them
  FS.streams[1] = FS.open('/dev/stdout', 'w');
  FS.streams[2] = FS.open('/dev/stderr', 'w');

  return {
    stdout: STDOUT.join('\n'),
    stderr: `${STDERR[0]}\n${STDERR[1]}`,
  };
}

const escaped = new Map([['<', '&lt;'], ['>', '&gt;']]);

function ready() {
  const $ = s => document.getElementById(s.substr(1));
  Array.from(document.querySelectorAll('.language-jq'))
    .filter(_ => _.dataset.source)
    .map(_ => {
      const container = _.parentNode;

      let source = [];

      if (_.dataset.source.indexOf('#') === 0) {
        source = JSON.parse($(_.dataset.source).textContent);
      } else {
        source = JSON.parse(_.dataset.source);
      }

      const input = document.createElement('textarea');
      input.className = 'input';
      input.value = _.innerText.trim();
      container.replaceChild(input, _);

      input.oninput = e => {
        input.rows = input.value.split('\n').length;
      };

      input.onkeypress = e => {
        if (e && e.which === 13) {
          if (e.metaKey || e.ctrlKey || e.shiftKey) {
            button.onclick();
            e.preventDefault();
          }
        }
      };

      input.oninput();

      const output = document.createElement('code');
      container.append(output);

      const button = document.createElement('button');
      button.innerHTML = 'Run code';
      button.className = 'run';
      button.onclick = () => {
        output.innerHTML = '';
        const query = input.value;
        const res = jq(source, query);
        output.innerHTML = res.stdout.replace(/<>/g, m => escaped.get(m));
      };

      container.append(button);
    });
}

async function main() {
  var script = document.createElement('script');
  script.src = '/assets/js/jq.js';
  document.head.appendChild(script);
  script.onload = () => {
    jq.onInitialized.addListener(ready);
  };
}

main();
