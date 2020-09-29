export function trataString (value) {
  const toString = Object.prototype.toString
  const result = toString.call(value)
  if (result === '[object String]') {
    return value
  } else if (result === '[object Number]') {
    return value
  } else if (result === '[object Array]') {
    return value.join('')
  } else if (result === '[object Object]') {
    return JSON.stringify(value)
  } else if (result === '[object Null]') {
    return ''
  } else if (result === '[object Undefined]') {
    return ''
  } else if (result === '[object Boolean]') {
    return JSON.stringify(value)
  }
}

export function mountUrl (pesquisa, page, order, orderDir, empresa = null, posicao = null) {
  const payload = {}
  const valuePesq = trataString(pesquisa)
  const valueOrder = trataString(order)
  const valueDesc = trataString(orderDir)
  const valueEmp = trataString(empresa)
  const valuePos = trataString(posicao)
  if (valuePesq !== '') payload.pesquisa = valuePesq
  if (valuePos !== '') payload.posicao = valuePos
  if (valueEmp !== '') payload.emp = valueEmp
  if (page > 1) payload.page = page
  if (valueOrder !== '') payload.order = valueOrder
  if (valueDesc !== '' && valueDesc === 'true' && valueOrder !== '') payload.dir = 'desc'
  /* new URLSearchParams() */
  let queryString = Object.keys(payload)
    .map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`
    )
    .join('&')
  if (queryString !== '') queryString = `?${queryString}`
  return queryString
}

export function converteMenu (menu) {
  const novomenu = []
  menu.forEach(title => {
    if (title.menutitle) {
      const obj = {}
      const item = {}
      const items = []
      obj.title = title.menutitle
      obj.icon = title.menuicon
      item.title = title.itemtitle
      item.icon = title.itemicon
      item.link = title.link
      item.name = title.name
      item.btnincluir = title.btnincluir
      item.btnalterar = title.btnalterar
      item.btnexcluir = title.btnexcluir
      item.btnchave1 = title.btnchave1
      item.btnchave2 = title.btnchave2
      item.btnchave3 = title.btnchave3
      item.btnchave4 = title.btnchave4
      item.descricao= title.descricao
      items.push(item)
      obj.items = items
      if (novomenu.find(el => el.title === obj.title)) {
        novomenu[novomenu.findIndex(el => el.title === obj.title)].items.push(
          item
        )
      } else {
        novomenu.push(obj)
      }
    }
  })
  return novomenu
}

export function wordUpper (arrWords) {
  var ignore = ['de', 'da', 'das', 'do', 'dos']

  for (var i in arrWords) {
    if (ignore.indexOf(arrWords[i]) === -1) {
      arrWords[i] = arrWords[i].charAt(0).toUpperCase() + arrWords[i].slice(1)
    }
  }

  return arrWords
}

export function dataVencida (vencimento) {
  const part = vencimento.split('/')
  const hoje = new Date()
  vencimento = new Date(part[2], part[1] - 1, part[0])
  return vencimento < hoje
}

export function dataHoje () {
  return new Date().toLocaleString('pt-br', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function dataFormatada (date) {
  return new Date(date).toLocaleString('pt-br', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function valorFormatado (value) {
  return Number(value).toLocaleString('pt-br', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
}

export function mesExtenso (date) {
  return new Date(date).toLocaleString('pt-br', { month: 'long' })
}

export function mesNumero (date) {
  return new Date(date).toLocaleString('pt-br', { month: '2-digit' })
}

export function anoAtual () {
  return new Date().toLocaleString('pt-br', { year: 'numeric' })
}

export default { trataString, mountUrl, converteMenu, wordUpper, dataVencida, dataHoje, valorFormatado, mesExtenso, anoAtual, dataFormatada }
