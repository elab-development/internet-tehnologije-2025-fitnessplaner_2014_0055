'use strict';

const yt = (id) => `https://www.youtube.com/watch?v=${id}`;

const exercises = [
  // --- Gym ---
  ['Barbell Bench Press', ['chest', 'triceps', 'shoulders'], 'Barbell pressed from chest while lying on a flat bench.', yt('BkC7bIGqgjs')],
  ['Incline Barbell Bench Press', ['chest', 'shoulders', 'triceps'], 'Bench press on an inclined bench, emphasizing the upper chest.', yt('SrqOu55lrYU')],
  ['Dumbbell Bench Press', ['chest', 'triceps', 'shoulders'], 'Flat bench press performed with dumbbells for a greater range of motion.', yt('5Y3VZsLb1Ys')],
  ['Dumbbell Fly', ['chest'], 'Arcing dumbbell movement on a flat bench to isolate the chest.', yt('LzFvciCdoW0')],
  ['Cable Crossover', ['chest'], 'Cables pulled together in front of the body to isolate the chest.', yt('qo0CD4QJtkA')],
  ['Chest Press Machine', ['chest', 'triceps'], 'Seated machine press targeting the chest.', yt('mVUd2I99DTM')],
  ['Pec Deck Machine', ['chest'], 'Seated machine fly isolating the chest.', yt('wsNAD1BpiaE')],
  ['Barbell Back Squat', ['quads', 'glutes', 'hamstrings', 'core'], 'Barbell rested on the upper back, squatting to depth.', yt('8PMjqgR8Wa8')],
  ['Front Squat', ['quads', 'glutes', 'core'], 'Barbell held on the front of the shoulders, squatting upright.', yt('v-mQm_droHg')],
  ['Leg Press', ['quads', 'glutes', 'hamstrings'], 'Weighted platform pushed away with the legs on a machine.', yt('p5dCqF7wWUw')],
  ['Leg Extension', ['quads'], 'Seated machine extending the knees to isolate the quads.', yt('hdpz7kKCHvE')],
  ['Lying Leg Curl', ['hamstrings'], 'Prone machine curling the heels toward the glutes.', yt('5xR8tvg4-yM')],
  ['Romanian Deadlift', ['hamstrings', 'glutes', 'lower_back'], 'Hip hinge with a barbell, keeping legs nearly straight.', yt('7j-2w4-P14I')],
  ['Deadlift', ['back', 'glutes', 'hamstrings', 'lower_back', 'forearms'], 'Barbell lifted from the floor to a standing position.', yt('GxsLrTzyGUU')],
  ['Hip Thrust', ['glutes', 'hamstrings'], 'Barbell driven up with the hips while leaning on a bench.', yt('Zp26q4BY5HE')],
  ['Walking Lunge', ['quads', 'glutes', 'hamstrings'], 'Alternating forward lunges while moving, often weighted.', yt('Pbmj6xPo-Hw')],
  ['Standing Calf Raise', ['calves'], 'Heels raised under load to target the calves.', yt('k8ipHzKeAkQ')],
  ['Seated Calf Raise', ['calves'], 'Seated machine calf raise emphasizing the soleus.', yt('ORY-ke6vcgk')],
  ['Lat Pulldown', ['lats', 'biceps'], 'Bar pulled down to the chest on a cable machine.', yt('SALxEARiMkw')],
  ['Seated Cable Row', ['back', 'biceps'], 'Cable handle rowed to the torso while seated.', yt('7BkgqzC6WsM')],
  ['Bent Over Barbell Row', ['back', 'lats', 'biceps'], 'Barbell rowed to the torso while hinged at the hips.', yt('FWJR5Ve8bnQ')],
  ['T-Bar Row', ['back', 'lats'], 'Landmine-loaded bar rowed to the chest.', yt('0I5rcLfcH8I')],
  ['Barbell Overhead Press', ['shoulders', 'triceps'], 'Barbell pressed overhead from the shoulders while standing.', yt('ZXpdJOLNoWw')],
  ['Dumbbell Shoulder Press', ['shoulders', 'triceps'], 'Dumbbells pressed overhead from the shoulders.', yt('qEwKCR5JCog')],
  ['Lateral Raise', ['shoulders'], 'Dumbbells raised to the sides to isolate the lateral delts.', yt('-hyAJdSFzT4')],
  ['Rear Delt Fly', ['shoulders', 'traps'], 'Reverse fly targeting the rear delts.', yt('0GSu6Z-Oj7U')],
  ['Barbell Shrug', ['traps'], 'Barbell held while shrugging the shoulders to hit the traps.', yt('X26Ji1j9LWA')],
  ['Barbell Curl', ['biceps'], 'Barbell curled to the shoulders to work the biceps.', yt('JJB8XgKltA8')],
  ['Dumbbell Curl', ['biceps'], 'Dumbbells curled to the shoulders.', yt('XE_pHwbst04')],
  ['Hammer Curl', ['biceps', 'forearms'], 'Neutral-grip dumbbell curl targeting the biceps and forearms.', yt('BRVDS6HVR9Q')],
  ['Preacher Curl', ['biceps'], 'Curl performed against a preacher bench to isolate the biceps.', yt('BPmUhDtdQfw')],
  ['Triceps Pushdown', ['triceps'], 'Cable pushed down to extend the elbows and work the triceps.', yt('2-LAMcpzODU')],
  ['Skull Crusher', ['triceps'], 'Lying barbell or dumbbell extension to the forehead.', yt('d_KZxkY_0cM')],
  ['Overhead Triceps Extension', ['triceps'], 'Weight extended overhead to stretch and work the triceps.', yt('fYqswDVbJDg')],
  ['Cable Crunch', ['core'], 'Kneeling cable crunch loading the abdominals.', yt('AV5PmZJIrrw')],

  // --- Street workout / calisthenics ---
  ['Push-Up', ['chest', 'triceps', 'shoulders', 'core'], 'Bodyweight press from the floor.', yt('i9sTjhN4Z3M')],
  ['Diamond Push-Up', ['triceps', 'chest'], 'Push-up with hands close together to emphasize the triceps.', yt('J0DnG1_S92I')],
  ['Pike Push-Up', ['shoulders', 'triceps'], 'Push-up in a pike position to load the shoulders.', yt('fXgou2W10ok')],
  ['Decline Push-Up', ['chest', 'shoulders'], 'Push-up with feet elevated to emphasize the upper chest.', yt('s5dEc154cCc')],
  ['Pull-Up', ['lats', 'back', 'biceps'], 'Bodyweight pull from a bar with an overhand grip.', yt('6zyx46Vpato')],
  ['Chin-Up', ['biceps', 'lats', 'back'], 'Bodyweight pull from a bar with an underhand grip.', yt('e1YSApl-QcM')],
  ['Wide Grip Pull-Up', ['lats', 'back'], 'Pull-up with a wide grip to emphasize the lats.', yt('bHC16skSN6Q')],
  ['Muscle-Up', ['lats', 'chest', 'triceps', 'core'], 'Pull-up transitioning into a dip above the bar.', yt('KGGWP695Zx4')],
  ['Inverted Row', ['back', 'biceps'], 'Bodyweight row under a fixed bar with the body horizontal.', yt('Fl0UMfdEzsE')],
  ['Dip', ['chest', 'triceps', 'shoulders'], 'Bodyweight press on parallel bars.', yt('U7HeutDqS_w')],
  ['Bench Dip', ['triceps'], 'Dip performed off a bench to isolate the triceps.', yt('iH16WFso6fo')],
  ['Bodyweight Squat', ['quads', 'glutes'], 'Squat to depth using only bodyweight.', yt('P-yaD24bUE8')],
  ['Pistol Squat', ['quads', 'glutes', 'core'], 'Single-leg squat to full depth.', yt('Ei1nwSCQx-0')],
  ['Bulgarian Split Squat', ['quads', 'glutes', 'hamstrings'], 'Rear-foot-elevated single-leg squat.', yt('hiLF_pF3EJM')],
  ['Nordic Curl', ['hamstrings'], 'Eccentric hamstring lower with the ankles anchored.', yt('_e9vFU9-tkc')],
  ['Glute Bridge', ['glutes', 'hamstrings'], 'Hips driven up from the floor to work the glutes.', yt('Q_Bpj91Yiis')],
  ['Bodyweight Calf Raise', ['calves'], 'Heels raised using bodyweight to work the calves.', yt('Wh8EXjjr6JU')],
  ['Plank', ['core'], 'Isometric hold on the forearms bracing the core.', yt('A2b2EmIg0dA')],
  ['Side Plank', ['core'], 'Lateral isometric hold targeting the obliques.', yt('pitOuJxdyI0')],
  ['Hanging Leg Raise', ['core'], 'Legs raised while hanging from a bar.', yt('rbOJSK07AGA')],
  ['Hanging Knee Raise', ['core'], 'Knees raised while hanging from a bar.', yt('l7OroezzX9k')],
  ['L-Sit', ['core', 'triceps'], 'Isometric hold with legs extended horizontally off the ground.', yt('HxDP7SqggpI')],
  ['Hollow Body Hold', ['core'], 'Isometric hold curling the body into a hollow shape.', yt('0yPin8hSc8o')],
  ['Mountain Climber', ['core'], 'Alternating knee drives from a plank position.', yt('ixxk9Qfn61o')],
  ['Burpee', ['chest', 'quads', 'core', 'shoulders'], 'Full-body movement combining a squat, push-up, and jump.', yt('G2hv_NYhM-A')],
  ['Handstand Push-Up', ['shoulders', 'triceps'], 'Vertical press performed in a handstand against a wall.', yt('KEfazWGOUok')],
  ['Superman', ['lower_back', 'glutes'], 'Prone hold raising the arms and legs to work the posterior chain.', yt('z6PJMT2y8GQ')],
  ['Front Lever', ['lats', 'core'], 'Horizontal hold from a bar with the body straight.', yt('5g8-sj-8snc')],
  ['Back Lever', ['back', 'core'], 'Inverted horizontal hold from a bar.', yt('HXaG8mJmSnU')],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'Exercises',
      exercises.map(([name, muscles, description, videoURL]) => ({
        name,
        muscles: JSON.stringify(muscles),
        description,
        videoURL,
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
