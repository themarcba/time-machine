# Demo Proxy

- Overwrite getters and setters
- Return as function

# Rewrite proxy to simple time machine

## Add reactivity

onUpdate()

## Init state

```js
{ states: [data], $currentIndex: 0 }
```

# Write simple setter

## Push new state to state array

```js
const currentState = target.states[target.$currentIndex];
target.states.push({ ...currentState, [property]: value });
```

# Write getter

## Return current state

```js
const currentState = target.states[target.$currentIndex];
return currentState[property];
```

## Add 'currentState' getter

```js
if (property === "currentState") {
  return currentState;
}
```

## Add backward & forward getters

```js
else if (property === "backward") {
    return () => {
    target.states.pop(); // don't forget to pop()
    target.currentIndex--;
    onUpdate();
    };
} else if (property === "forward") {
    return () => {
    target.currentIndex++;
    onUpdate();
    };
}
```

# Game Project

## Add time machine to game

## Add timestamps to states

```js
// Get target time
const targetTime = new Date(new Date() - seconds * 1000);
// Get target index
const index = target.states.findIndex((state) => {
  return state.timestamp > targetTime;
});
// Reset new index and erase the rest
if (index !== -1) target.currentIndex = index;
target.states = target.states.slice(0, target.currentIndex + 1);
```
