import { CryptoModule } from '@/types';

// Note: This file contains the full CRYPTO_MODULES data that was removed from page.tsx
// Due to size, showing structure - the full data with all 14 lessons is preserved

export const CRYPTO_MODULES: CryptoModule[] = [
  // BEGINNER MODULE
  {
    id: 'beginner',
    title: 'Crypto Fundamentals',
    level: 'beginner',
    emoji: '🌱',
    description: 'Start your crypto journey with the basics',
    lessons: [
      {
        id: 1,
        title: 'What is Cryptocurrency?',
        duration: '15 min',
        xp: 50,
        content: [
          'Cryptocurrency is digital or virtual money that uses cryptography for security. Unlike traditional currencies (like PKR or USD), crypto operates without a central authority like a bank or government.',
          'Bitcoin, created in 2009, was the first cryptocurrency. Today, there are thousands of cryptocurrencies, each with different purposes and technologies.',
          'Key features: Decentralized (no single control), Transparent (all transactions recorded), Secure (cryptographic protection), Borderless (works globally)',
          'Cryptocurrencies run on blockchain technology - a distributed ledger that records all transactions across a network of computers.',
        ],
        keyPoints: [
          'Digital money secured by cryptography',
          'No central authority controls it',
          'Runs on blockchain technology',
          'Transparent and secure transactions'
        ],
        quiz: [
          {
            question: 'What makes cryptocurrency different from traditional money?',
            options: ['It\'s made of paper', 'It\'s decentralized with no central authority', 'It\'s only used online', 'It\'s free to use'],
            correctAnswer: 1,
            explanation: 'Cryptocurrency is decentralized, meaning no single entity like a bank or government controls it.'
          },
          {
            question: 'What technology do cryptocurrencies run on?',
            options: ['Cloud computing', 'Blockchain', 'Artificial Intelligence', 'Social media'],
            correctAnswer: 1,
            explanation: 'Cryptocurrencies operate on blockchain technology, a distributed ledger system.'
          }
        ]
      },
      {
        id: 2,
        title: 'Understanding Blockchain',
        duration: '18 min',
        xp: 50,
        content: [
          'A blockchain is like a digital ledger book that everyone can read, but no one can erase or change past entries. Each "block" contains transaction data, and blocks are linked together in a "chain".',
          'How it works: When you make a transaction, it\'s grouped with others into a block. Miners/validators verify these transactions. Once verified, the block is added to the chain permanently.',
          'Key concepts: Immutability (can\'t be changed), Transparency (everyone can see), Distributed (copies on many computers), Consensus (agreement on what\'s valid)',
          'Think of it like a Google Doc that everyone can view and add to, but no one can delete previous entries - and there are thousands of copies to prevent tampering.',
        ],
        keyPoints: [
          'Digital ledger of all transactions',
          'Blocks linked together in a chain',
          'Immutable and transparent',
          'Distributed across many computers'
        ],
        quiz: [
          {
            question: 'What is a blockchain?',
            options: ['A type of cryptocurrency', 'A digital ledger of transactions', 'A mining tool', 'A crypto wallet'],
            correctAnswer: 1,
            explanation: 'A blockchain is a distributed digital ledger that records all transactions in blocks linked together.'
          },
          {
            question: 'What does "immutable" mean in blockchain?',
            options: ['Can be changed easily', 'Cannot be altered once recorded', 'Is very fast', 'Is very cheap'],
            correctAnswer: 1,
            explanation: 'Immutability means once data is recorded on the blockchain, it cannot be changed or deleted.'
          }
        ]
      },
      {
        id: 3,
        title: 'Crypto Wallets Explained',
        duration: '20 min',
        xp: 75,
        content: [
          'A crypto wallet doesn\'t actually store your cryptocurrency - it stores the keys that prove you own it. Think of it like a password manager for your crypto.',
          'Types of wallets: Hot wallets (connected to internet - convenient but less secure), Cold wallets (offline storage - more secure but less convenient)',
          'Hot wallet examples: Mobile apps (Trust Wallet, MetaMask), Web wallets (exchange accounts), Desktop wallets. Cold wallet examples: Hardware wallets (Ledger, Trezor), Paper wallets',
          'Your wallet has two keys: Public key (like your email address - share to receive crypto), Private key (like your password - NEVER share, gives full access to your funds)',
          'CRITICAL: If you lose your private key or seed phrase, you lose access to your crypto forever. No one can recover it for you.',
        ],
        keyPoints: [
          'Wallets store your keys, not actual crypto',
          'Hot wallets: online, convenient',
          'Cold wallets: offline, more secure',
          'Never share your private key or seed phrase'
        ],
        quiz: [
          {
            question: 'What does a crypto wallet actually store?',
            options: ['The cryptocurrency itself', 'Your private and public keys', 'Your bank account', 'Mining equipment'],
            correctAnswer: 1,
            explanation: 'Wallets store your cryptographic keys that prove ownership of cryptocurrency on the blockchain.'
          },
          {
            question: 'Which is more secure for long-term storage?',
            options: ['Hot wallet', 'Cold wallet', 'Exchange account', 'Email'],
            correctAnswer: 1,
            explanation: 'Cold wallets (offline storage) are more secure for long-term storage as they\'re not connected to the internet.'
          }
        ]
      },
      {
        id: 4,
        title: 'How to Buy Your First Crypto',
        duration: '22 min',
        xp: 75,
        content: [
          'Step 1: Choose a reputable exchange (Binance, Coinbase, Kraken). Research reviews, security features, and fees. In Pakistan, consider local options that support PKR.',
          'Step 2: Complete KYC (Know Your Customer) verification. You\'ll need ID proof, address proof, and sometimes a selfie. This is required by law in most countries.',
          'Step 3: Add funds via bank transfer, credit card, or local payment methods. Check fees - they vary significantly between methods.',
          'Step 4: Buy cryptocurrency. Start small! Buy Bitcoin or Ethereum first as they\'re most established. Use limit orders to control your price.',
          'Step 5: Transfer to your personal wallet (not mandatory but recommended for security). Never leave large amounts on exchanges.',
          'Important: Only invest what you can afford to lose. Crypto is highly volatile. Do your research before buying any cryptocurrency.',
        ],
        keyPoints: [
          'Choose reputable exchange',
          'Complete KYC verification',
          'Start with small amounts',
          'Transfer to personal wallet for security',
          'Only invest what you can afford to lose'
        ],
        quiz: [
          {
            question: 'What is KYC verification?',
            options: ['A type of cryptocurrency', 'Identity verification required by exchanges', 'A trading strategy', 'A wallet type'],
            correctAnswer: 1,
            explanation: 'KYC (Know Your Customer) is identity verification required by regulated exchanges for legal compliance.'
          },
          {
            question: 'What\'s the safest practice for storing large amounts of crypto?',
            options: ['Keep on exchange', 'Transfer to personal wallet', 'Share with friends', 'Store in email'],
            correctAnswer: 1,
            explanation: 'Transferring to a personal wallet (especially cold storage) is safer than leaving funds on an exchange.'
          }
        ]
      }
    ]
  },

  // INTERMEDIATE MODULE
  {
    id: 'intermediate',
    title: 'Trading & DeFi',
    level: 'intermediate',
    emoji: '📈',
    description: 'Learn trading basics and decentralized finance',
    lessons: [
      {
        id: 5,
        title: 'Crypto Trading Basics',
        duration: '25 min',
        xp: 100,
        content: [
          'Trading vs Investing: Trading involves frequent buying/selling to profit from price movements. Investing is buying and holding long-term.',
          'Order types: Market order (buy/sell immediately at current price), Limit order (buy/sell at specific price), Stop-loss (automatically sell if price drops to limit losses)',
          'Reading charts: Candlesticks show price movement (green = price up, red = price down). Each candle shows open, close, high, low prices for a time period.',
          'Key concepts: Support (price level where buying pressure prevents further decline), Resistance (price level where selling pressure prevents further rise), Volume (trading activity)',
          'Risk management: Never invest more than you can afford to lose. Diversify (don\'t put all money in one crypto). Use stop-losses to limit potential losses.',
          'Common mistakes: FOMO (Fear Of Missing Out) buying, Panic selling, Trading on emotions, Not doing research, Ignoring fees',
        ],
        keyPoints: [
          'Understand different order types',
          'Learn to read basic charts',
          'Always use risk management',
          'Avoid emotional trading',
          'Consider fees in every trade'
        ],
        quiz: [
          {
            question: 'What is a stop-loss order?',
            options: ['An order to buy more', 'An order that automatically sells if price drops to limit losses', 'An order to stop trading', 'An order to increase limits'],
            correctAnswer: 1,
            explanation: 'A stop-loss automatically sells your crypto if the price drops to a certain level, limiting your potential losses.'
          },
          {
            question: 'What does FOMO stand for in trading?',
            options: ['Fear Of Missing Out', 'Find Only Market Orders', 'Follow Other Market Opinions', 'Free Online Money Offers'],
            correctAnswer: 0,
            explanation: 'FOMO (Fear Of Missing Out) leads traders to buy impulsively when they see prices rising, often at the worst time.'
          }
        ]
      },
      {
        id: 6,
        title: 'Understanding DeFi',
        duration: '28 min',
        xp: 100,
        content: [
          'DeFi (Decentralized Finance) recreates traditional financial services (lending, borrowing, trading) without banks or intermediaries using smart contracts.',
          'Key DeFi services: DEXs (Decentralized Exchanges like Uniswap), Lending platforms (Aave, Compound), Yield farming (earning interest on crypto), Staking (locking crypto to earn rewards)',
          'Smart contracts: Self-executing code on blockchain. When conditions are met, they automatically execute. No middleman needed.',
          'Liquidity pools: Users deposit crypto pairs to enable trading. In return, they earn fees from trades. Example: Provide ETH and USDC to a pool, earn trading fees.',
          'Risks: Smart contract bugs (code vulnerabilities), Impermanent loss (in liquidity pools), High gas fees (transaction costs on Ethereum), Rug pulls (developers abandon project)',
          'Benefits: No intermediaries (lower fees), 24/7 access, Permissionless (anyone can participate), Transparency (all code is public)',
        ],
        keyPoints: [
          'DeFi = traditional finance without banks',
          'Smart contracts automate everything',
          'Earn through lending, staking, liquidity',
          'Higher returns but higher risks',
          'Always research before using DeFi'
        ],
        quiz: [
          {
            question: 'What is DeFi?',
            options: ['A type of cryptocurrency', 'Decentralized Finance - financial services without intermediaries', 'A trading platform', 'A wallet type'],
            correctAnswer: 1,
            explanation: 'DeFi (Decentralized Finance) provides financial services like lending and trading without traditional intermediaries.'
          },
          {
            question: 'What are smart contracts?',
            options: ['Legal documents', 'Self-executing code on blockchain', 'Trading agreements', 'Wallet contracts'],
            correctAnswer: 1,
            explanation: 'Smart contracts are self-executing programs on blockchain that automatically execute when conditions are met.'
          }
        ]
      },
      {
        id: 7,
        title: 'NFTs and Digital Assets',
        duration: '20 min',
        xp: 75,
        content: [
          'NFT (Non-Fungible Token) is a unique digital asset on blockchain. Unlike Bitcoin (fungible - each coin is identical), each NFT is one-of-a-kind.',
          'Use cases: Digital art, Gaming items, Virtual real estate, Music, Collectibles, Domain names, Event tickets, Certificates',
          'How NFTs work: Metadata stored on blockchain proves ownership and authenticity. The actual file (image, video) is usually stored elsewhere (IPFS, cloud).',
          'Buying NFTs: Use marketplaces like OpenSea, Rarible. Need crypto wallet (MetaMask) and ETH for gas fees. Always verify contract address to avoid fakes.',
          'Value factors: Creator reputation, Rarity, Utility (what can you do with it), Community, Historical significance',
          'Risks: Highly speculative market, Copyright issues (owning NFT ≠ owning copyright), Environmental concerns (energy use), Market manipulation, Scams',
        ],
        keyPoints: [
          'NFTs are unique digital assets',
          'Prove ownership on blockchain',
          'Many use cases beyond art',
          'Highly speculative and risky',
          'Verify authenticity before buying'
        ],
        quiz: [
          {
            question: 'What makes NFTs different from cryptocurrencies like Bitcoin?',
            options: ['NFTs are cheaper', 'Each NFT is unique and non-fungible', 'NFTs are faster', 'NFTs are more secure'],
            correctAnswer: 1,
            explanation: 'NFTs are non-fungible, meaning each one is unique, unlike cryptocurrencies where each unit is identical.'
          },
          {
            question: 'Does owning an NFT mean you own the copyright?',
            options: ['Yes, always', 'No, unless explicitly stated', 'Only for art NFTs', 'Only if you created it'],
            correctAnswer: 1,
            explanation: 'Owning an NFT typically doesn\'t grant copyright unless explicitly stated in the terms.'
          }
        ]
      }
    ]
  },

  // ADVANCED MODULE
  {
    id: 'advanced',
    title: 'Advanced Concepts',
    level: 'advanced',
    emoji: '🚀',
    description: 'Master advanced trading and technical analysis',
    lessons: [
      {
        id: 8,
        title: 'Technical Analysis Deep Dive',
        duration: '35 min',
        xp: 150,
        content: [
          'Technical analysis uses historical price data and patterns to predict future movements. It\'s not fortune-telling - it\'s probability-based decision making.',
          'Key indicators: RSI (Relative Strength Index - shows overbought/oversold), MACD (Moving Average Convergence Divergence - shows momentum), Bollinger Bands (volatility indicator)',
          'Chart patterns: Head and Shoulders (reversal), Double Top/Bottom (reversal), Triangles (continuation), Flags and Pennants (continuation)',
          'Fibonacci retracement: Uses mathematical ratios to identify potential support/resistance levels. Common levels: 23.6%, 38.2%, 50%, 61.8%',
          'Volume analysis: High volume confirms trends. Low volume suggests weak movement. Volume should increase in direction of trend.',
          'Remember: Technical analysis is a tool, not a crystal ball. Combine with fundamental analysis and risk management. No indicator is 100% accurate.',
        ],
        keyPoints: [
          'Use multiple indicators together',
          'Understand chart patterns',
          'Volume confirms price movements',
          'Combine with fundamental analysis',
          'No strategy works 100% of the time'
        ],
        quiz: [
          {
            question: 'What does RSI measure?',
            options: ['Price direction', 'Overbought/oversold conditions', 'Trading volume', 'Market cap'],
            correctAnswer: 1,
            explanation: 'RSI (Relative Strength Index) measures whether an asset is overbought (>70) or oversold (<30).'
          },
          {
            question: 'Why is volume important in technical analysis?',
            options: ['It shows the price', 'It confirms the strength of price movements', 'It predicts exact prices', 'It shows market cap'],
            correctAnswer: 1,
            explanation: 'High volume confirms that price movements are backed by strong market participation.'
          }
        ]
      },
      {
        id: 9,
        title: 'Advanced Trading Strategies',
        duration: '30 min',
        xp: 150,
        content: [
          'Dollar-Cost Averaging (DCA): Invest fixed amount regularly regardless of price. Reduces impact of volatility. Example: Buy $100 of BTC every week.',
          'Swing Trading: Hold positions for days/weeks to profit from price swings. Requires technical analysis and patience. Less stressful than day trading.',
          'Arbitrage: Exploit price differences across exchanges. Buy low on one exchange, sell high on another. Requires fast execution and accounts fees.',
          'Futures and Leverage: Borrow money to amplify positions. 10x leverage = $100 controls $1000. WARNING: Can multiply losses too. Extremely risky.',
          'Portfolio rebalancing: Periodically adjust holdings to maintain target allocation. Example: Keep 50% BTC, 30% ETH, 20% others.',
          'Tax considerations: Track all trades for tax reporting. In many countries, crypto-to-crypto trades are taxable events. Consult tax professional.',
        ],
        keyPoints: [
          'DCA reduces volatility impact',
          'Swing trading for medium-term gains',
          'Leverage is extremely risky',
          'Rebalance portfolio regularly',
          'Understand tax implications'
        ],
        quiz: [
          {
            question: 'What is Dollar-Cost Averaging?',
            options: ['Buying only when price is low', 'Investing fixed amounts regularly', 'Selling at average price', 'Averaging your losses'],
            correctAnswer: 1,
            explanation: 'DCA involves investing a fixed amount at regular intervals, reducing the impact of volatility.'
          },
          {
            question: 'What is the main risk of using leverage?',
            options: ['Higher fees', 'Slower trades', 'Amplified losses', 'More taxes'],
            correctAnswer: 2,
            explanation: 'Leverage amplifies both gains AND losses - you can lose more than your initial investment.'
          }
        ]
      },
      {
        id: 10,
        title: 'Smart Contract Development Basics',
        duration: '40 min',
        xp: 200,
        content: [
          'Smart contracts are programs that run on blockchain. Ethereum uses Solidity language. Once deployed, code cannot be changed (immutable).',
          'Basic structure: State variables (store data), Functions (execute logic), Events (log activities), Modifiers (add conditions)',
          'Common use cases: Token creation (ERC-20, ERC-721), DEXs, Lending protocols, DAOs (Decentralized Autonomous Organizations), Gaming',
          'Security is CRITICAL: Bugs can\'t be fixed after deployment. Common vulnerabilities: Reentrancy attacks, Integer overflow, Access control issues',
          'Development tools: Remix (browser IDE), Hardhat (development environment), Truffle (testing framework), OpenZeppelin (secure contract libraries)',
          'Testing: Write comprehensive tests before deployment. Use testnets (Goerli, Sepolia) before mainnet. Get audits for contracts handling significant value.',
          'Gas optimization: Every operation costs gas. Optimize code to reduce costs. Use view/pure functions (don\'t modify state, free to call).',
        ],
        keyPoints: [
          'Smart contracts are immutable programs',
          'Security is paramount',
          'Test extensively before deployment',
          'Use established libraries (OpenZeppelin)',
          'Optimize for gas efficiency'
        ],
        quiz: [
          {
            question: 'What language is used for Ethereum smart contracts?',
            options: ['JavaScript', 'Python', 'Solidity', 'Java'],
            correctAnswer: 2,
            explanation: 'Solidity is the primary programming language for Ethereum smart contracts.'
          },
          {
            question: 'Why is smart contract security so important?',
            options: ['For faster execution', 'Because code cannot be changed after deployment', 'For lower fees', 'For better performance'],
            correctAnswer: 1,
            explanation: 'Smart contracts are immutable - bugs cannot be fixed after deployment, making security critical.'
          }
        ]
      }
    ]
  },

  // SECURITY MODULE
  {
    id: 'security',
    title: 'Security & Scam Prevention',
    level: 'security',
    emoji: '🔒',
    description: 'Protect yourself from scams and secure your assets',
    lessons: [
      {
        id: 11,
        title: 'Wallet Security Best Practices',
        duration: '25 min',
        xp: 100,
        content: [
          'Your seed phrase is EVERYTHING. It\'s 12-24 words that can recover your entire wallet. Write it down on paper, NEVER store digitally. Never share with anyone.',
          'Secure storage: Use hardware wallet for large amounts. Store seed phrase in multiple secure physical locations (fireproof safe, bank deposit box). Consider metal backup plates.',
          'Password security: Use unique, strong password for each exchange/wallet. Use password manager (1Password, Bitwarden). Enable 2FA everywhere.',
          '2FA (Two-Factor Authentication): Use authenticator app (Google Authenticator, Authy), NOT SMS (can be hijacked). Backup 2FA codes securely.',
          'Device security: Keep devices updated. Use antivirus. Don\'t jailbreak/root. Be careful with public WiFi. Use VPN for sensitive transactions.',
          'Phishing protection: Bookmark exchange URLs. Verify URLs before entering credentials. Exchanges never ask for seed phrase. Be suspicious of urgent messages.',
          'CRITICAL RULES: Never share seed phrase. Never enter seed phrase on any website. No legitimate service will ever ask for it.',
        ],
        keyPoints: [
          'Seed phrase = complete wallet access',
          'Write seed phrase on paper only',
          'Use hardware wallet for large amounts',
          'Enable 2FA with authenticator app',
          'Never share seed phrase with anyone'
        ],
        quiz: [
          {
            question: 'How should you store your seed phrase?',
            options: ['In email', 'In cloud storage', 'Written on paper in secure location', 'In a text file'],
            correctAnswer: 2,
            explanation: 'Seed phrases should be written on paper and stored in secure physical locations, never digitally.'
          },
          {
            question: 'What is the best 2FA method?',
            options: ['SMS', 'Email', 'Authenticator app', 'Security questions'],
            correctAnswer: 2,
            explanation: 'Authenticator apps are more secure than SMS, which can be intercepted through SIM swapping.'
          }
        ]
      },
      {
        id: 12,
        title: 'Common Crypto Scams',
        duration: '30 min',
        xp: 100,
        content: [
          'Phishing scams: Fake websites/emails mimicking real exchanges. Always check URL carefully. Binance.com vs Binance.co (fake). Never click links in unexpected emails.',
          'Ponzi/Pyramid schemes: Promise guaranteed high returns. "Invest $100, get $1000 in a month!" If it sounds too good to be true, it is. Examples: BitConnect, OneCoin.',
          'Fake giveaways: "Elon Musk is giving away Bitcoin! Send 1 BTC, get 2 BTC back!" ALWAYS A SCAM. No one gives free money. Verify on official channels.',
          'Rug pulls: Developers create token, hype it up, then drain liquidity and disappear. Check: Locked liquidity, Audited contract, Doxxed team, Realistic roadmap.',
          'SIM swapping: Attacker takes over your phone number to bypass 2FA. Protection: Use authenticator app, not SMS. Contact carrier to add extra security.',
          'Fake support: Scammers pose as customer support on social media. Real support NEVER DMs first. Never share credentials with "support".',
          'Pump and dump: Coordinated buying to inflate price, then sell to latecomers. Avoid low-cap coins with sudden huge volume. Do your research.',
        ],
        keyPoints: [
          'Verify all URLs and emails carefully',
          'No legitimate giveaway asks you to send crypto first',
          'Research projects before investing',
          'Real support never DMs first',
          'If it sounds too good to be true, it is'
        ],
        quiz: [
          {
            question: 'What is a rug pull?',
            options: ['A type of wallet', 'Developers abandon project and drain funds', 'A trading strategy', 'A security feature'],
            correctAnswer: 1,
            explanation: 'A rug pull is when developers create a token, hype it, then drain liquidity and abandon the project.'
          },
          {
            question: 'How can you identify a fake giveaway?',
            options: ['It\'s on social media', 'It asks you to send crypto first', 'It mentions celebrities', 'All giveaways are fake'],
            correctAnswer: 1,
            explanation: 'Legitimate giveaways never ask you to send crypto first. This is always a scam.'
          }
        ]
      },
      {
        id: 13,
        title: 'Red Flags and Due Diligence',
        duration: '28 min',
        xp: 100,
        content: [
          'Before investing, research thoroughly. Check: Whitepaper (technical document), Team (are they real, experienced?), Community (active, engaged?), Code (audited, open-source?)',
          'Red flags: Anonymous team, No working product, Unrealistic promises, Copied whitepaper, Low liquidity, No audit, Pressure to invest quickly',
          'Check social media: Real projects have active, engaged communities. Beware of: Bought followers, Only positive comments (deleting criticism), Fake partnerships',
          'Tokenomics: How are tokens distributed? Red flag: Team holds >50%. Good: Fair distribution, locked team tokens, clear use case for token.',
          'Audit reports: Reputable auditors (CertiK, ConsenSys Diligence). But remember: Audit ≠ guarantee. Audited projects can still fail or be scams.',
          'Use case: Does the project solve a real problem? Or is it just hype? Many projects are solutions looking for problems.',
          'DYOR (Do Your Own Research): Don\'t invest based on influencer recommendations. They might be paid. Make your own informed decisions.',
        ],
        keyPoints: [
          'Research team, whitepaper, and code',
          'Watch for red flags like anonymous teams',
          'Check tokenomics and distribution',
          'Verify audits from reputable firms',
          'Always DYOR - Do Your Own Research'
        ],
        quiz: [
          {
            question: 'What is a major red flag in tokenomics?',
            options: ['Fair distribution', 'Team holds majority of tokens', 'Locked liquidity', 'Clear use case'],
            correctAnswer: 1,
            explanation: 'If the team holds the majority of tokens, they can dump them and crash the price.'
          },
          {
            question: 'What does DYOR mean?',
            options: ['Do Your Own Research', 'Don\'t Yield On Returns', 'Diversify Your Own Resources', 'Develop Your Own Rules'],
            correctAnswer: 0,
            explanation: 'DYOR (Do Your Own Research) means making informed decisions based on your own investigation, not others\' advice.'
          }
        ]
      },
      {
        id: 14,
        title: 'Protecting Your Privacy',
        duration: '22 min',
        xp: 75,
        content: [
          'Blockchain is transparent - all transactions are public. Your wallet address can reveal your entire transaction history and holdings.',
          'Privacy coins: Monero, Zcash offer enhanced privacy through encryption. But may face regulatory scrutiny. Some exchanges delist them.',
          'Mixing services: Combine your coins with others to obscure origin. Legal gray area. Can be associated with money laundering. Use with caution.',
          'Multiple wallets: Use different wallets for different purposes. One for trading, one for long-term holding, one for DeFi. Reduces exposure if one is compromised.',
          'Don\'t doxx yourself: Don\'t share wallet addresses publicly. Don\'t post about holdings on social media. Makes you a target for scammers and hackers.',
          'VPN usage: Hides your IP address when accessing exchanges and wallets. Choose reputable VPN (NordVPN, ExpressVPN). Free VPNs may sell your data.',
          'Metadata: Even with privacy measures, metadata (timing, amounts, patterns) can reveal information. True privacy is very difficult.',
        ],
        keyPoints: [
          'Blockchain transactions are public',
          'Use multiple wallets for different purposes',
          'Don\'t share wallet addresses publicly',
          'Consider VPN for additional privacy',
          'Be aware of metadata leakage'
        ],
        quiz: [
          {
            question: 'Why should you use multiple wallets?',
            options: ['To look professional', 'To reduce exposure if one is compromised', 'To get more airdrops', 'To confuse yourself'],
            correctAnswer: 1,
            explanation: 'Using separate wallets for different purposes limits damage if one wallet is compromised.'
          },
          {
            question: 'What information is public on blockchain?',
            options: ['Your name', 'Your address', 'All transactions and wallet balances', 'Your password'],
            correctAnswer: 2,
            explanation: 'All transactions and wallet balances are publicly visible on the blockchain, though not directly tied to your identity.'
          }
        ]
      }
    ]
  }
];
