Citizen-representative interaction happens through public comments and status updates by design — private messaging would undermine the transparency the platform is built around

# Defense possible questions and answers

## What exactly is the representative's job?

A Representative is a verified resident responsible for tracking issues in their one assigned community and publicly updating their status — Reported → Under Review → Action Planned → In Progress → Resolved — with a message explaining what happened at each stage. They don't personally fix roads or install streetlights; they follow up with whoever actually can, and keep the community informed. Think of it as a civic liaison role, not a contractor.

## Why are there no organizations that can fix the issues on the site?

I initially designed a full Organization/Agency routing system — issues auto-assigned to the responsible utility or department. I scoped it out because it added significant complexity (jurisdiction matching, a self-service org registration flow, a deeper routing layer) without strengthening the platform's core purpose: giving citizens visibility and giving someone accountable publicly. The Representative model achieves the accountability goal with far less overhead, and the architecture doesn't prevent adding organizations later — it's a scope decision, not a limitation.

## Why can't you message other people on the site, or see their profile?

Private messaging was deliberately excluded. CivicPulse is built on public accountability — every interaction between a citizen and a representative happens through comments and status updates that the whole community can see. Private DMs would let a representative quietly placate individual complainers instead of answering publicly, which undermines the entire transparency model. If someone wants a representative's attention, they comment on the issue — on the record.

## Why can't a group be created on the site?

Groups imply private, closed membership — which again cuts against the public, open-discussion model. Every issue's comment thread already functions as the relevant "group" for that topic, visible to anyone, not just a closed circle. Adding private groups would also duplicate the Community model's purpose without adding real value — communities already are the grouping mechanism here.

## What happens when there's no representative in a particular community?

The community simply goes into an "unrepresented" state — it isn't locked or hidden. Citizens can still report issues, comment, support, and propose solutions normally. The only thing that pauses is status updates, since there's no one with that authority yet. Any citizen can apply to represent that community, and once approved by an admin, status tracking resumes. So the platform degrades gracefully instead of breaking.

## Why can't an admin create communities?

They can, technically — there's an admin endpoint for it. But the primary path is citizen-founded: someone applies with identity verification (NIN, proof of residence, a statement) and an admin approves it. This was a deliberate choice — a community founded by an actual resident who then becomes its first representative is more authentic and self-sustaining than an admin pre-populating a list of places top-down. Admin-side creation exists as a fallback for housekeeping, not the main flow.

## Why is it a rep that handles status updates, not an admin?

Scale and knowledge. An admin oversees the whole platform and has no first-hand knowledge of whether a specific pothole got fixed in a specific community. A representative lives there, follows up locally, and is accountable to that one community specifically. Centralizing status updates with admins would turn them into a bottleneck and strip out the local accountability that makes the update meaningful in the first place —
