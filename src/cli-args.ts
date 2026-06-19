export interface CliArgs {
  link?: string
  out?: string
  name?: string
  message?: string
  label?: string
  accent?: string
  theme?: 'light' | 'dark'
  scale?: string
  help?: boolean
}

const FLAGS = ['link', 'out', 'name', 'message', 'label', 'accent', 'theme', 'scale'] as const

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '-h' || a === '--help') {
      args.help = true
      continue
    }
    if (!a.startsWith('--')) {
      throw new Error(`unexpected argument: ${a}`)
    }
    const key = a.slice(2)
    if (!(FLAGS as readonly string[]).includes(key)) {
      throw new Error(`unknown option: ${a}`)
    }
    const value = argv[++i]
    if (value === undefined) {
      throw new Error(`missing value for ${a}`)
    }
    if (key === 'theme' && value !== 'light' && value !== 'dark') {
      throw new Error(`--theme must be 'light' or 'dark'`)
    }
    ;(args as Record<string, string>)[key] = value
  }
  return args
}
