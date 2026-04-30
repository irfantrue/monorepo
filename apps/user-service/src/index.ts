import 'dotenv/config'

import { env } from '@config/env'
import { logger } from '@shared/logger'

const log = logger.child({ module: 'App' })

log.debug('print env', { env })
