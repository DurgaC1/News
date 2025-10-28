import { NewsArticle, NewsPreferences } from "../types";

export interface MockArticle extends NewsArticle {
  trendingScore: number;
  engagementScore: number;
  tags: string[];
  relatedArticles: string[];
}

export class MockDataService {
  private static categories = [
    "Technology",
    "Sports",
    "Politics",
    "Business",
    "Health",
    "Science",
    "Entertainment",
    "World",
    "Environment",
    "Education",
    "Lifestyle",
    "Travel",
  ];

  private static sources = [
    "TechCrunch",
    "BBC News",
    "CNN",
    "Reuters",
    "The Guardian",
    "The New York Times",
    "The Washington Post",
    "Associated Press",
    "Bloomberg",
    "Forbes",
    "Wired",
    "National Geographic",
    "Scientific American",
    "ESPN",
    "Sports Illustrated",
  ];

  private static authors = [
    "Sarah Johnson",
    "Michael Chen",
    "Emily Rodriguez",
    "David Kim",
    "Lisa Wang",
    "James Thompson",
    "Maria Garcia",
    "Alex Patel",
    "Jennifer Lee",
    "Robert Brown",
    "Amanda Davis",
    "Kevin Wilson",
    "Rachel Green",
    "Tom Anderson",
    "Nicole Taylor",
  ];

  private static generateMockArticles(): MockArticle[] {
    const articles: MockArticle[] = [];
    const baseTime = Date.now();

    // Technology Articles
    articles.push({
      id: "tech-1",
      title: "Revolutionary AI Breakthrough Promises to Transform Healthcare",
      description:
        "New artificial intelligence system can diagnose diseases with 99.7% accuracy, potentially revolutionizing medical diagnosis worldwide.",
      content:
        'In a groundbreaking development that could reshape the future of healthcare, researchers at Stanford University have unveiled a revolutionary AI system capable of diagnosing diseases with unprecedented accuracy. The system, trained on millions of medical images and patient records, can identify early signs of cancer, heart disease, and neurological disorders with 99.7% accuracy - far exceeding human diagnostic capabilities.\n\nThe technology uses advanced machine learning algorithms and neural networks to analyze medical scans, blood tests, and patient symptoms. Dr. Sarah Johnson, lead researcher on the project, explains that the system can process complex medical data in seconds, providing doctors with instant, highly accurate diagnoses.\n\n"This could fundamentally change how we approach healthcare," says Johnson. "Early detection is crucial for successful treatment, and our AI system can identify diseases in their earliest stages when they\'re most treatable."\n\nThe system has already been tested in clinical trials across 50 hospitals worldwide, showing remarkable results. In one trial involving 10,000 patients, the AI correctly identified 99.7% of cancer cases, compared to 85% accuracy for human radiologists.\n\nHowever, the technology also raises important questions about the role of AI in healthcare. Some experts worry about over-reliance on automated systems, while others see it as a powerful tool to augment human expertise.\n\n"The goal isn\'t to replace doctors," Johnson emphasizes. "It\'s to give them superhuman diagnostic capabilities so they can focus on what they do best - caring for patients and developing treatment plans."\n\nThe FDA is currently reviewing the system for approval, with hopes of widespread deployment within the next two years. If approved, this technology could save millions of lives and reduce healthcare costs by billions of dollars annually.',
      url: "https://example.com/ai-healthcare-breakthrough",
      imageUrl: "https://picsum.photos/400/600?random=1",
      publishedAt: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(),
      source: "TechCrunch",
      category: "Technology",
      author: "Sarah Johnson",
      readTime: 8,
      credits: 25,
      trendingScore: 95,
      engagementScore: 88,
      tags: ["AI", "Healthcare", "Machine Learning", "Medical Technology"],
      relatedArticles: ["tech-2", "health-1"],
    });

    articles.push({
      id: "tech-2",
      title: "Quantum Computing Milestone: IBM Achieves 1000-Qubit Processor",
      description:
        "IBM's latest quantum processor represents a major leap forward in quantum computing, bringing practical quantum applications closer to reality.",
      content:
        'IBM has announced a major breakthrough in quantum computing with the development of a 1000-qubit processor, marking a significant milestone in the race to build practical quantum computers. The new processor, codenamed "Condor," represents a tenfold increase in qubit count from IBM\'s previous generation.\n\nQuantum computers leverage the principles of quantum mechanics to perform calculations that would be impossible for classical computers. While traditional computers use bits that exist in either 0 or 1 states, quantum bits (qubits) can exist in multiple states simultaneously, enabling exponential computational power.\n\n"This is a watershed moment for quantum computing," says Dr. Jay Gambetta, IBM\'s Vice President of Quantum Computing. "We\'re not just scaling up the number of qubits - we\'re fundamentally improving the quality and coherence of our quantum systems."\n\nThe Condor processor addresses one of the biggest challenges in quantum computing: maintaining quantum coherence. Qubits are extremely fragile and can lose their quantum properties due to environmental interference. IBM\'s new architecture includes advanced error correction and improved qubit connectivity.\n\nPractical applications for quantum computing include drug discovery, financial modeling, cryptography, and optimization problems. Pharmaceutical companies are particularly excited about the potential to simulate molecular interactions for drug development.\n\n"Quantum computing could accelerate drug discovery from years to months," explains Dr. Maria Garcia, a computational chemist at Pfizer. "The ability to simulate complex molecular systems could lead to breakthrough treatments for diseases like cancer and Alzheimer\'s."\n\nHowever, significant challenges remain. Quantum computers require extremely cold temperatures (near absolute zero) and are highly sensitive to environmental noise. IBM estimates that practical quantum applications are still 5-10 years away.\n\nThe announcement has sparked renewed interest in quantum computing investments, with venture capital firms pouring billions into quantum startups. Governments worldwide are also increasing funding for quantum research, recognizing its potential strategic importance.\n\nIBM plans to make the Condor processor available through its cloud platform, allowing researchers and companies to experiment with quantum algorithms. The company is also working on even larger processors, with plans for a 10,000-qubit system by 2030.',
      url: "https://example.com/ibm-quantum-milestone",
      imageUrl: "https://picsum.photos/400/600?random=2",
      publishedAt: new Date(baseTime - 4 * 60 * 60 * 1000).toISOString(),
      source: "Wired",
      category: "Technology",
      author: "Michael Chen",
      readTime: 7,
      credits: 20,
      trendingScore: 78,
      engagementScore: 72,
      tags: ["Quantum Computing", "IBM", "Technology", "Innovation"],
      relatedArticles: ["tech-1", "science-1"],
    });

    // Sports Articles
    articles.push({
      id: "sports-1",
      title: "Historic Comeback: Team Wins Championship After 20-Year Drought",
      description:
        "In an emotional finale, the underdog team overcame a 15-point deficit to win their first championship in two decades.",
      content:
        'In one of the most dramatic comebacks in sports history, the Phoenix Rising completed an improbable journey to championship glory, defeating the heavily favored Thunderbolts 98-95 in overtime. The victory ended a 20-year championship drought and capped off a season that began with low expectations.\n\nTrailing by 15 points with just 8 minutes remaining in regulation, the Rising looked destined for another heartbreaking loss. But led by their veteran point guard Marcus Johnson, the team mounted a furious comeback that will be remembered for generations.\n\n"We never gave up," said Johnson, who scored 12 points in the final 8 minutes of regulation. "This team has heart, and we knew we could do something special if we just kept fighting."\n\nThe game\'s turning point came with 3:42 remaining when Johnson stole the ball and converted a three-point play, cutting the deficit to single digits. The crowd erupted as the momentum shifted dramatically.\n\nIn overtime, rookie sensation Elena Rodriguez took over, scoring 8 of her 22 points in the extra period. Her clutch three-pointer with 1:23 remaining gave the Rising their first lead since the second quarter.\n\n"This is what we\'ve been working for all season," Rodriguez said through tears. "To see all our hard work pay off like this is incredible."\n\nThe victory was particularly sweet for head coach David Kim, who took over the struggling franchise three years ago. Kim implemented a new system focused on player development and team chemistry, transforming the Rising from perennial losers to champions.\n\n"We built this team the right way," Kim said. "We focused on character, work ethic, and believing in each other. This championship belongs to everyone who believed in our vision."\n\nThe celebration lasted well into the night as thousands of fans flooded the streets around the arena. For a city that has endured years of sports disappointment, this victory represents more than just a championship - it\'s a symbol of hope and perseverance.\n\n"This is our moment," said longtime fan Jennifer Lee, who has been following the team since childhood. "After all these years of heartbreak, we finally have something to celebrate. This team represents everything that\'s great about our city."\n\nThe Rising\'s championship run included victories over three higher-seeded teams, making their triumph even more remarkable. Their journey from underdogs to champions will be remembered as one of the greatest stories in sports history.',
      url: "https://example.com/phoenix-rising-championship",
      imageUrl: "https://picsum.photos/400/600?random=3",
      publishedAt: new Date(baseTime - 6 * 60 * 60 * 1000).toISOString(),
      source: "ESPN",
      category: "Sports",
      author: "David Kim",
      readTime: 6,
      credits: 18,
      trendingScore: 92,
      engagementScore: 95,
      tags: ["Championship", "Comeback", "Basketball", "Underdog"],
      relatedArticles: ["sports-2", "sports-3"],
    });

    // Politics Articles
    articles.push({
      id: "politics-1",
      title: "Historic Climate Agreement Reached at Global Summit",
      description:
        "World leaders have committed to unprecedented carbon reduction targets, marking a turning point in global climate action.",
      content:
        'In a historic moment for global environmental policy, representatives from 195 countries have reached an unprecedented agreement on carbon reduction targets at the Global Climate Summit in Paris. The agreement commits nations to achieving net-zero emissions by 2050, with interim targets that will be reviewed every five years.\n\nThe breakthrough came after intense negotiations that extended well past the scheduled deadline. Key sticking points included funding mechanisms for developing nations and enforcement mechanisms for non-compliance. The final agreement includes a $100 billion annual fund to help developing countries transition to clean energy.\n\n"This is a watershed moment for humanity," said UN Secretary-General Antonio Guterres. "For the first time, we have a comprehensive, legally binding framework that addresses the climate crisis with the urgency it demands."\n\nThe agreement includes specific commitments from major emitters. The United States pledged to reduce emissions by 50% by 2030, while China committed to peak emissions by 2025 and achieve carbon neutrality by 2060. The European Union announced plans to reduce emissions by 55% by 2030.\n\nEnvironmental groups praised the agreement as a significant step forward, though some expressed concern that the targets may not be ambitious enough to limit global warming to 1.5 degrees Celsius above pre-industrial levels.\n\n"The science is clear - we need to act faster and more decisively," said Dr. Rachel Green, climate scientist at MIT. "While this agreement is a positive step, we must ensure that countries follow through on their commitments."\n\nThe agreement also includes provisions for carbon trading markets, allowing countries to buy and sell emission credits. This mechanism is designed to encourage innovation and provide flexibility in meeting targets.\n\nBusiness leaders welcomed the agreement, with many major corporations announcing new sustainability initiatives. Tech giants like Apple and Google pledged to achieve carbon neutrality within their supply chains by 2030.\n\n"This agreement provides the regulatory certainty that businesses need to invest in clean technology," said Lisa Wang, CEO of CleanTech Solutions. "We\'re already seeing increased investment in renewable energy and carbon capture technologies."\n\nThe implementation of the agreement will require unprecedented cooperation between nations. A new international body will be established to monitor compliance and facilitate technology transfer between developed and developing countries.\n\nCritics argue that the agreement lacks sufficient enforcement mechanisms and that voluntary commitments may not be enough to address the scale of the climate crisis. However, supporters point to the agreement\'s transparency requirements and peer review processes as important accountability measures.\n\nThe summit also featured commitments from private sector actors, with major financial institutions pledging to align their portfolios with net-zero emissions targets. This represents a significant shift in how the financial sector approaches climate risk.\n\nAs the summit concluded, leaders emphasized that the real work begins now. The success of the agreement will depend on rapid implementation and continued political will to maintain momentum in the face of economic and political challenges.',
      url: "https://example.com/climate-summit-agreement",
      imageUrl: "https://picsum.photos/400/600?random=4",
      publishedAt: new Date(baseTime - 8 * 60 * 60 * 1000).toISOString(),
      source: "The Guardian",
      category: "Politics",
      author: "Emily Rodriguez",
      readTime: 9,
      credits: 22,
      trendingScore: 89,
      engagementScore: 85,
      tags: ["Climate Change", "Global Agreement", "Environment", "Policy"],
      relatedArticles: ["politics-2", "environment-1"],
    });

    // Health Articles
    articles.push({
      id: "health-1",
      title:
        "Breakthrough Gene Therapy Shows Promise for Treating Rare Diseases",
      description:
        "New gene therapy approach successfully treats patients with previously untreatable genetic disorders, offering hope for millions worldwide.",
      content:
        'A revolutionary gene therapy treatment has shown remarkable success in treating patients with rare genetic disorders, offering new hope for conditions that were previously considered untreatable. The therapy, developed by researchers at the National Institutes of Health, uses advanced CRISPR technology to correct genetic mutations at the cellular level.\n\nIn a clinical trial involving 15 patients with various rare diseases, the treatment showed a 90% success rate in halting disease progression. Some patients even showed signs of reversal of symptoms that had been present for years.\n\n"This is truly transformative medicine," said Dr. Jennifer Lee, lead researcher on the study. "We\'re not just treating symptoms - we\'re addressing the root cause of these diseases at the genetic level."\n\nThe therapy works by using a modified version of the CRISPR gene-editing system to target specific genetic mutations. Unlike traditional CRISPR, which cuts DNA, this approach uses a "base editor" that can make precise changes to individual DNA letters without breaking the double helix.\n\nOne of the most dramatic success stories involves 8-year-old Emma Thompson, who was diagnosed with a rare metabolic disorder that was slowly destroying her nervous system. After receiving the gene therapy, Emma\'s symptoms began to improve within weeks.\n\n"Emma can now walk without assistance and has regained much of her speech," said her mother, Sarah Thompson. "It\'s like we got our daughter back. This treatment has given us hope we never thought we\'d have."\n\nThe therapy is particularly promising for diseases caused by single gene mutations, which affect approximately 350 million people worldwide. These conditions are often devastating and have no effective treatments.\n\nHowever, the treatment is not without challenges. The therapy requires precise delivery to affected cells, and researchers are still working to optimize delivery methods for different tissues and organs.\n\n"We\'re learning that each disease requires a customized approach," explained Dr. Michael Chen, a geneticist involved in the research. "The delivery system that works for liver diseases may not be effective for neurological conditions."\n\nThe cost of the treatment is another consideration. Gene therapies are among the most expensive medical treatments, with costs often exceeding $1 million per patient. However, researchers argue that the long-term benefits and potential for curing diseases justify the investment.\n\nInsurance companies are beginning to recognize the value of gene therapies, with some offering coverage for approved treatments. The hope is that as the technology matures, costs will decrease and access will improve.\n\nThe FDA has granted the therapy "breakthrough" status, which could accelerate the approval process. If approved, this treatment could be available to patients within the next two years.\n\n"This represents a new era in medicine," said Dr. Lee. "We\'re moving from treating diseases to potentially curing them. The implications for human health are profound."\n\nThe research team is now expanding their studies to include more patients and additional genetic disorders. They\'re also working on developing more efficient delivery systems and reducing the cost of treatment.\n\nFor families affected by rare genetic diseases, this breakthrough offers something they\'ve never had before: hope. The possibility of not just managing symptoms, but actually curing these devastating conditions, represents a fundamental shift in how we approach genetic medicine.',
      url: "https://example.com/gene-therapy-breakthrough",
      imageUrl: "https://picsum.photos/400/600?random=5",
      publishedAt: new Date(baseTime - 10 * 60 * 60 * 1000).toISOString(),
      source: "Scientific American",
      category: "Health",
      author: "Dr. Jennifer Lee",
      readTime: 8,
      credits: 24,
      trendingScore: 76,
      engagementScore: 82,
      tags: ["Gene Therapy", "CRISPR", "Rare Diseases", "Medical Breakthrough"],
      relatedArticles: ["health-2", "science-1"],
    });

    // Science Articles
    articles.push({
      id: "science-1",
      title: "Mars Rover Discovers Evidence of Ancient Microbial Life",
      description:
        "NASA's Perseverance rover has found compelling evidence of ancient microbial life on Mars, potentially answering one of humanity's greatest questions.",
      content:
        'NASA\'s Perseverance rover has made a discovery that could fundamentally change our understanding of life in the universe. After months of analysis, scientists have confirmed that the rover has found compelling evidence of ancient microbial life on Mars.\n\nThe discovery comes from samples collected in Jezero Crater, a 28-mile-wide impact crater that was once home to a large lake. The samples contain organic molecules and structures that strongly suggest the presence of ancient microorganisms.\n\n"This is the most significant discovery in the history of Mars exploration," said Dr. Sarah Johnson, NASA\'s chief scientist for Mars exploration. "We\'ve found evidence that life not only existed on Mars billions of years ago, but it may have been more widespread than we ever imagined."\n\nThe evidence includes fossilized structures that resemble microbial mats found on Earth, as well as chemical signatures consistent with biological processes. The samples also contain complex organic molecules that are typically associated with living organisms.\n\n"What we\'re seeing is remarkably similar to what we find in ancient rocks on Earth," explained Dr. Michael Chen, a geobiologist at Caltech. "The structures, the chemistry, the context - everything points to biological origin."\n\nThe discovery suggests that Mars was once a much more hospitable place than it is today. Billions of years ago, the planet had a thicker atmosphere, liquid water on its surface, and conditions that could have supported life.\n\n"This changes everything we thought we knew about Mars," said Dr. Emily Rodriguez, a planetary scientist at MIT. "Mars wasn\'t just potentially habitable - it was actually inhabited. This raises profound questions about the origins of life in our solar system."\n\nThe implications extend far beyond Mars. If life arose independently on two planets in the same solar system, it suggests that life might be common throughout the universe. This discovery provides the strongest evidence yet that we are not alone.\n\n"The probability of life existing elsewhere just went up dramatically," said Dr. David Kim, an astrobiologist at SETI. "If life can arise on two planets in the same solar system, imagine what might be possible in the billions of other solar systems in our galaxy."\n\nThe discovery has sparked renewed interest in Mars exploration. NASA is already planning follow-up missions to collect more samples and search for additional evidence of ancient life. The European Space Agency and China\'s space program are also accelerating their Mars programs.\n\n"This is just the beginning," said Dr. Johnson. "We\'ve opened a new chapter in Mars exploration. Every future mission will be looking for more evidence of life, both ancient and potentially modern."\n\nThe samples collected by Perseverance will be returned to Earth in the next decade as part of the Mars Sample Return mission. Scientists are eager to study these samples in detail using Earth\'s most advanced laboratory equipment.\n\n"We\'re going to learn things about Mars that we never thought possible," said Dr. Chen. "These samples could contain the secrets of how life began, not just on Mars, but potentially on Earth as well."\n\nThe discovery has also renewed interest in the search for life on other worlds. Missions to Europa, Enceladus, and other potentially habitable moons are being prioritized, and new telescopes are being designed specifically to search for signs of life on exoplanets.\n\nFor now, scientists are being cautious about their conclusions. While the evidence is compelling, they want to be absolutely certain before making definitive claims about life on Mars. Additional analysis and confirmation from multiple sources will be required.\n\n"This is a discovery that will be studied for decades," said Dr. Rodriguez. "We\'re not just finding fossils - we\'re potentially finding the key to understanding life itself."\n\nThe implications of this discovery extend far beyond science. It touches on fundamental questions about our place in the universe and the nature of life itself. As we continue to explore Mars and other worlds, we may be on the verge of answering one of humanity\'s oldest and most profound questions: Are we alone?',
      url: "https://example.com/mars-life-discovery",
      imageUrl: "https://picsum.photos/400/600?random=6",
      publishedAt: new Date(baseTime - 12 * 60 * 60 * 1000).toISOString(),
      source: "National Geographic",
      category: "Science",
      author: "Dr. Sarah Johnson",
      readTime: 10,
      credits: 28,
      trendingScore: 94,
      engagementScore: 91,
      tags: ["Mars", "Life", "NASA", "Space Exploration"],
      relatedArticles: ["science-2", "tech-2"],
    });

    // Business Articles
    articles.push({
      id: "business-1",
      title:
        "Tesla's Revolutionary Battery Technology Disrupts Energy Industry",
      description:
        "Tesla's new solid-state battery promises to revolutionize electric vehicles and renewable energy storage, potentially ending fossil fuel dependence.",
      content:
        'Tesla has unveiled a revolutionary solid-state battery technology that promises to transform not just electric vehicles, but the entire energy industry. The new battery, developed in partnership with Panasonic, offers three times the energy density of current lithium-ion batteries while charging in just 10 minutes.\n\nThe breakthrough comes at a critical time for the energy transition. As countries worldwide commit to net-zero emissions, the need for efficient, long-lasting energy storage has never been greater. Tesla\'s new technology could accelerate the adoption of renewable energy and electric vehicles by decades.\n\n"This is a game-changer for the entire energy sector," said Elon Musk, Tesla\'s CEO. "We\'re not just making better batteries - we\'re fundamentally changing how we think about energy storage and transportation."\n\nThe solid-state battery eliminates the liquid electrolyte found in traditional lithium-ion batteries, replacing it with a solid material that conducts ions. This design is inherently safer, more stable, and more efficient than current battery technology.\n\nKey advantages include:\n• 3x higher energy density\n• 10-minute charging times\n• 1 million mile lifespan\n• No thermal runaway risk\n• 50% lower cost per kWh\n\n"The implications are enormous," said Dr. Lisa Wang, a battery researcher at Stanford. "This technology could make electric vehicles cheaper than gasoline cars and enable grid-scale energy storage that makes renewable energy truly competitive."\n\nTesla plans to begin production of the new batteries in 2025, with initial applications in their Model 3 and Model Y vehicles. The company expects to achieve cost parity with gasoline vehicles within two years of launch.\n\nThe technology has already attracted interest from major automakers, with Ford, GM, and Volkswagen reportedly in discussions with Tesla about licensing the technology. Energy companies are also exploring applications for grid storage and renewable energy integration.\n\n"This could be the breakthrough that finally makes renewable energy the dominant source of power," said Michael Chen, CEO of GreenGrid Solutions. "The ability to store massive amounts of energy efficiently changes everything about how we design power systems."\n\nThe battery technology also addresses one of the biggest challenges facing renewable energy: intermittency. Solar and wind power are only available when the sun shines or wind blows, but efficient energy storage could make these sources as reliable as fossil fuels.\n\nTesla\'s Gigafactory in Nevada will be retooled to produce the new batteries, with plans to scale production to 100 GWh annually by 2027. The company is also building new facilities in Texas and Germany to meet expected demand.\n\nThe environmental impact could be profound. If electric vehicles become cheaper and more convenient than gasoline cars, it could accelerate the transition away from fossil fuels. Grid-scale energy storage could enable 100% renewable energy systems.\n\n"This is exactly the kind of innovation we need to address climate change," said Dr. Emily Rodriguez, an environmental scientist at MIT. "Technology that makes clean energy not just environmentally friendly, but economically superior."\n\nHowever, challenges remain. Scaling production of solid-state batteries is complex, and Tesla will need to prove that the technology can be manufactured reliably at scale. The company also faces competition from other battery manufacturers working on similar technologies.\n\n"We\'re confident in our approach," said Musk. "We\'ve been working on this technology for over a decade, and we\'re ready to bring it to market."\n\nThe announcement has sent shockwaves through the energy industry. Oil companies are reassessing their long-term strategies, while renewable energy companies are accelerating their development plans. The transition to clean energy may be happening faster than anyone anticipated.\n\nFor consumers, the implications are equally significant. Electric vehicles with 500-mile ranges and 10-minute charging times could eliminate range anxiety and make EVs more convenient than gasoline cars. Home energy storage systems could provide backup power and reduce electricity bills.\n\n"This changes everything," said Sarah Thompson, a Tesla investor and EV enthusiast. "We\'re not just talking about better cars - we\'re talking about a fundamental shift in how we power our lives."\n\nAs Tesla prepares to bring this technology to market, the energy industry is bracing for disruption. The question is no longer whether the transition to clean energy will happen, but how quickly it will occur. With Tesla\'s new battery technology, the answer may be: faster than anyone expected.',
      url: "https://example.com/tesla-battery-breakthrough",
      imageUrl: "https://picsum.photos/400/600?random=7",
      publishedAt: new Date(baseTime - 14 * 60 * 60 * 1000).toISOString(),
      source: "Forbes",
      category: "Business",
      author: "Michael Chen",
      readTime: 9,
      credits: 26,
      trendingScore: 87,
      engagementScore: 89,
      tags: [
        "Tesla",
        "Battery Technology",
        "Electric Vehicles",
        "Renewable Energy",
      ],
      relatedArticles: ["business-2", "tech-1"],
    });

    // Entertainment Articles
    articles.push({
      id: "entertainment-1",
      title: "Virtual Reality Concert Breaks Attendance Records",
      description:
        "Pop sensation's VR concert attracted over 10 million viewers worldwide, revolutionizing the future of live entertainment.",
      content:
        'In a groundbreaking event that could reshape the future of live entertainment, pop sensation Luna Rodriguez\'s virtual reality concert attracted over 10 million viewers worldwide, setting a new record for virtual event attendance. The concert, streamed through Meta\'s Horizon Venues platform, offered fans an immersive experience that rivaled traditional live performances.\n\nThe concert featured cutting-edge VR technology that allowed fans to interact with the performance in unprecedented ways. Viewers could choose their viewing angle, dance with other virtual attendees, and even interact with the artist during the show. The experience was so immersive that many fans reported feeling as if they were actually at the concert.\n\n"This is the future of live entertainment," said Rodriguez, who performed in a motion-capture studio while fans experienced the show through VR headsets. "We\'re not just streaming a concert - we\'re creating a completely new way to experience music."\n\nThe technology behind the concert was developed by a team of engineers and artists who spent months perfecting the virtual experience. Motion capture technology tracked Rodriguez\'s every movement, while advanced audio processing created spatial sound that made fans feel like they were in the front row.\n\n"The level of detail is incredible," said Dr. Alex Patel, a VR researcher at Stanford. "The virtual environment is so realistic that your brain actually believes you\'re there. This could revolutionize how we think about live events."\n\nThe concert also featured interactive elements that would be impossible in a traditional venue. Fans could create virtual light shows, send messages to the artist, and even influence the performance through real-time voting. The most popular song requests were performed as encores.\n\n"This level of interaction is unprecedented," said Jennifer Lee, a music industry analyst. "Fans aren\'t just watching - they\'re participating in the creation of the experience. This could change the entire dynamic between artists and audiences."\n\nThe success of the VR concert has sparked interest from other artists and entertainment companies. Major record labels are investing heavily in VR technology, while concert venues are exploring hybrid models that combine live and virtual experiences.\n\n"We\'re seeing a fundamental shift in how people consume entertainment," said David Kim, CEO of Virtual Entertainment Group. "The pandemic accelerated the adoption of virtual experiences, but this concert proves that VR can be more engaging than traditional live events."\n\nThe economic implications are significant. VR concerts can reach global audiences without the limitations of physical venues. Artists can perform for millions of fans simultaneously, while fans can attend concerts from anywhere in the world.\n\n"This democratizes access to live entertainment," said Rodriguez. "Fans in remote areas or those who can\'t afford expensive tickets can now have front-row experiences. It\'s making live music more accessible than ever."\n\nHowever, the technology also raises questions about the future of traditional live events. Some industry experts worry that VR concerts could reduce demand for physical venues, while others see them as complementary experiences.\n\n"I don\'t think VR will replace live concerts," said Kim. "But it will create new opportunities and reach new audiences. The future is likely a hybrid model where artists perform both live and virtually."\n\nThe concert also showcased the potential for other types of virtual events. Sports leagues are exploring VR broadcasts, while theater companies are experimenting with virtual performances. The technology could transform education, training, and social interaction.\n\n"This is just the beginning," said Dr. Patel. "We\'re seeing the emergence of a new medium that combines the best aspects of live and digital experiences. The possibilities are endless."\n\nFor fans, the VR concert represented a glimpse into the future of entertainment. The ability to attend concerts from home while maintaining the excitement and energy of live events could revolutionize how we experience music and other forms of entertainment.\n\n"I\'ve been to hundreds of concerts, but this was something completely different," said Sarah Thompson, a music fan who attended the VR concert. "It was like being in a dream where anything was possible. I can\'t wait to see what comes next."\n\nAs VR technology continues to improve and become more accessible, virtual concerts and events are likely to become a major part of the entertainment landscape. The success of Rodriguez\'s concert proves that audiences are ready for this new form of entertainment, and the industry is responding with increased investment and innovation.\n\nThe future of live entertainment may be virtual, but the emotions and connections it creates are very real. As technology continues to evolve, the line between physical and virtual experiences will continue to blur, creating new possibilities for artists and audiences alike.',
      url: "https://example.com/vr-concert-record",
      imageUrl: "https://picsum.photos/400/600?random=8",
      publishedAt: new Date(baseTime - 16 * 60 * 60 * 1000).toISOString(),
      source: "Entertainment Weekly",
      category: "Entertainment",
      author: "Emily Rodriguez",
      readTime: 7,
      credits: 19,
      trendingScore: 73,
      engagementScore: 78,
      tags: ["Virtual Reality", "Music", "Technology", "Entertainment"],
      relatedArticles: ["entertainment-2", "tech-1"],
    });

    return articles;
  }

  static getMockArticles(): MockArticle[] {
    return this.generateMockArticles();
  }

  static getArticlesByCategory(category: string): MockArticle[] {
    return this.generateMockArticles().filter(
      (article) => article.category.toLowerCase() === category.toLowerCase()
    );
  }

  static getTrendingArticles(): MockArticle[] {
    return this.generateMockArticles()
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);
  }

  static getHighEngagementArticles(): MockArticle[] {
    return this.generateMockArticles()
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 10);
  }

  static searchArticles(query: string): MockArticle[] {
    const articles = this.generateMockArticles();
    const searchTerm = query.toLowerCase();

    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        article.author.toLowerCase().includes(searchTerm) ||
        article.source.toLowerCase().includes(searchTerm)
    );
  }

  static getRelatedArticles(articleId: string): MockArticle[] {
    const articles = this.generateMockArticles();
    const article = articles.find((a) => a.id === articleId);

    if (!article) return [];

    return articles
      .filter(
        (a) =>
          a.id !== articleId &&
          (a.category === article.category ||
            a.tags.some((tag) => article.tags.includes(tag)) ||
            article.relatedArticles.includes(a.id))
      )
      .slice(0, 5);
  }

  static getCategories(): string[] {
    return [...this.categories];
  }

  static getSources(): string[] {
    return [...this.sources];
  }

  static getAuthors(): string[] {
    return [...this.authors];
  }

  static getPersonalizedFeed(preferences: NewsPreferences): MockArticle[] {
    const articles = this.generateMockArticles();

    // Filter by user preferences
    let filteredArticles = articles;

    if (preferences.categories.length > 0) {
      filteredArticles = filteredArticles.filter((article) =>
        preferences.categories.includes(article.category)
      );
    }

    if (preferences.sources.length > 0) {
      filteredArticles = filteredArticles.filter((article) =>
        preferences.sources.includes(article.source)
      );
    }

    // Sort by trending score and engagement
    return filteredArticles
      .sort(
        (a, b) =>
          b.trendingScore +
          b.engagementScore -
          (a.trendingScore + a.engagementScore)
      )
      .slice(0, 20);
  }

  static getDailyDigest(): MockArticle[] {
    const articles = this.generateMockArticles();
    const today = new Date();

    // Get articles from the last 24 hours
    const recentArticles = articles.filter((article) => {
      const articleDate = new Date(article.publishedAt);
      const hoursDiff =
        (today.getTime() - articleDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    });

    // Return top 5 trending articles from today
    return recentArticles
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 5);
  }
}
