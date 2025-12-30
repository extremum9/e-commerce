import { initializeApp } from 'firebase-admin/app';

const PROJECT_ID = 'angular-ecommerce-b4854';

process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

initializeApp({ projectId: PROJECT_ID });
