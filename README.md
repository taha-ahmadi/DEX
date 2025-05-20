# Automated Market Maker DEX Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Market Makers and Liquidity Pools](#market-makers-and-liquidity-pools)
3. [Version History and Implementation Details](#version-history-and-implementation-details)
   - [v1.0.0: Conceptual Implementation](#v100-conceptual-implementation)
   - [v2.0.0: ERC20 Integration](#v200-erc20-integration)
   - [v3.0.0: Full DEX Implementation](#v300-full-dex-implementation)
4. [Bonding Curves](#bonding-curves)
   - [The x\*y=k Formula](#the-xyk-formula)
   - [Dangers of Exponential Curves](#dangers-of-exponential-curves)
   - [Using Multiple Curves](#using-multiple-curves)
5. [ERC20 Token Mechanics](#erc20-token-mechanics)
6. [Curve Challenges](#curve-challenges)
7. [Conclusion](#conclusion)

## Introduction

This document describes the implementation of a simple Decentralized Exchange (DEX) with an Automated Market Maker (AMM) mechanism. The DEX has evolved through three versions, each adding more functionality and improving on the design. This documentation will explain how an AMM works, detail the differences between each version, and discuss important concepts related to liquidity pools and bonding curves.

## Market Makers and Liquidity Pools

### What is an Automated Market Maker?

An Automated Market Maker (AMM) is a type of decentralized exchange protocol that uses mathematical formulas to price assets. Unlike traditional exchanges that use an order book matching system, AMMs use liquidity pools and predefined algorithms to enable trading without relying on buyers and sellers to create liquidity.

![AMM Diagram](https://miro.medium.com/v2/resize:fit:1400/1*Xl37E9U--XKmi8sRfQwCTg.png)

### Liquidity Pools

A liquidity pool is a collection of funds locked in a smart contract that provides liquidity for trading pairs. Instead of trading directly with counterparties, users trade against the liquidity pool. The pool is funded by liquidity providers who deposit an equivalent value of two tokens to create a market.

Key components of liquidity pools:

- **Tokens**: Usually a pair of ERC20 tokens (like ETH/USDC)
- **Reserves**: The quantities of each token in the pool
- **Liquidity Providers**: Users who deposit tokens into the pool
- **Liquidity Provider Tokens**: Tokens that represent ownership share of the pool

The diagram below illustrates a typical liquidity pool:

```
┌────────────────────────────────────────┐
│             Liquidity Pool             │
│                                        │
│  ┌───────────────┐  ┌───────────────┐  │
│  │  Token A      │  │  Token B      │  │
│  │  Reserve      │  │  Reserve      │  │
│  └───────────────┘  └───────────────┘  │
│                                        │
└────────────────────────────────────────┘
          │                  ▲
          │                  │
          ▼                  │
    ┌─────────────────────────────┐
    │         Traders             │
    └─────────────────────────────┘
```

## Version History and Implementation Details

### v1.0.0: Conceptual Implementation

The first version implements a basic token pool without using the ERC20 standard. It demonstrates the core concept of an AMM with a simple bonding curve.

**Key Features:**

- Uses a direct mapping of balances instead of ERC20 tokens
- Implements a basic x^2 bonding curve for pricing
- Allows buying tokens with ETH and selling tokens for ETH
- Uses the calculated price based on total supply

**Core Functions:**

- `buy()`: Allows users to buy tokens with ETH
- `sell(uint256 amount)`: Allows users to sell tokens for ETH
- `calculateTokenPrice()`: Calculates the current price using x^2 curve

### v2.0.0: ERC20 Integration

The second version evolves the concept by implementing the ERC20 token standard for the pool token.

**Key Changes:**

- Inherits from OpenZeppelin's ERC20 contract
- Uses standard ERC20 functions for balance tracking
- Improves the price calculation with better precision
- Maintains the same x^2 bonding curve mechanism

**Enhanced Functions:**

- `buy()`: Now mints ERC20 tokens to the buyer
- `sell(uint256 amount)`: Burns tokens and returns ETH
- Improved precision handling in calculations

### v3.0.0: Full DEX Implementation

The current version is a complete DEX implementation with multiple token pairs and pool management.

**Major Advancements:**

- Supports multiple token pairs in different pools
- Uses the x\*y=k constant product formula
- Full ERC20 token support for trading pairs
- Structured pool management

**Advanced Features:**

- `registerPool(ERC20 tokenA, ERC20 tokenB)`: Creates a new trading pair
- `swap(string calldata poolName, ERC20 quoteToken, uint256 depositAmount)`: Handles token swaps
- `deposit(string calldata poolName, ERC20 token, uint256 amount)`: Adds liquidity
- `withdraw(string calldata poolName, ERC20 token, uint256 amount)`: Removes liquidity

## Bonding Curves

### The x\*y=k Formula

The constant product formula (x\*y=k) is the most common bonding curve used in AMMs like Uniswap. It ensures that the product of the reserves always remains constant after trades.

```
x * y = k

Where:
x = reserve of token X
y = reserve of token Y
k = constant product
```

This creates a hyperbolic curve that looks like this:

```
│
│     ╭─────────────────────
│    /
│   /
│  /
│ /
│/
└─────────────────────────────
```

When users trade one token for another, the price slips along this curve, ensuring that larger trades face progressively worse exchange rates, which naturally balances the market.

### Dangers of Exponential Curves

While our initial implementations used an x^2 curve (quadratic), exponential curves can pose several risks:

1. **Extreme Price Sensitivity**: As the supply increases, prices can grow too rapidly
2. **Vulnerability to Manipulation**: Small changes in supply can cause large price swings
3. **Liquidity Challenges**: At high supply levels, liquidity becomes impractical
4. **Initial Supply Problems**: Finding the right starting point is difficult

### Using Multiple Curves

To prevent pump and dump schemes, a more sophisticated approach is to use different curves for buying and selling:

1. **Buy Curve**: A steeper curve that makes buying increasingly expensive as supply increases
2. **Sell Curve**: A flatter curve that offers less return when selling large amounts

Currently, our implementation uses a single curve (x\*y=k in v3.0.0), but future versions could implement dual curves to further enhance market stability.

## ERC20 Token Mechanics

Both v2.0.0 and v3.0.0 leverage ERC20 tokens, which are essentially games of supply, burn, and mint:

- **Mint**: Creating new tokens (increasing supply)
- **Burn**: Destroying tokens (decreasing supply)
- **Transfer**: Moving tokens between addresses (unchanged supply)

In v2.0.0 and v3.0.0, these mechanisms are used to:

1. Mint tokens when users provide liquidity
2. Burn tokens when users remove liquidity
3. Transfer tokens during swaps

## Curve Challenges

Implementing bonding curves presents several challenges:

1. **Initial Supply Formula**: Determining the optimal initial supply and price point
2. **Slippage Control**: Managing price impact for large trades
3. **Front-running Protection**: Preventing transaction ordering exploitation
4. **Impermanent Loss**: Managing risk for liquidity providers

Our current implementation handles these issues by:

- Requiring a minimum initial supply
- Implementing price calculations that account for current reserves
- Using a constant product formula that naturally limits extreme price movements

## Conclusion

This DEX implementation demonstrates the evolution from a basic bonding curve mechanism to a full-featured automated market maker. Each version builds upon the previous one, adding functionality and improving the design.

Future enhancements could include:

- Implementing multiple bonding curves for buy/sell operations
- Adding fee mechanisms for liquidity providers
- Implementing oracle price feeds for stable pricing
- Enhancing security features to prevent various attack vectors
