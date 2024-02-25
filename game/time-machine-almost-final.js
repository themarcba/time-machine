const createTimeMachine = (data, onUpdate = () => {}) => {
  return new Proxy(
    { states: [structuredClone({ ...data, timestamp: new Date() })], currentIndex: 0 },
    {
      set(target, property, value) {
        const currentState = target.states[target.currentIndex];
        if (currentState[property] === value) return;
        target.states.push(
          structuredClone({
            ...currentState,
            [property]: value,
            timestamp: new Date(),
          })
        );
        target.currentIndex++;
        onUpdate();
      },
      get(target, property) {
        const currentState = target.states[target.currentIndex];
        if (property === "currentState") {
          return currentState;
        } else if (property === "backward") {
          return () => {
            if (target.currentIndex) {
              target.states.pop();
              target.currentIndex--;
              onUpdate();
            }
          };
        } else if (property === "forward") {
          return () => {
            target.currentIndex++;
            onUpdate();
          };
        } else if (property === "backInTime") {
          return (seconds) => {
            const targetTime = new Date(new Date() - seconds * 1000);
            const index = target.states.findIndex((state) => {
              return state.timestamp > targetTime;
            });
            if (index !== -1) target.currentIndex = index;
            target.states = target.states.slice(0, target.currentIndex + 1);
            onUpdate();
          };
        } else {
          return currentState[property];
        }
      },
    }
  );
};

// const createTimeMachine = (data) => {
//   const proxy = new Proxy(
//     {
//       timelines: [{ states: [{ ...data, timestamp: new Date() }] }],
//       $currentIndex: 0,
//       $currentTimeline: 0,
//     },
//     {
//       set(target, property, value) {
//         if (
//           target.timelines[target.$currentTimeline].states[target.$currentIndex][property] === value
//         )
//           return;
//         target.timelines[target.$currentTimeline].states.push(
//           structuredClone({
//             ...target.timelines[target.$currentTimeline].states[target.$currentIndex],
//             [property]: value,
//             timestamp: new Date(),
//           })
//         );
//         target.$currentIndex++;
//       },
//       get(target, property) {
//         if (property === "currentState") {
//           return target.timelines[target.$currentTimeline].states[target.$currentIndex];
//         } else if (property === "$currentTimeline") {
//           return target.$currentTimeline;
//         } else if (property === "states") {
//           return target.timelines[target.$currentTimeline].states;
//         } else if (property === "changeTimeline") {
//           return (change) => {
//             if (target.timelines[target.$currentTimeline + change]) {
//               target.$currentTimeline = target.$currentTimeline + change;
//               target.$currentIndex = target.timelines[target.$currentTimeline].states.length - 1;
//             }
//           };
//         } else if (property === "backwards") {
//           return () => {
//             if (target.$currentIndex) {
//               target.$currentIndex--;
//               target.timelines[target.$currentTimeline].states.pop();
//             }
//           };
//         } else if (property === "backInTime") {
//           return (seconds = 10) => {
//             const newTimeline = {
//               ...target.timelines[target.$currentTimeline],
//             };
//             target.timelines.push(newTimeline);
//             const targetTime = new Date(new Date() - seconds * 1000);
//             const index = target.timelines[target.$currentTimeline].states.findIndex(
//               (state) => state.timestamp > targetTime
//             );
//             if (index !== -1) target.$currentIndex = index;
//             target.timelines[target.$currentTimeline].states = target.timelines[
//               target.$currentTimeline
//             ].states.slice(0, target.$currentIndex + 1);
//           };
//         } else {
//           return target.timelines[target.$currentTimeline].states[target.$currentIndex][property];
//         }
//       },
//     }
//   );

//   return proxy;
// };
