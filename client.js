window.__ModuleLoader__.load({
  id: 'dsh-context-meter',
  factory(require) {
    const React = require('react');
    const ReactDOM = require('react-dom');
    const h = React.createElement;

    const NS = 'context-meter';
    const STYLE_ID = 'dsh-context-meter-style';

    // CSS-module class of the SHIPPED composer meter
    // (@deepseek-ai/dsh-client-ui-conversation, skeleton/ContextMeter.module.css).
    // That component is hard-coded inside the shipped InputBar and is not a slot
    // occupant, so it cannot be re-positioned through configuration: this plugin
    // hides it and renders its own cell into the composer tool row.
    // After a DSH upgrade, re-read the class from the packaged client bundle
    // (search the asar for "ContextMeter.module.css") and update this line.
    const SHIPPED_METER_CLASS = 'oSKTwq_root';

    // Where the plugin puts its own cell: the list slot that already holds the
    // shipped composer controls (attach/permission/plan) and the prompt-chips
    // lightning trigger (order 20). 30 keeps us just right of the lightning.
    const SLOT = 'conversation.input.left';
    const SLOT_ID = 'context-meter';
    const SLOT_ORDER = 30;

    // Ring geometry, copied from the shipped meter so both render identically.
    const RADIUS = 5.5;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    // Marker the headline is split on, so each locale keeps its own word order
    // ("上下文已用 53%" / "53% of context used") while the reading gets its tone.
    const READING_SLOT = '\u0000';
    const PANEL_WIDTH = 264;

    const ZH = {
      'meter.headline': `上下文已用{percent}`,
      'meter.system': '系统提示',
      'meter.tools': '工具',
      'meter.messages': '对话',
      'meter.title': '上下文用量 · 点击查看明细',
    };

    const EN = {
      'meter.headline': `{percent} of context used`,
      'meter.system': 'System prompt',
      'meter.tools': 'Tools',
      'meter.messages': 'Conversation',
      'meter.title': 'Context usage · click for the breakdown',
    };

    // Legend rows, in bar-segment order.
    const ROWS = [
      {
        key: 'systemTokens',
        label: 'meter.system',
        seg: 'dsh-cm__seg--system',
        swatch: 'dsh-cm__swatch--system',
      },
      { key: 'toolsTokens', label: 'meter.tools', seg: 'dsh-cm__seg--tools', swatch: 'dsh-cm__swatch--tools' },
      {
        key: 'messageTokens',
        label: 'meter.messages',
        seg: 'dsh-cm__seg--messages',
        swatch: 'dsh-cm__swatch--messages',
      },
    ];

    function css() {
      return `
/* The shipped meter keeps its own row under the card. Hide it there and drop the
   row's reserved height so the composer loses ~26px. Both selectors are scoped to
   the dock, so the header meter (if any) and the tool-row cell stay untouched. */
[data-composer-dock] .${SHIPPED_METER_CLASS} { display: none !important; }
[data-composer-dock] { min-height: 0 !important; padding-top: 0 !important; }

.dsh-cm { display: inline-flex; align-items: center; }
.dsh-cm__trigger {
  display: inline-flex; align-items: center; gap: 5px;
  height: 24px; padding: 0 6px; border: none; border-radius: 6px;
  background: transparent; color: var(--dsw-alias-label-tertiary);
  font: inherit; font-size: 12px; line-height: 16px; cursor: pointer;
  font-variant-numeric: tabular-nums; white-space: nowrap;
  transition: background-color 0.12s ease, color 0.12s ease;
}
.dsh-cm__trigger:hover,
.dsh-cm__trigger[aria-expanded="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
}
.dsh-cm__trigger:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.dsh-cm__track { fill: none; stroke: var(--dsw-alias-border-l3); stroke-width: 2px; }
.dsh-cm__fill { fill: none; stroke: currentColor; stroke-width: 2px; stroke-linecap: round; }

.dsh-cm__panel {
  position: fixed; z-index: 1100; box-sizing: border-box;
  width: ${PANEL_WIDTH}px; padding: 10px 12px 11px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-lg);
  background: var(--dsw-specific-menu);
  box-shadow: var(--dsw-elevation-prominent);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px; line-height: 16px;
}
.dsh-cm__head { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
.dsh-cm__headline { color: var(--dsw-alias-label-secondary); }
.dsh-cm__percent {
  color: var(--dsw-alias-label-primary);
  font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums;
}
.dsh-cm__figures {
  margin-left: auto; color: var(--dsw-alias-label-tertiary);
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.dsh-cm__bar {
  display: flex; height: 6px; margin: 8px 0 2px; gap: 2px;
  border-radius: 3px; overflow: hidden; background: var(--dsw-alias-border-l3);
}
.dsh-cm__seg { height: 100%; flex: none; background: var(--dsw-alias-label-tertiary); }
.dsh-cm__seg--system { background: var(--dsw-static-neutral-bluish-400); }
.dsh-cm__seg--tools { background: #a78bfa; }
.dsh-cm__seg--messages { background: var(--dsw-static-blue-450); }
.dsh-cm__rows { margin: 6px 0 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.dsh-cm__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dsh-cm__row dt { display: flex; align-items: center; color: var(--dsw-alias-label-secondary); }
.dsh-cm__row dd {
  margin: 0; color: var(--dsw-alias-label-primary);
  font-variant-numeric: tabular-nums;
}
.dsh-cm__swatch {
  display: inline-block; width: 8px; height: 8px; margin-right: 6px;
  border-radius: 2px;
}
.dsh-cm__swatch--system { background: var(--dsw-static-neutral-bluish-400); }
.dsh-cm__swatch--tools { background: #a78bfa; }
.dsh-cm__swatch--messages { background: var(--dsw-static-blue-450); }
`;
    }

    function installStyles() {
      let el = document.getElementById(STYLE_ID);
      if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        document.head.appendChild(el);
      }
      el.textContent = css();
    }

    function removeStyles() {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    }

    /** Compact token count: 940, 1.2K, 556K, 1.0M. */
    function formatTokens(value) {
      const scaled = (candidate) =>
        candidate >= 100 ? String(Math.round(candidate)) : String(Math.round(candidate * 10) / 10);
      if (!Number.isFinite(value) || value < 0) return '0';
      if (value < 1e3) return String(Math.round(value));
      if (value < 1e6) return `${scaled(value / 1e3)}K`;
      return `${scaled(value / 1e6)}M`;
    }

    /**
     * Occupancy of the NEXT request against the route's declared window. Mirrors
     * the shipped rule: prefer the projected size (provider sample plus the
     * heuristic delta since it), fall back to the raw provider figure.
     */
    function occupancy(pressure) {
      if (pressure === undefined || pressure === null) return null;
      const used = pressure.projectedTokens ?? pressure.pressureTokens;
      const window = pressure.contextWindow;
      if (typeof used !== 'number' || typeof window !== 'number' || !(window > 0)) return null;
      return { percent: Math.min(100, Math.round((used / window) * 100)), used, window };
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'context-meter: dictionaries');
        installStyles();
        ctx.effect(() => () => removeStyles(), 'context-meter: styles');

        function useTranslate() {
          const [, force] = React.useState(0);
          React.useEffect(() => ctx.locale.subscribe(() => force((n) => n + 1)), []);
          return ctx.locale.bind(NS);
        }

        function Meter(props) {
          const useProjection = props.useProjection;
          const t = useTranslate();
          const pressure = useProjection('contextPressure');
          const breakdown = useProjection('contextBreakdown');
          const [open, setOpen] = React.useState(false);
          const [anchor, setAnchor] = React.useState(null);
          const triggerRef = React.useRef(null);
          const panelRef = React.useRef(null);

          const context = occupancy(pressure);
          const available = context !== null;

          React.useEffect(() => {
            if (!open) return undefined;
            const onPointerDown = (event) => {
              if (panelRef.current !== null && panelRef.current.contains(event.target)) return;
              if (triggerRef.current !== null && triggerRef.current.contains(event.target)) return;
              setOpen(false);
            };
            const onKeyDown = (event) => {
              if (event.key === 'Escape') setOpen(false);
            };
            const onResize = () => setOpen(false);
            window.addEventListener('pointerdown', onPointerDown, true);
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('resize', onResize);
            return () => {
              window.removeEventListener('pointerdown', onPointerDown, true);
              window.removeEventListener('keydown', onKeyDown);
              window.removeEventListener('resize', onResize);
            };
          }, [open]);

          // A provider that stops reporting pressure must not leave a stale panel.
          React.useEffect(() => {
            if (!available && open) setOpen(false);
          }, [available, open]);

          if (context === null) return null;

          const percent = context.percent;
          const reading = `${percent}%`;
          const [headBefore = '', headAfter = ''] = t('meter.headline', { percent: READING_SLOT })
            .split(READING_SLOT)
            .map((part) => part.trim());
          const label = [headBefore, reading, headAfter].filter((part) => part.length > 0).join(' ');

          const toggle = () => {
            if (open) {
              setOpen(false);
              return;
            }
            const trigger = triggerRef.current;
            const rect = trigger === null ? null : trigger.getBoundingClientRect();
            if (rect !== null) {
              const maxLeft = Math.max(8, window.innerWidth - PANEL_WIDTH - 12);
              setAnchor({
                left: Math.min(Math.max(12, rect.left), maxLeft),
                bottom: Math.min(window.innerHeight - 12, window.innerHeight - rect.top + 8),
              });
            } else {
              setAnchor({ left: 12, bottom: 12 });
            }
            setOpen(true);
          };

          const total =
            breakdown === undefined
              ? 0
              : (breakdown.systemTokens ?? 0) + (breakdown.toolsTokens ?? 0) + (breakdown.messageTokens ?? 0);
          const segments =
            breakdown === undefined || total <= 0
              ? [{ key: 'all', cls: '', width: percent }]
              : ROWS.map((row) => ({
                  key: row.key,
                  cls: row.seg,
                  width: (percent * (breakdown[row.key] ?? 0)) / total,
                })).filter((segment) => segment.width > 0);

          const panel =
            open && anchor !== null
              ? ReactDOM.createPortal(
                  h(
                    'div',
                    {
                      ref: panelRef,
                      className: 'dsh-cm__panel',
                      role: 'dialog',
                      'aria-label': label,
                      style: { left: `${anchor.left}px`, bottom: `${anchor.bottom}px` },
                    },
                    h(
                      'div',
                      { className: 'dsh-cm__head' },
                      headBefore === '' ? null : h('span', { className: 'dsh-cm__headline' }, headBefore),
                      h('span', { className: 'dsh-cm__percent' }, reading),
                      headAfter === '' ? null : h('span', { className: 'dsh-cm__headline' }, headAfter),
                      h(
                        'span',
                        { className: 'dsh-cm__figures' },
                        `~${formatTokens(context.used)} / ${formatTokens(context.window)}`,
                      ),
                    ),
                    h(
                      'div',
                      { className: 'dsh-cm__bar' },
                      segments.map((segment) =>
                        h('div', {
                          key: segment.key,
                          className: segment.cls === '' ? 'dsh-cm__seg' : `dsh-cm__seg ${segment.cls}`,
                          style: { width: `${segment.width}%` },
                        }),
                      ),
                    ),
                    breakdown === undefined || total <= 0
                      ? null
                      : h(
                          'dl',
                          { className: 'dsh-cm__rows' },
                          ROWS.map((row) =>
                            h(
                              'div',
                              { className: 'dsh-cm__row', key: row.key },
                              h(
                                'dt',
                                null,
                                h('span', {
                                  className: `dsh-cm__swatch ${row.swatch}`,
                                  'aria-hidden': 'true',
                                }),
                                t(row.label),
                              ),
                              h('dd', null, `~${formatTokens(breakdown[row.key] ?? 0)}`),
                            ),
                          ),
                        ),
                  ),
                  document.body,
                )
              : null;

          return h(
            'span',
            { className: 'dsh-cm', 'data-context-meter': true },
            h(
              'button',
              {
                ref: triggerRef,
                type: 'button',
                className: 'dsh-cm__trigger',
                title: `${t('meter.title')} · ${label}`,
                'aria-label': label,
                'aria-haspopup': 'dialog',
                'aria-expanded': open ? 'true' : 'false',
                onClick: toggle,
              },
              h(
                'svg',
                { viewBox: '0 0 14 14', width: 14, height: 14, 'aria-hidden': 'true', focusable: 'false' },
                h('circle', { className: 'dsh-cm__track', cx: 7, cy: 7, r: RADIUS }),
                h('circle', {
                  className: 'dsh-cm__fill',
                  cx: 7,
                  cy: 7,
                  r: RADIUS,
                  strokeDasharray: `${(CIRCUMFERENCE * percent) / 100} ${CIRCUMFERENCE}`,
                  transform: 'rotate(-90 7 7)',
                }),
              ),
              h('span', null, reading),
            ),
            panel,
          );
        }

        // Guard before touching hooks so an older client without projections
        // renders nothing instead of throwing.
        function SafeMeter(props) {
          if (typeof props.useProjection !== 'function') return null;
          return h(Meter, { useProjection: props.useProjection });
        }

        ctx.slots.inject(SLOT, () =>
          ctx.slots.register({ name: SLOT, id: SLOT_ID, order: SLOT_ORDER }, SafeMeter),
        );
      },
    };
  },
});
