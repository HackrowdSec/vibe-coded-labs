// Fictional people, fictional money. Resets on restart.
const members = [
  { id: "m1", email: "ngozi@ajo.test", password: "ngozi-demo", name: "Mama Ngozi", role: "coordinator", stall: "Balogun B14, fabrics", phone: "0801 000 0001", homeAddress: "7 Sample Lane, Lagos Island", nextOfKin: "Chidi (son), 0801 000 0011", balance: 186000, paidThisWeek: true },
  { id: "m2", email: "tunde@ajo.test", password: "tunde-demo", name: "Tunde Bakare", role: "member", stall: "Balogun C3, shoes", phone: "0802 000 0002", homeAddress: "21 Example Street, Surulere", nextOfKin: "Bisi (wife), 0802 000 0022", balance: 142000, paidThisWeek: true },
  { id: "m3", email: "aisha@ajo.test", password: "aisha-demo", name: "Aisha Lawal", role: "member", stall: "Balogun A9, beads", phone: "0803 000 0003", homeAddress: "3 Demo Close, Ebute Metta", nextOfKin: "Musa (brother), 0803 000 0033", balance: 151000, paidThisWeek: false },
  { id: "m4", email: "emeka@ajo.test", password: "emeka-demo", name: "Emeka Obi", role: "member", stall: "Balogun D1, phones", phone: "0804 000 0004", homeAddress: "9 Test Avenue, Yaba", nextOfKin: "Ada (sister), 0804 000 0044", balance: 98000, paidThisWeek: true },
];
const circle = { name: "Balogun Traders Circle", weekly: 10000, pot: 400000, nextPayoutTo: "m2", payoutApproved: false };
module.exports = { members, circle };
