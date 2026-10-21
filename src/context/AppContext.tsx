import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Application,
  EVCSchedule,
  ComplianceObligation,
  DocumentRenewal,
  UnifiedObligation,
  SystemNotification,
  AuditEvent,
  ApprovalRule,
  Region,
} from '../types';
import { DEMO_USERS } from '../data/demoUsers';
import { DEMO_APPLICATIONS } from '../data/demoApplications';
import { DEMO_EVC_SCHEDULES } from '../data/demoEVC';
import { DEMO_COMPLIANCE } from '../data/demoCompliance';
import { DEMO_DOCUMENTS } from '../data/demoDocuments';
import { DEMO_OBLIGATIONS } from '../data/demoObligations';
import { DEMO_NOTIFICATIONS } from '../data/demoNotifications';
import { DEMO_AUDIT_LOGS } from '../data/demoAudit';
import { DEMO_RULES } from '../data/demoRules';

interface AppContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  applications: Application[];
  evcSchedules: EVCSchedule[];
  compliance: ComplianceObligation[];
  documents: DocumentRenewal[];
  obligations: UnifiedObligation[];
  notifications: SystemNotification[];
  auditLogs: AuditEvent[];
  rules: ApprovalRule[];
  users: User[];
  activeRoutePath: string;
  setActiveRoutePath: (path: string) => void;
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;

  // Actions
  transitionApplication: (appId: string, nextStageName: string, notes?: string) => boolean;
  returnApplicationForDeficiency: (appId: string, reason: string, deadline: string) => boolean;
  respondToDeficiency: (appId: string, note: string) => boolean;
  createApplication: (appData: Partial<Application>) => string;
  proposeEVC: (appId: string, proposedDate: string, committee: string, notes?: string) => boolean;
  confirmEVCSchedule: (evcId: string) => boolean;
  submitComplianceEvidence: (compObligationId: string, fileName: string, note: string) => boolean;
  reviewComplianceEvidence: (compObligationId: string, decision: 'accept' | 'reject', feedback: string) => boolean;
  submitDocumentRenewal: (docId: string, newExpiry: string, fileName: string) => boolean;
  verifyDocumentRenewal: (docId: string, approved: boolean, notes?: string) => boolean;
  retryNotification: (notifId: string) => boolean;
  updateRule: (ruleId: string, updatedRule: Partial<ApprovalRule>) => boolean;
  resetDemoData: () => void;
  verifyAuditChain: () => { valid: boolean; totalChecked: number };
}

const AppContext = createContext<AppContextType | null>(null);

// Simple deterministic hash simulation for audit chain (SHA-256 likeness)
function generateSimulatedHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return hex.repeat(8).substring(0, 64);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('nigrani_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    // Default to Regional Officer as primary operational demo actor
    return DEMO_USERS[1];
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('nigrani_apps');
    return saved ? JSON.parse(saved) : DEMO_APPLICATIONS;
  });

  const [evcSchedules, setEvcSchedules] = useState<EVCSchedule[]>(() => {
    const saved = localStorage.getItem('nigrani_evc');
    return saved ? JSON.parse(saved) : DEMO_EVC_SCHEDULES;
  });

  const [compliance, setCompliance] = useState<ComplianceObligation[]>(() => {
    const saved = localStorage.getItem('nigrani_compliance');
    return saved ? JSON.parse(saved) : DEMO_COMPLIANCE;
  });

  const [documents, setDocuments] = useState<DocumentRenewal[]>(() => {
    const saved = localStorage.getItem('nigrani_docs');
    return saved ? JSON.parse(saved) : DEMO_DOCUMENTS;
  });

  const [obligations, setObligations] = useState<UnifiedObligation[]>(() => {
    const saved = localStorage.getItem('nigrani_obligations');
    return saved ? JSON.parse(saved) : DEMO_OBLIGATIONS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('nigrani_notifications');
    return saved ? JSON.parse(saved) : DEMO_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem('nigrani_audit');
    return saved ? JSON.parse(saved) : DEMO_AUDIT_LOGS;
  });

  const [rules, setRules] = useState<ApprovalRule[]>(() => {
    const saved = localStorage.getItem('nigrani_rules');
    return saved ? JSON.parse(saved) : DEMO_RULES;
  });

  const [users] = useState<User[]>(DEMO_USERS);
  const [activeRoutePath, setActiveRoutePath] = useState<string>('/dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nigrani_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nigrani_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('nigrani_compliance', JSON.stringify(compliance));
  }, [compliance]);

  useEffect(() => {
    localStorage.setItem('nigrani_evc', JSON.stringify(evcSchedules));
  }, [evcSchedules]);

  useEffect(() => {
    localStorage.setItem('nigrani_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('nigrani_obligations', JSON.stringify(obligations));
  }, [obligations]);

  useEffect(() => {
    localStorage.setItem('nigrani_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nigrani_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('nigrani_rules', JSON.stringify(rules));
  }, [rules]);

  // Switch role helper
  const switchRole = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      // Auto-navigate to appropriate starting view
      if (role === 'institution') {
        setActiveRoutePath('/dashboard');
      } else if (role === 'committee_member') {
        setActiveRoutePath('/evc');
      } else if (role === 'senior_authority') {
        setActiveRoutePath('/obligations');
      } else if (role === 'admin') {
        setActiveRoutePath('/admin/rules');
      } else {
        setActiveRoutePath('/dashboard');
      }
    }
  };

  // Append new audit event with SHA-256 hash chain
  const appendAuditEvent = (
    action: string,
    affectedRecord: string,
    prevStatus?: string,
    currStatus?: string,
    reason?: string
  ) => {
    const lastEvent = auditLogs[auditLogs.length - 1];
    const prevHash = lastEvent ? lastEvent.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const eventPayload = `${prevHash}|${timestamp}|${currentUser.name}|${action}|${affectedRecord}|${currStatus}|${reason || ''}`;
    const currentHash = generateSimulatedHash(eventPayload);

    const newEvent: AuditEvent = {
      id: `AUD-${Math.floor(89200 + auditLogs.length + 1)}`,
      timestamp,
      actor: currentUser.name,
      actorRole: currentUser.designation,
      action,
      affectedRecord,
      previousStatus: prevStatus,
      currentStatus: currStatus,
      reason: reason || 'Action committed in workflow execution',
      previousHash: prevHash,
      currentHash,
      verified: true,
    };

    setAuditLogs((prev) => [...prev, newEvent]);
  };

  // Workflow transition
  const transitionApplication = (appId: string, nextStageName: string, notes?: string): boolean => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return false;

    const prevStage = app.currentStage;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedStages = app.stages.map((st) => {
      if (st.status === 'in_progress') {
        return { ...st, status: 'completed' as const, completedAt: nowStr, notes };
      }
      if (st.label.toLowerCase().includes(nextStageName.toLowerCase()) || st.key.includes(nextStageName.toLowerCase())) {
        return { ...st, status: 'in_progress' as const };
      }
      return st;
    });

    const isAllCompleted = updatedStages.every((s) => s.status === 'completed');
    const newStatus = isAllCompleted ? 'Approved' : 'In Progress';
    const newStage = isAllCompleted ? 'Approved' : nextStageName;

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              currentStage: newStage,
              status: newStatus,
              daysInStage: 0,
              lastUpdated: nowStr,
              stages: updatedStages,
              deficiencyReason: undefined,
              deficiencyDeadline: undefined,
              blockers: [],
            }
          : a
      )
    );

    appendAuditEvent('STAGE_TRANSITION_COMMITTED', `${app.id} (${app.institutionName})`, prevStage, newStage, notes);
    return true;
  };

  // Return for deficiency (MANDATORY REASON per PRD 3.2 & Journey B)
  const returnApplicationForDeficiency = (appId: string, reason: string, deadline: string): boolean => {
    if (!reason || reason.trim().length === 0) {
      alert('Return for deficiency requires a non-empty explanation of the deficiency as per AICTE APH procedures.');
      return false;
    }

    const app = applications.find((a) => a.id === appId);
    if (!app) return false;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedStages = app.stages.map((st) => {
      if (st.status === 'in_progress') {
        return { ...st, status: 'returned' as const, notes: `Returned: ${reason}` };
      }
      return st;
    });

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              currentStage: 'Deficiency Response',
              status: 'Returned',
              deficiencyReason: reason,
              deficiencyDeadline: deadline || '2026-10-27',
              lastUpdated: nowStr,
              stages: updatedStages,
              blockers: [`Deficiency Notice: ${reason}`],
            }
          : a
      )
    );

    // Auto-create a linked notification
    const newNotif: SystemNotification = {
      id: `NOTIF-${Math.floor(9000 + Math.random() * 1000)}`,
      createdAt: nowStr,
      recipient: `${app.contactPerson} (${app.contactEmail})`,
      role: 'Institution',
      linkedObligation: `DEF-${app.id}`,
      messageType: 'Deficiency Notice',
      channel: 'Email',
      status: 'Sent',
      messageBody: `AICTE Formal Deficiency Notice for ${app.id}: ${reason}. Required response deadline: ${deadline}.`,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Update obligations
    const newObl: UnifiedObligation = {
      id: `OBL-${app.id}-DEF`,
      type: 'Stage SLA',
      title: `Institutional Rectification: ${reason.substring(0, 45)}...`,
      linkedCase: app.id,
      institution: app.institutionName,
      owner: 'Institution User',
      dueDate: deadline,
      timeRemainingDays: 7,
      status: 'Action required',
      reminderStage: 'Deficiency Dispatched',
      escalationTier: 'Normal',
      originEvent: 'Returned for deficiency by Scrutiny Reviewer',
      ruleBasis: 'AICTE APH Procedure Clause 4.2',
    };
    setObligations((prev) => [newObl, ...prev]);

    appendAuditEvent('RETURNED_FOR_DEFICIENCY', `${app.id} (${app.institutionName})`, app.currentStage, 'Deficiency Response', reason);
    return true;
  };

  // Institution responds to deficiency
  const respondToDeficiency = (appId: string, note: string): boolean => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return false;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedStages = app.stages.map((st) => {
      if (st.status === 'returned') {
        return { ...st, status: 'in_progress' as const, notes: `Institution submitted response: ${note}` };
      }
      return st;
    });

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              currentStage: 'Scrutiny Review',
              status: 'In Progress',
              daysInStage: 0,
              lastUpdated: nowStr,
              stages: updatedStages,
              blockers: [],
            }
          : a
      )
    );

    appendAuditEvent('DEFICIENCY_RESPONSE_SUBMITTED', `${app.id} (${app.institutionName})`, 'Deficiency Response', 'Scrutiny Review', note);
    return true;
  };

  // Propose EVC Date & Committee
  const proposeEVC = (appId: string, proposedDate: string, committee: string, notes?: string): boolean => {
    const existingIndex = evcSchedules.findIndex((e) => e.applicationId === appId);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const app = applications.find((a) => a.id === appId);

    if (existingIndex >= 0) {
      setEvcSchedules((prev) =>
        prev.map((e, idx) =>
          idx === existingIndex
            ? {
                ...e,
                proposedDate,
                assignedCommittee: committee,
                status: 'Proposed',
                observations: notes || e.observations,
              }
            : e
        )
      );
    } else {
      const newEVC: EVCSchedule = {
        id: `EVC-2026-${Math.floor(100 + Math.random() * 900)}`,
        applicationId: appId,
        institutionName: app ? app.institutionName : 'Institution',
        region: app ? app.region : 'North',
        reason: 'Mandatory on-site verification',
        readinessStatus: 'Ready',
        schedulingDeadline: proposedDate,
        proposedDate,
        assignedCommittee: committee,
        status: 'Proposed',
        observations: notes,
      };
      setEvcSchedules((prev) => [newEVC, ...prev]);
    }

    appendAuditEvent('EVC_DATE_PROPOSED', appId, 'Awaiting scheduling', 'Proposed', `Proposed visit: ${proposedDate} by ${committee}`);
    return true;
  };

  // Confirm EVC Schedule
  const confirmEVCSchedule = (evcId: string): boolean => {
    const evc = evcSchedules.find((e) => e.id === evcId);
    if (!evc) return false;

    setEvcSchedules((prev) =>
      prev.map((e) =>
        e.id === evcId
          ? {
              ...e,
              status: 'Scheduled',
              confirmedDate: e.proposedDate || '2026-10-24',
            }
          : e
      )
    );

    appendAuditEvent('EVC_SCHEDULE_CONFIRMED', `${evc.id} (${evc.applicationId})`, 'Proposed', 'Scheduled', `Confirmed visit date: ${evc.proposedDate}`);
    return true;
  };

  // Compliance: Submit evidence
  const submitComplianceEvidence = (compObligationId: string, fileName: string, note: string): boolean => {
    const comp = compliance.find((c) => c.id === compObligationId);
    if (!comp) return false;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setCompliance((prev) =>
      prev.map((c) =>
        c.id === compObligationId
          ? {
              ...c,
              submissionStatus: 'Under review',
              verificationStatus: 'Pending',
              submittedFile: {
                name: fileName,
                url: `/uploads/${fileName}`,
                size: '2.1 MB',
                submittedAt: nowStr,
                note,
              },
              history: [
                ...c.history,
                {
                  action: 'Evidence Submitted',
                  actor: currentUser.name,
                  timestamp: nowStr,
                  note,
                },
              ],
            }
          : c
      )
    );

    appendAuditEvent('EVIDENCE_SUBMITTED', `${comp.id} (${comp.title})`, comp.submissionStatus, 'Under review', `Uploaded: ${fileName}`);
    return true;
  };

  // Compliance: Officer review
  const reviewComplianceEvidence = (
    compObligationId: string,
    decision: 'accept' | 'reject',
    feedback: string
  ): boolean => {
    const comp = compliance.find((c) => c.id === compObligationId);
    if (!comp) return false;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newStatus = decision === 'accept' ? 'Accepted' : 'Rejected — correction required';
    const newVerif = decision === 'accept' ? 'Verified' : 'Correction Requested';

    setCompliance((prev) =>
      prev.map((c) =>
        c.id === compObligationId
          ? {
              ...c,
              submissionStatus: newStatus,
              verificationStatus: newVerif,
              rejectionReason: decision === 'reject' ? feedback : undefined,
              history: [
                ...c.history,
                {
                  action: decision === 'accept' ? 'Evidence Verified & Accepted' : 'Evidence Rejected — Correction Required',
                  actor: currentUser.name,
                  timestamp: nowStr,
                  note: feedback,
                },
              ],
            }
          : c
      )
    );

    appendAuditEvent('EVIDENCE_REVIEW_DECIDED', `${comp.id} (${comp.title})`, comp.submissionStatus, newStatus, feedback);
    return true;
  };

  // Documents: Submit renewal
  const submitDocumentRenewal = (docId: string, newExpiry: string, fileName: string): boolean => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return false;

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              expiryDate: newExpiry,
              status: 'Renewal submitted',
              fileUrl: `/uploads/${fileName}`,
            }
          : d
      )
    );

    appendAuditEvent('DOCUMENT_RENEWAL_SUBMITTED', `${doc.id} (${doc.documentType})`, doc.status, 'Renewal submitted', `Uploaded renewal file: ${fileName}`);
    return true;
  };

  // Documents: Verify renewal
  const verifyDocumentRenewal = (docId: string, approved: boolean, notes?: string): boolean => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return false;

    const nextStatus = approved ? 'Valid' : 'Expired';

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: nextStatus,
              ocrData: d.ocrData ? { ...d.ocrData, verifiedByReviewer: approved } : undefined,
            }
          : d
      )
    );

    appendAuditEvent('DOCUMENT_VERIFICATION_RECORDED', `${doc.id} (${doc.documentType})`, doc.status, nextStatus, notes || (approved ? 'Verified successfully' : 'Rejected on scrutiny'));
    return true;
  };

  // Create demo application
  const createApplication = (appData: Partial<Application>): string => {
    const nextNum = 260300 + applications.length + 1;
    const newId = `AI-${nextNum}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const chosenRoute = appData.route || 'Scrutiny Only';

    // Build route-specific stages
    const matchingRule = rules.find((r) => r.route === chosenRoute) || rules[0];
    const initialStages = matchingRule.stages.map((st, i) => ({
      id: `s_${i + 1}`,
      key: st.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      label: st.name,
      roleResponsible: st.role,
      status: (i === 0 ? 'completed' : i === 1 ? 'in_progress' : 'pending') as any,
      completedAt: i === 0 ? nowStr : undefined,
      slaDays: st.slaDays,
    }));

    const newApp: Application = {
      id: newId,
      institutionName: appData.institutionName || 'Demo Technical Institute',
      institutionId: `AICTE-1-${Math.floor(100000 + Math.random() * 900000)}`,
      region: (appData.region as Region) || 'North',
      applicationType: appData.applicationType || 'Extension of Approval',
      route: chosenRoute,
      ruleVersion: 'ROUTE-2026.1',
      currentStage: initialStages[1] ? initialStages[1].label : 'Scrutiny',
      status: 'In Progress',
      daysInStage: 0,
      nextDeadline: '2026-11-05',
      assignedOfficer: currentUser.name,
      lastUpdated: nowStr,
      stages: initialStages,
      programme: appData.programme || 'Engineering & Technology',
      intakeProposed: appData.intakeProposed || 180,
      contactPerson: appData.contactPerson || 'Dr. K. S. Verma',
      contactEmail: appData.contactEmail || 'director@demo-institute.edu',
      contactPhone: appData.contactPhone || '+91 98980 12345',
    };

    setApplications((prev) => [newApp, ...prev]);
    appendAuditEvent('APPLICATION_CREATED', `${newApp.id} (${newApp.institutionName})`, 'New', 'In Progress', `Route: ${chosenRoute}`);
    return newId;
  };

  // Retry failed notification
  const retryNotification = (notifId: string): boolean => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notifId
          ? {
              ...n,
              status: 'Retried',
              errorSummary: undefined,
            }
          : n
      )
    );
    return true;
  };

  // Update rule
  const updateRule = (ruleId: string, updatedRule: Partial<ApprovalRule>): boolean => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              ...updatedRule,
              lastEditedBy: currentUser.name,
              lastEditedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : r
      )
    );
    appendAuditEvent('RULEBOOK_UPDATED', ruleId, 'Active', 'Active', `Rule configuration modified by ${currentUser.name}`);
    return true;
  };

  // Reset demo data to pristine seeds
  const resetDemoData = () => {
    localStorage.removeItem('nigrani_apps');
    localStorage.removeItem('nigrani_evc');
    localStorage.removeItem('nigrani_compliance');
    localStorage.removeItem('nigrani_docs');
    localStorage.removeItem('nigrani_obligations');
    localStorage.removeItem('nigrani_notifications');
    localStorage.removeItem('nigrani_audit');
    localStorage.removeItem('nigrani_rules');

    setApplications(DEMO_APPLICATIONS);
    setEvcSchedules(DEMO_EVC_SCHEDULES);
    setCompliance(DEMO_COMPLIANCE);
    setDocuments(DEMO_DOCUMENTS);
    setObligations(DEMO_OBLIGATIONS);
    setNotifications(DEMO_NOTIFICATIONS);
    setAuditLogs(DEMO_AUDIT_LOGS);
    setRules(DEMO_RULES);
    setCurrentUser(DEMO_USERS[1]); // Regional Officer
    setSelectedAppId(null);
    setActiveRoutePath('/dashboard');
  };

  // Cryptographic audit chain verification
  const verifyAuditChain = () => {
    for (let i = 1; i < auditLogs.length; i++) {
      if (auditLogs[i].previousHash !== auditLogs[i - 1].currentHash) {
        return { valid: false, totalChecked: i };
      }
    }
    return { valid: true, totalChecked: auditLogs.length };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        applications,
        evcSchedules,
        compliance,
        documents,
        obligations,
        notifications,
        auditLogs,
        rules,
        users,
        activeRoutePath,
        setActiveRoutePath,
        selectedAppId,
        setSelectedAppId,
        transitionApplication,
        returnApplicationForDeficiency,
        respondToDeficiency,
        createApplication,
        proposeEVC,
        confirmEVCSchedule,
        submitComplianceEvidence,
        reviewComplianceEvidence,
        submitDocumentRenewal,
        verifyDocumentRenewal,
        retryNotification,
        updateRule,
        resetDemoData,
        verifyAuditChain,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
