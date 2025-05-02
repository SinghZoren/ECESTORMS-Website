'use client';

interface CourseNodeProps {
  code: string;
  name: string;
  prerequisites?: string[];
  corequisites?: string[];
  antirequisites?: string[];
  description?: string;
  url?: string;
}

interface CourseTreeProps {
  year: number | null;
  stream: 'electrical' | 'computer' | null;
  isSoftwareSpecialization: boolean;
  onCourseClick?: (courseCode: string) => void;
}

// Common First Year
const commonFirstYear: CourseNodeProps[] = [
  { 
    code: 'CEN 100', 
    name: 'Introduction to Engineering',
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/common-engineering/CEN/100/'
  },
  { 
    code: 'CHY 102', 
    name: 'General Chemistry',
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/chemistry/CHY/102/'
  },
  { 
    code: 'MTH 140', 
    name: 'Calculus I',
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/140/'
  },
  { 
    code: 'MTH 141', 
    name: 'Linear Algebra',
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/141/'
  },
  { 
    code: 'PCS 211', 
    name: 'Physics: Mechanics',
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/physics/PCS/211/'
  },
  { 
    code: 'LIBERAL 1', 
    name: 'Lower Level Liberal Studies', 
    corequisites: [],
    antirequisites: [],
    description: 'One course from Table A - Lower Level Liberal Studies.',
    url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_a/'
  },
];

const commonFirstYearSecondSem: CourseNodeProps[] = [
  { 
    code: 'CPS 188', 
    name: 'Computer Programming Fundamentals',
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-science/CPS/188/'
  },
  { 
    code: 'ECN 801', 
    name: 'Principles of Engineering Economics',
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/economics/ECN/801/'
  },
  { 
    code: 'ELE 202', 
    name: 'Electric Circuit Analysis', 
    prerequisites: ['MTH 140', 'PCS 211'],
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/202/'
  },
  { 
    code: 'MTH 240', 
    name: 'Calculus II', 
    prerequisites: ['MTH 140'],
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/240/'
  },
  { 
    code: 'PCS 125', 
    name: 'Physics: Waves and Fields', 
    prerequisites: ['PCS 211'],
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/physics/PCS/125/'
  },
];

// Electrical Engineering Courses
const electricalCourses = {
  year2sem1: [
    { 
      code: 'COE 318', 
      name: 'Software Systems', 
      prerequisites: ['CHY 102', 'CPS 188', 'ELE 202', 'MTH 240', 'PCS 211'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/318/'
    },
    { 
      code: 'COE 328', 
      name: 'Digital Systems', 
      prerequisites: ['CPS 188', 'ELE 202', 'MTH 240'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/328/'
    },
    { 
      code: 'ELE 302', 
      name: 'Electric Networks', 
      prerequisites: ['CHY 102', 'MTH 140', 'MTH 141', 'PCS 125', 'PCS 211', 'CPS 188', 'ELE 202', 'MTH 240'], 
      corequisites: ['MTH 312 or MTH 425'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/302/'
    },
    { 
      code: 'MTH 425', 
      name: 'Differential Equations and Vector Calculus', 
      prerequisites: ['MTH 140', 'MTH 141', 'MTH 240'], 
      antirequisites: ['MTH 312', 'MTH 330', 'MTH 430', 'MTH 350'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/425/'
    },
    { 
      code: 'PCS 224', 
      name: 'Solid State Physics', 
      prerequisites: ['PCS 125 or PCS 110, or PCS 130'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/physics/PCS/224/'
    },
  ],
  year2sem2: [
    { 
      code: 'CMN 432', 
      name: 'Communication in the Engineering Professions',
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/communication/CMN/432/'
    },
    { 
      code: 'COE 428', 
      name: 'Engineering Algorithms and Data Structures', 
      prerequisites: ['COE 318'],
      corequisites: ['MTH 314'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/428/'
    },
    { 
      code: 'ELE 401', 
      name: 'Electric and Magnetic Fields', 
      prerequisites: ['MTH 425 or MTH 312'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/401/'
    },
    { 
      code: 'ELE 404', 
      name: 'Electronic Circuits I', 
      prerequisites: ['ELE 302', 'MTH 312 or MTH 425', 'PCS 224'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/404/'
    },
    { 
      code: 'MTH 314', 
      name: 'Discrete Mathematics for Engineers', 
      prerequisites: ['MTH 240', 'MTH 141'],
      antirequisites: ['MTH 110'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/314/'
    },
  ],
  year3sem1: [
    { 
      code: 'COE 538', 
      name: 'Microprocessor Systems', 
      prerequisites: ['COE 328', 'COE 428', 'MTH 314'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/538/'
    },
    { 
      code: 'ELE 504', 
      name: 'Electronic Circuits II', 
      prerequisites: ['ELE 404'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/504/'
    },
    { 
      code: 'ELE 531', 
      name: 'Electromagnetics', 
      prerequisites: ['ELE 401'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/531/'
    },
    { 
      code: 'ELE 532', 
      name: 'Signals and Systems I', 
      prerequisites: ['COE 428', 'ELE 404', 'MTH 314'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/532/'
    },
    { 
      code: 'MTH 514', 
      name: 'Probability and Stochastic Processes', 
      prerequisites: ['MTH 312 or MTH 425'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/514/'
    },
    { 
      code: 'LIBERAL 2', 
      name: 'Lower Level Liberal Studies', 
      description: 'One course from Table A - Lower Level Liberal Studies.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_a/'
    },
  ],
  year3sem2: [
    { 
      code: 'ELE 632', 
      name: 'Signals and Systems II', 
      prerequisites: ['ELE 532'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/632/'
    },
    { 
      code: 'ELE 635', 
      name: 'Communication Systems', 
      prerequisites: ['ELE 532', 'MTH 514'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/635/'
    },
    { 
      code: 'ELE 637', 
      name: 'Energy Conservation', 
      prerequisites: ['ELE 302', 'ELE 531'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/637/'
    },
    { 
      code: 'ELE 639', 
      name: 'Control Systems', 
      prerequisites: ['ELE 532'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/639/'
    },
    { 
      code: 'MEC 511', 
      name: 'Thermodynamics and Fluids', 
      prerequisites: ['CHY 102', 'PCS 211', 'CPS 188', 'ELE 202', 'PCS 224', 'MTH 312 or MTH 425'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mechanical-engineering/MEC/511/'
    },
    { 
      code: 'LIBERAL 3', 
      name: 'Upper Level Liberal Studies', 
      description: 'One course from Table B - Upper Level Liberal Studies.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_b/'
    },
  ],
  year4sem1: [
    { 
      code: 'ELE 70A', 
      name: 'Electrical Engineering Capstone Design', 
      prerequisites: ['COE 538', 'ELE 504', 'ELE 632', 'ELE 635', 'ELE 637', 'ELE 639', 'MEC 511'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/70A/'
    },
    { 
      code: 'LIBERAL 4', 
      name: 'Upper Level Liberal Studies', 
      description: 'One course from: ENG 503 Science Fiction, GEO 702 Technology and the Contemporary Environment, HST 701 Scientific Technology and Modern Society, PHL 709 Religion, Science and Philosophy, or POL 507 Power, Change and Technology',
      url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_b/'
    },
    { 
      code: 'TABLE I 1', 
      name: 'Core Elective 1', 
      description: 'Choose from Table I Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/electrical/professional_table/'
    },
    { 
      code: 'TABLE I 2', 
      name: 'Core Elective 2', 
      description: 'Choose from Table I Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/electrical/professional_table/'
    },
    { 
      code: 'TABLE I 3', 
      name: 'Core Elective 3', 
      description: 'Choose from Table I Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/electrical/professional_table/'
    },
    { 
      code: 'TABLE I 4', 
      name: 'Core Elective 4', 
      description: 'Choose from Table I Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/electrical/professional_table/'
    },
  ],
  year4sem2: [
    { 
      code: 'CEN 800', 
      name: 'Law and Ethics in Engineering Practice', 
      prerequisites: [],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/common-engineering/CEN/800/'
    },
    { 
      code: 'ELE 70B', 
      name: 'Electrical Engineering Capstone Design', 
      prerequisites: ['COE 538', 'ELE 504', 'ELE 632', 'ELE 635', 'ELE 637', 'ELE 639', 'MEC 511'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/70A/'
    },
    { 
      code: 'TABLE II 1', 
      name: 'Core Elective 1', 
      description: 'Choose from Table II Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/electrical/professional_table/'
    },
    { 
      code: 'TABLE II 2', 
      name: 'Core Elective 2', 
      description: 'Choose from Table II Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/electrical/professional_table/'
    },
    { 
      code: 'TABLE II 3', 
      name: 'Core Elective 3', 
      description: 'Choose from Table II Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/electrical/professional_table/'
    },
  ],
};

// Computer Engineering Courses
const computerCourses = {
  year2sem1: [
    { 
      code: 'COE 318', 
      name: 'Software Systems', 
      prerequisites: ['CHY 102', 'CPS 188', 'ELE 202', 'MTH 240', 'PCS 211'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/318/'
    },
    { 
      code: 'COE 328', 
      name: 'Digital Systems', 
      prerequisites: ['CPS 188', 'ELE 202', 'MTH 240'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/328/'
    },
    { 
      code: 'ELE 302', 
      name: 'Electric Networks', 
      prerequisites: ['CHY 102', 'MTH 140', 'MTH 141', 'PCS 125', 'PCS 211', 'CPS 188', 'ELE 202', 'MTH 240'], 
      corequisites: ['MTH 312 or MTH 425'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/302/'
    },
    { 
      code: 'MTH 425', 
      name: 'Differential Equations and Vector Calculus', 
      prerequisites: ['MTH 140', 'MTH 141', 'MTH 240'], 
      antirequisites: ['MTH 312', 'MTH 330', 'MTH 430', 'MTH 350'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/425/'
    },
    { 
      code: 'PCS 224', 
      name: 'Solid State Physics', 
      prerequisites: ['PCS 125 or PCS 110, or PCS 130'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/physics/PCS/224/'
    },
  ],
  year2sem2: [
    { 
      code: 'CMN 432', 
      name: 'Communication in the Engineering Professions',
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/communication/CMN/432/'
    },
    { 
      code: 'COE 428', 
      name: 'Engineering Algorithms and Data Structures', 
      prerequisites: ['COE 318'],
      corequisites: ['MTH 314'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/428/'
    },
    { 
      code: 'COE 528', 
      name: 'Object Oriented Eng Analysis and Design', 
      prerequisites: ['COE 318'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/528/'
    },
    { 
      code: 'ELE 404', 
      name: 'Electronic Circuits I', 
      prerequisites: ['ELE 302', 'MTH 312 or MTH 425', 'PCS 224'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/404/'
    },
    { 
      code: 'MTH 314', 
      name: 'Discrete Mathematics for Engineers', 
      prerequisites: ['MTH 240', 'MTH 141'],
      antirequisites: ['MTH 110'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/314/'
    },
  ],
  year3sem1: [
    {
        code: 'COE 501', 
        name: 'Electromagnetism', 
        prerequisites: ['MTH 425 or MTH 312'],
        url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/501/'
    },
    { 
      code: 'COE 538', 
      name: 'Microprocessor Systems', 
      prerequisites: ['COE 328', 'ELE 404', 'MTH 314'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/538/'
    },
    { 
      code: 'ELE 532', 
      name: 'Signals and Systems I', 
      prerequisites: ['COE 428', 'ELE 404', 'MTH 314'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/532/'
    },
    { 
      code: 'MTH 514', 
      name: 'Probability and Stochastic Processes', 
      prerequisites: ['MTH 312 or MTH 425'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/514/'
    },
    { 
      code: 'MEC 511', 
      name: 'Thermodynamics and Fluids', 
      prerequisites: ['CHY 102', 'PCS 211', 'CPS 188', 'ELE 202', 'PCS 224', 'MTH 312 or MTH 425'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mechanical-engineering/MEC/511/'
    },
    { 
      code: 'LIBERAL 2', 
      name: 'Lower Level Liberal Studies', 
      description: 'One course from Table A - Lower Level Liberal Studies.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_a/'
    },
  ],
  year3sem2: [
    { 
      code: 'COE 608', 
      name: 'Computer Organization and Architecture', 
      prerequisites: ['COE 328', 'COE 538'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/608/'
    },
    { 
      code: 'COE 628', 
      name: 'Operating Systems', 
      prerequisites: ['COE 318', 'COE 428'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/628/'
    },
    {
        code: 'Required Group 1',
        name: 'Required Group 1',
        description: 'Choose any two courses from the following: ELE 635, ELE 639, CPS 688',
        url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/required_group/'
    },
    { 
      code: 'LIBERAL 3', 
      name: 'Upper Level Liberal Studies', 
      description: 'One course from Table B - Upper Level Liberal Studies.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_b/'
    },
  ],
  year4sem1: [
    { 
      code: 'COE 70A', 
      name: 'Computer Engineering Capstone Design', 
      prerequisites: ['COE 528', 'COE 608', 'COE 628', 'MEC 511', 'MTH 514', 'and', '[(COE 501, ELE 632, ELE 635, and ELE 639) or (COE 501, CPS 688, ELE 632, and ELE 635) or (COE 501, ELE 632, ELE 639, and CPS 688) or ( COE 691, COE 692, CPS 688, and ELE 532)]'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/70A/'
    },
    { 
      code: 'COE 758', 
      name: 'Digital Systems Engineering', 
      prerequisites: ['(COE 538 or ELE 538) and COE 608'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/758/'
    },
    { 
      code: 'COE 768', 
      name: 'Computer Networks', 
      prerequisites: ['(COE 538 or ELE 538) and ELE 532'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/768/'
    },
    { 
      code: 'TABLE I 1', 
      name: 'Core Elective 1', 
      description: 'Choose from Table I Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_i/'
    },
    { 
      code: 'TABLE I 2', 
      name: 'Core Elective 2', 
      description: 'Choose from Table I Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_i/'
    },
    { 
      code: 'LIBERAL 4', 
      name: 'Upper Level Liberal Studies', 
      description: 'One course from: ENG 503 Science Fiction, GEO 702 Technology and the Contemporary Environment, HST 701 Scientific Technology and Modern Society, PHL 709 Religion, Science and Philosophy, or POL 507 Power, Change and Technology',
      url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_b/'
    },
  ],
  year4sem2: [
    { 
      code: 'CEN 800', 
      name: 'Law and Ethics in Engineering Practice', 
      prerequisites: [],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/common-engineering/CEN/800/'
    },
    { 
      code: 'COE 70B', 
      name: 'Computer Engineering Capstone Design', 
      prerequisites: ['COE 528', 'COE 608', 'COE 628', 'MEC 511', 'MTH 514', 'and', '[(COE 501, ELE 632, ELE 635, and ELE 639) or (COE 501, CPS 688, ELE 632, and ELE 635) or (COE 501, ELE 632, ELE 639, and CPS 688) or ( COE 691, COE 692, CPS 688, and ELE 532)]'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/70A/'
    },
    { 
      code: 'TABLE II 1', 
      name: 'Core Elective 1', 
      description: 'Choose from Table II Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_ii/'
    },
    { 
      code: 'TABLE II 2', 
      name: 'Core Elective 2', 
      description: 'Choose from Table II Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_ii/'
    },
    { 
      code: 'TABLE II 3', 
      name: 'Core Elective 3', 
      description: 'Choose from Table II Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_ii/'
    },
    { 
      code: 'TABLE II 4', 
      name: 'Core Elective 4', 
      description: 'Choose from Table II Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_ii/'
    },
  ],
};

// Software Specialization Additional Courses (for Computer Engineering)
const softwareSpecializationCourses = {
  year3sem1: [
    { 
      code: 'CPS 510', 
      name: 'Database Systems I', 
      prerequisites: ['CPS 305 or (COE 428 and COE 528)'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-science/CPS/510/'
    },
    { 
      code: 'COE 538', 
      name: 'Microprocessor Systems', 
      prerequisites: ['COE 328', 'ELE 404', 'MTH 314'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/538/'
    },
    { 
      code: 'ELE 532', 
      name: 'Signals and Systems I', 
      prerequisites: ['COE 428', 'ELE 404', 'MTH 314'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/532/'
    },
    { 
        code: 'MTH 514', 
        name: 'Probability and Stochastic Processes', 
        prerequisites: ['MTH 312 or MTH 425'],
        url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mathematics/MTH/514/'
    },
    { 
      code: 'MEC 511', 
      name: 'Thermodynamics and Fluids', 
      prerequisites: ['CHY 102', 'PCS 211', 'CPS 188', 'ELE 202', 'PCS 224', 'MTH 312 or MTH 425'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/mechanical-engineering/MEC/511/'
    },
    { 
      code: 'LIBERAL 2', 
      name: 'Lower Level Liberal Studies', 
      description: 'One course from Table A - Lower Level Liberal Studies.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_a/'
    },
  ],
  year3sem2: [
    { 
      code: 'COE 608', 
      name: 'Computer Organization and Architecture', 
      prerequisites: ['COE 328','COE 538'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/608/'
    },
    { 
      code: 'COE 628', 
      name: 'Operating Systems', 
      prerequisites: ['COE 318','COE 428'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/628/'
    },
    { 
      code: 'CPS 688', 
      name: 'Advanced Algorithms', 
      prerequisites: ['COE 428'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-science/CPS/688/'
    },
    { 
      code: 'COE 691', 
      name: 'Software Requirement Analysis and SPEC', 
      prerequisites: ['COE 428','COE 528', 'CPS 510'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/691/'
    },
    { 
      code: 'COE 692', 
      name: 'Software Design and Architecture', 
      prerequisites: ['COE 428','COE 528', 'CPS 510'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/692/'
    },
    { 
      code: 'LIBERAL 3', 
      name: 'Upper Level Liberal Studies', 
      description: 'One course from Table B - Upper Level Liberal Studies.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_b/'
    },
  ],
  year4sem1: [
    { 
      code: 'COE 70A', 
      name: 'Computer Engineering Capstone Design', 
      prerequisites: ['COE 528', 'COE 608', 'COE 628', 'MEC 511', 'MTH 514', 'and', '[(COE 501, ELE 632, ELE 635, and ELE 639) or (COE 501, CPS 688, ELE 632, and ELE 635) or (COE 501, ELE 632, ELE 639, and CPS 688) or ( COE 691, COE 692, CPS 688, and ELE 532)]'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/70A/'
    },
    { 
      code: 'COE 768', 
      name: 'Computer Networks', 
      prerequisites: ['COE 538 or ELE 538', 'ELE 532'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/768/'
    },
    { 
      code: 'CPS 714', 
      name: 'Software Project Management', 
      prerequisites: ['CPS 406 or (COE 691 and COE 692)'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-science/CPS/714/'
    },
    { 
      code: 'TABLE III 1', 
      name: 'Core Elective 1', 
      description: 'Choose from Table III Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_iii/'
    },
    { 
      code: 'TABLE III 2', 
      name: 'Core Elective 2', 
      description: 'Choose from Table III Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_iii/'
    },
    { 
      code: 'LIBERAL    4', 
      name: 'Upper Level Liberal Studies', 
      description: 'One course from: ENG 503 Science Fiction, GEO 702 Technology and the Contemporary Environment, HST 701 Scientific Technology and Modern Society, PHL 709 Religion, Science and Philosophy, or POL 507 Power, Change and Technology',
      url: 'https://www.torontomu.ca/calendar/2025-2026/liberal-studies/table_b/'
    },
  ],
  year4sem2: [
    { 
      code: 'CEN 800', 
      name: 'Law and Ethics in Engineering Practice', 
      prerequisites: [],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/common-engineering/CEN/800/'
    },
    { 
      code: 'COE 70B', 
      name: 'Computer Engineering Capstone Design', 
      prerequisites: ['COE 528', 'COE 608', 'COE 628', 'MEC 511', 'MTH 514', 'and', '[(COE 501, ELE 632, ELE 635, and ELE 639) or (COE 501, CPS 688, ELE 632, and ELE 635) or (COE 501, ELE 632, ELE 639, and CPS 688) or ( COE 691, COE 692, CPS 688, and ELE 532)]'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/70A/'
    },
    { 
      code: 'COE 891', 
      name: 'Software Testing and Quality Assurance', 
      prerequisites: ['COE 692'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/891/'
    },
    { 
      code: 'COE 892', 
      name: 'Distributed & Cloud Computing', 
      prerequisites: ['COE 768'],
      url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-engineering/COE/892/'
    },
    { 
      code: 'TABLE IV 1', 
      name: 'Core Elective 1', 
      description: 'Choose from Table IV Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_iv/'
    },
    { 
      code: 'TABLE IV 2', 
      name: 'Core Elective 2', 
      description: 'Choose from Table IV Professional Electives.',
      url: 'https://www.torontomu.ca/calendar/2025-2026/programs/feas/computer_eng/table_iv/'
    },
  ],
};

// Required Group 1 Courses
const requiredGroup1Courses: CourseNodeProps[] = [
  { 
    code: 'ELE 635', 
    name: 'Communication Systems', 
    prerequisites: ['ELE 532', 'MTH 514'],
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/635/'
  },
  { 
    code: 'ELE 639', 
    name: 'Control Systems', 
    prerequisites: ['ELE 532'],
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/electrical-engineering/ELE/639/'
  },
  { 
    code: 'CPS 688', 
    name: 'Advanced Algorithms', 
    prerequisites: ['COE 428'],
    url: 'https://www.torontomu.ca/calendar/2025-2026/courses/computer-science/CPS/688/'
  },
];

export default function CourseTree({ year, stream, isSoftwareSpecialization, onCourseClick }: CourseTreeProps) {
  const renderCourseNode = (course: CourseNodeProps) => {
    const courseUrl = course.url || (course.code.includes('ELE') || course.code.includes('COE') || course.code.includes('CEN') ? 
      `https://www.torontomu.ca/calendar/2025-2026/courses/${course.code.split(' ')[0].toLowerCase()}-engineering/${course.code.split(' ')[0]}/${course.code.split(' ')[1]}/` : 
      undefined);

    const content = (
      <>
        <h3 className="text-lg font-semibold text-[#4A154B]">{course.code}</h3>
        <p className="text-sm text-gray-600">{course.name}</p>
        {course.description && (
          <p className="text-xs text-gray-500 mt-2 italic">{course.description}</p>
        )}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Prerequisites:</span> {course.prerequisites.join(', ')}
          </div>
        )}
        {course.corequisites && course.corequisites.length > 0 && (
          <div className="mt-1 text-xs text-gray-500">
            <span className="font-medium">Co-requisites:</span> {course.corequisites.join(', ')}
          </div>
        )}
        {course.antirequisites && course.antirequisites.length > 0 && (
          <div className="mt-1 text-xs text-gray-500">
            <span className="font-medium">Antirequisites:</span> {course.antirequisites.join(', ')}
          </div>
        )}
      </>
    );

    const handleClick = (e: React.MouseEvent) => {
      if (onCourseClick) {
        e.preventDefault();
        onCourseClick(course.code);
      }
    };

    return courseUrl ? (
      <a 
        key={course.code}
        href={courseUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#931cf5]/20 hover:border-[#931cf5]/40"
      >
        {content}
      </a>
    ) : (
      <div 
        key={course.code} 
        onClick={handleClick}
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#931cf5]/20 cursor-pointer"
      >
        {content}
      </div>
    );
  };

  const renderRequiredGroup = (courses: CourseNodeProps[], title: string) => (
    <div className="mb-8 bg-purple-50 p-6 rounded-lg border-2 border-[#931cf5]/30">
      <h2 className="text-xl font-bold text-[#4A154B] mb-4">{title}</h2>
      <p className="text-sm text-gray-700 mb-4 italic">Choose any two courses from the following options:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map(course => {
          const courseUrl = course.url || (course.code.includes('ELE') || course.code.includes('COE') || course.code.includes('CEN') ? 
            `https://www.torontomu.ca/calendar/2025-2026/courses/${course.code.split(' ')[0].toLowerCase()}-engineering/${course.code.split(' ')[0]}/${course.code.split(' ')[1]}/` : 
            undefined);

          const content = (
            <>
              <h3 className="text-lg font-semibold text-[#4A154B]">{course.code}</h3>
              <p className="text-sm text-gray-600">{course.name}</p>
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">Prerequisites:</span> {course.prerequisites.join(', ')}
                </div>
              )}
            </>
          );

          return courseUrl ? (
            <a 
              key={course.code}
              href={courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#931cf5]/20 hover:border-[#931cf5]/40"
            >
              {content}
            </a>
          ) : (
            <div key={course.code} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-[#931cf5]/20">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSemester = (courses: CourseNodeProps[], semesterTitle: string) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[#4A154B] mb-4">{semesterTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => {
          // Skip the Required Group 1 placeholder as it will be rendered separately
          if (course.code === 'Required Group 1') {
            return null;
          }
          return renderCourseNode(course);
        })}
      </div>
    </div>
  );

  if (!year) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 text-lg">
        Select a year to view courses
      </div>
    );
  }

  if (year === 1) {
    return (
      <div className="p-6">
        {renderSemester(commonFirstYear, 'First Semester')}
        {renderSemester(commonFirstYearSecondSem, 'Second Semester')}
      </div>
    );
  }

  if (!stream && year > 1) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 text-lg">
        Select a program to view courses
      </div>
    );
  }

  // For year 2, both streams follow the same curriculum
  if (year === 2) {
    const courses = stream === 'electrical' ? electricalCourses : computerCourses;
    return (
      <div className="p-6">
        {renderSemester(courses.year2sem1, 'Third Semester')}
        {renderSemester(courses.year2sem2, 'Fourth Semester')}
      </div>
    );
  }

  // For years 3 and 4, computer stream can have software specialization
  if (stream === 'computer' && isSoftwareSpecialization) {
    return (
      <div className="p-6">
        {year === 3 && (
          <>
            {renderSemester(softwareSpecializationCourses.year3sem1, 'Fifth Semester')}
            {renderSemester(softwareSpecializationCourses.year3sem2, 'Sixth Semester')}
          </>
        )}
        {year === 4 && (
          <>
            {renderSemester(softwareSpecializationCourses.year4sem1, 'Seventh Semester')}
            {renderSemester(softwareSpecializationCourses.year4sem2, 'Eighth Semester')}
          </>
        )}
      </div>
    );
  }

  // For electrical stream and regular computer stream
  const courses = stream === 'electrical' ? electricalCourses : computerCourses;
  return (
    <div className="p-6">
      {year === 3 && (
        <>
          {renderSemester(courses.year3sem1, 'Fifth Semester')}
          {renderSemester(courses.year3sem2, 'Sixth Semester')}
          {stream === 'computer' && renderRequiredGroup(requiredGroup1Courses, 'Required Group 1 - Choose 2 Courses')}
        </>
      )}
      {year === 4 && (
        <>
          {renderSemester(courses.year4sem1, 'Seventh Semester')}
          {renderSemester(courses.year4sem2, 'Eighth Semester')}
        </>
      )}
    </div>
  );
} 