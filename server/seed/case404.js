// Case 404 seed data (moved out of the frontend). Links between documents use stable string keys;
// the seed script converts them into MongoDB ObjectId references.
export const CASE_404 = {
  "caseId": "404",
  "title": "THE MISSING PROTOTYPE",
  "status": "ACTIVE",
  "subject": "the prototype",
  "label": "HELIX RESEARCH LAB · SECURED",
  "security": "CLASSIFIED",
  "location": "HELIX RESEARCH LABORATORY — SECURED LAB B",
  "summary": "A confidential prototype has disappeared from a secured research laboratory. Investigate the evidence, examine the suspects and uncover what really happened.",
  "solution": "ryan",
  "suspects": [
    {
      "name": "Alex Morgan",
      "role": "Lead Developer",
      "initials": "AM",
      "access": "LEVEL 4",
      "accessPct": 80,
      "status": "QUESTIONED",
      "risk": 58,
      "short": "Owns the prototype firmware. Worked late.",
      "reveal": "Present in the building during the incident window.",
      "activity": "Badge shows Alex entered the building at 07:30 and requested overtime until 23:00. Heavy repository activity on the prototype firmware branch.",
      "notes": "Cooperative, but visibly stressed about an upcoming demo. Left a half-finished coffee in Lab B during the afternoon stand-up.",
      "key": "alex",
      "order": 1,
      "log": [
        {
          "time": "15:40",
          "event": "Attends stand-up in Lab B"
        },
        {
          "time": "19:10",
          "event": "Overtime approved, moves to Floor 2 dev area"
        },
        {
          "time": "22:05",
          "event": "Commits firmware patch from Floor 2"
        },
        {
          "time": "22:30",
          "event": "Leaves Floor 2 after alarm"
        }
      ]
    },
    {
      "name": "Maya Chen",
      "role": "Security Engineer",
      "initials": "MC",
      "access": "LEVEL 5",
      "accessPct": 100,
      "status": "QUESTIONED",
      "risk": 64,
      "short": "Runs door control and the audit logs.",
      "reveal": "Her override appears in the log minutes before the theft.",
      "activity": "Maintenance override executed on Lab B door controller at 21:50. She has full administrative access to the logging system.",
      "notes": "Provided logs voluntarily. Says the override was routine firmware maintenance filed under a ticket earlier in the week.",
      "key": "maya",
      "order": 2,
      "log": [
        {
          "time": "18:30",
          "event": "Starts scheduled maintenance shift"
        },
        {
          "time": "21:50",
          "event": "Runs door-controller override (ticket MT-7731)"
        },
        {
          "time": "22:20",
          "event": "Alarm acknowledged from control room"
        },
        {
          "time": "22:25",
          "event": "Locks down the building"
        }
      ]
    },
    {
      "name": "Ryan Cole",
      "role": "Lab Assistant",
      "initials": "RC",
      "access": "LEVEL 2",
      "accessPct": 40,
      "status": "AVAILABLE FOR INTERVIEW",
      "risk": 41,
      "short": "Handles lab cleanup and sample logistics.",
      "reveal": "Shift ended at 18:00. Whereabouts after that are unclear.",
      "activity": "Scheduled shift ended at 18:00 with a normal tag-out. Little recorded activity afterwards, but his workstation session stayed open.",
      "notes": "Quiet, punctual, rarely questioned. Has routine access to cleaning solvents and lab storage lockers.",
      "key": "ryan",
      "order": 3,
      "log": [
        {
          "time": "18:00",
          "event": "Tags out of Lab B (end of shift)"
        },
        {
          "time": "—",
          "event": "No further entries recorded under his name"
        },
        {
          "time": "22:16",
          "event": "Workstation WS-B07 session still active"
        },
        {
          "time": "07:40",
          "event": "Arrives for next shift as normal"
        }
      ]
    }
  ],
  "clues": [
    {
      "kind": "log",
      "title": "Security Log",
      "short": "Lab B door controller events",
      "role": "supporting",
      "suspects": [
        "maya",
        "ryan"
      ],
      "detail": "The controller log shows a maintenance override at 21:50 followed by a door-open event on the Lab B side entrance at 22:09. The override was a scheduled task, but it suspended camera-door correlation for about twenty minutes.",
      "reveal": "Override at 21:50 · door open at 22:09",
      "found": "Control room server",
      "hint": "The log explains HOW the gap existed, but the door-open event needs a card behind it.",
      "key": "c1",
      "order": 1,
      "why": "The override was scheduled and explains how the camera-door gap existed, but it does not say who walked through the door."
    },
    {
      "kind": "card",
      "title": "Access Card Record",
      "short": "Card swipe at the Lab B side door",
      "role": "key",
      "suspects": [
        "ryan"
      ],
      "detail": "The 22:09 door-open event was authorised by a Level 2 card. The card belongs to a Lab Assistant who tagged out of the building at 18:00 and had no scheduled work that evening.",
      "reveal": "Level 2 card used 4 hours after tag-out",
      "found": "Badge reader dump",
      "hint": "Look at whose card was used and whether they should have been inside.",
      "key": "c2",
      "order": 2
    },
    {
      "kind": "cup",
      "title": "Coffee Cup",
      "short": "Cold cup on the lab bench",
      "role": "misleading",
      "suspects": [
        "alex"
      ],
      "detail": "A paper cup with the initials \"A.M.\" was left on the Lab B bench. The liquid was cold and a skin had formed. It looks incriminating at first glance.",
      "reveal": "Initials A.M. · cold for hours",
      "found": "Lab B bench",
      "why": "The cup dates from the 15:40 stand-up. Alex was verified on Floor 2 at the time of the theft, so the cup proves nothing about 22:14.",
      "key": "c3",
      "order": 3
    },
    {
      "kind": "case",
      "title": "Broken Prototype Casing",
      "short": "Fragment discarded near the lockers",
      "role": "key",
      "suspects": [
        "ryan"
      ],
      "detail": "A cracked casing fragment was recovered from a recycle bin outside the staff lockers. It carries residue of solvent LB-9, a cleaner used only by lab assistants.",
      "reveal": "Solvent LB-9 · lab-assistant stock only",
      "found": "Locker corridor bin",
      "hint": "Trace the residue on the casing. Who handles that solvent?",
      "key": "c4",
      "order": 4
    },
    {
      "kind": "cctv",
      "title": "CCTV Timestamp",
      "short": "Footage gap from 22:11 to 22:15",
      "role": "key",
      "suspects": [
        "ryan",
        "alex"
      ],
      "detail": "Lab B footage shows a hooded figure with a dark case at 22:11, then the timestamp stutters for four minutes. Separate Floor 2 footage places Alex at his desk at 22:12.",
      "reveal": "Alex on Floor 2 at 22:12 · Lab B gap 22:11–22:15",
      "found": "CCTV archive",
      "hint": "Footage can clear someone as well as implicate someone. Who is NOT on Floor 2?",
      "key": "c5",
      "order": 5
    },
    {
      "kind": "file",
      "title": "Deleted File",
      "short": "inventory_sync.log removed at 22:16",
      "role": "key",
      "suspects": [
        "ryan"
      ],
      "detail": "Forensics recovered inventory_sync.log, deleted two minutes after the theft from workstation WS-B07 under a Lab Assistant login. It tracked the prototype's storage location.",
      "reveal": "Deleted from WS-B07 at 22:16",
      "found": "Workstation WS-B07",
      "hint": "Whose login was active on WS-B07 right after the theft?",
      "key": "c6",
      "order": 6
    }
  ],
  "evidence": [
    {
      "kind": "ledger",
      "title": "Lab Access Ledger",
      "short": "Printed door ledger, evening of the incident",
      "role": "key",
      "clues": [
        "c1",
        "c2"
      ],
      "detail": "The ledger lists every door event in order. The 22:09 swipe is the only entry with no matching shift roster entry.",
      "reveal": "One swipe with no shift on the roster",
      "found": "Security office",
      "hint": "Compare the ledger against the shift roster.",
      "key": "e1",
      "order": 1
    },
    {
      "kind": "dump",
      "title": "Badge Reader Hardware Dump",
      "short": "Raw reader memory, card ID attached",
      "role": "key",
      "clues": [
        "c2",
        "c5"
      ],
      "detail": "The raw dump ties the 22:09 swipe to a card ID that matches a Lab Assistant credential, and aligns the swipe with the 22:11 footage.",
      "reveal": "Card ID matches Lab Assistant credential",
      "found": "Reader controller",
      "hint": "The hardware record is harder to dispute than a ledger.",
      "key": "e2",
      "order": 2
    },
    {
      "kind": "image",
      "title": "Workstation Forensic Image",
      "short": "Disk image of WS-B07",
      "role": "key",
      "clues": [
        "c6"
      ],
      "detail": "The image confirms the deletion at 22:16, performed in a session opened under a Lab Assistant account that was never logged out.",
      "reveal": "Deletion confirmed in lab-assistant session",
      "found": "IT forensics",
      "hint": "A deletion needs a session. Whose session was it?",
      "key": "e3",
      "order": 3
    },
    {
      "kind": "form",
      "title": "Overtime Approval Form",
      "short": "Alex Morgan, until 23:00",
      "role": "misleading",
      "clues": [
        "c3"
      ],
      "detail": "Alex had approval to work late, which put him in the building during the incident window.",
      "reveal": "Alex approved to work until 23:00",
      "found": "HR system",
      "why": "Being in the building is not the same as being in Lab B. The overtime was spent on Floor 2, confirmed by the CCTV and a firmware commit at 22:05.",
      "key": "e4",
      "order": 4
    },
    {
      "kind": "ticket",
      "title": "Maintenance Ticket MT-7731",
      "short": "Scheduled door-controller override",
      "role": "misleading",
      "clues": [
        "c1"
      ],
      "detail": "The ticket authorises Maya's 21:50 override and was created three days earlier.",
      "reveal": "Override filed three days in advance",
      "found": "Ticketing system",
      "why": "The override was legitimate and pre-filed. It created the opportunity, but it was not the action that removed the prototype.",
      "key": "e5",
      "order": 5
    },
    {
      "kind": "photo",
      "title": "Locker Corridor Photograph",
      "short": "Bin contents, taken at 07:40",
      "role": "supporting",
      "clues": [
        "c4",
        "c5"
      ],
      "detail": "Photograph of the bin outside the staff lockers showing the casing fragment and a cleaning cloth from the lab-assistant supply cart.",
      "reveal": "Casing beside a lab-assistant cleaning cloth",
      "found": "Investigator camera",
      "hint": "The photo shows where the casing ended up, and what lay next to it.",
      "key": "e6",
      "order": 6
    }
  ],
  "timeline": [
    {
      "n": "01",
      "time": "18:20",
      "title": "Prototype secured",
      "text": "Maya's team seals the prototype in Vault 3 of Lab B. Ryan Cole tagged out of the building at 18:00."
    },
    {
      "n": "02",
      "time": "22:09",
      "title": "Security access recorded",
      "text": "After the scheduled 21:50 override, a Level 2 card opens the Lab B side door. No shift is on the roster."
    },
    {
      "n": "03",
      "time": "22:11",
      "title": "Suspicious activity detected",
      "text": "CCTV shows a hooded figure with a dark case, then the timestamp stutters for four minutes."
    },
    {
      "n": "04",
      "time": "22:14",
      "title": "Prototype removed",
      "text": "Vault 3 reports empty. The firmware beacon goes silent. inventory_sync.log is deleted at 22:16."
    },
    {
      "n": "05",
      "time": "07:40",
      "title": "Evidence discovered",
      "text": "The casing is found in the locker corridor bin. Forensics recovers the deleted file from WS-B07."
    },
    {
      "n": "06",
      "time": "NOW",
      "title": "Case solved",
      "text": "The card record, footage, deleted file and casing converge on one person: Ryan Cole."
    }
  ],
  "report": {
    "what": "Ryan Cole finished his shift at 18:00 but kept his workstation session open. Knowing Maya's scheduled override would loosen door-to-camera correlation at 21:50, he returned at 22:09 using his own Level 2 card, took the prototype from Vault 3, and left in the four minute CCTV gap. At 22:16 he deleted inventory_sync.log from WS-B07 to hide the storage trail, and discarded the damaged casing in the locker corridor bin, where residue of lab-assistant-only solvent LB-9 gave him away.",
    "conclusion": "Every chain of independent evidence leads to Ryan Cole. Alex Morgan was verifiably on Floor 2. Maya Chen's override was legitimate and pre-filed. Case 404 is closed: the prototype was removed by Ryan Cole, Lab Assistant."
  }
};
