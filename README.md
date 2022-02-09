# startpage-action
A lightweight Startpage generator powered by YAML &amp; handlebars


## Action 🎬

``` yaml
# .github/workflows/live.yml

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
