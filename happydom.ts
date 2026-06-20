// Registers a DOM (document, window, etc.) for `bun test` so widget tests can
// exercise the Shadow-DOM code. Registration is process-wide, so the pure tests
// (card, cli-args) also run with a DOM present — they just don't use it.
import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()
