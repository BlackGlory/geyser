import { CustomError } from '@blackglory/errors'

/**
 * 速率限制器在未经配置的情况下, 相当于不存在.
 */
export class RateLimiterNotFound extends CustomError {}
