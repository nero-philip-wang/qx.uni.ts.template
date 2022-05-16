class Enumerable {
  constructor(array) {
    this.data = array || []
  }

  all(predicate) {
    if (typeof predicate !== 'function') return false
    var result = true
    this.data.forEach(function(x) {
      if (!predicate(x)) {
        result = false
        return false // break
      }
    })
    return result
  }

  any(predicate) {
    if (typeof predicate !== 'function') return false
    var result = false
    this.data.forEach(function(x) {
      if (predicate(x)) {
        result = true
        return true // break
      }
    })
    return result
  }

  where(predicate) {
    if (typeof predicate !== 'function') return new Enumerable([])
    else return new Enumerable(this.data.filter(predicate))
  }

  select(selector = (c) => c) {
    return this.date.map(selector)
  }

  sum(selector = (c) => c) {
    var sum = 0
    this.data.forEach((c) => {
      sum += selector(c)
    })
    return sum
  }

  firstOrDefault(predicate) {
    return this.data.find(predicate)
  }
}

const constructor = (array) => {
  return new Enumerable(array)
}
export default constructor
