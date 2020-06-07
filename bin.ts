import { parse as flagParse } from "https://deno.land/std/flags/mod.ts";
import { magenta, bold } from "https://deno.land/std/fmt/colors.ts"
import * as path from "https://deno.land/std/path/mod.ts";
const file = import.meta.url.replace(/^file:\/\//s, '')
const repoName = path.basename(path.dirname(file))
const fileName = path.basename(file)
const githubGuess = `https://raw.githubusercontent.com/reggi/${repoName}/master/${fileName}`

const usage = `
# \`media-library\`

Copies files to media-library directory. Will create folder structure and rename file based in earliest embeded file date.

## Run bin (get this message)

\`\`\`bash
deno run ${githubGuess}
\`\`\`

## Install

\`\`\`bash
deno install \\
    -f \\
    --allow-read \\
    --allow-write \\
    --allow-run \\
    --allow-net \\
    --unstable \\
    --name=media-library \\
    ${githubGuess}
\`\`\`

## Run

\`\`\`bash
media-library --dir=<dir> <files>
\`\`\`

## Generate Readme

\`\`\`bash
deno run ./bin.ts --readme > README.md
\`\`\`

## Help / Usage Doc

\`\`\`bash
deno run ./bin.ts --help 
\`\`\`
`

const parsedArgs = flagParse(Deno.args, { boolean: true });

if (parsedArgs['dir']) {
  const api = await import('./mod.ts')
  await api.cli()
  Deno.exit(0);
}

if (parsedArgs['readme']) {
  console.log(usage);
  Deno.exit(0);
}

console.log(usage
  .replace(/^\n/, '')
  .replace(/\`\`\`bash\n/g, '')
  .replace(/`/g, '')
  .replace(/(\#+?) (.+)/g, (a, b, c) => `${magenta(bold(c))}:`)
);
Deno.exit(1);
