const getDelimiter = () => {
  const delimiter = window.cep_node.process.platform.indexOf('win') !== -1
    ? '\\'
    : '/'
  return delimiter
}

export default getDelimiter