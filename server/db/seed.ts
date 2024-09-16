import { db } from '.'
import { levelsConfiguration } from './schema'

await db.delete(levelsConfiguration)

await db.insert(levelsConfiguration).values(
  Array.from({ length: 7 }).map((_, i) => ({
    desiredWeekFrequency: i + 1,
    goalToLevelUp: (i + 1) * 2,
  })),
)

process.exit(0)
