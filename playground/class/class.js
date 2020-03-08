class Person {
  constructor(name = "Anonymous", age = 0) {
    this.name = name,
      this.age = age
  }
  getGreeting() {
    return `Hello ${this.name}`
  }
}

class Student extends Person {
  constructor(name, age, location, major) {
    super(name, age),
      this.location = location,
      this.major = major
  }
  hasMajor() {
    return !!this.major
  }
  getDescription() {
    let description = `${this.name} have ${this.age} year old. `

    if (this.hasMajor()) {
      description += `He have major in ${this.major}`
    }
    return description
  }
  getGreeting() {
    let greeting = super.getGreeting();

    if (this.location) {
      greeting += ` He living in ${this.location}`
    }
    return greeting
  }
}

const aa = new Person('Mr. A', 30)
const bb = new Student('Mr. B', 50, 'Bangkok', 'Physics')
const cc = new Student('Mr. C', 50)

console.log(aa.name, aa.age)
console.log(aa.getGreeting())
console.log(bb.getGreeting())
console.log(bb.getDescription())
console.log(cc.getGreeting())