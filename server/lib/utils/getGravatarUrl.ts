import crypto from 'crypto'

export const getGravatarUrl = (email: string) => {
  const trimmedEmail = email.trim().toLowerCase()
  const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex')

  return `https://www.gravatar.com/avatar/${hash}?s=${80}&d=identicon`
}
