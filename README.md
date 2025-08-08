# [WIP] plate-calculator
## Calculator for minimum amount of weight plates needed to get any value in a given range and precision.

Web application to find minimal amount weight plates you need to make for the barbell (given weight range and precision), if you want to make your own gym gear.

Great example: [https://youtu.be/um4sVgB4Qmc](https://youtu.be/um4sVgB4Qmc)
<p align="center">
  <a href="https://youtu.be/um4sVgB4Qmc">
    <img src="https://img.youtube.com/vi/um4sVgB4Qmc/0.jpg" alt="Тренажерный зал своими руками Сергея Фролова">
  </a>
</p>

## Problem Statement
**Given:**

- `minWeight` (number) – the minimal weight you want to load on top of the barbell
- `maxWeight` (number) – the maximum total weight you want to load on top of the barbell
- `precision` (number) – smallest step between achievable weights

**Goal**

Find the smallest set S of plate weight denominations (each is used in pairs) so that, for every target total weight W in the arithmetic sequence:

```text
minWeight, minWeight + precision, minWeight + 2 * precision, ..., ≤ maxWeight
```

there exists a selection of plates from S (any number of pairs) that sums exactly to W / 2 per side (assuming you load plates equally on both ends).

## Similar problems
**1. Change-making problem**
> The *change-making problem* addresses the question of finding the minimum number of coins (of certain denominations) that add up to a given amount of money. It is a special case of the integer knapsack problem, and has applications wider than just currency.

Source: [Wikipedia](https://en.wikipedia.org/wiki/Change-making_problem)

In this problem you minimize the number of coins used, not number of denominations.

**2. Postage stamp problem**
> The *postage stamp problem* (also called the *Frobenius coin problem* and the *Chicken McNugget theorem*) is a mathematical riddle that asks what is the smallest postage value which cannot be placed on an envelope, if the latter can hold only a limited number of stamps, and these may only have certain specified face values.

Source: [Wikipedia](https://en.wikipedia.org/wiki/Postage_stamp_problem)

In this problem you find all possible sums from already given set of denominations.

## Setup with [Node.js](https://nodejs.org/en/)
If you want to try changing the mapping
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