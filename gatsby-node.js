const fs = require('fs')

exports.onPreBootstrap = ({ reporter }) => {
  const contentPath = 'data'
  if (!fs.existsSync(contentPath)) {
    reporter.info(`creating the ${contentPath} directory`)
    reporter.info(`you should provide a 'pages.json' inside data/`)
    fs.mkdirSync(contentPath)
  }
}

const slugify = (basePath, str) => {
  if (!str) return basePath
  const slug = str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-\$)+/g, '')
  return `/${basePath}/${slug}`.replace(/\/\/+/g, '/')
}

const reduceBy = prop => col =>
  col.reduce((acc, cur) => ({ ...acc, [cur[prop]]: cur }), {})

async function onCreateNode(
  { node, actions, loadNodeContent, createNodeId, createContentDigest },
  options
) {
  const { createNode } = actions
  const basePath = options.basePath || '/'

  if (node.internal.mediaType !== `application/json` || node.name !== 'pages') {
    return
  }

  const content = await loadNodeContent(node)
  const parsed = JSON.parse(content)

  if (!parsed.menu) {
    return
  }

  const file___NODE = node.internal.type === 'File' ? node.id : null

  const { menu, pages } = parsed

  const menuMap = reduceBy('page')(menu)

  const pagesProcessed = pages.map(page => ({
    ...page,
    path: slugify(basePath, !page.homepage && page.name),
    title: menuMap[page.name].value,
    props: JSON.stringify(page.props || '{}')
  }))

  const pagesMap = reduceBy('name')(pagesProcessed)

  const menuProcessed = menu.map(entry => ({
    ...entry,
    path: pagesMap[entry.page].path,
  }))

  const createNodeFor = type => (content, i) => ({
    ...content,
    file___NODE,
    id: createNodeId(`${node.id}[${type}-${i}]`),
    children: [],
    parent: node.id,
    internal: {
      contentDigest: createContentDigest(content),
      type,
    },
  })

  const processPerType = type => (entity, i) => {
    const newNode = createNodeFor(type)(entity, i)
    createNode(newNode)
  }

  menuProcessed.forEach(processPerType('Menu'))
  pagesProcessed.forEach(processPerType('Page'))
}

exports.onCreateNode = onCreateNode
