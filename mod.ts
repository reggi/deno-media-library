import { walk } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { moment } from "https://deno.land/x/moment/moment.ts";
import { Hash } from "https://deno.land/x/checksum@1.2.0/mod.ts";
import { green, blue } from "https://deno.land/std/fmt/colors.ts"
import { parse as flagParse } from "https://deno.land/std/flags/mod.ts";
let active = import.meta.main;
const scriptName = 'media-library'

function log (head: string, msg: string = '') { 
  if (active) { 
    console.log(`${green(head)} ${blue(scriptName)} ${msg}`)
  }
}

async function moveFile (file: string, libraryDir: string): Promise<boolean> {
  const p = Deno.run({
    cmd: ["exiftool", "-json", file],
    stdout: "piped",
  });

  file = path.join(file);

  const value = await p.output();
  const decoded = new TextDecoder("utf-8").decode(value);
  if (decoded === "") return false;
  const parsed = JSON.parse(decoded);
  const results = parsed[0];
  const exifDateFormat = "YYYY:MM:DD HH:mm:SSZ";

  const dates = [
    results["FileModifyDate"],
    results["FileAccessDate"],
    results["FileInodeChangeDate"],
    results["DateTimeOriginal"],
    results["CreateDate"],
  ].filter((u) => u);

  const moments = dates.map((d) => moment(d, exifDateFormat));

  const extname = path.extname(file);

  const date = moment.min(moments);
  const content = await Deno.readFile(file);
  const checksum = new Hash("sha1").digest(content).hex();

  const folder = date.format("YYYY-MM-DD");

  const name = `${date.format().replace(/:/g, "_")}-${checksum}${extname}`;
  const dest = path.join(folder, name);
  const abs = path.join(libraryDir, dest);

  await Deno.mkdir(path.dirname(abs), { recursive: true });
  log('Copying', `${file} to ${abs}`)
  await Deno.copyFile(file, abs);
  
  return true
}

async function moveRecursive(path: string, libraryDir: string): Promise<boolean> {
  const skip = [
    // folders
    /\.git/,
    /node_modules/,
    /\@eadir/,
    /\@sharebin/,
    // files
    /\.picasa\.ini$/,
    /\.DS_Store$/i,
    /\.Trashes$/,
    /\.SynologyWorkingDirectory$/,
    /desktop\.ini$/,
    /thumbs\.db$ /
  ]
  for await (const entry of walk(path, { skip })) {
    if (entry.isFile) { 
      await moveFile(entry.path, libraryDir)
    }
  }
  return true
}

export async function moveFiles(files: string[], libraryDir: string): Promise<boolean[]> {
  // safety net
  files.map(f => { 
    if (f === '/') throw new Error('do not ruin your hard drive')
    if (f === './') throw new Error('do not ruin your working dir')
    if (f === '../') throw new Error('do not ruin your up dir')
    if (f === '~/') throw new Error('do not ruin your home dir')
  })

  return Promise.all(files.map(async f => { 
    const s = await Deno.stat(f)
    if (s.isFile) await moveFile(f, libraryDir)
    if (s.isDirectory) await moveRecursive(f, libraryDir)
    return false
  }));
}

export async function cli() {
  active = true
  const parsedArgs = flagParse(Deno.args, { boolean: true });
  if (parsedArgs['help']) return Deno.exit();
  log('Executing');
  const libraryDir = parsedArgs['dir'];
  if (!libraryDir) throw new Error('dir flag is not set')
  const files = parsedArgs._.map(v => v.toString())
  await moveFiles(files, libraryDir)
}
