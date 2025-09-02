# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/altea-abs/time-boxing/compare/v1.2.0...v1.2.1) (2025-09-02)


### 📚 Documentation

* update project documentation to reflect v1.2.0 undo/redo system ([d3f3fb0](https://github.com/altea-abs/time-boxing/commit/d3f3fb03eddf0671af3aef9db29b4ee463c9be6f))


### 🐛 Bug Fixes

* **ui:** enable drag and drop from braindump to priorities ([0bdabd6](https://github.com/altea-abs/time-boxing/commit/0bdabd6b148aed8389bfb4cd69fb246e986bce4c))

## [1.2.0](https://github.com/altea-abs/time-boxing/compare/v1.1.0...v1.2.0) (2025-09-02)


### ✨ Features

* **shortcuts:** add undo/redo keyboard shortcuts ([04aa594](https://github.com/altea-abs/time-boxing/commit/04aa59492bde1aab03380b5bebbe1bb53658456e))
* **timeSlots:** add swap option on occupied-slot drop ([ab08f9d](https://github.com/altea-abs/time-boxing/commit/ab08f9d909f01bcf224acafd020fb599e31acfa7))
* **timeslots:** add undo/redo history stack for slot task changes ([0cdbaf4](https://github.com/altea-abs/time-boxing/commit/0cdbaf46dd93e191595cbacf3813467adbad03af))
* **timeslots:** confirm overwrite on occupied slot drop ([29ef5eb](https://github.com/altea-abs/time-boxing/commit/29ef5eba31bd9562f9b34a31b59200f884b054b2))
* **ui:** add undo/redo controls ([812dbc7](https://github.com/altea-abs/time-boxing/commit/812dbc73c5ed40b3272a52c099f7d222608d0876))


### 📚 Documentation

* **help:** document undo/redo keyboard shortcuts ([6cf643f](https://github.com/altea-abs/time-boxing/commit/6cf643feed43a0199efaaa0267d3760839863309))
* **readme:** add undo/redo keyboard shortcuts ([75e41cc](https://github.com/altea-abs/time-boxing/commit/75e41cc0596ed8d08413f49c33d78b3682e5faad))


### 🐛 Bug Fixes

* **ui:** remove multi-assign active banner in TimeSlotSection ([3d00f79](https://github.com/altea-abs/time-boxing/commit/3d00f7990d5340f93e3e9f28037cdd1790e1b393))

## [1.1.0](https://github.com/altea-abs/time-boxing/compare/v1.0.0...v1.1.0) (2025-09-01)


### ♻️ Chores

* **tooling:** add standard-version configuration for automated releases ([9be1bc0](https://github.com/altea-abs/time-boxing/commit/9be1bc0dfc0aa7c6410b6417f65c85ebf21d0b91))


### 🐛 Bug Fixes

* **ui:** improve TimeSlot section title layout ([e658fbe](https://github.com/altea-abs/time-boxing/commit/e658fbe8d1c4016ae63dd44cb8c0a9f1db2c8cb2))


### 💎 Styles

* **ui:** align TimeSlot title section to left ([8d9e369](https://github.com/altea-abs/time-boxing/commit/8d9e3694e9f04ee8249cbd0cb7577f8b8dc52a74))


### ✨ Features

* **tooling:** add Documentation Updater Claude agent ([9bf519d](https://github.com/altea-abs/time-boxing/commit/9bf519d5f99e9c1ce04823fb627478d2cf946180))
* **ui:** add version display in application header ([f29d1a9](https://github.com/altea-abs/time-boxing/commit/f29d1a93314b7e8a80e5a88e8687da6ffe5a1ca2))
* **ui:** replace Today button with Alt+T keyboard shortcut ([8583e90](https://github.com/altea-abs/time-boxing/commit/8583e905ee06431b669aa8cfa3e973f0798b091c))
* **ui:** reposition date navigation buttons around date display ([cd72624](https://github.com/altea-abs/time-boxing/commit/cd72624f03f959def57e72df9aea5a22083e468e))


### 📚 Documentation

* update keyboard shortcuts documentation for Alt+T ([6d070c9](https://github.com/altea-abs/time-boxing/commit/6d070c97a6e315ecd261aca38c3b5a352c2d6226))

## [1.0.0](https://github.com/altea-abs/time-boxing/compare/v0.0.0...v1.0.0) (2025-09-01)

## 0.0.0 (2025-09-01)


### ⚠ BREAKING CHANGES

* **tooling:** All commits must now follow Conventional Commits format

### 🚨 Tests

* **tooling:** add test file for Conventional Commits validation ([d6fc1cc](https://github.com/altea-abs/time-boxing/commit/d6fc1cce3fa06dfae837c921c689f4e9a27bb63b))


### ♻️ Chores

* fix deploy ([4f3c018](https://github.com/altea-abs/time-boxing/commit/4f3c018d58b40b3590a84107ddbbad63d5d6cb42))
* **tooling:** remove test file for Conventional Commits ([04f9392](https://github.com/altea-abs/time-boxing/commit/04f93921f2bdd866cfb04f1ba9ec88c24185d3d5))


### 📦 Code Refactoring

* **components:** move HelpDialog to Help folder ([4744f92](https://github.com/altea-abs/time-boxing/commit/4744f92a2aaa042b57cee40347f765efee2d8856))
* **components:** organize settings components in dedicated folder ([76947b4](https://github.com/altea-abs/time-boxing/commit/76947b4e8bb615d7dc324faad7a3042fb78fe51e))
* **settings:** integrate SettingsPriority component in dialog ([63bc7cd](https://github.com/altea-abs/time-boxing/commit/63bc7cdace8b21b5e8646860c36d647536976133))
* **settings:** integrate SettingsSlotDuration component in dialog ([e816ff8](https://github.com/altea-abs/time-boxing/commit/e816ff8469702e0af6323424210808a55f9361e7))
* **settings:** integrate SettingsTimeRange component in dialog ([acb52b2](https://github.com/altea-abs/time-boxing/commit/acb52b2836f72ebc8a72bf6c26569daeda257004))
* simplify SettingsPriority component ([0d74594](https://github.com/altea-abs/time-boxing/commit/0d74594a0555b8d0e0c0bbdf78b75199e2b7ad38))
* **ui:** remove quick-actions section from Help modal ([3486a50](https://github.com/altea-abs/time-boxing/commit/3486a50ebb23613447f3528b651d0deb79044235))
* **ui:** remove step indicator from Help modal footer ([85d3ad2](https://github.com/altea-abs/time-boxing/commit/85d3ad25546565bbd77c4103f0aa07a4b2c530cb))
* **ui:** replace assigned tasks section with notes section ([fdf6a1e](https://github.com/altea-abs/time-boxing/commit/fdf6a1e3a64b177449dc835add0defae12ef0765))


### 💎 Styles

* **alert:** change variant to tonal ([1315221](https://github.com/altea-abs/time-boxing/commit/131522161c20a2cfdfa75d5c112caa0523757ee0))
* **ui:** improve stepper spacing in Help modal ([8c21e33](https://github.com/altea-abs/time-boxing/commit/8c21e3362cc99c1881ef974531a79be915da2dba))
* **ui:** increase header action button icon sizes ([c89278b](https://github.com/altea-abs/time-boxing/commit/c89278b997bd8d4871a44fa94c52b642692ecbb0))
* **ui:** set Help modal height to 80% of viewport ([3212b14](https://github.com/altea-abs/time-boxing/commit/3212b14c7004a58cb624025010de9ec0779002d7))


### 🐛 Bug Fixes

* **alert:** add max-height constraint of 200px ([3f87309](https://github.com/altea-abs/time-boxing/commit/3f8730950d3c79d06c2e4b841eedbe1b25f557d8))
* **alert:** improve max priority alert design and styling ([ff95f28](https://github.com/altea-abs/time-boxing/commit/ff95f289b37b542bb7efd15de40f5125cb290026))
* **alert:** reduce space usage and make outlined ([245f613](https://github.com/altea-abs/time-boxing/commit/245f61317b56858dec31b94ff30dd204fb8d8ce6))
* **alert:** remove fixed width constraint ([9aecd59](https://github.com/altea-abs/time-boxing/commit/9aecd59d55b3c3a259f2563fb8bd8c69a1938880))
* **alert:** restore error type while keeping close button color fix ([b685150](https://github.com/altea-abs/time-boxing/commit/b685150bcb1e233e9def4612b4af67d0fa4ff1e9))
* **alert:** set proper height to prevent expanding ([3b5fde3](https://github.com/altea-abs/time-boxing/commit/3b5fde309c9121c67a35e96bcf7b56e7f515c40c))
* **alert:** use natural height instead of constraints ([d335875](https://github.com/altea-abs/time-boxing/commit/d335875cebda0176ebaa4a663067a32276bf2564))
* apply time range and slot duration settings to time grid ([b4fa775](https://github.com/altea-abs/time-boxing/commit/b4fa775fa1cc6ee8d9e3c61db2713495cb02754b))
* **build:** resolve sass-embedded native binding error in GitHub Actions ([9cb62df](https://github.com/altea-abs/time-boxing/commit/9cb62dfe4e585f63cded019e5e2ae4b528a47f69))
* **components:** correct SettingsDialog component name in app.vue ([24d6bd8](https://github.com/altea-abs/time-boxing/commit/24d6bd87e9419c087b69179bb9414f267967d55c))
* **components:** remove unused props variable in SettingsSlotDuration ([8d0d0aa](https://github.com/altea-abs/time-boxing/commit/8d0d0aaf3967f5a9df1e05894193a7a5a3d12402))
* make max priorities setting reactive ([0d71636](https://github.com/altea-abs/time-boxing/commit/0d71636262dedf85b1fc0808b7cfd3d7c63b139d))
* remove center alignment from SettingsSlotDuration labels ([809bc5f](https://github.com/altea-abs/time-boxing/commit/809bc5f0ec70c9bf532170294031a4d0cc8bc481))
* **slots:** remove duplicate title display in blocked slots ([ca48395](https://github.com/altea-abs/time-boxing/commit/ca4839555ed533a25d83d8ab3ac37ecdc58e9f8f))
* **stores:** sync priority status when assigning tasks to time slots ([fbd73b6](https://github.com/altea-abs/time-boxing/commit/fbd73b60349b6bafb94c516802ac59bbc3e20473))
* **ui:** center time controls and reduce excessive left spacing ([e86fbfa](https://github.com/altea-abs/time-boxing/commit/e86fbfaf841527093fa4c632e5001b7a7f133c39))
* **ui:** implement variable spacing between start and end time controls ([34a8c19](https://github.com/altea-abs/time-boxing/commit/34a8c1954978b34490cee9b6b6cde0745094ad55))
* **ui:** improve Help modal scrolling with fixed header/footer ([154fafc](https://github.com/altea-abs/time-boxing/commit/154fafc22cc70bcea5b39561133b5a75bdf36c2e))
* **ui:** improve time settings layout in SettingsDialog ([a51949c](https://github.com/altea-abs/time-boxing/commit/a51949cf52b8c59e444e71d2cad0b857bba62540))
* **ui:** improve time slot drag and drop usability ([a8826b8](https://github.com/altea-abs/time-boxing/commit/a8826b8a8cbbf8ab1ab23820f2cbb3d6aeb25b7f))
* **ui:** set fixed height for Help modal stepper content ([14c3ba6](https://github.com/altea-abs/time-boxing/commit/14c3ba616b24a28ac09af9b5e2cde28bfd3267b6))
* **ui:** update GitHub repository links to correct project URL ([50b5ea5](https://github.com/altea-abs/time-boxing/commit/50b5ea56ebc3dd89ceb025a965294aec8a62e49e))
* update SettingsSlotDuration layout to vertical alignment ([231e364](https://github.com/altea-abs/time-boxing/commit/231e364dc0f55676305d6959a832bbb435a8c299))


### ✨ Features

* add Alt+S keyboard shortcut for settings dialog ([05119d7](https://github.com/altea-abs/time-boxing/commit/05119d7cb27e0f0c0f7557a58afac45161ec3e26))
* **brain-dump:** add confirmation dialog for task deletion with time slot assignments ([194ca16](https://github.com/altea-abs/time-boxing/commit/194ca1696d0652c0a007a1fff8a02e37a5dee21b))
* **components:** add Esc key support and update shortcuts in HelpDialog ([0ed67b3](https://github.com/altea-abs/time-boxing/commit/0ed67b30798b9452dcef725a544e2fe9ad73f2a1))
* **components:** create SettingsPriority component for priority management ([a1044df](https://github.com/altea-abs/time-boxing/commit/a1044df1f82c4c73569c2b617cccdd2404e9e032))
* **components:** create SettingsSlotDuration component for slot duration ([f3a1ee7](https://github.com/altea-abs/time-boxing/commit/f3a1ee70950529606a0e03f119e864e9f3b8151c))
* **components:** create SettingsTimeRange component for time selection ([1d5515c](https://github.com/altea-abs/time-boxing/commit/1d5515c7cb2714789b9e9d4ed0d6f148c736ea56))
* **config:** add environment variable for default slot duration ([153c0a0](https://github.com/altea-abs/time-boxing/commit/153c0a02fbd40a7e9b85252f885fbe39c497c776))
* **config:** add environment variables for default time range ([81c0d1d](https://github.com/altea-abs/time-boxing/commit/81c0d1df3802a2689dda6c0fd0f356dc8496f58a))
* **data:** implement date-based retention system for tasks and priorities ([6c3c1e6](https://github.com/altea-abs/time-boxing/commit/6c3c1e6aff7e561c39007bf14e529a28f08427ba))
* **fonts:** configure Roboto as primary font family ([c4f9c85](https://github.com/altea-abs/time-boxing/commit/c4f9c8574a817f90e1448dc56106b5ebec934af7))
* **help:** create interactive help guide with v-stepper ([4ee3ce6](https://github.com/altea-abs/time-boxing/commit/4ee3ce6da5fa41eaca19b472566bd9016b9f95c6))
* improve settings dialog UX ([e60c08e](https://github.com/altea-abs/time-boxing/commit/e60c08efa8e7fd9a03e34a6942c53b5a3f9cf957))
* **navigation:** add multi-day navigation with rolling retention policy ([9ab933d](https://github.com/altea-abs/time-boxing/commit/9ab933d1c5f8a4b6ceced6975a9de5cdd01a76c5))
* **notes:** implement date-based notes system with retention policy ([8f6bf29](https://github.com/altea-abs/time-boxing/commit/8f6bf29de034254ec5d653f7e8b7a59f012a7f0a))
* **priorities:** add drag and drop reordering for priority items ([c797ec1](https://github.com/altea-abs/time-boxing/commit/c797ec1ef1da5a5f2adc6b0a42a2328c2fb35e0d))
* redesign settings dialog with responsive flex layout ([e634415](https://github.com/altea-abs/time-boxing/commit/e6344155179905647e9a8e5c995429bf1de0af51))
* **settings:** add blocked slots functionality for recurring activities ([f6f3237](https://github.com/altea-abs/time-boxing/commit/f6f32379f88cd833781eae69bf386c05c34f0e7d))
* **settings:** add comprehensive settings panel with dynamic configuration ([9ed84fe](https://github.com/altea-abs/time-boxing/commit/9ed84fe7180460a54eff9b06a75a890c7243ceec))
* **slots:** display activity name in blocked time slots ([196239a](https://github.com/altea-abs/time-boxing/commit/196239a8f5705e7d353571aba7e50b04aab2c838))
* **tooling:** add Conventional Commits configuration ([8b956e3](https://github.com/altea-abs/time-boxing/commit/8b956e3e98166adbb1d77489f0b1caaf6711f5f2))
* **ui:** add Alt+G keyboard shortcut to open repository ([8a54588](https://github.com/altea-abs/time-boxing/commit/8a54588044524c5aecd2d336bd629b239523eb1a))
* **ui:** add Alt+H keyboard shortcut for help dialog ([00c41b4](https://github.com/altea-abs/time-boxing/commit/00c41b4f0c272291725069d1877b42a3aab6332f))
* **ui:** add arrow key navigation to Help modal stepper ([02b855b](https://github.com/altea-abs/time-boxing/commit/02b855b5a98fde13391241c341088295d6567b09))
* **ui:** add dedicated HelpDialog component and modernize app header ([a0f33d0](https://github.com/altea-abs/time-boxing/commit/a0f33d077ffffe070cbec47bb950599bc22424b6))


### 📚 Documentation

* **claude:** add automatic commit requirements and process ([ba75467](https://github.com/altea-abs/time-boxing/commit/ba7546767980495145a73573b76271d65432890d))
* **claude:** add component organization and naming conventions ([748d143](https://github.com/altea-abs/time-boxing/commit/748d1432be24a24d97229e4786893824de13277e))
* **claude:** add incremental development and commit guidelines ([c0f6b21](https://github.com/altea-abs/time-boxing/commit/c0f6b216c49e5339665767386b87cfcbe92714e9))
* **claude:** add strict feature implementation policy ([ea9b88e](https://github.com/altea-abs/time-boxing/commit/ea9b88e515494480e3c45e9e042c7c69b10d33bd))
* **claude:** update keyboard shortcuts documentation ([ad15205](https://github.com/altea-abs/time-boxing/commit/ad152059577ebf9d464acf93d0f565168bdb0719))
* **readme:** give more prominence to live demo section ([25ae4e3](https://github.com/altea-abs/time-boxing/commit/25ae4e322cbbb1092e3bfed372522a2994024a4f))
* **readme:** update repository URLs and demo link ([b7b8a45](https://github.com/altea-abs/time-boxing/commit/b7b8a45ee19f953243e5c681c3018433f2d1baad))
* update README and CLAUDE.md with latest features ([a19309e](https://github.com/altea-abs/time-boxing/commit/a19309e39b55d71010185c889eb29017081fa254))
* update README and CLAUDE.md with latest features ([716cd3f](https://github.com/altea-abs/time-boxing/commit/716cd3f3c6ab3d05dfa30c03d0a60be659663945))
