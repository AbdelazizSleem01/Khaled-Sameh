const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

function readEnvValue(envText, key) {
  const line = envText.split(/\r?\n/).find((l) => l.startsWith(`${key}=`))
  if (!line) return null
  return line.slice(key.length + 1).trim().replace(/^"|"$/g, '')
}

async function main() {
  const envPath = path.join(process.cwd(), '.env.local')
  const envText = fs.readFileSync(envPath, 'utf8')
  const uri = readEnvValue(envText, 'MONGODB_URI')
  const email = readEnvValue(envText, 'ADMIN_EMAIL') || 'admin@barista.com'

  if (!uri) {
    console.error('MONGODB_URI is missing in .env.local')
    process.exit(1)
  }

  const password = process.argv[2]
  if (!password || password.length < 6) {
    console.error('Usage: node scripts/reset-admin-password.js <newPassword> (min 6 chars)')
    process.exit(1)
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })

  const Admin = mongoose.model(
    'Admin',
    new mongoose.Schema({ email: String, password: String }, { timestamps: true }),
    'admins'
  )

  const hash = await bcrypt.hash(password, 10)
  const res = await Admin.updateOne(
    { email },
    { $set: { password: hash } },
    { upsert: true }
  )

  console.log(`Admin password updated for ${email}.`, res)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
