// Fictional clinic, fictional patients. Resets on restart.
const clinics = [{ id: 1, name: "Sample Family Clinic, Yaba", hours: "Mon to Sat, 8am to 6pm" }];
const appointments = [
  { id: 101, clinic_id: 1, patient: "Funke A.", phone: "0805 000 0101", date: "2026-11-16", time: "09:00", reason: "Follow-up: blood pressure medication" },
  { id: 102, clinic_id: 1, patient: "Kunle O.", phone: "0806 000 0102", date: "2026-11-16", time: "10:30", reason: "Persistent cough, two weeks" },
  { id: 103, clinic_id: 1, patient: "Ifeoma N.", phone: "0807 000 0103", date: "2026-11-17", time: "11:00", reason: "Antenatal check, 24 weeks" },
  { id: 104, clinic_id: 1, patient: "Yusuf B.", phone: "0808 000 0104", date: "2026-11-17", time: "14:00", reason: "Test results review" },
];
module.exports = { clinics, appointments };
