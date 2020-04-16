const start = async () => Promise.resolve('Promise')

start()
  .then(console.log)

class Utils {
  static id = Date.now()
}

const f = 0

console.log(Utils.id)

import ('lodash').then( _ => {
  console.log(_.random(0, 78, true))
})