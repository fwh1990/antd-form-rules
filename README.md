## 安装
```bash
yarn add antd-form-rules

# 或者

npm install antd-form-rules --save
```

## 使用

```javascript
import { FormRules } from 'antd-form-rules';

getFieldDecorator('id', {
   rules: FormRules.withName('字段名').isRequired().create(),
});
```

## 方法介绍
#### withName(fileName: string)
规则必须先初始化才能做链式调用
```javascript
FormRules.withName('字段');
```

#### create()
生成的规则由该方法统一转换为antd需要的格式
```javascript
FormRules.withName('字段').create();
```

#### isRequired(onlyWhiteSpaceIsError = true)
通用方法，用于强调前一个规则是必填的，不能跳过。
```javascript
FormRules.withName('字段')
    .string(1, 15).isRequired()
    .match(/\w+/).isRequired()
    .create();

FormRules.withName('字段').string().isRequired().create();
```

如果isRequired前面没有规则，那么会默认添加一个string()的规则
```javascript
FormRules.withName('字段').isRequired().create();
// 等于
FormRules.withName('字段').string().isRequired().create();
```

#### string(min?: number, max?: number, message?: string)
字符串规则，可自定义长度

```javascript
FormRules.withName('字段').string().create();
FormRules.withName('字段').string(1, 15).create();
FormRules.withName('字段').string(20).create();
FormRules.withName('字段').string(undefined, 20).create();
```

#### bool(message?: string)
布尔值规则，常用于Radio

#### array(message?: string)
数组规则

#### phone(message?: string)
国内11位手机号

#### number(min?: number, max?: number, message?: string)
数字，包括小数、整数、负数、正数

```javascript
FormRules.withName('字段').number().create();
FormRules.withName('字段').number(0.01, 1).create();
FormRules.withName('字段').number(0).create();
FormRules.withName('字段').number(undefined, 5).create();
```

#### integer(min?: number, max?: number, message?: string)
只能是整数

```javascript
FormRules.withName('字段').integer().create();
FormRules.withName('字段').integer(1).create();
FormRules.withName('字段').integer(1, 5).create();
FormRules.withName('字段').integer(undefined, 5).create();
```

#### email(message?: string)
邮箱号规则

#### match(pattern: RegExp, message?: string)
正则匹配
```javascript
FormRules.withName('字段').match(/\w\s*\w/).isRequired().create();
```

#### url(message?: string)
超链接规则

#### callback(fn: Function)
自定义规则

```javascript
FormRules.withName('字段').callback((value, field) => {
   if (value !== '孙悟空') {
       return new Error('这个是六耳猕猴');
   }
}).create();
```

#### identityCard(message?: string)
第二代身份证

#### append(obj)
如果以上规则都不能满足你，那么可以用这个append直接添加antd的原生规则。或者欢迎issue
```javascript
import { FormRuleType } from 'antd-form-rules';

FormRules.withName('字段').string().append({ required: true, type: FormRuleType.object }).create();
```
