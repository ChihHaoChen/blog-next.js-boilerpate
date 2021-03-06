import { MongoClient } from 'mongodb'

const handler = async (req, res) => {

  const connectionURL = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.wsbjn.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`

  if (req.method === 'POST') {
    const { email, name, message } = req.body

    if (!email || !email.includes('@') || !name || name.trim() === '' || !message || message.trim() === '') {
      res.status(422).json({ message: 'Invalid input.' })
      return
    }

    // Store the messages in a databased 
    const newMessage = { email, name, message }
    let client
    try {
      client = await MongoClient.connect(connectionURL)

    } catch (err) {
      res.status(500).json({ message: 'Could not connect to database.'})
      return
    }

    const db = client.db()
    
    try {
      const result = await db.collection('messages').insertOne(newMessage)

      newMessage.id = result.insertId
    } catch (err) {
      client.close()
      res.status(500).json({ message: 'Storing message failed.' })

      return
    }
    client.close()

    res.status(201).json({ message: 'Successfully stored message!', message: newMessage })
  }
}


export default handler