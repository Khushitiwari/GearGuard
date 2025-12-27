import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import Equipment from '../models/equipement.model.js'
import Team from '../models/team.model.js'
import Request from '../models/request.model.js'
import connectDB from '../config/db.js'

dotenv.config()

const seedData = async () => {
  try {
    // Connect to database
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data
    console.log('Clearing existing data...')
    await User.deleteMany({})
    await Equipment.deleteMany({})
    await Team.deleteMany({})
    await Request.deleteMany({})

    // Create Users
    console.log('Creating users...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john.doe@gearguard.com',
        password: hashedPassword,
        role: 'Manager',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@gearguard.com',
        password: hashedPassword,
        role: 'Technician',
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@gearguard.com',
        password: hashedPassword,
        role: 'Technician',
      },
      {
        name: 'Sarah Williams',
        email: 'sarah.williams@gearguard.com',
        password: hashedPassword,
        role: 'Employee',
      },
      {
        name: 'David Brown',
        email: 'david.brown@gearguard.com',
        password: hashedPassword,
        role: 'Technician',
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@gearguard.com',
        password: hashedPassword,
        role: 'Manager',
      },
      {
        name: 'Robert Wilson',
        email: 'robert.wilson@gearguard.com',
        password: hashedPassword,
        role: 'Technician',
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@gearguard.com',
        password: hashedPassword,
        role: 'Employee',
      },
    ])
    console.log(`Created ${users.length} users`)

    // Create Equipment
    console.log('Creating equipment...')
    const equipment = await Equipment.insertMany([
      {
        name: 'Industrial Compressor Unit A',
        category: 'Mechanical',
        serialNumber: 'IC-2024-001',
        location: 'Building A - Floor 2 - Room 201',
        purchaseDate: new Date('2023-01-15'),
        warrantyExpiry: new Date('2026-01-15'),
        assignedTo: null,
        owner: users[0]._id,
      },
      {
        name: 'HVAC Unit 5',
        category: 'HVAC',
        serialNumber: 'HVAC-2024-005',
        location: 'Building B - Floor 1 - Room 105',
        purchaseDate: new Date('2022-06-20'),
        warrantyExpiry: new Date('2025-06-20'),
        assignedTo: null,
        owner: users[0]._id,
      },
      {
        name: 'Generator Set Alpha',
        category: 'Electrical',
        serialNumber: 'GEN-2024-012',
        location: 'Building A - Basement - Generator Room',
        purchaseDate: new Date('2023-03-10'),
        warrantyExpiry: new Date('2026-03-10'),
        assignedTo: null,
        owner: users[0]._id,
      },
      {
        name: 'Water Pump System',
        category: 'Mechanical',
        serialNumber: 'WP-2024-008',
        location: 'Building C - Ground Floor - Pump Room',
        purchaseDate: new Date('2022-11-05'),
        warrantyExpiry: new Date('2025-11-05'),
        assignedTo: null,
        owner: users[0]._id,
      },
      {
        name: 'Chiller Unit 3',
        category: 'HVAC',
        serialNumber: 'CH-2023-003',
        location: 'Building A - Rooftop',
        purchaseDate: new Date('2023-05-12'),
        warrantyExpiry: new Date('2026-05-12'),
        assignedTo: null,
        owner: users[5]._id,
      },
      {
        name: 'Elevator Motor System',
        category: 'Mechanical',
        serialNumber: 'ELV-2022-007',
        location: 'Building B - Elevator Shaft 2',
        purchaseDate: new Date('2022-08-30'),
        warrantyExpiry: new Date('2025-08-30'),
        assignedTo: null,
        owner: users[0]._id,
      },
      {
        name: 'Fire Suppression System',
        category: 'Safety',
        serialNumber: 'FSS-2023-015',
        location: 'Building A - All Floors',
        purchaseDate: new Date('2023-02-20'),
        warrantyExpiry: new Date('2026-02-20'),
        assignedTo: null,
        owner: users[5]._id,
      },
      {
        name: 'Boiler System',
        category: 'Mechanical',
        serialNumber: 'BLR-2022-004',
        location: 'Building C - Basement - Boiler Room',
        purchaseDate: new Date('2022-09-15'),
        warrantyExpiry: new Date('2025-09-15'),
        assignedTo: null,
        owner: users[0]._id,
      },
      {
        name: 'Air Handling Unit 2',
        category: 'HVAC',
        serialNumber: 'AHU-2023-009',
        location: 'Building B - Floor 3 - Mechanical Room',
        purchaseDate: new Date('2023-04-08'),
        warrantyExpiry: new Date('2026-04-08'),
        assignedTo: null,
        owner: users[5]._id,
      },
      {
        name: 'Transformers Set',
        category: 'Electrical',
        serialNumber: 'TRF-2022-011',
        location: 'Building A - Electrical Room',
        purchaseDate: new Date('2022-12-10'),
        warrantyExpiry: new Date('2025-12-10'),
        assignedTo: null,
        owner: users[0]._id,
      },
    ])
    console.log(`Created ${equipment.length} equipment items`)

    // Create Teams
    console.log('Creating teams...')
    const teams = await Team.insertMany([
      {
        teamName: 'Mechanical',
        leader: users[1]._id,
        members: [users[1]._id, users[2]._id, users[4]._id],
        category: ['Mechanical'],
      },
      {
        teamName: 'Electrical',
        leader: users[2]._id,
        members: [users[2]._id, users[6]._id, users[4]._id],
        category: ['Electrical'],
      },
      {
        teamName: 'IT Support Team',
        leader: users[5]._id,
        members: [users[5]._id, users[1]._id, users[6]._id],
        category: ['IT', 'Safety'],
      },
    ])
    console.log(`Created ${teams.length} teams`)

    // Create Requests
    console.log('Creating requests...')
    const now = new Date()
    // Get current date components for scheduling
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const currentDate = now.getDate()
    
    const requests = await Request.insertMany([
      {
        subject: 'Compressor overheating issue',
        description: 'The industrial compressor is showing signs of overheating during peak hours. Temperature readings are consistently above normal operating range. Requires immediate inspection and possible maintenance.',
        createdFrom: users[3]._id,
        equipment: equipment[0]._id,
        requestedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        type: 'Corrective',
        team: teams[0]._id, // Mechanical
        technician: users[1]._id,
        scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        duration: 120,
        priority: 'High',
        status: 'New',
      },
      {
        subject: 'HVAC filter replacement',
        description: 'Routine filter replacement for HVAC Unit 5. Scheduled maintenance as per quarterly schedule. Filters need to be replaced and system cleaned.',
        createdFrom: users[0]._id,
        equipment: equipment[1]._id,
        requestedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        type: 'Preventive',
        team: teams[1]._id, // Electrical
        technician: users[2]._id,
        scheduledAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        duration: 60,
        priority: 'Medium',
        status: 'In Progress',
      },
      {
        subject: 'Generator oil change and inspection',
        description: 'Scheduled oil change for generator set. Part of quarterly maintenance program. Also need to check battery levels and test backup power functionality.',
        createdFrom: users[0]._id,
        equipment: equipment[2]._id,
        requestedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        type: 'Preventive',
        team: teams[1]._id, // Electrical
        technician: users[1]._id,
        scheduledAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        duration: 90,
        priority: 'Medium',
        status: 'Repaired',
      },
      {
        subject: 'Water pump motor failure',
        description: 'Water pump motor has completely failed. System is not operational. Needs immediate assessment to determine if replacement is feasible or if equipment should be scrapped.',
        createdFrom: users[3]._id,
        equipment: equipment[3]._id,
        requestedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        type: 'Corrective',
        team: teams[0]._id, // Mechanical
        technician: users[1]._id,
        scheduledAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        duration: 180,
        priority: 'High',
        status: 'Scraped',
      },
      {
        subject: 'Compressor belt inspection and adjustment',
        description: 'Routine belt inspection and tension check for industrial compressor. Belts may need adjustment or replacement if worn.',
        createdFrom: users[0]._id,
        equipment: equipment[0]._id,
        requestedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        type: 'Preventive',
        team: teams[0]._id, // Mechanical
        technician: users[2]._id,
        scheduledAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        duration: 45,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'HVAC temperature calibration',
        description: 'Temperature and pressure calibration for HVAC Unit 5. System readings need to be verified and adjusted to ensure optimal performance.',
        createdFrom: users[0]._id,
        equipment: equipment[1]._id,
        requestedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        type: 'Preventive',
        team: teams[1]._id, // Electrical
        technician: users[2]._id,
        scheduledAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        duration: 75,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Chiller unit refrigerant leak',
        description: 'Chiller Unit 3 is showing signs of refrigerant leak. System efficiency has decreased. Need to locate and repair leak, then recharge system.',
        createdFrom: users[7]._id,
        equipment: equipment[4]._id,
        requestedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        type: 'Corrective',
        team: teams[1]._id, // Electrical
        technician: users[6]._id,
        scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        duration: 150,
        priority: 'High',
        status: 'In Progress',
      },
      {
        subject: 'Elevator motor bearing replacement',
        description: 'Elevator motor bearings are making unusual noise. Inspection reveals worn bearings that need replacement to prevent further damage.',
        createdFrom: users[7]._id,
        equipment: equipment[5]._id,
        requestedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        type: 'Corrective',
        team: teams[0]._id, // Mechanical
        technician: users[4]._id,
        scheduledAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        duration: 120,
        priority: 'High',
        status: 'New',
      },
      {
        subject: 'Fire suppression system annual inspection',
        description: 'Annual inspection and testing of fire suppression system. All components need to be checked, tested, and certified according to safety regulations.',
        createdFrom: users[5]._id,
        equipment: equipment[6]._id,
        requestedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        type: 'Preventive',
        team: teams[2]._id, // IT Support Team
        technician: users[1]._id,
        scheduledAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        duration: 240,
        priority: 'Medium',
        status: 'New',
      },
      {
        subject: 'Boiler system pressure valve replacement',
        description: 'Boiler pressure relief valve is not functioning correctly. Safety inspection requires immediate replacement to ensure system safety.',
        createdFrom: users[0]._id,
        equipment: equipment[7]._id,
        requestedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        type: 'Corrective',
        team: teams[0]._id, // Mechanical
        technician: users[1]._id,
        scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        duration: 90,
        priority: 'High',
        status: 'In Progress',
      },
      {
        subject: 'Air handling unit filter replacement',
        description: 'Quarterly filter replacement for Air Handling Unit 2. Filters are due for replacement per maintenance schedule.',
        createdFrom: users[0]._id,
        equipment: equipment[8]._id,
        requestedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        type: 'Preventive',
        team: teams[1]._id, // Electrical
        technician: users[2]._id,
        scheduledAt: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        duration: 60,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Transformer oil analysis',
        description: 'Annual transformer oil analysis and testing. Oil samples need to be collected and sent for laboratory analysis to check for contaminants and degradation.',
        createdFrom: users[5]._id,
        equipment: equipment[9]._id,
        requestedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        type: 'Preventive',
        team: teams[1]._id, // Electrical
        technician: users[4]._id,
        scheduledAt: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        duration: 45,
        priority: 'Medium',
        status: 'New',
      },
      {
        subject: 'Generator backup test',
        description: 'Monthly backup generator test. Need to run full load test to ensure generator can handle building power requirements during outage.',
        createdFrom: users[0]._id,
        equipment: equipment[2]._id,
        requestedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        type: 'Preventive',
        team: teams[1]._id, // Electrical
        technician: users[1]._id,
        scheduledAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        duration: 60,
        priority: 'Medium',
        status: 'Repaired',
      },
      {
        subject: 'Compressor vibration analysis',
        description: 'Vibration analysis for compressor unit. Unusual vibrations detected during operation. Need to identify source and correct issue.',
        createdFrom: users[3]._id,
        equipment: equipment[0]._id,
        requestedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        type: 'Corrective',
        team: teams[0]._id, // Mechanical
        technician: users[4]._id,
        scheduledAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        duration: 90,
        priority: 'Medium',
        status: 'New',
      },
      // Additional Preventive Maintenance for Calendar View
      {
        subject: 'Monthly HVAC system inspection',
        description: 'Monthly preventive maintenance inspection for HVAC Unit 5. Check filters, coils, and overall system performance.',
        createdFrom: users[0]._id,
        equipment: equipment[1]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 2),
        type: 'Preventive',
        team: teams[1]._id,
        technician: users[2]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 3, 9, 0),
        duration: 60,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Weekly generator inspection',
        description: 'Weekly preventive inspection of generator set. Check oil levels, battery, and run test cycle.',
        createdFrom: users[0]._id,
        equipment: equipment[2]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 1),
        type: 'Preventive',
        team: teams[1]._id,
        technician: users[1]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 5, 10, 0),
        duration: 45,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Quarterly chiller maintenance',
        description: 'Quarterly preventive maintenance for Chiller Unit 3. Clean condenser coils, check refrigerant levels, and inspect electrical connections.',
        createdFrom: users[0]._id,
        equipment: equipment[4]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 3),
        type: 'Preventive',
        team: teams[1]._id,
        technician: users[6]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 6, 8, 30),
        duration: 120,
        priority: 'Medium',
        status: 'New',
      },
      {
        subject: 'Monthly elevator safety check',
        description: 'Monthly preventive safety inspection of elevator motor system. Test emergency systems and check all safety mechanisms.',
        createdFrom: users[0]._id,
        equipment: equipment[5]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 4),
        type: 'Preventive',
        team: teams[0]._id,
        technician: users[4]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 7, 11, 0),
        duration: 90,
        priority: 'Medium',
        status: 'New',
      },
      {
        subject: 'Bi-weekly boiler inspection',
        description: 'Bi-weekly preventive inspection of boiler system. Check pressure, temperature, and safety valves.',
        createdFrom: users[0]._id,
        equipment: equipment[7]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 2),
        type: 'Preventive',
        team: teams[0]._id,
        technician: users[1]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 9, 9, 0),
        duration: 60,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Monthly air handling unit service',
        description: 'Monthly preventive service for Air Handling Unit 2. Clean filters, check belts, and lubricate moving parts.',
        createdFrom: users[0]._id,
        equipment: equipment[8]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 5),
        type: 'Preventive',
        team: teams[1]._id,
        technician: users[2]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 11, 10, 0),
        duration: 75,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Quarterly transformer maintenance',
        description: 'Quarterly preventive maintenance for transformer set. Inspect connections, check oil levels, and test cooling systems.',
        createdFrom: users[0]._id,
        equipment: equipment[9]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 6),
        type: 'Preventive',
        team: teams[1]._id,
        technician: users[4]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 13, 8, 0),
        duration: 90,
        priority: 'Medium',
        status: 'New',
      },
      {
        subject: 'Weekly compressor belt check',
        description: 'Weekly preventive check of compressor belts. Inspect for wear, check tension, and adjust if necessary.',
        createdFrom: users[0]._id,
        equipment: equipment[0]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 1),
        type: 'Preventive',
        team: teams[0]._id,
        technician: users[2]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 14, 14, 0),
        duration: 30,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Monthly water pump inspection',
        description: 'Monthly preventive inspection of water pump system. Check pump operation, inspect seals, and verify pressure settings.',
        createdFrom: users[0]._id,
        equipment: equipment[3]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 3),
        type: 'Preventive',
        team: teams[0]._id,
        technician: users[1]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 15, 9, 30),
        duration: 60,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Bi-monthly fire system test',
        description: 'Bi-monthly preventive test of fire suppression system. Test alarms, check pressure, and verify all components are operational.',
        createdFrom: users[5]._id,
        equipment: equipment[6]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 7),
        type: 'Preventive',
        team: teams[2]._id,
        technician: users[1]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 16, 10, 0),
        duration: 120,
        priority: 'Medium',
        status: 'New',
      },
      {
        subject: 'Monthly HVAC coil cleaning',
        description: 'Monthly preventive cleaning of HVAC coils. Remove debris, clean filters, and ensure optimal airflow.',
        createdFrom: users[0]._id,
        equipment: equipment[1]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 2),
        type: 'Preventive',
        team: teams[1]._id,
        technician: users[6]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 18, 8, 0),
        duration: 90,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Quarterly generator load test',
        description: 'Quarterly preventive load test for generator set. Run full load test to verify capacity and performance under load conditions.',
        createdFrom: users[0]._id,
        equipment: equipment[2]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 8),
        type: 'Preventive',
        team: teams[1]._id,
        technician: users[1]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 20, 11, 0),
        duration: 120,
        priority: 'Medium',
        status: 'New',
      },
      {
        subject: 'Monthly compressor oil check',
        description: 'Monthly preventive check of compressor oil levels and quality. Top up if needed and check for contamination.',
        createdFrom: users[0]._id,
        equipment: equipment[0]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 1),
        type: 'Preventive',
        team: teams[0]._id,
        technician: users[4]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 21, 9, 0),
        duration: 45,
        priority: 'Low',
        status: 'New',
      },
      {
        subject: 'Bi-weekly air filter replacement',
        description: 'Bi-weekly preventive replacement of air filters in Air Handling Unit 2. Maintains air quality and system efficiency.',
        createdFrom: users[0]._id,
        equipment: equipment[8]._id,
        requestedAt: new Date(currentYear, currentMonth, currentDate - 4),
        type: 'Preventive',
        team: teams[1]._id,
        technician: users[2]._id,
        scheduledAt: new Date(currentYear, currentMonth, currentDate + 22, 10, 0),
        duration: 30,
        priority: 'Low',
        status: 'New',
      },
    ])
    console.log(`Created ${requests.length} requests`)

    console.log('\n✅ Seed data created successfully!')
    console.log(`\nSummary:`)
    console.log(`- Users: ${users.length}`)
    console.log(`- Equipment: ${equipment.length}`)
    console.log(`- Teams: ${teams.length}`)
    console.log(`- Requests: ${requests.length}`)
    console.log(`\nYou can now login with any user:`)
    console.log(`Email: john.doe@gearguard.com (or any other user email)`)
    console.log(`Password: password123`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seedData()

