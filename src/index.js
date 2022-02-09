const fs = require("fs")
const yaml = require("js-yaml")
const Handlebars = require("handlebars")
const core = require("@actions/core")

const ESCAPE_SEQUENCE = "_@"

try {
  const FLAGS = {
    templateFile: core.getInput("templateFile", { required: true }),
    inputFile: core.getInput("inputFile", { required: true }),
    outputPath: core.getInput("outputPath", { required: true }),
  }

  // load yaml file
  function getInputData() {
    const raw = fs.readFileSync(FLAGS.inputFile, "utf8")
    return yaml.load(raw)
  }

  const inputData = getInputData()

  // reformat json
  function reformatData(data) {
    const newData = { groupList: [] }
    Object.entries(data).forEach(([key, value]) => {
      const itemTmp = {}
      itemTmp.groupTitle = key
      itemTmp.emoji = value[ESCAPE_SEQUENCE + "icon"]
      itemTmp.linkList = Object.entries(value)
        .map(([key, value]) => {
          if (key.startsWith(ESCAPE_SEQUENCE)) return
          return {
            linkTitle: key,
            linkUrl: value,
          }
        })
        .filter((item) => item !== undefined)

      newData.groupList.push(itemTmp)
    })
    return newData
  }
  const data = reformatData(inputData)

  // generate html
  function generateHtml(data) {
    var source = fs.readFileSync(FLAGS.templateFile, "utf8")
    var template = Handlebars.compile(source)
    var result = template(data)
    return result
  }
  const outHtml = generateHtml(data)

  // write file
  fs.mkdirSync(FLAGS.outputPath, { recursive: true })
  fs.writeFileSync(FLAGS.outputPath + "index.html", outHtml)
} catch (error) {
  core.setFailed(error.message)
}
