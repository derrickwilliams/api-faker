# API Faker

根据YAML配置文件，快速创建一个Mock Server。

- 监听配置文件，自动刷新
- 根据文件MIME类型设置`Content-Type`

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
- `file`：使用该文件内容作为响应体

对于每一个请求，会使用`path, method, query`进行匹配。

## 示例

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

