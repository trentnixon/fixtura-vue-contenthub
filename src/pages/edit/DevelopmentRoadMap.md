# Development Roadmap – Edit Feature

## ✅ Completed

- [x] Fixed direct navigation to edit page - now properly fetches asset data from route query params (TKT-2025-001)
- [x] Fixed asset type case sensitivity by normalizing all lookups to lowercase (TKT-2025-001)
- [x] Fixed JSON parsing error in VideoMetaDataEdit when videoMeta prop is undefined (TKT-2025-002)
- [x] Fixed input field value persistence - values no longer disappear on blur (TKT-2025-003)
- [x] Fixed property name mismatch between child and parent components in fixture updates
- [x] Improved TextInput component reactivity and real-time update handling
- [x] Standardized all edit portals (WeekendResultsEdit, Top5Edit, LadderEdit, UpComingFixturesEdit) with case-insensitive data access (TKT-2025-004)
- [x] Fixed Top5Edit batting/bowling display issue with case-insensitive asset type matching
- [x] Added proper reactivity handling and debug logging to all edit portals
- [x] Hidden navigation quick select buttons (asset & category) in edit mode
- [x] Added rerender functionality to CricketResultSingle (WeekendSingleGameResult component)
- [x] Added loading state for rerender process in WeekendSingleGameResult

## ⏳ To Do (easy → hard)

1. [ ] Re-enable edit button in HeaderSection.vue and AssetController.vue (data fetching is now resolved)
2. [ ] Add proper error handling and user feedback when asset fetch fails
3. [ ] Add loading states for all edit portal components
4. [ ] Implement validation feedback in form elements
5. [ ] Add undo/redo functionality for edits

## 💡 Recommendations

- Consider adding a confirmation dialog before navigating away from unsaved changes
- Implement auto-save functionality to prevent data loss
- Add keyboard shortcuts for common edit actions (save, cancel, etc.)
- Consider adding a preview mode before saving changes
