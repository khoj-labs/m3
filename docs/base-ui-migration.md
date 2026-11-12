# Radix to Base UI migration

Goal: move as many components as possible from Radix UI to Base UI, but only where the Base UI version looks, feels and behaves the same as the Radix version, and document the reason for every component that cannot move. This page is the record. It was written from the per-component result files in `factory/results/` and nothing else; `factory/tasks.json` is the plan that produced them.

## Result

| Outcome | Count |
| --- | --- |
| Migrated to Base UI | 9 |
| No change needed (Radix and Base UI files are identical) | 6 |
| Kept on Radix | 21 |

`combobox` was already on Base UI (Radix has no combobox primitive), so it had no task. Because 21 components stay on Radix, `radix-ui` remains a dependency and m3 uses two primitive libraries for now.

**Migrated:** `avatar`, `badge`, `breadcrumb`, `input-group`, `input`, `list`, `paper`, `toggle`, `typography`.

**No change needed:** `alert`, `card`, `skeleton`, `sonner`, `table`, `textarea`. These have no primitive; the Radix and Base UI registry files are identical.

## How each component was tested

Each component had its own worker, in its own git worktree, following `factory/WORKER.md`:

1. **Safety check.** Search GitHub issues (`mui/base-ui`, `shadcn-ui/ui`) for people who hit problems moving that component from Radix to Base UI. A high-severity open finding stops the task.
2. **Baseline.** Record the live Radix build at https://m3.khojlabs.com/gallery.
3. **Switch** using the shadcn `base-nova` registry file (or by hand for the hand-built components), updating consumers.
4. **Compare** look, feel, interaction, accessibility and API against the baseline. Anything perceptible counts, including things that look like improvements. Mechanical API changes (`asChild` to `render`, `type="single"` to `multiple`, handler signatures) do not.
5. **Decide.** No difference: migrate. Any difference: leave the component on Radix and write down what differed.

A final sweep then compared every section of all three gallery tabs and the iframe demos against the Radix site to catch indirect changes.

### Limits of the evidence

- **Dark mode only.** The test browser follows the system preference and could not emulate light mode, so light mode was not compared for any component.
- **No mobile width.** The browser window could not be resized during the runs, so 390px layouts were never compared.
- **Safety search was GitHub only.** Reddit, Hacker News and blogs were not searched. Several workers read issue-list titles rather than issue bodies; those are marked in the result files.
- **The final sweep was static.** It hashed tags, attributes, computed styles and boxes for every section and found no perceptible difference. Only the toggle was exercised interactively, so hover, popups and keyboard behaviour of the migrated components outside their own sections are not fully verified.
- Several workers stopped at the first difference they found, so a flagged component can have more differences than the ones listed.

## Kept on Radix

| Component | Safety | Why it did not move |
| --- | --- | --- |
| `accordion` | high | A disabled item renders at full opacity with hover feedback (the base-nova file styles `aria-disabled:` but Base UI 1.9 emits native `disabled`). |
| `bottom-navigation` | low | Disabled tabs stay focusable and lose their dimmed look; tablist `tabindex` and `aria-controls` wiring change. |
| `button` | low | Base UI defaults to `type="button"` (Radix emits no `type`, so it submits inside a form), and the base-nova file drops `asChild`. |
| `checkbox` | high | Stopped at the safety check: open shadcn issue about Base UI checkboxes not being labeled correctly inside a `Label`. |
| `collapsible` | low | Base UI unmounts the closed panel, so the demo is 8px shorter and everything below shifts up. |
| `dialog` | medium | Base UI scroll lock leaves `scrollbar-gutter: stable`: the dialog sits about 7px off-centre and the backdrop is short of full width; page hiding differs. |
| `dropdown-menu` | high | `DropdownMenuLabel` outside a `DropdownMenuGroup` throws and blanks the page (reproduced); body `pointer-events` differs. |
| `fab` | low | Base UI renders `type="button"`; Radix emits no `type`. This is the only difference found. |
| `label` | none | Radix suppresses text selection on double-click; the base-nova label is a plain `<label>` and does not. |
| `pagination` | medium | Blocked by `button`: the base-nova file needs Button `render` and `nativeButton`, which the Radix Button does not have. |
| `popover` | medium | After an outside click Base UI returns focus to the trigger (Radix leaves it on the body); transform origin differs by 4px. |
| `progress` | low | Base UI adds `aria-valuenow` and `aria-valuetext`, and nests Root, Track and Indicator so `className` lands on the wrapper instead of the bar. |
| `radio-group` | high | Disabled radios render at full opacity; Tab lands on a disabled checked radio; End does nothing; `span[role=radio]` replaces the native button. |
| `select` | medium | The closed trigger shows the raw value ("apple") instead of its label, and ArrowDown highlights a disabled item. |
| `separator` | low | Base UI always renders `role="separator"`; Radix renders `role="none"` for decorative dividers, so screen readers would newly announce every divider. |
| `sheet` | medium | Same scrollbar-gutter shift as the dialog (overlay 15px short, side sheets 364px instead of 375px) and different animation timing. |
| `slider` | medium | `className` lands on an outer Root and the layout classes on an inner Control, so `w-48` and `h-24` stop applying; thumb semantics differ. |
| `switch` | medium | Base UI renders `<span role="switch">` plus a hidden sibling input where Radix renders `<button role="switch">`; open upstream label-naming reports. |
| `tabs` | medium | Arrow keys only move focus (Radix also selects), and disabled tabs stay focusable. |
| `toggle-group` | medium | Single mode loses `radiogroup` and `radio` semantics (becomes `group` and `aria-pressed`); multiple mode loses `toolbar`. |
| `tooltip` | medium | Content sits 4 to 6px closer to the trigger, no `role=tooltip` or `aria-describedby`, and every tooltip animates instead of only the first. |

### Patterns

- **Disabled handling.** Base UI marks some disabled parts with `aria-disabled` and keeps them focusable, where Radix uses the native `disabled` attribute. The shadcn `disabled:` classes then never match, so disabled items look enabled and stay in the tab order (`accordion`, `radio-group`, `tabs`, `bottom-navigation`).
- **Scroll lock.** Base UI modals lock scroll with `scrollbar-gutter: stable`, which shifts layout by the scrollbar width (`dialog`, `sheet`). Upstream: `shadcn-ui/ui#12107`.
- **Default button `type`.** Base UI buttons render `type="button"`; Radix buttons have no `type` and submit inside a form (`button`, `fab`). Nothing in the repo puts either in a form, so this is the least harmful reason on the list.
- **Semantics.** Several Base UI parts render different roles or DOM than Radix (`separator`, `switch`, `checkbox`, `toggle-group`, `tooltip`). Screen-reader output changes even where pixels do not.
- **Wrapper structure.** Some base-nova files add wrapper elements, so `className` lands in a different place and existing sizing classes stop applying (`slider`, `progress`).

### Per component

#### `accordion`

**Reason:** With @base-ui/react 1.9.x the shadcn base-nova accordion trigger styles disabled via aria-disabled:, but Base UI now sets the native disabled attribute, so the Disabled item in the gallery renders at full opacity with hover underline instead of Radix's 0.5 opacity (https://github.com/shadcn-ui/ui/issues/12582). Retry once the base-nova registry file uses disabled: or data-disabled: classes (PR https://github.com/shadcn-ui/ui/pull/12585), then re-run the full comparison including the animation height variable, keyboard and 390x844.

Differences found:

- **look** (Disabled item (third item of the first accordion)): Radix: Radix: trigger opacity 0.5, pointer-events none, no hover underline Base UI: Base UI: trigger has native disabled and data-disabled but the base-nova classes use aria-disabled:, so opacity 1 and pointer-events auto; looks enabled and shows hover underline

Upstream reports:

- [shadcn-ui/ui/issues/12582](https://github.com/shadcn-ui/ui/issues/12582) (open, high): shadcn base-nova accordion trigger styles disabled with aria-disabled:, but @base-ui/react 1.9.0 (mui/base-ui#5607) renders the native disabled attribute, so a disabled item looks enabled (…

#### `bottom-navigation`

**Reason:** Base UI Tabs keeps disabled tabs focusable (aria-disabled, no native disabled), so arrow keys and End land on the disabled item, a focus ring appears on it, and with the current classes it loses its 0.4 opacity and pointer-events:none. Roving tabindex and ARIA attributes also differ from Radix (tablist tabindex, aria-controls, disabled attribute). Retry if Base UI offers a skip-disabled option (or the project accepts disabled-but-focusable) and item styling is moved to data-disabled: classes, then re-run keyboard and screenshot comparison at 1280x900 and 390x844, including the gallery mobile tab bar.

Differences found:

- **interaction** (disabled item (gallery demo 'Disabled')): Radix: Radix renders a native disabled attribute; arrow keys and End skip the item Base UI: Base UI renders aria-disabled=true only; arrow keys and End move focus onto the disabled item (disabled stays focusable); Enter on it does nothing
- **look** (disabled item): Radix: opacity 0.4, pointer-events none (disabled: variant matches the native attribute) Base UI: opacity 1, pointer-events auto, because the disabled: variant no longer matches; would need data-disabled: classes
- **look** (focus ring on disabled item): Radix: never focusable so no ring Base UI: focus ring drawn around the disabled item when reached by keyboard
- **accessibility** (tablist and tab DOM): Radix: tablist tabindex=0 with all tabs tabindex=-1; tabs carry aria-controls pointing at nonexistent content ids; disabled tab has the disabled attribute Base UI: tablist has no tabindex, selected tab has tabindex=0 (roving), no aria-controls, disabled tab has aria-disabled=true and no disabled attribute, extra data-activation-direction attributes
- **interaction** (wrapping past the disabled item): Radix: ArrowRight from Search lands on Inbox Base UI: sequence includes Disabled; ArrowRight from it wraps to Home

#### `button`

**Reason:** base-nova button.json is not identical to radix-nova: it drops asChild (replaced by render + nativeButton), drops the data-variant/data-size attributes, and Base UI Button defaults to type='button' whereas the live Radix Button has no type attribute (default submit in forms). Verified on https://m3.khojlabs.com/gallery#components and in the @base-ui/react useButton source. See https://base-ui.com/react/components/button and https://shadcnspace.com/docs/getting-started/migrate-to-baseui. Retry if those API changes are accepted as intentional (or the component is patched to keep data-variant/data-size and an explicit type), then run the full visual and interaction comparison.

Differences found:

- **api** (all buttons): Radix: Radix-nova Button renders a plain button with no type attribute (browser default is submit inside a form). Verified on the live reference: type attribute is nu… Base UI: Base UI Button sets type='button' on native buttons (node_modules/@base-ui/react/internals/use-button/useButton.js line 184). Inside a form a Button no longer submits unless type='submit' is passed.
- **api** (all buttons (DOM contract)): Radix: Button renders data-variant and data-size attributes (verified on the reference: data-slot,data-variant,data-size,class). Base UI: base-nova button.json drops data-variant and data-size. No file in src selects on them today, but external CSS or tests would break.
- **api** (asChild consumers (PageHeader, ErrorBoundary, PageNotFound, SpinnerButton)): Radix: asChild prop using Slot.Root. Base UI: asChild removed; consumers need render={<Link />} plus nativeButton={false} for links. Prop type changes from React.ComponentProps<'button'> to ButtonPrimitive.Props.

#### `checkbox`

**Reason:** Safety check found open high-severity issues: shadcn-ui/ui#9357 (base-ui Checkbox has no checked="indeterminate"; our gallery and transfer-list rely on it) and shadcn-ui/ui#9249 (Base UI Checkbox not labeled correctly in forms; every gallery checkbox sits inside a Label). Migrating also requires changing transfer-list.tsx, outside this task's files. Retry once those issues are closed, and allow transfer-list.tsx to be updated with the indeterminate prop.

Differences found:

- **api** (Indeterminate state (gallery #checkbox and transfer-list)): Radix: Radix takes checked="indeterminate" (aria-checked=mixed). Base UI: base-nova checkbox is the Base UI primitive, which uses a separate boolean `indeterminate` prop; checked="indeterminate" is not valid. src/components/ui/transfer-list.tsx also uses it but is outside…

Upstream reports:

- [shadcn-ui/ui/issues/9357](https://github.com/shadcn-ui/ui/issues/9357) (open, high): No 'indeterminate' state in the new base-ui Checkbox (base-nova). Our gallery and transfer-list use checked="indeterminate".
- [shadcn-ui/ui/issues/9249](https://github.com/shadcn-ui/ui/issues/9249) (open, high): Base-UI Checkbox/Switch not labeled correctly in forms. Our gallery wraps every Checkbox in a Label.
- [shadcn-ui/ui/issues/9726](https://github.com/shadcn-ui/ui/issues/9726) (open, medium): Missing disabled style for Checkbox with base-ui.

#### `collapsible`

**Reason:** The base-nova registry file (https://ui.shadcn.com/r/styles/base-nova/collapsible.json) differs from radix-nova, and the swap changes layout: Base UI unmounts the closed panel while Radix keeps it hidden, so the gallery demo is 8px shorter when closed (74px vs 82px) because space-y-2 no longer applies to the row above the panel, and data-state hooks become data-open/data-closed. Retry by passing keepMounted on CollapsibleContent (this keeps the hidden element and should restore the 82px height; untested here) or by accepting the 8px change, and re-run the comparison.

Differences found:

- **look** (Collapsible demo, closed state (default)): Radix: Root is 82px tall. The closed CollapsibleContent stays in the DOM with the hidden attribute, so Tailwind space-y-2 (margin-bottom on :not(:last-child)) still g… Base UI: Root is 74px tall. Base UI unmounts the closed panel, so 'repo/one' becomes the last child and loses the 8px margin. Content below the demo (List section) sits 8px higher. Open state is identical (16…
- **api** (DOM structure of closed panel): Radix: Closed panel div is present with hidden and style --radix-collapsible-content-height/width. Base UI: Closed panel is not rendered at all (keepMounted is false by default); open panel gets --collapsible-panel-height: auto.
- **api** (state attributes): Radix: Root, trigger and panel emit data-state=open|closed. Base UI: Root and panel emit data-open / data-closed; trigger emits data-panel-open when open and nothing when closed. No data-state. Nothing in src selects on data-state for collapsible, but external consume…
- **accessibility** (trigger button): Radix: Trigger has no tabindex attribute. Base UI: Trigger has an explicit tabindex=0 (button type=button and aria-expanded are the same). Behaviour is identical in practice.

#### `dialog`

**Reason:** Base UI's scroll lock keeps scrollbar-gutter: stable on html, so while the dialog is open the viewport is 15px narrower: the dialog is 453px instead of 468px and about 7px off-centre, and the backdrop leaves a strip (also reported upstream as https://github.com/shadcn-ui/ui/issues/12107). Accessibility markup of the page behind the dialog also differs (aria-hidden placement, https://github.com/mui/base-ui/issues/4678). Retry once the scroll-lock gutter issue is fixed or the team accepts the layout shift, and verify the 1280x900 and 390x844 screenshots, which could not be taken here.

Differences found:

- **look** (open dialog, width and centering): Radix: Radix: dialog 468px wide at x=16..484 in a 500px viewport (max-w calc(100%-2rem), centred), page keeps full width Base UI: Base UI: dialog 453px wide at x=16..469, off-centre by about 7px; backdrop 485px wide instead of full width. Base UI scroll lock sets html scrollbar-gutter: stable and body overflow hidden, leaving a…
- **accessibility** (page behind open dialog): Radix: Radix hides siblings with aria-hidden (data-aria-hidden) and the overlay carries aria-hidden Base UI: Base UI uses aria-hidden on different elements (fewer aria-hidden body children) and adds data-base-ui-inert on the backdrop; trigger gets data-base-ui-click-trigger, aria-haspopup, aria-controls, da…
- **accessibility** (dialog content and close button): Radix: no data-base-ui-focusable; close button has no tabindex Base UI: popup has data-base-ui-focusable; close button and trigger have explicit tabindex attributes
- **api** (consumers): Radix: asChild Base UI: render prop; Radix Button works as the render target (typecheck passed)

Upstream reports:

- [shadcn-ui/ui/issues/12107](https://github.com/shadcn-ui/ui/issues/12107) (open, medium): Base UI Dialog/AlertDialog/Sheet leave an unmasked strip where the scrollbar was (same root cause as the width/centering difference seen here)
- [mui/base-ui/issues/4678](https://github.com/mui/base-ui/issues/4678) (open, medium): Modal Dialog applies aria-hidden to background but does not remove focusable elements from tab order

#### `dropdown-menu`

**Reason:** The base-nova DropdownMenuLabel is Menu.GroupLabel, which throws 'MenuGroupContext is missing' unless wrapped in a Group (open upstream: https://github.com/shadcn-ui/ui/issues/9117). Both consumers (gallery demo, UserSettings avatar menu) render a label directly in the content, so the swapped build crashes the entire app on opening the menu; the result is a high safety finding plus a visible difference. Also open: width tied to trigger (https://github.com/shadcn-ui/ui/issues/12330) and translucent blur issue (https://github.com/shadcn-ui/ui/issues/12112). Retry when #9117 is fixed upstream or when the labels are wrapped in DropdownMenuGroup by the consumer (an API change to accept), then recheck the open-trigger look, body pointer-events and UserSettings width.

Differences found:

- **api** (DropdownMenuLabel outside DropdownMenuGroup (gallery demo and UserSettings)): Radix: Label renders anywhere inside the content Base UI: Throws 'Base UI: MenuGroupContext is missing' on opening the menu and unmounts the whole React tree (blank page)
- **look** (Open trigger button): Radix: Trigger keeps its normal outline background while the menu is open Base UI: Trigger looked lighter while open (screenshot with pointer over it; possibly hover plus popup-open state); not isolated
- **interaction** (Page while menu is open): Radix: Radix sets body style pointer-events: none and overflow hidden Base UI: Base UI sets only overflow: hidden on body (outside click still closed the menu and did not trigger the button underneath)
- **look** (DropdownMenuContent width): Radix: Radix nova width is w-(--radix-dropdown-menu-trigger-width) min-w-32, overridden by w-56 in the demo Base UI: base-nova uses w-(--anchor-width) (see shadcn #12330); same in the demo because w-56 overrides, but UserSettings uses only min-w-48 so width could differ

Upstream reports:

- [shadcn-ui/ui/issues/9117](https://github.com/shadcn-ui/ui/issues/9117) (open, high): DropdownMenuLabel (Base UI GroupLabel) throws 'MenuGroupContext is missing' when used outside DropdownMenuGroup. Both the gallery demo and UserSettings put the label directly in the content.
- [shadcn-ui/ui/issues/12330](https://github.com/shadcn-ui/ui/issues/12330) (open, medium): Base UI DropdownMenuContent is styled w-(--anchor-width), fixing width to the trigger width; long items wrap.
- [shadcn-ui/ui/issues/12112](https://github.com/shadcn-ui/ui/issues/12112) (open, medium): Translucent menu preset: backdrop-blur does not paint in Chromium (cn-menu-translucent).

#### `fab`

**Reason:** Base UI useRender adds type="button" to the rendered button while the Radix version emits no type attribute (default submit behaviour). Per WORKER.md 4b a button's default type is a perceptible behavioural difference. Retry if the team accepts type=button as intended (no Fab in the repo sits inside a form), or if Fab is changed to set the type explicitly on both versions first.

Differences found:

- **api** (every Fab (including speed-dial's two Fab usages)): Radix: Radix: <button> has no type attribute, so inside a <form> it defaults to type=submit Base UI: Base UI useRender: <button> renders with type="button", so it never submits a form

#### `label`

**Reason:** base-nova Label is a plain <label> element, not a Base UI primitive, and drops Radix's double-click text-selection prevention (verified by dispatching mousedown with detail=2 on the reference and on the swapped local build). Visuals were identical. Retry if the difference is accepted as tolerable or the base-nova label adds onMouseDown preventDefault for detail > 1.

Differences found:

- **interaction** (Any Label (Email label, Inline label)): Radix: Radix Label calls preventDefault on mousedown when detail > 1, so double-clicking a label does not select its text. Base UI: base-nova Label is a plain <label>; double-click selects the label text (mousedown with detail 2 is not default-prevented).

#### `pagination`

**Reason:** Pagination's only Radix-to-Base change is how it wraps Button (asChild versus render with nativeButton={false}). Button stays on Radix (see C-button), so the Base UI pagination file cannot compile or render against it, and upstream reports Base UI link-as-Button semantics and data-slot hydration bugs (https://github.com/shadcn-ui/ui/issues/11624, https://github.com/shadcn-ui/ui/issues/11489). Retry after Button moves to Base UI and those issues are fixed; the swap is then mechanical.

Differences found:

- **api** (PaginationLink (and Previous/Next, which use it)): Radix: <Button asChild><a .../></Button> using the Radix-based Button. Base UI: base-nova pagination.json differs from radix-nova only in this: <Button nativeButton={false} render={<a .../>} />. Radix Button (kept on Radix by C-button) has no render/nativeButton props, so it wou…
- **accessibility** (PaginationLink anchors): Radix: Plain anchor with aria-current=page. Base UI: Upstream reports Base UI Button on a link adds button semantics (issue 11624). Not verified locally because the swap is not possible without Base UI Button.

Upstream reports:

- [shadcn-ui/ui/issues/11624](https://github.com/shadcn-ui/ui/issues/11624) (open, medium): Base UI transformer gives button semantics to button-styled links (PaginationLink renders an anchor through Button).
- [shadcn-ui/ui/pull/11625](https://github.com/shadcn-ui/ui/pull/11625) (closed, medium): Closed PR 'preserve pagination link semantics' (also 11822), so the base registry file may still lack the fix.

#### `popover`

**Reason:** Outside-click behaviour differs: on Radix focus ends on body after an outside click, on Base UI it returns to the trigger (verified in browser). The popup also positions at half-pixel offsets and its zoom animation origin differs by 4px (128px -4px vs 128px 0px), and the trigger gets tabindex=0 and different state attributes. Retry if Base UI offers a way to not restore focus on outside press and the transform origin can be matched; re-run the comparison then.

Differences found:

- **interaction** (Outside click closes the popover): Radix: After clicking empty page area, popover closes and document.activeElement is BODY (focus is not moved to the trigger). Base UI: After clicking empty page area, popover closes and focus returns to the trigger button (activeElement is the Open popover button).
- **look** (Open popup position and animation origin): Radix: Popup at x=1273,y=191 (integer), transform-origin 128px 0px. Base UI: Popup at x=1272.5,y=191.5 (half-pixel), transform-origin 128px -4px (offset by sideOffset), so the zoom-in-95 animation starts from a point 4px different. Static screenshots look identical.
- **accessibility** (Trigger and popup attributes): Radix: Trigger has data-state=open|closed, no tabindex; popup in a fixed wrapper div. Base UI: Trigger has explicit tabindex=0, data-popup-open and data-pressed while open instead of data-state; popup wrapped in a Positioner div role=presentation inside a portal container. Focus moves into the…
- **api** (base-nova popover.tsx): Radix: Exports PopoverAnchor; PopoverTitle renders a div. Base UI: No PopoverAnchor export (unused in src); PopoverTitle renders a real heading via PopoverPrimitive.Title; extra side/alignOffset props on Content.

Upstream reports:

- [mui/base-ui/issues/6169](https://github.com/mui/base-ui/issues/6169) (open, medium): Removing the focused element leaves focus on body in Firefox and WebKit (popups).

#### `progress`

**Reason:** Visual output matches, but Base UI's Progress adds aria-valuenow/aria-valuetext (the Radix reference omits them because the wrapper never forwards value) and restructures the component into Root > Track > Indicator with className moving to the outer wrapper and the indicator animating width instead of transform, so screen-reader output and API both differ (base-nova registry file https://ui.shadcn.com/r/styles/base-nova/progress.json). Retry if the accessibility change is accepted as an intended improvement and the wrapper is adjusted to keep className on the track.

Differences found:

- **accessibility** (all four Progress bars (0/35/70/100)): Radix: role=progressbar with aria-valuemin/aria-valuemax only; no aria-valuenow or aria-valuetext, because the m3 wrapper destructures `value` and never forwards it t… Base UI: Base UI exposes aria-valuenow (0/35/70/100) and aria-valuetext ("35%" etc.) plus data-progressing/data-complete. Screen readers would announce a value where the reference announces none. Looks like a…
- **api** (Progress DOM structure and exports): Radix: Single Root (the track: relative flex h-1 ... bg-muted) containing one Indicator slid with translateX(-(100-value)%). Base UI: base-nova file renders Root (flex flex-wrap gap-3) > Track (h-1 bg-muted) > Indicator (width driven by Base UI), adds children slot and new exports ProgressTrack, ProgressIndicator, ProgressLabel, Pr…

#### `radio-group`

**Reason:** Base UI's radio group differs from Radix in ways a user sees and feels: disabled radios render at full opacity with a default cursor (the registry's disabled: classes do not match Base UI's aria-disabled span), Tab lands on a disabled group's checked radio (open upstream bug https://github.com/mui/base-ui/issues/6179, fix PR https://github.com/mui/base-ui/pull/6193), and the End key does nothing (https://github.com/mui/base-ui/issues/6100). Retry once #6179 and #6100 are released and the component's disabled styling uses data-disabled / aria-disabled selectors, then re-run the gallery comparison.

Differences found:

- **look** (Disabled item ('Disabled') and disabled group ('Group disabled')): Radix: Disabled radios render at 50% opacity with cursor not-allowed (the disabled: variant matches the button's disabled attribute). Base UI: Base UI renders a span with aria-disabled and data-disabled, so the disabled: classes never apply; computed opacity is 1 and cursor is default. Disabled radios look fully enabled.
- **interaction** (Tab order, 'Group disabled' radio group): Radix: Tab skips the disabled group (order: group 1, group 2, Invalid group, then the select). Base UI: The disabled group's checked radio is a tab stop and receives focus (upstream issue mui/base-ui#6179).
- **interaction** (Vertical group, End key): Radix: End moves focus to the last enabled radio (and selects it). Base UI: End does nothing; focus and selection stay put (upstream issue mui/base-ui#6100).
- **accessibility** (All radios): Radix: button[role=radio] with aria-checked, data-state, native disabled attribute for disabled items, group is tabindex 0 with aria-required false. Base UI: span[role=radio] plus a sibling hidden input type=radio; aria-labelledby points at the hidden input's label; disabled items use aria-disabled instead of the disabled attribute; roving tabindex on spa…

Upstream reports:

- [mui/base-ui/issues/6179](https://github.com/mui/base-ui/issues/6179) (open, high): A disabled checked radio becomes the only tab stop, so Tab skips the group. Fix PR https://github.com/mui/base-ui/pull/6193 is open. The gallery's 'Group disabled' demo (disabled group with…
- [mui/base-ui/issues/6100](https://github.com/mui/base-ui/issues/6100) (open, medium): Base UI RadioGroup has no Home/End key support; Radix moves to the last/first enabled radio.

#### `select`

**Reason:** Base UI Select (shadcn base-nova) is visibly different: the closed trigger shows the raw value ('apple') instead of the item label ('Apple'), the popup sits ~1px off, and ArrowDown can highlight disabled items where Radix skips them. Safety: open Base UI issue on VoiceOver navigation (https://github.com/mui/base-ui/issues/5934) and open shadcn base-style issues (https://github.com/shadcn-ui/ui/issues/12520, https://github.com/shadcn-ui/ui/issues/10543). Retry after adding label mapping (items prop on Root or SelectValue render function in consumers and the gallery demo), matching disabled-item behaviour, and re-verifying Escape/focus return and the 390x844 viewport.

Differences found:

- **look** (Closed trigger with a selected value (first select, defaultValue=apple)): Radix: Trigger shows the item label 'Apple' Base UI: Trigger shows the raw value 'apple' (Base UI SelectValue renders the value unless Root gets an items prop or SelectValue a render function)
- **look** (Open popup position): Radix: Selected item row at y=192 over the trigger Base UI: Rows about 1px higher (y=191)
- **interaction** (Keyboard in open popup with a disabled item): Radix: ArrowDown skips disabled 'Cherry (disabled)'; highlight stays on Banana Base UI: Highlight reaches the disabled Cherry item (Base UI keeps disabled items focusable by default)
- **interaction** (Escape and focus return): Radix: Popup closes on Escape Base UI: Popup still reported open after Escape in my run (may be a tool artifact; not confirmed)
- **accessibility** (Trigger DOM/ARIA attributes): Radix: Radix button role=combobox with data-state Base UI: Different attribute set; full accessibility tree diff not checked

Upstream reports:

- [mui/base-ui/issues/5934](https://github.com/mui/base-ui/issues/5934) (open, medium): Arrow Down does not continue from VoiceOver cursor position in Safari (Select)
- [shadcn-ui/ui/issues/12520](https://github.com/shadcn-ui/ui/issues/12520) (open, medium): Highlighted SelectItem contrast 1.09:1 light / 1.18:1 dark in base styles
- [shadcn-ui/ui/issues/10543](https://github.com/shadcn-ui/ui/issues/10543) (open, medium): Select popup horizontally misaligned across base styles

#### `separator`

**Reason:** Base UI's Separator always exposes role="separator" with aria-orientation and has no decorative prop, while the Radix reference (decorative default true) renders role="none", so assistive tech would newly announce every divider in the gallery (source: node_modules/@base-ui/react/separator/Separator.js v1.9.0; docs https://mintlify.wiki/mui/base-ui/components/separator). Retry once Base UI offers decorative semantics, or if a manual role="none" override in the wrapper is approved.

Differences found:

- **accessibility** (all Separator instances (horizontal and vertical)): Radix: Radix default decorative=true renders role="none" with no aria-orientation (read from the live reference DOM: 3 separators, all role=none). Base UI: Base UI Separator (node_modules/@base-ui/react/separator/Separator.js, v1.9.0) always renders role="separator" and aria-orientation=<orientation>; screen readers would announce a separator where the…
- **api** (Separator props): Radix: Accepts decorative (default true) forwarded to Radix. Base UI: Base UI has no decorative prop; the base-nova file drops it. Decorative behaviour would need a manual role="none" override.

#### `sheet`

**Reason:** Base UI's scroll lock leaves scrollbar-gutter: stable on html, so while any sheet is open the viewport is 15px narrower: the overlay leaves a 15px strip, top/bottom sheets are 485px instead of 500px, side sheets are 3/4 of the narrower width, and the close button shifts left (upstream: https://github.com/shadcn-ui/ui/issues/12107, https://github.com/mui/base-ui/issues/4645). Attribute differences on trigger and close button and unconfirmed animation timing are secondary. Retry once the gutter issue is fixed or the team accepts the layout shift, and verify at 1280x900 and 390x844.

Differences found:

- **look** (every open sheet (top, right, bottom, left): width and layout): Radix: Radix: page keeps full viewport width while the sheet is open (clientWidth 500 in a 500px viewport); overlay 500 wide; top/bottom sheets 500 wide; right sheet… Base UI: Base UI: scroll lock sets html scrollbar-gutter: stable and body overflow hidden, so clientWidth is 485 while open; overlay 485 wide leaving a 15px unmasked strip; top/bottom sheets 485 wide; right s…
- **accessibility** (trigger and close button attributes): Radix: trigger has data-state; close button has no tabindex Base UI: trigger gets data-base-ui-click-trigger, data-popup-open, tabindex; close button has tabindex 0
- **feel** (enter animation): Radix: Radix: tailwind animate-in keyframes (fade-in plus slide-in-from-*-10) Base UI: Base UI: CSS transition 200ms ease-in-out, starting-style fade plus 40px translate; overlay transition-opacity 150ms instead of 100ms keyframe fade. Reference frame timing could not be sampled (page…

Upstream reports:

- [shadcn-ui/ui/issues/12107](https://github.com/shadcn-ui/ui/issues/12107) (open, medium): Dialog/AlertDialog/Sheet (Base UI): unmasked strip where the scrollbar was while the modal is open; reproduced here
- [mui/base-ui/issues/4645](https://github.com/mui/base-ui/issues/4645) (open, medium): [drawer] scroll lock applies html scrollbar-gutter: stable (same mechanism)

#### `slider`

**Reason:** The base-nova slider moves className to an outer Root and keeps layout classes on an inner Control, so the gallery's w-48 and h-24 overrides no longer apply: sliders render 864px wide and the vertical one 160px tall instead of 192px and 96px. Accessibility structure also differs (role=group plus hidden input[type=range] per thumb; range thumbs lose aria-label), and open issues exist for VoiceOver stale values (https://github.com/mui/base-ui/issues/5296), missing multi-thumb labels (https://github.com/shadcn-ui/ui/issues/10221) and focus visibility (https://github.com/shadcn-ui/ui/issues/12345). Retry when the registry file applies className to the element carrying the layout classes, and per-thumb labelling and focus-ring visibility are confirmed identical.

Differences found:

- **look** (all four gallery sliders (className placement)): Radix: className goes on the Root element that also carries the flex/width classes, so className w-48 overrides w-full: sliders are 192px wide; vertical slider h-24 (… Base UI: base-nova puts className on an outer Root div with data-horizontal:w-full and the layout classes on an inner Control. w-48 loses to the data-horizontal:w-full variant: horizontal sliders measured 864…
- **accessibility** (thumbs): Radix: Thumb is a span role=slider with aria-valuenow/min/max; range thumbs have aria-label. Base UI: Thumb is a div containing a hidden input type=range; Root has role=group. Range thumbs get aria-valuetext 'start range'/'end range' and no aria-label. Screen-reader output differs (not run).
- **api** (DOM and attributes): Radix: Root/Track/Range/Thumb are spans; data-radix-collection-item; no inputs. Base UI: Divs, extra Control wrapper, data-base-ui-slider-indicator, data-index, one input[type=range] per thumb.

Upstream reports:

- [mui/base-ui/issues/5296](https://github.com/mui/base-ui/issues/5296) (open, medium): Slider: VoiceOver announces a stale value when navigating with the VO cursor.
- [shadcn-ui/ui/issues/10221](https://github.com/shadcn-ui/ui/issues/10221) (open, medium): Base UI slider thumbs lack aria-label, so multi-thumb range sliders are unlabelled (gallery has a range slider). Workaround: pass aria-label per thumb.
- [shadcn-ui/ui/issues/12345](https://github.com/shadcn-ui/ui/issues/12345) (open, medium): Base UI Slider thumb has no visible keyboard focus across v4 styles. In the branch focus-visible was true on the hidden input; ring visibility not verified.

#### `switch`

**Reason:** The base-nova Switch renders a <span role=switch tabindex=0> plus an always-present hidden checkbox input instead of Radix's native <button role=switch>, and emits data-checked/data-unchecked instead of data-state. This is a perceptible accessibility and DOM difference (verified in the browser against https://m3.khojlabs.com/gallery). Related evidence: https://github.com/mui/base-ui/issues/4122 (wrapping-label name, fixed in #4142) and https://github.com/shadcn-ui/ui/issues/9249 (open; maintainers recommend nativeButton + render={<button />} to match Radix). Retry once the registry base-nova switch renders a native button (or after deciding to hand-edit it with nativeButton and render={<button />}) and the data-state/hidden-input differences are accepted or removed, then re-compare keyboard and screen reader naming.

Differences found:

- **accessibility** (all variants): Radix: Root is <button type="button" role="switch" aria-checked value="on">, natively focusable, no tabindex attribute. Base UI: Root is <span role="switch" tabindex="0" aria-checked aria-labelledby=...> (base-nova registry file, no nativeButton/render), no button type or value.
- **api** (state attributes / styling hooks): Radix: Emits data-state=checked|unchecked. Base UI: Emits data-checked / data-unchecked (no data-state). Any consumer or test selecting on data-state breaks.
- **api** (DOM structure): Radix: Single button element in the label (Radix only adds a bubble input inside a form). Base UI: Extra sibling <input type=checkbox> is always rendered after the span inside the label.

Upstream reports:

- [mui/base-ui/issues/4122](https://github.com/mui/base-ui/issues/4122) (closed, medium): Switch.Root (a span role=switch) got no accessible name from a wrapping <label>; NVDA, Narrator and TalkBack announced it unnamed. Fixed in PR #4142 (aria-labelledby) on 2026-02-24. m3 gall…
- [shadcn-ui/ui/issues/9249](https://github.com/shadcn-ui/ui/issues/9249) (open, medium): shadcn base-nova Switch/Checkbox labels target the hidden input, not the visible control; workarounds are aria-labelledby/id on the label, nativeButton + render={<button />}, or Base UI Fie…

#### `tabs`

**Reason:** Base UI Tabs behaves differently from Radix: arrow keys move focus without selecting (Radix selects), and the disabled trigger is focusable via aria-disabled and not skipped (Radix uses native disabled). Retry once the swap can set activateOnFocus on Tabs.List and keep disabled triggers non-focusable, then re-run the arrow, End and Tab checks against https://m3.khojlabs.com/gallery#components; keep the migration only if the keyboard results match.

Differences found:

- **interaction** (default tabs, line tabs, vertical tabs (arrow keys)): Radix: Arrow keys move focus and select the tab immediately (automatic activation); panel switches. Base UI: Arrow keys only move focus; tab is not selected until Enter/Space (activateOnFocus is false by default); the panel does not change.
- **accessibility** (default tabs, Disabled trigger): Radix: Disabled trigger is a native button with disabled attribute: not focusable, skipped by arrow keys, End goes to Password. Base UI: Disabled trigger has aria-disabled=true and no disabled attribute; arrow keys land focus on it, and End stays on it (it is last).
- **accessibility** (all tab lists, tab order / roving tabindex): Radix: Tablist has tabindex 0 and role tablist with aria-orientation; triggers use roving tabindex tied to focus. Base UI: Tablist has no tabindex or aria-orientation; the active tab gets tabindex 0 at rest (data-composite-item-active).
- **api** (styling hooks and DOM): Radix: data-state=active|inactive, data-radix-collection-item, dir=ltr on root. Base UI: data-active, data-activation-direction, data-index, data-composite-item-active; no data-state. The registry file renames Content to Panel and Trigger to Tab, and adds aria-disabled: classes to the tr…

Upstream reports:

- [mui/base-ui/issues/5285](https://github.com/mui/base-ui/issues/5285) (closed, medium): Disabled tab is not skipped by arrow-key movement (reported on v1.5.0); closed, but we still saw a disabled tab take focus on the version installed here.
- [mui/base-ui/issues/5132](https://github.com/mui/base-ui/issues/5132) (closed, medium): Request to allow disabled tabs to be skipped during keyboard navigation.

#### `toggle-group`

**Reason:** Base UI ToggleGroup exposes different accessibility semantics from the Radix reference: single mode is role=group with aria-pressed buttons instead of role=radiogroup/radio with aria-checked, multiple mode is role=group instead of role=toolbar, and the disabled group keeps a tabindex=0 item with aria-disabled where Radix has none. Visuals and mouse/arrow-key behaviour matched. See https://github.com/mui/base-ui/issues/3525 (open). Retry when Base UI offers radio semantics for single mode or the team accepts the screen-reader change.

Differences found:

- **accessibility** (single-mode group (Left/Center/Right)): Radix: container role=radiogroup, items role=radio with aria-checked Base UI: container role=group, items are plain buttons with aria-pressed (no radio semantics)
- **accessibility** (multiple-mode group (B/I/U) and disabled group): Radix: container role=toolbar (multiple) / role=radiogroup (disabled single) Base UI: container role=group in both
- **accessibility** (disabled group (A/B)): Radix: container tabindex=-1, items disabled with tabindex=-1 Base UI: first item keeps tabindex=0 and gets aria-disabled=true plus disabled
- **api** (ThemeSection consumer): Radix: type=single with string value Base UI: value is always an array; theme string must be wrapped and unwrapped (mechanical, listed for completeness)

Upstream reports:

- [mui/base-ui/issues/3525](https://github.com/mui/base-ui/issues/3525) (open, medium): Single selection mode has no role=radio semantics (request still open); matches the accessibility difference measured below.

#### `tooltip`

**Reason:** Swapping to the base-nova tooltip changes look and screen-reader output. Content sits 4-6px closer to the trigger (sideOffset 4 against Radix's 10px including arrow), the arrow box is 14px instead of 10px, Base UI emits no role=tooltip and no aria-describedby on the trigger, and every tooltip animates rather than only the first. Retry once the base-nova tooltip can be configured to match (offset, arrow, aria) or the team accepts these as intended changes. Related open issues: https://github.com/mui/base-ui/issues/3075 and https://github.com/shadcn-ui/ui/issues/9617.

Differences found:

- **look** (all four sides): Radix: Content sits about 10px from the trigger (top: content bottom y166, trigger top y176); arrow span 10x10 Base UI: base-nova default sideOffset 4: content 4-6px closer (top: content y144 vs y138); arrow element 14x14 box instead of 10x10; arrow placement CSS differs
- **accessibility** (open tooltip): Radix: role=tooltip element present and trigger gets aria-describedby while open Base UI: no role=tooltip element and no aria-describedby on the trigger
- **feel** (moving between triggers): Radix: first tooltip animates (delayed-open, 0.15s); later ones open instantly with no animation (instant-open) Base UI: every tooltip runs the 0.15s enter animation
- **api** (TooltipProvider): Radix: delayDuration prop Base UI: delay prop (renamed); no current consumer passes it

Upstream reports:

- [shadcn-ui/ui/issues/9617](https://github.com/shadcn-ui/ui/issues/9617) (open, medium): base-nova tooltip delay reported as not working (Provider delay default 0 / trigger delay); gallery relies on delay 0 so low impact here
- [mui/base-ui/issues/4022](https://github.com/mui/base-ui/issues/4022) (open, medium): Escape stack broken for unfocused Tooltip inside Dialog
- [mui/base-ui/issues/3075](https://github.com/mui/base-ui/issues/3075) (open, medium): Trigger does not work when rendering disabled elements (gallery row is labelled 'disabled trigger wrapper')

## Migrated components and their API changes

These are the changes consumers had to make. Each migrated component matched the Radix build on every check that was run.

- **`avatar`**: Import switches from radix-ui to @base-ui/react/avatar; prop types become AvatarPrimitive.*.Props. Radix Fallback delayMs becomes Base UI delay; no consumer uses it.
- **`badge`**: asChild prop replaced by render prop (useRender); no consumer used asChild on Badge. Implementation is useRender + mergeProps instead of Slot; data-slot=badge and data-variant still emitted on the span.
- **`breadcrumb`**: BreadcrumbLink: asChild -> render prop (useRender). BreadcrumbsNavigation: <BreadcrumbLink asChild><Link/></BreadcrumbLink> -> render={<Link to=... />}.
- **`input-group`**: InputGroupButton props type: Omit<ButtonProps, 'size' | 'type'> with type?: 'button' | 'submit' | 'reset' (type-only; default 'button' unchanged). Imports point at @/components/ui/* (same as before; Button stays on Radix since C-button was flagged).
- **`input`**: no API change.
- **`list`**: ListItem asChild removed; use render={<button />} / render={<a href />} / render={<span />}. Children go in ListItem and become children of the rendered element; wrapper li is unchanged.
- **`paper`**: asChild prop removed; replaced by Base UI render prop (useRender.ComponentProps). No consumer used asChild.
- **`toggle`**: Root is TogglePrimitive (not .Root); props type TogglePrimitive.Props. Consumer FormSections uses only variant/size/aria-label/defaultPressed/disabled, no edit needed. DOM attribute data-state=on|off becomes data-pressed (present when on); data-[state=on]:bg-muted in the class is now inert but aria-pressed:bg-muted gives the same pressed style. Nothing in src selec… Redundant tabindex=0 attribute added to the button (no behavioural change).
- **`typography`**: asChild removed; use render prop (no consumer used it). `as` prop kept (implemented via render={createElement(as)}). Props type is now useRender.ComponentProps<'p'>.

Notes:

- `input-group` is migrated but still imports the Radix `Button`, because `button` stayed on Radix. No visible effect was seen.
- `asChild` is gone from `badge`, `breadcrumb`, `list`, `paper` and `typography`; use the `render` prop. `typography` keeps its `as` prop.

## Next steps and re-testing

Every kept component has a retry condition in its result file (`factory/results/C-<name>.json`, field `reasonNotMoved`). To retry one: do the same comparison against the live site, in both dark and light mode and at 390px, and run the whole sweep afterwards. Components worth a decision first, because their only differences are minor:

- `fab` and `button`: accept `type="button"` as the new default, or set `type` explicitly on the Radix version first.
- `label`: add a `mousedown` guard for double-click to the base-nova label.
- `collapsible`: try `keepMounted` on the panel. A worker suggested it but did not test it.
- `pagination`: blocked only by `button`.

`components.json` now points at the `base-nova` style, so a newly added shadcn component is generated for Base UI. Such a component may need the Base UI `Button` API (`render`, `nativeButton`), which the Radix `button` does not have.
