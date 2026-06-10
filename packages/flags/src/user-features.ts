import { createBitfield } from 'sybits'

const flags = {
    ['administrator']: 1n << 0n,

    ['create:books']: 1n << 1n,
    ['read:books:all']: 1n << 2n,
    ['read:books:available']: 1n << 3n,
    ['edit:books']: 1n << 4n,
    ['delete:books']: 1n << 5n,

    ['create:users']: 1n << 6n,
    ['read:users:all']: 1n << 7n,
    ['edit:users']: 1n << 8n,
    ['edit:users_permissions']: 1n << 9n,
    ['delete:users']: 1n << 10n,

    ['create:session']: 1n << 11n,
    ['create:password_recovery']: 1n << 12n,
    ['read:activation_token']: 1n << 13n,

    ['create:loans']: 1n << 14n,
    ['read:loans:all']: 1n << 15n,
    ['read:loans_history:all']: 1n << 16n,
    ['read:loans:own']: 1n << 17n,
    ['read:loans_history:own']: 1n << 18n,
    ['edit:loans']: 1n << 19n,
    ['delete:loans']: 1n << 20n,

    ['read:reports']: 1n << 21n,
}

const _UserFeatures = createBitfield(flags, 0n
    | flags['read:activation_token']
)

export class UserFeatures extends _UserFeatures {
    has(...args: Parameters<InstanceType<typeof _UserFeatures>['has']>): boolean {
        if (super.has('administrator')) {
            return true
        }

        return super.has(...args)
    }
}

// Object.defineProperty(UserFeatures, 'name', {
//     value: 'UserFeatures',
// })

export const UserFeaturesByRole = {
    ADMIN: UserFeatures.ALL,

    MANAGER: UserFeatures.resolve(
        'create:books',
        'edit:books',
        'read:books:all',

        'create:users',
        'edit:users',
        'edit:users_permissions',
        'delete:users',

        'create:session',
        'create:password_recovery',

        'create:loans',
        'edit:loans',
        'delete:loans',
        'read:books:available',
        'read:loans:own',
        'read:loans_history:own'
    ),

    COMMON: UserFeatures.resolve(
        'create:session',
        'create:password_recovery',
        'read:books:available',
        'read:loans:own',
        'read:loans_history:own'
    )
}