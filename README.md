# Scheduling Simulator
 Visual scheduling simulator.

### [Click to open the app](https://brun0ne.github.io/scheduling-sim/)

### Process scheduling algorithms:
- FCFS (first come first serve)
- SJF (shortest job first)
- SRTF (shortest remaining time first)
- RR (round robin)

### Disk scheduling algorithms:
- FCFS (first come first serve)
- SSTF (shortest seek time first)
- SCAN
- C-SCAN
- EDF (earliest deadline first) - *real time*
- FD-SCAN (feasible deadline SCAN) - *real time*

### Page replacement algorithms:
- FIFO (first in first out)
- OPT (optimal)
- LRU (least recently used)
- ALRU (approximate least recently used / second chance)
- RAND (random)

### Frame allocation algorithms:
- Equal
- Proportional
- Page Fault Control (tries to keep fault frequency between set bounds)
- Locality Model (*Polish: Model strefowy*)

### Load distribution algorithms:
- Random queries (N tries)
- Random queries until success
- Random queries until success + offloading

### Installation
Install [NodeJS](https://nodejs.org/en) (tested on v18.15.0). Run:
```bash
$ git clone https://github.com/brun0ne/scheduling-sim
```

Then in each of the **src** directories:
```bash
$ npm install
$ npx webpack -w
```

### Motivation
I completed these simulations as assignments for my Operating Systems ("Systemy Operacyjne") course.

You're welcome to utilize them to gain an understanding of how these algorithms function or submit a pull request containing bug fixes or new features.

### License
This project is licensed under the terms of the MIT license.