---
layout: distill
title: "FeatureGraph: automating and standardizing scientific and engineering timeseries analysis"
date: YYYY-MM-DD HH:MM:SS
description: "Scientists and researchers carry out a lot of repeated ad hoc coding work and end up with data artifacts that diverge and create multiple sources of truth; FeatureGraph can start to solve the problem by standardizing researcher work."
author: "Nazia Habib"
authors:
  - name: "Nazia Habib"
    url: "https://www.linkedin.com/in/naziahabib"
    image: "nazia-habib.png"
    bio: "Nazia Habib is a research engineer and data scientist building FeatureGraph, a framework for generative scientific data analysis using cost-effective language models. She specializes in the verification and behavioral compliance of automated systems."
    affiliations:
      name: "Cohere Labs Community"
tags: community research writing
toc: true
---

## The problem we want to wolve

Scientific and engineering timeseries data analysis is not standardized, which means researchers carry out a lot of repeated ad hoc coding work and end up with data artifacts that diverge and create multiple sources of truth. FeatureGraph can start to solve the problem by standardizing researcher work and creating a single source of truth for computed and derived analysis.

Here's a familiar experience for a lot of researchers and data scientists:

**Researcher work and ad hoc analysis gets thrown away, forgotten, and carried out again and again.** The same people on the same team are writing slightly different code, the same problems are being solved over and over, and boilerplate code gets reused in slightly different forms. Code regularly gets written to be used for one analysis or study and called up again months later, and often the work is saved in a notebook using outdated code on previous versions of the data, broken dependencies, or logic that no longer applies. 

**Divergent data sources create multiple sources of truth.** Teams sometimes try to sidestep the problem of disposable code buried in notebooks by creating reusable centralized code libraries. But disposable code is only part of the issue. The other, far more consequential part is the data artifacts teams create, including not only static files but databases and data services accessible to downstream users. These created artifacts, which all serve as sources of truth, get handed around, diverge from each other, and get recreated with different expectations. 

**Computations and derivations disagree and are therefore not trusted.** A research team within an organization makes its own decisions on computation parameters, and those decisions are often not cross-compared with those of other research groups. When different teams give slightly or even significantly different answers to the same question, there is not always an obvious way to track where the disagreement came from. 

**The problem is invisible until it isn't.** Timeseries derivations slowly and imperceptibly become less trustworthy the less reproducible they are and the more potential sources of truth exist. A team only becomes aware of the scope of the problem when a study or report expected to take hours to produce ends up taking days or weeks because the "correct" numbers have to be hunted down.

## The project

FeatureGraph proposes to build a solution for two aspects of the problem: the repeated construction of derivations from timeseries scientific and engineering data, and how that derived work is accessed. It provides a persistent store both where raw timeseries data is automatically processed and summarized and where the results of previous analysis work are verified, recorded, and immediately available as one source of truth. 

Research teams run analyses and derive results the same way every time, using explicit sets of construction assumptions. They query the results of each analysis from one place where its provenance is clearly defined. Provenance, assumptions, and accuracy can be tracked and verified by construction.

By coupling construction and access, assumptions can be changed and a study rerun from the same access point with minimal work. Even studies that genuinely need to be carried out multiple times in slightly different ways are all recorded, stored, and accessed from the same source. An analysis on the same data that needs different smoothing window parameters, sampling intervals, or summary-level filters creates a new defined study, so the difference is visible and recorded. 

An additional benefit of using FeatureGraph is the ability to natively automate research tasks with AI agents in constrained workflows, allowing language models to construct and use the same derived studies as human researchers. Ongoing development on this is discussed in later sections.

## How it works

FeatureGraph takes a raw timeseries recording or data column and produces an object-level summary. An object is an identifiable event in a timeseries signal described by properties like its height, duration, and shape. The example below illustrates how a timeseries oscillation signal such as human breathing can be split into individual waves, each called an object.

The same object creation logic gets applied to other oscillatory behaviors like pressure changes in an industrial reactor or mechanical pulses from a rotating drill string. Object construction depends only on the shape of the signal and not on outside context, so the process is domain-agnostic and the accuracy of the derived properties can be traced directly back to the construction parameters, such as smoothing window sizes and detected periodicity of the wave.

Non-oscillatory signal behavior patterns are also in use as object construction templates, and objects other than individual waves can be created from oscillatory signals, but that is not discussed in this post.

BIDMC and CapnoBase are two public datasets of respiration recordings that measure breathing using different signals and sampling frequencies. FeatureGraph works in one-second intervals for both datasets, so the same measures can be computed on each. 

{% include figure.liquid path="assets/img/breaths.png" alt="Two breath objects" caption="Raw respiration data gets converted to two breath objects." %}

In this case the constructed objects are the two breaths from a BIDMC recording. The accuracy of the objects is inspectable and verifiable at the point of construction. Because the construction depends only on the shape of the signal and not on outside context, the results can be traced back to the construction parameters. Each summary is stored and can be queried through the data service.




