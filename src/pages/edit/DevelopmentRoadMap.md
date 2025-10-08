# Development Roadmap – Edit Feature

## ✅ Completed

- [x] Fixed direct navigation to edit page - now properly fetches asset data from route query params (TKT-2025-001)
- [x] Fixed asset type case sensitivity by normalizing all lookups to lowercase (TKT-2025-001)
- [x] Fixed JSON parsing error in VideoMetaDataEdit when videoMeta prop is undefined (TKT-2025-002)

## ⏳ To Do (easy → hard)

1. [ ] Debug and fix data fetching issues - dataObj not populating correctly (TKT-2025-003)
2. [ ] Re-enable edit button once data fetching is resolved
3. [ ] Add proper error handling and user feedback when asset fetch fails
4. [ ] Add loading states for all edit portal components
5. [ ] Implement validation feedback in form elements
6. [ ] Add undo/redo functionality for edits

## 💡 Recommendations

- Consider adding a confirmation dialog before navigating away from unsaved changes
- Implement auto-save functionality to prevent data loss
- Add keyboard shortcuts for common edit actions (save, cancel, etc.)
- Consider adding a preview mode before saving changes
