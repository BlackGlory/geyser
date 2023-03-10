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
所有API中的id都需要满足此正则表达式: `^[a-zA-Z0-9\.\-_]{0,255}$`

### get all rate limiter ids
`GET /rate-limiters`

返回JSON:
```ts
string[]
```

#### Example
##### curl
```sh
curl 'http://localhost:8080/rate-limiters'
```

##### fetch
```js
await fetch('http://localhost:8080/rate-limiters')
  .then(res => res.json())
```

### get rate limiter
`GET /rate-limiters/<id>`

获取速率限制器的信息.

如果速率限制器未启用, 返回HTTP状态码404.

返回JSON:
```ts
{
  duration: number | null // null表示Infinity
  limit: number | null // null表示Infinity, 配置为null或0通常没有意义
}
```

#### Example
##### curl
```sh
curl "http://localhost:8080/rate-limiters/$id"
```

##### fetch
```js
await fetch(`http://localhost:8080/rate-limiters/${id}`)
  .then(res => res.json())
```

### set rate limiter
`PUT /rate-limiters/<id>`

配置速率限制器.
如果速率限制器曾经被配置过, 这一动作会导致速率限制器的状态被再次初始化, 相当于重置, 即使新旧配置是相同的.

发送JSON:
```ts
{
  // 以毫秒为单位的时间周期, 由第一枚令牌分发时开始计算, 在指定毫秒数后进入下一周期.
  // null表示Infinity.
  duration: number | null

  // 在周期内允许分发的令牌数量.
  // null表示Infinity.
  limit: number | null
}
```

#### Example
##### curl
```sh
curl \
  --request PUT \
  --header "Content-Type: application/json" \
  --data "$payload" \
  "http://localhost:8080/rate-limiters/$id"
```

##### fetch
```js
await fetch(`http://localhost:8080/rate-limiters/${id}`, {
  method: 'PUT'
, headers: {
    'Content-Type': 'application/json'
  }
, body: JSON.stringify(unique)
})
```

### remove rate limiter
`DELETE /rate-limiters/<id>`

#### Example
##### curl
```sh
curl \
  --request DELETE \
  "http://localhost:8080/rate-limiters/$id"
```

##### fetch
```js
await fetch(`http://localhost:8080/rate-limiters/${id}`, {
  method: 'DELETE'
})
```

### reset rate limiter
`POST /rate-limiters/<id>/reset`

重置特定速率限制器, 这会导致速率限制器的各项状态被重置回初始值, 包括已分配的令牌数量和周期起始时间.

一个速率限制器只有在经过配置之后才能使用, 如果速率配置器未经配置, 将返回HTTP状态码404.

#### Example
##### curl
```sh
curl \
  --request POST \
  "http://localhost:8080/rate-limiters/$id/reset"
```

##### fetch
```js
await fetch(`http://localhost:8080/rate-limiters/${id}/reset`, {
  method: 'POST'
})
```

### acquire token
`POST /rate-limiters/<id>/acquire`

从特定速率限制器处申请令牌, 当令牌申请成功时, 返回HTTP状态码204.
如果速率限制器没有可用令牌, 但在当前配置下仍有可能申请到令牌, 则阻塞直到有新令牌.
如果速率限制器未经配置, 或速率限制器在阻塞中途被移除, 会返回HTTP状态码404, 这迫使客户端对其进行配置.

在内部, 速率限制器有一个周期起始时间, 存储第一个令牌被申请的时间.
速率限制器不会在一个周期结束后自动进入下一个周期, 只有存在令牌的申请请求的情况下才会导致下一个周期开始.

#### Example
##### curl
```sh
curl \
  --request POST
  "http://localhost:8080/rate-limiters/$id/acquire"
```

##### JavaScript
```js
await fetch(`http://localhost:8080/rate-limiters/${id}/acquire`, {
  method: 'POST'
})
```

## 环境变量
### `GEYSER_HOST`, `GEYSER_PORT`
通过环境变量`GEYSER_HOST`和`GEYSER_PORT`决定服务器监听的地址和端口,
默认值为`localhost`和`8080`.

## 客户端
- JavaScript/TypeScript(Node.js, Browser): <https://github.com/BlackGlory/geyser-js>
