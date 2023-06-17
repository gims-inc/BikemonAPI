// const Bike = require('./models/bikes');

// async function createBikes() {
//   try {
//     for (let i = 0; i < 10; i++) {
//       const plateNumber = `KTWC 200${i + 1}U`;
//       const bike = new Bike({
//         plate: plateNumber,
//         description: 'red Yamaha 250cc',
//       });
//       bike.save({ timeout: 3000 });
//       console.log(`Bike ${i + 1} created successfully`);
//     }
//     console.log('All bikes created successfully');
//   } catch (error) {
//     console.error('Error creating bikes:', error);
//   }
// }

// createBikes();

const Bike = require('./models/bikes');

async function createBikes() {
  try {
    const bikes = []; // Array to store the bikes

    for (let i = 0; i < 10; i++) {
      const plateNumber = `KTWC 200${i + 1}U`;
      const bike = new Bike({
        plate: plateNumber,
        description: 'red Yamaha 250cc',
      });

      bikes.push(bike); // Add the bike to the array

      console.log(`Bike ${i + 1} created successfully`);
    }

    // Insert all the bikes into the database
    await Bike.insertMany(bikes, { timeout: 3000 });

    console.log('All bikes created successfully');
  } catch (error) {
    console.error('Error creating bikes:', error);
  }
}

createBikes();
