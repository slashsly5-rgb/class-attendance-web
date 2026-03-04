import { customAlphabet } from 'nanoid'

// Custom alphabet: uppercase letters + numbers (no ambiguous chars like 0/O, 1/I)
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const nanoid = customAlphabet(alphabet, 8)

export function generateClassCode(): string {
  return nanoid() // Returns 8-char code like "A3K7M9XP"
}
