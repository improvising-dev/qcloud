## QCloud

A Tecent Cloud API Client

## Example

```js
import { QCloud } from '@improvising/qcloud'

const client = new QCloud({
  Region: 'ap-guangzhou',
  SecretId: 'Please input your SecretId',
  SecretKey: 'Please input your SecretKey',
  Token: 'Please input your Token',
  ServiceType: 'tmt',
})

const res = await client.request(
  {
    Action: 'TextTranslate',
    Version: '2018-03-21',
    SourceText: 'hello',
    Source: 'auto',
    Target: 'zh',
    ProjectId: 0,
  },
  {
    host: 'tmt.tencentcloudapi.com',
  },
)

console.log(res)
```
