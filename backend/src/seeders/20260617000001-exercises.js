'use strict';

const exercises = [
  // --- Gym ---
  ['Barbell Bench Press', ['chest', 'triceps', 'shoulders'], 'Barbell pressed from chest while lying on a flat bench.'],
  ['Incline Barbell Bench Press', ['chest', 'shoulders', 'triceps'], 'Bench press on an inclined bench, emphasizing the upper chest.'],
  ['Dumbbell Bench Press', ['chest', 'triceps', 'shoulders'], 'Flat bench press performed with dumbbells for a greater range of motion.'],
  ['Dumbbell Fly', ['chest'], 'Arcing dumbbell movement on a flat bench to isolate the chest.'],
  ['Cable Crossover', ['chest'], 'Cables pulled together in front of the body to isolate the chest.'],
  ['Chest Press Machine', ['chest', 'triceps'], 'Seated machine press targeting the chest.'],
  ['Pec Deck Machine', ['chest'], 'Seated machine fly isolating the chest.'],
  ['Barbell Back Squat', ['quads', 'glutes', 'hamstrings', 'core'], 'Barbell rested on the upper back, squatting to depth.'],
  ['Front Squat', ['quads', 'glutes', 'core'], 'Barbell held on the front of the shoulders, squatting upright.'],
  ['Leg Press', ['quads', 'glutes', 'hamstrings'], 'Weighted platform pushed away with the legs on a machine.'],
  ['Leg Extension', ['quads'], 'Seated machine extending the knees to isolate the quads.'],
  ['Lying Leg Curl', ['hamstrings'], 'Prone machine curling the heels toward the glutes.'],
  ['Romanian Deadlift', ['hamstrings', 'glutes', 'lower_back'], 'Hip hinge with a barbell, keeping legs nearly straight.'],
  ['Deadlift', ['back', 'glutes', 'hamstrings', 'lower_back', 'forearms'], 'Barbell lifted from the floor to a standing position.'],
  ['Hip Thrust', ['glutes', 'hamstrings'], 'Barbell driven up with the hips while leaning on a bench.'],
  ['Walking Lunge', ['quads', 'glutes', 'hamstrings'], 'Alternating forward lunges while moving, often weighted.'],
  ['Standing Calf Raise', ['calves'], 'Heels raised under load to target the calves.'],
  ['Seated Calf Raise', ['calves'], 'Seated machine calf raise emphasizing the soleus.'],
  ['Lat Pulldown', ['lats', 'biceps'], 'Bar pulled down to the chest on a cable machine.'],
  ['Seated Cable Row', ['back', 'biceps'], 'Cable handle rowed to the torso while seated.'],
  ['Bent Over Barbell Row', ['back', 'lats', 'biceps'], 'Barbell rowed to the torso while hinged at the hips.'],
  ['T-Bar Row', ['back', 'lats'], 'Landmine-loaded bar rowed to the chest.'],
  ['Barbell Overhead Press', ['shoulders', 'triceps'], 'Barbell pressed overhead from the shoulders while standing.'],
  ['Dumbbell Shoulder Press', ['shoulders', 'triceps'], 'Dumbbells pressed overhead from the shoulders.'],
  ['Lateral Raise', ['shoulders'], 'Dumbbells raised to the sides to isolate the lateral delts.'],
  ['Rear Delt Fly', ['shoulders', 'traps'], 'Reverse fly targeting the rear delts.'],
  ['Barbell Shrug', ['traps'], 'Barbell held while shrugging the shoulders to hit the traps.'],
  ['Barbell Curl', ['biceps'], 'Barbell curled to the shoulders to work the biceps.'],
  ['Dumbbell Curl', ['biceps'], 'Dumbbells curled to the shoulders.'],
  ['Hammer Curl', ['biceps', 'forearms'], 'Neutral-grip dumbbell curl targeting the biceps and forearms.'],
  ['Preacher Curl', ['biceps'], 'Curl performed against a preacher bench to isolate the biceps.'],
  ['Tricep Pushdown', ['triceps'], 'Cable pushed down to extend the elbows and work the triceps.'],
  ['Skull Crusher', ['triceps'], 'Lying barbell or dumbbell extension to the forehead.'],
  ['Overhead Tricep Extension', ['triceps'], 'Weight extended overhead to stretch and work the triceps.'],
  ['Cable Crunch', ['core'], 'Kneeling cable crunch loading the abdominals.'],

  // --- Street workout / calisthenics ---
  ['Push-Up', ['chest', 'triceps', 'shoulders', 'core'], 'Bodyweight press from the floor.'],
  ['Diamond Push-Up', ['triceps', 'chest'], 'Push-up with hands close together to emphasize the triceps.'],
  ['Pike Push-Up', ['shoulders', 'triceps'], 'Push-up in a pike position to load the shoulders.'],
  ['Decline Push-Up', ['chest', 'shoulders'], 'Push-up with feet elevated to emphasize the upper chest.'],
  ['Pull-Up', ['lats', 'back', 'biceps'], 'Bodyweight pull from a bar with an overhand grip.'],
  ['Chin-Up', ['biceps', 'lats', 'back'], 'Bodyweight pull from a bar with an underhand grip.'],
  ['Wide Grip Pull-Up', ['lats', 'back'], 'Pull-up with a wide grip to emphasize the lats.'],
  ['Muscle-Up', ['lats', 'chest', 'triceps', 'core'], 'Pull-up transitioning into a dip above the bar.'],
  ['Inverted Row', ['back', 'biceps'], 'Bodyweight row under a fixed bar with the body horizontal.'],
  ['Dip', ['chest', 'triceps', 'shoulders'], 'Bodyweight press on parallel bars.'],
  ['Bench Dip', ['triceps'], 'Dip performed off a bench to isolate the triceps.'],
  ['Bodyweight Squat', ['quads', 'glutes'], 'Squat to depth using only bodyweight.'],
  ['Pistol Squat', ['quads', 'glutes', 'core'], 'Single-leg squat to full depth.'],
  ['Bulgarian Split Squat', ['quads', 'glutes', 'hamstrings'], 'Rear-foot-elevated single-leg squat.'],
  ['Nordic Curl', ['hamstrings'], 'Eccentric hamstring lower with the ankles anchored.'],
  ['Glute Bridge', ['glutes', 'hamstrings'], 'Hips driven up from the floor to work the glutes.'],
  ['Bodyweight Calf Raise', ['calves'], 'Heels raised using bodyweight to work the calves.'],
  ['Plank', ['core'], 'Isometric hold on the forearms bracing the core.'],
  ['Side Plank', ['core'], 'Lateral isometric hold targeting the obliques.'],
  ['Hanging Leg Raise', ['core'], 'Legs raised while hanging from a bar.'],
  ['Hanging Knee Raise', ['core'], 'Knees raised while hanging from a bar.'],
  ['L-Sit', ['core', 'triceps'], 'Isometric hold with legs extended horizontally off the ground.'],
  ['Hollow Body Hold', ['core'], 'Isometric hold curling the body into a hollow shape.'],
  ['Mountain Climber', ['core'], 'Alternating knee drives from a plank position.'],
  ['Burpee', ['chest', 'quads', 'core', 'shoulders'], 'Full-body movement combining a squat, push-up, and jump.'],
  ['Handstand Push-Up', ['shoulders', 'triceps'], 'Vertical press performed in a handstand against a wall.'],
  ['Superman', ['lower_back', 'glutes'], 'Prone hold raising the arms and legs to work the posterior chain.'],
  ['Front Lever', ['lats', 'core'], 'Horizontal hold from a bar with the body straight.'],
  ['Back Lever', ['back', 'core'], 'Inverted horizontal hold from a bar.'],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'Exercises',
      exercises.map(([name, muscles, description]) => ({
        name,
        muscles: JSON.stringify(muscles),
        description,
        createdAt: now,
        updatedAt: now,
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Exercises', {
      name: { [Sequelize.Op.in]: exercises.map(([name]) => name) },
    });
  },
};
