# API Faker

使用YAML配置文件，快速创建一个Mock Server。

- 监听配置文件，自动刷新
- 根据响应文件的MIME类型设置`Content-Type`

## 安装

`go get -u github.com/fate-lovely/api-faker`

## 使用

```bash
$ api-faker --help
usage: api-faker [<flags>] <config>

Flags:
  -h, --help       Show context-sensitive help (also try
                   --help-long and --help-man).
      --port=3232  listening port
      --version    Show application version.

Args:
  <config>  config file
```

## 配置

配置文件使用YAML格式，每一个配置项由以下元素构成：

- `path`：指定请求路径
- `method`：指定请求方法，默认为`GET`
- `query`：指定请求应该携带的query参数
- `code`: 响应码，默认为200
- `headers`：自定义响应头
- `body`：响应体
- `file`：使用该文件内容作为响应体，如果此项存在，忽略`body`项，路径为绝对路径或者相对于配置文件的路径

对于每一个请求，会使用`path, method, query`进行匹配。

## 示例

**sample-config.yml**

```yaml
- path: /
  method: GET
  body: get /

- path: /
  method: POST
  body: post /

# 只有携带`lang=go`的查询字符串，才能匹配到这一条
- path: /query
  query:
    lang: go
  body: has lang=go query

- path: /headers
  headers:
    X-API-Faker: true
    X-Lang: Go
  body: respond with custom headers

# 使用`sample.json`进行响应，并自动设置MIME类型
- path: /json
  file: sample.json

# 响应码为201
- path: /created
  code: 201
  body: created
```

**sample.json**

```json
{
  "name": "api-faker",
  "msg": "hello world"
}
```

```bash
$ api-faker sample-config.yaml &
$ curl -i localhost:3232
HTTP/1.1 200 OK
Date: Wed, 29 Mar 2017 06:31:55 GMT
Content-Length: 5
Content-Type: text/plain; charset=utf-8

get /%
$ curl -i -XPOST localhost:3232/
HTTP/1.1 200 OK
Date: Wed, 29 Mar 2017 06:32:37 GMT
Content-Length: 6
Content-Type: text/plain; charset=utf-8

post /%
$ curl -i 'localhost:3232/query?lang=go'
HTTP/1.1 200 OK
Date: Wed, 29 Mar 2017 06:35:55 GMT
Content-Length: 17
Content-Type: text/plain; charset=utf-8

has lang=go query%
$ curl -i localhost:3232/headers
HTTP/1.1 200 OK
X-Api-Faker: true
X-Lang: Go
Date: Wed, 29 Mar 2017 06:37:14 GMT
Content-Length: 27
Content-Type: text/plain; charset=utf-8

respond with custom headers%
$ curl -i localhost:3232/json
HTTP/1.1 200 OK
Content-Type: application/json
Date: Wed, 29 Mar 2017 06:37:35 GMT
Content-Length: 50

{
  "name": "api-faker",
  "msg": "hello world"
}
$ curl -i localhost:32323/created
HTTP/1.1 201 Created
Date: Wed, 29 Mar 2017 06:37:48 GMT
Content-Length: 7
Content-Type: text/plain; charset=utf-8

created%
```

