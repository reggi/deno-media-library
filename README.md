# `deno-media-library`

```
deno run https://raw.githubusercontent.com/reggi/deno-media-library/master/bin.ts
```

Will output the following help message:


## Running the script

```bash
deno run --allow-read \
         --allow-write \
         --allow-run \
         --allow-net \
         --unstable \
         https://raw.githubusercontent.com/reggi/deno-media-library/master/bin.ts \
         --dir=<dir> \
         <files>
```

## Installing this script

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

## Running the installed script

```bash
media-library --dir=<dir> <files>
```
