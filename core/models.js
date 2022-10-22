const createError = require('http-errors')

async function getObjectOr404(model, id) {
  try {
    return await model.findById(id).orFail()
  } catch {
    throw createError(404)
  }
}

function getObjectOr404Middleware({ model, param = 'id', obj: objName = 'obj' }) {
  return async (req, res, next) => {
    const obj = await getObjectOr404(model, req.params[param])

    req.ctx[objName] = obj
    next()
  }
}

module.exports = { getObjectOr404, getObjectOr404Middleware }
