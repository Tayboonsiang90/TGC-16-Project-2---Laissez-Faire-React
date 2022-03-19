# TGC-16 Project 2

------

# Title: Laissez Faire 
## (French) "let people do as they choose"

------


## URL to deployed app

## Summary
### Binary Prediction Markets Funding Political Investigative Reporting

Prediction markets are exchange-traded markets created for the purpose to trade the outcome of events. The market prices can indicate what the crowd thinks the probability of that event happening is. This is a way of retrieving reliable crowd-sourced predictions. In fact, in 1996, one such prediction market managed to predict 32/39 Oscar nominees and 7/8 winners. 

My project is an beta implementation of prediction markets for the purpose of funding investigative reporting inspired by [Hindenburg Research.](https://astralcodexten.substack.com/p/use-prediction-markets-to-fund-investigative?s=r) Investigative journalists rarely capture any of the value they add to society by weeding out bad political actors - I think there can be a way to **incentivize** their work to encourage more **unbiased** journalism. 

This is Hindenburg's model.

>1. Investigate companies
>2. ...until they find one that is committing fraud
>3. Short the fraudulent company
>4. Publicly reveal the fraud
>5. Company's stock goes down
>6. Profit!

I tweaked this model for political events, e.g the chances of a politican winning an elections, or simply whether a political figure's popularity opinion polls will dip. A journalist who have dug up dirt on a certain politican can buy the odds that he doesn't not win an upcoming election, and sell the odds after he has released the dirt on the politician, monetizing his efforts. I will let the free markets be the judge.

## Important Disclaimer

This project is hypothetical and does not involve any real money, make references to any living human in the world. Any resemblance to actual events or locales or persons, living or dead, is entirely coincidental. None of the information contained here constitutes an offer (or solicitation of an offer) to buy or sell any currency, product or financial instrument.

------

## User Stories

[Names taken from here.](https://en.wikipedia.org/wiki/Alice_and_Bob)

### Journalists

Alice, 35 years old is an independent journalist working in a repressive country. She has recieved a tip-off that a popular political figure in the country is involved in a large scale drug trafficking scheme. However, she knows that if she speaks up about it, she knows its likely that she would be silenced and persecuted. She would like some form of financial guarantee as a fall-back, hence she goes on Laissez Faire and create a prediction market, then buys the odds that this political figure will not win the upcoming election at $0.13 a piece. After releasing this scandal, the political figure's popularity dipped and his chances of winning dipped as a result. Alice can now happily sell the odds of this political figure not winning at $0.6 a piece. 

* Acceptance Criteria
1. Anyone can create a political binary prediction market.
2. A dashboard showing her current bets and payouts from completed bets
3. Anyone can take each side of the bet.
4. There must be enough volume for a significant amount to be brought on either sides. (Around $20,000 as a standard (median annual pay internationally))

### Whistleblowers

Bob, 65 years old came across some documents whilst working that would incriminate his politican boss of corruption. However, he does not want to lose his job - he wants a peaceful retirement, yet he wants to tell the world. He goes on Laissez Faire and buys the odds that his politican boss's popularity opinion polls will dip next month. After whistleblowing, his boss's popularity indeed dipped. He is fired from work with a nice paycheque. 

* Acceptance Criteria
1. Anyone can create a political binary prediction market.
2. A dashboard showing her current bets and payouts from completed bets
3. Anyone can take each side of the bet.
4. There must be enough volume for a significant amount to be brought on either sides. (Around $20,000 as a standard (median annual pay internationally))

### Statisticians

Carol, 25 is a statistician tasked to give a forecast on the upcoming elections. However, she knows that opinion polls are notoriously historically inaccurate in her country. She decides to seek an alternative source of opinion, Laissez Faire, by checking what does the free market actually believes the chances of these politicians winning to check the accuracy of her data. (because there might be dirt on politicians that have yet to be uncovered)

* Acceptance Criteria
1. Odds as given by the market must be easily readable and interpreted.
2. There should be charts showing how the odds has evolved over time.

### Yield Seekers

Dan, 45 is unsatisfied by the interest on the fixed deposit account his bank gives him. He wants to earn more, but also taking on [more risk](https://academy.binance.com/en/articles/impermanent-loss-explained). He goes on Lassire Faire, choose a prediction market that he feels the odds would not shift by a lot until expiry date, and also with high volume. He buys 1 Yes and 1 No for $1 and adds liquidity to the market. He recieves 0.5% from every trade conducted until market expiry.

* Acceptance Criteria
1. A way for users to buy 1 Yes and 1 No for $1 and add liquidity to either sides of the market
2. A dashboard showing how much they have earned.

------
## Features

1. All prediction markets have binary outcomes, with either a Yes or No as an answer.
2. All prediction markets must be either the outcome of a scheduled election, or opinion poll results. 
3. All prediction markets must have a well-defined expiry date. 
4. The result of all prediction markets will be settled at the sole discretion of the adminstrator.
5. Market Making mechanism to be used is a Constant Product Automated Market Maker, due to democratizing adding of liquidity to users and also the inefficiencies of a Central Limit Order Book for a prediction market context.
6. Must be able to deposit and withdraw.
7. Must be able to add liquidity and withdraw liquidity.
8. Adminstrator must be able to dissolve a market, and return liquidity to all LPs. 
9. Must be able to add a prediction market of your own. 
10. At expiry date, the adminstrator can see those markets on a dashboard to add an answer and dissolve.

At the core of the market mechanism is a constant product automated market maker, whose use is popularized by Uniswap. A simple formula x*y = k governs the trading of x against y where k is invariant (except when liquidity is added or removed). To bootstrap liquidity and usage, the platform is using "startup funds" to boostrap $30k for every prediction market created at a 50:50 ratio. 

------

## Further Project Work

Due to the hypothetical efforts of political bad actors attempting to take down this site, hosting on IPFS and utilizing blockchain as a transaction layer will be useful future project developments. 

[Seek $1,000,000 in funding from Robin Hansen by tweaking it for board CEOs of Fortune 500 companies.](https://www.overcomingbias.com/2008/04/if-i-had-a-mill.html)

Many tweaks can be thought of - pharmaceuticals development for example: Markets could be made on whether a drug passes a testing stage, in order for the pharmaceutical company to recover the cost of developing the drug - hence subsidizing the drug for the general populace.

More research into using a LMSR market maker.





