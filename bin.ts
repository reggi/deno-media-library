import { parse as flagParse } from "https://deno.land/std/flags/mod.ts";

const usage = `
media-library

Copies files to media-library directory. Will create folder structure and rename file based in earliest embeded file date.

----- Running the script ----- 

deno run --allow-read \\
         --allow-write \\
         --allow-run \\
         --unstable \\
         ${import.meta.url.replace(/^file:\/\//, '')} \\
         --dir=<dir> \\
         <files>

----- Installing this script ----- 

deno install \\
         -f \\
         --allow-read \\
         --allow-write \\
         --allow-run \\
         --allow-net \\
         --unstable \\
         --name=media-library \\
         ${import.meta.url.replace(/^file:\/\//s,'')}

----- Running the installed script -----

media-library --dir=<dir> <files>
`

const parsedArgs = flagParse(Deno.args, { boolean: true });
const mediaLibrary = parsedArgs['dir']

if (mediaLibrary) {
  const api = await import('./mod.ts')
  await api.cli()
  Deno.exit(0);
}

console.log(usage);
Deno.exit(1);