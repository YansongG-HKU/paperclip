# Agent Role Template and Workflow Playbook Framework

Status: Proposed
Date: 2026-03-23
Audience: Product and engineering
Related:
- `doc/GOAL.md`
- `doc/PRODUCT.md`
- `doc/SPEC-implementation.md`
- `doc/DEVELOPING.md`
- `doc/DATABASE.md`
- `doc/plans/2026-02-19-ceo-agent-creation-and-hiring.md`
- `doc/plans/2026-03-13-agent-evals-framework.md`
- `doc/plans/2026-03-13-company-import-export-v2.md`
- `doc/plans/2026-03-13-workspace-product-model-and-work-product.md`
- `doc/plans/2026-03-14-skills-ui-product-plan.md`
- `docs/agents-runtime.md`

## 1. Purpose

This document defines a hybrid product and implementation framework for designing
agents in Paperclip as reusable company assets.

The core recommendation is:

- introduce **role templates** as the reusable definition of an agent job
- introduce **workflow playbooks** as the reusable definition of how jobs
  collaborate
- keep V1.1 grounded in Paperclip's current runtime model:
  `companies`, `agents`, `issues`, `issue_comments`, `approvals`,
  `heartbeat_runs`, budgets, and work products
- leave explicit extension points for a future executable workflow engine,
  template marketplace, and richer package portability

This is not a plan to turn Paperclip into a chat app or a generic BPM tool.
It is a plan to make Paperclip better at the thing it already claims to be:
the control plane for autonomous AI companies.

## 2. Why This Layer Is Missing Today

Paperclip already has strong core primitives:

- company-scoped agents with org structure
- hierarchical goals and issues
- approvals and budget enforcement
- heartbeat-based execution
- skills and adapter configuration
- workspaces and work product planning underway

What it does not yet have is a clear product model for:

- how a company defines a reusable agent job
- how one agent is created from that reusable definition
- how multiple agent jobs repeatedly collaborate on a class of work
- what each step must consume and produce
- how to evaluate whether a role definition or playbook still works after
  prompts, skills, models, or policies change

Without this layer, the system trends toward "prompt blobs attached to agents."
That is not enough for a control plane. It is hard to govern, hard to reuse, and
hard to test.

## 3. Recommendation

Paperclip should introduce two first-class design assets at company scope:

1. **Role template**
   The reusable, versioned definition of a job in a company.

2. **Workflow playbook**
   The reusable, versioned definition of a multi-role operating flow.

These should be treated as company assets in the same family as skills:

- visible and inspectable in the product
- importable and exportable in company packages
- versioned and attributable
- attachable to concrete agent instances and concrete issue trees
- evaluable with the existing and planned eval harness

The hybrid implementation stance is:

- **V1.1-first**
  Role templates and playbooks become product objects and UI/API surfaces.
  Runtime execution still maps to existing issue, comment, approval, and
  heartbeat primitives.

- **V2-ready**
  The same definitions should later be compilable into richer execution
  semantics such as explicit workflow runs, conditional stage graphs, automatic
  stage advancement, and published template registries.

## 4. Product Principles

1. **Roles are jobs, not personas.**
   A role template defines a business function with inputs, outputs, authority,
   and boundaries. It is not just a system prompt that says "act like a CTO."

2. **Workflows matter as much as prompts.**
   The quality of an AI company is determined as much by handoff design and
   stage contracts as by any single model or prompt.

3. **Artifacts beat free-form chat.**
   The canonical outputs of work should be issue updates, work products,
   approvals, and explicit summaries. Raw transcripts are supporting evidence,
   not the default interface.

4. **Capabilities must be separate from role intent.**
   "Who this role is" and "what tools this role may use" are different concerns
   and should be modeled separately.

5. **Everything remains company-scoped.**
   Role templates, playbooks, runs, work products, and permissions must remain
   inside company boundaries.

6. **Progressive disclosure is mandatory.**
   Every role and every playbook step must produce operator-friendly summaries
   first, structured mid-layer evidence second, and raw traces last.

7. **Definitions must be testable assets.**
   If a role template or playbook cannot be evaluated, it is configuration
   drift waiting to happen.

8. **The control plane stays thin at the core.**
   Paperclip should govern execution, not absorb every execution capability into
   the server itself.

## 5. Core Terms

### 5.1 Role Template

A reusable definition of a company job. A role template answers:

- what this role exists to do
- where it sits in the org
- what authority it has
- what inputs it consumes
- what outputs it must produce
- what tools and skills it may use
- what it must do before claiming work complete

### 5.2 Capability Bundle

A reusable bundle of execution powers referenced by a role template.

Examples:

- local coding workspace access
- browser QA access
- HTTP/API automation
- file and artifact generation
- repo operations

In V1.1 this may still compile down into adapter config and skill attachment.
The important product decision is conceptual separation.

### 5.3 Workflow Playbook

A reusable, versioned operating pattern that defines how one or more roles
collaborate on a class of work.

Examples:

- CEO strategic review
- hire-approval flow
- product feature delivery loop
- growth experiment loop
- docs sync after ship

### 5.4 Workflow Step

A unit inside a playbook that identifies:

- owner role
- entry criteria
- expected actions
- required outputs
- exit criteria
- escalation rules

### 5.5 Handoff Contract

The explicit contract between one step and the next.

It defines:

- what structured summary is required
- what work products must exist
- what decisions are locked
- what risks are known
- what the next role can assume without re-deriving

### 5.6 Work Product Contract

The definition of the artifacts a role or step must produce.

Examples:

- strategy brief
- technical plan
- implementation diff/PR
- preview URL
- QA report
- screenshot bundle
- release note

### 5.7 Workflow Run

The runtime instantiation of a workflow playbook for a concrete goal, project,
or issue.

For V1.1 this should be represented primarily through issue trees and metadata.
For V2 it can become a first-class execution object.

## 6. V1.1 Product Decisions

### 6.1 What becomes first-class now

For V1.1, Paperclip should add:

- company-scoped role templates
- company-scoped workflow playbooks
- version history for both
- agent creation from role template
- issue/playbook linkage
- explicit step metadata on issues created from playbooks
- eval-aware definitions for templates and playbooks

### 6.2 What stays on existing primitives for now

For V1.1, Paperclip should continue to use:

- `issues` as the runtime work object
- `issue_comments` as the default collaboration stream
- `approvals` as the approval primitive
- `heartbeat_runs` as the execution primitive
- work products and workspace policies as the artifact and execution layer

This avoids inventing a second runtime before the first one is fully mature.

### 6.3 What explicitly waits for V2

Do not require the following in V1.1:

- a full workflow engine with arbitrary state machines
- cross-company template marketplace
- automatic optimization or self-modifying role definitions
- multi-company global role registry
- generic low-code workflow builder

## 7. Role Template Spec

## 7.1 Canonical top-level sections

A role template should be represented conceptually like this:

```yaml
metadata:
org:
mission:
operatingModel:
inputContract:
outputContract:
capabilityPolicy:
governancePolicy:
contextPolicy:
observabilityPolicy:
evaluationPolicy:
provenance:
```

The storage format can be JSONB in the database and markdown plus sidecar data
in packages, but the product model should expose these same sections.

## 7.2 Metadata section

Required fields:

- `name`: human-readable name
- `slug`: stable company-unique identifier
- `version`: immutable version string or monotonic integer
- `status`: `draft | active | archived`
- `summary`: one-sentence purpose
- `description`: longer explanation

Recommended fields:

- `department`
- `roleClass`
  Examples: `executive`, `manager`, `individual_contributor`, `service_role`
- `tags`
- `defaultTitle`

Purpose:

- identify the template
- support UI navigation and search
- make import/export and attribution stable

## 7.3 Org section

Required fields:

- `reportsToRoleSlug`
- `defaultPermissions`
- `scope`
  Normally `company`

Recommended fields:

- `managesRoleSlugs`
- `peerRoleSlugs`
- `canCreateAgentsDefault`
- `canApproveDefault`
- `defaultBudgetPolicyRef`

Purpose:

- define where the role belongs in the org tree
- define default authority and responsibility boundaries

Important V1.1 rule:

- org defaults from the template are suggestions at instantiation time
- the concrete agent still stores actual `reports_to`, permissions, and budget
- template drift must be visible when the instance deviates from default

## 7.4 Mission section

Required fields:

- `purpose`
- `ownedOutcomes`
- `primaryDecisions`
- `nonGoals`
- `definitionOfSuccess`

Purpose:

- define what this role is for
- prevent role overlap and accidental empire-building

This section should be operator-readable and short enough to display in the UI
without opening raw config.

## 7.5 Operating model section

Required fields:

- `triggerPolicies`
  Examples: `assignment`, `manual`, `schedule`, `approval_result`
- `defaultCadence`
- `queueSelectionPolicy`
- `completionBehavior`
- `stopConditions`
- `escalationConditions`

Recommended fields:

- `defaultPlaybookSlugs`
- `maxConcurrentActiveIssues`
- `delegationPolicy`
- `checklistTemplate`

Purpose:

- define how the role behaves in the runtime loop
- make operational expectations explicit rather than implicit in prompts

Examples:

- a CEO role may wake on schedule and major approval events
- an engineer role may wake on assignment and on-demand only
- a QA role may wake only when an issue moves to `in_review`

## 7.6 Input contract section

Required fields:

- `requiredObjects`
  Examples: `issue`, `goal`, `project`, `approval`, `work_product`
- `requiredContextFields`
- `freshnessRequirements`
- `preflightChecks`

Recommended fields:

- `optionalObjects`
- `forbiddenContext`
- `contextCompressionRules`

Purpose:

- define what the role must have before it can act
- prevent expensive or unsafe guesswork

Examples:

- QA may require a preview URL and a test plan before it starts
- Docs may require final behavior summary plus QA outcome

## 7.7 Output contract section

Required fields:

- `requiredIssueUpdateKinds`
- `requiredWorkProductKinds`
- `requiredStructuredSummaryFields`
- `handoffDestinations`
- `doneEvidence`

Recommended fields:

- `operatorSummaryTemplate`
- `artifactNamingConventions`
- `reviewChecklist`

Purpose:

- define what "done" means for the role
- create a reusable handoff contract for downstream roles and the board

This section is the core of progressive disclosure.

## 7.8 Capability policy section

Required fields:

- `allowedAdapterTypes`
- `requiredSkills`
- `optionalSkills`
- `toolCapabilities`
- `workspaceRequirements`

Recommended fields:

- `preferredModelProfile`
- `requiredSecretScopes`
- `networkPolicy`
- `maxWorkspacePermissions`

Purpose:

- separate identity from execution powers
- make adapter/tool access explicit and inspectable

Examples:

- a CTO role may need planning and workspace inspection but not browser QA
- a QA role may need browser and screenshot capability but not repo write access

## 7.9 Governance policy section

Required fields:

- `companyBoundaryPolicy`
- `approvalRules`
- `mutationRules`
- `budgetDefaults`
- `perRunGuardrails`

Recommended fields:

- `autoPauseRules`
- `secretHandlingPolicy`
- `escalationDestinations`

Purpose:

- encode what the role may do without approval
- make safety and budget constraints reusable

Examples:

- CEO may draft hires but still require board approval
- Engineer may write code but may not merge or deploy
- Docs may update docs and release notes but not alter budgets or staffing

## 7.10 Context policy section

Required fields:

- `contextMode`
  Aligns with existing `thin | fat` direction
- `memorySources`
- `sessionReusePolicy`
- `contextLoadOrder`

Recommended fields:

- `maxHistoryDepth`
- `summaryRefreshRules`
- `resetSessionTriggers`

Purpose:

- normalize how roles consume context across adapters
- reduce drift caused by inconsistent session behavior

## 7.11 Observability policy section

Required fields:

- `operatorHeadlineFields`
- `midLayerEvidenceFields`
- `rawTracePolicy`
- `healthSignals`
- `costAttributionRules`

Recommended fields:

- `statusBadgeRules`
- `stuckDetectionHints`
- `runOutcomeSchema`

Purpose:

- force roles to produce board-readable output
- keep raw tool traces available without making them the default UI

## 7.12 Evaluation policy section

Required fields:

- `evalSuiteRefs`
- `goldenScenarios`
- `hardChecks`
- `rubricChecks`
- `regressionThresholds`

Purpose:

- make the role definition a testable asset
- align with the agent eval framework

Examples:

- "must never comment on another company's issue"
- "must ask for approval before creating a new hire"
- "must attach QA evidence before marking pass"

## 7.13 Provenance section

Required fields:

- `sourceType`
  Examples: `local`, `imported_package`, `seeded_builtin`
- `sourceRef`
- `compatibilityVersion`

Recommended fields:

- `license`
- `checksum`
- `importedAt`
- `importedFromCompanyPackage`

Purpose:

- support import/export
- preserve trust and attribution
- explain where a role definition came from

## 8. Workflow Playbook Spec

## 8.1 Canonical top-level sections

A workflow playbook should be represented conceptually like this:

```yaml
metadata:
scope:
triggers:
participants:
inputs:
stepGraph:
handoffContracts:
approvalGates:
exceptionPolicies:
completionPolicy:
observabilityPolicy:
evaluationPolicy:
provenance:
```

## 8.2 Metadata section

Required fields:

- `name`
- `slug`
- `version`
- `status`
- `summary`
- `description`

Recommended fields:

- `category`
  Examples: `strategy`, `delivery`, `ops`, `growth`, `support`
- `tags`

## 8.3 Scope section

Required fields:

- `companyScope`
- `supportedProjectTypes`
- `supportedWorkspaceModes`
- `linearOrGraph`

Purpose:

- define where this playbook can run
- keep V1.1 support intentionally constrained

V1.1 recommendation:

- support linear and simple fan-out/fan-in playbooks only
- defer arbitrary workflow graph editing to V2

## 8.4 Trigger section

Required fields:

- `triggerKinds`
  Examples: `manual`, `goal_started`, `issue_status_changed`, `approval_result`
- `entryPreconditions`
- `starterIssuePolicy`

Recommended fields:

- `defaultProjectBindingRules`
- `schedulePolicy`

Purpose:

- define how a playbook starts
- make startup behavior deterministic and auditable

## 8.5 Participants section

Required fields:

- `requiredRoleBindings`
- `optionalRoleBindings`
- `fallbackPolicies`

Purpose:

- bind the abstract playbook to concrete role templates or concrete agents

Example:

- `ceo` must bind to a role template with executive permissions
- `qa` may be optional in tiny projects, but required for public releases

## 8.6 Inputs section

Required fields:

- `requiredInputObjects`
- `requiredInputFields`
- `starterArtifacts`
- `validationRules`

Purpose:

- ensure playbook runs only start with enough information

## 8.7 Step graph section

Each step in the playbook should define:

- `stepKey`
- `title`
- `ownerRoleBinding`
- `entryCriteria`
- `consumes`
- `actions`
- `produces`
- `operatorSummaryFields`
- `exitCriteria`
- `timeoutPolicy`
- `failurePolicy`
- `handoffTo`
- `approvalGateRef` if any

Purpose:

- make each stage explicit
- drive issue generation and later execution behavior

## 8.8 Handoff contracts section

Each handoff contract should define:

- `fromStep`
- `toStep`
- `requiredSummaryFields`
- `requiredWorkProducts`
- `decisionLocks`
- `riskDisclosureFields`
- `retryPolicy`

Purpose:

- prevent downstream roles from having to rediscover upstream thinking
- turn issue comments and work products into structured collaboration

## 8.9 Approval gates section

Each gate should define:

- `gateKey`
- `triggerCondition`
- `approvalType`
- `requestPayloadTemplate`
- `blockingBehavior`

Purpose:

- align playbooks with existing approval primitives

Examples:

- hiring gate
- budget expansion gate
- strategic scope change gate

## 8.10 Exception policies section

Required fields:

- `blockedPolicy`
- `stalePolicy`
- `budgetExceededPolicy`
- `missingInputPolicy`
- `roleUnavailablePolicy`

Purpose:

- make failure handling explicit
- prevent undefined behavior when a role cannot progress

## 8.11 Completion policy section

Required fields:

- `successConditions`
- `requiredTerminalArtifacts`
- `closeoutOwner`
- `boardVisibleSummaryFields`

Purpose:

- define when a workflow run can be considered complete

## 8.12 Observability policy section

Required fields:

- `headline`
- `stageProgressSchema`
- `evidenceChecklist`
- `rawTraceLinkage`

Purpose:

- drive the board-facing workflow UI
- keep humans in control without drowning them in logs

## 8.13 Evaluation policy section

Required fields:

- `scenarioRefs`
- `hardChecks`
- `pairwiseChecks`
- `efficiencyMetrics`

Purpose:

- measure the playbook, not only the participating prompts or models

## 9. Runtime Mapping To Existing Paperclip Primitives

The hybrid model should intentionally compile into current Paperclip concepts.

| Framework concept | V1.1 runtime representation | V2 direction |
|---|---|---|
| Role template | Company asset + version + snapshot copied to agent instance | Same, plus richer inheritance and live drift management |
| Workflow playbook | Company asset + version referenced by project/goal/root issue | Same, plus executable workflow definition |
| Workflow run | Root issue plus child issues and comments | Dedicated `workflow_runs` object |
| Workflow step | Child issue metadata + assignment + status | Dedicated `workflow_step_runs` object |
| Handoff contract | Structured issue comment + required work products | Dedicated handoff record with validation |
| Approval gate | Existing `approvals` rows with richer payload refs | Same |
| Work product contract | Existing/future work product model, otherwise issue-linked URLs/files | Same with lineage graph |

This mapping is deliberate. It allows the product to mature without splitting the
runtime into two incompatible systems.

## 10. Proposed Data Model Changes

## 10.1 New `role_templates`

Suggested columns:

- `id`
- `company_id`
- `name`
- `slug`
- `description`
- `status` enum: `draft | active | archived`
- `latest_version_id`
- `created_by_user_id`
- `created_by_agent_id`
- timestamps

## 10.2 New `role_template_versions`

Suggested columns:

- `id`
- `role_template_id`
- `version`
- `spec_json`
- `rendered_markdown`
- `eval_status` enum: `unknown | passing | failing`
- `source_package_ref`
- `created_by_user_id`
- `created_by_agent_id`
- timestamps

Purpose:

- immutable role definition history
- import/export and eval traceability

## 10.3 New `workflow_playbooks`

Suggested columns:

- `id`
- `company_id`
- `name`
- `slug`
- `description`
- `status` enum: `draft | active | archived`
- `latest_version_id`
- `created_by_user_id`
- `created_by_agent_id`
- timestamps

## 10.4 New `workflow_playbook_versions`

Suggested columns:

- `id`
- `workflow_playbook_id`
- `version`
- `spec_json`
- `rendered_markdown`
- `eval_status`
- `source_package_ref`
- `created_by_user_id`
- `created_by_agent_id`
- timestamps

## 10.5 Changes to `agents`

Add fields:

- `role_template_id` nullable
- `role_template_version_id` nullable
- `role_template_snapshot` jsonb not null default `{}`
- `capability_overrides` jsonb not null default `{}`

Purpose:

- preserve the template origin of a live agent
- make instance drift inspectable

## 10.6 Changes to `issues`

Add fields:

- `workflow_playbook_id` nullable
- `workflow_playbook_version_id` nullable
- `workflow_root_issue_id` nullable
- `workflow_step_key` nullable
- `required_output_contract` jsonb not null default `{}`
- `latest_handoff_summary` text null

Purpose:

- tie issue trees to playbook definitions
- show stage semantics in the existing issue model

## 10.7 Optional project-level defaults

Projects may later add:

- `default_workflow_playbook_id`
- `default_role_binding_policy`

This is useful for product teams that run the same execution loop repeatedly.

## 10.8 No new generic artifact table in this plan

This plan should align with the existing work product direction rather than
inventing a competing artifact model.

Rule:

- if a first-class work product model exists, playbooks should reference it
- if not, V1.1 should use issue-linked URLs, files, comments, and previews

## 11. API Plan

## 11.1 Role template routes

Suggested routes:

- `GET /api/companies/:companyId/role-templates`
- `POST /api/companies/:companyId/role-templates`
- `GET /api/role-templates/:id`
- `POST /api/role-templates/:id/versions`
- `PATCH /api/role-templates/:id`

## 11.2 Workflow playbook routes

Suggested routes:

- `GET /api/companies/:companyId/workflow-playbooks`
- `POST /api/companies/:companyId/workflow-playbooks`
- `GET /api/workflow-playbooks/:id`
- `POST /api/workflow-playbooks/:id/versions`
- `PATCH /api/workflow-playbooks/:id`

## 11.3 Agent instantiation route

Suggested route:

- `POST /api/companies/:companyId/agents/from-role-template`

Behavior:

- resolve selected role template version
- apply org, permission, budget, and capability defaults
- allow operator overrides with drift recorded explicitly
- preserve full snapshot for auditability

## 11.4 Playbook instantiation route

Suggested route:

- `POST /api/companies/:companyId/workflow-playbooks/:id/start`

V1.1 behavior:

- create a root issue for the workflow run
- create child issues for each configured step
- attach playbook/version metadata to the issue tree
- assign the first active step to the bound role
- put downstream steps in `backlog` or `todo` until their entry criteria are met

This is intentionally simpler than a full workflow engine.

## 12. UI Plan

## 12.1 Company Roles page

Add a company-scoped page:

- `/companies/:companyId/roles`

Core jobs:

- list role templates
- inspect role definitions
- create or import role templates
- see which live agents are using a template
- see eval health and drift status

## 12.2 Company Playbooks page

Add a company-scoped page:

- `/companies/:companyId/playbooks`

Core jobs:

- list workflow playbooks
- inspect playbook definitions
- see required participants and artifacts
- manually start a playbook against a project, goal, or issue

## 12.3 Agent creation flow

The existing agent creation and hiring flows should gain:

- `Create from role template`
- preview of mission, authority, capabilities, and default skills
- explicit override section
- drift warning if the operator customizes away from the template

## 12.4 Agent detail page

Add a template section showing:

- source role template
- version
- current drift from template defaults
- role mission and contracts
- linked eval status

## 12.5 Issue detail and board surfaces

When an issue is part of a playbook:

- show workflow name and current stage
- show required outputs for the stage
- show previous handoff summary
- show work product checklist
- show upstream and downstream role bindings

This turns issue threads into comprehensible workflow steps instead of generic
task blobs.

## 13. Package And Portability Plan

This plan should extend the package direction in `company-import-export-v2`.

Recommended new package entities:

- `ROLE.md`
- `PLAYBOOK.md`

Principles:

- `SKILL.md` stays Agent Skills compatible
- role templates and playbooks are separate package concepts
- skill references inside role templates should use shortname/slug wherever
  possible
- Paperclip-specific execution fidelity still belongs in `.paperclip.yaml`

This lets Paperclip package:

- a company structure
- reusable roles
- reusable playbooks
- reusable skills

as a coherent import/export bundle rather than as disconnected markdown files.

## 14. Evaluation Plan

This framework should plug directly into the eval plan.

### 14.1 Role template evals

Examples:

- CEO role asks for approval before hiring
- Engineer role does not act without an assigned issue
- QA role refuses to mark pass without evidence
- Docs role summarizes externally visible changes clearly

### 14.2 Playbook evals

Examples:

- feature delivery playbook produces all required artifacts
- downstream stages do not start before required upstream outputs exist
- workflow respects budget and approval gates
- workflow output remains understandable at the board layer

### 14.3 Regression unit

The unit of comparison should be:

- role template version
- playbook version
- participating skill set
- model/adapters
- runtime flags

That is the actual thing the product is changing.

## 15. Rollout Plan

### Phase 1: Definitions and storage

- add shared contracts for role templates and playbooks
- add DB tables and version records
- add minimal CRUD APIs

### Phase 2: Agent creation from templates

- bind new hires and manually created agents to role templates
- expose template drift in UI

### Phase 3: Playbook-backed issue tree creation

- start playbooks manually
- materialize issue trees with step metadata and required output contracts

### Phase 4: Work product integration and stronger handoff validation

- attach explicit work products to stage completion
- validate handoff contracts before step completion

### Phase 5: V2 runtime engine

- dedicated workflow run objects
- conditional branching
- automated stage advancement
- richer retry/escalation automation

## 16. Non-Goals

- This is not a generic no-code workflow builder.
- This is not a replacement for skills.
- This is not a replacement for the current issue model.
- This is not a full enterprise RBAC redesign.
- This is not a mandate that all companies use the same role library.

## 17. Bottom Line

Paperclip should stop treating agents as only runtime instances with prompt
config, and start treating them as instances of reusable, testable company jobs.

The corresponding workflow layer should stop living only in scattered comments,
prompts, and operator habits, and start living in explicit playbooks with
contracts, outputs, and evaluation hooks.

That is the missing product layer between:

- today's low-level control-plane primitives
- and the future vision of reusable autonomous companies

