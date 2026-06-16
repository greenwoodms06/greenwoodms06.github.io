---
title: 'Critical Heat Flux: the Groeneveld lookup table'
summary: The 2006 Groeneveld CHF lookup table (and assorted correlations) implemented in Excel, MATLAB, and Python.
date: 2016-03-03
tags: [nuclear, thermal-hydraulics, matlab, python, excel]
thumbnail: ./boiling-curve.svg
repo: https://github.com/greenwoodms06/2006_Groeneveld_CriticalHeatFlux_LUT
authorship: human
relatedPosts: []
---

**What it is.** A multi-language implementation of the 2006 Groeneveld Critical Heat Flux (CHF) lookup table — the standard tabulated reference for predicting
the heat flux at which boiling crisis (departure from nucleate boiling) sets in
for water-cooled rod bundles — plus a handful of assorted CHF correlations.

**Why.** The Groeneveld table is a go-to CHF reference in thermal-hydraulics,
but it ships as printed tables, not code. This packages it up so you can actually
call it — from a spreadsheet, from MATLAB, or from Python.

## What's in it

- **Excel / VBA** (`.xlsm`) — an interactive workbook (ActiveX controls) for quick
  lookups.
- **MATLAB** — a text-file-driven implementation of the same table.
- **Python** — a version built on the SDF data format.
- **Assorted correlations** — additional CHF correlations beyond the table itself.

It's a reference utility rather than a solver — the small tool you reach for
repeatedly. The underlying table is from Groeneveld et al., *"The 2006 CHF
look-up table"* (Nuclear Engineering and Design, 2007).
