# dsh-context-meter

把「上下文用量圆环」从输入卡片下方独占一行的 dock 搬进输入框工具行，紧挨着
prompt-chips 的闪电按钮。

DeepSeek Harness 自带的 `ContextMeter` 渲染在卡片外单独的一行
（`[data-composer-dock]`）里：哪怕整行只有它一个，也占约 26px 高；而且生成回复
期间它会消失。本插件把那个实例隐藏，改在 `conversation.input.left` 插槽里渲染
一个等价的小单元：

- 同样的圆环 + 百分比，数据来自 `contextPressure` 投影；
- 生成过程中始终可见，位置不会跳；
- 点击展开「系统提示 / 工具 / 对话」的占比明细（`contextBreakdown`），
  并显示 `~已用 / 窗口` 的 token 数。

## 依赖

- 带 Web UI 的 DeepSeek Harness，`engines.dsh` 为 `>=0.2.0-rc.1 || >=0.2.1-rc.1 || >=0.2.2-rc.1`。
- 不依赖其它插件；和 `dsh-prompt-chips` 并排效果最好。

## 安装

```sh
dsh plugin add link:/path/to/dsh-context-meter
```

或手动写进 profile：

```jsonc
// <profile>/package.json
{
  "dependencies": { "dsh-context-meter": "link:/path/to/dsh-context-meter" },
  "dsh": { "profile": { "bundles": ["...", "dsh-context-meter"] } }
}
```

然后刷新页面。

## 维护提示

自带 meter 写死在 InputBar 骨架里、不是插槽 occupant，所以没法用配置搬动。它的
外层 CSS module 类名是 `oSKTwq_root`（`ContextMeter.module.css`），插件隐藏的是
`[data-composer-dock] .oSKTwq_root`。DSH 升级可能改这个前缀——在打包后的 client
bundle 里搜 `ContextMeter.module.css`，改 `client.js` 里的 `SHIPPED_METER_CLASS`。

## 许可证

MIT
