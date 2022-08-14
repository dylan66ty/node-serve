const str = '\\\\upload\\\\\\\\\\d76cbc4b-9730-471f-b9a2-92f65651bce3.txt'

const RE = /(\\)\1+/g

const r = str.replace(RE, '/')

console.log(r);