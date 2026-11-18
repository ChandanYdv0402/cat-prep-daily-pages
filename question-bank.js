"use strict";

(() => {
  function choice(topic, prompt, options, correct, solution) {
    return { topic, prompt, options, correct, answer: String.fromCharCode(65 + correct) + ". " + options[correct], solution };
  }

  function typed(topic, prompt, correct, solution) {
    return { topic, prompt, correct, answer: correct, solution };
  }

  function group(section, minutes, questions, context) {
    return { section, minutes, questions, ...context };
  }

  function day(number, focus, qa, dilr, varc) {
    return {
      id: "cat-2026-day-" + number,
      focus,
      groups: [group("QA", 12, qa), group("DILR", 15, dilr.questions, dilr.context), group("VARC", 5, varc)],
    };
  }

  const sets = [
    day(1, "Percentages, speed and ratios", [
      choice("Percentages", "The price of rice rises by 25%. By what percentage must a family cut its consumption to keep its spending on rice unchanged?",
        ["15%", "20%", "25%", "30%"], 1,
        "A 25% price increase multiplies the price by 1.25. To keep spending the same, consumption must become 1 ÷ 1.25 = 0.8 of its original level, a cut of 20%."),
      choice("Profit and loss", "A shopkeeper marks a bag 50% above cost and gives two successive discounts of 20% and 10%. What is the profit percentage?",
        ["4%", "6%", "8%", "12%"], 2,
        "For a cost of ₹100, the marked price is ₹150. The selling price is ₹150 × 0.8 × 0.9 = ₹108. The profit is ₹8 on ₹100, or 8%."),
      typed("Time, speed and distance", "A 180-metre train travelling at 54 km/h crosses a platform in 24 seconds. Find the platform's length in metres. Enter the number only.",
        "180", "The speed is 54 × 5/18 = 15 m/s. The train covers 15 × 24 = 360 m while crossing. This is the combined length of the train and platform, so the platform is 360 − 180 = 180 m long."),
      choice("Time, speed and distance", "A cyclist covers the first half of a trip at 24 km/h and the second half at 16 km/h. What is the average speed for the entire trip?",
        ["18 km/h", "19.2 km/h", "20 km/h", "21 km/h"], 1,
        "Take each half to be 48 km. The two halves take 2 and 3 hours, so the average speed is 96 ÷ 5 = 19.2 km/h."),
      typed("Ratio and averages", "Two classes have sizes in the ratio 3:2. Their average scores are 72 and 84, respectively. What is their combined average score?",
        "76.8", "Use the class sizes as weights. The combined average is (3 × 72 + 2 × 84) ÷ 5 = 384 ÷ 5 = 76.8."),
    ], {
      context: { title: "Weekend ticket sales", context: "A science museum sold adult and child tickets over a three-day weekend. Each adult ticket cost ₹200 and each child ticket cost ₹120.", table: {
        headers: ["Day", "Adult tickets", "Child tickets"],
        rows: [["Friday", 80, 50], ["Saturday", 120, 90], ["Sunday", 100, 110]],
      } },
      questions: [
        choice("Table interpretation", "On which day was ticket revenue highest?",
          ["Friday", "Saturday", "Sunday", "Saturday and Sunday tied"], 1,
          "Friday earned 80 × 200 + 50 × 120 = ₹22,000. Saturday earned ₹34,800 and Sunday ₹33,200. Saturday had the highest revenue."),
        typed("Table interpretation", "What percentage of all tickets sold were child tickets? Round to one decimal place and enter the number only.",
          "45.5", "There were 50 + 90 + 110 = 250 child tickets and 80 + 120 + 100 = 300 adult tickets. The child share was 250 ÷ 550 × 100 = 45.4545…%, rounded to 45.5%."),
        choice("Table interpretation", "What was the increase in revenue from Friday to Sunday?",
          ["₹8,800", "₹9,200", "₹10,400", "₹11,200"], 3,
          "Sunday had 20 more adult tickets and 60 more child tickets than Friday. The extra revenue was 20 × ₹200 + 60 × ₹120 = ₹11,200."),
      ],
    }, [
      typed("Para-jumble", "Arrange the four sentences into a coherent paragraph. Enter the four digits in order.\n\n1. The same markings helped visitors locate the rooms without asking for directions.\n2. The new library had identical doorways on every floor.\n3. To distinguish them, the architect painted a different symbol above each door.\n4. Thus a choice made for staff also made the building easier for visitors to navigate.",
        "2314", "Sentence 2 establishes the problem. Sentence 3 introduces the symbols that solve it. Sentence 1 refers back to those markings and adds their benefit to visitors. Sentence 4 draws the conclusion."),
      typed("Odd sentence out", "Four sentences form a coherent paragraph. Enter the number of the sentence that does not belong.\n\n1. Urban trees cool streets by shading surfaces.\n2. They also release water vapour through their leaves.\n3. This process can lower the temperature of the surrounding air.\n4. Many seed banks store specimens in sealed containers at low temperatures.\n5. A street with mature trees can therefore feel cooler than a nearby street without them.",
        "4", "Sentences 1, 2, 3 and 5 explain how trees cool streets through shade and water vapour. Sentence 4 shifts to how seeds are preserved."),
    ]),

    day(2, "Work rates, mixtures and number systems", [
      choice("Time and work", "Meera can finish a task in 12 hours and Kabir in 18 hours. What fraction of the task do they finish together in 6 hours?",
        ["1/2", "2/3", "3/4", "5/6"], 3,
        "In six hours, Meera does 6/12 = 1/2 of the task and Kabir does 6/18 = 1/3. Together they finish 1/2 + 1/3 = 5/6."),
      typed("Pipes and cisterns", "A tap fills a tank in 8 hours. An outlet can empty the full tank in 24 hours. Starting with an empty tank and opening both, how many hours will it take to fill? Enter the number only.",
        "12", "The net rate is 1/8 − 1/24 = 2/24 = 1/12 of the tank per hour. Filling therefore takes 12 hours."),
      choice("Mixtures", "How many litres of a 50% salt solution must be added to 12 litres of a 20% solution to make a 30% solution?",
        ["4 L", "5 L", "6 L", "8 L"], 2,
        "Let x be the added volume. The salt balance is 0.20 × 12 + 0.50x = 0.30(12 + x). Thus 0.20x = 1.2, giving x = 6 litres."),
      typed("Remainders", "What is the remainder when 7²³ is divided by 10?",
        "3", "The units digits of the powers of 7 repeat in a cycle of four: 7, 9, 3, 1. Since 23 leaves remainder 3 upon division by 4, the units digit is the third one, 3."),
      choice("Factors", "How many positive divisors does 360 have?",
        ["18", "20", "24", "30"], 2,
        "Factorise 360 = 2³ × 3² × 5. A divisor can choose 4 exponents for 2, 3 for 3, and 2 for 5. There are 4 × 3 × 2 = 24 choices."),
    ], {
      context: { title: "Five talks in a row", context: "A club schedules one talk per slot across five consecutive slots, numbered 1 to 5. The speakers are Asha, Bina, Dev, Imran and Riya.\n\n• Dev speaks immediately after Bina.\n• Exactly one talk separates Asha and Riya, and Asha speaks earlier.\n• Imran speaks in slot 3 or slot 4." },
      questions: [
        choice("Linear arrangement", "Who must speak in slot 3?", ["Asha", "Bina", "Dev", "Riya"], 0,
          "Asha and Riya can occupy (1,3), (2,4), or (3,5). For (2,4), no adjacent slots remain for Bina and Dev. For (3,5), Bina and Dev take 1 and 2 and Imran takes 4. For (1,3), Imran would have to take 2 while Bina and Dev take 4 and 5, which is forbidden. Therefore the feasible pair is (3,5), and Asha is in slot 3."),
        typed("Linear arrangement", "How many speakers are scheduled between Bina and Imran?",
          "2", "The valid order is Bina, Dev, Asha, Imran, Riya. Dev and Asha are between Bina and Imran."),
        choice("Linear arrangement", "Whose talk immediately precedes Riya's?", ["Asha", "Bina", "Dev", "Imran"], 3,
          "In the only valid order, Bina and Dev take slots 1 and 2, Asha and Riya take slots 3 and 5, and Imran fills slot 4."),
      ],
    }, [
      choice("Para summary", "Digital reminders are useful when they prompt actions a person already wants to take. Trouble starts when every app sends reminders for its own goals. Each notification makes a small claim on attention. Taken together, these claims can make it harder to focus on the actions that matter.\n\nWhich option best summarises the paragraph?",
        ["Reminders are effective only when they are delivered by a single app.", "Reminders can help with chosen goals, but competing notifications collectively strain attention.", "People should reject all notifications that are intended to benefit an app.", "Digital reminders are distractions because users rarely know what they want to do."], 1,
        "The passage acknowledges the benefit of reminders aligned with a user's goals and explains the cumulative attention cost of competing alerts. The other options add stronger restrictions or claims."),
      typed("Para-jumble", "Arrange the four sentences into a coherent paragraph. Enter the four digits in order.\n\n1. That delay gave the sediment time to settle.\n2. The village once drew drinking water from a stream that turned muddy after every storm.\n3. The water drawn from those tanks was therefore clearer.\n4. It later built holding tanks that stored the stream water overnight.",
        "2413", "Sentence 2 introduces the village's problem. Sentence 4 gives its response. Sentence 1 explains what the overnight delay accomplishes. Sentence 3 describes the resulting improvement."),
    ]),

    day(3, "Equations, inequalities and logarithms", [
      typed("Quadratic equations", "The two roots of x² − 11x + 24 = 0 are positive integers. Find the larger root.",
        "8", "The numbers 3 and 8 add to 11 and multiply to 24. The expression factors as (x − 3)(x − 8), so the larger root is 8."),
      choice("Linear equations", "Two notebooks and three pens cost ₹102. Three notebooks and two pens cost ₹118. What is the price of one notebook?",
        ["₹24", "₹26", "₹28", "₹30"], 3,
        "Let n and p denote the prices. From 2n + 3p = 102 and 3n + 2p = 118, multiply by 2 and 3 respectively. Subtract 4n + 6p = 204 from 9n + 6p = 354 to get 5n = 150, giving n = 30."),
      typed("Absolute value", "How many integers x satisfy |2x − 3| < 7?",
        "6", "The inequality gives −7 < 2x − 3 < 7, so −2 < x < 5. The six integer solutions are −1, 0, 1, 2, 3 and 4."),
      choice("Logarithms", "What is log₂(32) + log₃(27)?", ["6", "7", "8", "9"], 2,
        "Since 2⁵ = 32 and 3³ = 27, the logarithms are 5 and 3. Their sum is 8."),
      choice("Surds and indices", "If a = √12 + √3, what is a²?", ["15", "21", "24", "27"], 3,
        "Since √12 = 2√3, a = 3√3. Squaring gives a² = 9 × 3 = 27."),
    ], {
      context: { title: "Three campus clubs", context: "Of 100 students, 45 joined Art, 40 joined Music and 30 joined Theatre. Seventeen joined both Art and Music, 12 joined both Art and Theatre, and 10 joined both Music and Theatre. Five joined all three. Each pairwise count includes the students who joined all three." },
      questions: [
        typed("Venn diagrams", "How many students joined none of the three clubs?",
          "19", "By inclusion–exclusion, the number in at least one club is 45 + 40 + 30 − 17 − 12 − 10 + 5 = 81. The remaining 100 − 81 = 19 joined none."),
        choice("Venn diagrams", "How many joined exactly two of the clubs?", ["19", "24", "29", "39"], 1,
          "Remove the five students in all three from each pairwise count. The exactly-two count is (17 − 5) + (12 − 5) + (10 − 5) = 24."),
        typed("Venn diagrams", "How many joined Art and neither of the other clubs?",
          "21", "Start with the 45 Art members. Subtract the 17 also in Music and the 12 also in Theatre, then add back the five subtracted twice. This gives 45 − 17 − 12 + 5 = 21."),
      ],
    }, [
      typed("Odd sentence out", "Four sentences form a coherent paragraph. Enter the number of the sentence that does not belong.\n\n1. Repair cafés invite people to bring in broken household objects.\n2. Volunteers explain how to diagnose and fix common faults.\n3. This helps visitors gain skills they can use long after the session.\n4. Museums sometimes acquire complete sets of domestic tools for display.\n5. Keeping those skills in circulation can also reduce the number of items discarded.",
        "4", "Sentences 1, 2, 3 and 5 discuss repair cafés and the benefits of shared repair skills. Sentence 4 shifts to collecting tools in museums."),
      choice("Para summary", "Maps simplify a landscape to make it legible. The features a map emphasises depend on what its maker expects the reader to do. A rail map makes transfers easy to see, while a walking map may emphasise gradients and footpaths. The two maps can depict the same place accurately and still look very different.\n\nWhich option best summarises the paragraph?",
        ["Only maps that show all available details can be considered accurate.", "Different maps of the same place can be accurate because they select details to suit different tasks.", "Transport maps are generally less accurate than maps intended for walking.", "Maps differ mainly because readers interpret the same visual symbols differently."], 1,
        "The examples support the claim that selection serves a map's purpose. Both maps can be accurate even though each emphasises different features."),
    ]),
    day(4, "Geometry, counting and probability", [
      choice("Similar triangles", "In triangle ABC, points D and E lie on AB and AC, respectively. DE is parallel to BC and AD:DB = 2:3. If triangle ABC has area 100 cm², what is the area of triangle ADE?",
        ["16 cm²", "20 cm²", "25 cm²", "40 cm²"], 0,
        "The two triangles are similar and AD/AB = 2/5. Areas scale as the square of the side ratio, so triangle ADE has area 100 × (2/5)² = 16 cm²."),
      typed("Tangents", "A circle has centre O and radius 5 cm. A tangent from P touches the circle at T. If OP = 13 cm, find PT in centimetres. Enter the number only.",
        "12", "A radius is perpendicular to the tangent at the point of contact. Right triangle OTP gives PT = √(13² − 5²) = √144 = 12 cm."),
      choice("Mensuration", "A cylindrical tank of radius 3 metres contains water to a depth of 2 metres. What volume of water does it contain?",
        ["6π m³", "12π m³", "18π m³", "36π m³"], 2,
        "Multiply the circular base area by the depth. The volume is π × 3² × 2 = 18π m³."),
      typed("Combinations", "From a team of six people, how many three-person committees include at least one of two designated team members?",
        "16", "There are 6 choose 3 = 20 committees. Of these, 4 choose 3 = 4 contain neither designated member. Subtract to get 16."),
      choice("Probability", "A bag contains four red and three blue balls. Two are drawn uniformly at random without replacement. What is the probability of drawing exactly one red ball?",
        ["2/7", "3/7", "4/7", "5/7"], 2,
        "The number of unordered pairs with one of each colour is 4 × 3 = 12. There are 7 choose 2 = 21 total pairs, giving 12/21 = 4/7."),
    ], {
      context: { title: "Four-team football league", context: "Each pair of teams played once. A win earns 3 points, a draw earns 1 and a loss earns 0. Teams on equal points are ordered by goal difference, which is goals scored minus goals conceded.", table: {
        headers: ["First team", "Second team", "Score (first–second)"],
        rows: [["A", "B", "2–1"], ["A", "C", "0–0"], ["A", "D", "1–3"], ["B", "C", "1–0"], ["B", "D", "2–2"], ["C", "D", "2–1"]],
      } },
      questions: [
        typed("Tournament table", "How many points did Team B earn?",
          "4", "Team B lost to A, beat C and drew with D. It earned 0 + 3 + 1 = 4 points."),
        choice("Tournament table", "Which team finished first?", ["A", "B", "C", "D"], 3,
          "Each team earned 4 points. The goal differences for A, B, C and D were −1, 0, 0 and +1, respectively. D therefore finished first."),
        typed("Tournament table", "How many matches ended in a draw?",
          "2", "A versus C ended 0–0 and B versus D ended 2–2. The other four matches had a winner."),
      ],
    }, [
      typed("Para-jumble", "Arrange the four sentences into a coherent paragraph. Enter the four digits in order.\n\n1. Because the old bridge shook during storms, the village commissioned a replacement.\n2. This discovery led them to move the new bridge upstream.\n3. Engineers surveying the site found that the riverbank was eroding beneath one of the supports.\n4. The upstream site had firmer ground for the foundations.",
        "1324", "Sentence 1 introduces the commission. Sentence 3 presents the engineers' discovery, which sentence 2 uses to explain the move. Sentence 4 describes the advantage of the new site."),
      typed("Odd sentence out", "Four sentences form a coherent paragraph. Enter the number of the sentence that does not belong.\n\n1. A season's theatre programme may include both new plays and revivals.\n2. Placing an unfamiliar play next to a popular revival can encourage audiences to try it.\n3. Some theatres use folding seats to make their front rows easy to reconfigure.\n4. An audience drawn in by familiar titles can gradually become more open to unfamiliar work.\n5. In this way, programming choices can shape audience habits over time.",
        "3", "Sentences 1, 2, 4 and 5 examine how programming familiar and unfamiliar work shapes audience habits. Sentence 3 shifts to seating design."),
    ]),

    day(5, "Mixed arithmetic", [
      choice("Profit and loss", "An item sells for ₹720 at a loss of 10%. For how much should it sell to earn a 15% profit?",
        ["₹880", "₹900", "₹920", "₹960"], 2,
        "₹720 is 90% of the cost price, so the cost price is ₹800. At a 15% profit, the selling price is ₹800 × 1.15 = ₹920."),
      typed("Relative speed", "Two runners starting 500 metres apart run directly towards each other at 4 m/s and 6 m/s. After how many seconds do they meet?",
        "50", "The distance between them shrinks at 4 + 6 = 10 m/s. They meet after 500 ÷ 10 = 50 seconds."),
      choice("Time and work", "A can finish a job in 15 days and B in 10 days. A works alone for 3 days. How many more days do they need if they work together from then on?",
        ["4 days", "4.5 days", "4.8 days", "5 days"], 2,
        "A completes 3/15 = 1/5, leaving 4/5. Together they complete 1/15 + 1/10 = 1/6 per day, so they need (4/5) ÷ (1/6) = 4.8 days."),
      typed("Averages", "The mean of eight numbers is 18. If one number, 25, is removed, what is the mean of the remaining numbers?",
        "17", "The original sum is 8 × 18 = 144. The remaining sum is 144 − 25 = 119, so the new mean is 119 ÷ 7 = 17."),
      choice("Compound interest", "A deposit of ₹5,000 earns interest at 10% per year, compounded annually. How much interest does it earn in two years?",
        ["₹1,000", "₹1,050", "₹1,100", "₹1,150"], 1,
        "After two years, the amount is ₹5,000 × 1.1² = ₹6,050. Subtract the principal to get ₹1,050 of interest."),
    ], {
      context: { title: "Meal delivery orders", context: "A canteen counted lunch orders by pickup and delivery during four weeks. Each order was counted once.", table: {
        headers: ["Week", "Pickup", "Delivery"],
        rows: [[1, 240, 160], [2, 225, 175], [3, 210, 190], [4, 180, 220]],
      } },
      questions: [
        choice("Table interpretation", "From week 1 to week 4, by what percentage did delivery orders rise?",
          ["15%", "25%", "30%", "37.5%"], 3,
          "Deliveries rose by 220 − 160 = 60. The percentage increase is 60 ÷ 160 × 100 = 37.5%."),
        typed("Table interpretation", "What was the average number of pickup orders per week?",
          "213.75", "The total was 240 + 225 + 210 + 180 = 855. Dividing by 4 gives 213.75 orders per week."),
        choice("Table interpretation", "What fraction of all orders across the four weeks were deliveries?",
          ["149/320", "17/40", "11/20", "171/320"], 0,
          "There were 160 + 175 + 190 + 220 = 745 delivery orders. Each week had 400 orders, giving 1,600 overall. The fraction reduces from 745/1,600 to 149/320."),
      ],
    }, [
      choice("Para summary", "When researchers publish a failed experiment, they give other teams a reason to reconsider their own plans. A failure may show that an attractive method breaks under certain conditions or that an assumption is unsafe. If only successes are recorded, teams may spend years rediscovering the same limits.\n\nWhich option best summarises the paragraph?",
        ["Publishing failed experiments reveals limits and helps other teams avoid repeating unproductive work.", "Most experiments fail because researchers rely on methods that have already been disproved.", "Failures should be published only after researchers identify precisely why the method failed.", "Teams should stop developing any method that has failed under experimental conditions."], 0,
        "The passage makes two linked claims: failures teach researchers about limits and sharing those failures can save others from repeating the work. Option A includes both."),
      typed("Para-jumble", "Arrange the four sentences into a coherent paragraph. Enter the four digits in order.\n\n1. Once those routes became predictable, more residents could plan journeys around them.\n2. The town first ran its minibuses wherever request calls happened to come from.\n3. It later clustered common destinations into fixed routes with regular stops.\n4. That convenience made the service useful for daily commutes.",
        "2314", "The original system in sentence 2 precedes the switch in sentence 3. Sentence 1 explains the advantage of the fixed routes. Sentence 4 states how residents used that advantage."),
    ]),

    day(6, "Algebra, functions and progressions", [
      choice("Quadratic equations", "If the roots of x² − 7x + 10 = 0 are r and s, find r² + s².",
        ["19", "25", "29", "39"], 2,
        "By the coefficients, r + s = 7 and rs = 10. Then r² + s² = (r + s)² − 2rs = 49 − 20 = 29."),
      typed("Inequalities", "How many positive integers x satisfy 2x + 3 ≤ 17?",
        "7", "Subtract 3 and divide by 2 to get x ≤ 7. The positive integers from 1 through 7 are the seven solutions."),
      choice("Functions", "Let f(x) = 2x − 1 and g(x) = x². What is g(f(3)) − f(g(3))?",
        ["6", "8", "10", "12"], 1,
        "Since f(3) = 5, g(f(3)) = 25. Since g(3) = 9, f(g(3)) = 17. Their difference is 8."),
      typed("Arithmetic progressions", "The 4th term of an arithmetic progression is 15 and the 9th term is 35. What is its 12th term?",
        "47", "Five term-to-term steps account for the increase of 20, so the common difference is 4. Three more steps after the 9th term give 35 + 3 × 4 = 47."),
      choice("Logarithms", "For positive x, log₂(x) + log₂(x − 2) = 3 whenever both logarithms are defined. What is x?",
        ["3", "4", "5", "6"], 1,
        "The domain is x > 2. Combining the logarithms gives x(x − 2) = 8, or (x − 4)(x + 2) = 0. Only 4 is in the domain."),
    ], {
      context: { title: "Workshop assignments", context: "Anu, Farah, Kiran and Noor each teach a different workshop: Clay, Dance, Film or Music. Each teaches on a different weekday from Monday through Thursday.\n\n• The Clay workshop is on Tuesday, immediately after Anu's workshop.\n• Farah teaches Film.\n• Kiran and Noor both teach before Farah. Noor teaches immediately before her.\n• Noor does not teach Dance." },
      questions: [
        choice("Matching", "Who teaches the Clay workshop?", ["Anu", "Farah", "Kiran", "Noor"], 2,
          "Anu is on Monday. Both Kiran and Noor teach before Farah, so Farah must take Thursday. Noor is immediately before her on Wednesday. Kiran fills Tuesday and teaches Clay."),
        choice("Matching", "On which day does Anu teach?", ["Monday", "Tuesday", "Wednesday", "Thursday"], 0,
          "Clay is on Tuesday immediately after Anu's workshop, placing Anu on Monday."),
        choice("Matching", "Who teaches Music?", ["Anu", "Kiran", "Farah", "Noor"], 3,
          "Kiran teaches Clay and Farah teaches Film. Anu and Noor must teach Dance and Music. Since Noor does not teach Dance, Noor teaches Music."),
      ],
    }, [
      typed("Odd sentence out", "Four sentences form a coherent paragraph. Enter the number of the sentence that does not belong.\n\n1. Volunteer weather observers can extend a city's monitoring network.\n2. Standard instructions help them position instruments in comparable locations.\n3. The city museum recently expanded its children's exhibition on clouds.\n4. Comparable placement makes it easier to interpret differences across neighbourhoods.\n5. A consistent protocol therefore lets the wider monitoring network yield useful measurements.",
        "3", "The coherent paragraph is about comparable weather measurements collected by volunteers. Sentence 3 describes an exhibition unrelated to the monitoring protocol."),
      typed("Para-jumble", "Arrange the four sentences into a coherent paragraph. Enter the four digits in order.\n\n1. The recorded calls revealed that one bird species arrived weeks earlier than its closest relative.\n2. The team installed microphones in the same forest clearing every spring.\n3. That difference would have been hard to detect during occasional field visits.\n4. The microphones captured dawn calls on days when nobody could visit the site.",
        "2413", "Sentence 2 introduces the microphones. Sentence 4 describes what they captured. Sentence 1 gives a finding from the recordings, whose importance sentence 3 explains."),
    ]),
    day(7, "Number systems, geometry and counting", [
      choice("Remainders", "What is the least positive integer that leaves remainder 2 when divided by 5 and remainder 3 when divided by 7?",
        ["12", "17", "22", "27"], 1,
        "The positive candidates that leave remainder 2 on division by 5 start 2, 7, 12, 17. Their remainders on division by 7 are 2, 0, 5 and 3. So 17 is the least."),
      typed("Factors", "How many positive divisors of 72 are odd?",
        "3", "Since 72 = 2³ × 3², an odd divisor contains no factor of 2. The exponent of 3 may be 0, 1 or 2, giving 1, 3 and 9."),
      choice("Triangles", "A triangle has side lengths 13 cm, 14 cm and 15 cm. What is its area?",
        ["70 cm²", "78 cm²", "84 cm²", "91 cm²"], 2,
        "The semiperimeter is (13 + 14 + 15)/2 = 21. Heron's formula gives √(21 × 8 × 7 × 6) = √7056 = 84 cm²."),
      typed("Coordinate geometry", "Find the square of the distance between the points (−2, 1) and (4, 9).",
        "100", "The horizontal and vertical differences are 6 and 8. The square of their distance is 6² + 8² = 100."),
      choice("Permutations", "How many three-digit even numbers can be formed from the digits 1, 2, 3 and 4 if repetition is forbidden?",
        ["6", "8", "12", "16"], 2,
        "The units digit has two choices, 2 or 4. After choosing it, there are three choices for the hundreds digit and two for the tens digit. The total is 2 × 3 × 2 = 12."),
    ], {
      context: { title: "Language electives", context: "There are 72 students in a cohort. Thirty-six take French and 32 take Spanish. Fourteen take both languages. The rest take neither." },
      questions: [
        typed("Venn diagrams", "How many students take exactly one of the two languages?",
          "40", "There are 36 − 14 = 22 taking only French and 32 − 14 = 18 taking only Spanish. The exactly-one total is 40."),
        choice("Venn diagrams", "How many students take neither language?", ["4", "14", "18", "22"], 2,
          "The number taking at least one is 36 + 32 − 14 = 54. Subtract this from 72 to get 18."),
        choice("Venn diagrams", "What fraction of the students who take at least one language take both?",
          ["7/36", "7/27", "7/18", "9/14"], 1,
          "There are 54 students taking at least one language, including 14 who take both. The requested fraction is 14/54 = 7/27."),
      ],
    }, [
      choice("Para summary", "Public benches give people a reason to pause in spaces they would otherwise pass through. Where benches are placed affects who can use them. A bench in the shade beside a shop may work for someone who needs rest, while an identical bench by a busy crossing may feel uncomfortable. The success of the furniture depends partly on its surroundings.\n\nWhich option best summarises the paragraph?",
        ["Benches placed near shops mainly benefit the shops' regular customers.", "The surroundings of a public bench affect who can use it and how well it serves as a place to rest.", "Providing more benches is the single most effective way to improve public space.", "Public benches should always be shaded, even if this makes them hard to reach."], 1,
        "The passage argues that benches encourage people to pause and that location determines how useful they are to different people. The other options introduce claims beyond that point."),
      typed("Odd sentence out", "Four sentences form a coherent paragraph. Enter the number of the sentence that does not belong.\n\n1. Wetlands can slow the flow of water after heavy rain.\n2. Their vegetation and shallow channels hold water temporarily.\n3. Several ancient languages used separate words for rivers and streams.\n4. This temporary storage can reduce peak flows farther downstream.\n5. Restoring wetlands can therefore help manage flooding.",
        "3", "Sentences 1, 2, 4 and 5 form a chain explaining how wetland storage reduces flooding. Sentence 3 shifts to vocabulary."),
    ]),

    day(8, "Arithmetic repeaters", [
      choice("Percentages", "A town's population rises by 10% one year and falls by 10% the next. What is the overall change?",
        ["Falls by 1%", "No change", "Rises by 1%", "Falls by 2%"], 0,
        "The final population is 1.10 × 0.90 = 0.99 of the original. This is a 1% decrease."),
      typed("Boats and streams", "A boat travels 30 km downstream in 2 hours and the same distance upstream in 3 hours. What is the speed of the current in km/h? Enter the number only.",
        "2.5", "The downstream speed is 15 km/h and the upstream speed is 10 km/h. The current is half the difference, or (15 − 10)/2 = 2.5 km/h."),
      choice("Work rates", "Six workers can paint a hall in 15 hours. At the same rate per worker, how many workers would be needed to finish it in 10 hours?",
        ["7", "8", "9", "10"], 2,
        "The job requires 6 × 15 = 90 worker-hours. Completing it in 10 hours requires 90 ÷ 10 = 9 workers."),
      typed("Ratios", "Three people share ₹840 in the ratio 2:3:7. How many rupees does the person with the largest share receive? Enter the number only.",
        "490", "There are 2 + 3 + 7 = 12 ratio parts, worth ₹840 ÷ 12 = ₹70 each. The largest share is 7 × ₹70 = ₹490."),
      choice("Mixtures", "A 40-litre solution contains 25% juice. How much water must be evaporated to raise the juice concentration to 40%? Assume the amount of juice stays constant.",
        ["10 L", "12 L", "15 L", "18 L"], 2,
        "There are 40 × 0.25 = 10 litres of juice. At 40% concentration the total solution volume is 10 ÷ 0.40 = 25 L, so 40 − 25 = 15 L of water must evaporate."),
    ], {
      context: { title: "Market stall sales", context: "A market stall sells apples for ₹20 each and pears for ₹30 each. The table gives units sold over four days.", table: {
        headers: ["Day", "Apples", "Pears"],
        rows: [["Monday", 30, 20], ["Tuesday", 45, 15], ["Wednesday", 20, 40], ["Thursday", 35, 25]],
      } },
      questions: [
        choice("Table interpretation", "Which day had the highest total sales revenue?", ["Monday", "Tuesday", "Wednesday", "Thursday"], 2,
          "The daily revenues are ₹1,200, ₹1,350, ₹1,600 and ₹1,450, respectively. Wednesday is highest."),
        typed("Table interpretation", "Across the four days, how many more apples than pears were sold?",
          "30", "The apple total is 30 + 45 + 20 + 35 = 130. The pear total is 20 + 15 + 40 + 25 = 100. The difference is 30."),
        choice("Table interpretation", "On which day did pears make up the smallest share of units sold?", ["Monday", "Tuesday", "Wednesday", "Thursday"], 1,
          "The pear shares are 20/50, 15/60, 40/60 and 25/60. Tuesday's share, 25%, is the smallest."),
      ],
    }, [
      typed("Para-jumble", "Arrange the four sentences into a coherent paragraph. Enter the four digits in order.\n\n1. These directions gave residents a shared way to describe a location even when its official address was unclear.\n2. Before the town numbered its streets, the clock tower was its most familiar landmark.\n3. Shopkeepers would tell newcomers to turn towards or away from the tower.\n4. The tower consequently remained a useful guide after street numbers were introduced.",
        "2314", "Sentence 2 introduces the tower as a landmark. Sentence 3 shows how people used it. Sentence 1 explains why the reference was useful. Sentence 4 follows that history into the period after numbering."),
      typed("Odd sentence out", "Four sentences form a coherent paragraph. Enter the number of the sentence that does not belong.\n\n1. A long queue can seem less frustrating when people know how quickly it is moving.\n2. A sign that gives the expected wait can make the delay easier to plan around.\n3. Glass signs are generally heavier than signs made from thin plastic.\n4. Travellers may then decide whether they have time for another errand.\n5. Useful information can therefore improve the experience even if the wait itself stays the same.",
        "3", "The coherent paragraph discusses how information about waiting makes a queue easier to manage. Sentence 3 changes the focus to sign materials."),
    ]),

    day(9, "Algebra and number systems repeaters", [
      choice("Linear equations", "The sum of two positive numbers is 46 and their difference is 12. What is the larger number?",
        ["23", "27", "29", "31"], 2,
        "Adding the sum and difference gives twice the larger number. It is (46 + 12)/2 = 29."),
      typed("Inequalities", "How many integers satisfy both x > −3 and 3x + 1 < 13?",
        "6", "The second inequality is x < 4. The integers strictly between −3 and 4 are −2, −1, 0, 1, 2 and 3, so there are six."),
      choice("Logarithms", "If log₅(x) = 2 and log₅(y) = 3, what is log₅(y/x)?",
        ["1", "2", "5", "6"], 0,
        "The logarithm of a quotient is the difference of the logarithms. Here that difference is 3 − 2 = 1."),
      typed("Remainders", "What is the remainder when 3⁵ + 3⁴ is divided by 7?",
        "2", "The sum is 243 + 81 = 324. The nearest lower multiple of 7 is 322, so the remainder is 2."),
      choice("Factors", "What is the smallest positive perfect square divisible by 18 and 24?",
        ["72", "144", "216", "288"], 1,
        "The least common multiple is 72 = 2³ × 3². A perfect square has even prime exponents, so raise the exponent of 2 from 3 to 4. The smallest such multiple is 2⁴ × 3² = 144."),
    ], {
      context: { title: "Parcel routes", context: "A depot sent small, medium and large parcels via three routes. All parcels sent on a route are shown in the table. The depot earned ₹30 per small parcel, ₹50 per medium parcel, and ₹80 per large parcel.", table: {
        headers: ["Route", "Small", "Medium", "Large"],
        rows: [["East", 40, 20, 10], ["North", 25, 25, 20], ["West", 30, 10, 15]],
      } },
      questions: [
        choice("Table caselet", "Which route generated the most revenue?", ["East", "North", "West", "East and West tied"], 1,
          "East generated ₹3,000, North ₹3,600 and West ₹2,600. North generated the most."),
        typed("Table caselet", "How many more medium parcels would West have to send to match East's revenue, assuming East's figures and all other West counts stay the same?",
          "8", "West trails East by ₹3,000 − ₹2,600 = ₹400. Each additional medium parcel earns ₹50, so West needs 400 ÷ 50 = 8."),
        choice("Table caselet", "Which route had the highest share of large parcels among the parcels it sent?",
          ["East", "North", "West", "North and West tied"], 1,
          "The large-parcel shares are 10/70 for East, 20/70 for North and 15/55 for West. North's share, 2/7, exceeds West's 3/11 since 22 > 21 after cross multiplication."),
      ],
    }, [
      choice("Para summary", "Cooks often describe recipes as precise instructions, yet many familiar dishes require judgement. Two tomatoes of the same size can release different amounts of water. The cook must notice the texture of the sauce and decide when to stop reducing it. A good recipe can make such decisions easier by describing what to look for.\n\nWhich option best summarises the paragraph?",
        ["Successful recipes replace kitchen judgement with exact measurements.", "Ingredient differences make judgement necessary, and recipes can help by giving cues for decisions.", "Recipes that use fresh tomatoes should avoid mentioning cooking times.", "Judgement is useful mainly when experienced cooks deviate from established recipes."], 1,
        "The passage uses variation in tomatoes to explain why instructions need to support judgement. Option B captures both that cause and the value of observable cues."),
      typed("Para-jumble", "Arrange the four sentences into a coherent paragraph. Enter the four digits in order.\n\n1. Armed with those observations, the caretakers could tell which changes required maintenance.\n2. The caretakers first walked the trail together and agreed on where to place numbered markers.\n3. On later walks they photographed the same spots and filed the images by marker.\n4. Comparing these photographs revealed small shifts that had gone unnoticed from year to year.",
        "2341", "Sentence 2 establishes the markers. Sentence 3 uses them to organise photographs. Sentence 4 explains the comparison enabled by the record. Sentence 1 states how that comparison helped maintenance."),
    ]),
    { id: "cat-2026-day-10", focus: "Review missed and skipped questions", revision: true },
  ];

  window.CAT_QUESTION_BANK = { releaseDate: "2026-11-19", sets };
})();
