---
name: agent-recommendations-first-chat
description: Implement or revise Go's first chat after personalized agent recommendations, including recommendation recap, direct-Go spotlight selection, Email Assistant expectations or Report Builder questions, and extension invitation. Use for this onboarding flow, not for general agent ranking or other chat experiences.
---

# Agent recommendations in Go's first chat

Use the [engineering framework](references/agent-led-chat-framework.md) as the source of truth for copy, data contracts, examples, edge cases, and acceptance criteria. Read the relevant sections before editing implementation. Fit changes into the existing first-session chat architecture and existing product components.

## Outcome

Every eligible new user should meet Go, customize it, recognize the three agents just recommended to them, try one agent immediately in Go, and know how to see the others where they work. The experience must still deliver a useful first result when the recommendation lineup varies.

## Sequence

1. Introduce Go as the user's main assistant for work. Describe how it uses what it knows about how they work and the tools they use. Mention a role only when an approved source confirms it; otherwise use the general introduction. Keep the opener controlled and server-seeded in production.
2. Invite customization using the existing action. After the user customizes or skips, type in a short confirmation of that choice.
3. Recap the three agents previously recommended. Use plain text bullets, not agent cards. Each bullet states what the agent does and where the user sees or opens it.
4. Go introduces the first agent without a “Show me” CTA. Select a recommended agent that works without the extension. For Email Assistant, explain Auto Labels and Auto Drafts in plain text, then link to Auto Archive settings as an optional action. For Report Builder, ask exactly two focused questions with the existing questionnaire pattern, then link to an actual report document shaped by the answers.
5. Bridge from that result to the remaining agents. Offer the existing **Add extension** CTA outside a module so the user can see them and other agents at work. Let the user defer.

Go's messages should type in sequentially at the existing chat pace. Honor reduced motion. Use a friendly coworker voice: plain words, natural contractions, crisp lines, and no forced enthusiasm, corporate phrasing, or em dashes.

## Recommendation and spotlight contract

- The recommendation service supplies exactly three ordered agents, with **Grammarly third** and at least one of the first two usable directly in Go. Preserve the supplied order in the recap even if the spotlight agent is second.
- Email Assistant and Report Builder are the confirmed direct-Go spotlight agents. A custom agent qualifies only after it has a working chat interaction and a tangible first result.
- Never spotlight Reader Reactions, AI Rewriter, Humanizer, Grammarly, AI Detector, or Plagiarism Checker first. They require the extension and work where the user writes. Reader Reactions, AI Rewriter, and Humanizer are triggered from the side panel; Grammarly appears through underlines. Do not imply those agents run inside Go chat.
- Email Assistant appears in the inbox. Describe how Auto Labels organize incoming messages and Auto Drafts prepare replies for review. Do not ask setup questions or show a sample draft in this spotlight. Tell the user they can turn on Auto Archive in [settings](https://superhuman.com/mail/settings/archive), using a direct hyperlink. Do not imply the chat changed inbox settings.
- Report Builder works in Go chat. Ask for report type and focus, then link to a report template document shaped by the answers. A factual report requires user notes or an authorized source.
- If an invalid extension-only lineup reaches chat, do not invent a direct-Go demo. Offer an honest recovery path and record the recommendation error upstream.

## Implementation checks

- Keep the existing server-seeded chat, shared first-session card, normal-message answer path, history, and launch flag. Report Builder's later two-question questionnaire is a separate step.
- Reuse existing chat messages, questionnaire, artifact or document, customization action, and CTA components. Do not add onboarding-specific recommendation or extension cards.
- Test at least one lineup where the first recommendation is extension-dependent and the direct-Go agent is second. Confirm Grammarly remains third, the recap order stays intact, Email Assistant shows its expectations and settings link without a questionnaire, Report Builder's answers shape its document, and the extension CTA follows the spotlight.
- Treat prototype sample data as examples. Do not claim a real finding from the user's inbox, writing, or connected tools without the necessary data and permissions.
