export interface Course {
  code: string;
  name: string;
  year: 1 | 2 | 3 | 4;
  program: 'Electrical' | 'Computer' | 'Common';
  specialization?: 'Software' | 'Hardware';
  semester?: 1 | 2;
  description?: string;
}

export interface CourseGroup {
  name: string;
  courses: Course[];
}

export const courseGroups: CourseGroup[] = [
  {
    name: 'First Year',
    courses: [
      // Fall Semester (Semester 1)
      { 
        code: 'CEN 100',
        name: 'Introduction to Engineering',
        year: 1,
        program: 'Common',
        semester: 1
      },
      { 
        code: 'CHY 102',
        name: 'General Chemistry',
        year: 1,
        program: 'Common',
        semester: 1
      },
      { 
        code: 'MTH 140',
        name: 'Calculus I',
        year: 1,
        program: 'Common',
        semester: 1
      },
      { 
        code: 'MTH 141',
        name: 'Linear Algebra',
        year: 1,
        program: 'Common',
        semester: 1
      },
      { 
        code: 'PCS 211',
        name: 'Physics: Mechanics',
        year: 1,
        program: 'Common',
        semester: 1
      },

      // Winter Semester (Semester 2)
      { 
        code: 'CPS 188',
        name: 'Computer Programming Fundamentals',
        year: 1,
        program: 'Common',
        semester: 2
      },
      { 
        code: 'ECN 801',
        name: 'Principles of Engineering Economics',
        year: 1,
        program: 'Common',
        semester: 2
      },
      { 
        code: 'ELE 202',
        name: 'Electric Circuit Analysis',
        year: 1,
        program: 'Common',
        semester: 2
      },
      { 
        code: 'MTH 240',
        name: 'Calculus II',
        year: 1,
        program: 'Common',
        semester: 2
      },
      { 
        code: 'PCS 125',
        name: 'Physics: Waves and Fields',
        year: 1,
        program: 'Common',
        semester: 2
      }
    ]
  },
  {
    name: 'Electrical Engineering',
    courses: [
      // Second Year - Fall Semester
      { 
        code: 'COE 318',
        name: 'Software Systems',
        year: 2,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'COE 328',
        name: 'Digital Systems',
        year: 2,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 302',
        name: 'Electric Networks',
        year: 2,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'MTH 425',
        name: 'Differential Equations and Vector Calculus',
        year: 2,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'PCS 224',
        name: 'Solid State Physics',
        year: 2,
        program: 'Electrical',
        semester: 1
      },

      // Second Year - Winter Semester
      { 
        code: 'CMN 432',
        name: 'Communication in the Engineering Professions',
        year: 2,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'COE 428',
        name: 'Engineering Algorithms and Data Structures',
        year: 2,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 401',
        name: 'Electric and Magnetic Fields',
        year: 2,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 404',
        name: 'Electronic Circuits I',
        year: 2,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'MTH 314',
        name: 'Discrete Mathematics for Engineers',
        year: 2,
        program: 'Electrical',
        semester: 2
      },

      // Third Year - Fall Semester
      { 
        code: 'COE 538',
        name: 'Microprocessor Systems',
        year: 3,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 504',
        name: 'Electronic Circuits II',
        year: 3,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 531',
        name: 'Electromagnetics',
        year: 3,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 532',
        name: 'Signals and Systems I',
        year: 3,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'MTH 514',
        name: 'Probability and Stochastic Processes',
        year: 3,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 632',
        name: 'Signals and Systems II',
        year: 3,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 635',
        name: 'Communication Systems',
        year: 3,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 637',
        name: 'Energy Conservation',
        year: 3,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 639',
        name: 'Control Systems',
        year: 3,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'MEC 511',
        name: 'Thermodynamics and Fluids',
        year: 3,
        program: 'Electrical',
        semester: 1
      },

      // Fourth Year - Fall Semester
      { 
        code: 'ELE 70A/B*',
        name: 'Electrical Engineering Capstone Design',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'CEN 800',
        name: 'Law and Ethics in Engineering Practice',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'COE 718',
        name: 'Embedded Systems Design',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'COE 768',
        name: 'Computer Networks',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 707',
        name: 'Sensors and Measurements',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 714',
        name: 'System Testing and Design-for-Testability',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 719',
        name: 'Fundamentals of Robotics',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 727',
        name: 'CMOS Analog Integrated Circuits',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 734',
        name: 'Low Power Digital Integrated Circuits',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 745',
        name: 'Digital Communication Systems',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 746',
        name: 'Power Systems Analysis',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 747',
        name: 'Advanced Electric Drives',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 754',
        name: 'Power Electronics',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 792',
        name: 'Digital Signal Processing',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 809',
        name: 'Digital Control System Design',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 829',
        name: 'System Models and Identification',
        year: 4,
        program: 'Electrical',
        semester: 1
      },
      { 
        code: 'ELE 861',
        name: 'Microwave Engineering',
        year: 4,
        program: 'Electrical',
        semester: 1
      },

      // Fourth Year - Winter Semester
      { 
        code: 'CEN 810',
        name: 'Selected Topics in Engineering',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'COE 528',
        name: 'Object Oriented Eng Analysis and Design',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'COE 608',
        name: 'Computer Organization and Architecture',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'COE 628',
        name: 'Operating Systems',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'COE 838',
        name: 'Systems-on-Chip Design',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'COE 865',
        name: 'Advanced Computer Networks',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 709',
        name: 'Real-Time Computer Control Systems',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 801',
        name: 'Electric Vehicles',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 804',
        name: 'Radio-Frequency Circuits and Systems',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 806',
        name: 'Alternative Energy Systems',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 815',
        name: 'Wireless Communications',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 819',
        name: 'Control of Robotic Manipulators',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 827',
        name: 'CMOS Mixed-Signal Circuits and Systems',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 846',
        name: 'Power Systems Protection and Control',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 863',
        name: 'VLSI Circuits for Data Communications',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 882',
        name: 'Intro to Digital Image Processing',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 884',
        name: 'Photonics',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 885',
        name: 'Optical Communication Systems',
        year: 4,
        program: 'Electrical',
        semester: 2
      },
      { 
        code: 'ELE 888',
        name: 'Intelligent Systems',
        year: 4,
        program: 'Electrical',
        semester: 2
      }
    ]
  },
  {
    name: 'Computer Engineering',
    courses: [
      // Second Year - Fall Semester
      { 
        code: 'COE 318',
        name: 'Software Systems',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 328',
        name: 'Digital Systems',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 302',
        name: 'Electric Networks',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'MTH 425',
        name: 'Differential Equations and Vector Calculus',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'PCS 224',
        name: 'Solid State Physics',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },

      // Third Year - Fall Semester
      { 
        code: 'COE 501',
        name: 'Electromagnetism',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 538',
        name: 'Microprocessor Systems',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 532',
        name: 'Signals and Systems I',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'MEC 511',
        name: 'Thermodynamics and Fluids',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'MTH 514',
        name: 'Probability and Stochastic Processes',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },

      // Third Year - Winter Semester
      { 
        code: 'COE 608',
        name: 'Computer Organization and Architecture',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 628',
        name: 'Operating Systems',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 632',
        name: 'Signals and Systems II',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 635',
        name: 'Communication Systems',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 639',
        name: 'Control Systems',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'CPS 688',
        name: 'Advanced Algorithms',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },

      // Fourth Year - Fall Semester
      { 
        code: 'COE 70A/B*',
        name: 'Computer Engineering Capstone Design',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 758',
        name: 'Digital Systems Engineering',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 768',
        name: 'Computer Networks',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'CEN 800',
        name: 'Law and Ethics in Engineering Practice',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 718',
        name: 'Embedded Systems Design',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'CPS 710',
        name: 'Compilers and Interpreters',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'CPS 843',
        name: 'Introduction to Computer Vision',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 734',
        name: 'Low Power Digital Integrated Circuits',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Hardware'
      },

      // Fourth Year - Winter Semester
      { 
        code: 'COE 817',
        name: 'Network Security',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 818',
        name: 'Advanced Computer Architecture',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 838',
        name: 'Systems-on-Chip Design',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 848',
        name: 'Fundamentals of Data Engineering',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 865',
        name: 'Advanced Computer Networks',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'CPS 888',
        name: 'Software Engineering',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'COE 892',
        name: 'Distributed and Cloud Computing',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'CEN 810',
        name: 'Selected Topics in Engineering',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 709',
        name: 'Real-Time Computer Control Systems',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 815',
        name: 'Wireless Communications',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 863',
        name: 'VLSI Circuits for Data Communications',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 882',
        name: 'Intro to Digital Image Processing',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 885',
        name: 'Optical Communication Systems',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      },
      { 
        code: 'ELE 888',
        name: 'Intelligent Systems',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Hardware'
      }
    ]
  },
  {
    name: 'Computer Engineering (Software)',
    courses: [
      // Second Year - Fall Semester
      { 
        code: 'COE 318',
        name: 'Software Systems',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'COE 328',
        name: 'Digital Systems',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'ELE 302',
        name: 'Electric Networks',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'MTH 425',
        name: 'Differential Equations and Vector Calculus',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'PCS 224',
        name: 'Solid State Physics',
        year: 2,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },

      // Second Year - Winter Semester
      { 
        code: 'CMN 432',
        name: 'Communication in the Engineering Professions',
        year: 2,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'COE 428',
        name: 'Engineering Algorithms and Data Structures',
        year: 2,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'COE 528',
        name: 'Object Oriented Eng Analysis and Design',
        year: 2,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'ELE 404',
        name: 'Electronic Circuits I',
        year: 2,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'MTH 314',
        name: 'Discrete Mathematics for Engineers',
        year: 2,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      // Third Year - Fall Semester
      { 
        code: 'CPS 510',
        name: 'Database Systems I',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'COE 538',
        name: 'Microprocessor Systems',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'ELE 532',
        name: 'Signals and Systems I',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'MEC 511',
        name: 'Thermodynamics and Fluids',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'MTH 514',
        name: 'Probability and Stochastic Processes',
        year: 3,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },

      // Third Year - Winter Semester
      { 
        code: 'COE 608',
        name: 'Computer Organization and Architecture',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'COE 628',
        name: 'Operating Systems',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'CPS 688',
        name: 'Advanced Algorithms',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'COE 691',
        name: 'Software Requirement Analysis and SPEC',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'COE 692',
        name: 'Software Design and Architecture',
        year: 3,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },

      // Fourth Year - Fall Semester
      { 
        code: 'COE 70A/B*',
        name: 'Computer Engineering Capstone Design',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'COE 768',
        name: 'Computer Networks',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'CPS 714',
        name: 'Software Project Management',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'CEN 800',
        name: 'Law and Ethics in Engineering Practice',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'COE 891',
        name: 'Software Testing and Quality Assurance',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'COE 892',
        name: 'Distributed & Cloud Computing',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'COE 718',
        name: 'Embedded Systems Design',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'COE 758',
        name: 'Digital Systems Engineering',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'CPS 710',
        name: 'Compilers and Interpreters',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'CPS 843',
        name: 'Introduction to Computer Vision',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },
      { 
        code: 'ELE 734',
        name: 'Low Power Digital Integrated Circuits',
        year: 4,
        program: 'Computer',
        semester: 1,
        specialization: 'Software'
      },

      // Fourth Year - Winter Semester
      { 
        code: 'COE 817',
        name: 'Network Security',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'COE 838',
        name: 'Systems-on-Chip Design',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'COE 865',
        name: 'Advanced Computer Networks',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'CEN 810',
        name: 'Selected Topics in Engineering',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'ELE 632',
        name: 'Signal and Systems II',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'ELE 635',
        name: 'Communication Systems',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'ELE 639',
        name: 'Control Systems',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      },
      { 
        code: 'ELE 888',
        name: 'Intelligent Systems',
        year: 4,
        program: 'Computer',
        semester: 2,
        specialization: 'Software'
      }
    ]
  }
];

// Helper function to get all courses
export const getAllCourses = (): Course[] => {
  return courseGroups.flatMap(group => group.courses);
};

// Helper function to get courses by group
export const getCoursesByGroup = (groupName: string): Course[] => {
  const group = courseGroups.find(g => g.name === groupName);
  return group ? group.courses : [];
}; 