import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Quest data for Phase 1: The Foundation (15 Quests)
const QUESTS = {
  week1: {
    phase: 'THE FOUNDATION',
    title: 'Detach',
    description: 'When you are in the middle of a problem, when you are in the heat of battle, you need to detach. Pull yourself away from the immediate situation, from the emotions, from the noise. Step back. Look around. See the battlefield from a different perspective. See it from above. Detachment is the key. Detachment allows you to see the bigger picture. It allows you to make better decisions. Relax. Look around. Make a call.',
    mission: 'Today, in your next stressful situation—a meeting, a difficult conversation, a problem—practice detachment. Mentally step outside yourself. Observe from above like you are watching a movie. See the situation clearly. Then make your decision. Record what you observed and how detachment changed your perspective.',
    lesson: `Listen up. This is about detachment. When you're in the middle of a problem, when chaos is surrounding you, when emotions are running high—that's exactly when you need to detach.

Pull yourself away from the immediate situation. Step back. Look around. See the battlefield from a different perspective. See it from above.

Detachment is not about being cold or uncaring. It's about gaining perspective. It's about seeing the bigger picture so you can make better decisions.

When you're emotionally invested in the moment, you can't see the holes in your plan. You can't see the danger you're walking into. But when you detach, suddenly everything becomes clear.

Here's your tactical mantra: Relax. Look around. Make a call.

That's it. Detach from your emotions. Observe the situation objectively. Then execute.

Now get out there and practice this. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=fgyCMAjlJQo',
    duration: 1
  },
  week2: {
    phase: 'THE FOUNDATION',
    title: 'Arrogance and Humility',
    description: 'Arrogance is a killer. It blinds you. It makes you think you know everything, that you don\'t need to listen, that you can\'t be wrong. Humility is the antidote. Humility allows you to learn, to adapt, to improve. A humble leader listens to their team, admits when they\'re wrong, and constantly seeks to get better. But don\'t confuse humility with weakness. Humility is strength. It\'s confidence without ego.',
    mission: 'Today, practice humility. Ask someone for feedback on something you\'re working on. Really listen without defending yourself. Admit when you don\'t know something. Ask questions. Record one situation where you chose humility over arrogance and what you learned from it.',
    lesson: `Arrogance will destroy you. Period. When you think you know it all, you stop learning. When you stop listening, you miss critical information. When you can't admit you're wrong, you make bad decisions that hurt your team.

Humility is the answer. But understand this: humility doesn't mean you're weak. It doesn't mean you lack confidence. True humility means you're confident enough to admit what you don't know. You're strong enough to listen to others. You're secure enough to admit mistakes.

A humble leader asks questions. They seek input from their team. They say "I don't know" when they don't know. And they say "I was wrong" when they were wrong.

That takes courage. That takes strength. That's real leadership.

Get out there and practice humility. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=ljqra3BcqWM',
    duration: 1
  },
  week3: {
    phase: 'THE FOUNDATION',
    title: 'Overstepping My Bounds',
    description: 'Know your lane. Understand your authority. Respect the chain of command. When you overstep your bounds, you undermine your leader, create confusion, and damage trust. But also know when to push back. When to question orders that don\'t make sense. The key is understanding the difference between overstepping and providing valuable input. Leaders need to create an environment where people can speak up without crossing the line.',
    mission: 'Today, identify your boundaries in your role. Where does your authority end? Where should you provide input versus making decisions? Practice staying in your lane while still contributing value. Record a situation where you successfully provided input without overstepping.',
    lesson: `Listen up. You need to know your lane. You need to understand where your authority begins and ends. When you overstep those bounds, you create problems.

Maybe you make a decision that wasn't yours to make. Maybe you countermand an order from your boss. Maybe you tell someone else's team what to do. That's overstepping. And it creates confusion, undermines leadership, and breaks trust.

But here's the thing: that doesn't mean you shut up and say nothing. You need to speak up when something doesn't make sense. You need to question orders that might be wrong. That's not overstepping—that's leadership.

The key is how you do it. You provide input. You ask questions. You make recommendations. But you respect the final decision maker. You respect the chain of command.

Know your lane. Stay in it. But don't be silent. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=PqA2c0x_m1c',
    duration: 1
  },
  week4: {
    phase: 'THE FOUNDATION',
    title: 'Extreme Ownership',
    description: 'The most fundamental principle of leadership: take ownership of everything in your world. No excuses. No blaming others. When something goes wrong, when the mission fails, when your team underperforms—that\'s on you. As the leader, you are responsible. Period. This isn\'t about taking blame for ego. It\'s about control. When you own everything, you can fix everything.',
    mission: 'Today, take extreme ownership of a problem or failure. Stop making excuses. Stop blaming circumstances or other people. Identify what YOU could have done differently. Take ownership out loud to your team or manager. Record what you took ownership of and what you\'ll do differently next time.',
    lesson: `Listen up. This is the foundation of everything. Extreme Ownership. When something goes wrong, there's only one person to blame: you. The leader.

Your team didn't execute? That's on you—you didn't train them properly. The plan failed? That's on you—you didn't plan thoroughly enough. Someone else messed up? That's on you—you didn't supervise closely enough.

No excuses. No finger pointing. No blaming circumstances or bad luck or other people. You own everything in your world. Period.

Now here's why this matters: when you own everything, you can fix everything. When you blame others, you give away your power. When you make excuses, you can't improve. But when you take ownership, you take control.

That's what leaders do. They take ownership. They take responsibility. They make it happen.

Now go out there and own it. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=ljqra3BcqWM',
    duration: 1
  },
  week5: {
    phase: 'THE FOUNDATION',
    title: 'Discipline Equals Freedom',
    description: 'This is the paradox: discipline equals freedom. The more disciplined you are, the more freedom you have. Wake up early. Work out. Stick to your schedule. Do what you know you should do. That discipline gives you control over your life. It gives you the freedom to achieve your goals. Without discipline, you\'re a slave to your impulses, your emotions, your laziness. With discipline, you\'re free.',
    mission: 'Today, execute one disciplined action you\'ve been avoiding. Wake up earlier. Complete that task you\'ve been putting off. Stick to your plan without deviation. Record what disciplined action you took and how it gave you more freedom and control.',
    lesson: `Here's the truth: discipline equals freedom. It sounds backwards, but it's real.

When you're disciplined—when you wake up early, when you work out, when you do the hard things you know you should do—you gain freedom. Freedom to pursue your goals. Freedom from chaos. Freedom from being controlled by your emotions and impulses.

But when you lack discipline? When you sleep in, skip the workout, procrastinate on the hard tasks? You're a slave. A slave to your weakness. A slave to circumstances. A slave to whatever life throws at you.

Discipline in your daily routine gives you freedom in your life. Discipline in your physical training gives you freedom in your body. Discipline in your work gives you freedom in your career.

It's hard. It requires sacrifice. But that's the path. Discipline. Equals. Freedom.

Now go do what you know you should do. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=N7FXEgFhBCQ',
    duration: 1
  },
  week6: {
    phase: 'THE FOUNDATION',
    title: 'Default Aggressive',
    description: 'In combat, we default aggressive. When things go wrong, when the situation is unclear, when you don\'t know what to do—you move forward. You take action. You seize initiative. This doesn\'t mean being reckless. It means being proactive. In life and business, the same principle applies. When you\'re uncertain, take action. Move forward. Adjust as you go. Waiting and hesitating is how you lose.',
    mission: 'Today, when faced with uncertainty or a problem, default to taking action. Don\'t wait for perfect information. Don\'t hesitate. Move forward decisively. Adjust as needed. Record one situation where you defaulted aggressive instead of waiting, and what resulted from taking action.',
    lesson: `Default aggressive. That's the mindset. When things go wrong, when you're not sure what to do, when the situation is chaos—you move forward.

You don't sit there waiting for perfect information. You don't freeze up. You don't hesitate. You take action. You seize the initiative. You press forward.

Now, this doesn't mean you're reckless. This doesn't mean you ignore reality. But it means when you're at a fork in the road and you're not sure which way to go—you pick one and you go. You make a decision and you execute.

Hesitation kills. Waiting for perfect clarity kills. Paralysis by analysis kills. What wins? Action. Aggressive action. Forward movement.

You can adjust as you go. You can adapt. But you have to move. You have to take action.

Default. Aggressive. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=0diM3vCHZJQ',
    duration: 1
  },
  week7: {
    phase: 'THE FOUNDATION',
    title: 'Adapt',
    description: 'No plan survives first contact. The enemy gets a vote. Reality doesn\'t care about your plan. So you have to adapt. You have to be flexible. You have to adjust to the situation as it unfolds. But adaptation requires a foundation. You need to understand the principles so deeply that you can adjust tactics without losing sight of the mission. Rigid adherence to a bad plan is stupid. Adaptation without understanding is chaos. Find the balance.',
    mission: 'Today, when your plan doesn\'t work, adapt. Don\'t force a bad plan. Don\'t stubbornly stick to something that isn\'t working. Adjust your approach while keeping your goal in sight. Record one situation where you had to adapt, what you changed, and whether it worked.',
    lesson: `Here's the reality: no plan survives first contact with the enemy. Things will go wrong. The situation will change. Reality will punch you in the face.

So what do you do? You adapt. You adjust. You modify your plan based on the actual situation, not the situation you hoped for.

But here's the key: you can't adapt if you don't understand the principles. If you're just following a checklist without understanding why, you can't adjust when things change. You need to know the principles so well that you can modify the tactics.

Stubborn adherence to a bad plan is stupid. It's ego. It's pride. Let it go. The plan doesn't matter. The mission matters. Adapt your plan to accomplish the mission.

But don't confuse adaptation with chaos. Don't just randomly change everything. Adapt deliberately. Assess, adjust, execute.

Stay flexible. Stay smart. Adapt. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=VQ5kP7eqNhE',
    duration: 1
  },
  week8: {
    phase: 'THE FOUNDATION',
    title: 'The Power of Relationships',
    description: 'Leadership is about relationships. You can\'t lead people you don\'t know. You can\'t influence people who don\'t trust you. Build relationships with your team. Understand what motivates them. Care about them as people, not just as workers. This isn\'t soft. This is tactical. When your team trusts you and knows you care, they\'ll run through walls for you. When they don\'t, they\'ll do the bare minimum.',
    mission: 'Today, invest in a relationship with someone on your team. Have a real conversation. Learn something about them beyond work. Show that you care. Record what you learned about this person and how it changed your understanding of them.',
    lesson: `Leadership is relationships. You can't lead people you don't know. You can't influence people who don't trust you.

So build relationships. Get to know your team. Understand what drives them. What motivates them. What they care about. And show them you care about them—not just as employees or subordinates, but as human beings.

Now, some people think this is soft. They're wrong. This is tactical. When your team knows you care about them, when they trust you, when they have a real relationship with you—they will work harder, fight harder, and perform better than any amount of rules or incentives could ever achieve.

But when they don't trust you? When they think you don't care? They'll do the minimum. They'll look for another job. They'll underperform.

Relationships are the foundation of leadership. Build them. Invest in them. Care about your people.

Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=9dqowVxN6_g',
    duration: 1
  },
  week9: {
    phase: 'THE FOUNDATION',
    title: 'Play the Game',
    description: 'There are rules. There are politics. There are systems and structures and bureaucracies. You can complain about them, or you can learn to navigate them. Playing the game doesn\'t mean compromising your values. It means understanding the terrain. It means building alliances, managing up, and knowing when to push and when to hold back. If you refuse to play the game, you limit your ability to lead and make an impact.',
    mission: 'Today, identify one "political" or bureaucratic obstacle in your organization. Instead of complaining about it, figure out how to navigate it. Build an alliance. Manage up. Play the game to advance your mission. Record what you did and whether it helped you move forward.',
    lesson: `Listen up. There are politics. There are rules. There are bureaucracies and systems and structures you don't like. That's reality. You can complain about it, or you can deal with it.

Playing the game doesn't mean being dishonest. It doesn't mean compromising your values. It means understanding the terrain you're operating in. It means building relationships with people who can help you. It means managing up—helping your boss succeed so they can help you succeed.

Some people refuse to play the game. They think they're taking the high road. But really? They're just limiting their ability to lead. They're limiting their ability to make an impact. They're giving away power.

You want to change the system? You want to make a difference? Then you have to play the game well enough to get into a position where you can make those changes.

Understand the rules. Build alliances. Navigate the politics. Win.

Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=G8gg(+)B4eMo',
    duration: 1
  },
  week10: {
    phase: 'THE FOUNDATION',
    title: 'When Is Mutiny in Order?',
    description: 'You follow orders. You support the chain of command. That\'s fundamental. But there are times—rare times—when you have to push back. When you have to question. When you have to say "no." If an order is illegal, immoral, or unethical, you don\'t follow it. If a decision will lead to disaster, you have an obligation to speak up. The key is knowing the difference between a bad decision and a catastrophic one.',
    mission: 'Today, identify your boundaries. What would make you push back on an order? What values are non-negotiable? Think through a scenario where you\'d have to stand up and say no. Record your boundaries and how you\'d handle a situation that crossed them.',
    lesson: `You follow orders. You respect the chain of command. That's fundamental. But listen carefully: there are times when you have to push back. Times when you have to question. Times when you have to refuse.

If an order is illegal, you don't follow it. If something is immoral or unethical, you don't do it. If a decision will clearly lead to disaster—catastrophic failure—you have an obligation to speak up. Strongly.

But here's the key: you better be right. You better have thought it through. You better have exhausted every other option before you mutiny.

Most of the time, you disagree and commit. Your boss makes a call you don't agree with—you execute it anyway. That's leadership. But when it crosses the line into illegal, immoral, or catastrophic territory? That's different. That's when you have to stand up.

Know your boundaries. Know your values. Know when to push back. But use that card rarely. Very rarely.

Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=E6nMqQhm6GQ',
    duration: 1
  },
  week11: {
    phase: 'THE FOUNDATION',
    title: 'Born or Made?',
    description: 'Are leaders born or made? The answer is: made. Leadership is a skill. It can be learned. It can be practiced. It can be developed. Some people have natural advantages—confidence, charisma, physical presence. But those things don\'t make you a leader. What makes you a leader is learning the principles and putting them into practice. Every day. Over and over. Leadership is built through repetition and experience.',
    mission: 'Today, work on one specific leadership skill. Practice giving clear direction. Practice listening without interrupting. Practice taking ownership. Whatever skill you need to develop—work on it deliberately. Record what skill you practiced and how you improved.',
    lesson: `Are leaders born or made? People ask me this all the time. Here's the answer: leaders are made.

Sure, some people have natural advantages. Maybe they're naturally confident. Maybe they're physically imposing. Maybe they have charisma. Fine. But those things don't make you a leader. They just give you a head start.

Leadership is a skill. And like any skill, it can be learned. It can be practiced. It can be developed. You learn the principles. You put them into practice. You make mistakes. You learn from those mistakes. You get better.

It takes time. It takes repetition. It takes experience. But anyone can do it. Anyone can become a better leader than they are today.

You're not stuck. You're not limited by your personality or your background. You can improve. You can develop. You can become the leader you need to be.

Now get out there and practice. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=X-hb2KlQ6KU',
    duration: 1
  },
  week12: {
    phase: 'THE FOUNDATION',
    title: 'Leadership and Manipulation',
    description: 'There\'s a line between leadership and manipulation. Leaders inspire people to work toward a shared goal. They\'re honest about the mission and the challenges. Manipulators deceive people to serve their own interests. They hide the truth. They exploit others. The line can be thin, but the difference is intent. Are you serving the team and the mission, or are you serving yourself? Know the difference. Don\'t cross that line.',
    mission: 'Today, examine your motivations. When you influence someone, is it for the mission and their growth, or for your own benefit? Be brutally honest with yourself. Record one situation where you influenced someone and examine whether your intent was pure.',
    lesson: `There's a line between leadership and manipulation. You need to understand this line and never cross it.

A leader influences people toward a shared mission. They're honest about what they're doing and why. They tell the truth, even when it's hard. They serve the team and the mission, not themselves.

A manipulator deceives people to serve their own interests. They hide information. They lie. They exploit people for personal gain. They serve themselves at the expense of others.

The line can be thin. You can rationalize. You can tell yourself you're doing the right thing even when you're not. That's dangerous.

So check yourself. Constantly. When you influence someone, ask: am I doing this for the mission and the team, or am I doing this for me? Am I being honest, or am I manipulating?

Be brutally honest with yourself. Don't cross that line. Don't become a manipulator.

Be a leader. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=OEqie4fYZcs',
    duration: 1
  },
  week13: {
    phase: 'THE FOUNDATION',
    title: 'Subordinate Your Ego',
    description: 'Your ego is your enemy. It makes you defensive. It makes you prideful. It makes you care more about being right than about accomplishing the mission. You have to subordinate your ego. Put the mission first. Put the team first. Your personal pride and your need to be right—those things don\'t matter. What matters is winning. What matters is accomplishing the mission. Check your ego at the door.',
    mission: 'Today, subordinate your ego. Let someone else get credit. Admit you were wrong without making excuses. Accept criticism without being defensive. Put the mission ahead of your pride. Record one situation where you subordinated your ego and what it accomplished.',
    lesson: `Your ego is the enemy. It will destroy you if you let it.

Your ego makes you defensive when someone questions you. It makes you prideful when you should be humble. It makes you care more about being right than about accomplishing the mission. It makes you take credit when you should give credit.

You have to subordinate your ego. Put it aside. It doesn't matter if you get credit. It doesn't matter if you were right and someone else was wrong. What matters is the mission. What matters is the team. What matters is winning.

When someone criticizes you, don't get defensive. Listen. Learn. When someone else has a better idea, use it. When you're wrong, admit it.

Check your ego. Subordinate it. Make it serve the mission instead of making the mission serve your ego.

That's hard. That takes humility. That takes strength. But that's what leaders do.

Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=ljqra3BcqWM',
    duration: 1
  },
  week14: {
    phase: 'THE FOUNDATION',
    title: 'Leaders Tell the Truth',
    description: 'Leaders tell the truth. Always. Even when it\'s hard. Even when it\'s uncomfortable. Even when it hurts. Your team needs to trust you, and trust is built on honesty. When you lie or sugarcoat or hide the truth, you break that trust. Tell your team what\'s really going on. Tell them the bad news. Tell them the hard truths. They can handle it. And they\'ll respect you for being honest.',
    mission: 'Today, tell a hard truth you\'ve been avoiding. Give someone honest feedback. Share bad news you\'ve been holding back. Be direct and clear. Record what truth you told and how the person responded.',
    lesson: `Leaders tell the truth. Period. Even when it's hard. Even when it's uncomfortable. Even when people don't want to hear it.

Your team needs to know what's really going on. They need to know the bad news. They need to hear the hard truths. When you sugarcoat things, when you hide information, when you lie—even little lies—you break trust. And without trust, you can't lead.

Some leaders think they're protecting their team by hiding bad news. They're wrong. Your team can handle the truth. They're tougher than you think. What they can't handle is finding out later that you lied to them.

So tell the truth. Be direct. Be clear. Don't sugarcoat. Don't spin. Don't lie.

This includes giving honest feedback. When someone is underperforming, tell them. When something isn't working, say so. The truth might sting, but it's what people need to improve.

Leaders tell the truth. Always. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=kJdXjtSnZTI',
    duration: 1
  },
  week15: {
    phase: 'THE FOUNDATION',
    title: 'Study',
    description: 'You have to study. Read books. Listen to podcasts. Learn from others who have been there before. Study military history. Study business. Study leadership. The more you learn, the more tools you have. The more situations you\'ve studied, the better prepared you are when you face something similar. Don\'t try to figure everything out on your own. Learn from others. Study constantly.',
    mission: 'Today, dedicate time to study. Read for 30 minutes. Listen to a podcast. Study a leader you admire. Take notes. Think about how you can apply what you learned. Record what you studied and one key lesson you\'re taking away.',
    lesson: `You need to study. Constantly. Read books. Listen to podcasts. Learn from people who have been there before you.

Why? Because you don't have time to make every mistake yourself. You don't have time to figure everything out through trial and error. Learn from others. Learn from their successes and their failures.

Study military history. Study business leaders. Study leadership principles. The more you study, the more tools you have in your toolbox. The more situations you've learned about, the better prepared you are when you face something similar.

This isn't optional. This is part of being a leader. You have to constantly improve. You have to constantly learn. You have to constantly get better.

So read. Listen. Study. Take notes. Think about how to apply what you learn. Then go out and execute.

Study. Every day. Good.`,
    videoUrl: 'https://www.youtube.com/watch?v=3qEdZF1RcVI',
    duration: 1
  }
}

export const useGameStore = defineStore('game', () => {
  // Profile
  const profile = ref({
    name: '',
    createdAt: null
  })

  // Progress tracking
  const currentWeek = ref(1)
  const streak = ref(0)
  const totalMedals = ref(0)
  const globalRank = ref(0)

  // Quest state
  const questStartTime = ref(null)
  const hasCompletedCurrent = ref(false)
  const lastCompletionDate = ref(null)

  // Medals and badges
  const medals = ref([])
  const badges = ref([])

  // Audio recording
  const currentRecording = ref(null)

  // Initialize from localStorage
  const initialize = () => {
    const saved = localStorage.getItem('the-path-game')
    if (saved) {
      const data = JSON.parse(saved)
      profile.value = data.profile || profile.value
      currentWeek.value = data.currentWeek || 1
      streak.value = data.streak || 0
      totalMedals.value = data.totalMedals || 0
      globalRank.value = data.globalRank || 0
      medals.value = data.medals || []
      badges.value = data.badges || []
      lastCompletionDate.value = data.lastCompletionDate || null
      questStartTime.value = data.questStartTime || null
      hasCompletedCurrent.value = data.hasCompletedCurrent || false

      // Check if streak is broken
      checkStreakIntegrity()
    }
  }

  // Save to localStorage
  const save = () => {
    const data = {
      profile: profile.value,
      currentWeek: currentWeek.value,
      streak: streak.value,
      totalMedals: totalMedals.value,
      globalRank: globalRank.value,
      medals: medals.value,
      badges: badges.value,
      lastCompletionDate: lastCompletionDate.value,
      questStartTime: questStartTime.value,
      hasCompletedCurrent: hasCompletedCurrent.value
    }
    localStorage.setItem('the-path-game', JSON.stringify(data))
  }

  // Set profile name
  const setProfile = (name) => {
    profile.value = {
      name,
      createdAt: Date.now()
    }
    questStartTime.value = Date.now()
    save()
  }

  // Get current quest
  const currentQuest = computed(() => {
    return QUESTS[`week${currentWeek.value}`] || QUESTS.week1
  })

  // Check if all quests are complete
  const allQuestsComplete = computed(() => {
    return currentWeek.value > 15
  })

  // Check if streak is broken
  const checkStreakIntegrity = () => {
    if (!lastCompletionDate.value) return false

    const lastDate = new Date(lastCompletionDate.value)
    const today = new Date()
    lastDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((today - lastDate) / (24 * 60 * 60 * 1000))

    if (daysDiff > 1) {
      // Streak broken
      return true
    }

    return false
  }

  // Complete daily quest
  const completeQuest = async (audioBlob, evaluation, feedback = null) => {
    // Save recording
    currentRecording.value = audioBlob

    // Update streak
    streak.value += 1

    // Award medal
    const medal = {
      name: currentQuest.value.title,
      questNumber: currentWeek.value,
      earnedAt: Date.now(),
      evaluation,
      feedback
    }
    medals.value.push(medal)
    totalMedals.value += 1

    // Update global rank
    globalRank.value += Math.floor(Math.random() * 10) + 5

    // Check if this completes Phase 1
    if (currentWeek.value === 15) {
      // Award final badge for completing Phase 1
      badges.value.push({
        name: 'Phase 1: The Foundation - Complete',
        phase: 1,
        earnedAt: Date.now()
      })
    }

    // Move to next quest
    currentWeek.value += 1
    hasCompletedCurrent.value = false

    // Mark as completed
    lastCompletionDate.value = Date.now()

    save()
  }

  // Break streak - reset progress
  const breakStreak = () => {
    streak.value = 0
    currentWeek.value = 1
    hasCompletedCurrent.value = false
    save()
  }

  // Reset game
  const resetGame = () => {
    localStorage.removeItem('the-path-game')
    profile.value = { name: '', createdAt: null }
    currentWeek.value = 1
    streak.value = 0
    totalMedals.value = 0
    globalRank.value = 0
    medals.value = []
    badges.value = []
    questStartTime.value = null
    lastCompletionDate.value = null
    hasCompletedCurrent.value = false
  }

  return {
    // State
    profile,
    currentWeek,
    streak,
    totalMedals,
    globalRank,
    medals,
    badges,
    questStartTime,
    hasCompletedCurrent,
    lastCompletionDate,
    currentRecording,

    // Computed
    currentQuest,
    allQuestsComplete,

    // Actions
    initialize,
    save,
    setProfile,
    completeQuest,
    breakStreak,
    checkStreakIntegrity,
    resetGame
  }
})
