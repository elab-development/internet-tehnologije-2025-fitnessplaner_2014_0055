'use strict';

const exercises = [
  // --- Gym ---
  ['Barbell Bench Press', ['chest', 'triceps', 'shoulders'], 'Barbell pressed from chest while lying on a flat bench.', 'BkC7bIGqgjs'],
  ['Incline Barbell Bench Press', ['chest', 'shoulders', 'triceps'], 'Bench press on an inclined bench, emphasizing the upper chest.', 'SrqOu55lrYU'],
  ['Dumbbell Bench Press', ['chest', 'triceps', 'shoulders'], 'Flat bench press performed with dumbbells for a greater range of motion.', '5Y3VZsLb1Ys'],
  ['Dumbbell Fly', ['chest'], 'Arcing dumbbell movement on a flat bench to isolate the chest.', 'LzFvciCdoW0'],
  ['Cable Crossover', ['chest'], 'Cables pulled together in front of the body to isolate the chest.', 'qo0CD4QJtkA'],
  ['Chest Press Machine', ['chest', 'triceps'], 'Seated machine press targeting the chest.', 'mVUd2I99DTM'],
  ['Pec Deck Machine', ['chest'], 'Seated machine fly isolating the chest.', 'wsNAD1BpiaE'],
  ['Barbell Back Squat', ['quads', 'glutes', 'hamstrings', 'core'], 'Barbell rested on the upper back, squatting to depth.', '8PMjqgR8Wa8'],
  ['Front Squat', ['quads', 'glutes', 'core'], 'Barbell held on the front of the shoulders, squatting upright.', 'v-mQm_droHg'],
  ['Leg Press', ['quads', 'glutes', 'hamstrings'], 'Weighted platform pushed away with the legs on a machine.', 'p5dCqF7wWUw'],
  ['Leg Extension', ['quads'], 'Seated machine extending the knees to isolate the quads.', 'hdpz7kKCHvE'],
  ['Lying Leg Curl', ['hamstrings'], 'Prone machine curling the heels toward the glutes.', '5xR8tvg4-yM'],
  ['Romanian Deadlift', ['hamstrings', 'glutes', 'lower_back'], 'Hip hinge with a barbell, keeping legs nearly straight.', '7j-2w4-P14I'],
  ['Deadlift', ['back', 'glutes', 'hamstrings', 'lower_back', 'forearms'], 'Barbell lifted from the floor to a standing position.', 'GxsLrTzyGUU'],
  ['Hip Thrust', ['glutes', 'hamstrings'], 'Barbell driven up with the hips while leaning on a bench.', 'Zp26q4BY5HE'],
  ['Walking Lunge', ['quads', 'glutes', 'hamstrings'], 'Alternating forward lunges while moving, often weighted.', 'Pbmj6xPo-Hw'],
  ['Standing Calf Raise', ['calves'], 'Heels raised under load to target the calves.', 'k8ipHzKeAkQ'],
  ['Seated Calf Raise', ['calves'], 'Seated machine calf raise emphasizing the soleus.', 'ORY-ke6vcgk'],
  ['Lat Pulldown', ['lats', 'biceps'], 'Bar pulled down to the chest on a cable machine.', 'SALxEARiMkw'],
  ['Seated Cable Row', ['back', 'biceps'], 'Cable handle rowed to the torso while seated.', '7BkgqzC6WsM'],
  ['Bent Over Barbell Row', ['back', 'lats', 'biceps'], 'Barbell rowed to the torso while hinged at the hips.', 'FWJR5Ve8bnQ'],
  ['T-Bar Row', ['back', 'lats'], 'Landmine-loaded bar rowed to the chest.', '0I5rcLfcH8I'],
  ['Barbell Overhead Press', ['shoulders', 'triceps'], 'Barbell pressed overhead from the shoulders while standing.', 'ZXpdJOLNoWw'],
  ['Dumbbell Shoulder Press', ['shoulders', 'triceps'], 'Dumbbells pressed overhead from the shoulders.', 'qEwKCR5JCog'],
  ['Lateral Raise', ['shoulders'], 'Dumbbells raised to the sides to isolate the lateral delts.', '-hyAJdSFzT4'],
  ['Rear Delt Fly', ['shoulders', 'traps'], 'Reverse fly targeting the rear delts.', '0GSu6Z-Oj7U'],
  ['Barbell Shrug', ['traps'], 'Barbell held while shrugging the shoulders to hit the traps.', 'X26Ji1j9LWA'],
  ['Barbell Curl', ['biceps'], 'Barbell curled to the shoulders to work the biceps.', 'JJB8XgKltA8'],
  ['Dumbbell Curl', ['biceps'], 'Dumbbells curled to the shoulders.', 'XE_pHwbst04'],
  ['Hammer Curl', ['biceps', 'forearms'], 'Neutral-grip dumbbell curl targeting the biceps and forearms.', 'BRVDS6HVR9Q'],
  ['Preacher Curl', ['biceps'], 'Curl performed against a preacher bench to isolate the biceps.', 'BPmUhDtdQfw'],
  ['Triceps Pushdown', ['triceps'], 'Cable pushed down to extend the elbows and work the triceps.', '2-LAMcpzODU'],
  ['Skull Crusher', ['triceps'], 'Lying barbell or dumbbell extension to the forehead.', 'd_KZxkY_0cM'],
  ['Overhead Triceps Extension', ['triceps'], 'Weight extended overhead to stretch and work the triceps.', 'fYqswDVbJDg'],
  ['Cable Crunch', ['core'], 'Kneeling cable crunch loading the abdominals.', 'AV5PmZJIrrw'],

  // --- Street workout / calisthenics ---
  ['Push-Up', ['chest', 'triceps', 'shoulders', 'core'], 'Bodyweight press from the floor.', 'i9sTjhN4Z3M'],
  ['Diamond Push-Up', ['triceps', 'chest'], 'Push-up with hands close together to emphasize the triceps.', 'J0DnG1_S92I'],
  ['Pike Push-Up', ['shoulders', 'triceps'], 'Push-up in a pike position to load the shoulders.', 'fXgou2W10ok'],
  ['Decline Push-Up', ['chest', 'shoulders'], 'Push-up with feet elevated to emphasize the upper chest.', 's5dEc154cCc'],
  ['Pull-Up', ['lats', 'back', 'biceps'], 'Bodyweight pull from a bar with an overhand grip.', '6zyx46Vpato'],
  ['Chin-Up', ['biceps', 'lats', 'back'], 'Bodyweight pull from a bar with an underhand grip.', 'e1YSApl-QcM'],
  ['Wide Grip Pull-Up', ['lats', 'back'], 'Pull-up with a wide grip to emphasize the lats.', 'bHC16skSN6Q'],
  ['Muscle-Up', ['lats', 'chest', 'triceps', 'core'], 'Pull-up transitioning into a dip above the bar.', 'KGGWP695Zx4'],
  ['Inverted Row', ['back', 'biceps'], 'Bodyweight row under a fixed bar with the body horizontal.', 'Fl0UMfdEzsE'],
  ['Dip', ['chest', 'triceps', 'shoulders'], 'Bodyweight press on parallel bars.', 'U7HeutDqS_w'],
  ['Bench Dip', ['triceps'], 'Dip performed off a bench to isolate the triceps.', 'iH16WFso6fo'],
  ['Bodyweight Squat', ['quads', 'glutes'], 'Squat to depth using only bodyweight.', 'P-yaD24bUE8'],
  ['Pistol Squat', ['quads', 'glutes', 'core'], 'Single-leg squat to full depth.', 'Ei1nwSCQx-0'],
  ['Bulgarian Split Squat', ['quads', 'glutes', 'hamstrings'], 'Rear-foot-elevated single-leg squat.', 'hiLF_pF3EJM'],
  ['Nordic Curl', ['hamstrings'], 'Eccentric hamstring lower with the ankles anchored.', '_e9vFU9-tkc'],
  ['Glute Bridge', ['glutes', 'hamstrings'], 'Hips driven up from the floor to work the glutes.', 'Q_Bpj91Yiis'],
  ['Bodyweight Calf Raise', ['calves'], 'Heels raised using bodyweight to work the calves.', 'Wh8EXjjr6JU'],
  ['Plank', ['core'], 'Isometric hold on the forearms bracing the core.', 'A2b2EmIg0dA'],
  ['Side Plank', ['core'], 'Lateral isometric hold targeting the obliques.', 'pitOuJxdyI0'],
  ['Hanging Leg Raise', ['core'], 'Legs raised while hanging from a bar.', 'rbOJSK07AGA'],
  ['Hanging Knee Raise', ['core'], 'Knees raised while hanging from a bar.', 'l7OroezzX9k'],
  ['L-Sit', ['core', 'triceps'], 'Isometric hold with legs extended horizontally off the ground.', 'HxDP7SqggpI'],
  ['Hollow Body Hold', ['core'], 'Isometric hold curling the body into a hollow shape.', '0yPin8hSc8o'],
  ['Mountain Climber', ['core'], 'Alternating knee drives from a plank position.', 'ixxk9Qfn61o'],
  ['Burpee', ['chest', 'quads', 'core', 'shoulders'], 'Full-body movement combining a squat, push-up, and jump.', 'G2hv_NYhM-A'],
  ['Handstand Push-Up', ['shoulders', 'triceps'], 'Vertical press performed in a handstand against a wall.', 'KEfazWGOUok'],
  ['Superman', ['lower_back', 'glutes'], 'Prone hold raising the arms and legs to work the posterior chain.', 'z6PJMT2y8GQ'],
  ['Front Lever', ['lats', 'core'], 'Horizontal hold from a bar with the body straight.', '5g8-sj-8snc'],
  ['Back Lever', ['back', 'core'], 'Inverted horizontal hold from a bar.', 'HXaG8mJmSnU'],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'Exercises',
      exercises.map(([name, muscles, description, videoId]) => ({
        name,
        muscles: muscles.join(', '),
        description,
        videoId,
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
