# Curated List of 30 Components for Manual Validation

## Selection Strategy
- **10 Extreme** - Worst offenders (MultiCombobox-level complexity)
- **10 Severe** - Mid-range issues
- **10 Moderate** - Borderline cases

## Distribution by Pattern
- **15 God Components** (60% confidence - real architectural issues)
- **8 Inline Functions** (super accurate with AST detection)
- **5 Prop Drilling** (much more accurate with flow tracking)
- **2 Deep Nesting/useEffect** (for variety)

## Distribution by Repository
- **15 from Grafana** (large-scale production app)
- **11 from Mattermost** (enterprise messaging platform)
- **4 from Refine** (admin panel framework)

---

## EXTREME SEVERITY (10 components)

### 1. UnthemedLogs (Grafana)
- **Pattern:** God Component
- **File:** `public/app/features/explore/Logs/Logs.tsx`
- **Metrics:** LOC=1031, JSX=51, Hooks=9
- **Why Selected:** Largest component found - over 1000 lines!
- **Confidence:** 95% - This is definitely a god component

### 2. Login (Mattermost)
- **Pattern:** God Component
- **File:** `components/login/login.tsx`
- **Metrics:** LOC=783, JSX=35, Hooks=9
- **Why Selected:** Authentication logic is notoriously complex
- **Confidence:** 90% - Login forms often become god components

### 3. TableNG (Grafana)
- **Pattern:** God Component
- **File:** `packages/grafana-ui/src/components/Table/TableNG/TableNG.tsx`
- **Metrics:** LOC=826, JSX=20, Hooks=16
- **Why Selected:** 16 hooks is extreme - state management nightmare
- **Confidence:** 95% - Too many hooks indicates complexity

### 4. Signup (Mattermost)
- **Pattern:** God Component
- **File:** `components/signup/signup.tsx`
- **Metrics:** LOC=700, JSX=39, Hooks=9
- **Why Selected:** Pair with Login for auth pattern analysis
- **Confidence:** 90% - Similar to Login complexity

### 5. LogsPanel (Grafana)
- **Pattern:** God Component
- **File:** `public/app/plugins/panel/logs/LogsPanel.tsx`
- **Metrics:** LOC=616, JSX=15, Hooks=9
- **Why Selected:** Panel components should be simpler
- **Confidence:** 85% - Panels often have legitimate complexity

### 6. QueryAndExpressionsStep (Grafana)
- **Pattern:** God Component
- **File:** `public/app/features/alerting/unified/components/rule-editor/query-and-alert-condition/QueryAndExpressionsStep.tsx`
- **Metrics:** LOC=591, JSX=41, Hooks=11
- **Why Selected:** 41 JSX elements + 11 hooks = complexity bomb
- **Confidence:** 95% - Multiple complexity indicators

### 7. ConfigEditor (Grafana)
- **Pattern:** Prop Drilling
- **File:** Data source config editor
- **Metrics:** 'options' passed 14×, 'onOptionsChange' passed 12×
- **Why Selected:** Extreme prop drilling through config forms
- **Confidence:** 90% - Config forms are prop drilling hotspots

### 8. PostComponent (Mattermost)
- **Pattern:** God Component
- **File:** `components/post/post_component.tsx`
- **Metrics:** LOC=503, JSX=45, Hooks=5
- **Why Selected:** Core messaging component - critical to validate
- **Confidence:** 85% - Posts have many features (reactions, replies, etc.)

### 9. RulesFilter.v2 (Grafana)
- **Pattern:** Inline Function
- **File:** `public/app/features/alerting/unified/rule-list/filter/RulesFilter.v2.tsx`
- **Metrics:** 24 inline functions in JSX
- **Why Selected:** Production code with extreme inline function usage
- **Confidence:** 95% - Real production component, not a test file

### 10. ToolbarActions (Grafana)
- **Pattern:** God Component
- **File:** `public/app/features/dashboard-scene/scene/NavToolbarActions.tsx`
- **Metrics:** LOC=533, JSX=54, Hooks=5
- **Why Selected:** 54 JSX elements is extreme
- **Confidence:** 90% - Toolbars can be legitimately complex

---

## SEVERE SEVERITY (10 components)

### 11. MultiCombobox (Grafana)
- **Pattern:** God Component
- **File:** `packages/grafana-ui/src/components/Combobox/MultiCombobox.tsx`
- **Metrics:** LOC=331, JSX=19, Hooks=10
- **Why Selected:** Already validated as TRUE POSITIVE - baseline
- **Confidence:** 100% - Manually verified

### 12. Search (Mattermost)
- **Pattern:** God Component
- **File:** `components/search/search.tsx`
- **Metrics:** LOC=475, JSX=19, Hooks=5
- **Why Selected:** Search UI with filters and results
- **Confidence:** 85% - Search components often complex

### 13. AdvanceTextEditor (Mattermost)
- **Pattern:** God Component
- **File:** `components/advanced_text_editor/advanced_text_editor.tsx`
- **Metrics:** LOC=448, JSX=28, Hooks=5
- **Why Selected:** Rich text editors are inherently complex
- **Confidence:** 75% - May be legitimately complex

### 14. SelfHostedPurchaseModal (Mattermost)
- **Pattern:** God Component
- **File:** `components/self_hosted_purchase_modal.tsx`
- **Metrics:** LOC=448, JSX=43, Hooks=11
- **Why Selected:** Payment flows with 11 hooks
- **Confidence:** 90% - Payment modals shouldn't be this complex

### 15. FlameGraphContainer (Grafana)
- **Pattern:** God Component
- **File:** `packages/grafana-flamegraph/src/FlameGraphContainer.tsx`
- **Metrics:** LOC=254, JSX=13, Hooks=8
- **Why Selected:** Visualization component - borderline severe
- **Confidence:** 70% - Visualizations can be complex

### 16. VisualEditor (Grafana)
- **Pattern:** Prop Drilling
- **File:** `packages/grafana-sql/src/components/visual-query-builder/VisualEditor.tsx`
- **Metrics:** 'query' passed 5×, 'db' passed 5×
- **Why Selected:** Query builder with prop drilling
- **Confidence:** 85% - Visual editors often drill props

### 17. Step2AlertRules (Grafana)
- **Pattern:** Inline Function
- **File:** `public/app/features/alerting/unified/components/import-to-gma/steps/Step2AlertRules.tsx`
- **Metrics:** 18 inline functions
- **Why Selected:** Production code with many inline functions
- **Confidence:** 90% - Not a test file, real issue

### 18. NavToolbarActions (Grafana)
- **Pattern:** Inline Function
- **File:** `public/app/features/dashboard-scene/scene/NavToolbarActions.tsx`
- **Metrics:** 20 inline functions
- **Why Selected:** Same component flagged for both god + inline
- **Confidence:** 95% - Multiple anti-patterns

### 19. UserSelect (Refine)
- **Pattern:** God Component
- **File:** `examples/refine-hr-ce/src/components/layout/sider/user-select.tsx`
- **Metrics:** LOC=315, JSX=24, Hooks=5
- **Why Selected:** Severe complexity in admin panel component
- **Confidence:** 85% - User selection components can be complex

### 20. Content (Mattermost)
- **Pattern:** God Component
- **File:** `components/content.tsx`
- **Metrics:** LOC=430, JSX=31, Hooks=9
- **Why Selected:** Main content area component
- **Confidence:** 80% - Layout components can be complex

---

## MODERATE SEVERITY (10 components)

### 21. DateTimePicker (Grafana)
- **Pattern:** Prop Drilling
- **File:** `packages/grafana-ui/src/components/DateTimePickers/DateTimePicker/DateTimePicker.tsx`
- **Metrics:** 'date', 'showSeconds', 'timeZone' each passed 3×
- **Why Selected:** Borderline case - 3× is threshold
- **Confidence:** 60% - May be acceptable for date pickers

### 22. CustomStatusModal (Mattermost)
- **Pattern:** God Component
- **File:** `components/custom_status/custom_status_modal.tsx`
- **Metrics:** LOC=364, JSX=22, Hooks=9
- **Why Selected:** Modal with moderate complexity
- **Confidence:** 70% - Modals often have forms

### 23. FileAttachment (Mattermost)
- **Pattern:** God Component
- **File:** `components/file_attachment/file_attachment.tsx`
- **Metrics:** LOC=346, JSX=29, Hooks=5
- **Why Selected:** File upload/preview component
- **Confidence:** 65% - File handling can be complex

### 24. PostList (Refine)
- **Pattern:** God Component
- **File:** `examples/table-material-ui-table-filter/src/pages/posts/list.tsx`
- **Metrics:** LOC=245, JSX=21, Hooks=5
- **Why Selected:** Moderate complexity in list component
- **Confidence:** 70% - List components with filters can be complex

### 25. ConfirmButton (Grafana)
- **Pattern:** Prop Drilling
- **File:** `packages/grafana-ui/src/components/ConfirmButton/ConfirmButton.tsx`
- **Metrics:** 'size' passed 3×
- **Why Selected:** Simple component with minimal drilling
- **Confidence:** 50% - May be false positive

### 26. RadialBar (Grafana)
- **Pattern:** Prop Drilling
- **File:** `packages/grafana-ui/src/components/RadialGauge/RadialBar.tsx`
- **Metrics:** Multiple props passed 3× each
- **Why Selected:** Visualization component
- **Confidence:** 60% - Visualizations pass display props

### 27. DataTableFilter (Refine)
- **Pattern:** Inline Function
- **File:** `packages/refine-ui/registry/new-york/refine-ui/data-table/data-table-filter.tsx`
- **Metrics:** 22 inline functions
- **Why Selected:** Extreme inline functions in table filter component
- **Confidence:** 90% - Production component with many inline handlers

### 28. AnnotationsStep (Grafana)
- **Pattern:** God Component
- **File:** `public/app/features/alerting/unified/components/rule-editor/AnnotationsStep.tsx`
- **Metrics:** LOC=221, JSX=24, Hooks=7
- **Why Selected:** Form step component
- **Confidence:** 65% - Multi-step forms have complexity

### 29. FlameGraphCanvas (Grafana)
- **Pattern:** Inline Function
- **File:** `packages/grafana-flamegraph/src/FlameGraph/FlameGraphCanvas.tsx`
- **Metrics:** 7 inline functions
- **Why Selected:** Canvas component with event handlers
- **Confidence:** 70% - Canvas events often inline

### 30. PropsTable (Refine)
- **Pattern:** Prop Drilling
- **File:** `documentation/src/components/props-table/index.tsx`
- **Metrics:** 'overrides' passed 4×
- **Why Selected:** Moderate prop drilling in documentation component
- **Confidence:** 60% - Documentation components may have different standards

---

## Summary Statistics

### By Severity
- Extreme: 10 (33%)
- Severe: 10 (33%)
- Moderate: 10 (33%)

### By Pattern
- God Component: 15 (50%)
- Inline Function: 8 (27%)
- Prop Drilling: 7 (23%)

### By Repository
- Grafana: 15 (50%)
- Mattermost: 11 (37%)
- Refine: 4 (13%)
- TodoMVC: 0 (0% - no significant detections)

### Confidence Distribution
- 90-100%: 10 components (high confidence)
- 70-89%: 12 components (medium confidence)
- 50-69%: 8 components (low confidence - good for testing boundaries)

---

## Validation Instructions

For each component:
1. Open the file and locate the component
2. Assess if the detection is accurate:
   - **True Positive**: Yes, this is a real issue
   - **False Positive**: No, this is acceptable/necessary complexity
   - **Uncertain**: Could go either way
3. Note why (e.g., "legitimately complex visualization" vs "should be split")
4. Calculate precision: TP / (TP + FP)

Target: >85% precision for thesis credibility

---

## Next Steps

1. ✅ List created with strategic distribution
2. ⏳ Manually validate all 30 components
3. ⏳ Document findings in spreadsheet
4. ⏳ Calculate precision metrics
5. ⏳ Scan Refine and TodoMVC to complete distribution
6. ⏳ Write up results for thesis
