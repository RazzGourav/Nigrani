export type UserRole =
  | 'institution'
  | 'regional_officer'
  | 'bureau_officer'
  | 'committee_member'
  | 'senior_authority'
  | 'admin';

export type Region = 'North' | 'South' | 'West' | 'East' | 'Central';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  regionScope: Region | 'All';
  institutionName?: string;
  institutionId?: string;
  designation: string;
  status: 'Active' | 'Inactive';
}

export type ApplicationType =
  | 'New Institution'
  | 'Extension of Approval'
  | 'Increase in Intake'
  | 'New Programme'
  | 'Standalone Verification';

export type ApprovalRoute =
  | 'Scrutiny Only'
  | 'Scrutiny + EVC'
  | 'EVC Only'
  | 'Scrutiny + EVC + SAC';

export type StageStatus = 'completed' | 'in_progress' | 'pending' | 'returned' | 'skipped';

export interface WorkflowStage {
  id: string;
  key: string;
  label: string;
  roleResponsible: string;
  status: StageStatus;
  completedAt?: string;
  notes?: string;
  slaDays: number;
}

export interface Application {
  id: string;
  institutionName: string;
  institutionId: string;
  region: Region;
  applicationType: ApplicationType;
  route: ApprovalRoute;
  ruleVersion: string;
  currentStage: string;
  status: 'In Progress' | 'Due Soon' | 'Overdue' | 'Returned' | 'Approved' | 'Rejected';
  daysInStage: number;
  nextDeadline: string;
  assignedOfficer: string;
  lastUpdated: string;
  stages: WorkflowStage[];
  blockers?: string[];
  deficiencyReason?: string;
  deficiencyDeadline?: string;
  programme: string;
  intakeProposed: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export interface EVCSchedule {
  id: string;
  applicationId: string;
  institutionName: string;
  region: Region;
  reason: string;
  readinessStatus: 'Ready' | 'Deficient Documents' | 'Pending Fee';
  schedulingDeadline: string;
  proposedDate?: string;
  confirmedDate?: string;
  assignedCommittee?: string;
  status: 'Awaiting scheduling' | 'Proposed' | 'Scheduled' | 'Visit completed' | 'Report pending' | 'Closed';
  observations?: string;
}

export type ComplianceSubmissionStatus =
  | 'Not submitted'
  | 'Submitted'
  | 'Under review'
  | 'Accepted'
  | 'Rejected — correction required'
  | 'Overdue';

export interface ComplianceObligation {
  id: string;
  institutionName: string;
  applicationRef: string;
  title: string;
  conditionText: string;
  category: 'Land' | 'Faculty' | 'Safety' | 'Grievance' | 'Affidavit';
  evidenceRequired: string;
  dueDate: string;
  submissionStatus: ComplianceSubmissionStatus;
  verificationStatus: 'Pending' | 'Verified' | 'Correction Requested';
  assignedReviewer: string;
  submittedFile?: {
    name: string;
    url: string;
    size: string;
    submittedAt: string;
    note: string;
  };
  rejectionReason?: string;
  history: {
    action: string;
    actor: string;
    timestamp: string;
    note?: string;
  }[];
}

export interface DocumentRenewal {
  id: string;
  institutionName: string;
  documentType:
    | 'Land Lease Deed'
    | 'Fire Safety NOC'
    | 'Building Stability Certificate'
    | 'Occupancy Certificate'
    | 'NBA Accreditation';
  applicationRef: string;
  issueDate: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: 'Valid' | 'Due soon' | 'Expired' | 'Renewal submitted' | 'Awaiting verification';
  reviewer: string;
  fileUrl?: string;
  ocrData?: {
    extractedLeaseStart?: string;
    extractedLeaseEnd?: string;
    extractedLessee?: string;
    extractedSurveyNo?: string;
    confidence: number;
    sourceTextSnippet?: string;
    verifiedByReviewer?: boolean;
  };
}

export interface UnifiedObligation {
  id: string;
  type: 'Stage SLA' | 'EVC Scheduling' | 'Undertaking' | 'Document Renewal';
  title: string;
  linkedCase: string;
  institution: string;
  owner: string;
  dueDate: string;
  timeRemainingDays: number;
  status: 'Due soon' | 'Overdue' | 'On track' | 'Action required' | 'Closed';
  reminderStage: string;
  escalationTier: 'Normal' | 'Level 1' | 'Level 2' | 'Level 3';
  originEvent: string;
  ruleBasis: string;
}

export interface SystemNotification {
  id: string;
  createdAt: string;
  recipient: string;
  role: string;
  linkedObligation: string;
  messageType: 'Deadline Reminder' | 'Overdue Alert' | 'Deficiency Notice' | 'EVC Schedule' | 'Escalation Notice';
  channel: 'Email' | 'SMS' | 'Portal Notice';
  status: 'Sent' | 'Scheduled' | 'Failed' | 'Retried' | 'Escalated';
  messageBody: string;
  errorSummary?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  affectedRecord: string;
  previousStatus?: string;
  currentStatus?: string;
  reason?: string;
  previousHash: string;
  currentHash: string;
  verified: boolean;
}

export interface ApprovalRule {
  id: string;
  name: string;
  route: ApprovalRoute;
  version: string;
  effectiveDate: string;
  status: 'Active' | 'Draft' | 'Archived';
  stages: {
    name: string;
    slaDays: number;
    role: string;
    mandatory: boolean;
  }[];
  reminderThresholdsDays: number[];
  escalationRules: {
    overdueDays: number;
    escalationRole: string;
  }[];
  lastEditedBy: string;
  lastEditedTime: string;
  description: string;
}
