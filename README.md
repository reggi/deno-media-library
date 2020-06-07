
# `media-library`

Copies files to media-library directory. Will create folder structure and rename file based in earliest embeded file date.

## Run bin (get this message)

```bash
deno run https://raw.githubusercontent.com/reggi/deno-media-library/master/bin.ts
```

## Install

```bash
deno install \
    -f \
    --allow-read \
    --allow-write \
    --allow-run \
    --allow-net \
    --unstable \
    --name=media-library \
    https://raw.githubusercontent.com/reggi/deno-media-library/master/bin.ts
```

## Run

```bash
media-library --dir=<dir> <files>
```

## Generate Readme

```bash
deno run ./bin.ts --readme > README.md
```

## Help / Usage Doc

```bash
deno run ./bin.ts --help 
```

