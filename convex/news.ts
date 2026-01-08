import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Get all articles, sorted by published date (newest first)
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("articles")
            .withIndex("by_published")
            .order("desc")
            .collect();
    },
});

// Get featured articles for hero section
export const getFeatured = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("articles")
            .withIndex("by_featured")
            .filter((q) => q.eq(q.field("featured"), true))
            .order("desc")
            .take(4);
    },
});

// Get article by slug
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("articles")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
    },
});

// Get articles by category
export const getByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("articles")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .order("desc")
            .collect();
    },
});

// Get latest articles (non-featured) for grid
export const getLatest = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10;
        return await ctx.db
            .query("articles")
            .withIndex("by_published")
            .order("desc")
            .filter((q) => q.eq(q.field("featured"), false))
            .take(limit);
    },
});

// Get all unique categories
export const getCategories = query({
    args: {},
    handler: async (ctx) => {
        const articles = await ctx.db.query("articles").collect();
        const categories = [...new Set(articles.map((a) => a.category))];
        return categories;
    },
});

// Create a new article
export const create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        excerpt: v.string(),
        content: v.string(),
        category: v.string(),
        imageUrl: v.string(),
        author: v.string(),
        authorImage: v.optional(v.string()),
        featured: v.boolean(),
        readTime: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("articles", {
            ...args,
            publishedAt: Date.now(),
        });
        return id;
    },
});

// Seed sample data
export const seed = internalMutation({
    args: {},
    handler: async (ctx) => {
        // Check if already seeded
        const existing = await ctx.db.query("articles").first();
        if (existing) {
            return "Already seeded!";
        }

        const sampleArticles = [
            {
                title: "The Future of Artificial Intelligence: What Experts Predict for 2025",
                slug: "future-of-ai-2025",
                excerpt: "Leading researchers share their insights on how AI will transform industries, reshape work, and change our daily lives in the coming year.",
                content: `Artificial intelligence continues to evolve at a breathtaking pace, and 2025 promises to be a watershed year. From generative AI to autonomous systems, the technology landscape is being reshaped in ways that seemed like science fiction just a decade ago.

Industry experts predict several key developments:

## Enhanced Reasoning Capabilities
Next-generation AI models will demonstrate significantly improved reasoning abilities, moving beyond pattern recognition to genuine problem-solving. This will enable applications in fields like scientific research and complex decision-making.

## Multimodal Integration
The convergence of text, image, audio, and video understanding will create more intuitive and capable AI assistants. Users will interact with AI through natural conversation that seamlessly incorporates visual and audio elements.

## Personalization at Scale
AI systems will offer unprecedented levels of personalization, learning individual preferences and adapting in real-time to provide tailored experiences across applications.

The implications for businesses are profound, with early adopters already seeing productivity gains of 30-40% in certain workflows.`,
                category: "Technology",
                imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
                author: "Sarah Chen",
                authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
                featured: true,
                readTime: 8,
                publishedAt: Date.now() - 1000 * 60 * 30,
            },
            {
                title: "Global Climate Summit Reaches Historic Agreement on Carbon Emissions",
                slug: "climate-summit-agreement-2024",
                excerpt: "World leaders commit to aggressive new targets, with major polluting nations pledging unprecedented reductions by 2030.",
                content: `In a landmark moment for international climate action, representatives from 195 countries have signed the most ambitious emissions reduction agreement in history.

The accord, reached after two weeks of intense negotiations, includes:

## Key Commitments
- 60% reduction in carbon emissions by 2030
- $500 billion annual fund for developing nations
- Phase-out of coal power by 2035 in developed nations
- Mandatory carbon pricing across signatory nations

Environmental groups have cautiously welcomed the agreement while calling for robust enforcement mechanisms.`,
                category: "World",
                imageUrl: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1200",
                author: "Michael Torres",
                authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
                featured: true,
                readTime: 6,
                publishedAt: Date.now() - 1000 * 60 * 60 * 2,
            },
            {
                title: "Revolutionary Battery Technology Promises 1000-Mile Electric Vehicles",
                slug: "solid-state-battery-breakthrough",
                excerpt: "Solid-state breakthrough could eliminate range anxiety and charge in under 10 minutes, researchers say.",
                content: `A team of researchers has announced a breakthrough in solid-state battery technology that could fundamentally change the electric vehicle industry.

The new battery design offers:
- 3x the energy density of current lithium-ion batteries
- 10-minute charging to 80% capacity
- 20-year lifespan with minimal degradation
- Lower production costs than current technology

Major automakers are already in discussions to license the technology, with mass production expected by 2027.`,
                category: "Technology",
                imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200",
                author: "Emily Watson",
                authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
                featured: true,
                readTime: 5,
                publishedAt: Date.now() - 1000 * 60 * 60 * 5,
            },
            {
                title: "Major Stock Market Rally: Tech Giants Lead Unprecedented Surge",
                slug: "stock-market-rally-tech",
                excerpt: "Wall Street sees biggest single-day gains in a decade as investor confidence soars on strong earnings reports.",
                content: `U.S. stock markets closed at record highs today as technology companies reported earnings that exceeded even the most optimistic Wall Street expectations.

Key highlights:
- Dow Jones up 3.2%
- S&P 500 up 4.1%
- Nasdaq up 5.7%

Analysts attribute the surge to a combination of strong consumer spending, cooling inflation, and breakthrough product announcements from major tech firms.`,
                category: "Business",
                imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200",
                author: "David Park",
                authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
                featured: false,
                readTime: 4,
                publishedAt: Date.now() - 1000 * 60 * 60 * 8,
            },
            {
                title: "SpaceX Successfully Launches First Commercial Space Station Module",
                slug: "spacex-commercial-station",
                excerpt: "Private space exploration reaches new milestone as the Axiom habitat begins its journey to orbit.",
                content: `SpaceX has achieved another historic first, successfully launching the primary module of what will become the world's first fully commercial space station.

The Axiom Habitat module will serve as:
- A private research facility
- Space tourism destination
- Manufacturing hub for zero-gravity products
- Training center for future Mars missions

The station is expected to be fully operational by 2028, ushering in a new era of commercial space activity.`,
                category: "Science",
                imageUrl: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200",
                author: "James Mitchell",
                authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
                featured: false,
                readTime: 5,
                publishedAt: Date.now() - 1000 * 60 * 60 * 12,
            },
            {
                title: "Championship Final: Underdogs Stun Favorites in Historic Victory",
                slug: "championship-final-upset",
                excerpt: "In one of the greatest upsets in sports history, the underdog team claims the title in a thrilling finale.",
                content: `Sports fans witnessed history last night as the underdog team overcame 20-1 odds to claim the championship title in what many are calling the greatest final ever played.

The match featured:
- Three lead changes in the final quarter
- A game-winning play with just 5 seconds remaining
- Record television viewership of 180 million
- Post-game celebrations that lasted until dawn

"We believed in ourselves when no one else did," said the team captain in an emotional post-game interview.`,
                category: "Sports",
                imageUrl: "/images/sports-victory.png",
                author: "Lisa Rodriguez",
                authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
                featured: false,
                readTime: 4,
                publishedAt: Date.now() - 1000 * 60 * 60 * 18,
            },
            {
                title: "New Study Reveals Surprising Health Benefits of Mediterranean Diet",
                slug: "mediterranean-diet-study",
                excerpt: "Comprehensive research shows significant improvements in heart health, cognitive function, and longevity.",
                content: `A landmark 20-year study has confirmed what many health experts long suspected: the Mediterranean diet offers profound health benefits that extend far beyond weight management.

Key findings include:
- 35% reduction in heart disease risk
- 28% improvement in cognitive function in older adults
- Significant reduction in inflammation markers
- Increased average lifespan of 5-7 years

Researchers recommend incorporating olive oil, fish, vegetables, and whole grains into daily meals for optimal results.`,
                category: "Health",
                imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200",
                author: "Dr. Anna Schmidt",
                authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100",
                featured: false,
                readTime: 6,
                publishedAt: Date.now() - 1000 * 60 * 60 * 24,
            },
            {
                title: "Award-Winning Director Announces Ambitious New Trilogy",
                slug: "director-new-trilogy",
                excerpt: "The acclaimed filmmaker reveals plans for an epic science fiction saga set to begin production next year.",
                content: `In a surprise announcement at the annual film festival, the renowned director unveiled plans for an ambitious new science fiction trilogy that aims to redefine the genre.

Details revealed:
- Combined budget of $600 million
- All-star cast featuring Oscar winners
- Groundbreaking visual effects technology
- Filming across six continents

"This is the story I've wanted to tell my entire career," the director said. "It explores what it means to be human in an age of technological transcendence."`,
                category: "Entertainment",
                imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200",
                author: "Chris Bailey",
                authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
                featured: false,
                readTime: 4,
                publishedAt: Date.now() - 1000 * 60 * 60 * 30,
            },
            {
                title: "Central Bank Announces Major Interest Rate Decision",
                slug: "central-bank-rate-decision",
                excerpt: "Markets react as policymakers signal potential shift in monetary policy direction for the coming year.",
                content: `The Federal Reserve has announced a pivotal interest rate decision that could shape economic conditions for the foreseeable future.

Key announcements:
- Rates held steady at current levels
- Forward guidance suggests potential cuts in Q2
- Inflation projections revised downward
- Employment outlook remains positive

Economists are divided on the implications, with some predicting a soft landing while others remain cautious about underlying economic pressures.`,
                category: "Business",
                imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200",
                author: "Robert Kim",
                authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
                featured: false,
                readTime: 5,
                publishedAt: Date.now() - 1000 * 60 * 60 * 36,
            },
            {
                title: "Ancient City Discovered: Archaeologists Unearth 4000-Year-Old Metropolis",
                slug: "ancient-city-discovery",
                excerpt: "Groundbreaking excavation reveals sophisticated urban center that rewrites historical understanding of the region.",
                content: `Archaeologists have made what experts are calling one of the most significant discoveries of the century: a massive ancient city that predates known civilizations in the region by nearly a millennium.

The site includes:
- Complex water management systems
- Multi-story residential buildings
- Evidence of advanced metallurgy
- Written records in an unknown script

"This discovery fundamentally changes our understanding of early urban development," said the lead archaeologist.`,
                category: "Science",
                imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=1200",
                author: "Dr. Maya Patel",
                authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
                featured: true,
                readTime: 7,
                publishedAt: Date.now() - 1000 * 60 * 60 * 40,
            },
        ];

        for (const article of sampleArticles) {
            await ctx.db.insert("articles", article);
        }

        return "Seeded " + sampleArticles.length + " articles!";
    },
});

export const fixSportsImage = internalMutation({
  handler: async (ctx) => {
    const article = await ctx.db
      .query("articles")
      .filter((q) => q.eq(q.field("slug"), "championship-final-upset"))
      .unique();
    if (article) {
      await ctx.db.patch(article._id, {
        imageUrl: "/images/sports-victory.png"
      });
      return "Fixed sports image!";
    }
    return "Article not found.";
  },
});
