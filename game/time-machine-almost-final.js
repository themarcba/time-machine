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
            target.currentIndex = index;
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
