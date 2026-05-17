const FormData = require('form-data')

function appendFormValue(form, key, value) {
  if (value === undefined || value === null) {
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendFormValue(form, `${key}[${index}]`, item)
    })
    return
  }

  if (typeof value === 'object' && !(value instanceof Buffer) && !(value instanceof Date) && typeof value.pipe !== 'function') {
    Object.entries(value).forEach(([childKey, childValue]) => {
      appendFormValue(form, key ? `${key}[${childKey}]` : childKey, childValue)
    })
    return
  }

  form.append(key, value)
}

module.exports = function buildForm(data = {}) {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => appendFormValue(form, key, value))
  return form
}
