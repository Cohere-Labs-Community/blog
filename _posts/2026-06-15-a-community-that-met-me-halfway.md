---
layout: distill
title: "A Community That Met Me Halfway"
date: 2026-06-15 01:00:00
description: "The people, projects, and conversations that turned a moment of change into a community I could give back to."
author: "Ankita Maity"
authors:
  - name: "Ankita Maity"
    url: "https://www.linkedin.com/in/ankita-maity/"
    image: "ankita-maity.jpg"
    bio: "Ankita Maity is a Marie Skłodowska-Curie PhD Fellow at Aarhus University, Denmark, focusing on reliability in conversational AI. She is also an affiliate of the Pioneer Centre for AI and a formal collaborator of the Wikimedia Foundation. Before her PhD, she spent 2.5 years working full-time in industry at Hyperbots Inc. and IBM India."
    affiliations:
      name: "Aarhus University"
tags: community research cultural-benchmark multilingual-evaluation open-science
toc: true
---

## Between Chapters

Many early-career NLP researchers discover the [Cohere Labs community](https://cohere.com/research/open-science) during moments of transition, much like I did. I stumbled across the community Discord the summer before I started my PhD, through a post about a summer school that caught my attention - at a time when I was transitioning from industrial ML research back into academic ML research. While I enjoyed the summer school - especially the closing research mentorship session - the Cohere community I discovered through it ended up having an even bigger impact on my work. I reconnected with lab-mates from my MS program and former industry colleagues, while also meeting future colleagues who would help me settle into a new country as I prepared to move across continents. And as Madeline pointed out after I attended the newcomers social event, my research experience across academic and industrial research enabled me to give back and help other members out.

Much of this happened organically through conversations in Discord channels and direct messages - whether by helping students interested in graduate studies or by discussing NLP research with other PhD students. Some of that spilled over into real life! For example, before I arrived in Denmark, I connected online with one of the community leads, Ruchira, who is also pursuing a PhD there. And we were able to meet in person when we both presented posters at the same [workshop](https://sites.google.com/view/benchmarking-and-evaluating-ai) at EurIPS 2025 in Copenhagen!

## A Question, Shared

However, one of the most concrete ways I contributed was through [Expedition Tiny Aya](https://www.notion.so/cohereai/Expedition-Tiny-Aya-2f04398375db804c93c4c9f5fbb94833) - a two-week, mentor-supported research sprint around multilingual language modeling. I submitted a project proposal on a topic I was curious about. Today's ML models can often seem to understand social situations across cultures, such as what counts as rude or polite in different places. But do they really understand cultural context, or do they just react to surface details, like which language users interact in or which country is named in the prompt? And how does this vary across global models and region-specific models? This seemed like a fun direction to explore with the recently released [Tiny Aya](https://cohere.com/blog/cohere-labs-tiny-aya), which is a multilingual open-weight model. And because the topic was closely related to my PhD research, I felt confident that I could captain a team and develop the project together with them. I was excited to find others intrigued by the same question and enjoyed collaborating with Sajag and Van to explore it together. As one of the 40 project proposals selected for this two-week research sprint, we were also mentored by Nikita Moghe from the Cohere team.

Research isn't generally considered to be an easy process. And figuring out how to do research while coordinating across skill levels, across time zones (we were spread across Canada, the UK, Denmark, and Japan!), and within a two-week timeframe was an even harder process. The sprint moved quickly, but by the end we had gathered enough evidence to start forming an answer.

{% include figure.liquid path="assets/img/2026-06-15-a-community-that-met-me-halfway/normad-language-flip.png" alt="Same scenario answered correctly in English but flipped when asked in another language" caption="Same scenario, same correct answer (\"No\") — Tiny-Aya holds in English but flips when the language changes." %}

What we found was more nuanced than we expected. As the example above shows, a model could get a question right in English but flip its answer when we simply asked in another language - and across the benchmark these flips went both ways, so changing languages made models wobbly rather than reliably worse. The bigger surprise was rules: give a model the relevant local norm and it did better, but slip in an official-sounding rule that didn't fit the scene and it would often follow it anyway, talking itself into the wrong answer. And global versus region-specific models? No clean winner - specialization helped in some kinds of situations but not others. This was a two-week sprint on one benchmark ([NormAd](https://huggingface.co/datasets/akhilayerukola/NormAd)) and three countries, so treat it as an early signal, not a complete picture of how models handle culture.

Still, the fact that our work was accepted by two workshops co-located with ACL 2026 and ICML 2026, two of the most prestigious NLP/ML conferences in the world, suggested that our efforts during the sprint paid off. All this would not have been possible without my crew members, Sajag and Van, who drove this to completion. I also owe a lot of thanks to Nikita for helping us out regularly, both asynchronously and synchronously, and to my supervisor Akhil for being supportive of this project. In fact, Akhil and I are thinking of expanding the idea that began as a research sprint into a full paper that may eventually become part of my thesis! If you'd like to learn more about the Expedition work, we'd love for you to stop by our posters at the [StereACuLT workshop](https://sites.google.com/view/stereacult-2026/home) at ACL 2026 or the [Culture x AI workshop](https://www.doingaidifferently.org/culturexaiworkshop) at ICML 2026. You can also explore the [codebase](https://github.com/Cohere-Labs-Community/Cultural-Context-Robustness) on the community GitHub.

## The Kind of Place You Stay

Since then, I've kept finding new ways to contribute. One initiative I'm particularly excited about explores a topic closely related to my Expedition work. We are aiming to create a [multicultural benchmark of riddles](https://cohere-labs-community.github.io/blog/2026/tongueless-lions-and-hallucinating-machines/), which is a large collaborative effort involving many people contributing riddles from languages and cultures they are familiar with. I participated in the riddle-writing part with other native Bengali speakers, including Ruchira, as well as other PhD students. And I am also a part of the Benchmarking and Analysis teams for this project. I am especially excited about the Benchmarking effort because it's being led by my supervisor Akhil and my lab-mate and friend, Tenney.

Looking back, the Cohere Labs community became more than a place I stumbled into before starting my PhD. I joined during a moment of transition, unsure of what my next chapter would look like. Over the past year, it became a place where I found people to think with, learn from, and, when I could, help in return. In the process, I found not only a research community, but a wholesome place where I could contribute meaningfully and help others find their footing too.
