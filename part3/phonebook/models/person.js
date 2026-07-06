require('dns').setServers(['8.8.8.8', '1.1.1.1'])
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  // default mongoose validator is used 
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  // custom mongoose validator is used 
  number: {
    type: String,
    validate: {
      validator: function (v) {
        /// starts with 2-3 digits, then a dash, then more digits, and total length is at least 8
        return /^\d{2,3}-\d+$/.test(v) && v.length >= 8
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})



module.exports = mongoose.model('Person', personSchema)
