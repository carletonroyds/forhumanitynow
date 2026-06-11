export const scenarioData = [
    {
        id: 1,
        situation: "Your friend suddenly stops replying to your texts.",
        options: [
            { text: "Why are they ignoring me?", type: "weak" },
            { text: "When did they stop replying, and is something happening in their life or between us?", type: "best" },
            { text: "Should I just stop texting them forever?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "This question combines the 'Details' (when it started) with 'Big Picture' (external life events or relationship context).",
        images: {
            pass1: 'assets/scenario_1_pass_1_friend_texts_anxious_night_window_cyber_skater_vibe.webp',
            pass2: 'assets/scenario_1_pass_2_friend_texts_calmer_clear_lighting_emotional_control.webp'
        }
    },
    {
        id: 2,
        situation: "You got a low grade on a test you thought you understood.",
        options: [
            { text: "Why is this teacher unfair?", type: "weak" },
            { text: "What kinds of questions did I miss, and how did I prepare compared to what the test required?", type: "best" },
            { text: "Am I just bad at this subject?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "By looking at 'Details' (specific missed questions) and the 'Big Picture' (your study habits vs. test requirements), you find a path to improve.",
        images: {
            pass1: 'assets/scenario_2_pass_1_low_grade_test_messy_desk_frustrated_neon_classroom.webp',
            pass2: 'assets/scenario_2_pass_2_low_grade_test_organized_desk_focused_thinking_calm_lighting.webp'
        }
    },
    {
        id: 3,
        situation: "Someone posts a rude comment about you online.",
        options: [
            { text: "How do I embarrass them back?", type: "weak" },
            { text: "What exactly did they say, why might they have posted it, and what response would actually help?", type: "best" },
            { text: "Why does everyone hate me?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "Separating 'Details' (the exact words) from 'Big Picture' (their motivation and the outcome of your response) prevents reactive mistakes.",
        images: {
            pass1: 'assets/scenario_3_pass_1_harsh_comment_online_tense_dark_neon_room.webp',
            pass2: 'assets/scenario_3_pass_2_harsh_comment_online_calmer_expression_reduced_noise_clearer_screen.webp'
        }
    },
    {
        id: 4,
        situation: "You’re overwhelmed with homework and activities.",
        options: [
            { text: "Why is my life impossible?", type: "weak" },
            { text: "What is due first, how long will each task take, and what matters most this week?", type: "best" },
            { text: "Should I quit everything?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "Using 'Details' (deadlines and task length) alongside 'Big Picture' (weekly priorities) clears the mental fog.",
        images: {
            pass1: 'assets/scenario_4_pass_1_overwhelmed_homework_floating_tasks_chaotic_neon_room.webp',
            pass2: 'assets/scenario_4_pass_2_overwhelmed_homework_organized_tasks_structured_calm_focus.webp'
        }
    },
    {
        id: 5,
        situation: "Your friend wants you to skip school.",
        options: [
            { text: "Would this be fun?", type: "weak" },
            { text: "What happens today if I skip, and how could that affect trust, school, and my goals?", type: "best" },
            { text: "Why do rules exist anyway?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "You look at the immediate 'Details' (today's events) and the 'Big Picture' consequences for your future goals and trust.",
        images: {
            pass1: 'assets/scenario_5_pass_1_skip_school_peer_pressure_edgy_street.webp',
            pass2: 'assets/scenario_5_pass_2_skip_school_paused_decision_thoughtful.webp'
        }
    },
    {
        id: 6,
        situation: "You hear a rumor about someone.",
        options: [
            { text: "Is this dramatic?", type: "weak" },
            { text: "What do I actually know, where did this come from, and so what if it’s false?", type: "best" },
            { text: "Should I tell more people?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "Checking 'Details' (source and facts) and 'Big Picture' (consequences of it being false) keeps you from spreading misinformation.",
        images: {
            pass1: 'assets/scenario_6_pass_1_rumor_whispering_group_noisy_social_tension.webp',
            pass2: 'assets/scenario_6_pass_2_rumor_clearer_spacing_focus_on_source_clarity.webp'
        }
    },
    {
        id: 7,
        situation: "You want to join a club but feel unsure.",
        options: [
            { text: "What if people judge me?", type: "weak" },
            { text: "What is this club like, who’s in it, and how could joining help me grow?", type: "best" },
            { text: "Should I avoid it?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "Combining 'Details' (who is in it) with 'Big Picture' (personal growth) helps you make a confident decision.",
        images: {
            pass1: 'assets/scenario_7_pass_1_club_doorway_hesitant_teen_neon_entryway.webp',
            pass2: 'assets/scenario_7_pass_2_club_doorway_brighter_inviting_confident_step.webp'
        }
    },
    {
        id: 8,
        situation: "You keep arguing with a parent.",
        options: [
            { text: "Why are they so controlling?", type: "weak" },
            { text: "What are they worried about, when do problems happen, and how could we make a plan?", type: "best" },
            { text: "How do I win?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "Understanding 'Details' (when it happens) and 'Big Picture' (their underlying worries) allows for real problem-solving.",
        images: {
            pass1: 'assets/scenario_8_pass_1_parent_argument_tense_scene_neon_home.webp',
            pass2: 'assets/scenario_8_pass_2_parent_argument_calmer_posture_balanced_tone_clarity.webp'
        }
    },
    {
        id: 9,
        situation: "You feel left out seeing friends together online.",
        options: [
            { text: "Why does nobody care about me?", type: "weak" },
            { text: "What do I actually know, how often does this happen, and what’s a better response?", type: "best" },
            { text: "Should I unfollow everyone?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "Focusing on 'Details' (frequency) and 'Big Picture' (your overall reaction) helps you ground your emotions in reality.",
        images: {
            pass1: 'assets/scenario_9_pass_1_left_out_online_isolation_phone_glow.webp',
            pass2: 'assets/scenario_9_pass_2_left_out_online_grounded_calmer_clearer_perspective.webp'
        }
    },
    {
        id: 10,
        situation: "You’re about to post something personal.",
        options: [
            { text: "Will this get attention?", type: "weak" },
            { text: "Why do I want to post this, who will see it, and how might I feel later?", type: "best" },
            { text: "Should I post now?", type: "good" }
        ],
        correctIndex: 1,
        explanation: "Thinking through 'Details' (who sees it) and 'Big Picture' (future feelings) ensures you're posting for the right reasons.",
        images: {
            pass1: 'assets/scenario_10_pass_1_posting_personal_impulsive_tension_neon_city_night.webp',
            pass2: 'assets/scenario_10_pass_2_posting_personal_paused_thoughtful_reflective_clarity.webp'
        }
    }
];
