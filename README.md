# Scheduling Simulator
 Visual scheduling simulator.

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

[Click to open the app](https://brun0ne.github.io/scheduling-sim/)

### Installation
If you want to build it yourself, run:
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