# Time Machine with ES6 Proxies

This is part of a talk I gave at [DevWorld Amsterdam 2024](https://devworldconference.com/) and [Porto Tech Hub Conference 2024](https://portotechhub.com/).

## Code

The important code is in the [game/time-machine.js](./game/time-machine.js) file.

The `createTimeMachine` function creates a proxy out of given data, and adds functionality for "traveling back in time".

The basic idea is that we have an array of states (`target.states`), which holds a current timeline's state.

To make it a bit more fancy, there is also a `target.timelines` array, which is basically just one more abstraction layer. There can be various timelines, each with its own state. The timeline can also be switched.

- The proxy trap `set()` adds a new item to the states array.
- The proxy trap `get()` provides a few functions that are exposed

## Branches

The starting state is in the `start` branch.
The final version is in the `main` branch.
