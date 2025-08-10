# plate-calculator
## Calculator for minimum amount of weight plates needed to get any value in a given range and precision.

![Vercel](https://vercelbadge.vercel.app/api/ebolblga/plate-calculator)
[![DeepWiki](https://img.shields.io/badge/DeepWiki-ebolblga%2Fplate--calculator-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/ebolblga/plate-calculator)

Project repository on GitHub [ebolblga/plate-calculator](https://github.com/ebolblga/plate-calculator).

Web application to find minimal amount weight plates you need to make for the barbell (given weight range and precision), if you want to make your own gym gear.

Great example: [https://youtu.be/um4sVgB4Qmc](https://youtu.be/um4sVgB4Qmc)
<p align="center">
  <a href="https://youtu.be/um4sVgB4Qmc">
    <img src="https://img.youtube.com/vi/um4sVgB4Qmc/0.jpg" alt="Тренажерный зал своими руками Сергея Фролова">
  </a>
</p>
<!-- <div style="display: flex; justify-content: center;">
  <iframe
    width="700"
    height="394"
    src="https://www.youtube.com/embed/um4sVgB4Qmc"
    title="Тренажерный зал своими руками Сергея Фролова"
    frameborder="0"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; modestbranding=1"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen>
  </iframe>
</div> -->

![plate-calculator user interface](/app/assets/plate_calculator_interface.webp)

## Problem Statement
**Given:**

- `minWeight` (number) – the minimal weight you want to load on top of the barbell
- `maxWeight` (number) – the maximum total weight you want to load on top of the barbell
- `precision` (number) – smallest step between achievable weights

**Goal**

Find the smallest set S of plate weight denominations (each is used in pairs) so that, for every target total weight W in the arithmetic sequence:

```ini
minWeight, minWeight + precision, minWeight + 2 * precision, ..., ≤ maxWeight
```

there exists a selection of plates from S (any number of pairs) that sums exactly to W / 2 per side (assuming you load plates equally on both ends).

## Algorithms
### 1. Greedy Subset-Sum Cover algorithm
1.1. First we need to "strip" down all extra constraints problem domain includes:
- min and max weights are actually useful for the user, to find the solution we only need the range itself, so `targetNum = maxWeight - minWeight`
- barbell needs to be balanced, so we need to divide target weight and precision by two
- so we don't have to work with float numbers, its good idea to normalize everything to `units = (weight / precision)`

1.2. Now that everything extra is stripped away, this is a classical [*greedy-cover*]((https://en.wikipedia.org/wiki/Set_cover_problem)). Problem statement:

```text
Given a non-negative integer T, find the smallest possible set of positive weights such that every integer from 0 through T can be written as the sum of a subset of those weights (each weight used 0 or 1 times).
```

**Solution:**

Let’s keep track of a variable covered meaning:
> “We can already form every integer from 0 through covered with our current weights.”

Initially, with no weights, `covered = 0` (we can only form 0)

**Greedy step:**

- To extend our coverage, we need a new weight `w` so that when we add it, we can form every integer up to `covered + w`
- The smallest weight that achieves that is `w = covered + 1`
  - Because if you can already do `0…covered`, then by adding `covered + 1` you instantly get coverage up to
  - And there are no gaps, since you can either use that new weight or not:
    - sums without `w`: still cover `0…covered`
    - sums with `w`: cover `w…w + covered` i.e. `(covered + 1)…(2 * covered + 1)`
- If `covered + (covered + 1)` would go past your target `T`, you don’t “overshoot” by adding `covered + 1`; instead you just add exactly what’s left, `T − covered`. That final weight plugs the gap exactly up to `T`
- You repeat until covered reaches `T`

This is often referred to as the **Greedy Subset-Sum Cover algorithm**, or more loosely the *Greedy Covering method* for the *“subset-sum coverage”* or *“coin-denomination”* problem. In algorithmic literature it’s a special case of constructing a minimal additive basis for the interval `[0, T]`.

### 2. Binary heuristic
I also implemented a simple heuristic - count powers of two until I reach the target. This does not produce perfect result, but if you are a programmer then counting such plates would be way easier.

**Example:**
- `minWeight`: 20
- `maxWeight`: 64
- `precision`: 1
- Output: `[ 0.5, 1, 2, 4, 8, 16 ]`

Greedy-cover algorithm would instead output: `[ 0.5, 1, 2, 4, 6.5, 8 ]`

As you can see number of plates is the same, 12 in both cases, binary heuristic gives weights with bigger total sum, although makes it easier to count.

## Similar problems
**1. Change-making problem**
> The *change-making problem* addresses the question of finding the minimum number of coins (of certain denominations) that add up to a given amount of money. It is a special case of the integer knapsack problem, and has applications wider than just currency.

Source: [Wikipedia](https://en.wikipedia.org/wiki/Change-making_problem)

In this problem you minimize the number of coins used, not number of denominations.

**2. Postage stamp problem**
> The *postage stamp problem* (also called the *Frobenius coin problem* and the *Chicken McNugget theorem*) is a mathematical riddle that asks what is the smallest postage value which cannot be placed on an envelope, if the latter can hold only a limited number of stamps, and these may only have certain specified face values.

Source: [Wikipedia](https://en.wikipedia.org/wiki/Postage_stamp_problem)

In this problem you find all possible sums from already given set of denominations.

## 3D rendering
I didn't want to leave it at a simple array of weights, I wanted this website to work as a tool that would provide all needed information for making those weight plates in real life.

### 1. Get plate dimensions
Goal: for each plate weight `w` compute it's dimensions with:
- `innerDiameter` (m) — the bar hole
- `outerDiameter` (m)
- `height` (m) — thickness

We work entirely in SI (`kg`, `m`, `kg/m^3`).

High-level rules:
- try to use a standard Olympic outer diameter (OD) when it yields a `thickness ≥ MIN_HEIGHT`.
- if thickness at standard OD would be too small, compute the OD that gives exactly `MIN_HEIGHT`.
- clamp the computed OD into a practical range `[MIN_OD, MAX_OD]`.
- recompute actual thickness from the clamped OD; if the clamped OD still produces thickness below `MIN_HEIGHT`, we set thickness = `MIN_HEIGHT` (you’ll have to accept an OD at the clamp limit).

This ensures plates are not thinner than a manufacturable minimum, while keeping large plates at a standard size.

**Constants**
- `DENSITY` — concrete density (typical): **2400 kg/m^3**
- `INNER_DIAMETER` — Olympic sleeve hole: **0.0504 m** (50.4 mm)
- `STANDARD_OD` — typical big-plate OD: **0.45 m** (450 mm)
- `MIN_HEIGHT` — minimal safe thickness for concrete plate: **0.02 m** (20 mm)
- `MIN_OD` — smallest reasonable outer diameter for a plate: **0.15 m** (150 mm)
- `MAX_OD` — practical upper bound: **0.5 m** (500 mm)

You can change these constants to match your materials, additives, or shop constraints in the code.

**Formulas**

Volume of a plate required for a weight `w`:
```ini
V = w / ρ
```
where `ρ` is `DENSITY` (kg/m^3), `V` in m^3.

Plate is a cylindrical ring (thickness `h`, outer radius `R`, inner radius `r`):
```ini
V = π * h * (R^2 - r^2)
```

Solve for thickness `h` given `R`:
```ini
h = V / (π * (R^2 - r^2))
```

If we want `h = MIN_HEIGHT`, we can solve for the required outer radius `R_req`:
```ini
R_req = sqrt( V / (π * MIN_HEIGHT) + r^2 )
od_req = 2 * R_req
```

Then clamp:
```ini
od = clamp(od_req, MIN_OD, MAX_OD)
```

Finally compute the actual height for the chosen `od`:
```ini
R = od / 2
h = V / (π * (R^2 - r^2))
```

### 2. Rendering weight plates with Tree.js
For that I used [Tree.js](https://threejs.org/) - JavaScript-based WebGL engine. Render loop is pretty simple:
- generate meshes (from curves and extrusions)
- initialize scene with ambient and directional lights
- initialize camera with an offset, so the stack of plates is on the right side of the screen
- and then some controls and post processing like bloom

## Setup with [Node.js](https://nodejs.org/en/)
```bash
# ------------------------------------------
# Prerequisites
# ------------------------------------------

# Linux (Debian/Ubuntu example):
# 1. Install Node.js (v20+ recommended)
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Install Git (if not installed)
sudo apt install -y git

# 3. Install Yarn globally via npm
npm install --global yarn

# ------------------------------------------
# Windows (PowerShell as Administrator)
# ------------------------------------------
# 1. Install Node.js:
#    Download and install from https://nodejs.org/en/download/
#
# 2. Install Git:
#    Download and install from https://git-scm.com/download/win
#
# 3. Open a new PowerShell window and install Yarn globally:
# npm install --global yarn

# ------------------------------------------
# Project Setup
# ------------------------------------------

# Clone the repository and navigate into it
git clone https://github.com/ebolblga/C01012.git
cd C01012

# Install all dependencies
yarn

# Start the project in development mode
yarn dev
```

## License
This program is licensed under the MIT License. Please read the License file to know about the usage terms and conditions.

Вот те блин...