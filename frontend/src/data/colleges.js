// Local copy of the college catalog (mirrors backend/data/colleges.json)
// so the demo build works without a backend.
const colleges = [
  { _id: "c1", name: "MIT", location: "Cambridge, MA, USA", ranking: 1, acceptanceRate: 0.07, avgGRE: 335, avgTOEFL: 115, avgCGPA: 9.6, minCGPA: 9.0, tuition: 60000, courses: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "AI & Data Science"], website: "https://web.mit.edu" },
  { _id: "c2", name: "Stanford University", location: "Stanford, CA, USA", ranking: 2, acceptanceRate: 0.04, avgGRE: 334, avgTOEFL: 114, avgCGPA: 9.6, minCGPA: 9.0, tuition: 58000, courses: ["Computer Science", "Data Science", "Electrical Engineering", "Management Science"], website: "https://www.stanford.edu" },
  { _id: "c3", name: "UC Berkeley", location: "Berkeley, CA, USA", ranking: 3, acceptanceRate: 0.17, avgGRE: 328, avgTOEFL: 110, avgCGPA: 9.2, minCGPA: 8.5, tuition: 44000, courses: ["Computer Science", "Statistics", "Electrical Engineering"], website: "https://www.berkeley.edu" },
  { _id: "c4", name: "Georgia Tech", location: "Atlanta, GA, USA", ranking: 6, acceptanceRate: 0.21, avgGRE: 325, avgTOEFL: 108, avgCGPA: 9.0, minCGPA: 8.3, tuition: 33000, courses: ["Computer Science", "Analytics", "Aerospace Engineering"], website: "https://www.gatech.edu" },
  { _id: "c5", name: "University of Michigan", location: "Ann Arbor, MI, USA", ranking: 8, acceptanceRate: 0.23, avgGRE: 324, avgTOEFL: 106, avgCGPA: 8.9, minCGPA: 8.2, tuition: 35000, courses: ["Computer Science", "Data Science", "Industrial Engineering"], website: "https://umich.edu" },
  { _id: "c6", name: "UCLA", location: "Los Angeles, CA, USA", ranking: 10, acceptanceRate: 0.24, avgGRE: 323, avgTOEFL: 105, avgCGPA: 8.8, minCGPA: 8.0, tuition: 34000, courses: ["Computer Science", "Data Science", "Electrical Engineering"], website: "https://www.ucla.edu" },
  { _id: "c7", name: "Purdue University", location: "West Lafayette, IN, USA", ranking: 14, acceptanceRate: 0.31, avgGRE: 320, avgTOEFL: 103, avgCGPA: 8.5, minCGPA: 7.8, tuition: 30000, courses: ["Computer Science", "Mechanical Engineering", "Aeronautics"], website: "https://www.purdue.edu" },
  { _id: "c8", name: "ASU Tempe", location: "Tempe, AZ, USA", ranking: 25, acceptanceRate: 0.55, avgGRE: 315, avgTOEFL: 98, avgCGPA: 8.0, minCGPA: 7.0, tuition: 26000, courses: ["Computer Science", "Software Engineering", "Data Science"], website: "https://www.asu.edu" },
  { _id: "c9", name: "UT Dallas", location: "Richardson, TX, USA", ranking: 30, acceptanceRate: 0.52, avgGRE: 314, avgTOEFL: 97, avgCGPA: 7.9, minCGPA: 7.0, tuition: 24000, courses: ["Computer Science", "Data Analytics", "Information Systems"], website: "https://www.utdallas.edu" },
  { _id: "c10", name: "University at Buffalo", location: "Buffalo, NY, USA", ranking: 35, acceptanceRate: 0.57, avgGRE: 312, avgTOEFL: 95, avgCGPA: 7.7, minCGPA: 6.8, tuition: 23000, courses: ["Computer Science", "Electrical Engineering", "Data Science"], website: "https://www.buffalo.edu" },
];

export default colleges;
