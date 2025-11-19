import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model';
import Lead from './models/Lead.model';
import Property from './models/Property.model';
import Opportunity from './models/Opportunity.model';
import Activity from './models/Activity.model';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vinq-crm');
    console.log('✅ Conectado a MongoDB');

    // Limpiar base de datos
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Property.deleteMany({});
    await Opportunity.deleteMany({});
    await Activity.deleteMany({});
    console.log('🗑️  Base de datos limpiada');

    // Crear usuarios
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'VinQ',
      email: 'admin@vinqcrm.com',
      password: 'Admin123!',
      role: 'admin',
      phone: '+1234567890',
    });

    const manager = await User.create({
      firstName: 'Carlos',
      lastName: 'Martínez',
      email: 'carlos@vinqcrm.com',
      password: 'Manager123!',
      role: 'manager',
      phone: '+1234567891',
    });

    const agent1 = await User.create({
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@vinqcrm.com',
      password: 'Agent123!',
      role: 'agent',
      phone: '+1234567892',
    });

    const agent2 = await User.create({
      firstName: 'Luis',
      lastName: 'Rodríguez',
      email: 'luis@vinqcrm.com',
      password: 'Agent123!',
      role: 'agent',
      phone: '+1234567893',
    });

    console.log('👥 Usuarios creados');

    // Crear propiedades
    const properties = await Property.create([
      {
        title: 'Casa moderna en zona residencial',
        description: 'Hermosa casa de 3 pisos con acabados de lujo, jardín amplio y estacionamiento para 3 vehículos.',
        type: 'house',
        status: 'available',
        price: 450000,
        currency: 'USD',
        address: {
          street: '123 Elm Street',
          city: 'Miami',
          state: 'Florida',
          zipCode: '33101',
          country: 'USA',
        },
        features: {
          bedrooms: 4,
          bathrooms: 3,
          area: 250,
          areaUnit: 'sqm',
          parking: 3,
          floors: 3,
        },
        amenities: ['Piscina', 'Jardín', 'Gimnasio', 'Área de BBQ', 'Sistema de seguridad'],
        images: [],
        createdBy: admin._id,
      },
      {
        title: 'Departamento céntrico amoblado',
        description: 'Departamento de 2 dormitorios completamente amoblado en el corazón de la ciudad.',
        type: 'apartment',
        status: 'available',
        price: 280000,
        currency: 'USD',
        address: {
          street: '456 Main Avenue',
          city: 'New York',
          state: 'New York',
          zipCode: '10001',
          country: 'USA',
        },
        features: {
          bedrooms: 2,
          bathrooms: 2,
          area: 95,
          areaUnit: 'sqm',
          parking: 1,
          floors: 1,
        },
        amenities: ['Portero', 'Ascensor', 'Lavandería', 'Balcón'],
        images: [],
        createdBy: agent1._id,
      },
      {
        title: 'Terreno comercial estratégico',
        description: 'Terreno ideal para proyecto comercial en zona de alto tráfico.',
        type: 'land',
        status: 'available',
        price: 350000,
        currency: 'USD',
        address: {
          street: 'Highway 101',
          city: 'Los Angeles',
          state: 'California',
          zipCode: '90001',
          country: 'USA',
        },
        features: {
          area: 800,
          areaUnit: 'sqm',
        },
        amenities: ['Servicios básicos', 'Frente a carretera'],
        images: [],
        createdBy: manager._id,
      },
    ]);

    console.log('🏠 Propiedades creadas');

    // Crear leads
    const leads = await Lead.create([
      {
        firstName: 'María',
        lastName: 'Fernández',
        email: 'maria.fernandez@example.com',
        phone: '+1234567894',
        status: 'new',
        source: 'Sitio Web',
        interestedIn: 'Casa en zona residencial',
        budget: 500000,
        notes: 'Interesada en propiedades cerca de escuelas',
        assignedTo: agent1._id,
        activities: [],
      },
      {
        firstName: 'Roberto',
        lastName: 'Sánchez',
        email: 'roberto.sanchez@example.com',
        phone: '+1234567895',
        status: 'contacted',
        source: 'Referido',
        interestedIn: 'Departamento céntrico',
        budget: 300000,
        notes: 'Busca inversión',
        assignedTo: agent2._id,
        activities: [
          {
            type: 'call',
            description: 'Primera llamada de contacto',
            date: new Date(),
            createdBy: agent2._id,
          },
        ],
      },
      {
        firstName: 'Patricia',
        lastName: 'López',
        email: 'patricia.lopez@example.com',
        phone: '+1234567896',
        status: 'qualified',
        source: 'Facebook Ads',
        interestedIn: 'Terreno para construcción',
        budget: 400000,
        notes: 'Desarrolladora interesada en proyectos grandes',
        assignedTo: agent1._id,
        activities: [],
      },
    ]);

    console.log('👤 Leads creados');

    // Crear oportunidades
    const opportunities = await Opportunity.create([
      {
        name: 'María Fernández - Casa Residencial',
        client: leads[0]._id,
        property: properties[0]._id,
        stage: 'qualification',
        value: 450000,
        currency: 'USD',
        probability: 25,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        assignedTo: agent1._id,
        notes: 'Cliente muy interesada, programar visita',
        activities: [
          {
            type: 'meeting',
            description: 'Reunión inicial con el cliente',
            date: new Date(),
            createdBy: agent1._id,
          },
        ],
      },
      {
        name: 'Roberto Sánchez - Departamento Céntrico',
        client: leads[1]._id,
        property: properties[1]._id,
        stage: 'proposal',
        value: 280000,
        currency: 'USD',
        probability: 50,
        expectedCloseDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        assignedTo: agent2._id,
        notes: 'Propuesta enviada, esperando respuesta',
        activities: [],
      },
    ]);

    console.log('💼 Oportunidades creadas');

    // Crear actividades
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await Activity.create([
      {
        type: 'call',
        title: 'Llamar a María González para seguimiento',
        description: 'Verificar si ya revisó la propuesta de la casa moderna',
        status: 'pending',
        priority: 'high',
        dueDate: today,
        relatedTo: {
          type: 'lead',
          id: leads[0]._id,
        },
        assignedTo: agent1._id,
        createdBy: agent1._id,
        callDetails: {
          phoneNumber: leads[0].phone,
        },
      },
      {
        type: 'meeting',
        title: 'Visita a propiedad con Roberto Sánchez',
        description: 'Mostrar el departamento céntrico',
        status: 'pending',
        priority: 'high',
        dueDate: tomorrow,
        duration: 60,
        relatedTo: {
          type: 'opportunity',
          id: opportunities[1]._id,
        },
        assignedTo: agent2._id,
        createdBy: agent2._id,
        meetingDetails: {
          location: '456 Oak Avenue, Los Angeles, CA',
          attendees: ['roberto.sanchez@email.com'],
        },
      },
      {
        type: 'email',
        title: 'Enviar información adicional a Laura Pérez',
        description: 'Enviar fotos y planos del terreno',
        status: 'pending',
        priority: 'medium',
        dueDate: tomorrow,
        relatedTo: {
          type: 'lead',
          id: leads[2]._id,
        },
        assignedTo: agent1._id,
        createdBy: agent1._id,
        emailDetails: {
          to: [leads[2].email],
          subject: 'Información adicional - Terreno para desarrollo',
        },
      },
      {
        type: 'task',
        title: 'Preparar contrato para María González',
        description: 'Redactar contrato de compra-venta',
        status: 'pending',
        priority: 'high',
        dueDate: nextWeek,
        relatedTo: {
          type: 'opportunity',
          id: opportunities[0]._id,
        },
        assignedTo: agent1._id,
        createdBy: manager._id,
      },
      {
        type: 'task',
        title: 'Actualizar fotos de propiedades en el sistema',
        description: 'Subir fotos de alta calidad de las nuevas propiedades',
        status: 'completed',
        priority: 'low',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        relatedTo: {
          type: 'property',
          id: properties[0]._id,
        },
        assignedTo: agent2._id,
        createdBy: manager._id,
      },
      {
        type: 'note',
        title: 'Notas de la llamada con María González',
        description: 'Cliente muy interesada. Preguntó por opciones de financiamiento. Programar reunión con asesor financiero.',
        status: 'completed',
        priority: 'medium',
        completedDate: new Date(),
        relatedTo: {
          type: 'lead',
          id: leads[0]._id,
        },
        assignedTo: agent1._id,
        createdBy: agent1._id,
      },
    ]);

    console.log('📅 Actividades creadas');

    console.log('\n✅ Base de datos inicializada correctamente!');
    console.log('\n👤 Usuarios creados:');
    console.log('   Admin: admin@vinqcrm.com / Admin123!');
    console.log('   Manager: carlos@vinqcrm.com / Manager123!');
    console.log('   Agente 1: ana@vinqcrm.com / Agent123!');
    console.log('   Agente 2: luis@vinqcrm.com / Agent123!');
    console.log('\n🏠 3 Propiedades');
    console.log('👤 3 Leads');
    console.log('💼 2 Oportunidades');
    console.log('📅 6 Actividades (4 pendientes, 2 completadas)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();
