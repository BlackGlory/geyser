# geyser
提供以HTTP为通讯协议的咨询式速率限制器.

## Quickstart
```sh
docker run \
  --detach \
  --publish 8080:8080 \
  blackglory/geyser
```

## Install
### 从源代码运行
```sh
git clone https://github.com/BlackGlory/geyser
cd geyser
yarn install
yarn build
yarn bundle
yarn --silent start
```

### 从源代码构建
```sh
git clone https://github.com/BlackGlory/geyser
cd geyser
yarn install
yarn docker:build
```

### Recipes
#### docker-compose.yml
```yaml
version: '3.8'

services:
  geyser:
    image: 'blackglory/geyser'
    restart: always
    volumes:
      - 'geyser-data:/data'
    ports:
      - '8080:8080'

volumes:
  geyser-data:
```

## API
```ts
interface IRateLimiterConfig extends JSONObject {
  duration: number | null
  limit: number | null
}

interface IAPI {
  getAllRateLimiterIds(): string[]

  getRateLimiter(rateLimiterId: string): IRateLimiterConfig | null
  setRateLimiter(rateLimiterId: string, config: IRateLimiterConfig): null
  removeRateLimiter(rateLimiterId: string): null

  /**
   * 重置速率限制器的状态.
   * 
   * @throws {RateLimiterNotFound}
   */
  resetRateLimiter(rateLimiterId: string): null

  /**
   * @throws {RateLimiterNotFound}
   */
  acquireToken(rateLimiterId: string): null
}

/**
 * 速率限制器在未经配置的情况下, 相当于不存在.
 */
class RateLimiterNotFound extends CustomError {}
```

## 环境变量
### `GEYSER_HOST`, `GEYSER_PORT`
通过环境变量`GEYSER_HOST`和`GEYSER_PORT`决定服务器监听的地址和端口,
默认值为`localhost`和`8080`.

### `GEYSER_WS_HEARTBEAT_INTERVAL`
通过环境变量`GEYSER_WS_HEARTBEAT_INTERVAL`可以设置WS心跳包(ping帧)的发送间隔, 单位为毫秒.
在默认情况下, 服务不会发送心跳包,
半开连接的检测依赖于服务端和客户端的运行平台的TCP Keepalive配置.

当`GEYSER_WS_HEARTBEAT_INTERVAL`大于零时,
服务会通过WS的ping帧按间隔发送心跳包.

## 客户端
- JavaScript/TypeScript(Node.js, Browser): <https://github.com/BlackGlory/geyser-js>
