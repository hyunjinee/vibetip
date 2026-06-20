// Registers a DOM (document, window, etc.) for `bun test` so widget tests can
// exercise the Shadow-DOM code. Pure tests (card, cli-args) are unaffected.
import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()
