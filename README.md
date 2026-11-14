# dsh-context-meter

The context-occupancy ring, moved out of the dock row under the composer card and
into the composer tool row — right beside the prompt-chips lightning trigger.

The shipped DeepSeek Harness UI renders its `ContextMeter` in its own row below the
composer card (`[data-composer-dock]`), where it takes ~26px of vertical space even
when it is the only thing in that row, and disappears while a turn is running.
This plugin hides that instance and renders an equivalent cell in the
`conversation.input.left` slot instead:

- the same ring and percentage, fed by the `contextPressure` projection;
- stays visible while generating, so the position never jumps;
- a cumulative **cache-hit badge** (e.g. `缓存命中 96%`) beside the reading, from the `tokenUsage` projection, with a token-breakdown tooltip;
- clicking opens the system prompt / tools / conversation breakdown
  (`contextBreakdown`), with `~used / window` in tokens.

The shipped dock row below the composer card (context meter plus the
`activity` / `usage` stat pills) is hidden — its facts now live in the tool
row and the header clock.

## Requirements

- DeepSeek Harness with the Web UI, `engines.dsh` `>=0.2.0-rc.1 || >=0.2.1-rc.1 || >=0.2.2-rc.1`.
- No other plugin required. Works well next to `dsh-prompt-chips`.

## Install

```sh
dsh plugin add link:/path/to/dsh-context-meter
```

or add it to the profile by hand:

```jsonc
// <profile>/package.json
{
  "dependencies": { "dsh-context-meter": "link:/path/to/dsh-context-meter" },
  "dsh": { "profile": { "bundles": ["...", "dsh-context-meter"] } }
}
```

then refresh the page.

## Maintenance note

The shipped meter is hard-coded inside the InputBar skeleton and is not a slot
occupant, so it cannot be moved through configuration. Its wrapper carries the
CSS-module class `oSKTwq_root` (`ContextMeter.module.css`); the plugin hides
`[data-composer-dock] .oSKTwq_root`. A DSH upgrade may rename that prefix — search
the packaged client bundle for `ContextMeter.module.css` and update
`SHIPPED_METER_CLASS` in `client.js`.

## License

MIT
