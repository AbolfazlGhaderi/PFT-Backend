import { applyDecorators } from '@nestjs/common'

import { FILTER_DELETED_TITLE } from '@constants'
import { Filter } from '@mikro-orm/decorators/legacy'

export function ApplyDeletedFilter() {
    return applyDecorators(
        Filter({ name: FILTER_DELETED_TITLE, cond: { deletedAt: { $ne: null } }, default: true }),
    )
}
