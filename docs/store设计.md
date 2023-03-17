# store 设计

## state

### tabbar

- 保存自定义 tabbar 设置

### share

- 保存用户本次的分享来源

```js
{
    mid:'分享人的会员 id',
    source:'入口方式，如小程序码/分享卡片消息',
    eid:'导购员/分销员 id',
    sid:'销售店铺 id',
    shop:'销售店铺名称',
    tid:'商户 id',
    tenant:'商户名称',
}
```

### user

```js
{
    member:'用户自己的会员信息',
    token:'token',
    openId:'openId',
    balance:'用户的钱包余额',
}
```

### nocache

- 一些不会持久化存储的 state

## getters

### isLogged

- 用户当前是否是登录状态

### isDistributer

- 用户当前是否是分销员，当 member 的 bindingMemberId 和 id 相等是就是分销员

### balance

- 用户的钱包余额

## mutations

| 方法           | 含义                                  |
| -------------- | ------------------------------------- |
| SET_TOKEN      | 设置 token                            |
| SET_OPENID     | 设置 openId                           |
| SET_BALANCE    | 设置 balance                          |
| SET_MEMBER     | 设置 member                           |
| SET_USER       | 退出登录，重置 token, balance, member |
| SET_SHARE_INFO | 设置 share                            |
|                |                                       |
