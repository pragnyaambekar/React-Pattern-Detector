# Reviewer Guide - React Pattern Detector Validation

## Your Task
Review 30 React components and rate each one. **Time needed: 3-4 hours**

---

## How to Rate

For each component, ask: **"Does this have architectural problems that make it hard to maintain?"**

Then pick ONE rating:

### ✅ Clean
- Well-structured, appropriate complexity
- No significant problems

### ⚠️ Minor Issues
- Some complexity but might be justified
- Could be improved but not urgent

### ❌ Major Issues
- Clear architectural problems
- Too complex to maintain
- Should be refactored

---

## What to Look For

- **Size:** Too long? (>300-400 lines)
- **Complexity:** Too many hooks? (>8-10) Hard to understand?
- **Props:** Passed through many levels?
- **Performance:** Inline functions in JSX? `onClick={() => ...}`
- **Structure:** Deeply nested JSX? Should be split up?

---

## How to Review

1. Open the component file (see list below)
2. Spend 5-10 minutes reviewing
3. Rate it: Clean / Minor Issues / Major Issues
4. Write 1-2 sentences why
5. Record in the spreadsheet

---

## 30 Components to Review

### EXTREME (10)
1. **UnthemedLogs** - `grafana/public/app/features/explore/Logs/Logs.tsx`
2. **Login** - `mattermost-webapp/components/login/login.tsx`
3. **TableNG** - `grafana/packages/grafana-ui/src/components/Table/TableNG/TableNG.tsx`
4. **Signup** - `mattermost-webapp/components/signup/signup.tsx`
5. **LogsPanel** - `grafana/public/app/plugins/panel/logs/LogsPanel.tsx`
6. **QueryAndExpressionsStep** - `grafana/public/app/features/alerting/unified/components/rule-editor/query-and-alert-condition/QueryAndExpressionsStep.tsx`
7. **ConfigEditor** - Grafana data source config (check for prop drilling)
8. **PostComponent** - `mattermost-webapp/components/post/post_component.tsx`
9. **RulesFilter.v2** - `grafana/public/app/features/alerting/unified/rule-list/filter/RulesFilter.v2.tsx`
10. **ToolbarActions** - `grafana/public/app/features/dashboard-scene/scene/NavToolbarActions.tsx`

### SEVERE (10)
11. **MultiCombobox** - `grafana/packages/grafana-ui/src/components/Combobox/MultiCombobox.tsx`
12. **Search** - `mattermost-webapp/components/search/search.tsx`
13. **AdvanceTextEditor** - `mattermost-webapp/components/advanced_text_editor/advanced_text_editor.tsx`
14. **SelfHostedPurchaseModal** - `mattermost-webapp/components/self_hosted_purchase_modal.tsx`
15. **FlameGraphContainer** - `grafana/packages/grafana-flamegraph/src/FlameGraphContainer.tsx`
16. **VisualEditor** - `grafana/packages/grafana-sql/src/components/visual-query-builder/VisualEditor.tsx`
17. **Step2AlertRules** - `grafana/public/app/features/alerting/unified/components/import-to-gma/steps/Step2AlertRules.tsx`
18. **NavToolbarActions** - `grafana/public/app/features/dashboard-scene/scene/NavToolbarActions.tsx`
19. **UserSelect** - `refine/examples/refine-hr-ce/src/components/layout/sider/user-select.tsx`
20. **Content** - `mattermost-webapp/components/content.tsx`

### MODERATE (10)
21. **DateTimePicker** - `grafana/packages/grafana-ui/src/components/DateTimePickers/DateTimePicker/DateTimePicker.tsx`
22. **CustomStatusModal** - `mattermost-webapp/components/custom_status/custom_status_modal.tsx`
23. **FileAttachment** - `mattermost-webapp/components/file_attachment/file_attachment.tsx`
24. **PostList** - `refine/examples/table-material-ui-table-filter/src/pages/posts/list.tsx`
25. **ConfirmButton** - `grafana/packages/grafana-ui/src/components/ConfirmButton/ConfirmButton.tsx`
26. **RadialBar** - `grafana/packages/grafana-ui/src/components/RadialGauge/RadialBar.tsx`
27. **DataTableFilter** - `refine/packages/refine-ui/registry/new-york/refine-ui/data-table/data-table-filter.tsx`
28. **AnnotationsStep** - `grafana/public/app/features/alerting/unified/components/rule-editor/AnnotationsStep.tsx`
29. **FlameGraphCanvas** - `grafana/packages/grafana-flamegraph/src/FlameGraph/FlameGraphCanvas.tsx`
30. **PropsTable** - `refine/documentation/src/components/props-table/index.tsx`

---

## Recording Your Ratings

Use this CSV format (or Excel/Google Sheets):

```
Component_ID,Component_Name,Your_Rating,Reason
component_01,UnthemedLogs,Major Issues,"1000+ lines with 9 hooks. Too complex."
component_02,Login,Major Issues,"Authentication logic mixed with UI rendering."
component_03,TableNG,Clean,"Complex but well-organized for a table component."
...
```

---

## Tips

- **Don't overthink** - Trust your gut
- **Consider context** - Visualizations can be legitimately complex
- **Focus on maintainability** - Would you want to work on this code?
- **Be consistent** - Use the same standards for all components

---

## Submit

Email your completed CSV to: [researcher email]

**Deadline:** [set 1 week from now]

---

## Questions?

Contact: [your email]

Thank you for your expert review! 🙏
