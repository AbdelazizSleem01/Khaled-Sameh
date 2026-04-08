import mongoose from 'mongoose'

declare global {
  var mongooseConn: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

// Check if MONGODB_URI is defined
export function getMongoURI(): string {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }
  return MONGODB_URI
}

const cached = global.mongooseConn || (global.mongooseConn = { conn: null, promise: null })

const options: mongoose.ConnectOptions = {
  bufferCommands: false,
  maxPoolSize: 5,            
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, options)
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}

export default dbConnect
