function createTimeMachine(data, onUpdate = () => {}) {
  return new Proxy(
    {
      states: [structuredClone(data)],
      currentIndex: 0,
    },
    {
      set(target, property, value) {
        const currentState = target.states[target.currentIndex];
        target.states.push({
          ...structuredClone(currentState),
          [property]: value,
        });
        target.currentIndex++;
        onUpdate();
      },
      get(target, property) {
        const currentState = target.states[target.currentIndex];
        if (property === "currentState") {
          return currentState;
        } else if (property === "backward") {
          return () => {
            target.currentIndex--;
            onUpdate();
          };
        } else if (property === "forward") {
          return () => {
            target.currentIndex++;
            onUpdate();
          };
        } else {
          return currentState[property];
        }
      },
    }
  );
}
