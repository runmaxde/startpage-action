# startpage-action
A lightweight Startpage generator powered by YAML &amp; handlebars


## Action 🎬

``` yaml
# ~/.github/workflows/buil.yml

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    name: Build the page
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2

      - name: Build
        uses: runmaxde/startpage-action
        with:
          templateFile: "./template/index.hbs"
          inputFile: "./input.yml"
          outputPath: "./page/"

      - name: Commit
        run: |
          git config --local user.email "$(git log --format='%ae' HEAD^!)"
          git config --local user.name "$(git log --format='%an' HEAD^!)"
          git add .
          git commit -m "👷 🔨"
          git push origin HEAD:${GITHUB_REF}
        shell: bash
```

## Example

``` handlebars
{{!-- ~/template/index.hbs --}}

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>

  <title>Startpage</title>
</head>

<body>
  <div class="flex items-center justify-center h-screen font-mono text-white bg-stone-900">
    <div class="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3">
      {{#groupList}}
      <div class="m-10">

        <div class="text-2xl font-black">
          <span class="text-3xl text-center" style="display: inline-block; width: 35px; height: 35px">{{emoji}}</span>
          <span class="ml-2">
            {{groupTitle}}
          </span>
        </div>
        <div class="mt-2 ml-4 border-l">
          {{#linkList}}
          <div class="p-1 pl-10">
            <a href='{{linkUrl}}'>{{linkTitle}}</a>
          </div>
          {{/linkList}}
        </div>
      </div>
      {{/groupList}}
    </div>
  </div>
</body>

</html>
```

``` yaml 
# ~/input.yml

Group 1:
  _@icon: 🚀
  github: https://github.com/
  google: https://google.com/
```
