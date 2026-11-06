# Agent-led first chat: framework for personalized recommendations

**Status:** Proposed product framework for engineering and design review  
**Scope:** The server-seeded first Go chat for eligible new users, extended with personalized agent recommendations. This defines the conversation logic and content inputs, independent of the visual layout.  
**Goal:** Every eligible new user meets Go, gets the chance to customize it, revisits their recommended agents and where they show up, tries an agent that works directly in Go, then gets an invitation to add the extension for the others. Grammarly is always the third recommendation, and one of the other two must be usable directly in Go.

## Fit with the existing first-session chat plan

The [current engineering plan](https://docs.superhuman.com/d/Hero-HQ_df3u-Vczv39/Onboarding-first-session-chat_suh1I0E4#_luC2EJ4_) establishes the entry point and chat plumbing: eligible brand-new accounts get a server-seeded chat behind `go_onboarding_chat_seed`; the server stores a fixed opener and one two-question card; answers from the card become normal user messages; the model sees the seed on its first turn; and the client does not create a substitute chat if seeding fails. **Keep these mechanics.** This framework specifies what the seeded chat should *lead to* once recommendations are available.

| Existing plan | Proposed experience layer / implementation delta |
| --- | --- |
| Server writes a fixed opener. | Update that fixed copy to the fuller Go value proposition below. Keep it a controlled template and omit the user's first name, consistent with the existing decision. If an approved role is known at seed time, insert its natural work phrase into the value proposition; otherwise use the general copy. This is seeded copy, not a model-generated greeting. |
| Server writes one shared card asking what help the user wants and where work lives. | Reuse that card unchanged. Put the customization invitation in the fixed opener, above the card, and route **Customize Go** through the existing customization flow/action. Use the existing button treatment for **Not now**. Do not add another introductory card or gated reveal. Report Builder's separate questionnaire appears later if it is the first agent. The shared card can remain visible while the user decides. |
| Card answers are normal user messages; Go acknowledges and asks 1–2 follow-ups. | Use those answers to make the first task relevant. Then have Go introduce the recommended agents in plain text, choose a direct Go agent, and show a result. A follow-up is optional when the answer is already sufficient; the agent introduction should not become an endless interview. |
| One shared question set, no persona variants. | Keep the questions shared. Personalize **after** the user answers by supplying the ranked recommendations and capability data to the conversation. The user should get different agents, not different question cards. |
| Seed and first turn survive reload and appear across devices. | Let the existing chat history preserve the conversation. Read the recommended agent IDs from the existing recommendation source on the first relevant turn; use existing persistence for customization and agent results. Do not introduce a parallel onboarding progress record solely for this experience. |
| New-account eligibility, flag, fail-off behavior, server-before-client rollout. | Leave these launch controls intact. No additional treatment is required by this framework. |

**Proposed order within that architecture:** seeded Go opener with customization invitation → Go reaffirms the chosen name (or that it will stay Go) → existing shared two-question card (or a typed answer) → three-agent introduction → Go says “Now, let’s take a look at your first agent: [agent name].” → an agent-specific spotlight → extension invitation → open chat. Email Assistant's spotlight explains Auto Labels and Auto Drafts in plain text and links to Auto Archive settings. Report Builder's spotlight asks two questions and links to a report document. The shared seed card and Report Builder's questionnaire are separate moments. A freeform user request should always take priority over the guided sequence.

**Important distinction:** The engineering document describes the **current agreed seed**, not this full agent experience. The longer opener copy, customization invitation, recommendation context, spotlight choice, and extension follow-up are content and behavior additions. They do **not** require a new recommendation card, customization card, spotlight card, extension card, or chat shell.

### Reuse the existing UI

| Moment | Existing component or surface to reuse | What changes |
| --- | --- | --- |
| Go introduction and customization invitation | The server-seeded **chat message**; the existing Go customization entry point and standard action buttons. In the local prototype, `PostAgents.jsx` already shows the value proposition and opens `HeroPicker.jsx`. | Update the opener text and placement of the existing action. Do not create a customization artifact or new modal. Confirm the corresponding production entry point before wiring it. |
| First-session questions | The engineer's existing **two-question card**, with its current free-text and typed-chat answer paths. | Keep its component, questions, and submission behavior. The customization invitation can sit in the message above it. |
| Three recommended agents | One normal **Go text message** with a plain `<ul>` / text bullets in the message body. | Substitute recommended names, short descriptions, and where each appears. No agent cards, icons, or carousel in chat. |
| Agent spotlight | Normal Go text and an inline link for Email Assistant; the existing agent task/result presentation for Report Builder. The local prototype links Report Builder to an example report document. | For Email Assistant, explain the inbox behavior and link directly to Auto Archive settings without a questionnaire or sample draft. For Report Builder, the first result after its questions is a link to an actual document, not a plain-text outline. |
| Spotlight questionnaire | For Report Builder only, reuse the existing questionnaire/card pattern and Origin buttons. Show the question, “1 of 2” navigation, answer choices, Skip, and Continue. Omit the eyebrow label and free-text “Your reply” field. | Ask exactly two questions before the report document. Preserve answers when moving between questions. Skipping remains possible. Do not confuse this with the earlier shared seed card. |
| Extension invitation | A normal Go message followed by the existing **Add extension** CTA/button. | Place the CTA directly under Go's message, outside any extension module or card. Trigger it after the agent has shown value, with copy that names the other agents. |

The files above are **local prototype references**, not proof that identically named components exist in production. Engineering should map each moment to its existing product component. Shared routing needs the recommended trio (with Grammarly third), each agent's approved one-line description and in-work location, and direct-Go eligibility. Report Builder's questions and document destination are agent-specific configuration, not a request for new generic UI.

## Start here: the invariant

The first chat follows this order:

1. **Introduce Go:** Position Go as the user's main assistant for work. Go uses what it knows about how they work and the tools they use, and brings in other agents when useful. When the user's role is confirmed, embed it in that proposition (for example, “help with your product work…”). Fall back to the general version if role is missing or uncertain.
2. **Invite customization:** Ask the user to customize Go, with a clear way to continue for now.
3. **Recap all three recommended agents:** Refer back to the agents the user just saw in onboarding. Use plain text bullets in the supplied order, with Grammarly always third. Each bullet says what the agent does and **where it shows up while the user works**.
4. **Spotlight an agent available without the extension:** After the bullets, Go introduces the first agent in its own chat turn. For Email Assistant, describe Auto Labels and Auto Drafts, then offer a direct Auto Archive settings link. For Report Builder, ask two focused questions and link to the report document. There is no “Show me [agent]” CTA. Writing-surface agents that require the extension never lead.
5. **Invite the extension:** After the Email Assistant explanation and settings link or the Report Builder document link, bridge to the writing-surface agents and ask the user to add the extension to see **them and other agents at work**, with a way to defer.

### Go's voice

- Sound like a friendly coworker helping someone get started. Keep it light, familiar, and conversational, using plain words and natural contractions.
- Keep each line crisp and easy to say aloud. Let warmth come from the wording, without extra chatter or forced enthusiasm.
- Skip stock AI openings, corporate phrasing, and em dashes. Vary your wording across turns so the conversation feels attentive and natural.

Use this voice throughout the seeded introduction, customization, agent recap, spotlight transition and questions, result bridge, and extension invitation. Treat the example lines below as conversation shapes to refine against this voice before implementation.

### First-agent behaviors

| Agent | Question 1 | Question 2 | What follows |
| --- | --- | --- | --- |
| Email Assistant | None. | None. | In typed Go text, explain that Auto Labels organize incoming mail by what needs a reply, what is FYI, and what the user is waiting on. Explain that Auto Drafts prepare replies for the user to review, edit, and send. Say Auto Archive can be turned on in settings and link to [Auto Archive settings](https://superhuman.com/mail/settings/archive). Do not imply settings changed during chat. |
| Report Builder | “What kind of report would you like to build?” Options: weekly update, project status, research summary, client report. | “What should the report focus on?” Options: progress/blockers, decisions/next steps, metrics/outcomes, key takeaways. | First show a link to a real report template document generated from the chosen type and focus, as in the supplied screenshot. The document contains fill-in prompts; a real report needs user notes or an authorized source. |

Report Builder's questionnaire is one step at a time, shows “1 of 2” / “2 of 2,” keeps choices when going back, and supports Skip on either question. Continue remains available without a selected option; an unanswered question is treated as deferred. Email Assistant does not ask for configuration or take inbox actions in this chat.

Use **Go** as the speaker (“I’m Go.”). The introduction should state Go's value before naming specialists, without a first-name greeting. Customization is an explicit early invitation; agent configuration and permissions are requested only when needed for a task. The three-agent introduction is text, not cards. The spotlight is where one specialist shows its work.

## Conversation contract

| Beat | Required behavior | Example shape |
| --- | --- | --- |
| 1. Introduce Go | Use a controlled, server-seeded, no-name greeting that positions Go as the main assistant for work. If an approved role is known, weave the role into the value proposition itself. Do not add a separate role claim or guess from a default value. Confirm the wording against launch capabilities. | General: “Hey, I’m Go, your main assistant for work. I get to know how you work and the tools you use, so I can help with your work and bring in other agents when they’re useful.” Known Product role: “Hey, I’m Go, your main assistant for work. I use what I know about how you work and the tools you use to help with your product work. I bring in other agents when they’re useful, and I keep learning as we work together.” |
| 2. Ask to customize Go | Include the invitation in the seeded message before the existing question card. Use the existing customization action and standard buttons. After Save, have Go explicitly repeat the chosen name before continuing; if the user skips, confirm Go will keep its current name. | “First, what would you like to call me?” **Customize Go** · **Not now** → “Perfect, Nova it is. I’ll go by Nova from here on.” |
| 3. Recap all three agents | Say these are the agents just recommended in onboarding, then use plain text bullets in the supplied order, with Grammarly third. Each gives a short job description and the surface/cue where it appears. Do not claim a personal match without an approved reason. | “Here’s a quick recap of the agents we recommended for you: • Email Assistant — Drafts replies and helps handle inbox actions. It shows up in your inbox. • Reader Reactions — Shows questions readers may have about your draft. Open it from the side panel while you write. • Grammarly — Catches writing issues. Look for underlines wherever you write.” |
| 4. Spotlight an agent | Filter out agents that rely on Assist, then have Go introduce the chosen agent in one short chat line. Explain Email Assistant's inbox behavior and link to Auto Archive settings, or ask Report Builder's two questions and link to its document. Do not insert a “Show me [agent]” button. | “Now, let’s take a look at your first agent: Email Assistant.” |
| 5. Add extension | After the spotlight, give the first agent a short closing line, then explain that the other agents work where the user writes. Put a standalone **Add extension** CTA below the message, outside an extension module. Keep progress if they defer. | “That’s what to look for in your inbox. Reader Reactions and Grammarly can help where you write.” → “Add the Go extension to see them and other agents at work.” **Add extension** · **Not now** |

**Pacing:** Go's introduction and customization invitation come first. The existing shared two-question card then provides task context. After customization, type in the name confirmation, recap line, each recommendation bullet, and the single-line first-agent transition in sequence. Email Assistant's explanation and settings link follow that transition; Report Builder's questionnaire appears instead. Then show the report document link and extension invitation. Honor reduced-motion preferences by showing text immediately. Avoid adding a second guided agent demo unless the user chooses it.

## Selecting the spotlight agent

The recommendation service supplies a **valid three-agent list**: Grammarly in the third slot, and **at least one of the first two usable directly in Go**. The other two retain their recommendation order. Validate these conditions upstream, before the trio is presented or passed to chat; chat does not infer eligibility from agent names. Recap all three in supplied order, then choose the eligible direct-Go agent by first-value readiness and product priority. **Email Assistant and Report Builder are the only confirmed direct-Go agents in this set.** A future custom agent can qualify after its chat interaction is ready. Preserve list order in the recap even when the spotlight goes to the second recommendation.

**Never choose an extension-dependent agent as the first spotlight, even when it is the first recommendation.** Reader Reactions, AI Rewriter, and Humanizer are opened from the side panel while the user writes and require the extension. Grammarly works where the user writes through underlines and also requires the extension. AI Detector and Plagiarism Checker work wherever the user writes and require the extension; their specific trigger/cue still needs owner confirmation. Coursework Helper and Resume Builder do not have a confirmed direct-Go first-chat experience and are ineligible until that is established. A trio with no eligible direct-Go agent violates the recommendation contract; if one reaches chat anyway, skip the “first agent” line and offer an honest fallback rather than inventing a demo.

| Agent | Where it works / how the user finds it | Extension required? | First-chat spotlight? |
| --- | --- | --- | --- |
| Email Assistant | In the inbox, where Auto Labels and Auto Drafts appear. The first chat explains them and links to Auto Archive settings. | No extension needed for the explanation or settings link. | Yes, when the information and settings destination are ready. |
| Report Builder | In Go chat. | No. | Yes, when ready. |
| Future custom agents | Expected to work in Go chat; confirm per agent. | Confirm per agent. | Only after a direct chat interaction exists. |
| Reader Reactions, AI Rewriter, Humanizer | Wherever the user writes; the user opens each from the side panel. | Yes. | No. |
| Grammarly | Wherever the user writes; underlines appear in supported fields. Always third in the recommendation list. | Yes. | No. |
| AI Detector, Plagiarism Checker | Wherever the user writes; the exact trigger still needs confirmation. | Yes. | No. |
| Coursework Helper, Resume Builder | Location and launch interaction still need confirmation. | Unconfirmed. | No, until a direct chat path is confirmed. |

1. **Email Assistant is first:** explain Auto Labels and Auto Drafts in plain text, then link to Auto Archive settings. No inbox access or simulated result is required for this expectation-setting spotlight.
2. **Small user input would unlock a result:** ask for that input with a specific payoff, such as the report type and focus needed to create a report template. Keep the first spotlight within an agent usable without the extension.
3. **A custom agent has a real result or sample view:** show an existing artifact or linked document. Label a sample **Example**. If the agent has no usable input, artifact, or document path, choose another eligible agent.
4. **Invalid trio with no eligible direct agent:** do not spotlight an extension-dependent agent or fabricate a personalized finding. Explain where the recommended agents work and offer the extension as a recovery path; log the invalid recommendation set for correction upstream.

Do not select an agent that requires an unavailable connector, missing document, or ungranted permission for a live result. Never turn a sample into a claim about the user's actual inbox, writing, coursework, or company information.

## Data and content contract

The chat needs enough data to write the three bullets and choose an existing direct interaction. This is **content/routing data**, not a proposal for a new UI component or generic artifact renderer. Adapt it to the recommendation API's existing shape rather than introducing this type verbatim.

```ts
type Recommendation = {
  agentId: string;
  rank: number;
  introBenefit: string;            // One-line task benefit for the three-agent introduction
  whereItShowsUp: string;          // Approved description of the surface/cue in the user's work
  interactionSurface: 'go' | 'writing_surface' | 'unconfirmed';
  canStartInGo: boolean;           // True only if its existing Go interaction is usable now
};
```

Pass the ranked list and selection constraints into the model's first relevant turn through the existing recommendation path; do not rely on the model guessing agents from the two card answers. For the seeded opener, use a confirmed role only when one is available from the approved profile source; an app default or unconfirmed inference does not qualify. Map supported role values to approved, natural work phrases and use the general opener for unknown or unsupported values. The existing chat history and customization state should tell Go which parts have happened. If that state is unavailable, avoid replaying scripted prompts rather than adding a new onboarding state store for this framework.

Any personal reason and real result must come from approved recommendation/result services. Copy should not assemble a personal claim from a raw behavioral threshold. The screenshot's “Recommend To” column is a planning taxonomy, **not** permission to tell an individual which behavior was observed. If no approved reason is available, use a capability-based invitation such as “You can use Reader Reactions to see where a draft may raise questions.”

## Agent playbook for the current candidate set

The agent names below come from the earlier recommendation screenshot and subsequent user direction. Knowledge Checker is excluded from this recommendation set per the updated direction; Grammarly and Report Builder are included. Grammarly is always third. The writing-surface locations and extension requirements above are confirmed by product direction; remaining surfaces, recommendation policy, and sample content need owner confirmation. “First value” below means value in **that agent's own surface**; only agents marked eligible in the location table can provide the first chat spotlight. These examples are not promises that data already exists.

| Agent | Smallest credible first value | Required input or access | Primary user action / guardrail |
| --- | --- | --- | --- |
| Coursework Helper | A short plan that orders assignments by due date and effort, or an editable plan from user-entered tasks. | Assignment list or authorized coursework source. | “Use this plan” / “Adjust priorities.” Do not invent deadlines. |
| AI Detector | A review of a pasted draft with specific passages to inspect and an explanation of limits. | User-supplied writing. | “Review the flagged passages.” Do not present a score as proof of authorship or academic integrity. |
| Plagiarism Checker | A check of a supplied draft with any matched passages and linked sources. | User-supplied writing and an available checking service. | “Review matches.” Explain coverage and avoid a blanket “original” claim. |
| Humanizer | A before/after rewrite of a short passage in a more natural voice. | User-supplied text. | “Use rewrite” / “Try another tone.” Preserve meaning; avoid claims about evading detection. |
| AI Rewriter | Two distinct rewrites of one passage for a stated purpose. | User-supplied text and optional tone goal. | “Use this version” / “Refine.” Keep facts intact. |
| Email Assistant | Explain what Auto Labels and Auto Drafts will do in the inbox, then link to Auto Archive settings as an optional next step. | No inbox data is needed for this explanatory spotlight. | Open Auto Archive settings. The chat does not change settings or take inbox actions. |
| Reader Reactions | A preview of likely reader questions or confusing spots in a supplied draft. | User-supplied document plus optional audience. | “Revise this section” / “Change audience.” Frame reactions as suggestions, not measured reader behavior. |
| Resume Builder | A targeted resume edit against a job description, showing what changed and why. | Existing resume and target job description. | “Review edits” / “Change target role.” Do not claim hiring outcomes. |
| Grammarly | A visible writing suggestion on an underlined passage. | Text in a supported writing surface. | “Review suggestion” / “Dismiss.” Do not imply every app or field supports underlines unless confirmed. |
| Report Builder | A linked report template document with sections shaped by the two answers; later, a report draft from user notes. | Report type and focus for the template; notes or an authorized source for a factual draft. | Open the linked document. Can lead the first chat when its direct Go interaction is ready. |

The image also shows different audience criteria (students, active email users, professionals, job seekers). Those criteria should determine *which three agents appear* upstream. The chat uses the supplied trio and order; it should also degrade gracefully if the service returns fewer than three.

## Two example paths

**Recommended trio: Email Assistant, Reader Reactions, Grammarly; email is connected**

> **Go (seeded):** “Hey, I’m Go, your main assistant for work. I get to know how you work and the tools you use, so I can help with your work and bring in other agents when they’re useful.”  
> **Go:** “First, what would you like to call me?”  
> **Actions:** **Customize Go** · **Not now**  
> **Go, after customization:** “Perfect, Nova it is. I’ll go by Nova from here on.”  
> **Shared card:** “What would you most like help with?” / “Where does your work live?” (Gmail, Google Docs, Slack, Superhuman Docs, Other; free-text also accepted.)  
> **User:** Answers the card or types a request. Go acknowledges it and asks only for missing context.  
> **Go:** “Here’s a quick recap of the agents we recommended for you:”  
> • **Email Assistant** — Drafts replies and helps handle inbox actions. It shows up in your inbox.  
> • **Reader Reactions** — Shows questions readers may have about your draft. Open it from the side panel while you write.  
> • **Grammarly** — Catches writing issues and suggests edits. Look for underlines wherever you write.  
> **Go:** “Now, let’s take a look at your first agent: Email Assistant.”  
> **Go:** “Email Assistant adds labels to incoming messages, so you’ll see what needs a reply, what’s FYI, and what you’re waiting on.”  
> **Go:** “It also prepares replies in your voice as drafts. You can review, edit, and send them when you’re ready.”  
> **Go:** “Want to auto-archive lower-priority mail? You can turn that on in your settings.”  
> **Link:** [Open Auto Archive settings](https://superhuman.com/mail/settings/archive)  
> **Go:** “That’s what to look for in your inbox. Reader Reactions and Grammarly can help where you write. Add the Go extension to see them and other agents at work.”  
> **Actions:** **Add extension** · **Not now**

**Recommended trio: Reader Reactions, Email Assistant, Grammarly; Reader Reactions is ranked first**

> **Go (seeded):** “Hey, I’m Go, your main assistant for work. I get to know how you work and the tools you use, so I can help with your work and bring in other agents when they’re useful.”  
> **Go:** “First, what would you like to call me?”  
> **Actions:** **Customize Go** · **Not now**  
> **Go, if skipped:** “I’ll stay Go for now. You can customize me anytime.”  
> **Shared card:** “What would you most like help with?” / “Where does your work live?” (Gmail, Google Docs, Slack, Superhuman Docs, Other; free-text also accepted.)  
> **User:** Answers the card or types a request. Go acknowledges it and asks only for missing context.  
> **Go:** “Here’s a quick recap of the agents we recommended for you:”  
> • **Reader Reactions** — Shows questions readers may have about your draft. Open it from the side panel while you write.  
> • **Email Assistant** — Drafts replies and helps handle inbox actions. It shows up in your inbox.  
> • **Grammarly** — Catches writing issues and suggests edits. Look for underlines wherever you write.  
> **Go:** “Now, let’s take a look at your first agent: Email Assistant.”  
> **Go:** Explains Auto Labels and Auto Drafts in short, typed messages, then says the user can turn on Auto Archive in settings.  
> **Link:** [Open Auto Archive settings](https://superhuman.com/mail/settings/archive)  
> **Go:** Bridges from the inbox to Reader Reactions and Grammarly where the user writes, then invites the extension.  
> **Actions:** **Add extension** · **Not now**

These are copy patterns and sample scenarios. Bracketed fields require real data; any sample must be visibly labeled. The second path demonstrates that recommendation order and first spotlight order can differ.

**Recommended trio: Report Builder, Reader Reactions, Grammarly; no report source connected**

> **Go:** Recaps the three agents in plain bullets, including Report Builder in Go chat, Reader Reactions in the writing side panel, and Grammarly underlines wherever supported.  
> **Go:** “Now, let’s take a look at your first agent: Report Builder.”  
> **Questionnaire:** “What kind of report would you like to build?” (Weekly update; Project status; Research summary; Client report.) Then “What should the report focus on?” (Progress and blockers; Decisions and next steps; Metrics and outcomes; Key takeaways.)  
> **Artifact/link, immediately after answers:** “Created your [Project Status Report Template](sprint-onboarding/report-template.html) with fill-in prompts for progress, blockers, decisions, next steps, timeline, and owners.” The link must open a real document or existing product artifact. The linked local example is a prototype reference; production should create or link the actual document.  
> **Go:** Bridges to Reader Reactions and Grammarly where the user writes, then invites the extension.  
> **Actions:** **Add extension** · **Not now**

## Recovery and edge cases

- **No recommendations:** Still introduce Go and offer customization, then explain that agents are not ready yet and offer general task starters. Do not imply a personalized lineup exists.
- **Fewer than three recommendations:** Introduce every returned agent and its actual in-work surface. Do not invent missing agents or use “three” in the copy.
- **Three recommendations:** Introduce all three before the spotlight. Keep all three accessible while one agent demonstrates value.
- **Invalid extension-only trio:** This should be blocked or corrected by recommendation selection before the chat. If it reaches chat, recap the agents, omit the direct-Go spotlight, invite the extension, and record the contract failure. Do not choose a writing-surface agent as a substitute chat demo.
- **Missing permission or connection:** Offer the smallest alternate route (paste text, connect source, or labeled example). Explain what access would enable and let the user defer it.
- **Agent fails or times out:** Keep the user's input, explain the failure plainly, offer **Try again**, and give a task-level alternative. Do not claim the result was produced.
- **User changes agent or asks a freeform question:** Stop the guided script, retain the current artifact in the chat, and respond to the new intent.
- **Sensitive results:** Results from AI Detector, Plagiarism Checker, and Reader Reactions must disclose uncertainty/coverage in the result itself.

## What engineering can implement first

1. Keep the existing server seed, eligibility, flag, persistence, and card-answer-as-message path. Replace the fixed opener copy with an approved no-name Go introduction that includes a confirmed role in its value proposition when available and uses the general version otherwise.
2. Add the customization invitation and existing action to the seeded message above the existing two-question card. Preserve the card's questions, free-text route, and normal-message submission. The card need not wait for a customization decision.
3. Supply the recommended agent IDs, rank, approved one-line descriptions, in-work locations, and direct-Go eligibility through the existing recommendation source. Before presentation, validate that each trio has Grammarly third and at least one of the first two ready for a direct-Go interaction. Use those fields in the first relevant model turn.
4. In the existing chat, explicitly confirm the user's chosen Go name (or reaffirm Go after a skip), then type in the recap and its plain-text agent bullets one at a time. Go then says “Now, let’s take a look at your first agent: [name].” in one chat line, without a “Show me [agent]” CTA. For Email Assistant, type the Auto Labels and Auto Drafts explanation, then show the Auto Archive settings link. For Report Builder, show the two-question agent-specific questionnaire when the transition finishes typing and use its answers to link to the report document. After either spotlight, bridge to the writing-surface agents and place a standalone **Add extension** CTA beneath Go's message, outside any module/card. Handle an extension-only lineup by moving to the extension invitation without a fake demo or the “first agent” line.
5. Review both Email Assistant and Report Builder paths using existing product components. The local `PostAgents.jsx` chat shell, `HeroPicker.jsx` customization flow, linked `report-template.html`, normal chat hyperlink, and Origin `ButtonAsLink` for the standalone extension CTA are prototype references. Map them to production components and a real document destination before implementation.
6. Instrument the major beats using the existing analytics pattern: `first_chat_started`, `go_customization_chosen_or_skipped`, `shared_questions_answered`, `three_agents_introduced`, `spotlight_agent_shown`, `first_value_shown`, `extension_invited`, and `extension_chosen_or_deferred`. Exclude document/email contents from event payloads.

### Acceptance criteria

- Every supported recommendation set (zero, one, multiple, and reordered agents) enters a coherent chat without hardcoded Email Assistant copy.
- The server-seeded, no-name Go value proposition and customization invitation appear above the existing shared two-question card. A confirmed role is mentioned naturally inside the value proposition; missing, defaulted, or uncertain roles use general copy. After the card or typed answer, Go introduces the full recommended trio in plain text bullets, routes to a direct Go agent, and invites the extension after value is shown.
- The existing new-account flag and fail-off behavior still determine whether this chat is created; a reload or second device shows the same stored chat without duplicate seed content.
- Each bullet uses the actual agent name, a brief description of what it does, and a concrete in-work location/cue; the introduction has no cards.
- After the bullets, Go introduces the first agent in a normal chat message, then follows the Email Assistant or Report Builder path without requiring a reveal CTA.
- The first-agent line includes the agent name in the same line; it types in before the explanation or questionnaire appears. The name confirmation, recap, and bullets also type in sequentially. Reduced-motion settings reveal them immediately.
- Report Builder's questionnaire uses one question at a time, “1 of 2” / “2 of 2,” answer choices, Skip, and Continue; it retains answers on Back and omits the eyebrow and “Your reply” field. It is separate from the server-seeded shared card.
- Grammarly is present in the third slot of every three-agent recommendation set. The other two retain their supplied order.
- The first spotlight agent comes from the recommendation payload, does not require the extension, and can support the displayed task in its current capability state. In the current set, only Email Assistant and Report Builder qualify; future custom agents need a confirmed direct chat path.
- Every normal three-agent lineup includes Grammarly third and at least one ready direct-Go agent in the first two slots. An invalid extension-only lineup never produces a fake chat spotlight and is surfaced for upstream correction.
- Email Assistant's first spotlight uses plain text to explain Auto Labels and Auto Drafts, then offers a hyperlink to Auto Archive settings. It asks no setup questions, shows no sample draft, and does not claim to have changed inbox settings.
- Report Builder's first result is a link to an actual document shaped by its two answers. A plain-text outline is insufficient; a missing result never masquerades as generated work.
- Report Builder asks its two focused questions before the document link; Go customization remains the earlier, explicit step. No broad account setup blocks the spotlight.
- The extension invitation follows a short bridge from the first agent, uses “see them and other agents at work” language, and appears as a Go message with a standalone **Add extension** CTA below it; no extension module/card is rendered.
- The user can act on the result, defer the extension, switch agents, or type freely, and their input/progress survives those transitions.
- Agent-specific uncertainty, source, access, and action rules are honored.

## Decisions to confirm before implementation

1. Which recommendation service owns ranking, reason copy, and eligibility at chat entry?
2. Which future custom agents have a usable first result or sample view in Go? Keep those without one in the introduction but out of the spotlight. Email Assistant uses its explanatory path and settings link.
3. Which artifacts and actions are in launch scope for each agent, especially the checkers?
4. Which custom agents will have a direct Go chat interaction at launch, and what action permissions does Email Assistant have in the inbox?
5. Which existing production customization entry point should **Customize Go** open, and does it return the user to this chat? The local `HeroPicker.jsx` is a prototype reference only.

## Copy-paste brief for engineering

> Extend the existing server-seeded first-session Go chat using its chat message, shared two-question card, normal-message answer path, stored history, and launch flag. Update the controlled no-name opener to position Go as the user's main assistant for work, using what it knows about their ways of working and tools, and include an invitation to use the existing Go customization action; keep the shared card below it and let the user answer directly. If the approved profile source supplies a confirmed role, weave its work phrase into that value proposition (for example, “help with your product work”); use the general introduction when the role is missing or uncertain. Do not treat a default value as detected. After customization, Go reaffirms the chosen name or says it will stay Go for now. Type in that confirmation and the subsequent chat copy in a readable sequence; honor reduced-motion settings.
>
> Before presenting recommendations, require a three-agent lineup with Grammarly fixed in the third slot and at least one of the first two ready for a direct Go interaction. Recap the agents just recommended in onboarding in one plain-text bullet list, each with a brief description and where it appears while the user works. Read the validated trio and direct-Go eligibility from the recommendation source; do not hardcode an Email Assistant lineup. Go then says **“Now, let’s take a look at your first agent: [agent name].”** as one typed chat line. Do not add a **“Show me [agent]”** CTA. Email Assistant continues with typed explanations and a settings link; Report Builder continues with the existing two-question questionnaire, one question at a time, “1 of 2” / “2 of 2,” choices, Skip, Continue, and retained answers on Back. Omit the eyebrow and “Your reply” field.
>
> For Email Assistant, explain Auto Labels and Auto Drafts in plain text, then tell the user they can turn on Auto Archive in settings and provide a direct hyperlink to `https://superhuman.com/mail/settings/archive`. Do not ask the earlier auto-archive or draft setup questions, show a sample draft, or imply the chat changed email settings. For Report Builder, ask the report type and focus, then first show a hyperlink to an actual report template document with fill-in prompts derived from those answers. A plain-text outline alone does not count as its first result.
>
> Email Assistant and Report Builder are the only confirmed first-spotlight agents. Reader Reactions, AI Rewriter, Humanizer, Grammarly, AI Detector, and Plagiarism Checker work where the user writes and require the extension, so they never lead the first spotlight, even if ranked first. The first three open in the side panel; Grammarly appears through underlines. The trigger for AI Detector and Plagiarism Checker still needs confirmation. Future custom agents qualify only once a direct Go chat interaction and usable result path exist. Knowledge Checker is excluded from this recommendation set.
>
> After the Email Assistant explanation and settings link or the Report Builder document link, Go bridges to the writing-surface agents: **“Add the Go extension to see them and other agents at work.”** Place the standalone **Add extension** CTA directly below that Go message, outside any extension module or card, with **Not now** available. If an invalid extension-only lineup reaches chat, skip the spotlight and first-agent line, invite the extension, and record the recommendation failure for upstream correction. Reuse production components and chat history; do not create agent cards, a generic spotlight artifact, an extension card, a customization gate, or a separate onboarding state store.
