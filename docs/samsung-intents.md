# Samsung activity launcher

> Current interface: Phone settings / Manage an app / Open an app / Advanced. The 566-entry source catalog is retained as an Advanced reference archive; it is no longer presented as a list of working phone shortcuts.

Route: `/samsung-intents`. Linked in the shared footer, HTML sitemap and XML sitemap/prerender route collector.

The catalog now has 566 candidates in nine selectable groups. The default renders only Android settings actions; choosing another group mounts only that group's cards. “All groups” renders separate type sections. Category, search, favourites and recent filters apply inside the selected group. Group selection is saved with the session view.

| Group | Initial candidates |
| --- | ---: |
| Android settings actions | 156 |
| Android settings activities (explicit AOSP components) | 164 |
| Everyday Android activities | 30 |
| Samsung apps | 35 |
| Samsung Device care activities | 3 |
| Samsung settings · legacy | 150 |
| Good Lock modules | 18 |
| Google apps | 10 |
| Imported phone activities | 0; populated by the user |

This is a reference list, **not** an exhaustive inventory or a claim of on-device validation. Firmware, region, installed apps, export flags and permissions determine what can launch. Historical Samsung components are explicitly labelled legacy; they are not presented as a current One UI 8.5 manifest.

## Sources and maintenance

- `src/data/samsung-settings.json`: constants checked against [AOSP Android 16 Settings.java](https://github.com/aosp-mirror/platform_frameworks_base/blob/android16-release/core/java/android/provider/Settings.java), Apache-2.0. Public settings actions and selected internal navigation screens are included. Actions needing structured inputs, services or voice sessions are omitted. Internal actions are marked device-dependent. Descriptions are authored for this page.
- `src/lib/samsung-intents.ts`: curated app package targets (device-dependent), the [Samsung background-usage API](https://developer.samsung.com/mobile/app-management.html), URI/ADB serialization and strict component imports. Package targets do not imply that the app has a browser-accessible launcher. Module availability changes with Good Lock releases.
- [Android settings reference](https://developer.android.com/reference/android/provider/Settings), [common intents](https://developer.android.com/guide/components/intents-common) and [Chrome browser intent restrictions](https://developer.chrome.com/docs/android/intents).
- [Zeldoon's directory](https://zeldoon.github.io/) inspired the quick-access use case. Its intent URLs were not imported wholesale: some mix activity class names with action names or omit required extras.

Per-app actions distinguish package URI data, `android.provider.extra.APP_PACKAGE`, and `android.intent.extra.PACKAGE_NAME`. Samsung's background-usage links use an integer `activity_type`. Overlay permission management opens the general list on Android 16; per-app data is ignored there.

The page stores favourites, up to 12 recently requested shortcuts and up to 1,000 imported components in browser local storage. It neither discovers installed apps nor confirms launch success. Import accepts only `package/activity` lines and reconstructs stored entries on reload. Imported code and arbitrary URIs are never executed. Export saves imported component lines, not favourites.

The discovery command shown in the UI lists **launcher activities only**. Internal activities require inspecting the specific package or using an activity launcher on the device. ADB also respects activity permissions and export rules. Nested activity class names containing `$` require protection from both local and device shell expansion; the serializer quotes both layers.

## Validation

Run `node --import tsx --test scripts/samsung-intents.test.ts` and targeted ESLint on the new TypeScript files. Five tests cover unique catalog IDs, all intent serializers, per-app data/extras, typed Samsung extras, fallback encoding, strict imports and nested shell quoting.

Browser checks performed at desktop and 390px mobile widths: search/empty results, saved favourites after reload, per-app links and invalid packages, import deduplication/persistence/removal, layout overflow, Android launch-request history and fallback messaging. Actual Samsung activity launches still require a physical device.

The launcher also built successfully as an isolated Vite production entry. Full-site validation is currently limited by pre-existing TypeScript errors in unrelated components and a broken Mermaid installation (`mermaid.core.mjs` is missing from the existing node_modules package). No dependency changes are part of this feature.

## Failed launches and session continuity

Intent fallbacks now use a same-document `#intent-failed=…` fragment instead of a query URL that reloads the page. The handler marks that particular launch red and cleans up the fragment without navigating. Hash-only callbacks do not trigger the shared page curtain. Browsers that fail silently have a “Didn’t open” control on each card; “Retry” still attempts the link. There is no timer-based success/failure inference.

The separate `qwabi-samsung-launch-session-v1` session-storage record saves failed launch keys, filters, the target package and scroll position. Per-app failures are keyed by both shortcut ID and target package. Launch state is flushed before attempting an intent. Scroll restoration updates Lenis’s dimensions first, since its cached limit may describe the short loading placeholder. The shared scroll-to-top handler defers to this page when it has a saved position. Session-storage denial leaves in-memory marking available. “Reset failure marks” clears only the failure list.

Run `node --import tsx --test scripts/samsung-intents.test.ts scripts/samsung-launch-session.test.ts scripts/samsung-activity-groups.test.ts` for the fifteen unit checks. With the development server running, run `SAMSUNG_TEST_BASE_URL=http://127.0.0.1:5173 node scripts/samsung-launcher.browser-test.mjs` for the Chrome browser regressions (requires Chrome and the existing Playwright dependency). They simulate the fallback callback on a Galaxy-sized Android browser; they do not establish which activities open on real Samsung firmware.

## Expanded activity candidates

`src/lib/samsung-activity-groups.ts` defines the nine groups and their source links. `shortcutGroup()` keeps existing shortcut IDs stable while classifying the older entries. Imported activity categories now use the package name so a user can render one installed package at a time. Old saved sessions without a group migrate to Android settings actions.

`src/data/android-activity-candidates.json` adds 20 input-free internal settings actions from Android 16 Settings.java, 164 exported settings components from [Android 16's AOSP Settings manifest](https://github.com/aosp-mirror/platform_packages_apps_settings/blob/android16-release/AndroidManifest.xml), and 150 distinct historical Samsung components from the published [BatMan modified SecSettings manifest](https://github.com/GrifoDev/BatMan-ModdedFiles/blob/master/SecSettings/AndroidManifest.xml). Identifiers shared by the AOSP and historical manifests are deduplicated. Entries explicitly marked non-exported or requiring a manifest permission were omitted; legacy implicit export rules were evaluated only as historical metadata. Current firmware may use different export rules. Activity names associated with reset, deletion, installation, confirmation, provisioning, registration, reboot or shutdown were excluded from these generated test candidates.

`src/data/android-common-activities.ts` adds 26 ordinary navigation, compose, file-picker and media activities based on [Android common intents](https://developer.android.com/guide/components/intents-common). Combined with the existing four common activities, that group contains 30 candidates. No message, call, calendar event or contact is submitted automatically. Some pickers require a native caller to receive their result and cannot work in a browser. The serializers now preserve additional intent categories such as OPENABLE.

The browser regression script additionally checks all nine group counts against their mounted cards, separated All groups sections, and import-package filtering across reloads. These are application tests, not physical Samsung compatibility certification.

## Samsung settings section groups

Every Settings candidate also belongs to one of 23 separately selectable Samsung-style sections: Connections, Connected devices, Modes and Routines, Sounds and vibration, Notifications, Display, Wallpaper and style, Themes, Home screen, Lock screen and AOD, Security and privacy, Location, Safety and emergency, Accounts and backup, Google, Advanced features, Digital Wellbeing and parental controls, Device care, Apps, General management, Accessibility, Software update, and About phone.

The section picker is expanded by default and the same choices appear in a dedicated optgroup in the Activity group dropdown. A selected section renders one combined list of its Android action, explicit AOSP component, Samsung legacy and relevant companion-app alternatives. It does not duplicate the underlying catalog. The existing activity-type groups remain available. Sections without known candidates show zero and an empty result rather than invented intents.

`src/lib/samsung-settings-sections.ts` owns classification. Specific screens precede broad terms: SIM status goes to About phone, lock-screen notification appearance to Lock screen, accessibility screens to Accessibility, and battery/sleeping-app screens to Device care. Imported Settings components are classified too. Section IDs use `samsung-section-*` and are accepted by session-state validation, preserving selection, filters, failure marks and scrolling across refreshes.

Run the prior tests plus `scripts/samsung-settings-sections.test.ts` (18 total unit checks). Browser regressions select all 23 section groups, compare mounted card counts, and verify section selection and failed-link marks after refresh. The section taxonomy is navigation organisation; it is not a claim that every section exists on every Galaxy model.

## App controls

Four overlapping, selectable app-control collections supplement the nine activity types and 23 Samsung sections: App management, App settings, App permissions, and App notification settings. They reuse existing entries rather than duplicate catalog IDs. App info appears in each collection as the fallback route to Permissions or Notifications.

`src/data/app-control-intents.ts` adds 28 candidates: three permission-manager/app-permissions entry points, twelve permission-specific app lists, twelve permission-specific selected-app screens, and one channel-notification settings action. Names and extras are checked against [Android 16 Intent.java](https://github.com/aosp-mirror/platform_frameworks_base/blob/android16-release/core/java/android/content/Intent.java), [Settings.java](https://github.com/aosp-mirror/platform_frameworks_base/blob/android16-release/core/java/android/provider/Settings.java) and the [Settings API reference](https://developer.android.com/reference/android/provider/Settings). Internal permission screens are explicitly marked device-dependent; MANAGE_APP_PERMISSION and APP_PERMISSIONS_SETTINGS require privileged permissions and are expected to be blocked for an ordinary browser. These entries open management UIs; they do not grant, revoke or request runtime permissions on behalf of the website.

The optional notification-channel input supplies `android.provider.extra.CHANNEL_ID`; the selected package uses `android.provider.extra.APP_PACKAGE`. Channel-specific links and copy controls remain disabled until a nonblank channel ID is entered. The ID is encoded as an intent string extra and quoted for both ADB shell layers. Channel-specific failure keys include the channel ID so a failed channel does not mark another channel red. Session validation preserves the optional channel and new collection selections, with an empty channel for older sessions.

There are now 22 unit checks (add `scripts/app-control-intents.test.ts` to the previous command). Browser regressions cover each app-control collection, missing-channel validation, channel encoding, channel-specific failures and selection persistence. The full-site validation limitations described above still apply; the launcher builds as an isolated production entry.

## Task navigation and reported incorrect destinations

After an SM-A155F user reported that nearly all `*.Settings$…` component entries opened Connections rather than the named screen, these aliases were removed from all normal modes and their browser launch controls disabled in Advanced. All other unverified explicit components are also reference-only in the browser. Imported components matching the same pattern are also blocked. Copyable references and ADB commands remain available, explicitly unverified. The report is recorded as a device observation, not asserted as universal Android behavior.

`src/lib/samsung-launcher-navigation.ts` owns the four modes, the small allowlist of standard action shortcuts and the alias detection. Phone settings groups the standard actions by settings section. Manage an app uses a named app picker followed by one task selector; app information is the fallback for Permissions and Notifications. Open an app lists package targets with no installed-app or compatibility claim. Advanced retains internal actions, historical components, import/export and technical references. Empty sections are omitted. Technical intent identifiers and Copy actions are inside Details.

The session now records explicit user-confirmed `worked` keys alongside failed keys. Opening or leaving the browser never marks success. Worked toggles a green confirmation, Wrong screen and Didn’t open mark red and clear green, and the Worked filter lists only confirmed shortcuts in the current task. Existing session data without the new mode resets old query/scroll navigation while preserving failure history, favourites and imports. Channel and package scoping remain in effect.

There are 26 unit checks including `scripts/samsung-launcher-navigation.test.ts`. The browser regression script now follows the four task journeys, guards against normal-mode component aliases and browser-launchable Settings$ imports, checks explicit outcome changes, per-app fallbacks, channel scoping, and scroll/session restoration with smooth motion both enabled and disabled. Actual device launches remain outside browser simulation coverage.
